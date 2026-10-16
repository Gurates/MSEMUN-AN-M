import React, { useState, useRef, useEffect } from 'react';
import { SkipForward } from 'lucide-react';

interface VideoIntroProps {
  onComplete: () => void;
}

export const VideoIntro: React.FC<VideoIntroProps> = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFinish = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    try {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    } catch (err) {
      console.warn('Error pausing intro video:', err);
    }
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 1;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        video.muted = true;
        video.play().catch((e) => console.warn('Autoplay failed:', e));
      });
    }

    const handleGlobalClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest('button')) {
        return;
      }
      if (video && video.muted) {
        video.muted = false;
      }
    };

    window.addEventListener('click', handleGlobalClick, { once: true });
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-max bg-black flex items-center justify-center overflow-hidden select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <video
        ref={videoRef}
        src="/video/Create_a_cinematic_conference.mp4"
        autoPlay
        playsInline
        preload="auto"
        onEnded={handleFinish}
        className="w-full h-full object-cover pointer-events-none"
        style={{ width: '100vw', height: '100vh', objectFit: 'cover', pointerEvents: 'none' }}
      />

      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 35%, rgba(0, 0, 0, 0.4) 75%, rgba(0, 0, 0, 0.9) 100%)',
          pointerEvents: 'none'
        }}
      />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleFinish();
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        className="group cursor-pointer"
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 1000000,
          pointerEvents: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: '#ffffff',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.82rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 600,
          boxShadow: '0 4px 25px rgba(0, 0, 0, 0.8)',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'all 0.25s ease'
        }}
        aria-label="Skip Intro"
      >
        <span>SKIP INTRO</span>
        <SkipForward className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>
    </div>
  );
};

export default VideoIntro;
