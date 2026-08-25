import React from 'react';
import { SPEAKERS_DATA } from '../data/conferenceData';
import { ArrowUpRight, Flame } from 'lucide-react';

export const Speakers: React.FC = () => {
  return (
    <section id="speakers" className="relative py-28 overflow-hidden" data-scroll-section="speakers">
      {/* Background ambient lighting */}
      <div 
        className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 90, 0, 0.04) 0%, transparent 70%)',
          filter: 'blur(90px)'
        }}
      />

      <div className="section-container relative z-10">
        
        {/* Section Eyebrow */}
        <div className="flex items-center gap-3 mb-3" data-animate="speakers-label">
          <span className="font-mono text-xs font-semibold text-amber-500 tracking-widest">03 // KEYNOTES</span>
          <span className="w-12 h-[1px] bg-amber-500/30" />
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-sans">Diplomatic Luminaries</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6" data-animate="speakers-header">
          <div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              DISTINGUISHED <span className="flame-gradient-text">VOICES</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              World-renowned diplomats, former ambassadors, and international jurists delivering keynote addresses to open each major plenary session.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-amber-400/90 border border-amber-500/20 px-4 py-2 rounded-full bg-amber-500/5">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>4 Plenary Keynotes Scheduled</span>
          </div>
        </div>

        {/* Editorial Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SPEAKERS_DATA.map((speaker, index) => (
            <div
              key={speaker.id}
              className="group relative flex flex-col bg-[#0c0c14] rounded-xl border border-white/6 hover:border-amber-500/50 transition-all duration-500 overflow-hidden"
              data-animate={`speaker-card-${index}`}
            >
              {/* Speaker Portrait with Warm Flame Overlay on Hover */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#151520]">
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
                />
                
                {/* Gradient Vignette over Photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] via-[#0c0c14]/30 to-transparent" />
                
                {/* Chamber Tag Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/30">
                    {speaker.chamber}
                  </span>
                </div>
              </div>

              {/* Speaker Details */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors mb-1">
                    {speaker.name}
                  </h3>
                  <p className="text-xs font-semibold text-amber-500 font-mono tracking-wide mb-1">
                    {speaker.role}
                  </p>
                  <p className="text-[11px] text-slate-400 mb-4">
                    {speaker.organization}
                  </p>

                  <div className="p-3 rounded-lg bg-white/2 border border-white/5 mb-4">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Keynote Topic</span>
                    <p className="text-xs text-slate-200 font-medium italic line-clamp-2">
                      "{speaker.topic}"
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Plenary Speaker</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
