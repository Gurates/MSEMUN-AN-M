import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
  color: string;
}

export const EmbersCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color palette for embers
    const colors = [
      'rgba(255, 87, 34, ',
      'rgba(255, 122, 0, ',
      'rgba(255, 179, 0, ',
      'rgba(255, 214, 102, '
    ];

    const particleCount = 38;
    const particles: Particle[] = [];

    const createParticle = (initialY = false): Particle => {
      const colorBase = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: width * 0.5 + (Math.random() - 0.5) * (width * 0.45),
        y: initialY ? Math.random() * height : height * 0.75 + Math.random() * (height * 0.25),
        size: Math.random() * 2.2 + 0.8,
        speedY: Math.random() * 0.9 + 0.4,
        speedX: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.7 + 0.2,
        fadeSpeed: Math.random() * 0.003 + 0.002,
        color: colorBase
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        p.y -= p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.02) * 0.3;
        p.opacity -= p.fadeSpeed;

        if (p.opacity <= 0 || p.y <= 0) {
          particles[index] = createParticle(false);
          return;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 110, 20, 0.6)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
};
