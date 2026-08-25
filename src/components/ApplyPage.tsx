import React, { useState } from 'react';
import { FlameLogo } from './FlameLogo';
import { COMMITTEES_DATA } from '../data/conferenceData';
import { CheckCircle2, Send, Shield, Users, Zap, ArrowLeft } from 'lucide-react';
import { PageView } from './Navbar';

interface ApplyPageProps {
  initialCommitteeId?: string;
  onNavigate: (page: PageView) => void;
}

export const ApplyPage: React.FC<ApplyPageProps> = ({
  initialCommitteeId = 'unsc',
  onNavigate
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    delegationType: 'individual',
    committeePreference: initialCommitteeId,
    experienceLevel: 'intermediate',
    motivationStatement: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const tracks = [
    {
      name: 'Individual Delegate',
      icon: Shield,
      desc: 'Full 3-day access to assigned chamber, official delegate kit, certificate, and diplomatic luncheons.'
    },
    {
      name: 'School Delegation',
      icon: Users,
      desc: 'Designed for institutions registering cohorts of 5+ delegates with included faculty advisor pass.'
    },
    {
      name: 'Crisis Specialist (JCC/UNSC)',
      icon: Zap,
      desc: 'Elite access for advanced delegates applying directly to high-tempo midnight crisis cabinets.'
    }
  ];

  return (
    <div className="relative pt-24 sm:pt-36 pb-16 sm:pb-24 min-h-screen cinematic-grid">
      {/* Background radial glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 90, 0, 0.08) 0%, transparent 70%)',
          filter: 'blur(90px)'
        }}
      />

      <div className="section-container relative z-10">
        
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs font-semibold text-amber-500 tracking-widest">03 // ACCREDITATION</span>
          <span className="w-12 h-[1px] bg-amber-500/30" />
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-sans">Official Application</span>
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
            DELEGATE <span className="flame-gradient-text">APPLICATION FORM</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Take your seat in the assembly. Early applications receive priority country and cabinet allocations in the UN Security Council and Joint Crisis Committee.
          </p>
        </div>

        {/* 3 Track Brief Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tracks.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.name} className="p-6 rounded-xl bg-[#0c0c14] border border-white/6 flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-white mb-1">{t.name}</h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Application Container */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-[#0e0e16] border border-white/10 p-5 sm:p-12 shadow-2xl">
          
          {submitted ? (
            <div className="text-center py-8 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-6 shadow-[0_0_30px_rgba(255,106,0,0.3)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
                Dossier Received by Secretariat
              </h2>
              <p className="text-sm text-slate-300 max-w-md mb-8 font-sans leading-relaxed">
                Thank you, <span className="text-amber-400 font-semibold">{formData.fullName}</span>. Your preliminary delegate application for MSEMUN 2026 has been recorded. Our credentials committee will review your chamber assignment.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onNavigate('home')}
                  className="btn-primary text-xs py-3 px-6"
                >
                  RETURN TO HOME
                </button>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary text-xs py-3 px-6"
                >
                  SUBMIT ANOTHER
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/8">
                <div className="flex items-center gap-3">
                  <FlameLogo size="sm" showText={false} glow={true} />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      Delegate Accreditation
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      MSEMUN XXVI • ISTANBUL
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded">
                  Allocations Active
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-2">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-[#141420] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-2">
                      OFFICIAL EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="delegate@institution.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#141420] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Phone & Institution */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-2">
                      PHONE NUMBER *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+90 (5XX) XXX XX XX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#141420] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-2">
                      INSTITUTION / UNIVERSITY *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Oxford / Robert College / ITU"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="w-full bg-[#141420] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Delegation & Committee */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-2">
                      DELEGATION FORMAT
                    </label>
                    <select
                      value={formData.delegationType}
                      onChange={(e) => setFormData({ ...formData, delegationType: e.target.value })}
                      className="w-full bg-[#141420] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="individual">Individual Delegate</option>
                      <option value="school">Institutional School Delegation (5+ Delegates)</option>
                      <option value="advisor">Faculty / Delegation Advisor</option>
                      <option value="press">International Press Corps</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-2">
                      PRIMARY CHAMBER PREFERENCE
                    </label>
                    <select
                      value={formData.committeePreference}
                      onChange={(e) => setFormData({ ...formData, committeePreference: e.target.value })}
                      className="w-full bg-[#141420] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      {COMMITTEES_DATA.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.acronym} — {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-2">
                    MUN & DIPLOMATIC EXPERIENCE
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="w-full bg-[#141420] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="novice">Novice (1–2 Conferences)</option>
                    <option value="intermediate">Intermediate (3–5 Conferences)</option>
                    <option value="expert">Experienced / Crisis Veteran (6+ Conferences)</option>
                  </select>
                </div>

                {/* Statement */}
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-2">
                    STATEMENT OF MOTIVATION & PREFERRED NATIONS
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Briefly state your foreign policy focus, research interests, or preferred country allocations..."
                    value={formData.motivationStatement}
                    onChange={(e) => setFormData({ ...formData, motivationStatement: e.target.value })}
                    className="w-full bg-[#141420] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Actions */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/8">
                  <button
                    type="button"
                    onClick={() => onNavigate('committees')}
                    className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Committees</span>
                  </button>

                  <button type="submit" className="btn-primary w-full sm:w-auto text-xs py-3.5 px-8">
                    <span>SUBMIT APPLICATION</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>

      </div>
 