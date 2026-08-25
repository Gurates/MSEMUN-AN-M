import React from 'react';
import { CONFERENCE_INFO } from '../data/conferenceData';
import { Flame, Scale, Globe2, Zap } from 'lucide-react';

export const About: React.FC = () => {
  const pillars = [
    {
      icon: Flame,
      title: 'Sovereign Intellect',
      desc: 'Rigorous multilateral debate founded on international law, sovereign charter treaties, and deep geopolitical insight.'
    },
    {
      icon: Zap,
      title: 'The Crucible of Crisis',
      desc: 'Real-time de-escalation under midnight directives, classified crisis updates, and high-tempo diplomatic maneuvers.'
    },
    {
      icon: Scale,
      title: 'Consensus Architecture',
      desc: 'Bridging ideological divides to craft binding, compromise-driven resolutions that endure historical scrutiny.'
    },
    {
      icon: Globe2,
      title: 'Global Stewardship',
      desc: 'Fostering ethical statecraft and visionary youth leadership across four continents and forty-eight simulated nations.'
    }
  ];

  return (
    <section id="about" className="relative py-28 overflow-hidden" data-scroll-section="about">
      {/* Subtle Background Glow */}
      <div 
        className="absolute top-1/2 right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 106, 0, 0.05) 0%, transparent 70%)',
          filter: 'blur(70px)'
        }}
      />

      <div className="section-container relative z-10">
        
        {/* Section Index & Eyebrow */}
        <div className="flex items-center gap-3 mb-4" data-animate="about-label">
          <span className="font-mono text-xs font-semibold text-amber-500 tracking-widest">01 // ESSENCE</span>
          <span className="w-12 h-[1px] bg-amber-500/30" />
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-sans">The Flame Philosophy</span>
        </div>

        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-end">
          <div className="lg:col-span-7" data-animate="about-title">
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              A BEACON OF STATECRAFT IN A <span className="flame-gradient-text">FRAGMENTED WORLD</span>
            </h2>
          </div>
          <div className="lg:col-span-5" data-animate="about-desc">
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
              In classical diplomacy, the torch symbolizes illumination amidst ambiguity and the sovereign heat of passionate advocacy. MSEMUN XXVI convenes 550+ delegates to confront modern flashpoints through unyielding debate and treaty craftsmanship.
            </p>
          </div>
        </div>

        {/* 4 Pillars Grid - Clean Architectural Design without generic card clutter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24" data-animate="about-pillars">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group relative p-7 rounded-xl bg-[#0c0c13] border border-white/6 hover:border-amber-500/40 transition-all duration-400 flex flex-col justify-between"
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-amber-400" />
                </div>

                <div>
                  <div className="w-12 h-12 rounded-lg bg-white/3 border border-white/10 flex items-center justify-center text-amber-400 mb-6 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 group-hover:text-orange-400 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 mb-2">PILLAR 0{idx + 1}</div>
                  <h3 className="font-serif text-lg font-bold text-white mb-3 group-hover:text-amber-200 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-sans">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>MSEMUN 2026</span>
                  <span className="text-amber-500/80">CORE CHARTER</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Conference Impact Stats Strip */}
        <div 
          className="relative rounded-2xl bg-gradient-to-b from-[#11111a] to-[#0a0a0f] border border-white/8 p-8 sm:p-12 overflow-hidden shadow-2xl"
          data-animate="about-stats"
        >
          {/* Subtle Glow backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {CONFERENCE_INFO.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
                    {stat.value}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(255,140,0,0.8)]" />
                </div>
                <h4 className="font-mono text-xs font-bold tracking-widest text-amber-400 uppercase mt-2 mb-1">
                  {stat.label}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
