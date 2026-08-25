import React from 'react';
import { FlameLogo } from './FlameLogo';
import { ArrowRight, Check, Shield, Users, Zap } from 'lucide-react';

interface RegistrationCTAProps {
  onRegisterClick: () => void;
}

export const RegistrationCTA: React.FC<RegistrationCTAProps> = ({ onRegisterClick }) => {
  const tiers = [
    {
      name: 'INDIVIDUAL DELEGATE',
      icon: Shield,
      badge: 'POPULAR',
      desc: 'Ideal for independent university and high school delegates seeking intense committee debate.',
      features: [
        'Full 3-Day Chamber Accreditation',
        'Official Delegate Study Dossier',
        'Diplomatic Luncheons & Coffee Breaks',
        'Delegate Kit & Certified Diplomatic Scroll'
      ]
    },
    {
      name: 'INSTITUTIONAL DELEGATION',
      icon: Users,
      badge: 'FOR SCHOOLS',
      desc: 'Designed for high schools and university MUN societies registering cohorts of 5+ delegates.',
      features: [
        'Dedicated Faculty Advisor Accreditation',
        'Priority Country & Bloc Allocation',
        'Custom Delegation Group Photo',
        'Exclusive Head Delegate Strategy Briefing'
      ]
    },
    {
      name: 'CRISIS SPECIALIST',
      icon: Zap,
      badge: 'LIMITED SEATS',
      desc: 'Elite access for delegates applying directly to UNSC and the 1983 Joint Crisis Cabinet.',
      features: [
        'Secret Dossier & Pre-Summit Directives',
        'Midnight Flashpoint Session Access',
        'Real-Time Crisis Communication Console',
        'Special Commendation Eligibility'
      ]
    }
  ];

  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-[#060608] via-[#0e0d16] to-[#060608]" data-scroll-section="cta">
      {/* Radiant Torch Background Aura */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(255, 90, 0, 0.12) 0%, rgba(255, 140, 0, 0.03) 50%, transparent 80%)',
          filter: 'blur(60px)'
        }}
      />

      <div className="section-container relative z-10">
        
        {/* Main CTA Centerpiece */}
        <div className="max-w-4xl mx-auto text-center mb-16" data-animate="cta-heading">
          <div className="inline-flex items-center justify-center mb-6">
            <FlameLogo size="md" showText={false} glow={true} />
          </div>

          <p className="font-mono text-xs font-semibold text-amber-500 tracking-[0.3em] uppercase mb-3">
            ACCREDITATION & PASSES // XXVI EDITION
          </p>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
            CARRY THE TORCH <br />
            <span className="flame-gradient-text">INTO DEBATE</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed mb-8">
            The assembly chambers await your intellect. Secure your credentials before allocations reach maximum capacity.
          </p>

          <button
            onClick={onRegisterClick}
            className="btn-primary text-sm px-10 py-4 shadow-2xl"
          >
            <span>APPLY FOR DELEGATION NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Tier Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => {
            const Icon = tier.icon;
            const isMiddle = idx === 1;
            return (
              <div
                key={tier.name}
                className={`relative p-8 rounded-2xl flex flex-col justify-between transition-all duration-400 ${
                  isMiddle
                    ? 'bg-[#12121e] border-2 border-amber-500/50 shadow-[0_8px_35px_rgba(255,106,0,0.18)]'
                    : 'bg-[#0b0b12] border border-white/8 hover:border-white/20'
                }`}
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded border ${
                    isMiddle
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}>
                    {tier.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans mb-6">
                    {tier.desc}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-3 pt-6 border-t border-white/8 mb-8">
                    {tier.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onRegisterClick}
                  className={`w-full py-3 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    isMiddle
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:brightness-110'
                      : 'bg-white/5 text-slate-200 border border-white/10 hover:bg-amber-500/10 hover:border-amber-500/40 hover:text-amber-300'
                  }`}
                >
                  Select Track
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
