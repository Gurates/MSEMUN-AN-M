import nodemailer from 'nodemailer';

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { to, subject, text, html } = data;

    if (!to || !subject || (!text && !html)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'to, subject, and text/html are required' })
      };
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const senderEmail = process.env.VITE_SENDER_EMAIL || smtpUser || 'msemun26@gmail.com';
    const senderName = process.env.VITE_SENDER_NAME || 'MSEMUN Secretariat';
    const resendApiKey = process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY;

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
          to: Array.isArray(to) ? to : [to],
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
          body: JSON.stringify({ success: false, provider: 'resend', error: (resendData as any)?.message || 'Resend error' })
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
        to: to,
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
