import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  User,
  Phone,
  Building,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Send,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Settings,
  RefreshCw,
  Award,
  Briefcase,
  HelpCircle,
  MessageSquare,
  Camera,
  Users,
  ChevronRight
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
import { markApplicationApproved, isApplicationApproved } from '../lib/approvalStore';
import { supabase } from '../lib/supabase';

interface ApplicationDetailModalProps {
  item: any;
  tableName?: string;
  initialTab?: 'details' | 'email';
  onClose: () => void;
  onSuccess: (updatedId: string) => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  item,
  tableName = 'registrations',
  initialTab = 'details',
  onClose,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'email'>(initialTab);

  const applicantName = item.delegation_name || item.full_name || 'Sayın Katılımcı';
  const applicantEmail = item.email || '';
  const applicantPhone = item.phone || '';
  const applicantSchool = item.school || '';
  const applicantGrade = item.grade || '';
  const applicantRole = item.app_type || 'Delege';
  const applicantCommittee =
    item.committee_preference_1 ||
    item.pref1 ||
    (item.app_type === 'Delegation' ? 'Delegasyon Grubu' : item.app_type || 'Genel Kurul');

  const approved = item.isApproved || isApplicationApproved(item.id, item.status);

  // Email state
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

  const completeApprovalFlow = async (_note: string) => {
    markApplicationApproved(item.id, applicantEmail, senderEmail);

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

    onSuccess(item.id);
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
      await completeApprovalFlow('Doğrudan API ile iletildi');
      setSentSuccess(true);
    } else if (result.notConfigured) {
      setShowConfigHelp(true);
      setStatusMessage({
        type: 'info',
        text: 'Doğrudan otomatik API gönderimi için .env dosyasında SMTP veya Resend API anahtarı tanımlanmalıdır. Aşağıdaki "Gmail ile Aç ve Gönder" tuşuna basarak resmi hesabınızdan hemen gönderebilirsiniz.'
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: `Gönderim başarısız: ${result.error || 'Bilinmeyen hata'}`
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'Delegate':
        return 'bg-[#00b4d8]/20 text-[#00b4d8] border-[#00b4d8]/40';
      case 'Delegation':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Chairboard':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Admin Staff':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Press Corps':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  // Extract Question/Answer fields for clear display
  const writtenQuestions = [
    { key: 'q_ai_suspicion', title: 'Soru: Delege Yapay Zeka Şüphesi Yönetimi' },
    { key: 'q_final_documents', title: 'Soru: Nihai Karar Metinleri Denetimi' },
    { key: 'q_directive_help', title: 'Soru: Kriz Direktif Yazım Yardımı' },
    { key: 'q_resolution_paper', title: 'Soru: Genel Kurul Karar Taslağı Zaman Yönetimi' },
    { key: 'q_disagreement', title: 'Soru: Divan İçi Usul Anlaşmazlığı Çözümü' },
    { key: 'crisis_directive', title: 'Örnek Kriz Direktifi Metni' },
    { key: 'ga_procedure', title: 'Genel Kurul Usul ve Prosedür Anlatımı' }
  ].filter(q => Boolean(item[q.key]));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-hidden animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[88vh] max-h-[88vh] flex flex-col rounded-2xl bg-[#0c0c14] border border-amber-500/30 shadow-2xl shadow-amber-500/10 overflow-hidden my-auto"
        style={{ height: '88vh', maxHeight: '88vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 md:p-6 border-b border-white/10 bg-[#10101c] shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${getBadgeStyle(item.app_type)}`}>
                  {item.app_type}
                </span>

                {approved ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <CheckCircle2 size={12} />
                    <span>Onaylandı (Mail Gönderildi)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Clock size={12} />
                    <span>Onay Bekliyor</span>
                  </span>
                )}

                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{formatDate(item.created_at)}</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight">
                {applicantName}
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              {activeTab === 'details' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('email')}
                  className="btn-primary !px-4 !py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Mail size={14} />
                  <span>Onay Maili Gönder</span>
                  <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-slate-200 transition-colors cursor-pointer"
                >
                  <FileText size={14} />
                  <span>Başvuru Formunu Gör</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Pencereyi Kapat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'details'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText size={14} />
              <span>1. Başvuru Formu & Bilgiler</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('email')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'email'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mail size={14} />
              <span>2. Onay Maili Gönder ({applicantName})</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body with Guaranteed Flex Scroll */}
        <div
          className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 md:p-7 space-y-6 text-slate-300 modal-scrollbar"
          style={{ flex: '1 1 0%', minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}
        >

          {/* ═══════════════════════════════════════════════════════════════
              TAB 1: COMPLETE APPLICATION FORM DETAILS
              ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'details' && (
            <div className="space-y-6 max-w-full min-w-0">

              {/* 1. Quick Identity & Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* Full Name */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3 min-w-0 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <User size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Katılımcı / Baş Delege</div>
                    <div className="text-white font-semibold text-sm truncate">{applicantName}</div>
                    <div className="text-[11px] text-amber-400/90">{item.app_type}</div>
                  </div>
                </div>

                {/* Email */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3 min-w-0 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400">E-posta Adresi</div>
                    <a
                      href={`mailto:${applicantEmail}`}
                      className="text-slate-200 hover:text-amber-400 hover:underline font-mono text-xs truncate block"
                      title={applicantEmail}
                    >
                      {applicantEmail || 'Belirtilmedi'}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3 min-w-0 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Phone size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Telefon Numarası</div>
                    <a
                      href={`tel:${applicantPhone}`}
                      className="text-slate-200 hover:text-amber-400 hover:underline font-mono text-xs block truncate"
                    >
                      {applicantPhone || 'Belirtilmedi'}
                    </a>
                  </div>
                </div>

                {/* School */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3 min-w-0 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Building size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Okul / Kurum</div>
                    <div className="text-white font-medium text-xs break-words">{applicantSchool || 'Belirtilmedi'}</div>
                  </div>
                </div>

                {/* Grade */}
                {applicantGrade && (
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3 min-w-0 overflow-hidden">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <GraduationCap size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-mono uppercase text-slate-400">Sınıf / Seviye</div>
                      <div className="text-white font-medium text-xs">{applicantGrade}</div>
                    </div>
                  </div>
                )}

                {/* Expected members for delegations */}
                {item.expected_members && (
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3 min-w-0 overflow-hidden">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <Users size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-mono uppercase text-slate-400">Beklenen Üye Sayısı</div>
                      <div className="text-white font-bold text-sm">{item.expected_members} Delege</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Committee Preferences (If Present) */}
              {(item.committee_preference_1 || item.pref1) && (
                <div className="p-4 rounded-xl bg-black/40 border border-amber-500/20 space-y-3 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-amber-400" />
                    <h3 className="text-xs uppercase font-mono font-bold text-amber-400">
                      Komite Tercihleri
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-lg bg-white/5 border border-amber-500/30 min-w-0 overflow-hidden">
                      <span className="text-[10px] text-amber-400 font-mono block mb-1">1. TERCİH</span>
                      <span className="font-bold text-white text-xs uppercase break-words">
                        {item.committee_preference_1 || item.pref1}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 min-w-0 overflow-hidden">
                      <span className="text-[10px] text-slate-400 font-mono block mb-1">2. TERCİH</span>
                      <span className="font-semibold text-slate-200 text-xs uppercase break-words">
                        {item.committee_preference_2 || item.pref2 || '—'}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 min-w-0 overflow-hidden">
                      <span className="text-[10px] text-slate-400 font-mono block mb-1">3. TERCİH</span>
                      <span className="font-semibold text-slate-200 text-xs uppercase break-words">
                        {item.committee_preference_3 || item.pref3 || '—'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Motivation Letter (Motivasyon Mektubu) */}
              {item.motivation_letter && (
                <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-b from-[#131320] to-[#0c0c14] border border-amber-500/30 space-y-2.5 shadow-lg min-w-0 max-w-full overflow-hidden">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-amber-400" />
                    <h3 className="text-xs uppercase font-mono font-bold text-amber-400">
                      Motivasyon Mektubu
                    </h3>
                  </div>
                  <div
                    className="p-4 rounded-lg bg-black/60 border border-white/10 text-xs text-slate-200 font-sans leading-relaxed force-break-text"
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflowWrap: 'anywhere', maxWidth: '100%' }}
                  >
                    {item.motivation_letter}
                  </div>
                </div>
              )}

              {/* 4. MUN / Organization Experience */}
              {(item.org_exp_list || item.exp_list) && (
                <div className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/10 space-y-2.5 min-w-0 max-w-full overflow-hidden">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-amber-400" />
                    <h3 className="text-xs uppercase font-mono font-bold text-amber-400">
                      {item.org_exp_list ? 'Organizasyon & Görev Deneyimi' : 'MUN Geçmişi ve Katıldığı Konferanslar'}
                    </h3>
                  </div>
                  <div
                    className="p-4 rounded-lg bg-black/60 border border-white/10 text-xs text-slate-200 font-sans leading-relaxed force-break-text"
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflowWrap: 'anywhere', maxWidth: '100%' }}
                  >
                    {item.org_exp_list || item.exp_list}
                  </div>
                </div>
              )}

              {/* 5. Written Questions & Procedures (Chairboard / Academic) */}
              {writtenQuestions.length > 0 && (
                <div className="space-y-3 min-w-0 max-w-full overflow-hidden">
                  <h3 className="text-xs uppercase font-mono font-bold text-amber-400 flex items-center gap-2">
                    <HelpCircle size={16} />
                    <span>Yazılı Sorular ve Usul Yanıtları ({writtenQuestions.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {writtenQuestions.map((q) => (
                      <div key={q.key} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 min-w-0 max-w-full overflow-hidden">
                        <div className="text-[11px] font-mono font-bold text-amber-300">
                          {q.title}
                        </div>
                        <div
                          className="p-3.5 rounded-lg bg-black/60 border border-white/5 text-xs text-slate-200 font-sans leading-relaxed force-break-text"
                          style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflowWrap: 'anywhere', maxWidth: '100%' }}
                        >
                          {String(item[q.key])}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Camera / Equipment (Press) */}
              {item.camera_model && (
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 min-w-0 max-w-full overflow-hidden">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase font-bold">
                    <Camera size={15} />
                    <span>Kamera / Fotoğraf Ekipman Modeli</span>
                  </div>
                  <div
                    className="text-xs text-white font-medium p-3 rounded-lg bg-black/60 border border-white/10 force-break-text"
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflowWrap: 'anywhere', maxWidth: '100%' }}
                  >
                    {item.camera_model}
                  </div>
                </div>
              )}

              {/* 7. Delegation Member Lists (Emails & Phones) */}
              {(item.all_emails || item.all_phones) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 min-w-0 max-w-full overflow-hidden">
                  {item.all_emails && (
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 min-w-0 overflow-hidden">
                      <div className="text-xs uppercase font-mono font-bold text-amber-400">
                        Delegasyon Üye E-postaları
                      </div>
                      <div
                        className="p-3 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-slate-300 max-h-40 overflow-y-auto modal-scrollbar force-break-text"
                        style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflowWrap: 'anywhere' }}
                      >
                        {item.all_emails}
                      </div>
                    </div>
                  )}

                  {item.all_phones && (
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 min-w-0 overflow-hidden">
                      <div className="text-xs uppercase font-mono font-bold text-amber-400">
                        Delegasyon Üye Telefonları
                      </div>
                      <div
                        className="p-3 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-slate-300 max-h-40 overflow-y-auto modal-scrollbar force-break-text"
                        style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflowWrap: 'anywhere' }}
                      >
                        {item.all_phones}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 8. References (Referanslar) */}
              {(item.references_text || item.references) && (
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 min-w-0 max-w-full overflow-hidden">
                  <h4 className="text-[11px] font-mono uppercase font-bold text-amber-400">
                    Referanslar
                  </h4>
                  <p
                    className="text-xs text-slate-200 leading-relaxed p-3 rounded-lg bg-black/60 border border-white/5 force-break-text"
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflowWrap: 'anywhere', maxWidth: '100%' }}
                  >
                    {item.references_text || item.references}
                  </p>
                </div>
              )}

              {/* 9. Additional Message / Note */}
              {item.message && (
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 min-w-0 max-w-full overflow-hidden">
                  <h4 className="text-[11px] font-mono uppercase font-bold text-amber-400">
                    Adayın Eklediği Not / Mesaj
                  </h4>
                  <p
                    className="text-xs text-slate-200 leading-relaxed p-3 rounded-lg bg-black/60 border border-white/5 force-break-text"
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflowWrap: 'anywhere', maxWidth: '100%' }}
                  >
                    {item.message}
                  </p>
                </div>
              )}

            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB 2: APPROVAL EMAIL SENDER & TEMPLATE
              ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'email' && (
            <div className="space-y-4">
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
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('details')}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white cursor-pointer"
                    >
                      ← Başvuru Formuna Dön
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-primary !px-6 !py-2 text-xs font-semibold cursor-pointer"
                    >
                      Pencereyi Kapat
                    </button>
                  </div>
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
                      rows={11}
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
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#10101c] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors cursor-pointer text-center"
          >
            Pencereyi Kapat
          </button>

          {activeTab === 'details' ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('email')}
                className="btn-primary !px-5 !py-2.5 text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Mail size={15} />
                <span>Bu Başvuruyu Onayla & Mail Gönder ({applicantName})</span>
              </button>
            </div>
          ) : !sentSuccess ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className="px-3.5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors cursor-pointer text-center"
              >
                ← Forma Dön
              </button>

              <button
                type="button"
                onClick={handleOpenGmail}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#ea4335]/20 hover:bg-[#ea4335]/30 border border-[#ea4335]/40 text-xs text-white font-medium transition-all cursor-pointer shadow-md"
                title="Google Gmail web arayüzünde konuyu ve hazırlanan şablonu açarak hemen gönderin"
              >
                <ExternalLink size={14} className="text-[#ea4335]" />
                <span>Gmail ile Aç ve Gönder</span>
              </button>

              <button
                type="button"
                onClick={handleOpenMailto}
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
              >
                <Mail size={14} />
                <span>Mail İstemcisi</span>
              </button>

              <button
                type="button"
                onClick={handleSendDirectApi}
                disabled={sending}
                className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
          ) : null}
        </div>

      </div>
    </div>
  );
};
