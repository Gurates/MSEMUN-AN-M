import React, { useState, useEffect, useRef } from 'react';
import { COMMITTEES_DATA } from '../data/conferenceData';
import { Flame, ArrowRight, Shield, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Committee } from '../types';
import { PageView } from './Navbar';

interface CommitteesPageProps {
  onNavigate: (page: PageView) => void;
  onSelectCommitteeForApply: (committeeId: string) => void;
}

export const CommitteesPage: React.FC<CommitteesPageProps> = ({
  onNavigate,
  onSelectCommitteeForApply
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isThrottled = useRef<boolean>(false);
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);

  const activeCommittee = COMMITTEES_DATA[activeIndex] || COMMITTEES_DATA[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev < COMMITTEES_DATA.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Wheel & Trackpad scroll listener for 3D card stack pass
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 25) return;

      if (!isThrottled.current) {
        if (e.deltaY > 0 && activeIndex < COMMITTEES_DATA.length - 1) {
          isThrottled.current = true;
          setActiveIndex((prev) => Math.min(prev + 1, COMMITTEES_DATA.length - 1));
          setTimeout(() => {
            isThrottled.current = false;
          }, 450);
        } else if (e.deltaY < 0 && activeIndex > 0) {
          isThrottled.current = true;
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          setTimeout(() => {
            isThrottled.current = false;
          }, 450);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [activeIndex]);

  // Touch Swipe Gesture Listener for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;

    // Detect if vertical or horizontal swipe is dominant
    if (Math.abs(deltaY) > 40 || Math.abs(deltaX) > 40) {
      if (deltaY > 40 || deltaX > 40) {
        handleNext();
      } else if (deltaY < -40 || deltaX < -40) {
        handlePrev();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleApplyClick = (c: Committee) => {
    onSelectCommitteeForApply(c.id);
    onNavigate('apply');
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-screen pt-28 sm:pt-36 md:pt-40 pb-8 sm:pb-14 overflow-hidden bg-[#060608] flex flex-col justify-between select-none"
      style={{
        perspective: '1400px'
      }}
    >
      {/* Background Ambience Layers */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[800px] h-[700px] sm:h-[800px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 90, 0, 0.08) 0%, rgba(255, 140, 0, 0.02) 45%, transparent 70%)',
          filter: 'blur(90px)',
          zIndex: 0
        }}
      />

      <div className="section-container relative z-10 w-full flex-grow flex flex-col justify-between">
        
        {/* Top Header & Chamber Selector (Comfortably Spaced Below Navbar) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-4 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="font-mono text-[10px] sm:text-xs font-semibold text-amber-500 tracking-widest uppercase">
                02 // DIPLOMATIC CHAMBERS
              </span>
              <span className="w-6 sm:w-8 h-[1px] bg-amber-500/30" />
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-400">
                SWIPE OR SCROLL TO PASS CARDS
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              SPECIALIZED <span className="flame-gradient-text">ASSEMBLIES & CRISIS</span>
            </h1>
          </div>

          {/* Chamber Quick-Selector Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-[#0e0e16]/95 p-1.5 rounded-xl border border-white/10 backdrop-blur-md overflow-x-auto no-scrollbar max-w-full shadow-lg">
            {COMMITTEES_DATA.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActiveIndex(i)}
                className={`text-[11px] sm:text-xs font-mono px-3 sm:px-3.5 py-1.5 rounded-lg whitespace-nowrap flex-shrink-0 transition-all duration-300 ${
                  activeIndex === i
                    ? 'bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(255,140,0,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                style={{
                  background: activeIndex === i ? '#f59e0b' : 'transparent',
                  color: activeIndex === i ? '#000000' : '#94a3b8',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                0{i + 1} {c.acronym}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Stack Stage */}
        <div className="relative w-full h-[510px] sm:h-[580px] my-auto flex items-center justify-center">
          
          {/* Card Stack */}
          {COMMITTEES_DATA.map((committee, index) => {
            const diff = index - activeIndex;
            const isPast = diff < 0;
            const isActive = diff === 0;
            const isFuture = diff > 0;

            let transform = 'translate(-50%, -50%)';
            let opacity = 0;
            let zIndex = 10;
            let filter = 'blur(0px)';
            let pointerEvents: 'auto' | 'none' = 'none';

            if (isActive) {
              transform = 'translate(-50%, -50%) translateY(0px) scale(1) translateZ(0px) rotateX(0deg)';
              opacity = 1;
              zIndex = 20;
              filter = 'blur(0px)';
              pointerEvents = 'auto';
            } else if (isPast) {
              transform = 'translate(-50%, -50%) translateY(-115%) scale(1.04) rotateX(8deg)';
              opacity = 0;
              zIndex = 10;
              filter = 'blur(6px)';
            } else if (isFuture) {
              const depthFactor = Math.min(diff, 4);
              transform = `translate(-50%, -50%) translateY(${depthFactor * 22}px) scale(${1 - depthFactor * 0.045}) translateZ(${-depthFactor * 55}px) rotateX(${-depthFactor * 1.5}deg)`;
              opacity = Math.max(0, 1 - depthFactor * 0.26);
              zIndex = 20 - depthFactor;
              filter = diff > 2 ? 'blur(2px)' : 'blur(0px)';
            }

            return (
              <div
                key={committee.id}
                onClick={() => isFuture && setActiveIndex(index)}
                className="absolute top-1/2 left-1/2 rounded-2xl p-5 sm:p-7 flex flex-col justify-between transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] border border-white/12 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)] cursor-pointer overflow-hidden"
                style={{
                  width: 'clamp(290px, 92vw, 760px)',
                  height: 'min(66vh, 540px)',
                  backgroundImage: committee.gradient || 'linear-gradient(155deg, #1d1d28 0%, #0d0d14 100%)',
                  transform,
                  opacity,
                  zIndex,
                  filter,
                  pointerEvents,
                  boxShadow: isActive
                    ? '0 25px 80px -20px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 106, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
                    : '0 15px 40px -15px rgba(0, 0, 0, 0.6)'
                }}
              >
                {/* Card Top Row: Number & Level Badge */}
                <div className="flex items-center justify-between text-xs tracking-widest uppercase pb-2.5 sm:pb-3 border-b border-white/8">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="font-serif italic text-xl sm:text-2xl font-bold text-amber-400">
                      0{index + 1}
                    </span>
                    <span className="font-sans font-bold text-sm sm:text-base tracking-wider text-white">
                      {committee.acronym}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-slate-200 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/8 border border-white/15 backdrop-blur-sm">
                    {committee.level}
                  </span>
                </div>

                {/* Card Center: High-Definition Chamber Artwork (Fills frame cleanly with no empty gaps) */}
                <div className="relative my-2 sm:my-3 w-full h-44 sm:h-52 md:h-56 rounded-xl overflow-hidden border border-white/10 bg-black/50 group shrink-0">
                  <img
                    src={committee.image}
                    alt={committee.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                  
                  {/* Floating Flame Tag inside artwork */}
                  <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 px-2.5 sm:px-3 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-mono text-amber-300 flex items-center gap-1.5 shadow-lg">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>{committee.flameFocus}</span>
                  </div>
                </div>

                {/* Card Bottom Row: Title, Agenda & Action Button */}
                <div className="pt-1">
                  <div className="mb-2">
                    <h2 className="font-serif text-base sm:text-xl md:text-2xl font-bold text-white leading-tight">
                      {committee.shortTitle || committee.name}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-300 font-sans mt-0.5 sm:mt-1 line-clamp-2 leading-relaxed">
                      "{committee.agenda}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/8">
                    <span className="text-[10px] sm:text-[11px] font-mono text-slate-400">
                      Cap: <strong className="text-amber-400">{committee.seats} Seats</strong>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyClick(committee);
                      }}
                      className="btn-primary text-[11px] sm:text-xs !py-2 sm:!py-2.5 !px-4 sm:!px-5 !rounded-lg"
                    >
                      <span>APPLY</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}

          {/* Right Floating Live Dossier Card (Desktop Only) */}
          <div className="hidden xl:flex flex-col justify-between absolute right-4 top-1/2 -translate-y-1/2 w-[310px] p-6 rounded-2xl bg-[#0f0f1a]/95 border border-white/12 backdrop-blur-xl shadow-2xl z-30">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-xs text-amber-400 tracking-wider font-bold">
                    LIVE DOSSIER
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  CHAMBER 0{activeIndex + 1}/06
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold text-white mb-2 leading-snug">
                {activeCommittee.name}
              </h3>

              <div className="p-3 rounded-lg bg-black/40 border border-white/6 mb-4 text-xs font-sans text-slate-300 leading-relaxed">
                {activeCommittee.description}
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-white/3">
                  <span className="text-slate-400">Bureau:</span>
                  <span className="text-white font-semibold">{activeCommittee.president}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-white/3">
                  <span className="text-slate-400">Seat Quorum:</span>
                  <span className="text-amber-400 font-semibold">{activeCommittee.seats} Selected Delegates</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/8">
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Background Guides Released</span>
              </div>
            </div>
          </div>

          {/* Vertical Scroll / Nav Controls on Left */}
          <div className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex-col items-center gap-3 z-30">
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className={`p-2.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-md text-white transition-all ${
                activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:border-amber-500/50 hover:scale-110 cursor-pointer'
              }`}
              style={{ outline: 'none' }}
              aria-label="Previous committee"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            {/* Vertical Indicator Dots */}
            <div className="flex flex-col items-center gap-2 py-2">
              {COMMITTEES_DATA.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`cursor-pointer rounded-full transition-all duration-300 ${
                    activeIndex === i
                      ? 'w-2 h-6 bg-gradient-to-b from-orange-500 to-amber-400 shadow-[0_0_10px_rgba(255,140,0,0.6)]'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={activeIndex === COMMITTEES_DATA.length - 1}
              className={`p-2.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-md text-white transition-all ${
                activeIndex === COMMITTEES_DATA.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:border-amber-500/50 hover:scale-110 cursor-pointer'
              }`}
              style={{ outline: 'none' }}
              aria-label="Next committee"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Bottom Status Bar */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-slate-400 pt-2 border-t border-white/8">
          <span>
            CHAMBER: <strong className="text-amber-400">0{activeIndex + 1} // {activeCommittee.acronym}</strong>
          </span>
          <span className="hidden sm:inline-block">
            USE MOUSE WHEEL, SWIPE, OR ARROWS TO PASS CARDS
          </span>
        </div>

      </div>
    </div>
  );
};
