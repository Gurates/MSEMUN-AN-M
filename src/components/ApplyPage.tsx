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
    description: 'Represent a nation in committee',
    icon: User,
    color: '#00b4d8' // Cyan (AlaçatıMUN style)
  },
  {
    id: 'delegation' as ApplicationType,
    title: 'Delegation',
    description: 'Register your school as a group',
    icon: Users,
    color: '#ffffff' // White
  },
  {
    id: 'chairboard' as ApplicationType,
    title: 'Chairboard',
    description: 'Lead and moderate a committee',
    icon: Gavel,
    color: '#f59e0b' // Yellow / Amber
  },
  {
    id: 'admin' as ApplicationType,
    title: 'Admin Staff',
    description: 'Help organise the conference',
    icon: Settings,
    color: '#00b4d8' // Cyan
  },
  {
    id: 'press' as ApplicationType,
    title: 'Press',
    description: 'Cover the event as journalist or photographer',
    icon: Camera,
    color: '#ffffff' // White
  }
];

const gradeOptions = [
  { value: 'Prep', label: 'Prep' },
  { value: '9th Grade', label: '9th Grade' },
  { value: '10th Grade', label: '10th Grade' },
  { value: '11th Grade', label: '11th Grade' },
  { value: '12th Grade', label: '12th Grade' },
  { value: 'University', label: 'University' },
  { value: 'Graduate', label: 'Graduate' }
];

export const ApplyPage: React.FC<ApplyPageProps> = ({
  initialCommitteeId,
  onNavigate
}) => {
  // Always open on Role Selection Hub when visiting Apply page
  const [activeRole, setActiveRole] = useState<ApplicationType>('hub');
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
    shuttle: '',
    accommodation: ''
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
    shuttle: '',
    accommodation: ''
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
    shuttle: '',
    accommodation: ''
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
    shuttle: '',
    accommodation: ''
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
    shuttle: '',
    accommodation: ''
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
      }, 600);
    }
  };

  // ── Validation Rules ──
  const validateDelegate = () => {
    const errs: Record<string, string> = {};
    if (!delegateForm.fullName.trim() || delegateForm.fullName.trim().length < 3) {
      errs.fullName = 'Please enter your full name (at least 3 characters).';
    }
    if (!delegateForm.school.trim()) errs.school = 'Please enter your school or institution.';
    if (!delegateForm.grade) errs.grade = 'Please select your grade.';
    if (!delegateForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(delegateForm.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!delegateForm.phone.trim() || delegateForm.phone.trim().length < 7) {
      errs.phone = 'Please enter a valid phone number (at least 7 digits).';
    }
    if (!delegateForm.committeePreference1) errs.committeePreference1 = 'Please select your 1st committee preference.';
    if (!delegateForm.committeePreference2) errs.committeePreference2 = 'Please select your 2nd committee preference.';
    if (!delegateForm.committeePreference3) errs.committeePreference3 = 'Please select your 3rd committee preference.';
    if (delegateForm.motivationLetter.trim().length < 150) {
      errs.motivationLetter = `Motivation letter must be at least 150 characters. (${delegateForm.motivationLetter.trim().length}/150)`;
    }
    if (!delegateForm.shuttle) errs.shuttle = 'Please select your shuttle preference.';
    if (!delegateForm.accommodation) errs.accommodation = 'Please select your accommodation preference.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateDelegation = () => {
    const errs: Record<string, string> = {};
    if (!delegationForm.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!delegationForm.school.trim()) errs.school = 'School is required.';
    if (!delegationForm.delegationName.trim()) errs.delegationName = 'Delegation name is required.';
    if (!delegationForm.expectedMembers.trim()) errs.expectedMembers = 'Expected members is required.';
    if (!delegationForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(delegationForm.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!delegationForm.phone.trim()) errs.phone = 'Phone number is required.';
    if (!delegationForm.allEmails.trim()) errs.allEmails = 'All member emails are required.';
    if (!delegationForm.allPhones.trim()) errs.allPhones = 'All member phones are required.';
    if (!delegationForm.shuttle) errs.shuttle = 'Please select your shuttle preference.';
    if (!delegationForm.accommodation) errs.accommodation = 'Please select your accommodation preference.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateChairboard = () => {
    const errs: Record<string, string> = {};
    if (!chairboardForm.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!chairboardForm.school.trim()) errs.school = 'School is required.';
    if (!chairboardForm.grade) errs.grade = 'Grade is required.';
    if (!chairboardForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(chairboardForm.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!chairboardForm.phone.trim()) errs.phone = 'Phone number is required.';
    if (!chairboardForm.pref1) errs.pref1 = '1st choice is required.';
    if (!chairboardForm.pref2) errs.pref2 = '2nd choice is required.';
    if (!chairboardForm.pref3) errs.pref3 = '3rd choice is required.';
    if (chairboardForm.motivationLetter.trim().length < 150) {
      errs.motivationLetter = `Motivation letter must be at least 150 characters. (${chairboardForm.motivationLetter.trim().length}/150)`;
    }
    if (!chairboardForm.qAiSuspicion.trim()) errs.qAiSuspicion = 'Please answer this question.';
    if (!chairboardForm.qFinalDocuments.trim()) errs.qFinalDocuments = 'Please answer this question.';
    if (!chairboardForm.qDisagreement.trim()) errs.qDisagreement = 'Please answer this question.';
    if (!chairboardForm.shuttle) errs.shuttle = 'Please select your shuttle preference.';
    if (!chairboardForm.accommodation) errs.accommodation = 'Please select your accommodation preference.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateAdmin = () => {
    const errs: Record<string, string> = {};
    if (!adminForm.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!adminForm.school.trim()) errs.school = 'School is required.';
    if (!adminForm.grade) errs.grade = 'Grade is required.';
    if (!adminForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminForm.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!adminForm.phone.trim()) errs.phone = 'Phone number is required.';
    if (!adminForm.shuttle) errs.shuttle = 'Please select your shuttle preference.';
    if (!adminForm.accommodation) errs.accommodation = 'Please select your accommodation preference.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePress = () => {
    const errs: Record<string, string> = {};
    if (!pressForm.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!pressForm.school.trim()) errs.school = 'School is required.';
    if (!pressForm.grade) errs.grade = 'Grade is required.';
    if (!pressForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pressForm.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!pressForm.phone.trim()) errs.phone = 'Phone number is required.';
    if (!pressForm.shuttle) errs.shuttle = 'Please select your shuttle preference.';
    if (!pressForm.accommodation) errs.accommodation = 'Please select your accommodation preference.';
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

      <div className="section-container relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* ═══ ROLE SELECTION HUB (EXACT ALAÇATIMUN LAYOUT) ═══ */}
        {activeRole === 'hub' && (
          <div className="w-full flex flex-col items-center">
            
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12 max-w-xl mx-auto">
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
                Apply
              </h1>
              <p className="text-xs sm:text-base text-slate-400 font-sans leading-relaxed">
                Choose your role and submit your application. We look forward to seeing you.
              </p>
            </div>

            {/* 2-Column Grid Selection matching screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full max-w-3xl">
              {applicationTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    onClick={() => {
                      setActiveRole(type.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group relative flex items-start gap-4 p-5 sm:p-6 rounded-xl bg-[#0e0e16]/90 border border-white/10 hover:border-white/25 hover:bg-[#131320] transition-all duration-300 cursor-pointer shadow-lg overflow-hidden"
                  >
                    {/* Left Accent Line on Hover */}
                    <div 
                      className="absolute left-0 top-3 bottom-3 w-1 rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ backgroundColor: type.color }}
                    />

                    {/* Icon */}
                    <div 
                      className="shrink-0 mt-0.5"
                      style={{ color: type.color }}
                    >
                      <Icon size={24} />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col">
                      <h3 
                        className="text-base sm:text-lg font-bold font-sans mb-1 transition-colors"
                        style={{ color: type.color }}
                      >
                        {type.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ═══ INDIVIDUAL REGISTRATION PAGES ═══ */}
        {activeRole !== 'hub' && (
          <div>
            {/* Top Back Button */}
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveRole('hub');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-lg border border-white/10 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK TO ROLES</span>
              </button>

              <span className="font-mono text-xs text-slate-400 uppercase">
                MSEMUN 2026 // {activeRole.toUpperCase()}
              </span>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-2">
                {activeRole === 'delegate' && 'Delegate Registration'}
                {activeRole === 'delegation' && 'Delegation Registration'}
                {activeRole === 'chairboard' && 'Chairboard Registration'}
                {activeRole === 'admin' && 'Admin Staff Registration'}
                {activeRole === 'press' && 'Press Corps Registration'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-sans">
                {activeRole === 'delegate' && 'Fill out your individual delegate accreditation and committee preferences.'}
                {activeRole === 'delegation' && 'Register your school or institutional cohort with priority matrix allocation.'}
                {activeRole === 'chairboard' && 'Lead and moderate substantive crisis directives or General Assembly proceedings.'}
                {activeRole === 'admin' && 'Coordinate protocol, delegate logistics, conference staging, and secretariat administration.'}
                {activeRole === 'press' && 'Cover the event as a journalist, photographer, or live broadcast correspondent.'}
              </p>
            </div>

            {/* ═══ 1. DELEGATE FORM ═══ */}
            {activeRole === 'delegate' && (
              <form 
                onSubmit={(e) => handleGenericSubmit(e, validateDelegate)}
                className="p-6 sm:p-10 rounded-2xl bg-[#0c0c14]/95 border border-white/10 shadow-2xl space-y-8 backdrop-blur-xl"
              >
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/8 pb-2">
                    <User className="w-5 h-5 text-amber-400" />
                    <span>Personal & Educational Information</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Full Name *</label>
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
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">School / Institution *</label>
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
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Grade *</label>
                      <select
                        value={delegateForm.grade}
                        onChange={(e) => setDelegateForm({ ...delegateForm, grade: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-[#0c0c14] border text-sm text-white focus:outline-none transition-colors ${
                          errors.grade ? 'border-red-500' : 'border-white/12 focus:border-amber-500'
                        }`}
                      >
                        <option value="">Select Grade</option>
                        {gradeOptions.map(g => (
                          <option key={g.value} value={g.value}>{g.label}</option>
                        ))}
                      </select>
                      {errors.grade && <p className="text-[11px] text-red-400 mt-1">{errors.grade}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Phone *</label>
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
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Email *</label>
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

                {/* Committee Preferences */}
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/8 pb-2">
                    <Shield className="w-5 h-5 text-amber-400" />
                    <span>Committee Preferences</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">1st Preference *</label>
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
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">2nd Preference *</label>
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
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">3rd Preference *</label>
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

                {/* Experience & Motivation */}
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/8 pb-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <span>Experience & Motivation</span>
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                        MUN Experience List
                      </label>
                      <textarea
                        rows={3}
                        value={delegateForm.expList}
                        onChange={(e) => setDelegateForm({ ...delegateForm, expList: e.target.value })}
                        placeholder="List your previous MUN experiences..."
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
                        placeholder="Write your motivation letter here..."
                        className={`w-full px-4 py-3 rounded-xl bg-black/50 border text-sm text-white focus:outline-none transition-colors ${
                          errors.motivationLetter ? 'border-red-500' : 'border-white/12 focus:border-amber-500'
                        }`}
                      />
                      {errors.motivationLetter && <p className="text-[11px] text-red-400 mt-1">{errors.motivationLetter}</p>}
                    </div>
                  </div>
                </div>

                {/* Logistics */}
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/8 pb-2">
                    <Bus className="w-5 h-5 text-amber-400" />
                    <span>Logistics & Options</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Shuttle Preference *</label>
                      <select
                        value={delegateForm.shuttle}
                        onChange={(e) => setDelegateForm({ ...delegateForm, shuttle: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-[#0c0c14] border text-sm text-white focus:outline-none transition-colors ${
                          errors.shuttle ? 'border-red-500' : 'border-white/12 focus:border-amber-500'
                        }`}
                      >
                        <option value="">Select Option</option>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                      {errors.shuttle && <p className="text-[11px] text-red-400 mt-1">{errors.shuttle}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Accommodation Preference *</label>
                      <select
                        value={delegateForm.accommodation}
                        onChange={(e) => setDelegateForm({ ...delegateForm, accommodation: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-[#0c0c14] border text-sm text-white focus:outline-none transition-colors ${
                          errors.accommodation ? 'border-red-500' : 'border-white/12 focus:border-amber-500'
                        }`}
                      >
                        <option value="">Select Option</option>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                      {errors.accommodation && <p className="text-[11px] text-red-400 mt-1">{errors.accommodation}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Message / Notes</label>
                      <input
                        type="text"
                        value={delegateForm.message}
                        onChange={(e) => setDelegateForm({ ...delegateForm, message: e.target.value })}
                        placeholder="Any additional notes or requests..."
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
                    <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}</span>
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
                    <span>Delegation Details</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Full Name *</label>
                      <input
                        type="text"
                        value={delegationForm.fullName}
                        onChange={(e) => setDelegationForm({ ...delegationForm, fullName: e.target.value })}
                        placeholder="Head Delegate / Advisor Name"
                        className={`w-full px-4 py-3 rounded-xl bg-black/50 border text-sm text-white focus:outline-none ${errors.fullName ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                      />
                      {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">School *</label>
                      <input
                        type="text"
                        value={delegationForm.school}
                        onChange={(e) => setDelegationForm({ ...delegationForm, school: e.target.value })}
                        placeholder="School Name"
                        className={`w-full px-4 py-3 rounded-xl bg-black/50 border text-sm text-white focus:outline-none ${errors.school ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                      />
                      {errors.school && <p className="text-[11px] text-red-400 mt-1">{errors.school}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Delegation Name *</label>
                      <input
                        type="text"
                        value={delegationForm.delegationName}
                        onChange={(e) => setDelegationForm({ ...delegationForm, delegationName: e.target.value })}
                        placeholder="Delegation Name"
                        className={`w-full px-4 py-3 rounded-xl bg-black/50 border text-sm text-white focus:outline-none ${errors.delegationName ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                      />
                      {errors.delegationName && <p className="text-[11px] text-red-400 mt-1">{errors.delegationName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Expected Members *</label>
                      <input
                        type="number"
                        min="2"
                        value={delegationForm.expectedMembers}
                        onChange={(e) => setDelegationForm({ ...delegationForm, expectedMembers: e.target.value })}
                        placeholder="e.g. 10"
                        className={`w-full px-4 py-3 rounded-xl bg-black/50 border text-sm text-white focus:outline-none ${errors.expectedMembers ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                      />
                      {errors.expectedMembers && <p className="text-[11px] text-red-400 mt-1">{errors.expectedMembers}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Email *</label>
                      <input
                        type="email"
                        value={delegationForm.email}
                        onChange={(e) => setDelegationForm({ ...delegationForm, email: e.target.value })}
                        placeholder="advisor@school.edu"
                        className={`w-full px-4 py-3 rounded-xl bg-black/50 border text-sm text-white focus:outline-none ${errors.email ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                      />
                      {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Phone *</label>
                      <input
                        type="tel"
                        value={delegationForm.phone}
                        onChange={(e) => setDelegationForm({ ...delegationForm, phone: e.target.value })}
                        placeholder="+90 5XX..."
                        className={`w-full px-4 py-3 rounded-xl bg-black/50 border text-sm text-white focus:outline-none ${errors.phone ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                      />
                      {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Member Details */}
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/8 pb-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <span>Member Contacts</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">All Member Emails *</label>
                      <textarea
                        rows={3}
                        value={delegationForm.allEmails}
                        onChange={(e) => setDelegationForm({ ...delegationForm, allEmails: e.target.value })}
                        placeholder="List all member emails..."
                        className={`w-full px-4 py-3 rounded-xl bg-black/50 border text-sm text-white focus:outline-none ${errors.allEmails ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                      />
                      {errors.allEmails && <p className="text-[11px] text-red-400 mt-1">{errors.allEmails}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">All Member Phone Numbers *</label>
                      <textarea
                        rows={2}
                        value={delegationForm.allPhones}
                        onChange={(e) => setDelegationForm({ ...delegationForm, allPhones: e.target.value })}
                        placeholder="List all member phone numbers..."
                        className={`w-full px-4 py-3 rounded-xl bg-black/50 border text-sm text-white focus:outline-none ${errors.allPhones ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                      />
                      {errors.allPhones && <p className="text-[11px] text-red-400 mt-1">{errors.allPhones}</p>}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full sm:w-auto text-xs sm:text-sm !py-3.5 !px-8"
                  >
                    <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT DELEGATION'}</span>
                    <Send className="w-4 h-4 ml-1.5" />
                  </button>
                </div>
              </form>
            )}

            {/* ═══ 3. CHAIRBOARD FORM (ALAÇATIMUN EXACT QUESTIONS) ═══ */}
            {activeRole === 'chairboard' && (
              <form 
                onSubmit={(e) => handleGenericSubmit(e, validateChairboard)}
                className="p-6 sm:p-10 rounded-2xl bg-[#0c0c14]/95 border border-white/10 shadow-2xl space-y-8 backdrop-blur-xl"
              >
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/8 pb-2">
                    <Gavel className="w-5 h-5 text-amber-400" />
                    <span>Personal Information</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Full Name *</label>
                      <input
                        type="text"
                        value={chairboardForm.fullName}
                        onChange={(e) => setChairboardForm({ ...chairboardForm, fullName: e.target.value })}
                        placeholder="Full Name"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                      {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">School *</label>
                      <input
                        type="text"
                        value={chairboardForm.school}
                        onChange={(e) => setChairboardForm({ ...chairboardForm, school: e.target.value })}
                        placeholder="School Name"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                      {errors.school && <p className="text-[11px] text-red-400 mt-1">{errors.school}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Grade *</label>
                      <select
                        value={chairboardForm.grade}
                        onChange={(e) => setChairboardForm({ ...chairboardForm, grade: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0c0c14] border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="">Select Grade</option>
                        {gradeOptions.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                      </select>
                      {errors.grade && <p className="text-[11px] text-red-400 mt-1">{errors.grade}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Phone *</label>
                      <input
                        type="tel"
                        value={chairboardForm.phone}
                        onChange={(e) => setChairboardForm({ ...chairboardForm, phone: e.target.value })}
                        placeholder="+90 5XX..."
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                      {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Email *</label>
                      <input
                        type="email"
                        value={chairboardForm.email}
                        onChange={(e) => setChairboardForm({ ...chairboardForm, email: e.target.value })}
                        placeholder="chair@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                      {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </div>

                {/* Academic Questions */}
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/8 pb-2">
                    <HelpCircle className="w-5 h-5 text-amber-400" />
                    <span>Academic & Procedural Questions</span>
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                        AI Detection & Suspicion Handling *
                      </label>
                      <textarea
                        rows={3}
                        value={chairboardForm.qAiSuspicion}
                        onChange={(e) => setChairboardForm({ ...chairboardForm, qAiSuspicion: e.target.value })}
                        placeholder="How do you handle suspicion of AI-generated content?"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                      {errors.qAiSuspicion && <p className="text-[11px] text-red-400 mt-1">{errors.qAiSuspicion}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                        Resolution & Working Paper Approval Standards *
                      </label>
                      <textarea
                        rows={3}
                        value={chairboardForm.qFinalDocuments}
                        onChange={(e) => setChairboardForm({ ...chairboardForm, qFinalDocuments: e.target.value })}
                        placeholder="What criteria do you evaluate for final resolution papers?"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                      {errors.qFinalDocuments && <p className="text-[11px] text-red-400 mt-1">{errors.qFinalDocuments}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                        Caucus Disagreement Mediation *
                      </label>
                      <textarea
                        rows={3}
                        value={chairboardForm.qDisagreement}
                        onChange={(e) => setChairboardForm({ ...chairboardForm, qDisagreement: e.target.value })}
                        placeholder="How do you mediate conflicts between opposing delegate blocs?"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                      {errors.qDisagreement && <p className="text-[11px] text-red-400 mt-1">{errors.qDisagreement}</p>}
                    </div>
                  </div>
                </div>

                {/* Motivation Letter */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono text-slate-300 uppercase">
                      Motivation Letter * (Min 150 Characters)
                    </label>
                    <span className={`text-[11px] font-mono ${chairboardForm.motivationLetter.length >= 150 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {chairboardForm.motivationLetter.length} / 150
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={chairboardForm.motivationLetter}
                    onChange={(e) => setChairboardForm({ ...chairboardForm, motivationLetter: e.target.value })}
                    placeholder="Write your chairboard motivation letter..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  {errors.motivationLetter && <p className="text-[11px] text-red-400 mt-1">{errors.motivationLetter}</p>}
                </div>

                <div className="pt-4 border-t border-white/8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full sm:w-auto text-xs sm:text-sm !py-3.5 !px-8"
                  >
                    <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}</span>
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
                    <Settings className="w-5 h-5 text-cyan-400" />
                    <span>Admin Staff Details</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Full Name *</label>
                      <input
                        type="text"
                        value={adminForm.fullName}
                        onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })}
                        placeholder="Full Name"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                      {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">School *</label>
                      <input
                        type="text"
                        value={adminForm.school}
                        onChange={(e) => setAdminForm({ ...adminForm, school: e.target.value })}
                        placeholder="School Name"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                      {errors.school && <p className="text-[11px] text-red-400 mt-1">{errors.school}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Grade *</label>
                      <select
                        value={adminForm.grade}
                        onChange={(e) => setAdminForm({ ...adminForm, grade: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0c0c14] border border-white/12 text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="">Select Grade</option>
                        {gradeOptions.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                      </select>
                      {errors.grade && <p className="text-[11px] text-red-400 mt-1">{errors.grade}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Phone *</label>
                      <input
                        type="tel"
                        value={adminForm.phone}
                        onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                        placeholder="+90 5XX..."
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                      {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Email *</label>
                      <input
                        type="email"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                        placeholder="admin@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                      {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                        Past Organization Experience
                      </label>
                      <textarea
                        rows={3}
                        value={adminForm.orgExpList}
                        onChange={(e) => setAdminForm({ ...adminForm, orgExpList: e.target.value })}
                        placeholder="List previous organizing experience..."
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-cyan-500"
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
                    <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}</span>
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
                    <Camera className="w-5 h-5 text-white" />
                    <span>Press Details</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Full Name *</label>
                      <input
                        type="text"
                        value={pressForm.fullName}
                        onChange={(e) => setPressForm({ ...pressForm, fullName: e.target.value })}
                        placeholder="Full Name"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-white"
                      />
                      {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">School *</label>
                      <input
                        type="text"
                        value={pressForm.school}
                        onChange={(e) => setPressForm({ ...pressForm, school: e.target.value })}
                        placeholder="School Name"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-white"
                      />
                      {errors.school && <p className="text-[11px] text-red-400 mt-1">{errors.school}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Grade *</label>
                      <select
                        value={pressForm.grade}
                        onChange={(e) => setPressForm({ ...pressForm, grade: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0c0c14] border border-white/12 text-sm text-white focus:outline-none focus:border-white"
                      >
                        <option value="">Select Grade</option>
                        {gradeOptions.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                      </select>
                      {errors.grade && <p className="text-[11px] text-red-400 mt-1">{errors.grade}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Phone *</label>
                      <input
                        type="tel"
                        value={pressForm.phone}
                        onChange={(e) => setPressForm({ ...pressForm, phone: e.target.value })}
                        placeholder="+90 5XX..."
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-white"
                      />
                      {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Email *</label>
                      <input
                        type="email"
                        value={pressForm.email}
                        onChange={(e) => setPressForm({ ...pressForm, email: e.target.value })}
                        placeholder="press@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-white"
                      />
                      {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Camera / Equipment Model</label>
                      <input
                        type="text"
                        value={pressForm.cameraModel}
                        onChange={(e) => setPressForm({ ...pressForm, cameraModel: e.target.value })}
                        placeholder="e.g. Sony A7 III, Canon R6..."
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Portfolio Link</label>
                      <input
                        type="url"
                        value={pressForm.references}
                        onChange={(e) => setPressForm({ ...pressForm, references: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/12 text-sm text-white focus:outline-none focus:border-white"
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
                    <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}</span>
                    <Send className="w-4 h-4 ml-1.5" />
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
