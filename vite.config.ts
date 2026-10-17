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
        const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
        const isOriginLocal = origin.includes('localhost') || origin.includes('127.0.0.1');
        if (origin && host && !origin.includes(host) && !(isLocalhost && isOriginLocal)) {
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
            // Dynamically load fresh .env so modifications take effect immediately without restarting server
            const freshEnv = { ...env, ...loadEnv('', process.cwd(), '') };

            const data = JSON.parse(body || '{}');
            const { to, subject, text, html } = data;

            if (!to || !subject || (!text && !html)) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'to, subject, and text/html are required' }));
              return;
            }

            const senderEmail = freshEnv.VITE_SENDER_EMAIL || freshEnv.SMTP_USER || 'msemun26@gmail.com';
            const senderName = freshEnv.VITE_SENDER_NAME || 'MSEMUN Secretariat';
            const resendApiKey = freshEnv.RESEND_API_KEY || freshEnv.VITE_RESEND_API_KEY;

            const smtpUser =
              freshEnv.SMTP_USER ||
              freshEnv.VITE_SMTP_USER ||
              freshEnv.VITE_SENDER_EMAIL ||
              freshEnv.GMAIL_USER ||
              freshEnv.EMAIL_USER ||
              'msemun26@gmail.com';

            const rawPass =
              freshEnv.SMTP_PASS ||
              freshEnv.SMTP_PASSWORD ||
              freshEnv.VITE_SMTP_PASS ||
              freshEnv.VITE_SMTP_PASSWORD ||
              freshEnv.GMAIL_PASS ||
              freshEnv.GMAIL_APP_PASS ||
              freshEnv.GMAIL_PASSWORD ||
              freshEnv.EMAIL_PASS ||
              freshEnv.EMAIL_PASSWORD ||
              '';

            const smtpPass = rawPass ? rawPass.trim().replace(/\s+/g, '') : '';

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
              const cleanPass = smtpPass.replace(/\s+/g, '');
              const isGmail = (freshEnv.SMTP_HOST || '').includes('gmail') || smtpUser.includes('gmail.com');

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
                      host: freshEnv.SMTP_HOST || 'smtp.gmail.com',
                      port: Number(freshEnv.SMTP_PORT) || 465,
                      secure: Number(freshEnv.SMTP_PORT) === 465 || !freshEnv.SMTP_PORT,
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
