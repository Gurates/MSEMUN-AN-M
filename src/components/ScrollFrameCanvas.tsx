import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;

const getFramePath = (index: number) => {
  const frameNum = String(index + 1).padStart(3, '0');
  return `/images/ezgif-frame-${frameNum}-2x.jpg`;
};

interface ScrollFrameCanvasProps {
  onProgress?: (progress: number) => void;
  children?: React.ReactNode;
}

export const ScrollFrameCanvas: React.FC<ScrollFrameCanvasProps> = ({ onProgress, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Draw image on canvas using cover mode (fills entire viewport, no letterboxing)
  const drawCanvas = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Cover mode: fills viewport entirely while preserving aspect ratio (like CSS object-fit: cover)
    const ratio = Math.max(cw / iw, ch / ih);
    const renderWidth = iw * ratio;
    const renderHeight = ih * ratio;
    const offsetX = (cw - renderWidth) / 2;
    const offsetY = (ch - renderHeight) / 2;

    ctx.fillStyle = '#060608';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, iw, ih, offsetX, offsetY, renderWidth, renderHeight);
  }, []);

  // Preload all 240 frames
  useEffect(() => {
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    const onImageLoad = () => {
      loaded += 1;
      if (loaded === 1) {
        drawCanvas(0);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = onImageLoad;
      img.onerror = onImageLoad;
      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [drawCanvas]);

  // Resize canvas to full viewport dimensions (high DPI)
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      drawCanvas(currentFrameRef.current);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawCanvas]);

  // GSAP ScrollTrigger: pin the section, scrub through 240 frames
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=4000',  // 4000px scroll distance for 240 frames (smooth)
        pin: true,
        scrub: 0.4,
        onUpdate: (self) => {
          const progress = self.progress;
          const targetIndex = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.round(progress * (TOTAL_FRAMES - 1)))
          );

          if (targetIndex !== currentFrameRef.current) {
            currentFrameRef.current = targetIndex;

            // Use rAF for smooth rendering
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
              drawCanvas(targetIndex);
            });
          }

          // Report progress to parent
          if (onProgress) onProgress(progress);
        }
      });
    }, container);

    return () => {
      ctx.revert();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawCanvas, onProgress]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none"
      style={{ backgroundColor: '#060608' }}
    >
      {/* Fullscreen Canvas — THE background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          display: 'block',
          backgroundColor: '#060608'
        }}
      />

      {/* All children (UI overlays) rendered ON TOP of the canvas */}
      {children}
    </div>
  );
};
