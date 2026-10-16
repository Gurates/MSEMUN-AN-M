import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Send,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  User,
  Settings
} from 'lucide-react';
import {
  EmailParams,
  generateTurkishTemplate,
  generateEnglishTemplate,
  generateHtmlTemplate,
  getDefaultSubject,
  getSenderEmail,
  getSenderName,
  openInGmail,
  openInMailto,
  sendEmailViaApi
} from '../lib/emailService';
import { markApplicationApproved } from '../lib/approvalStore';
import { supabase } from '../lib/supabase';

interface EmailModalProps {
  item: any;
  tableName?: string;
  onClose: () => void;
  onSuccess: (updatedId: string) => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  item,
  tableName = 'registrations',
  onClose,
  onSuccess
}) => {
  const applicantName = item.delegation_name || item.full_name || 'Sayın Katılımcı';
  const applicantEmail = item.email || '';
  const applicantRole = item.app_type || 'Delege';
  const applicantSchool = item.school || '';
  const applicantCommittee =
    item.committee_preference_1 ||
    item.pref1 ||
    (item.app_type === 'Delegation' ? 'Delegasyon Grubu' : item.app_type || 'Genel Kurul');

  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showConfigHelp, setShowConfigHelp] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  const senderEmail = getSenderEmail();
  const senderName = getSenderName();

  // Initialize or re-populate template when language changes
  useEffect(() => {
    const params: EmailParams = {
      name: applicantName,
      recipientEmail: applicantEmail,
      role: applicantRole,
      school: applicantSchool,
      committee: applicantCommittee,
      senderEmail,
      senderName
    };

    const initialSubject = language === 'tr'
      ? getDefaultSubject(applicantName, applicantRole)
      : `MSEMUN 2026 — Application Approved! (${applicantName})`;

    const initialBody = language === 'tr'
      ? generateTurkishTemplate(params)
      : generateEnglishTemplate(params);

    setSubject(initialSubject);
    setBody(initialBody);
  }, [language, applicantName, applicantEmail, applicantRole, applicantSchool, applicantCommittee, senderEmail, senderName]);

  const handleCopy = () => {
    navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenGmail = async () => {
    openInGmail(applicantEmail, subject, body);
    await completeApprovalFlow('Gmail üzerinden gönderildi');
  };

  const handleOpenMailto = async () => {
    openInMailto(applicantEmail, subject, body);
    await completeApprovalFlow('Mail istemcisi üzerinden gönderildi');
  };

  const handleSendDirectApi = async () => {
    if (!applicantEmail) {
      setStatusMessage({ type: 'error', text: 'Başvuru sahibinin e-posta adresi bulunamadı.' });
      return;
    }

    setSending(true);
    setStatusMessage(null);

    const html = generateHtmlTemplate(body, applicantName);
    const result = await sendEmailViaApi({
      to: applicantEmail,
      subject,
      text: body,
      html,
      senderEmail,
      senderName
    });

    setSending(false);

    if (result.success) {
      await completeApprovalFlow('Doğrudan API ile başarıyla gönderildi');
      setSentSuccess(true);
    } else if (result.notConfigured) {
      setShowConfigHelp(true);
      setStatusMessage({
        type: 'info',
        text: 'Doğrudan otomatik gönderim için .env dosyasında SMTP veya Resend API anahtarı tanımlanmalıdır. Aşağıdaki "Gmail ile Aç ve Gönder" tuşuna basarak hemen gönderebilirsiniz!'
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: `Gönderim başarısız: ${result.error || 'Bilinmeyen hata oluştu'}`
      });
    }
  };

  const completeApprovalFlow = async (_note: string) => {
    // 1. Mark in persistent localStorage
    markApplicationApproved(item.id, applicantEmail, senderEmail);

    // 2. Try updating Supabase database
    try {
      const resolvedTable = item._table || tableName || 'registrations';
      const { error } = await supabase
        .from(resolvedTable)
        .update({ status: 'approved' })
        .eq('id', item.id);

      if (error) {
        console.warn('Supabase status update error (saved locally):', error.message);
      }
    } catch (e) {
      console.warn('Supabase update attempt:', e);
    }

    // 3. Notify parent component to update UI state
    onSuccess(item.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-hidden animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0c0c14] border border-amber-500/30 shadow-2xl shadow-amber-500/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-white/10 bg-[#11111c] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Resmi Onay Bildirimi
                </span>
                <span className="text-xs text-slate-400 font-mono">MSEMUN '26</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif mt-0.5">
                Başvuru Onay Maili Gönder
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Kapat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">

          {sentSuccess ? (
            <div className="py-12 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Onay Maili Başarıyla İletildi!</h3>
                <p className="text-slate-300 text-xs mt-1 max-w-md">
                  <span className="text-amber-400 font-semibold">{applicantName}</span> ({applicantEmail}) adlı katılımcının onay maili gönderildi ve başvuru durumu <span className="text-emerald-400 font-semibold">Onaylandı</span> olarak kaydedildi.
                </p>
              </div>
              <button
                onClick={onClose}
                className="btn-primary !px-6 !py-2.5 text-xs font-semibold cursor-pointer"
              >
                Pencereyi Kapat
              </button>
            </div>
          ) : (
            <>
              {/* Recipient & Sender Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400 mb-1 flex items-center gap-1">
                    <User size={12} className="text-amber-400" />
                    <span>Alıcı Katılımcı</span>
                  </div>
                  <div className="font-semibold text-white truncate text-sm">{applicantName}</div>
                  <div className="text-slate-400 font-mono text-[11px] truncate">{applicantEmail}</div>
                  <div className="text-[11px] text-amber-400/90 mt-0.5">{applicantRole} • {applicantCommittee}</div>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400 mb-1 flex items-center gap-1">
                    <Mail size={12} className="text-amber-400" />
                    <span>Gönderici E-posta Adresi</span>
                  </div>
                  <div className="font-semibold text-white truncate text-sm">{senderName}</div>
                  <div className="text-amber-300 font-mono text-[11px] truncate">{senderEmail}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">.env içindeki VITE_SENDER_EMAIL</div>
                </div>
              </div>

              {/* Language / Template Tabs */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/50 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setLanguage('tr')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                      language === 'tr'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Türkçe Şablon
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                      language === 'en'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    English Template
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
                  title="Metni Kopyala"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
                </button>
              </div>

              {/* Subject Line Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono uppercase text-slate-400">
                  E-posta Konusu (Subject)
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Body Textarea with Auto-substituted Name */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono uppercase text-slate-400">
                    Hazırlanmış Şablon İçeriği (İsim otomatik yerleştirildi)
                  </label>
                  <span className="text-[10px] text-amber-400/80 font-mono">Düzenlenebilir</span>
                </div>
                <textarea
                  rows={10}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 text-xs text-slate-200 font-sans leading-relaxed focus:outline-none focus:border-amber-400 resize-y"
                />
              </div>

              {/* Status or Error Banner */}
              {statusMessage && (
                <div
                  className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                    statusMessage.type === 'error'
                      ? 'bg-red-500/15 border-red-500/30 text-red-300'
                      : statusMessage.type === 'success'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">{statusMessage.text}</div>
                </div>
              )}

              {/* Configuration Help Drawer */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfigHelp(!showConfigHelp)}
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <Settings size={12} />
                  <span>{showConfigHelp ? 'E-posta Ayarlarını Gizle' : 'E-posta Gönderim Ayarları (.env)'}</span>
                </button>

                {showConfigHelp && (
                  <div className="mt-2 p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-2 text-[11px] text-slate-300 font-mono">
                    <p className="text-amber-300 font-semibold font-sans">
                      Doğrudan Tek Tıkla Gönderim İçin .env Dosyası Ayarları:
                    </p>
                    <div className="p-2.5 rounded bg-black/80 text-slate-300 overflow-x-auto text-[10px]">
                      <div># Gönderici Bilgileri</div>
                      <div>VITE_SENDER_EMAIL={senderEmail}</div>
                      <div>VITE_SENDER_NAME={senderName}</div>
                      <div className="mt-1.5"># Yöntem A: Resend API (Ücretsiz https://resend.com)</div>
                      <div>VITE_RESEND_API_KEY=re_123456789...</div>
                      <div className="mt-1.5"># Yöntem B: Gmail SMTP (Uygulama Şifresi ile)</div>
                      <div>SMTP_HOST=smtp.gmail.com</div>
                      <div>SMTP_PORT=465</div>
                      <div>SMTP_USER=ornek@gmail.com</div>
                      <div>SMTP_PASS=xxxx xxxx xxxx xxxx</div>
                    </div>
                    <p className="text-slate-400 font-sans text-[11px]">
                      İpucu: Hiçbir ayar yapmadan da aşağıdaki <strong className="text-white">"Gmail ile Aç ve Gönder"</strong> butonuna tıklayarak doğrudan resmi Gmail hesabınız üzerinden tek tıkla gönderebilirsiniz.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

        </div>

        {/* Modal Footer / Sending Actions */}
        {!sentSuccess && (
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#11111c] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors cursor-pointer text-center"
            >
              İptal / Vazgeç
            </button>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Option 1: Gmail Web Compose (Instant, Reliable, 100% works) */}
              <button
                type="button"
                onClick={handleOpenGmail}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#ea4335]/20 hover:bg-[#ea4335]/30 border border-[#ea4335]/40 text-xs text-white font-medium transition-all cursor-pointer shadow-md"
                title="Google Gmail web arayüzünde konuyu ve hazırlanan şablonu açarak hemen gönderin"
              >
                <ExternalLink size={14} className="text-[#ea4335]" />
                <span>Gmail ile Aç ve Gönder</span>
              </button>

              {/* Option 2: Default System Mail Client (Mailto) */}
              <button
                type="button"
                onClick={handleOpenMailto}
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
                title="Outlook veya varsayılan e-posta istemcisiyle aç"
              >
                <Mail size={14} />
                <span>Mail İstemcisi</span>
              </button>

              {/* Option 3: Direct API / SMTP One-click */}
              <button
                type="button"
                onClick={handleSendDirectApi}
                disabled={sending}
                className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="SMTP veya Resend API üzerinden arka planda otomatik gönder"
              >
                {sending ? (
                  <>
                    <RefreshCw size={14} className="animate-spin text-amber-400" />
                    <span>Gönderiliyor...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Otomatik Gönder (API)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
