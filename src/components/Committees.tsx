import React, { useState } from 'react';
import { COMMITTEES_DATA } from '../data/conferenceData';
import { Flame, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Committee } from '../types';

export const Committees: React.FC<{ onSelectCommittee?: (c: Committee) => void }> = ({ onSelectCommittee }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [activeCommitteeId, setActiveCommitteeId] = useState<string>(COMMITTEES_DATA[0].id);

  const filters = ['ALL', 'EXPERT / CRISIS', 'GENERAL ASSEMBLY', 'SPECIALIZED'];

  const filteredCommittees = COMMITTEES_DATA.filter((item) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'EXPERT / CRISIS') return item.level === 'Expert' || item.level === 'Specialized Crisis';
    if (selectedFilter === 'GENERAL ASSEMBLY') return item.acronym === 'DISEC' || item.acronym === 'SPECPOL';
    if (selectedFilter === 'SPECIALIZED') return item.acronym === 'UNHRC' || item.acronym === 'UNEP';
    return true;
  });

  const activeCommittee = COMMITTEES_DATA.find((c) => c.id === activeCommitteeId) || COMMITTEES_DATA[0];

  return (
    <section id="committees" className="relative py-28 bg-[#08080d]" data-scroll-section="committees">
      {/* Background divider accents */}
      <div className="section-container">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6" data-animate="committees-header">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs font-semibold text-amber-500 tracking-widest">02 // CHAMBERS</span>
              <span className="w-12 h-[1px] bg-amber-500/30" />
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-sans">Diplomatic Arenas</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              SPECIALIZED <span className="flame-gradient-text">COMMITTEES</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-[#12121c] p-1.5 rounded-lg border border-white/6">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`text-xs font-mono px-3.5 py-1.5 rounded transition-all duration-300 ${
                  selectedFilter === filter
                    ? 'bg-amber-500 text-black font-bold shadow-[0_0_12px_rgba(255,140,0,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Committee Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Committee List Cards */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {filteredCommittees.map((committee) => {
              const isActive = committee.id === activeCommitteeId;
              return (
                <div
                  key={committee.id}
                  onClick={() => setActiveCommitteeId(committee.id)}
                  className={`p-5 rounded-xl cursor-pointer transition-all duration-300 border ${
                    isActive
                      ? 'bg-[#141420] border-amber-500/60 shadow-[0_4px_25px_rgba(255,106,0,0.15)]'
                      : 'bg-[#0c0c14] border-white/6 hover:border-white/20 hover:bg-[#10101a]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`font-serif text-lg font-bold tracking-wider ${isActive ? 'text-amber-400' : 'text-white'}`}>
                        {committee.acronym}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                        {committee.level}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      {committee.seats} Seats
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1 font-sans">
                    {committee.agenda}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Chamber Spotlight & Dossier */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-[#0f0f18] border border-white/10 relative overflow-hidden shadow-2xl">
              
              {/* Top Atmospheric Corner Tag */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500 animate-ping" />
                  <span className="font-mono text-xs text-amber-400 tracking-widest uppercase">
                    CHAMBER DOSSIER // {activeCommittee.acronym}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>{activeCommittee.flameFocus}</span>
                </div>
              </div>

              {/* Committee Name & Agenda */}
              <div className="mb-8">
                <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                  Full Committee Title
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1 mb-4">
                  {activeCommittee.name}
                </h3>
                
                <div className="p-4 rounded-xl bg-[#161624] border-l-2 border-amber-500 mb-6">
                  <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
                    Official Agenda Topic
                  </span>
                  <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed">
                    "{activeCommittee.agenda}"
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                  {activeCommittee.description}
                </p>
              </div>

              {/* Committee Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/8 mb-8">
                <div className="p-3.5 rounded-lg bg-white/3 border border-white/5">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Chamber Directorate</span>
                  <span className="text-xs font-semibold text-white">{activeCommittee.president}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-white/3 border border-white/5">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Seat Capacity</span>
                  <span className="text-xs font-semibold text-amber-400">{activeCommittee.seats} Selected Delegates</span>
                </div>
                <div className="p-3.5 rounded-lg bg-white/3 border border-white/5 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Debate Intensity</span>
                  <span className="text-xs font-semibold text-orange-400">{activeCommittee.level} Level</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onSelectCommittee && onSelectCommittee(activeCommittee)}
                  className="btn-primary text-xs py-3 px-6"
                >
                  <span>APPLY FOR {activeCommittee.acronym}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Study Guide Available Upon Allocation</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
