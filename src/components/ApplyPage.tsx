import React, { useState } from 'react';
import { 
  User, 
  Users, 
  Gavel, 
  Settings, 
  Camera, 
  CheckCircle, 
  ArrowLeft, 
  Send, 
  Shield, 
  HelpCircle,
  Bus,
  FileText
} from 'lucide-react';
import { COMMITTEES_DATA } from '../data/conferenceData';
import { PageView } from './Navbar';

type ApplicationType = 'hub' | 'delegate' | 'delegation' | 'chairboard' | 'admin' | 'press';

interface ApplyPageProps {
  initialCommitteeId?: string;
  onNavigate: (page: PageView) => void;
}

const applicationTypes = [
  {
    id: 'delegate' as ApplicationType,
    title: 'Delegate',
    subtitle: 'Individual Delegate Application',
    description: 'Represent a sovereign state or cabinet member in our specialized committees and General Assembly.',
    icon: User,
    color: '#ff6a00',
    badge: 'Open Accreditation'
  },
  {
    id: 'delegation' as ApplicationType,
    title: 'Delegation',
    subtitle: 'School & Group Delegation',
    description: 'Register your school or university cohort with an included faculty advisor pass.',
    icon: Users,
    color: '#f59e0b',
    badge: 'Group Registration'
  },
  {
    id: 'chairboard' as ApplicationType,
    title: 'Chairboard',
    subtitle: 'Academic Bureau & Crisis Directorate',
    description: 'Lead, moderate, and steer substantive crisis directives or parliamentary rules of procedure.',
    icon: Gavel,
    color: '#ec4899',
    badge: 'Leadership Role'
  },
  {
    id: 'admin' as ApplicationType,
    title: 'Admin Staff',
    subtitle: 'Logistics & Conference Operations',
    description: 'Coordinate protocol, delegate logistics, conference staging, and secretariat administration.',
    icon: Settings,
    color: '#3b82f6',
    badge: 'Operations Crew'
  },
  {
    id: 'press' as ApplicationType,
    title: 'Press Corps',
    subtitle: 'Journalism & Media Broadcast',
    description: 'Cover international flashpoints as a photojournalist, editor, or live broadcast correspondent.',
    icon: Camera,
    color: '#10b981',
    badge: 'Media Team'
  }
];

const gradeOptions = [
  { value: 'Prep', label: 'Prep / Hazırlık' },
  { value: '9th Grade', label: '9th Grade (Lise 1)' },
  { value: '10th Grade', label: '10th Grade (Lise 2)' },
  { value: '11th Grade', label: '11th Grade (Lise 3)' },
  { value: '12th Grade', label: '12th Grade (Lise 4)' },
  { value: 'University', label: 'University / Lisans' },
  { value: 'Graduate', label: 'Graduate / Yüksek Lisans' }
];

export const ApplyPage: React.FC<ApplyPageProps> = ({
  initialCommitteeId = 'unsc',
  onNavigate
}) => {
  const [activeRole, setActiveRole] = useState<ApplicationType>(
    initialCommitteeId ? 'delegate' : 'hub'
  );
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // ── Delegate State ──
  const [delegateForm, setDelegateForm] = useState({
    fullName: '',
    school: '',
    grade: '',
    email: '',
    phone: '',
    expList: '',
    committeePreference1: initialCommitteeId || 'unsc',
    committeePreference2: '',
    committeePreference3: '',
    motivationLetter: '',
    message: '',
    references: '',
    shuttle: 'no',
    accommodation: 'no'
  });

  // ── Delegation State ──
  const [delegationForm, setDelegationForm] = useState({
    fullName: '',
    school: '',
    delegationName: '',
    expectedMembers: '',
    email: '',
    phone: '',
    allEmails: '',
    allPhones: '',
    message: '',
    shuttle: 'no',
    accommodation: 'no'
  });

  // ── Chairboard State ──
  const [chairboardForm, setChairboardForm] = useState({
    fullName: '',
    school: '',
    grade: '',
    email: '',
    phone: '',
    expList: '',
    pref1: initialCommitteeId || 'unsc',
    pref2: '',
    pref3: '',
    motivationLetter: '',
    crisisDirective: '',
    gaProcedure: '',
    message: '',
    references: '',
    qAiSuspicion: '',
    qFinalDocuments: '',
    qDirectiveHelp: '',
    qDisagreement: '',
    qResolutionPaper: '',
    shuttle: 'no',
    accommodation: 'no'
  });

  // ── Admin State ──
  const [adminForm, setAdminForm] = useState({
    fullName: '',
    school: '',
    grade: '',
    email: '',
    phone: '',
    orgExpList: '',
    references: '',
    message: '',
    shuttle: 'no',
    accommodation: 'no'
  });

  // ── Press State ──
  const [pressForm, setPressForm] = useState({
    fullName: '',
    school: '',
    grade: '',
    email: '',
    phone: '',
    orgExpList: '',
    cameraModel: '',
    references: '',
    message: '',
    shuttle: 'no',
    accommodation: 'no'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Smart Committee filtering so the same committee cannot be picked twice in preferences
  const getFilteredCommittees = (selectedPref: string, otherPrefs: string[]) => {
    return COMMITTEES_DATA.map((c) => {
      const isSelectedElsewhere = otherPrefs.includes(c.id) && c.id !== selectedPref;
      return {
        id: c.id,
        name: `${c.acronym} — ${c.name}`,
        disabled: isSelectedElsewhere
      };
    });
  };

  const handleGenericSubmit = (e: React.FormEvent, validator: () => boolean) => {
    e.preventDefault();
    if (validator()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 700);
    }
  };

  // ── Validation Rules ──
  const validateDelegate = () => {
    const errs: Record<string, string> = {};
    if (!delegateForm.fullName.trim() || delegateForm.fullName.trim().length < 3) {
      errs.fullName = 'Please enter your full name (at least 3 characters).';
    }
    if (!delegateForm.school.trim()) errs.school = 'Please enter your school or university.';
    if (!delegateForm.grade) errs.grade = 'Please select your grade.';
    if (!delegateForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(delegateForm.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!delegateForm.phone.trim() || delegateForm.phone.trim().length < 7) {
      errs.phone = 'Please enter a valid phone number.';
    }
    if (!delegateForm.committeePreference1) errs.committeePreference1 = 'Please select your 1st committee choice.';
    if (!delegateForm.committeePreference2) errs.committeePreference2 = 'Please select your 2nd committee choice.';
    if (!delegateForm.committeePreference3) errs.committeePreference3 = 'Please select your 3rd committee choice.';
    if (delegateForm.motivationLetter.trim().length < 150) {
      errs.motivationLetter = `Motivation letter must be at least 150 characters (${delegateForm.motivationLetter.trim().length}/150).`;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateDelegation = () => {
    const errs: Record<string, string> = {};
    if (!delegationForm.fullName.trim()) errs.fullName = 'Full name of Head Delegate / Advisor is required.';
    if (!delegationForm.school.trim()) errs.school = 'School / Institution name is required.';
    if (!delegationForm.delegationName.trim()) errs.delegationName = 'Delegation name is required.';
    if (!delegationForm.expectedMembers.trim()) errs.expectedMembers = 'Expected number of delegates is required.';
    if (!delegationForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(delegationForm.email)) {
      errs.email = 'Please enter a valid contact email.';
    }
    if (!delegationForm.phone.trim()) errs.phone = 'Contact phone number is required.';
    if (!delegationForm.allEmails.trim()) errs.allEmails = 'Please list member emails.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateChairboard = () => {
    const errs: Record<string, string> = {};
    if (!chairboardForm.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!chairboardForm.school.trim()) errs.school = 'School is required.';
    if (!chairboardForm.grade) errs.grade = 'Grade is required.';
    if (!chairboardForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(chairboardForm.email)) {
      errs.email = 'Valid email is required.';
    }
    if (!chairboardForm.phone.trim()) errs.phone = 'Phone number is required.';
    if (!chairboardForm.pref1) errs.pref1 = '1st choice committee is required.';
    if (!chairboardForm.pref2) errs.pref2 = '2nd choice committee is required.';
    if (!chairboardForm.pref3) errs.pref3 = '3rd choice committee is required.';
    if (chairboardForm.motivationLetter.trim().length < 150) {
      errs.motivationLetter = `Motivation letter must be at least 150 characters (${chairboardForm.motivationLetter.trim().length}/150).`;
    }
    if (!chairboardForm.qAiSuspicion.trim()) errs.qAiSuspicion = 'Please answer this academic question.';
    if (!chairboardForm.qFinalDocuments.trim()) errs.qFinalDocuments = 'Please answer this question.';
    if (!chairboardForm.qDisagreement.trim()) errs.qDisagreement = 'Please answer this question.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateAdmin = () => {
    const errs: Record<string, string> = {};
    if (!adminForm.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!adminForm.school.trim()) errs.school = 'School is required.';
    if (!adminForm.grade) errs.grade = 'Grade is required.';
    if (!adminForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminForm.email)) {
      errs.email = 'Valid email is required.';
    }
    if (!adminForm.phone.trim()) errs.phone = 'Phone number is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePress = () => {
    const errs: Record<string, string> = {};
    if (!pressForm.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!pressForm.school.trim()) errs.school = 'School is required.';
    if (!pressForm.grade) errs.grade = 'Grade is required.';
    if (!pressForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pressForm.email)) {
      errs.email = 'Valid email is required.';
    }
    if (!pressForm.phone.trim()) errs.phone = 'Phone number is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ═══ SUCCESS VIEW ═══
  if (isSuccess) {
    return (
      <div className="relative pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-24 min-h-screen cinematic-grid flex items-center justify-center">
        <div className="section-container relative z-10 max-w-xl text-center px-4">
          <div className="p-8 sm:p-12 rounded-2xl bg-[#0c0c14]/95 border border-amber-500/30 backdrop-blur-xl shadow-[0_20px_70px_rgba(255,106,0,0.15)] flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-6 animate-pulse">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <span className="font-mono text-xs font-semibold text-amber-500 tracking-widest uppercase mb-2">
              ACCREDITATION SUBMITTED
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-4">
              APPLICATION RECEIVED
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mb-8">
              Thank you for submitting your official application to <strong>MSEMUN 2026</strong>. 
              Our Secretariat will review your credentials and get back to you via email within 5–7 business days.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button
                onClick={() => onNavigate('home')}
                className="btn-secondary w-full text-xs !py-3"
              >
                RETURN HOME
              </button>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setActiveRole('hub');
                }}
                className="btn-primary w-full text-xs !py-3"
              >
                SUBMIT ANOTHER
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-24 min-h-screen cinematic-grid">
      {/* Background ambient glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 90, 0, 0.08) 0%, transparent 70%)',
          filter: 'blur(90px)'
        }}
      />

      <div className="section-container relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Eyebrow & Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold text-amber-500 tracking-widest">
              03 // ACCREDITATION PORTAL
            </span>
            <span className="w-8 sm:w-12 h-[1px] bg-amber-500/30" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-slate-400 font-sans">
              XXVI EDITION
            </span>
          </div>

          {activeRole !== 'hub' && (
            <button
              onClick={() => setActiveRole('hub')}
              className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>CHOOSE DIFFERENT ROLE</span>
            </button>
          )}
        </div>

        {/* Title */}
        <div className="mb-8 sm:mb-12">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight mb-3">
            {activeRole === 'hub' && <>OFFICIAL <span className="flame-gradient-text">APPLICATION PORTAL</span></>}
            {activeRole === 'delegate' && <>DELEGATE <span className="flame-gradient-text">ACCREDITATION</span></>}
            {activeRole === 'delegation' && <>DELEGATION <span className="flame-gradient-text">REGISTRATION</span></>}
            {activeRole === 'chairboard' && <>CHAIRBOARD <span className="flame-gradient-text">APPLICATION</span></>}
            {activeRole === 'admin' && <>ADMIN STAFF <span className="flame-gradient-text">APPLICATION</span></>}
            {activeRole === 'press' && <>PRESS CORPS <span className="flame-gradient-text">APPLICATION</span></>}
          </h1>
          <p className="text-xs sm:text-base text-slate-300 font-sans leading-relaxed max-w-3xl">
            {activeRole === 'hub' && 'Select your designated conference capacity below to begin your official credentialing.'}
            {activeRole === 'delegate' && 'Represent a sovereign nation in our specialized committees and General Assembly chambers.'}
            {activeRole === 'delegation' && 'Register your school or institutional cohort with priority country matrix allocations.'}
            {activeRole === 'chairboard' && 'Lead and moderate substantive crisis directives or General Assembly proceedings.'}
            {activeRole === 'admin' && 'Assist in logistics, delegate protocol, crisis runner operations, and conference staging.'}
            {activeRole === 'press' && 'Broadcast conference resolutions, crisis reports, and photojournalism across MSEMUN media.'}
          </p>
        </div>

        {/* ═══ ROLE SELECTION HUB (ALAÇATIMUN STYLE) ═══ */}
        {activeRole === 'hub' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {applicationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  onClick={() => setActiveRole(type.id)}
                  className="group p-6 sm:p-7 rounded-2xl bg-[#0c0c14]/90 border border-white/10 hover:border-amber-500/50 hover:bg-[#121220] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl relative overflow-hidden"
                >
                  <div 
                    className="absolute top-0 left-0 w-1.5 h-full transition-all duration-300 group-hover:w-2"
                    style={{ backgroundColor: type.color }}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="p-3 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: `${type.color}15`,
                          borderColor: `${type.color}40`,
                          color: type.color
                        }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                        {type.badge}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                      {type.title}
                    </h3>
                    <span className="text-xs font-mono text-amber-500/90 block mb-2">
                      {type.subtitle}
                    </span>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {type.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-white/8 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-amber-400 transition-colors">
                    <span>START APPLICATION</span>
                    <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ 1. DELEGATE FORM ═══ */}
        {activeRole === 'delegate' && (
          <form 
            onSubmit={(e) => handleGenericSubmit(e, validateDelegate)}
            className="p-6 sm:p-10 rounded-2xl bg-[#0c0c14]/95 border border-white/10 shadow-2xl space-y-8 backdrop-blur-xl"
          >
            {/* Section 1: Personal Info */}
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/8 pb-2">
                <User className="w-5 h-5 text-amber-400" />
                <span>1. Personal & Institutional Information</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={delegateForm.fullName}
                    onChange={(e) => setDelegateForm({ ...delegateForm, fullName: e.target.value })}
                    placeholder="e.g. Alexander Hamilton"
                    className={`w-full px-4 py-3 rounded-xl bg-black/50 border text-sm text-white focus:outline-none transition-colors ${
                      errors.fullName ? 'border-red-500' : 'border-white/12 focus:border-amber-500'
                    }`}
                  />
                  {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    School / University *
                  </label>
                  <input
                    type="text"
                    value={delegateForm.school}
                    onChange={(e) => setDelegateForm({ ...delegateForm, school: e.target.value })}
                    placeholder="e.g. Istanbul High School"
                    className={`w-full px-4 py-3 rounded-xl bg-black/50 border text-sm text-white focus:outline-none transition-colors ${
                      errors.school ? 'border-red-500' : 'border-white/12 focus:border-amber-500'
                    }`}
                  />
                  {errors.school && <p className="text-[11px] text-red-400 mt-1">{errors.school}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Grade / Level *
                  </label>
                  <select
                    value={delegateForm.grade}
                    onChange={(e) => setDelegateForm({ ...delegateForm, grade: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl bg-[#0c0c14] border text-sm text-white focus:outline-none transition-colors ${
                      errors.grade ? 'border-red-500' : 'border-white/12 focus:border-amber-500'
                    }`}
                  >
                    <option value="">Select Grade Level</option>
                    {gradeOptions.map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                  {errors.grade && <p className="text-[11px] text-red-400 mt-1">{errors.grade}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={delegateForm.phone}
                    onChange={(e) => setDelegateForm({ ...delegateForm, phone: e.target.value })}
                    placeholder="+90 5XX XXX XX XX"
                    className={`w-full px-4 py-3 rounded-xl bg-black/50 border text-sm text-white focus:outline-none transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-white/12 focus:border-amber-500'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={delegateForm.email}
                    onChange={(e) => setDelegateForm({ ...delegateForm, email: e.target.value })}
                    placeholder="delegate@example.com"
                    className={`w-full px-4 py-3 rounded-xl bg-black/50 border text-sm text-white focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500' : 'border-white/12 focus:border-amber-500'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Committee Preferences */}
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/8 pb-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <span>2. Chamber Preferences</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    1st Preference *
                  </label>
                  <select
                    value={delegateForm.committeePreference1}
                    onChange={(e) => setDelegateForm({ ...delegateForm, committeePreference1: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0c14] border border-white/12 text-sm text-white focus:border-amber-500 focus:outline-none"
                  >
                    {getFilteredCommittees(delegateForm.committeePreference1, [delegateForm.committeePreference2, delegateForm.committeePreference3]).map(c => (
                      <option key={c.id} value={c.id} disabled={c.disabled}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    2nd Preference *
                  </label>
                  <select
                    value={delegateForm.committeePreference2}
                    onChange={(e) => setDelegateForm({ ...delegateForm, committeePreference2: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0c14] border border-white/12 text-sm text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="">Select 2nd Choice</option>
                    {getFilteredCommittees(delegateForm.committeePreference2, [delegateForm.committeePreference1, delegateForm.committeePreference3]).map(c => (
                      <option key={c.id} value={c.id} disabled={c.disabled}>{c.name}</option>
                    ))}
                  </select>
                  {errors.committeePreference2 && <p className="text-[11px] text-red-400 mt-1">{errors.committeePreference2}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    3rd Preference *
                  </label>
                  <select
                    value={delegateForm.committeePreference3}
                    onChange={(e) => setDelegateForm({ ...delegateForm, committeePreference3: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0c14] border border-white/12 text-sm text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="">Select 3rd Choice</option>
                    {getFilteredCommittees(delegateForm.committeePreference3, [delegateForm.committeePreference1, delegateForm.committeePreference2]).map(c => (
                      <option key={c.id} value={c.id} disabled={c.disabled}>{c.name}</option>
                    ))}
                  </select>
                  {errors.committeePreference3 && <p className="text-[11px] text-red-400 mt-1">{errors.committeePreference3}</p>}
                </div>
              </div>
            </div>

            {/* Section 3: Motivation & Experience */}
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/8 pb-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>3. Experience & Motivation Letter</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Past MUN & Debate Experience
                  </label>
                  <textarea
                    rows={3}
                    value={delegateForm.expList}
                    onChange={(e) => setDelegateForm({ ...delegateForm, expList: e.target.value })}
                    placeholder="List previous conferences, represented countries, and awards (e.g. TIMUN 2024 - France - Best Delegate)..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono text-slate-300 uppercase">
                      Motivation Letter * (Min 150 Characters)
                    </label>
                    <span className={`text-[11px] font-mono ${delegateForm.motivationLetter.length >= 150 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {delegateForm.motivationLetter.length} / 150
                    </span>
                  </div>

                  {/* Character progress bar */}
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        delegateForm.motivationLetter.length >= 150 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, (delegateForm.motivationLetter.length / 150) * 100)}%` }}
                    />
                  </div>

                  <textarea
                    rows={5}
                    value={delegateForm.motivationLetter}
                    onChange={(e) => setDelegateForm({ ...delegateForm, motivationLetter: e.target.value })}
                    placeholder="Explain your interest in MSEMUN 2026, your chosen chambers, and how your diplomatic style contributes to constructive multilateral debate..."
                    className={`w-full px-4 py-3 rounded-xl bg-black/50 border text-sm text-white focus:outline-none transition-colors ${
                      errors.motivationLetter ? 'border-red-500' : 'border-white/12 focus:border-amber-500'
                    }`}
                  />
                  {errors.motivationLetter && <p className="text-[11px] text-red-400 mt-1">{errors.motivationLetter}</p>}
                </div>
              </div>
            </div>

            {/* Section 4: Logistics & Preferences */}
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/8 pb-2">
                <Bus className="w-5 h-5 text-amber-400" />
                <span>4. Logistics & Preferences</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Shuttle Transfer Service
                  </label>
                  <select
                    value={delegateForm.shuttle}
                    onChange={(e) => setDelegateForm({ ...delegateForm, shuttle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0c14] border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="no">No, I will arrange private transit</option>
                    <option value="yes">Yes, I require conference shuttle transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Accommodation Package
                  </label>
                  <select
                    value={delegateForm.accommodation}
                    onChange={(e) => setDelegateForm({ ...delegateForm, accommodation: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0c14] border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="no">No, standard delegate pass only</option>
                    <option value="yes">Yes, include 5-star palace hotel package</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Additional Notes / References
                  </label>
                  <input
                    type="text"
                    value={delegateForm.message}
                    onChange={(e) => setDelegateForm({ ...delegateForm, message: e.target.value })}
                    placeholder="Dietary requirements, accessibility notes, or advisor contact..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-white/8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full sm:w-auto text-xs sm:text-sm !py-3.5 !px-8"
              >
                <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT DELEGATE APPLICATION'}</span>
                <Send className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </form>
        )}

        {/* ═══ 2. DELEGATION FORM ═══ */}
        {activeRole === 'delegation' && (
          <form 
            onSubmit={(e) => handleGenericSubmit(e, validateDelegation)}
            className="p-6 sm:p-10 rounded-2xl bg-[#0c0c14]/95 border border-white/10 shadow-2xl space-y-8 backdrop-blur-xl"
          >
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/8 pb-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>Delegation Head & Institution Info</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Head Delegate / Advisor Full Name *
                  </label>
                  <input
                    type="text"
                    value={delegationForm.fullName}
                    onChange={(e) => setDelegationForm({ ...delegationForm, fullName: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    School / University *
                  </label>
                  <input
                    type="text"
                    value={delegationForm.school}
                    onChange={(e) => setDelegationForm({ ...delegationForm, school: e.target.value })}
                    placeholder="Institution Name"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  {errors.school && <p className="text-[11px] text-red-400 mt-1">{errors.school}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Delegation Name *
                  </label>
                  <input
                    type="text"
                    value={delegationForm.delegationName}
                    onChange={(e) => setDelegationForm({ ...delegationForm, delegationName: e.target.value })}
                    placeholder="e.g. Robert College Delegation"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  {errors.delegationName && <p className="text-[11px] text-red-400 mt-1">{errors.delegationName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Expected Number of Delegates *
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="100"
                    value={delegationForm.expectedMembers}
                    onChange={(e) => setDelegationForm({ ...delegationForm, expectedMembers: e.target.value })}
                    placeholder="e.g. 12"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  {errors.expectedMembers && <p className="text-[11px] text-red-400 mt-1">{errors.expectedMembers}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    value={delegationForm.email}
                    onChange={(e) => setDelegationForm({ ...delegationForm, email: e.target.value })}
                    placeholder="advisor@school.edu"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    value={delegationForm.phone}
                    onChange={(e) => setDelegationForm({ ...delegationForm, phone: e.target.value })}
                    placeholder="+90 5XX XXX XX XX"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Member Lists */}
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/8 pb-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>Delegation Roster & Contacts</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    All Member Emails (One per line or comma-separated) *
                  </label>
                  <textarea
                    rows={3}
                    value={delegationForm.allEmails}
                    onChange={(e) => setDelegationForm({ ...delegationForm, allEmails: e.target.value })}
                    placeholder="student1@school.edu&#10;student2@school.edu..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  {errors.allEmails && <p className="text-[11px] text-red-400 mt-1">{errors.allEmails}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    All Member Phone Numbers
                  </label>
                  <textarea
                    rows={2}
                    value={delegationForm.allPhones}
                    onChange={(e) => setDelegationForm({ ...delegationForm, allPhones: e.target.value })}
                    placeholder="+90 5XX..., +90 5XX..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full sm:w-auto text-xs sm:text-sm !py-3.5 !px-8"
              >
                <span>{isSubmitting ? 'SUBMITTING...' : 'REGISTER DELEGATION'}</span>
                <Send className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </form>
        )}

        {/* ═══ 3. CHAIRBOARD FORM (WITH ALAÇATIMUN ACADEMIC QUESTIONS) ═══ */}
        {activeRole === 'chairboard' && (
          <form 
            onSubmit={(e) => handleGenericSubmit(e, validateChairboard)}
            className="p-6 sm:p-10 rounded-2xl bg-[#0c0c14]/95 border border-white/10 shadow-2xl space-y-8 backdrop-blur-xl"
          >
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/8 pb-2">
                <Gavel className="w-5 h-5 text-pink-400" />
                <span>1. Chairboard Applicant Information</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Full Name *</label>
                  <input
                    type="text"
                    value={chairboardForm.fullName}
                    onChange={(e) => setChairboardForm({ ...chairboardForm, fullName: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-pink-500"
                  />
                  {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">School / University *</label>
                  <input
                    type="text"
                    value={chairboardForm.school}
                    onChange={(e) => setChairboardForm({ ...chairboardForm, school: e.target.value })}
                    placeholder="School Name"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-pink-500"
                  />
                  {errors.school && <p className="text-[11px] text-red-400 mt-1">{errors.school}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Grade Level *</label>
                  <select
                    value={chairboardForm.grade}
                    onChange={(e) => setChairboardForm({ ...chairboardForm, grade: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0c14] border border-white/12 text-sm text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="">Select Grade</option>
                    {gradeOptions.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                  {errors.grade && <p className="text-[11px] text-red-400 mt-1">{errors.grade}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Phone Number *</label>
                  <input
                    type="tel"
                    value={chairboardForm.phone}
                    onChange={(e) => setChairboardForm({ ...chairboardForm, phone: e.target.value })}
                    placeholder="+90 5XX..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-pink-500"
                  />
                  {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Email Address *</label>
                  <input
                    type="email"
                    value={chairboardForm.email}
                    onChange={(e) => setChairboardForm({ ...chairboardForm, email: e.target.value })}
                    placeholder="chair@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-pink-500"
                  />
                  {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Academic Simulation Questions */}
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/8 pb-2">
                <HelpCircle className="w-5 h-5 text-pink-400" />
                <span>2. Academic & Procedural Simulation Questions</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    AI Detection & Integrity: If you suspect a delegate of using generative AI during directive / resolution drafting, how would you handle the situation? *
                  </label>
                  <textarea
                    rows={3}
                    value={chairboardForm.qAiSuspicion}
                    onChange={(e) => setChairboardForm({ ...chairboardForm, qAiSuspicion: e.target.value })}
                    placeholder="Describe your protocol for verification, academic honesty, and delegate warning..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-pink-500"
                  />
                  {errors.qAiSuspicion && <p className="text-[11px] text-red-400 mt-1">{errors.qAiSuspicion}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Resolution Quality Control: What are the fundamental pillars you require before approving a working paper to be introduced as a draft resolution? *
                  </label>
                  <textarea
                    rows={3}
                    value={chairboardForm.qFinalDocuments}
                    onChange={(e) => setChairboardForm({ ...chairboardForm, qFinalDocuments: e.target.value })}
                    placeholder="Substantive feasibility, operative clause formatting, signatory requirements..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-pink-500"
                  />
                  {errors.qFinalDocuments && <p className="text-[11px] text-red-400 mt-1">{errors.qFinalDocuments}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Caucus Conflict Management: How do you mediate severe procedural or personal deadlock between opposing blocs during unmoderated caucus? *
                  </label>
                  <textarea
                    rows={3}
                    value={chairboardForm.qDisagreement}
                    onChange={(e) => setChairboardForm({ ...chairboardForm, qDisagreement: e.target.value })}
                    placeholder="Diplomatic mediation, compromise structuring, time management..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-pink-500"
                  />
                  {errors.qDisagreement && <p className="text-[11px] text-red-400 mt-1">{errors.qDisagreement}</p>}
                </div>
              </div>
            </div>

            {/* Motivation Letter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-300 uppercase">
                  Chairboard Motivation Letter * (Min 150 Characters)
                </label>
                <span className={`text-[11px] font-mono ${chairboardForm.motivationLetter.length >= 150 ? 'text-emerald-400' : 'text-pink-400'}`}>
                  {chairboardForm.motivationLetter.length} / 150
                </span>
              </div>
              <textarea
                rows={5}
                value={chairboardForm.motivationLetter}
                onChange={(e) => setChairboardForm({ ...chairboardForm, motivationLetter: e.target.value })}
                placeholder="Explain your academic preparation, leadership philosophy, and why you are qualified to chair at MSEMUN 2026..."
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-pink-500"
              />
              {errors.motivationLetter && <p className="text-[11px] text-red-400 mt-1">{errors.motivationLetter}</p>}
            </div>

            <div className="pt-4 border-t border-white/8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full sm:w-auto text-xs sm:text-sm !py-3.5 !px-8"
              >
                <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT CHAIRBOARD APPLICATION'}</span>
                <Send className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </form>
        )}

        {/* ═══ 4. ADMIN STAFF FORM ═══ */}
        {activeRole === 'admin' && (
          <form 
            onSubmit={(e) => handleGenericSubmit(e, validateAdmin)}
            className="p-6 sm:p-10 rounded-2xl bg-[#0c0c14]/95 border border-white/10 shadow-2xl space-y-8 backdrop-blur-xl"
          >
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/8 pb-2">
                <Settings className="w-5 h-5 text-blue-400" />
                <span>Admin Staff Credentialing</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Full Name *</label>
                  <input
                    type="text"
                    value={adminForm.fullName}
                    onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">School / University *</label>
                  <input
                    type="text"
                    value={adminForm.school}
                    onChange={(e) => setAdminForm({ ...adminForm, school: e.target.value })}
                    placeholder="Institution Name"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  {errors.school && <p className="text-[11px] text-red-400 mt-1">{errors.school}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Grade Level *</label>
                  <select
                    value={adminForm.grade}
                    onChange={(e) => setAdminForm({ ...adminForm, grade: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0c14] border border-white/12 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Grade</option>
                    {gradeOptions.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                  {errors.grade && <p className="text-[11px] text-red-400 mt-1">{errors.grade}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Phone Number *</label>
                  <input
                    type="tel"
                    value={adminForm.phone}
                    onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                    placeholder="+90 5XX..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Email Address *</label>
                  <input
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    placeholder="admin@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Past Organization / Admin Experience
                  </label>
                  <textarea
                    rows={3}
                    value={adminForm.orgExpList}
                    onChange={(e) => setAdminForm({ ...adminForm, orgExpList: e.target.value })}
                    placeholder="List past MUN administrative roles, conference runner experience, or event organizing..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full sm:w-auto text-xs sm:text-sm !py-3.5 !px-8"
              >
                <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT ADMIN APPLICATION'}</span>
                <Send className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </form>
        )}

        {/* ═══ 5. PRESS CORPS FORM ═══ */}
        {activeRole === 'press' && (
          <form 
            onSubmit={(e) => handleGenericSubmit(e, validatePress)}
            className="p-6 sm:p-10 rounded-2xl bg-[#0c0c14]/95 border border-white/10 shadow-2xl space-y-8 backdrop-blur-xl"
          >
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/8 pb-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <span>Press & Media Team Application</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Full Name *</label>
                  <input
                    type="text"
                    value={pressForm.fullName}
                    onChange={(e) => setPressForm({ ...pressForm, fullName: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">School / University *</label>
                  <input
                    type="text"
                    value={pressForm.school}
                    onChange={(e) => setPressForm({ ...pressForm, school: e.target.value })}
                    placeholder="School Name"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  {errors.school && <p className="text-[11px] text-red-400 mt-1">{errors.school}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Grade Level *</label>
                  <select
                    value={pressForm.grade}
                    onChange={(e) => setPressForm({ ...pressForm, grade: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0c14] border border-white/12 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select Grade</option>
                    {gradeOptions.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                  {errors.grade && <p className="text-[11px] text-red-400 mt-1">{errors.grade}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Phone Number *</label>
                  <input
                    type="tel"
                    value={pressForm.phone}
                    onChange={(e) => setPressForm({ ...pressForm, phone: e.target.value })}
                    placeholder="+90 5XX..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Email Address *</label>
                  <input
                    type="email"
                    value={pressForm.email}
                    onChange={(e) => setPressForm({ ...pressForm, email: e.target.value })}
                    placeholder="press@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Camera / Equipment Model
                  </label>
                  <input
                    type="text"
                    value={pressForm.cameraModel}
                    onChange={(e) => setPressForm({ ...pressForm, cameraModel: e.target.value })}
                    placeholder="e.g. Sony A7 III, Canon EOS R, Nikon Z6..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Portfolio / Drive Link
                  </label>
                  <input
                    type="url"
                    value={pressForm.references}
                    onChange={(e) => setPressForm({ ...pressForm, references: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                    Past Press & Journalism Experience
                  </label>
                  <textarea
                    rows={3}
                    value={pressForm.orgExpList}
                    onChange={(e) => setPressForm({ ...pressForm, orgExpList: e.target.value })}
                    placeholder="Detail past photography, video editing, or press writing experience..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full sm:w-auto text-xs sm:text-sm !py-3.5 !px-8"
              >
                <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT PRESS APPLICATION'}</span>
                <Send className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
