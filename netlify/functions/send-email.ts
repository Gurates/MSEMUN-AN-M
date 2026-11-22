import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

type EmailEvent = {
  httpMethod: string;
  headers: Record<string, string | undefined>;
  body: string | null;
};

const applicationTables = new Set(['registrations', 'delegations', 'chairboard_apps', 'admin_apps', 'press_apps']);

export const handleEmail = async (event: EmailEvent, env: NodeJS.ProcessEnv) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // 1. Authenticate request: Caller must have a valid Supabase Auth session token
  const authHeader = (event.headers['authorization'] || event.headers['Authorization'] || '') as string;
  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Yetkisiz erişim: Bu işlem için oturum açmış yönetici yetkisi gereklidir.' })
    };
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const supabaseUrl = env.VITE_SUPABASE_URL || 'https://wqrlqoxgsutblmrnkmqi.supabase.co';
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_TZ7Wnp7TTpld6tRAt5TO4w_9_wcs-_0';
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Erişim reddedildi: Yönetici oturumu geçersiz veya süresi dolmuş.' })
    };
  }

  try {
    const { data: isAdmin, error: roleError } = await supabase.rpc('is_panel_admin');
    if (roleError || isAdmin !== true) {
      return {
        statusCode: roleError ? 503 : 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Yönetici yetkisi doğrulanamadı.' })
      };
    }

    const { applicationId, table, subject, text, html } = JSON.parse(event.body || '{}');
    if (!applicationTables.has(table) || typeof applicationId !== 'string' ||
        typeof subject !== 'string' || !subject.trim() || typeof text !== 'string' || !text.trim() ||
        (html !== undefined && typeof html !== 'string')) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Başvuru, konu ve mesaj gereklidir.' })
      };
    }

    const { data: application, error } = await supabase.from(table)
      .select('email').eq('id', applicationId).maybeSingle();
    const recipient = application?.email?.trim();
    if (error || !recipient || !/^[^\s@,;:<>()"\\]+@[^\s@,;:<>()"\\]+\.[^\s@,;:<>()"\\]+$/.test(recipient)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Başvuru alıcısı doğrulanamadı.' })
      };
    }

    const smtpUser =
      env.SMTP_USER ||
      env.VITE_SMTP_USER ||
      env.VITE_SENDER_EMAIL ||
      env.GMAIL_USER ||
      env.EMAIL_USER ||
      'msemun26@gmail.com';

    const rawPass =
      env.SMTP_PASS ||
      env.SMTP_PASSWORD ||
      env.GMAIL_PASS ||
      env.GMAIL_APP_PASS ||
      env.GMAIL_PASSWORD ||
      env.EMAIL_PASS ||
      env.EMAIL_PASSWORD ||
      '';

    const cleanPass = rawPass ? rawPass.trim().replace(/\s+/g, '') : '';
    const senderEmail = env.VITE_SENDER_EMAIL || smtpUser || 'msemun26@gmail.com';
    const senderName = env.VITE_SENDER_NAME || 'MSEMUN Secretariat';
    const resendApiKey = env.RESEND_API_KEY;

    // Option 1: Resend API
    if (resendApiKey) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `${senderName} <${senderEmail}>`,
          to: [recipient],
          subject: subject,
          text: text,
          html: html || (text ? text.replace(/\n/g, '<br/>') : '')
        })
      });

      const resendData = await resendRes.json();
      if (resendRes.ok) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: true, provider: 'resend', data: resendData })
        };
      } else {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, provider: 'resend', error: (resendData as any)?.message || 'Resend hatası' })
        };
      }
    }

    // Option 2: Gmail SMTP
    if (smtpUser && cleanPass) {
      const isGmail = (env.SMTP_HOST || '').includes('gmail') || smtpUser.includes('gmail.com');

      const transporter = nodemailer.createTransport(
        isGmail
          ? {
              service: 'gmail',
              auth: {
                user: smtpUser,
                pass: cleanPass
              }
            }
          : {
              host: env.SMTP_HOST || 'smtp.gmail.com',
              port: Number(env.SMTP_PORT) || 465,
              secure: Number(env.SMTP_PORT) === 465 || !env.SMTP_PORT,
              auth: {
                user: smtpUser,
                pass: cleanPass
              }
            }
      );

      const info = await transporter.sendMail({
        from: `"${senderName}" <${smtpUser}>`,
        replyTo: senderEmail,
        to: [recipient],
        subject: subject,
        text: text,
        html: html || (text ? text.replace(/\n/g, '<br/>') : '')
      });

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, provider: 'smtp', messageId: info.messageId })
      };
    }

    const hasUser = !!(env.SMTP_USER || env.VITE_SMTP_USER || env.VITE_SENDER_EMAIL);
    const hasPass = !!cleanPass;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        notConfigured: true,
        message: `Netlify ortamında e-posta şifresi eksik (Kullanıcı: ${hasUser ? 'Tanımlı' : 'Yok'}, Şifre: ${hasPass ? 'Tanımlı' : 'Eksik'}). Netlify -> Site configuration -> Environment variables sekmesinde SMTP_PASS veya SMTP_PASSWORD değişkeninin "Functions" kapsamında tanımlı olduğundan ve ardından "Trigger deploy" yapıldığından emin olun.`
      })
    };
  } catch (err) {
    return {
      statusCode: err instanceof SyntaxError ? 400 : 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'E-posta isteği işlenemedi.' })
    };
  }
};

export const handler = (event: EmailEvent) => handleEmail(event, process.env);
