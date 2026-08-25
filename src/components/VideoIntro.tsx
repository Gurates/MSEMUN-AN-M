import React, { useState, useRef, useEffect } from 'react';

interface VideoIntroProps {
  onComplete: () => void;
}

export const VideoIntro: React.FC<VideoIntroProps> = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFinish = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 900); // Smooth 900ms fade-out transition
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start with sound enabled
    video.muted = false;
    video.volume = 1;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If browser blocks unmuted autoplay without previous user interaction,
        // start muted to allow video playback, and allow unmute on first click
        video.muted = true;
        video.play().catch((e) => console.warn('Autoplay failed:', e));
      });
    }

    // Attempt to unmute on first user click anywhere if initially blocked
    const handleGlobalClick = () => {
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
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        transition: 'opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Cinematic Background Video with Audio */}
      <video
        ref={videoRef}
        src="/video/Create_a_cinematic_conference.mp4"
        autoPlay
        playsInline
        preload="auto"
        onEnded={handleFinish}
        className="w-full h-full object-cover"
        style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
      />

      {/* Subtle Cinematic Vignette Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 35%, rgba(0, 0, 0, 0.4) 75%, rgba(0, 0, 0, 0.9) 100%)'
        }}
      />
    </div>
  );
};
