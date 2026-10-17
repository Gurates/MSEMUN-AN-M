import React, { useState, useEffect, useRef } from 'react';
import { COMMITTEES_DATA } from '../data/conferenceData';
import { Flame, ArrowRight, Shield, CheckCircle2, ChevronDown, ChevronUp, Maximize2, X } from 'lucide-react';
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
  const [selectedPosterCommittee, setSelectedPosterCommittee] = useState<Committee | null>(null);
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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(deltaY) > 40 || Math.abs(deltaX) > 40) {
      if (deltaY > 40 || deltaX > 40) {
        handleNext();
      } else if (deltaY < -40 || deltaX < -40) {
        handlePrev();
      }
    }
  };

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
      className="relative min-h-screen pt-24 sm:pt-28 md:pt-32 pb-4 sm:pb-6 overflow-hidden bg-[#060608] flex flex-col justify-between select-none"
      style={{
        perspective: '1400px'
      }}
    >
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[800px] h-[700px] sm:h-[800px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 90, 0, 0.08) 0%, rgba(255, 140, 0, 0.02) 45%, transparent 70%)',
          filter: 'blur(90px)',
          zIndex: 0
        }}
      />

      <div className="section-container relative z-10 w-full flex-grow flex flex-col justify-between">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-5 mb-2 sm:mb-4">
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
                {String(i + 1).padStart(2, '0')} {c.acronym}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full h-[550px] sm:h-[620px] md:h-[650px] my-auto flex items-center justify-center">
          
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
              transform = `translate(-50%, -50%) translateY(${depthFactor * 20}px) scale(${1 - depthFactor * 0.045}) translateZ(${-depthFactor * 55}px) rotateX(${-depthFactor * 1.5}deg)`;
              opacity = Math.max(0, 1 - depthFactor * 0.26);
              zIndex = 20 - depthFactor;
              filter = diff > 2 ? 'blur(2px)' : 'blur(0px)';
            }

            return (
              <div
                key={committee.id}
                onClick={() => isFuture && setActiveIndex(index)}
                className="absolute top-1/2 left-1/2 rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col justify-between transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] border border-white/12 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)] cursor-pointer overflow-hidden"
                style={{
                  width: 'clamp(300px, 92vw, 760px)',
                  height: 'min(76vh, 620px)',
                  minHeight: '490px',
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
                <div className="flex items-center justify-between text-xs tracking-widest uppercase pb-2 sm:pb-2.5 border-b border-white/8 shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="font-serif italic text-xl sm:text-2xl font-bold text-amber-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-sans font-bold text-sm sm:text-base tracking-wider text-white">
                      {committee.acronym}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-slate-200 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/8 border border-white/15 backdrop-blur-sm">
                    {committee.level}
                  </span>
                </div>

                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPosterCommittee(committee);
                  }}
                  className="relative my-2 w-full flex-1 min-h-[160px] max-h-[290px] sm:max-h-[310px] rounded-xl overflow-hidden border border-white/10 bg-[#06060c] group flex items-center justify-center cursor-pointer shrink p-1"
                  title="Click to view full official poster"
                >
                  <img
                    src={committee.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-125 opacity-25 pointer-events-none"
                  />
                  <img
                    src={committee.image}
                    alt={committee.name}
                    className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain object-center transition-transform duration-700 group-hover:scale-105 drop-shadow-[0_8px_25px_rgba(0,0,0,0.85)]"
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%'
                    }}
                  />
                  
                  <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 px-2.5 sm:px-3 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-mono text-amber-300 flex items-center gap-1.5 shadow-lg z-20">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>{committee.flameFocus}</span>
                  </div>

                  <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 px-2 py-0.5 sm:py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-mono text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center gap-1">
                    <Maximize2 className="w-3 h-3 text-amber-400" />
                    <span>POSTER</span>
                  </div>
                </div>

                <div className={`pt-1 sm:pt-2 shrink-0 transition-opacity duration-300 ${!isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <div className="mb-1.5 sm:mb-2">
                    <h2 className="font-serif text-base sm:text-xl md:text-2xl font-bold text-white leading-tight">
                      {committee.shortTitle || committee.name}
                    </h2>
                    <p className="text-xs sm:text-[13px] text-slate-300 font-sans mt-0.5 sm:mt-1 line-clamp-2 leading-relaxed">
                      "{committee.agenda}"
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] font-mono text-slate-300 mb-2">
                    {committee.usg && (
                      <span className="flex items-center gap-1">
                        <span className="text-amber-400 font-semibold">USG:</span>
                        <span>{Array.isArray(committee.usg) ? committee.usg.join(', ') : committee.usg}</span>
                      </span>
                    )}
                    {committee.acas && (
                      <span className="flex items-center gap-1">
                        <span className="text-sky-400 font-semibold">Acas:</span>
                        <span>{committee.acas}</span>
                      </span>
                    )}
                    {committee.hoc && (
                      <span className="flex items-center gap-1">
                        <span className="text-orange-400 font-semibold">HOC:</span>
                        <span>{committee.hoc}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 sm:pt-2.5 border-t border-white/8">
                    <span className="text-[11px] sm:text-xs font-mono text-slate-400">
                      Cap: <strong className="text-amber-400 font-semibold">{committee.seats} Seats</strong>
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

          <div className="hidden xl:flex flex-col justify-between absolute right-4 top-1/2 -translate-y-1/2 w-[320px] p-6 rounded-2xl bg-[#0f0f1a]/95 border border-white/12 backdrop-blur-xl shadow-2xl z-30 max-h-[90%] overflow-y-auto no-scrollbar">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-xs text-amber-400 tracking-wider font-bold">
                    LIVE DOSSIER
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  CHAMBER {String(activeIndex + 1).padStart(2, '0')}/{String(COMMITTEES_DATA.length).padStart(2, '0')}
                </span>
              </div>

              <div 
                onClick={() => setSelectedPosterCommittee(activeCommittee)}
                className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10 bg-black/60 mb-3 group cursor-pointer flex items-center justify-center"
                title="Click to view full official poster"
              >
                <img
                  src={activeCommittee.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110 opacity-40 pointer-events-none"
                />
                <img
                  src={activeCommittee.image}
                  alt={activeCommittee.name}
                  className="relative z-10 max-h-full max-w-full object-contain object-center drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-amber-300 border border-white/10 z-20 flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" />
                  <span>VIEW POSTER</span>
                </div>
              </div>

              <h3 className="font-serif text-base font-bold text-white mb-2 leading-snug">
                {activeCommittee.name}
              </h3>

              <div className="p-2.5 rounded-lg bg-black/40 border border-white/6 mb-3 text-[11px] font-sans text-slate-300 leading-relaxed">
                {activeCommittee.description}
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                {activeCommittee.usg && (
                  <div className="flex items-center justify-between p-2 rounded bg-white/3">
                    <span className="text-slate-400">USG / Müsteşar:</span>
                    <span className="text-white font-semibold text-right">
                      {Array.isArray(activeCommittee.usg) ? activeCommittee.usg.join(', ') : activeCommittee.usg}
                    </span>
                  </div>
                )}
                {activeCommittee.acas && (
                  <div className="flex items-center justify-between p-2 rounded bg-white/3">
                    <span className="text-slate-400">Acas / Asistan:</span>
                    <span className="text-white font-semibold text-right">{activeCommittee.acas}</span>
                  </div>
                )}
                {activeCommittee.ctm && (
                  <div className="flex items-center justify-between p-2 rounded bg-white/3">
                    <span className="text-slate-400">Ctm / Kriz:</span>
                    <span className="text-amber-400 font-semibold text-right">{activeCommittee.ctm}</span>
                  </div>
                )}
                {activeCommittee.rapporteur && (
                  <div className="flex items-center justify-between p-2 rounded bg-white/3">
                    <span className="text-slate-400">Raportör:</span>
                    <span className="text-white font-semibold text-right">{activeCommittee.rapporteur}</span>
                  </div>
                )}
                {activeCommittee.hoc && (
                  <div className="flex items-center justify-between p-2 rounded bg-white/3">
                    <span className="text-slate-400">Head of Crisis:</span>
                    <span className="text-orange-400 font-semibold text-right">{activeCommittee.hoc}</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-2 rounded bg-white/3">
                  <span className="text-slate-400">Quorum:</span>
                  <span className="text-amber-400 font-semibold">{activeCommittee.seats} Seats</span>
                </div>
                {activeCommittee.subCabinets && activeCommittee.subCabinets.length > 0 && (
                  <div className="p-2 rounded bg-white/3">
                    <span className="text-slate-400 block mb-1 text-[11px]">Odalar / Dağılım:</span>
                    <div className="flex flex-wrap gap-1">
                      {activeCommittee.subCabinets.map((sub, sIdx) => (
                        <span key={sIdx} className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-white/8">
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Background Guides Released</span>
              </div>
            </div>
          </div>

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

        <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-slate-400 pt-2 border-t border-white/8">
          <span>
            CHAMBER: <strong className="text-amber-400">{String(activeIndex + 1).padStart(2, '0')} // {activeCommittee.acronym}</strong>
          </span>
          <span className="hidden sm:inline-block">
            USE MOUSE WHEEL, SWIPE, OR ARROWS TO PASS CARDS
          </span>
        </div>

      </div>

      {selectedPosterCommittee && (
        <div 
          onClick={() => setSelectedPosterCommittee(null)}
          className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
          style={{ position: 'fixed', inset: 0, zIndex: 100000 }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[94vh] flex flex-col items-center justify-between rounded-2xl border border-white/15 bg-[#0a0a12]/95 p-3 sm:p-5 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden"
          >
            <div className="w-full flex items-center justify-between pb-2.5 mb-2 border-b border-white/10">
              <div className="flex items-center gap-2 sm:gap-3 truncate pr-2">
                <span className="font-mono text-[11px] sm:text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 shrink-0">
                  {selectedPosterCommittee.acronym}
                </span>
                <h3 className="font-serif text-xs sm:text-base font-bold text-white truncate">
                  {selectedPosterCommittee.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPosterCommittee(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full flex-grow flex items-center justify-center overflow-hidden rounded-xl bg-black/60 p-1 min-h-[50vh] max-h-[74vh]">
              <img
                src={selectedPosterCommittee.image}
                alt={selectedPosterCommittee.name}
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            <div className="w-full flex items-center justify-between pt-2.5 mt-2 border-t border-white/10">
              <span className="text-[10px] sm:text-xs font-mono text-slate-400">
                Official MSEMUN XXVI Promotional Artwork
              </span>
              <button
                type="button"
                onClick={() => {
                  const comm = selectedPosterCommittee;
                  setSelectedPosterCommittee(null);
                  handleApplyClick(comm);
                }}
                className="btn-primary text-[11px] sm:text-xs !py-2 !px-4 sm:!px-6 !rounded-lg"
              >
                <span>APPLY FOR {selectedPosterCommittee.acronym}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
