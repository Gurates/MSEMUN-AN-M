import { supabase } from './supabase';

export type EmailDecision = 'approval' | 'rejection' | 'waitlist';

export interface EmailParams {
  name: string;
  recipientEmail: string;
  role?: string;
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
  decision?: EmailDecision;
}

export interface SendResult {
  success: boolean;
  notConfigured?: boolean;
  provider?: string;
  message?: string;
  error?: string;
}

export const getSenderEmail = (): string => {
  return import.meta.env.VITE_SENDER_EMAIL || 'msemun26@gmail.com';
};

export const getSenderName = (): string => {
  return import.meta.env.VITE_SENDER_NAME || 'MSEMUN Secretariat';
};

/**
 * 1. ASIL ONAY MAİLİ ŞABLONU (Approval)
 * - Katılımcı hangi pozisyona başvurduysa (Delege, Chairboard, Admin, Press vb.) o pozisyonun ONAYI olarak gider.
 */
export const generateApprovalTemplate = (params: EmailParams, isChairboard: boolean = false): string => {
  const { name, role = isChairboard ? 'Chairboard' : 'Delegate' } = params;
  const applicantName = name ? name.trim() : 'Applicant';
  const effectiveRole = isChairboard ? 'Chairboard' : role;

  return `Dear ${applicantName},

We are very pleased with your interest in being part of the MSEMUN'26. Following a long review process by our Secretariat, we are thrilled to inform you that your ${effectiveRole} application has been approved. 

To complete your registration, we kindly request a payment of ... TL to the bank account provided below until .... This fee is inclusive of the welcome pack, meals, desserts, beverages etc. 

Account Name: 
Account Holder:
IBAN:
Description: Your Name - Position - Donation
Description Example: ${applicantName} - ${effectiveRole} - Donation

After completing the payment, please reply to this email with the receipt before the deadline. Your registration will not be completed if you do not include the receipt. 
- Please be aware that all payments are non-refundable.

Should you have any questions or require further assistance, please do not hesitate to contact us.

Bade Kızılgün: +90 552 578 31 37
Lâl Çarıkoğlu: +90 532 364 70 06

Instagram: @msemun2026

Best Regards,
MSEMUN'26 Public Relations Team`;
};

/**
 * 2. CHAIRBOARD İÇİN DELEGE TEKLİFİ ŞABLONU (Chairboard başvurusu kabul edilmeyip Delege olarak katılım teklif edildiğinde)
 */
export const generateChairboardDelegateOfferTemplate = (params: EmailParams): string => {
  const { name } = params;
  const applicantName = name ? name.trim() : 'Applicant';

  return `Dear ${applicantName},

Thank you for your interest in applying for a Chairboard position at MSEMUN'26.

We regret to inform you that your Chairboard application has not been accepted following a thorough review process conducted by our Secretariat.

However, we are pleased to offer you the opportunity to participate in MSEMUN'26 as a Delegate. We would be delighted to welcome you to our conference in this capacity.

To complete your registration, we kindly request a payment of ... TL to the bank account provided below by .... This fee includes the welcome pack, meals, desserts, beverages, and other conference amenities.
Account Name:
Account Holder:
IBAN:
Description: Your Name – Delegate – Donation
Description Example: ${applicantName} – Delegate – Donation

After completing the payment, please reply to this email with the receipt attached before the deadline. Your registration will not be completed unless the receipt is submitted on time.
•Please be aware that all payments are non-refundable.

Should you have any questions or require further assistance, please do not hesitate to contact us.

Bade Kızılgün: +90 552 578 31 37
Lâl Çarıkoğlu: +90 532 364 70 06

Instagram: @msemun2026

Best Regards,
MSEMUN'26 Public Relations Team`;
};

/**
 * 3. RET MAİLİ ŞABLONU (Rejection)
 */
export const generateRejectionTemplate = (params: EmailParams): string => {
  const { name } = params;
  const applicantName = name ? name.trim() : 'Applicant';

  return `Dear ${applicantName},

Thank you for your interest in participating in MSEMUN'26.

We regret to inform you that your application for MSEMUN'26 has not been accepted following a thorough rewiev process conducted by our Secretariat.

Should you have any questions or require further assistance, please do not hesitate to contact us.

Bade Kızılgün: +90 552 578 31 37
Lâl Çarıkoğlu: +90 532 364 70 06

Instagram: @msemun2026

Best Regards,
MSEMUN'26 Public Relations Team`;
};

/**
 * 4. WAITLIST MAİLİ ŞABLONU (Waiting List)
 */
export const generateWaitlistTemplate = (params: EmailParams): string => {
  const { name, role = 'Delegate' } = params;
  const applicantName = name ? name.trim() : 'Applicant';

  return `Dear ${applicantName},

Thank you for your interest in participating in MSEMUN'26.

Following a thorough review process conducted by our Secretariat, we would like to inform you that your application has been placed on the waiting list.

Please note that if a ${role} position becomes available, we will contact you regarding the possibility of participating in MSEMUN'26.

Should you have any questions or require further assistance, please do not hesitate to contact us.

 Bade Kızılgün: +90 552 578 31 37
 Lâl Çarıkoğlu: +90 532 364 70 06

Instagram: @msemun2026

Best Regards, 
MSEMUN'26 Public Relations Team`;
};

/**
 * Karara göre varsayılan konu başlığı
 */
export const getSubjectForDecision = (
  decision: EmailDecision,
  name: string,
  role: string = 'Delegate',
  isChairboard: boolean = false
): string => {
  const safeName = name ? name.trim() : 'Applicant';
  if (decision === 'rejection') {
    return `MSEMUN'26 — Application Status (${safeName})`;
  }
  if (decision === 'waitlist') {
    return `MSEMUN'26 — Waiting List Status (${safeName})`;
  }
  const effectiveRole = isChairboard ? 'Chairboard' : role;
  return `MSEMUN'26 — ${effectiveRole} Application Approved! (${safeName})`;
};

// Geriye dönük uyumluluk takma adları
export const getDefaultSubject = (name: string, role: string = 'Delegate'): string => {
  return getSubjectForDecision('approval', name, role);
};

export const generateTurkishTemplate = (params: EmailParams): string => {
  return generateApprovalTemplate(params, params.role === 'Chairboard');
};

export const generateEnglishTemplate = (params: EmailParams): string => {
  return generateApprovalTemplate(params, params.role === 'Chairboard');
};

export const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const generateHtmlTemplate = (
  textBody: string,
  _name?: string,
  decision: EmailDecision = 'approval'
): string => {
  const safeText = escapeHtml(textBody || '');
  const formattedBody = safeText
    .replace(/\n\n/g, '</p><p style="margin: 0 0 16px 0; color: #cbd5e1; line-height: 1.65; font-size: 14px;">')
    .replace(/\n/g, '<br/>')
    .replace(/━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━/g, '<hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.15); margin: 16px 0;" />');

  const title =
    decision === 'rejection'
      ? 'Application Status'
      : decision === 'waitlist'
      ? 'Waiting List Notice'
      : 'Application Approved';

  const badgeColor =
    decision === 'rejection'
      ? 'background-color: rgba(244, 63, 94, 0.15); border: 1px solid rgba(244, 63, 94, 0.35); color: #fb7185;'
      : decision === 'waitlist'
      ? 'background-color: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.35); color: #c084fc;'
      : 'background-color: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24;';

  const borderColor =
    decision === 'rejection'
      ? 'rgba(244, 63, 94, 0.25)'
      : decision === 'waitlist'
      ? 'rgba(168, 85, 247, 0.25)'
      : 'rgba(245, 158, 11, 0.25)';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MSEMUN'26 — ${title}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #060608; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #0c0c14; border: 1px solid ${borderColor}; border-radius: 14px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
    
    <div style="background: linear-gradient(135deg, #131320 0%, #1f1b2e 100%); padding: 32px 28px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
      <div style="display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; ${badgeColor}">
        Secretariat Notice • MSEMUN '26
      </div>
      <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
        ${title}
      </h1>
      <p style="margin: 0; font-size: 13px; color: #94a3b8; font-style: italic;">
        "In the crucible of debate, the sovereign flame of peace is forged."
      </p>
    </div>

    <div style="padding: 28px 24px;">
      <p style="margin: 0 0 16px 0; color: #cbd5e1; line-height: 1.65; font-size: 14px;">
        ${formattedBody}
      </p>
    </div>

    <div style="background-color: #08080d; padding: 20px 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #64748b;">
      <p style="margin: 0 0 6px 0;">MSEMUN Model United Nations Conference • İzmir, Turkey</p>
      <p style="margin: 0;">Bu bilgilendirme e-postası resmi MSEMUN Genel Sekreterliği tarafından iletilmiştir.</p>
    </div>

  </div>
</body>
</html>`;
};

export const openInGmail = (to: string, subject: string, body: string): void => {
  const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const openInMailto = (to: string, subject: string, body: string): void => {
  const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
};

export const sendEmailViaApi = async (payload: SendEmailPayload): Promise<SendResult> => {
  const senderEmail = payload.senderEmail || getSenderEmail();
  const senderName = payload.senderName || getSenderName();

  // Retrieve current admin session JWT token
  let token = '';
  try {
    const { data: { session } } = await supabase.auth.getSession();
    token = session?.access_token || '';
  } catch (err) {
    console.warn('Could not retrieve Supabase session token:', err);
  }

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
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
    } else {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errData.error || `Sunucu hatası (${res.status})`
      };
    }
  } catch (err: any) {
    console.warn('Backend /api/send-email error:', err);
    return {
      success: false,
      error: err.message || 'E-posta servisine erişilemedi. "Gmail ile Aç" seçeneğiyle doğrudan gönderebilirsiniz.'
    };
  }
};
