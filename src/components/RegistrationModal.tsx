import React, { useState } from 'react';
import { FlameLogo } from './FlameLogo';
import { X, CheckCircle2, Send } from 'lucide-react';
import { COMMITTEES_DATA } from '../data/conferenceData';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCommittee?: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  defaultCommittee = 'unsc'
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    institution: '',
    delegationType: 'individual',
    committeePreference: defaultCommittee,
    experienceLevel: 'intermediate',
    motivationStatement: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0d0d15] border border-white/10 p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-6 shadow-[0_0_20px_rgba(255,106,0,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
              Dossier Submitted to Secretariat
            </h3>
            <p className="text-sm text-slate-300 max-w-md mb-8 font-sans">
              Thank you, <span className="text-amber-400 font-semibold">{formData.fullName}</span>. Your preliminary delegate application for MSEMUN XXVI has been recorded. Our credentials team will review your chamber assignment.
            </p>
            <button onClick={handleReset} className="btn-primary text-xs py-3 px-8">
              RETURN TO SUMMIT
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/8">
              <FlameLogo size="sm" showText={false} glow={true} />
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Delegate Accreditation Application
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  MSEMUN XXVI • ISTANBUL 2026
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1.5">FULL NAME</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Sterling"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-[#141420] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/80"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1.5">OFFICIAL EMAIL</label>
                  <input
                    type="email"
                    required
                    placeholder="delegate@institution.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#141420] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1.5">INSTITUTION / UNIVERSITY</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oxford / Galatasaray / Robert College"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full bg-[#141420] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/80"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1.5">PRIMARY CHAMBER PREFERENCE</label>
                  <select
                    value={formData.committeePreference}
                    onChange={(e) => setFormData({ ...formData, committeePreference: e.target.value })}
                    className="w-full bg-[#141420] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/80"
                  >
                    {COMMITTEES_DATA.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.acronym} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1.5">DELEGATION FORMAT</label>
                  <select
                    value={formData.delegationType}
                    onChange={(e) => setFormData({ ...formData, delegationType: e.target.value })}
                    className="w-full bg-[#141420] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/80"
                  >
                    <option value="individual">Individual Delegate</option>
                    <option value="school">Institutional School Delegation (5+ Delegates)</option>
                    <option value="advisor">Faculty / Delegation Advisor</option>
                    <option value="press">International Press Corps</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1.5">MUN EXPERIENCE LEVEL</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="w-full bg-[#141420] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/80"
                  >
                    <option value="novice">Novice (1–2 Conferences)</option>
                    <option value="intermediate">Intermediate (3–5 Conferences)</option>
                    <option value="expert">Experienced / Crisis Veteran (6+ Conferences)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">
                  SHORT STATEMENT OF MOTIVATION / COUNTRY INTERESTS
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize your diplomatic focus, historical research interests, or preferred country allocations..."
                  value={formData.motivationStatement}
                  onChange={(e) => setFormData({ ...formData, motivationStatement: e.target.value })}
                  className="w-full bg-[#141420] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/80"
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/8">
                <span className="text-[11px] font-mono text-slate-500">
                  No payment required during initial accreditation
                </span>
                <button type="submit" className="btn-primary text-xs py-3 px-6">
                  <span>SUBMIT APPLICATION</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
