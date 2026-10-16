import { CONFERENCE_INFO } from '../data/conferenceData';

export interface EmailParams {
  name: string;
  recipientEmail: string;
  role: string;
  school?: string;
  committee?: string;
  senderEmail?: string;
  senderName?: string;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  text: string;
  html: string;
  senderEmail?: string;
  senderName?: string;
}

export interface SendResult {
  success: boolean;
  notConfigured?: boolean;
  provider?: string;
  message?: string;
  error?: string;
}

export const getSenderEmail = (): string => {
  return import.meta.env.VITE_SENDER_EMAIL || 'secretariat@msemun.org';
};

export const getSenderName = (): string => {
  return import.meta.env.VITE_SENDER_NAME || 'MSEMUN Secretariat';
};

export const getDefaultSubject = (name: string, _role: string = 'Delege'): string => {
  return `MSEMUN 2026 — Başvurunuz Onaylandı! (${name})`;
};

/**
 * Pre-prepared Turkish Email Template with automatic placeholder replacement
 */
export const generateTurkishTemplate = (params: EmailParams): string => {
  const {
    name,
    role,
    school = '—',
    committee = 'Atanan Komite / Alan',
    senderEmail = getSenderEmail()
  } = params;

  return `Sayın ${name},

MSEMUN 2026 (${role}) başvurunuz Değerlendirme ve Seçici Kurulumuz tarafından titizlikle incelenmiş olup ONAYLANMIŞTIR.

Model Birleşmiş Milletler vizyonumuzu paylaşacak ve münazara masalarında küresel sorunlara diplomatik çözümler üretecek seçkin katılımcılarımız arasında yer almanızdan büyük mutluluk duyuyoruz.

BAŞVURU VE KATILIM BİLGİLERİ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Katılımcı Adı: ${name}
• Başvuru Kategorisi: ${role}
• Okul / Kurum: ${school || 'Belirtilmedi'}
• Komite / Görev Alanı: ${committee || 'Belirtilmedi'}

KONFERANS DETAYLARI:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Konferans: MSEMUN 2026 (XXVI Edition)
• Tarih: ${CONFERENCE_INFO.dates || '24 – 26 Ekim 2026'}
• Konum: ${CONFERENCE_INFO.location || 'İstanbul, Türkiye'}

ÖNEMLİ HATIRLATMALAR VE SONRAKİ ADIMLAR:
1. Komite çalışma kılavuzları (Study Guides), prosedür rehberi ve pozisyon belgesi (Position Paper) teslim tarihleri önümüzdeki günlerde bu e-posta adresi üzerinden paylaşılacaktır.
2. Konferans hazırlık sürecinde delegasyon bilgilendirme duyuruları için e-posta kutunuzu ve web sitemizi düzenli kontrol etmenizi tavsiye ederiz.
3. Her türlü soru, geri bildirim veya komite danışma talebiniz için doğrudan bu e-postayı yanıtlayabilir ya da ${senderEmail} adresinden bizimle iletişime geçebilirsiniz.

MSEMUN 2026'da diplomasi meşalesini birlikte yakmak dileğiyle!

Saygılarımızla,
MSEMUN 2026 Genel Sekreterliği & Organizasyon Komitesi
E-posta: ${senderEmail}
Web: https://msemun.org`;
};

/**
 * Pre-prepared English Email Template
 */
export const generateEnglishTemplate = (params: EmailParams): string => {
  const {
    name,
    role,
    school = '—',
    committee = 'Allocated Committee',
    senderEmail = getSenderEmail()
  } = params;

  return `Dear ${name},

We are pleased to inform you that your application for MSEMUN 2026 (${role}) has been reviewed by the Executive Committee and officially APPROVED.

We are honored to welcome you as a distinguished participant in this year's conference, where the sovereign flame of peace and diplomacy is forged.

APPLICATION & PARTICIPATION DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Participant: ${name}
• Role / Category: ${role}
• School / Institution: ${school || 'N/A'}
• Committee / Chamber: ${committee || 'N/A'}

CONFERENCE LOGISTICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Conference: MSEMUN 2026 (XXVI Edition)
• Dates: ${CONFERENCE_INFO.dates || 'October 24 – 26, 2026'}
• Venue: ${CONFERENCE_INFO.location || 'The Imperial Congress Palace, Istanbul'}

NEXT STEPS & PREPARATION:
1. Committee Study Guides, Rules of Procedure (RoP), and Position Paper submission deadlines will be distributed via this email address.
2. Please check your inbox and our official conference portal regularly for logistical and preparatory announcements.
3. For inquiries, committee changes, or assistance, reply to this email or reach us at ${senderEmail}.

Welcome to the MSEMUN 2026 family!

Warm regards,
MSEMUN 2026 Secretariat & Organizing Committee
Email: ${senderEmail}
Web: https://msemun.org`;
};

export const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Generates responsive, executive-styled HTML email matching MSEMUN's visual theme
 */
export const generateHtmlTemplate = (textBody: string, _name?: string): string => {
  const safeText = escapeHtml(textBody || '');
  const formattedBody = safeText
    .replace(/\n\n/g, '</p><p style="margin: 0 0 16px 0; color: #cbd5e1; line-height: 1.65; font-size: 14px;">')
    .replace(/\n/g, '<br/>')
    .replace(/━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━/g, '<hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.15); margin: 16px 0;" />');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MSEMUN 2026 Başvuru Onayı</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #060608; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #0c0c14; border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 14px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #131320 0%, #1f1b2e 100%); padding: 32px 28px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
      <div style="display: inline-block; padding: 4px 12px; background-color: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 20px; color: #fbbf24; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px;">
        Secretariat Notice • MSEMUN '26
      </div>
      <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
        Başvurunuz Onaylandı
      </h1>
      <p style="margin: 0; font-size: 13px; color: #94a3b8; font-style: italic;">
        "In the crucible of debate, the sovereign flame of peace is forged."
      </p>
    </div>

    <!-- Content Body -->
    <div style="padding: 28px 24px;">
      <p style="margin: 0 0 16px 0; color: #cbd5e1; line-height: 1.65; font-size: 14px;">
        ${formattedBody}
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #08080d; padding: 20px 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #64748b;">
      <p style="margin: 0 0 6px 0;">MSEMUN Model United Nations Conference • Istanbul, Turkey</p>
      <p style="margin: 0;">Bu bilgilendirme e-postası resmi MSEMUN Genel Sekreterliği tarafından iletilmiştir.</p>
    </div>

  </div>
</body>
</html>`;
};

/**
 * 1-Click Launch: Open in Google Gmail Web
 */
export const openInGmail = (to: string, subject: string, body: string): void => {
  const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * 1-Click Launch: Open default system mail client (Outlook, Apple Mail, etc.)
 */
export const openInMailto = (to: string, subject: string, body: string): void => {
  const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
};

/**
 * Send email through backend API (/api/send-email) or fallback to direct client Resend
 */
export const sendEmailViaApi = async (payload: SendEmailPayload): Promise<SendResult> => {
  const senderEmail = payload.senderEmail || getSenderEmail();
  const senderName = payload.senderName || getSenderName();

  // 1. Try Vite dev server / production API endpoint
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...payload,
        senderEmail,
        senderName
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return { success: true, provider: data.provider, message: 'E-posta başarıyla gönderildi!' };
      }
      if (data.notConfigured) {
        return { success: false, notConfigured: true, message: data.message };
      }
      return { success: false, error: data.error || 'Gönderim başarısız oldu' };
    }
  } catch (err) {
    console.warn('Backend /api/send-email not accessible, trying client direct check...', err);
  }

  // 2. Direct Resend API fallback if VITE_RESEND_API_KEY is available directly in frontend
  const clientResendKey = import.meta.env.VITE_RESEND_API_KEY;
  if (clientResendKey) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${clientResendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `${senderName} <${senderEmail}>`,
          to: [payload.to],
          subject: payload.subject,
          text: payload.text,
          html: payload.html
        })
      });

      if (resendRes.ok) {
        return { success: true, provider: 'resend-direct', message: 'E-posta Resend üzerinden iletildi!' };
      } else {
        const errJson = await resendRes.json();
        return { success: false, error: errJson.message || 'Resend API hata verdi' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Resend bağlantı hatası' };
    }
  }

  return {
    success: false,
    notConfigured: true,
    message: 'E-posta servisi (SMTP veya Resend) henüz yapılandırılmamış. Gmail ile tek tıkla açıp gönderebilirsiniz.'
  };
};
