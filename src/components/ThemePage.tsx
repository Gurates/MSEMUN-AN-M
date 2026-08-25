import React from 'react';
import { FlameLogo } from './FlameLogo';
import { Flame, Zap, Scale, Globe2, ArrowRight } from 'lucide-react';
import { PageView } from './Navbar';

interface ThemePageProps {
  onNavigate: (page: PageView) => void;
}

export const ThemePage: React.FC<ThemePageProps> = ({ onNavigate }) => {
  const pillars = [
    {
      icon: Flame,
      num: '01',
      title: 'Sovereign Intellect & Illumination',
      desc: 'The unyielding guidance of international jurisprudence, empirical research, and reason amidst global ambiguity.'
    },
    {
      icon: Zap,
      num: '02',
      title: 'The Crucible of Crisis',
      desc: 'Rapid de-escalation acuity under midnight directives, classified crisis updates, and high-tempo diplomatic maneuvers.'
    },
    {
      icon: Scale,
      num: '03',
      title: 'Consensus Architecture',
      desc: 'Bridging sharp ideological divides to craft binding, compromise-driven resolutions that withstand historical scrutiny.'
    },
    {
      icon: Globe2,
      num: '04',
      title: 'Global Stewardship',
      desc: 'Empowering emerging international statesmen to carry the torch of human rights, sovereignty, and multilateral peace.'
    }
  ];

  return (
    <div className="relative pt-36 pb-24 min-h-screen cinematic-grid">
      {/* Glow background */}
      <div 
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 90, 0, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />

      <div className="section-container relative z-10">
        
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs font-semibold text-amber-500 tracking-widest">01 // THEME & PHILOSOPHY</span>
          <span className="w-12 h-[1px] bg-amber-500/30" />
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-sans">The Flame Philosophy</span>
        </div>

        {/* Hero Banner for Theme */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-center">
          <div className="lg:col-span-7">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
              THE DIPLOMATIC EMBODIMENT OF <br />
              <span className="flame-gradient-text">FLAME & TORCH</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans mb-6">
              Throughout history, the torch has symbolized illumination piercing through the dark of crisis, while fire represents the crucible where disparate interests clash, refine, and coalesce into enduring treaty consensus.
            </p>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
              MSEMUN 2026 brings this sovereign symbolism to the forefront of international debate. Delegates are challenged not merely to deliver speeches, but to command crisis chambers, de-escalate flashpoints, and forge the historic flame of global diplomacy.
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="p-8 rounded-2xl bg-[#0e0e16] border border-amber-500/30 shadow-2xl flex flex-col items-center text-center">
              <FlameLogo size="lg" showText={true} glow={true} />
              <div className="mt-6 pt-6 border-t border-white/8">
                <p className="font-serif italic text-amber-300 text-sm">
                  "In the crucible of debate, the sovereign flame of peace is forged."
                </p>
                <span className="text-[11px] font-mono text-slate-500 mt-2 block">
                  MSEMUN XXVI DIPLOMATIC CHARTER
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Theme */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs font-semibold text-amber-500 tracking-widest">CORE PILLARS</span>
            <span className="w-12 h-[1px] bg-amber-500/30" />
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-sans">4 Guiding Principles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="p-7 rounded-xl bg-[#0c0c14] border border-white/6 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-orange-400 mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-[11px] text-amber-500 block mb-2">{p.num} // PILLAR</span>
                    <h3 className="font-serif text-lg font-bold text-white mb-3">
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                      {p.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-slate-500">
                    MSEMUN ACCREDITATION
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Prompt */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-[#12121e] to-[#0c0c14] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
              Ready to Carry the Torch in Debate?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-xl">
              Discover our 6 specialized chambers or proceed directly to delegate registration.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => onNavigate('committees')}
              className="btn-secondary text-xs py-3 px-6"
            >
              EXPLORE COMMITTEES
            </button>
            <button
              onClick={() => onNavigate('apply')}
              className="btn-primary text-xs py-3 px-6"
            >
              <span>APPLY NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
