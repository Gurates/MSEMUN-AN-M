import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Shield } from 'lucide-react';
import { PageView } from './Navbar';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;

const getFramePath = (index: number) => {
  const frameNum = String(index + 1).padStart(3, '0');
  return `/images/ezgif-frame-${frameNum}-2x.jpg`;
};

interface HomePageProps {
  onNavigate: (page: PageView) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 30,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // ── Countdown Timer ──
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    const targetTime = targetDate.getTime();

    const updateCountdown = () => {
      const difference = targetTime - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const daysDigits = String(timeLeft.days).padStart(2, '0').split('');
  const hoursDigits = String(timeLeft.hours).padStart(2, '0').split('');
  const minutesDigits = String(timeLeft.minutes).padStart(2, '0').split('');
  const secondsDigits = String(timeLeft.seconds).padStart(2, '0').split('');

  // ── Draw a frame on the canvas with fallback to nearest loaded frame ──
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find target image or nearest loaded frame to avoid any black flicker
    let img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let i = index - 1; i >= 0; i--) {
        const fallback = imagesRef.current[i];
        if (fallback && fallback.complete && fallback.naturalWidth > 0) {
          img = fallback;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Object-fit: cover — scales up to fill, crops overflow, preserves aspect ratio
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, iw, ih, sx, sy, sw, sh);
  }, []);

  // ── Size the canvas pixel buffer to match viewport × DPR ──
  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // ── Smart Progressive Chunked Preloading (Bandwidth-Friendly) ──
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    imagesRef.current = images;

    // 1. High priority: Load 1st frame immediately so hero background appears with 0 delay
    const firstImg = new Image();
    firstImg.src = getFramePath(0);
    firstImg.onload = () => {
      images[0] = firstImg;
      sizeCanvas();
      drawFrame(0);
    };
    images[0] = firstImg;

    // 2. Progressive background loading: Load remaining frames in batches of 4 with delays
    let currentBatch = 1;
    const BATCH_SIZE = 4;
    let isCancelled = false;

    const loadNextBatch = () => {
      if (isCancelled || currentBatch >= TOTAL_FRAMES) return;

      const end = Math.min(currentBatch + BATCH_SIZE, TOTAL_FRAMES);
      for (let i = currentBatch; i < end; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        img.onload = () => {
          images[i] = img;
        };
        images[i] = img;
      }
      currentBatch = end;

      if (currentBatch < TOTAL_FRAMES) {
        setTimeout(loadNextBatch, 35);
      }
    };

    // Give browser initial quiet window so video intro buffers at full bandwidth
    const timer = setTimeout(() => {
      loadNextBatch();
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [drawFrame, sizeCanvas]);

  // ── Resize canvas on window resize ──
  useEffect(() => {
    window.addEventListener('resize', sizeCanvas);
    sizeCanvas();
    return () => window.removeEventListener('resize', sizeCanvas);
  }, [sizeCanvas]);

  // ── GSAP ScrollTrigger — pin the section & scrub through frames ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => (window.innerWidth < 768 ? '+=2400' : '+=3800'),
        pin: true,
        scrub: 0.35,
        onUpdate: (self) => {
          const progress = self.progress;
          const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(progress * (TOTAL_FRAMES - 1))));

          if (idx !== currentFrameRef.current) {
            currentFrameRef.current = idx;
            requestAnimationFrame(() => drawFrame(idx));
          }
          setScrollProgress(progress);
        }
      });
    }, section);

    return () => ctx.revert();
  }, [drawFrame]);

  // ── UI layer opacity/transforms synced to scroll progress ──
  const heroOpacity = Math.max(0, 1 - scrollProgress * 4.2);
  const heroScale = 1 - scrollProgress * 0.1;
  const heroBlur = scrollProgress < 0.25 ? scrollProgress * 14 : 3;

  const ctaOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.78) * 5));
  const ctaTranslateY = (1 - ctaOpacity) * 35;

  return (
    <div className="relative w-full bg-[#060608]">

      {/* ═══ FULLSCREEN PINNED SECTION ═══ */}
      <div
        ref={sectionRef}
        className="relative w-full overflow-hidden"
        style={{ height: '100vh', touchAction: 'pan-y' }}
      >
        {/* ── Z-0: Fullscreen Frame Canvas (THE BACKGROUND) ── */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            zIndex: 0,
            backgroundColor: '#060608'
          }}
        />

        {/* ── Z-1: Cinematic Vignette ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(6,6,8,0.65) 100%)'
          }}
        />

        {/* ── Z-10: Hero Content Overlay (fades out on scroll) ── */}
        <div
          className="pt-24 sm:pt-32 pb-8 px-4 sm:px-6"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            opacity: heroOpacity,
            transform: `scale(${heroScale})`,
            filter: `blur(${heroBlur}px)`,
            pointerEvents: heroOpacity > 0.1 ? 'auto' : 'none',
            willChange: 'opacity, transform, filter'
          }}
        >
          {/* Main Title */}
          <div className="max-w-4xl mx-auto mb-3 sm:mb-5">
            <p className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] sm:tracking-[0.35em] text-amber-500/90 uppercase font-sans mb-2 sm:mb-3 flex items-center justify-center gap-2 sm:gap-3">
              <span className="w-5 sm:w-8 h-[1px] bg-gradient-to-r from-transparent to-amber-500/60" />
              THE FLAME OF RESOLUTION
              <span className="w-5 sm:w-8 h-[1px] bg-gradient-to-l from-transparent to-amber-500/60" />
            </p>
            <h1
              className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] text-white"
              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
            >
              IGNITING GLOBAL <br />
              <span className="flame-gradient-text">DIPLOMACY</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p
            className="max-w-xl mx-auto text-xs sm:text-base text-slate-200 leading-relaxed font-sans mb-5 sm:mb-8 line-clamp-3 sm:line-clamp-none px-2"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}
          >
            The torch of multilateral statecraft burns in Istanbul. Over 500 emerging diplomats
            unite to tackle paramount international flashpoints and forge tomorrow's sovereign consensus.
          </p>

          {/* Responsive Digital Countdown */}
          <div className="countdown-container">
            <div className="countdown-block">
              <div className="digit-group">
                <div className="digit-box">{daysDigits[0]}</div>
                <div className="digit-box">{daysDigits[1]}</div>
              </div>
              <span className="countdown-label">DAYS</span>
            </div>
            <span className="countdown-separator">:</span>
            <div className="countdown-block">
              <div className="digit-group">
                <div className="digit-box">{hoursDigits[0]}</div>
                <div className="digit-box">{hoursDigits[1]}</div>
              </div>
              <span className="countdown-label">HOURS</span>
            </div>
            <span className="countdown-separator">:</span>
            <div className="countdown-block">
              <div className="digit-group">
                <div className="digit-box">{minutesDigits[0]}</div>
                <div className="digit-box">{minutesDigits[1]}</div>
              </div>
              <span className="countdown-label">MINUTES</span>
            </div>
            <span className="countdown-separator">:</span>
            <div className="countdown-block">
              <div className="digit-group">
                <div className="digit-box" style={{ color: '#fbbf24' }}>{secondsDigits[0]}</div>
                <div className="digit-box" style={{ color: '#fbbf24' }}>{secondsDigits[1]}</div>
              </div>
              <span className="countdown-label" style={{ color: '#f59e0b' }}>SECONDS</span>
            </div>
          </div>

          {/* Scroll Prompt */}
          <div className="mt-6 sm:mt-10 flex flex-col items-center gap-1 text-[10px] sm:text-[11px] font-mono tracking-widest text-slate-400 uppercase animate-bounce">
            <span>SCROLL DOWN</span>
            <span className="text-amber-400 text-sm sm:text-base">↓</span>
          </div>
        </div>

        {/* ── Z-10: End CTA Overlay (fades in near end of scroll) ── */}
        <div
          className="pt-20 sm:pt-28 pb-8 px-4 sm:px-6"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            opacity: ctaOpacity,
            transform: `translateY(${ctaTranslateY}px)`,
            pointerEvents: ctaOpacity > 0.15 ? 'auto' : 'none',
            willChange: 'opacity, transform'
          }}
        >
          <span
            className="font-mono text-[11px] sm:text-xs font-semibold text-amber-500 tracking-widest uppercase mb-2 sm:mb-3"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
          >
            XXVI EDITION // ISTANBUL 2026
          </span>
          <h2
            className="font-serif text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-3 sm:mb-6"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
          >
            READY TO TAKE YOUR SEAT?
          </h2>
          <p
            className="max-w-lg text-xs sm:text-base text-slate-200 font-sans mb-6 sm:mb-10 leading-relaxed px-2"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}
          >
            Explore our six specialized crisis and General Assembly chambers or submit your
            direct delegate accreditation.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none">
            <button
              onClick={() => onNavigate('committees')}
              className="btn-secondary text-xs !py-3 sm:!py-3.5 !px-6 sm:!px-8 w-full sm:w-auto"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>EXPLORE 6 COMMITTEES</span>
            </button>
            <button
              onClick={() => onNavigate('apply')}
              className="btn-primary text-xs !py-3 sm:!py-3.5 !px-6 sm:!px-8 w-full sm:w-auto"
            >
              <span>APPLY AS DELEGATE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Z-20: Bottom Progress Bar ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '1.25rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <div
            className="w-36 sm:w-64 h-[3px] bg-white/10 rounded-full overflow-hidden"
          >
            <div
              style={{
                height: '100%',
                width: `${scrollProgress * 100}%`,
                background: 'linear-gradient(to right, #f97316, #f59e0b)',
                borderRadius: '9999px',
                transition: 'width 0.06s linear'
              }}
            />
          </div>
        </div>

      </div>

    </div>
  );
};
