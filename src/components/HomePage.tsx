import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Shield } from 'lucide-react';
import { PageView } from './Navbar';

gsap.registerPlugin(ScrollTrigger);

// ── Mobile Detection Utility ──
const getIsMobile = () => window.matchMedia('(max-width: 768px)').matches;

// ── Frame Configuration (adaptive per device) ──
const DESKTOP_TOTAL_FRAMES = 240;
const MOBILE_FRAME_STEP = 3;   // Load every 3rd frame on mobile → 80 frames
const MOBILE_TOTAL_FRAMES = Math.ceil(DESKTOP_TOTAL_FRAMES / MOBILE_FRAME_STEP); // 80

/** Returns the original asset path for a given LOGICAL index (0-based) */
const getFramePath = (logicalIndex: number, isMobile: boolean) => {
  // On mobile, map logical index back to the original frame number
  const originalIndex = isMobile ? logicalIndex * MOBILE_FRAME_STEP : logicalIndex;
  const frameNum = String(Math.min(originalIndex + 1, DESKTOP_TOTAL_FRAMES)).padStart(3, '0');
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
  const rafIdRef = useRef<number>(0);

  // Detect mobile once on mount (avoids re-detection on every frame)
  const isMobile = useMemo(() => getIsMobile(), []);
  const totalFrames = isMobile ? MOBILE_TOTAL_FRAMES : DESKTOP_TOTAL_FRAMES;

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const scrollProgressRef = useRef<number>(0);
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
    // On mobile, use faster smoothing to reduce GPU load
    ctx.imageSmoothingQuality = isMobile ? 'medium' : 'high';
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, iw, ih, sx, sy, sw, sh);
  }, [isMobile]);

  // ── Size the canvas pixel buffer to match viewport × DPR ──
  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Mobile: cap DPR at 1 to save massive GPU/memory overhead
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    drawFrame(currentFrameRef.current);
  }, [drawFrame, isMobile]);

  // ── Smart Progressive Chunked Preloading (Bandwidth-Friendly) ──
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(totalFrames);
    imagesRef.current = images;

    // 1. High priority: Load 1st frame immediately so hero background appears with 0 delay
    const firstImg = new Image();
    firstImg.src = getFramePath(0, isMobile);
    firstImg.onload = () => {
      images[0] = firstImg;
      sizeCanvas();
      drawFrame(0);
    };
    images[0] = firstImg;

    // 2. Progressive background loading
    // Desktop: batches of 4 every 35ms
    // Mobile:  batches of 2 every 60ms (gentler on bandwidth + CPU)
    let currentBatch = 1;
    const BATCH_SIZE = isMobile ? 2 : 4;
    const BATCH_DELAY = isMobile ? 60 : 35;
    let isCancelled = false;

    const loadNextBatch = () => {
      if (isCancelled || currentBatch >= totalFrames) return;

      const end = Math.min(currentBatch + BATCH_SIZE, totalFrames);
      for (let i = currentBatch; i < end; i++) {
        const img = new Image();
        img.src = getFramePath(i, isMobile);
        img.onload = () => {
          images[i] = img;
        };
        images[i] = img;
      }
      currentBatch = end;

      if (currentBatch < totalFrames) {
        setTimeout(loadNextBatch, BATCH_DELAY);
      }
    };

    // Give browser initial quiet window so video intro buffers at full bandwidth
    const timer = setTimeout(() => {
      loadNextBatch();
    }, isMobile ? 500 : 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [drawFrame, sizeCanvas, totalFrames, isMobile]);

  // ── Resize canvas on window resize (debounced on mobile) ──
  useEffect(() => {
    if (isMobile) {
      let resizeTimer: ReturnType<typeof setTimeout>;
      const debouncedResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(sizeCanvas, 150);
      };
      window.addEventListener('resize', debouncedResize);
      sizeCanvas();
      return () => {
        window.removeEventListener('resize', debouncedResize);
        clearTimeout(resizeTimer);
      };
    } else {
      window.addEventListener('resize', sizeCanvas);
      sizeCanvas();
      return () => window.removeEventListener('resize', sizeCanvas);
    }
  }, [sizeCanvas, isMobile]);

  // ── GSAP ScrollTrigger — pin the section & scrub through frames ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => (isMobile ? '+=2400' : '+=3800'),
        pin: true,
        // Mobile: slower scrub = smoother feeling with fewer frames
        scrub: isMobile ? 0.6 : 0.35,
        onUpdate: (self) => {
          const progress = self.progress;
          const idx = Math.min(totalFrames - 1, Math.max(0, Math.round(progress * (totalFrames - 1))));

          if (idx !== currentFrameRef.current) {
            currentFrameRef.current = idx;
            // Cancel previous pending RAF to avoid stacking
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = requestAnimationFrame(() => drawFrame(idx));
          }

          // Throttle React state updates: only update if progress changed meaningfully
          // This prevents 60+ setState calls per second during fast scrolling
          if (Math.abs(progress - scrollProgressRef.current) > 0.005) {
            scrollProgressRef.current = progress;
            setScrollProgress(progress);
          }
        }
      });
    }, section);

    return () => ctx.revert();
  }, [drawFrame, totalFrames, isMobile]);

  // ── UI layer opacity/transforms synced to scroll progress ──
  const heroOpacity = Math.max(0, 1 - scrollProgress * 4.2);
  const heroScale = 1 - scrollProgress * 0.1;
  // On mobile, skip expensive blur filter entirely
  const heroBlur = isMobile ? 0 : (scrollProgress < 0.25 ? scrollProgress * 14 : 3);

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
            // Skip blur on mobile for better performance
            filter: heroBlur > 0 ? `blur(${heroBlur}px)` : undefined,
            pointerEvents: heroOpacity > 0.1 ? 'auto' : 'none',
            // On mobile, avoid will-change to reduce GPU layer promotion overhead
            willChange: isMobile ? 'auto' : 'opacity, transform, filter'
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
            willChange: isMobile ? 'auto' : 'opacity, transform'
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
