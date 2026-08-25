import React from 'react';

interface FlameLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  className?: string;
  glow?: boolean;
}

export const FlameLogo: React.FC<FlameLogoProps> = ({
  size = 'md',
  className = '',
  glow = true
}) => {
  const sizeMap = {
    sm: { width: 38, height: 46 },
    md: { width: 68, height: 82 },
    lg: { width: 140, height: 168 },
    hero: { width: 240, height: 288 }
  };

  const { width, height } = sizeMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width, height }}
      data-flame-focal="true"
    >
      {/* Ambient Radiant Glow */}
      {glow && (
        <div
          className={`absolute inset-0 rounded-full pointer-events-none ${
            size === 'hero' ? 'animate-pulse-warm' : ''
          }`}
          style={{
            background:
              size === 'hero'
                ? 'radial-gradient(circle at 50% 55%, rgba(255, 110, 20, 0.3) 0%, rgba(255, 70, 0, 0.12) 40%, transparent 70%)'
                : 'radial-gradient(circle at 50% 50%, rgba(255, 110, 20, 0.22) 0%, transparent 65%)',
            transform: size === 'hero' ? 'scale(1.5)' : 'scale(1.25)',
            filter: size === 'hero' ? 'blur(20px)' : 'blur(10px)',
            zIndex: 0
          }}
        />
      )}

      {/* Official MSEMUN Logo Image */}
      <img
        src="/images/msemun-logo.png"
        alt="MSEMUN Official Logo"
        width={width}
        height={height}
        className={`relative z-10 w-full h-full object-contain transition-transform duration-500 ${
          size === 'hero' ? 'animate-flame' : 'group-hover:scale-105'
        }`}
        style={{
          filter: glow
            ? size === 'hero'
              ? 'drop-shadow(0 0 25px rgba(255, 110, 20, 0.45)) drop-shadow(0 0 50px rgba(255, 70, 0, 0.25))'
              : 'drop-shadow(0 0 10px rgba(255, 110, 20, 0.35))'
            : 'none'
        }}
      />
    </div>
  );
};
