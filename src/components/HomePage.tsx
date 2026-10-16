import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { PageView } from './Navbar';
import { EmbersCanvas } from './EmbersCanvas';

// ════════════════════════════════════════════════════════════════
// KONFERANS HEDEF TARİHİ
// Dilediğiniz tarihi buradan güncelleyebilirsiniz.
// Format: 'YYYY-MM-DDTHH:mm:ss' (Örnek: '2026-11-20T09:00:00')
// ════════════════════════════════════════════════════════════════
export const DEFAULT_TARGET_DATE = '2026-11-20T09:00:00';

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

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(targetDate));

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

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
    <div className="relative w-full min-h-screen flex flex-col items-center justify-end pb-10 sm:pb-14 pt-24 px-4 overflow-hidden select-none">
      
      {/* ── 1. Fullscreen Responsive Logo Background ── */}
      <div className="fixed inset-0 z-0 overflow-hidden" style={{ position: 'fixed', inset: 0 }}>
        <picture 
          className="w-full h-full block"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* PC / Bilgisayar / Yatay ekranlar için görsel */}
          <source 
            media="(min-aspect-ratio: 1/1), (min-width: 768px)" 
            srcSet="/images/msemun-bg-desktop.jpg" 
          />
          {/* Telefon / Mobil / Dikey ekranlar için görsel */}
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

        {/* Ambient Subtle Vignette & Gradient for high readability */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(6, 6, 8, 0.05) 0%, rgba(6, 6, 8, 0.3) 65%, rgba(6, 6, 8, 0.75) 100%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />
      </div>

      {/* Floating Ambient Embers */}
      <EmbersCanvas className="opacity-30 z-[1]" />

      {/* ── 2. Interactive Overlay (Countdown + Apply Button) ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-3xl mx-auto w-full">
        
        {/* Responsive Digital Countdown Timer */}
        <div className="countdown-container !mt-0 mb-5 sm:mb-7 backdrop-blur-md p-3 sm:p-5 rounded-2xl bg-black/50 border border-amber-500/25 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
          {renderDigitGroup(timeLeft.days, 'DAYS')}
          <span className="countdown-separator">:</span>
          {renderDigitGroup(timeLeft.hours, 'HOURS')}
          <span className="countdown-separator">:</span>
          {renderDigitGroup(timeLeft.minutes, 'MINUTES')}
          <span className="countdown-separator">:</span>
          {renderDigitGroup(timeLeft.seconds, 'SECONDS', true)}
        </div>

        {/* Apply Button */}
        <div>
          <button
            onClick={() => onNavigate('apply')}
            className="btn-primary group flex items-center justify-center gap-3 text-sm sm:text-base !py-3.5 sm:!py-4 !px-9 sm:!px-12 !rounded-xl shadow-[0_0_35px_rgba(255,106,0,0.55)] hover:shadow-[0_0_55px_rgba(255,120,30,0.85)] hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <span className="font-semibold tracking-wider text-white">APPLY NOW</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
