import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

export const handler = async (event: any) => {
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
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wqrlqoxgsutblmrnkmqi.supabase.co';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_TZ7Wnp7TTpld6tRAt5TO4w_9_wcs-_0';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Erişim reddedildi: Yönetici oturumu geçersiz veya süresi dolmuş.' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { to, subject, text, html } = data;

    if (!to || !subject || (!text && !html)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'to, subject ve text/html alanları zorunludur.' })
      };
    }

    // Basic recipient email sanitization
    const recipientList = Array.isArray(to) ? to : [to];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allValid = recipientList.every((e: string) => typeof e === 'string' && emailRegex.test(e.trim()));
    if (!allValid) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Geçersiz alıcı e-posta formatı.' })
      };
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const senderEmail = process.env.VITE_SENDER_EMAIL || smtpUser || 'msemun26@gmail.com';
    const senderName = process.env.VITE_SENDER_NAME || 'MSEMUN Secretariat';
    const resendApiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;

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
          to: recipientList,
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
    if (smtpUser && smtpPass) {
      const cleanPass = smtpPass.replace(/\s+/g, '');
      const isGmail = (process.env.SMTP_HOST || '').includes('gmail') || smtpUser.includes('gmail.com');

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
              host: process.env.SMTP_HOST || 'smtp.gmail.com',
              port: Number(process.env.SMTP_PORT) || 465,
              secure: Number(process.env.SMTP_PORT) === 465 || !process.env.SMTP_PORT,
              auth: {
                user: smtpUser,
                pass: cleanPass
              }
            }
      );

      const info = await transporter.sendMail({
        from: `"${senderName}" <${smtpUser}>`,
        replyTo: senderEmail,
        to: recipientList,
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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        notConfigured: true,
        message: 'SMTP veya Resend API anahtarı Netlify Environment Variables üzerinde tanımlanmamış.'
      })
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: err.message || 'Server error' })
    };
  }
};
