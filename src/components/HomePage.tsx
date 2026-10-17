import React, { useState, useEffect } from 'react';
import { ArrowRight, Compass, Landmark, Flame, Users, MapPin } from 'lucide-react';
import { PageView } from './Navbar';
import { EmbersCanvas } from './EmbersCanvas';

export const DEFAULT_TARGET_DATE = '2026-12-04T09:00:00';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
  targetDate?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

const calculateTimeLeft = (target: string): TimeLeft => {
  const targetTime = new Date(target).getTime();
  const now = new Date().getTime();
  const difference = targetTime - now;

  if (difference <= 0 || isNaN(targetTime)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isComplete: false
  };
};

export const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  targetDate = DEFAULT_TARGET_DATE 
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(targetDate));

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToApply = () => {
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const bgShiftY = scrollY * 0.42;
  const bgScale = 1 + Math.min(scrollY * 0.0004, 0.07);
  const bgBlur = Math.min(scrollY * 0.01, 3.5);

  const embersShiftY = scrollY * 0.75;

  const promptOpacity = Math.max(0, 1 - scrollY / 35);
  const applyOpacity = Math.min(1, Math.max(0, (scrollY - 20) / 60));
  const isApplyActive = scrollY > 20;

  const cardsOpacity = Math.min(1, Math.max(0, (scrollY - 35) / 90));
  const cardsTranslateY = Math.max(0, (1 - cardsOpacity) * 32);

  const renderDigitGroup = (value: number, label: string, isSeconds = false) => {
    const digits = String(Math.max(0, value)).padStart(2, '0').split('');
    return (
      <div className="countdown-block">
        <div className="digit-group">
          {digits.map((digit, index) => (
            <div 
              key={index} 
              className="digit-box"
              style={isSeconds ? { color: '#fbbf24' } : undefined}
            >
              {digit}
            </div>
          ))}
        </div>
        <span 
          className="countdown-label"
          style={isSeconds ? { color: '#f59e0b' } : undefined}
        >
          {label}
        </span>
      </div>
    );
  };

  return (
    <div 
      className="relative w-full select-none"
      style={{
        minHeight: '185vh',
        width: '100%',
        position: 'relative'
      }}
    >
      <div 
        className="fixed inset-x-0 top-0 pointer-events-none" 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '130vh',
          zIndex: 0,
          transform: `translate3d(0, ${-bgShiftY}px, 0) scale(${bgScale})`,
          filter: `blur(${bgBlur}px)`,
          willChange: 'transform, filter',
          transition: 'transform 0.05s linear'
        }}
      >
        <picture 
          className="w-full h-full block"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <source 
            media="(min-aspect-ratio: 1/1), (min-width: 768px)" 
            srcSet="/images/msemun-bg-desktop.jpg" 
          />
          <img
            src="/images/msemun-bg-mobile.jpg"
            alt="MSEMUN 2026 Official Logo"
            className="w-full h-full object-cover object-center"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block'
            }}
          />
        </picture>

        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, rgba(6, 6, 8, ${0.08 + Math.min(scrollY * 0.0006, 0.35)}) 0%, rgba(6, 6, 8, ${0.35 + Math.min(scrollY * 0.0008, 0.4)}) 70%, rgba(6, 6, 8, 0.95) 100%)`
          }}
        />
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{
            background: `linear-gradient(to top, rgba(6,6,8,${0.85 + Math.min(scrollY * 0.0005, 0.15)}), rgba(6,6,8,${0.25 + Math.min(scrollY * 0.0008, 0.3)}) 50%, rgba(6,6,8,0.45) 100%)`
          }}
        />
      </div>

      <div 
        className="fixed inset-0 pointer-events-none"
        style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 1,
          transform: `translate3d(0, ${-embersShiftY}px, 0)`,
          willChange: 'transform'
        }}
      >
        <EmbersCanvas className="opacity-35" />
      </div>

      <div 
        className="relative z-10 w-full flex flex-col items-center px-4"
        style={{
          paddingTop: 'clamp(52vh, 58vh, 62vh)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div className="relative flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full">
          
          <div className="countdown-container !mt-0 mb-4 sm:mb-6 backdrop-blur-md p-3 sm:p-5 rounded-2xl bg-black/60 border border-amber-500/30 shadow-[0_12px_45px_rgba(0,0,0,0.85)] transition-shadow duration-300">
            {renderDigitGroup(timeLeft.days, 'DAYS')}
            <span className="countdown-separator">:</span>
            {renderDigitGroup(timeLeft.hours, 'HOURS')}
            <span className="countdown-separator">:</span>
            {renderDigitGroup(timeLeft.minutes, 'MINUTES')}
            <span className="countdown-separator">:</span>
            {renderDigitGroup(timeLeft.seconds, 'SECONDS', true)}
          </div>

          <div className="relative flex flex-col items-center justify-center min-h-[60px] sm:min-h-[70px] w-full">
            
            <div 
              onClick={handleScrollToApply}
              className="absolute flex flex-col items-center gap-1.5 cursor-pointer select-none"
              style={{
                opacity: promptOpacity,
                transform: `translate3d(0, ${scrollY * 0.25}px, 0)`,
                pointerEvents: promptOpacity > 0.1 ? 'auto' : 'none',
                transition: 'opacity 0.2s ease-out'
              }}
            >
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-amber-300 uppercase animate-pulse">
                SCROLL DOWN TO APPLY
              </span>
              <span className="text-amber-400 text-xs sm:text-sm leading-none animate-bounce">↓</span>
            </div>

            <div
              style={{
                opacity: applyOpacity,
                transform: `translate3d(0, ${Math.max(0, (1 - applyOpacity) * 22)}px, 0)`,
                pointerEvents: isApplyActive ? 'auto' : 'none',
                transition: 'opacity 0.25s ease-out, transform 0.25s ease-out'
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full"
            >
              <button
                type="button"
                onClick={() => onNavigate('apply')}
                className="btn-primary group flex items-center justify-center gap-3 text-sm sm:text-base !py-3.5 sm:!py-4 !px-9 sm:!px-12 !rounded-xl shadow-[0_0_40px_rgba(255,106,0,0.65)] hover:shadow-[0_0_60px_rgba(255,120,30,0.95)] hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 20
                }}
              >
                <span className="font-semibold tracking-wider text-white">APPLY NOW</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('committees')}
                className="btn-secondary group flex items-center justify-center gap-2 text-sm sm:text-base !py-3.5 sm:!py-4 !px-7 sm:!px-9 !rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 20
                }}
              >
                <Compass className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                <span className="font-medium tracking-wider">EXPLORE COMMITTEES</span>
              </button>
            </div>

          </div>

          <div 
            className="w-full max-w-5xl mt-14 sm:mt-20 px-2 select-text"
            style={{
              opacity: cardsOpacity,
              transform: `translate3d(0, ${cardsTranslateY}px, 0)`,
              pointerEvents: cardsOpacity > 0.3 ? 'auto' : 'none',
              transition: 'opacity 0.25s ease-out, transform 0.25s ease-out'
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="w-12 h-[1px] bg-amber-500/30" />
              <span className="font-mono text-xs text-amber-400 tracking-[0.25em] uppercase">XXVI EDITION // İZMİR 2026</span>
              <span className="w-12 h-[1px] bg-amber-500/30" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              <div 
                onClick={() => onNavigate('committees')}
                className="p-5 rounded-2xl bg-black/65 border border-amber-500/25 backdrop-blur-md hover:border-amber-500/50 hover:bg-black/80 transition-all duration-300 cursor-pointer group shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3.5 text-amber-400 group-hover:scale-110 transition-transform">
                  <Landmark className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-white text-base mb-1.5 flex items-center justify-between">
                  <span>9 Elite Chambers</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-400" />
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  General Assembly & Specialized Bodies: UN Women, WHA, IMO & SPECPOL.
                </p>
              </div>

              <div 
                onClick={() => onNavigate('committees')}
                className="p-5 rounded-2xl bg-black/65 border border-amber-500/25 backdrop-blur-md hover:border-amber-500/50 hover:bg-black/80 transition-all duration-300 cursor-pointer group shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-3.5 text-red-400 group-hover:scale-110 transition-transform">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-white text-base mb-1.5 flex items-center justify-between">
                  <span>Crisis Simulation</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-400" />
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Wars of the Roses JCC, Indo-Pakistani War 1999 FKK, SCOTUS & Bilderberg 2026.
                </p>
              </div>

              <div 
                onClick={() => onNavigate('apply')}
                className="p-5 rounded-2xl bg-black/65 border border-amber-500/25 backdrop-blur-md hover:border-amber-500/50 hover:bg-black/80 transition-all duration-300 cursor-pointer group shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3.5 text-amber-400 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-white text-base mb-1.5 flex items-center justify-between">
                  <span>550+ Delegates</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-400" />
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Individual delegates and school delegations uniting across 48+ simulated states.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/65 border border-amber-500/25 backdrop-blur-md hover:border-amber-500/50 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3.5 text-amber-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-white text-base mb-1.5">
                  İzmir 2026
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  4 – 6 Aralık 2026. Premier historic Aegean setting uniting future diplomats.
                </p>
              </div>
            </div>

            <div className="text-center pt-16 pb-14 border-t border-amber-500/15 mt-16">
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                MSEMUN XXVI // MODEL UNITED NATIONS • ALL RIGHTS RESERVED
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default HomePage;
