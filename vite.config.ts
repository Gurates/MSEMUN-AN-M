import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import nodemailer from 'nodemailer';

function emailApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'email-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/send-email', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }
        const origin = (req.headers['origin'] || req.headers['referer'] || '') as string;
        const host = (req.headers['host'] || '') as string;
        if (origin && host && !origin.includes(host)) {
          res.statusCode = 403;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Forbidden: Cross-origin relay disallowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const { to, subject, text, html } = data;

            if (!to || !subject || (!text && !html)) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'to, subject, and text/html are required' }));
              return;
            }

            const senderEmail = env.VITE_SENDER_EMAIL || env.SMTP_USER || 'secretariat@msemun.org';
            const senderName = env.VITE_SENDER_NAME || 'MSEMUN Secretariat';
            const resendApiKey = env.RESEND_API_KEY || env.VITE_RESEND_API_KEY;
            const smtpUser = env.SMTP_USER;
            const smtpPass = env.SMTP_PASS;

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
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, provider: 'resend', data: resendData }));
                return;
              } else {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, provider: 'resend', error: (resendData as any)?.message || 'Resend error' }));
                return;
              }
            }

            if (smtpUser && smtpPass) {
              const transporter = nodemailer.createTransport({
                host: env.SMTP_HOST || 'smtp.gmail.com',
                port: Number(env.SMTP_PORT) || 465,
                secure: Number(env.SMTP_PORT) === 465 || !env.SMTP_PORT,
                auth: {
                  user: smtpUser,
                  pass: smtpPass
                }
              });

              const info = await transporter.sendMail({
                from: `"${senderName}" <${smtpUser}>`,
                replyTo: senderEmail,
                to: to,
                subject: subject,
                text: text,
                html: html || (text ? text.replace(/\n/g, '<br/>') : '')
              });

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, provider: 'smtp', messageId: info.messageId }));
              return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: false,
              notConfigured: true,
              message: 'SMTP veya Resend API anahtarı .env dosyasında yapılandırılmamış.'
            }));
          } catch (err: any) {
            console.error('Error handling /api/send-email:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message || 'Internal server error' }));
          }
        });
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), emailApiPlugin(env)],
    server: {
      port: 5173,
      host: true
    }
  };
});
