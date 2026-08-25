import React, { useState } from 'react';
import { SCHEDULE_DATA } from '../data/conferenceData';
import { MapPin, Flame, Calendar } from 'lucide-react';

export const Program: React.FC = () => {
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const activeDay = SCHEDULE_DATA[activeDayIndex];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'plenary':
        return { label: 'PLENARY', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'caucus':
        return { label: 'COMMITTEE CAUCUS', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
      case 'crisis':
        return { label: 'CRISIS DIRECTIVE', color: 'bg-red-500/10 text-red-400 border-red-500/30' };
      case 'gala':
        return { label: 'SOIRÉE / GALA', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      default:
        return { label: 'RECESS & RECEPTION', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
    }
  };

  return (
    <section id="program" className="relative py-28 bg-[#09090f]" data-scroll-section="program">
      <div className="section-container">
        
        {/* Section Eyebrow */}
        <div className="flex items-center gap-3 mb-3" data-animate="program-label">
          <span className="font-mono text-xs font-semibold text-amber-500 tracking-widest">04 // ITINERARY</span>
          <span className="w-12 h-[1px] bg-amber-500/30" />
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-sans">Three-Day Deliberation</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6" data-animate="program-header">
          <div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              CONFERENCE <span className="flame-gradient-text">AGENDA</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              An engineered chronology designed for intense diplomacy, unmoderated caucuses, breaking midnight crisis directives, and final plenary treaties.
            </p>
          </div>

          {/* Day Navigation Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#12121c] border border-white/6 self-start lg:self-auto">
            {SCHEDULE_DATA.map((day, idx) => (
              <button
                key={day.day}
                onClick={() => setActiveDayIndex(idx)}
                className={`px-5 py-3 rounded-lg font-mono text-xs font-bold transition-all duration-300 flex flex-col items-start ${
                  activeDayIndex === idx
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-[0_4px_20px_rgba(255,106,0,0.35)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{day.title}</span>
                  {activeDayIndex === idx && <Flame className="w-3 h-3 text-amber-200" />}
                </div>
                <span className="text-[10px] font-sans font-normal opacity-85">
                  {day.theme}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Day Header Banner */}
        <div className="p-6 rounded-xl bg-[#101018] border border-white/8 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg font-bold text-white">{activeDay.title}: {activeDay.theme}</span>
                <span className="text-xs font-mono text-amber-400 font-medium px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {activeDay.sessions.length} SESSIONS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">{activeDay.date}</p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500 tracking-wider">
            ALL TIMES UTC+3 (ISTANBUL LOCAL TIME)
          </span>
        </div>

        {/* Timeline Itinerary Items */}
        <div className="space-y-4">
          {activeDay.sessions.map((session, idx) => {
            const badge = getTypeBadge(session.type);
            return (
              <div
                key={idx}
                className="group relative p-6 sm:p-7 rounded-xl bg-[#0c0c14] border border-white/6 hover:border-amber-500/40 hover:bg-[#11111c] transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                {/* Time Node */}
                <div className="md:col-span-3 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 group-hover:shadow-[0_0_10px_rgba(255,140,0,0.8)] transition-shadow" />
                  <div className="font-mono text-sm sm:text-base font-bold text-white tracking-wide">
                    {session.time}
                  </div>
                </div>

                {/* Session Details */}
                <div className="md:col-span-6">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                    {session.title}
                  </h3>
                  {session.description && (
                    <p className="text-xs text-slate-400 mt-1 font-sans leading-relaxed">
                      {session.description}
                    </p>
                  )}
                </div>

                {/* Location Marker */}
                <div className="md:col-span-3 flex items-center md:justify-end gap-2 text-xs font-mono text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-amber-500/70" />
                  <span>{session.location}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
