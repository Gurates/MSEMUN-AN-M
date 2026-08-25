import React, { useState } from 'react';
import { 
  User, 
  Users, 
  Gavel, 
  Settings, 
  Camera, 
  CheckCircle, 
  ArrowLeft
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
    color: '#00b4d8'
  },
  {
    id: 'delegation' as ApplicationType,
    title: 'Delegation',
    description: 'Register your school as a group',
    icon: Users,
    color: '#ffffff'
  },
  {
    id: 'chairboard' as ApplicationType,
    title: 'Chairboard',
    description: 'Lead and moderate a committee',
    icon: Gavel,
    color: '#f59e0b'
  },
  {
    id: 'admin' as ApplicationType,
    title: 'Admin Staff',
    description: 'Help organise the conference',
    icon: Settings,
    color: '#00b4d8'
  },
  {
    id: 'press' as ApplicationType,
    title: 'Press',
    description: 'Cover the event as journalist or photographer',
    icon: Camera,
    color: '#ffffff'
  }
];

const gradeOptions = [
  { value: 'Prep', label: 'Prep' },
  { value: '9th Grade', label: '9th Grade' },
  { value: '10th Grade', label: '10th Grade' },
  { value: '11th Grade', label: '11th Grade' },
  { value: '12th Grade', label: '12th Grade' }
];

export const ApplyPage: React.FC<ApplyPageProps> = ({
  initialCommitteeId,
  onNavigate
}) => {
  const [activeRole, setActiveRole] = useState<ApplicationType>('hub');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // ── Delegate Form State ──
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
    references: ''
  });

  // ── Delegation Form State ──
  const [delegationForm, setDelegationForm] = useState({
    fullName: '',
    school: '',
    delegationName: '',
    expectedMembers: '',
    email: '',
    phone: '',
    allEmails: '',
    allPhones: '',
    message: ''
  });

  // ── Chairboard Form State ──
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
    qAiSuspicion: '',
    qFinalDocuments: '',
    qDirectiveHelp: '',
    qResolutionPaper: '',
    qDisagreement: '',
    message: '',
    references: ''
  });

  // ── Admin Form State ──
  const [adminForm, setAdminForm] = useState({
    fullName: '',
    school: '',
    grade: '',
    email: '',
    phone: '',
    orgExpList: '',
    references: '',
    message: ''
  });

  // ── Press Form State ──
  const [pressForm, setPressForm] = useState({
    fullName: '',
    school: '',
    grade: '',
    email: '',
    phone: '',
    orgExpList: '',
    cameraModel: '',
    references: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const getFilteredCommitteeOptions = (selectedPref: string, otherPrefs: string[]) => {
    return COMMITTEES_DATA.map(c => ({
      value: c.id,
      label: `${c.acronym} — ${c.name}`,
      disabled: otherPrefs.includes(c.id) && c.id !== selectedPref
    }));
  };

  const handleGenericSubmit = (e: React.FormEvent, validator: () => boolean) => {
    e.preventDefault();
    if (validator()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    }
  };

  // ── Validate Delegate ──
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
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Validate Delegation ──
  const validateDelegation = () => {
    const errs: Record<string, string> = {};
    if (!delegationForm.fullName.trim()) errs.fullName = 'Full name is required';
    if (!delegationForm.school.trim()) errs.school = 'School is required';
    if (!delegationForm.delegationName.trim()) errs.delegationName = 'Delegation name is required';
    if (!delegationForm.expectedMembers.trim()) errs.expectedMembers = 'Expected members is required';
    if (!delegationForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(delegationForm.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!delegationForm.phone.trim()) errs.phone = 'Phone number is required';
    if (!delegationForm.allEmails.trim()) errs.allEmails = 'All member emails are required';
    if (!delegationForm.allPhones.trim()) errs.allPhones = 'All member phones are required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Validate Chairboard ──
  const validateChairboard = () => {
    const errs: Record<string, string> = {};
    if (!chairboardForm.fullName.trim()) errs.fullName = 'Full name is required';
    if (!chairboardForm.school.trim()) errs.school = 'School is required';
    if (!chairboardForm.grade) errs.grade = 'Grade is required';
    if (!chairboardForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(chairboardForm.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!chairboardForm.phone.trim()) errs.phone = 'Phone number is required';
    if (!chairboardForm.pref1) errs.pref1 = '1st choice is required';
    if (!chairboardForm.pref2) errs.pref2 = '2nd choice is required';
    if (!chairboardForm.pref3) errs.pref3 = '3rd choice is required';
    if (chairboardForm.motivationLetter.trim().length < 150) {
      errs.motivationLetter = 'Motivation letter must be at least 150 characters';
    }
    if (!chairboardForm.qAiSuspicion.trim()) errs.qAiSuspicion = 'Please answer this question';
    if (!chairboardForm.qFinalDocuments.trim()) errs.qFinalDocuments = 'Please answer this question';
    if (!chairboardForm.qDisagreement.trim()) errs.qDisagreement = 'Please answer this question';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Validate Admin ──
  const validateAdmin = () => {
    const errs: Record<string, string> = {};
    if (!adminForm.fullName.trim()) errs.fullName = 'Full name is required';
    if (!adminForm.school.trim()) errs.school = 'School is required';
    if (!adminForm.grade) errs.grade = 'Grade is required';
    if (!adminForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminForm.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!adminForm.phone.trim()) errs.phone = 'Phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Validate Press ──
  const validatePress = () => {
    const errs: Record<string, string> = {};
    if (!pressForm.fullName.trim()) errs.fullName = 'Full name is required';
    if (!pressForm.school.trim()) errs.school = 'School is required';
    if (!pressForm.grade) errs.grade = 'Grade is required';
    if (!pressForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pressForm.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!pressForm.phone.trim()) errs.phone = 'Phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ═══ SUCCESS VIEW ═══
  if (isSuccess) {
    return (
      <div className="relative pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-24 min-h-screen cinematic-grid flex items-center justify-center">
        <div className="section-container relative z-10 max-w-xl text-center px-4">
          <div className="p-8 sm:p-12 rounded-2xl bg-[#0c0c14]/95 border border-white/15 backdrop-blur-xl shadow-2xl flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-[#00b4d8] mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Application Submitted!</h2>
            <p className="text-sm text-slate-300 font-sans leading-relaxed mb-8 max-w-md">
              Thank you for applying to AlaçatıMUN 2026. We have received your application and will evaluate it carefully.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setActiveRole('hub');
                onNavigate('home');
              }}
              className="btn-primary text-sm !py-3 !px-8"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-24 min-h-screen cinematic-grid">
      <div className="section-container relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* ═══ ROLE SELECTION HUB (EXACT ALAÇATIMUN LAYOUT) ═══ */}
        {activeRole === 'hub' && (
          <div className="w-full flex flex-col items-center">
            
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12 max-w-xl mx-auto">
              <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3 tracking-tight font-serif">
                Apply
              </h1>
              <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
                Choose your role and submit your application. We look forward to seeing you.
              </p>
            </div>

            {/* 2-Column Grid Selection matching screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full">
              {applicationTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    onClick={() => {
                      setActiveRole(type.id);
                      setErrors({});
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group relative flex items-start gap-4 p-5 sm:p-6 rounded-xl bg-[#0c0c14]/90 border border-white/10 hover:border-white/25 hover:bg-[#131320] transition-all duration-300 cursor-pointer shadow-lg overflow-hidden"
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
          <div className="w-full">
            
            {/* Top Back Navigation */}
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveRole('hub');
                  setErrors({});
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-lg border border-white/10 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK TO ROLES</span>
              </button>

              <span className="font-mono text-xs text-slate-400 uppercase">
                ALAÇATIMUN '26 // {activeRole.toUpperCase()}
              </span>
            </div>

            {/* ═══ 1. DELEGATE FORM ═══ */}
            {activeRole === 'delegate' && (
              <div className="p-6 sm:p-10 rounded-2xl bg-[#0c0c14]/95 border border-white/10 shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-8 pb-6 border-b border-white/10">
                  <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 font-serif">Delegate Application</h1>
                  <p className="text-xs sm:text-sm text-slate-400">Represent a nation in one of our committees. Please fill out the application form carefully.</p>
                </div>

                <form onSubmit={(e) => handleGenericSubmit(e, validateDelegate)} className="space-y-8">
                  {/* General Information */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">General Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Full Name *</label>
                        <input
                          type="text"
                          value={delegateForm.fullName}
                          onChange={(e) => setDelegateForm({ ...delegateForm, fullName: e.target.value })}
                          placeholder="Your full name"
                          maxLength={100}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.fullName ? 'border-red-500' : 'border-white/12 focus:border-[#00b4d8]'}`}
                        />
                        {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">School *</label>
                        <input
                          type="text"
                          value={delegateForm.school}
                          onChange={(e) => setDelegateForm({ ...delegateForm, school: e.target.value })}
                          placeholder="Your school or institution"
                          maxLength={150}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.school ? 'border-red-500' : 'border-white/12 focus:border-[#00b4d8]'}`}
                        />
                        {errors.school && <p className="text-[11px] text-red-400 mt-1">{errors.school}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Grade *</label>
                        <select
                          value={delegateForm.grade}
                          onChange={(e) => setDelegateForm({ ...delegateForm, grade: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-lg bg-[#0c0c14] border text-sm text-white focus:outline-none ${errors.grade ? 'border-red-500' : 'border-white/12 focus:border-[#00b4d8]'}`}
                        >
                          <option value="">Select Grade</option>
                          {gradeOptions.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                        </select>
                        {errors.grade && <p className="text-[11px] text-red-400 mt-1">{errors.grade}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Email *</label>
                        <input
                          type="email"
                          value={delegateForm.email}
                          onChange={(e) => setDelegateForm({ ...delegateForm, email: e.target.value })}
                          placeholder="you@example.com"
                          maxLength={100}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.email ? 'border-red-500' : 'border-white/12 focus:border-[#00b4d8]'}`}
                        />
                        {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Phone *</label>
                        <input
                          type="tel"
                          value={delegateForm.phone}
                          onChange={(e) => setDelegateForm({ ...delegateForm, phone: e.target.value })}
                          placeholder="0555 000 00 00"
                          maxLength={25}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.phone ? 'border-red-500' : 'border-white/12 focus:border-[#00b4d8]'}`}
                        />
                        {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                  </div>

                  {/* MUN Experience */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">MUN Experience</h3>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1 font-medium">
                        MUN Experience <span className="text-slate-500">(optional)</span>
                      </label>
                      <textarea
                        rows={4}
                        value={delegateForm.expList}
                        onChange={(e) => setDelegateForm({ ...delegateForm, expList: e.target.value })}
                        placeholder="List your previous MUN conferences, committees, and awards.&#10;Leave blank if this is your first conference."
                        maxLength={3000}
                        className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-[#00b4d8]"
                      />
                    </div>
                  </div>

                  {/* Committee Preferences */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">Committee Preferences *</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">1st Choice</label>
                        <select
                          value={delegateForm.committeePreference1}
                          onChange={(e) => setDelegateForm({ ...delegateForm, committeePreference1: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0c14] border border-white/12 text-sm text-white focus:outline-none focus:border-[#00b4d8]"
                        >
                          {getFilteredCommitteeOptions(delegateForm.committeePreference1, [delegateForm.committeePreference2, delegateForm.committeePreference3]).map(c => (
                            <option key={c.value} value={c.value} disabled={c.disabled}>{c.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">2nd Choice</label>
                        <select
                          value={delegateForm.committeePreference2}
                          onChange={(e) => setDelegateForm({ ...delegateForm, committeePreference2: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-lg bg-[#0c0c14] border text-sm text-white focus:outline-none ${errors.committeePreference2 ? 'border-red-500' : 'border-white/12 focus:border-[#00b4d8]'}`}
                        >
                          <option value="">Select 2nd Choice</option>
                          {getFilteredCommitteeOptions(delegateForm.committeePreference2, [delegateForm.committeePreference1, delegateForm.committeePreference3]).map(c => (
                            <option key={c.value} value={c.value} disabled={c.disabled}>{c.label}</option>
                          ))}
                        </select>
                        {errors.committeePreference2 && <p className="text-[11px] text-red-400 mt-1">{errors.committeePreference2}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">3rd Choice</label>
                        <select
                          value={delegateForm.committeePreference3}
                          onChange={(e) => setDelegateForm({ ...delegateForm, committeePreference3: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-lg bg-[#0c0c14] border text-sm text-white focus:outline-none ${errors.committeePreference3 ? 'border-red-500' : 'border-white/12 focus:border-[#00b4d8]'}`}
                        >
                          <option value="">Select 3rd Choice</option>
                          {getFilteredCommitteeOptions(delegateForm.committeePreference3, [delegateForm.committeePreference1, delegateForm.committeePreference2]).map(c => (
                            <option key={c.value} value={c.value} disabled={c.disabled}>{c.label}</option>
                          ))}
                        </select>
                        {errors.committeePreference3 && <p className="text-[11px] text-red-400 mt-1">{errors.committeePreference3}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Motivation Letter */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">Motivation Letter *</h3>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                        Why do you want to attend AlaçatıMUN 2026? What do you hope to gain from the experience?
                      </label>
                      <textarea
                        rows={6}
                        value={delegateForm.motivationLetter}
                        onChange={(e) => setDelegateForm({ ...delegateForm, motivationLetter: e.target.value })}
                        placeholder="Motivation Letter (Min. 150 characters)..."
                        maxLength={5000}
                        className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.motivationLetter ? 'border-red-500' : 'border-white/12 focus:border-[#00b4d8]'}`}
                      />

                      {/* Character Bar */}
                      <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-300 bg-[#00b4d8]"
                          style={{ width: `${Math.min(100, (delegateForm.motivationLetter.length / 150) * 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                        {errors.motivationLetter ? <span className="text-red-400">{errors.motivationLetter}</span> : <span />}
                        <span>{delegateForm.motivationLetter.length} / 150</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info & References */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">
                      Additional Info & References <span className="text-slate-500 text-xs font-normal">(optional)</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Anything you want to add</label>
                        <textarea
                          rows={3}
                          value={delegateForm.message}
                          onChange={(e) => setDelegateForm({ ...delegateForm, message: e.target.value })}
                          placeholder="Any additional information you'd like us to know..."
                          maxLength={2000}
                          className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-[#00b4d8]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">References</label>
                        <textarea
                          rows={3}
                          value={delegateForm.references}
                          onChange={(e) => setDelegateForm({ ...delegateForm, references: e.target.value })}
                          placeholder="Names and contact details of people who can speak to your MUN experience (e.g. a previous chair or faculty advisor)."
                          maxLength={1000}
                          className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-[#00b4d8]"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full text-sm !py-3.5"
                  >
                    {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            )}

            {/* ═══ 2. DELEGATION FORM ═══ */}
            {activeRole === 'delegation' && (
              <div className="p-6 sm:p-10 rounded-2xl bg-[#0c0c14]/95 border border-white/10 shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-8 pb-6 border-b border-white/10">
                  <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 font-serif">Delegation Registration</h1>
                  <p className="text-xs sm:text-sm text-slate-400">Register your school's delegation and bring your team to AlaçatıMUN '26.</p>
                </div>

                <form onSubmit={(e) => handleGenericSubmit(e, validateDelegation)} className="space-y-8">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">Delegation Setup</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Full Name (Head Delegate)</label>
                        <input
                          type="text"
                          value={delegationForm.fullName}
                          onChange={(e) => setDelegationForm({ ...delegationForm, fullName: e.target.value })}
                          placeholder="Your full name"
                          maxLength={100}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.fullName ? 'border-red-500' : 'border-white/12 focus:border-white'}`}
                        />
                        {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">School</label>
                        <input
                          type="text"
                          value={delegationForm.school}
                          onChange={(e) => setDelegationForm({ ...delegationForm, school: e.target.value })}
                          placeholder="Your school or institution"
                          maxLength={150}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.school ? 'border-red-500' : 'border-white/12 focus:border-white'}`}
                        />
                        {errors.school && <p className="text-[11px] text-red-400 mt-1">{errors.school}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Delegation Name</label>
                        <input
                          type="text"
                          value={delegationForm.delegationName}
                          onChange={(e) => setDelegationForm({ ...delegationForm, delegationName: e.target.value })}
                          placeholder="Enter your delegation name"
                          maxLength={150}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.delegationName ? 'border-red-500' : 'border-white/12 focus:border-white'}`}
                        />
                        {errors.delegationName && <p className="text-[11px] text-red-400 mt-1">{errors.delegationName}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Expected Members</label>
                        <input
                          type="number"
                          max={200}
                          value={delegationForm.expectedMembers}
                          onChange={(e) => setDelegationForm({ ...delegationForm, expectedMembers: e.target.value })}
                          placeholder="e.g. 12"
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.expectedMembers ? 'border-red-500' : 'border-white/12 focus:border-white'}`}
                        />
                        {errors.expectedMembers && <p className="text-[11px] text-red-400 mt-1">{errors.expectedMembers}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">Contact Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Your Email</label>
                        <input
                          type="email"
                          value={delegationForm.email}
                          onChange={(e) => setDelegationForm({ ...delegationForm, email: e.target.value })}
                          placeholder="you@example.com"
                          maxLength={100}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.email ? 'border-red-500' : 'border-white/12 focus:border-white'}`}
                        />
                        {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Your Phone</label>
                        <input
                          type="tel"
                          value={delegationForm.phone}
                          onChange={(e) => setDelegationForm({ ...delegationForm, phone: e.target.value })}
                          placeholder="0555 000 00 00"
                          maxLength={25}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.phone ? 'border-red-500' : 'border-white/12 focus:border-white'}`}
                        />
                        {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs text-slate-300 mb-1 font-medium">All Member Emails</label>
                        <textarea
                          rows={4}
                          value={delegationForm.allEmails}
                          onChange={(e) => setDelegationForm({ ...delegationForm, allEmails: e.target.value })}
                          placeholder="student1@school.com&#10;student2@school.com"
                          maxLength={3000}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.allEmails ? 'border-red-500' : 'border-white/12 focus:border-white'}`}
                        />
                        {errors.allEmails && <p className="text-[11px] text-red-400 mt-1">{errors.allEmails}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs text-slate-300 mb-1 font-medium">All Member Phone Numbers</label>
                        <textarea
                          rows={4}
                          value={delegationForm.allPhones}
                          onChange={(e) => setDelegationForm({ ...delegationForm, allPhones: e.target.value })}
                          placeholder="0555 000 00 00&#10;0555 111 11 11"
                          maxLength={1500}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.allPhones ? 'border-red-500' : 'border-white/12 focus:border-white'}`}
                        />
                        {errors.allPhones && <p className="text-[11px] text-red-400 mt-1">{errors.allPhones}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">Additional Information</h3>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1 font-medium">Anything you want to add (Optional)</label>
                      <textarea
                        rows={3}
                        value={delegationForm.message}
                        onChange={(e) => setDelegationForm({ ...delegationForm, message: e.target.value })}
                        placeholder="Any additional information you'd like us to know..."
                        maxLength={2000}
                        className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full text-sm !py-3.5"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            )}

            {/* ═══ 3. CHAIRBOARD FORM ═══ */}
            {activeRole === 'chairboard' && (
              <div className="p-6 sm:p-10 rounded-2xl bg-[#0c0c14]/95 border border-white/10 shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-8 pb-6 border-b border-white/10">
                  <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 font-serif">Chairboard Registration</h1>
                  <p className="text-xs sm:text-sm text-slate-400">Apply to chair a committee and lead discussions.</p>
                </div>

                <form onSubmit={(e) => handleGenericSubmit(e, validateChairboard)} className="space-y-8">
                  {/* Personal Details */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">Personal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Full Name</label>
                        <input
                          type="text"
                          value={chairboardForm.fullName}
                          onChange={(e) => setChairboardForm({ ...chairboardForm, fullName: e.target.value })}
                          placeholder="Your full name"
                          maxLength={100}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.fullName ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                        />
                        {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">School</label>
                        <input
                          type="text"
                          value={chairboardForm.school}
                          onChange={(e) => setChairboardForm({ ...chairboardForm, school: e.target.value })}
                          placeholder="Your school or institution"
                          maxLength={150}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.school ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                        />
                        {errors.school && <p className="text-[11px] text-red-400 mt-1">{errors.school}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Grade</label>
                        <select
                          value={chairboardForm.grade}
                          onChange={(e) => setChairboardForm({ ...chairboardForm, grade: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-lg bg-[#0c0c14] border text-sm text-white focus:outline-none ${errors.grade ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                        >
                          <option value="">Select Grade</option>
                          {gradeOptions.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                        </select>
                        {errors.grade && <p className="text-[11px] text-red-400 mt-1">{errors.grade}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Email</label>
                        <input
                          type="email"
                          value={chairboardForm.email}
                          onChange={(e) => setChairboardForm({ ...chairboardForm, email: e.target.value })}
                          placeholder="you@example.com"
                          maxLength={100}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.email ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                        />
                        {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Phone</label>
                        <input
                          type="tel"
                          value={chairboardForm.phone}
                          onChange={(e) => setChairboardForm({ ...chairboardForm, phone: e.target.value })}
                          placeholder="0555 000 00 00"
                          maxLength={25}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.phone ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                        />
                        {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                  </div>

                  {/* MUN Experience */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">MUN Experience</h3>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1 font-medium">Experience List (Optional)</label>
                      <textarea
                        rows={4}
                        value={chairboardForm.expList}
                        onChange={(e) => setChairboardForm({ ...chairboardForm, expList: e.target.value })}
                        placeholder="List your previous MUN conferences, committees, and awards. Leave blank if this is your first conference."
                        maxLength={3000}
                        className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Committee Preferences */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">Committee Preferences</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">1st Choice</label>
                        <select
                          value={chairboardForm.pref1}
                          onChange={(e) => setChairboardForm({ ...chairboardForm, pref1: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0c14] border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                        >
                          {getFilteredCommitteeOptions(chairboardForm.pref1, [chairboardForm.pref2, chairboardForm.pref3]).map(c => (
                            <option key={c.value} value={c.value} disabled={c.disabled}>{c.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">2nd Choice</label>
                        <select
                          value={chairboardForm.pref2}
                          onChange={(e) => setChairboardForm({ ...chairboardForm, pref2: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-lg bg-[#0c0c14] border text-sm text-white focus:outline-none ${errors.pref2 ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                        >
                          <option value="">Select 2nd Choice</option>
                          {getFilteredCommitteeOptions(chairboardForm.pref2, [chairboardForm.pref1, chairboardForm.pref3]).map(c => (
                            <option key={c.value} value={c.value} disabled={c.disabled}>{c.label}</option>
                          ))}
                        </select>
                        {errors.pref2 && <p className="text-[11px] text-red-400 mt-1">{errors.pref2}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">3rd Choice</label>
                        <select
                          value={chairboardForm.pref3}
                          onChange={(e) => setChairboardForm({ ...chairboardForm, pref3: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-lg bg-[#0c0c14] border text-sm text-white focus:outline-none ${errors.pref3 ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                        >
                          <option value="">Select 3rd Choice</option>
                          {getFilteredCommitteeOptions(chairboardForm.pref3, [chairboardForm.pref1, chairboardForm.pref2]).map(c => (
                            <option key={c.value} value={c.value} disabled={c.disabled}>{c.label}</option>
                          ))}
                        </select>
                        {errors.pref3 && <p className="text-[11px] text-red-400 mt-1">{errors.pref3}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Motivation */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">Motivation</h3>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1.5 font-medium">Motivation Letter (Min. 150 characters)</label>
                      <textarea
                        rows={6}
                        value={chairboardForm.motivationLetter}
                        onChange={(e) => setChairboardForm({ ...chairboardForm, motivationLetter: e.target.value })}
                        placeholder="Why do you want to chair at AlaçatıMUN? Describe your leadership style and what you bring to the committee."
                        maxLength={5000}
                        className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.motivationLetter ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                      />
                      {errors.motivationLetter && <p className="text-[11px] text-red-400 mt-1">{errors.motivationLetter}</p>}
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">Technical Details (Optional)</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Sample Crisis Directive (for crisis directors)</label>
                        <textarea
                          rows={4}
                          value={chairboardForm.crisisDirective}
                          onChange={(e) => setChairboardForm({ ...chairboardForm, crisisDirective: e.target.value })}
                          placeholder="If you are applying as a Crisis Director, share a sample directive you would inject into a committee. Leave blank if you are applying for a GA committee."
                          maxLength={3000}
                          className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">GA Procedure (for GA chairs)</label>
                        <textarea
                          rows={4}
                          value={chairboardForm.gaProcedure}
                          onChange={(e) => setChairboardForm({ ...chairboardForm, gaProcedure: e.target.value })}
                          placeholder="If you are applying for a GA committee, walk us through how you would run the session and establish speakers list. Leave blank if you are applying as a Crisis Director."
                          maxLength={3000}
                          className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Scenario Questions */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">Scenario Questions</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">
                          You have listened to a delegate's speeches and you suspect that the delegate is using AI. What would you do? *
                        </label>
                        <textarea
                          rows={4}
                          value={chairboardForm.qAiSuspicion}
                          onChange={(e) => setChairboardForm({ ...chairboardForm, qAiSuspicion: e.target.value })}
                          placeholder="Your answer..."
                          maxLength={2000}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.qAiSuspicion ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                        />
                        {errors.qAiSuspicion && <p className="text-[11px] text-red-400 mt-1">{errors.qAiSuspicion}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">
                          Explain the final documents and their details (Resolution Paper, Declaration, Communiqué, Final Directive) *
                        </label>
                        <textarea
                          rows={4}
                          value={chairboardForm.qFinalDocuments}
                          onChange={(e) => setChairboardForm({ ...chairboardForm, qFinalDocuments: e.target.value })}
                          placeholder="Your answer..."
                          maxLength={3000}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.qFinalDocuments ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                        />
                        {errors.qFinalDocuments && <p className="text-[11px] text-red-400 mt-1">{errors.qFinalDocuments}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">
                          One of your delegates is having troubles in writing a directive. What would you do to solve this issue? (for crisis applicants)
                        </label>
                        <textarea
                          rows={4}
                          value={chairboardForm.qDirectiveHelp}
                          onChange={(e) => setChairboardForm({ ...chairboardForm, qDirectiveHelp: e.target.value })}
                          placeholder="Your answer (Optional if not applying for crisis)..."
                          maxLength={2000}
                          className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">
                          There is 1 session left and half of the final document hasn't been written. What would you do in the last session to finish the final document?
                        </label>
                        <textarea
                          rows={4}
                          value={chairboardForm.qResolutionPaper}
                          onChange={(e) => setChairboardForm({ ...chairboardForm, qResolutionPaper: e.target.value })}
                          placeholder="Your answer (Optional if not applying for GA)..."
                          maxLength={3000}
                          className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">
                          You and another Chairboard member had different opinions regarding a procedural matter, and the other Chairboard member insisted that their opinion was correct and this disagreement started to affect the committee. What would you do to resolve this issue? *
                        </label>
                        <textarea
                          rows={4}
                          value={chairboardForm.qDisagreement}
                          onChange={(e) => setChairboardForm({ ...chairboardForm, qDisagreement: e.target.value })}
                          placeholder="Your answer..."
                          maxLength={3000}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.qDisagreement ? 'border-red-500' : 'border-white/12 focus:border-amber-500'}`}
                        />
                        {errors.qDisagreement && <p className="text-[11px] text-red-400 mt-1">{errors.qDisagreement}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">
                      Additional Details <span className="text-slate-500 text-xs font-normal">(Optional)</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Anything you want to add</label>
                        <textarea
                          rows={3}
                          value={chairboardForm.message}
                          onChange={(e) => setChairboardForm({ ...chairboardForm, message: e.target.value })}
                          placeholder="Any additional information you'd like us to know..."
                          maxLength={2000}
                          className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">References</label>
                        <textarea
                          rows={3}
                          value={chairboardForm.references}
                          onChange={(e) => setChairboardForm({ ...chairboardForm, references: e.target.value })}
                          placeholder="Names and contact details of people who can speak to your MUN experience (e.g. a previous chair or faculty advisor)."
                          maxLength={1000}
                          className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full text-sm !py-3.5"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            )}

            {/* ═══ 4. ADMIN STAFF FORM ═══ */}
            {activeRole === 'admin' && (
              <div className="p-6 sm:p-10 rounded-2xl bg-[#0c0c14]/95 border border-white/10 shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-8 pb-6 border-b border-white/10">
                  <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 font-serif">Admin Staff Registration</h1>
                  <p className="text-xs sm:text-sm text-slate-400">Join our organising team behind the scenes.</p>
                </div>

                <form onSubmit={(e) => handleGenericSubmit(e, validateAdmin)} className="space-y-8">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">Personal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Full Name</label>
                        <input
                          type="text"
                          value={adminForm.fullName}
                          onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })}
                          placeholder="Your full name"
                          maxLength={100}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.fullName ? 'border-red-500' : 'border-white/12 focus:border-[#00b4d8]'}`}
                        />
                        {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">School</label>
                        <input
                          type="text"
                          value={adminForm.school}
                          onChange={(e) => setAdminForm({ ...adminForm, school: e.target.value })}
                          placeholder="Your school or institution"
                          maxLength={150}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.school ? 'border-red-500' : 'border-white/12 focus:border-[#00b4d8]'}`}
                        />
                        {errors.school && <p className="text-[11px] text-red-400 mt-1">{errors.school}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Grade</label>
                        <select
                          value={adminForm.grade}
                          onChange={(e) => setAdminForm({ ...adminForm, grade: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-lg bg-[#0c0c14] border text-sm text-white focus:outline-none ${errors.grade ? 'border-red-500' : 'border-white/12 focus:border-[#00b4d8]'}`}
                        >
                          <option value="">Select Grade</option>
                          {gradeOptions.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                        </select>
                        {errors.grade && <p className="text-[11px] text-red-400 mt-1">{errors.grade}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Email</label>
                        <input
                          type="email"
                          value={adminForm.email}
                          onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                          placeholder="you@example.com"
                          maxLength={100}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.email ? 'border-red-500' : 'border-white/12 focus:border-[#00b4d8]'}`}
                        />
                        {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Phone</label>
                        <input
                          type="tel"
                          value={adminForm.phone}
                          onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                          placeholder="0555 000 00 00"
                          maxLength={25}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.phone ? 'border-red-500' : 'border-white/12 focus:border-[#00b4d8]'}`}
                        />
                        {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Experience & References */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">Experience & References (Optional)</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Organization Experience</label>
                        <textarea
                          rows={4}
                          value={adminForm.orgExpList}
                          onChange={(e) => setAdminForm({ ...adminForm, orgExpList: e.target.value })}
                          placeholder="List any clubs, student councils, event organizations, or other groups you've been part of. Leave blank if none."
                          maxLength={3000}
                          className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-[#00b4d8]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">References</label>
                        <textarea
                          rows={3}
                          value={adminForm.references}
                          onChange={(e) => setAdminForm({ ...adminForm, references: e.target.value })}
                          placeholder="Names and contact details of teachers or coordinators who can speak to your experience."
                          maxLength={1000}
                          className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-[#00b4d8]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">Additional Details (Optional)</h3>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1 font-medium">Anything you want to add</label>
                      <textarea
                        rows={3}
                        value={adminForm.message}
                        onChange={(e) => setAdminForm({ ...adminForm, message: e.target.value })}
                        placeholder="Any additional information you'd like us to know..."
                        maxLength={2000}
                        className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-[#00b4d8]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full text-sm !py-3.5"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            )}

            {/* ═══ 5. PRESS CORPS FORM ═══ */}
            {activeRole === 'press' && (
              <div className="p-6 sm:p-10 rounded-2xl bg-[#0c0c14]/95 border border-white/10 shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-8 pb-6 border-b border-white/10">
                  <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 font-serif">Press Corps Registration</h1>
                  <p className="text-xs sm:text-sm text-slate-400">Cover AlaçatıMUN '26 as a journalist or photographer.</p>
                </div>

                <form onSubmit={(e) => handleGenericSubmit(e, validatePress)} className="space-y-8">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">Personal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Full Name</label>
                        <input
                          type="text"
                          value={pressForm.fullName}
                          onChange={(e) => setPressForm({ ...pressForm, fullName: e.target.value })}
                          placeholder="Your full name"
                          maxLength={100}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.fullName ? 'border-red-500' : 'border-white/12 focus:border-white'}`}
                        />
                        {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">School</label>
                        <input
                          type="text"
                          value={pressForm.school}
                          onChange={(e) => setPressForm({ ...pressForm, school: e.target.value })}
                          placeholder="Your school or institution"
                          maxLength={150}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.school ? 'border-red-500' : 'border-white/12 focus:border-white'}`}
                        />
                        {errors.school && <p className="text-[11px] text-red-400 mt-1">{errors.school}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Grade</label>
                        <select
                          value={pressForm.grade}
                          onChange={(e) => setPressForm({ ...pressForm, grade: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-lg bg-[#0c0c14] border text-sm text-white focus:outline-none ${errors.grade ? 'border-red-500' : 'border-white/12 focus:border-white'}`}
                        >
                          <option value="">Select Grade</option>
                          {gradeOptions.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                        </select>
                        {errors.grade && <p className="text-[11px] text-red-400 mt-1">{errors.grade}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Email</label>
                        <input
                          type="email"
                          value={pressForm.email}
                          onChange={(e) => setPressForm({ ...pressForm, email: e.target.value })}
                          placeholder="you@example.com"
                          maxLength={100}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.email ? 'border-red-500' : 'border-white/12 focus:border-white'}`}
                        />
                        {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Phone</label>
                        <input
                          type="tel"
                          value={pressForm.phone}
                          onChange={(e) => setPressForm({ ...pressForm, phone: e.target.value })}
                          placeholder="0555 000 00 00"
                          maxLength={25}
                          className={`w-full px-4 py-2.5 rounded-lg bg-black/40 border text-sm text-white focus:outline-none ${errors.phone ? 'border-red-500' : 'border-white/12 focus:border-white'}`}
                        />
                        {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Experience & Equipment */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">Experience & Equipment (Optional)</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Organization / Publication Experience</label>
                        <textarea
                          rows={4}
                          value={pressForm.orgExpList}
                          onChange={(e) => setPressForm({ ...pressForm, orgExpList: e.target.value })}
                          placeholder="List any newspapers, magazines, photography clubs, school publications, or other organizations you've been part of. Leave blank if none."
                          maxLength={3000}
                          className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">Camera Brand / Model</label>
                        <input
                          type="text"
                          value={pressForm.cameraModel}
                          onChange={(e) => setPressForm({ ...pressForm, cameraModel: e.target.value })}
                          placeholder="e.g. Canon EOS 90D, Sony α6400, iPhone 15 Pro"
                          maxLength={150}
                          className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">References</label>
                        <textarea
                          rows={3}
                          value={pressForm.references}
                          onChange={(e) => setPressForm({ ...pressForm, references: e.target.value })}
                          placeholder="Names and contact details of teachers, editors, or coordinators who can speak to your work."
                          maxLength={1000}
                          className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">Additional Details (Optional)</h3>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1 font-medium">Anything you want to add</label>
                      <textarea
                        rows={3}
                        value={pressForm.message}
                        onChange={(e) => setPressForm({ ...pressForm, message: e.target.value })}
                        placeholder="Any additional information you'd like us to know..."
                        maxLength={2000}
                        className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/12 text-sm text-white focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full text-sm !py-3.5"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
