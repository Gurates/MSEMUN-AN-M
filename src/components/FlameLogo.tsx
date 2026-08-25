import React from 'react';

interface FlameLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  className?: string;
  glow?: boolean;
}

export const FlameLogo: React.FC<FlameLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  glow = true
}) => {
  const sizeMap = {
    sm: { width: 44, height: 52 },
    md: { width: 80, height: 96 },
    lg: { width: 160, height: 192 },
    hero: { width: 280, height: 336 }
  };

  const { width, height } = sizeMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width, height }}
      data-flame-focal="true"
    >
      {/* Ambient Radiant Glow under hero / large sizes */}
      {glow && (
        <div
          className={`absolute inset-0 rounded-full pointer-events-none ${
            size === 'hero' ? 'animate-pulse-warm' : ''
          }`}
          style={{
            background:
              size === 'hero'
                ? 'radial-gradient(circle at 50% 55%, rgba(255, 110, 20, 0.25) 0%, rgba(255, 70, 0, 0.1) 40%, transparent 70%)'
                : 'radial-gradient(circle at 50% 50%, rgba(255, 110, 20, 0.18) 0%, transparent 65%)',
            transform: size === 'hero' ? 'scale(1.7)' : 'scale(1.3)',
            filter: size === 'hero' ? 'blur(20px)' : 'blur(10px)',
            zIndex: 0
          }}
        />
      )}

      <svg
        viewBox="0 0 240 280"
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`relative z-10 transition-transform duration-500 ${
          size === 'hero' ? 'animate-flame' : ''
        }`}
        style={{
          filter: glow
            ? size === 'hero'
              ? 'drop-shadow(0 0 25px rgba(255, 110, 20, 0.45)) drop-shadow(0 0 60px rgba(255, 70, 0, 0.25))'
              : 'drop-shadow(0 0 10px rgba(255, 110, 20, 0.35))'
            : 'none'
        }}
      >
        <defs>
          {/* Flame Gradient */}
          <linearGradient id="flameGradPrimary" x1="120" y1="230" x2="120" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d83a00" />
            <stop offset="25%" stopColor="#ff5722" />
            <stop offset="60%" stopColor="#ff8c00" />
            <stop offset="85%" stopColor="#ffb703" />
            <stop offset="100%" stopColor="#fff3b0" />
          </linearGradient>

          {/* Flame Inner Core Gradient */}
          <linearGradient id="flameGradCore" x1="120" y1="210" x2="120" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ff6700" />
            <stop offset="40%" stopColor="#ffa200" />
            <stop offset="90%" stopColor="#fff8e7" />
          </linearGradient>

          {/* Laurel Wreath Royal Blue Gradient */}
          <linearGradient id="wreathBlueGrad" x1="20" y1="250" x2="220" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="35%" stopColor="#2563eb" />
            <stop offset="70%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>

          {/* Text Curved Path */}
          <path
            id="textArcPath"
            d="M 52,92 A 86,86 0 0,1 188,92"
            fill="none"
          />

          {/* Laurel Leaf Filter */}
          <filter id="leafShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* ================= ARCHED TEXT (MSEMUN) ================= */}
        {showText && (
          <g className="font-display font-bold">
            {/* Background text outline / shadow */}
            <text
              fill="#1e3a8a"
              fontSize="24"
              letterSpacing="3"
              fontWeight="900"
              style={{ textAnchor: 'middle' }}
            >
              <textPath href="#textArcPath" startOffset="50%">
                MSEMUN
              </textPath>
            </text>
            <text
              fill="url(#wreathBlueGrad)"
              fontSize="23"
              letterSpacing="3"
              fontWeight="900"
              style={{ textAnchor: 'middle' }}
            >
              <textPath href="#textArcPath" startOffset="50%">
                MSEMUN
              </textPath>
            </text>
          </g>
        )}

        {/* ================= LAUREL WREATH (LEFT BRANCH) ================= */}
        <g id="leftWreath" fill="url(#wreathBlueGrad)" filter="url(#leafShadow)">
          {/* Main left stem curve */}
          <path
            d="M 120,244 C 95,244 54,228 36,182 C 22,146 25,108 42,84 C 44,81 48,83 47,87 C 32,109 30,143 42,176 C 58,218 94,233 118,236 Z"
            opacity="0.95"
          />

          {/* Left Branch Leaves - Arranged dynamically up the curve */}
          {/* Base leaves */}
          <path d="M 112,238 C 96,242 78,252 64,258 C 76,248 88,236 102,234 Z" />
          <path d="M 100,230 C 82,236 62,242 46,244 C 60,234 76,224 92,222 Z" />
          
          {/* Lower quadrant */}
          <path d="M 76,220 C 58,226 38,228 24,226 C 38,214 56,206 72,208 Z" />
          <path d="M 64,204 C 44,208 26,208 14,202 C 28,190 48,184 62,190 Z" />
          <path d="M 52,184 C 34,186 18,180 8,170 C 22,160 42,158 52,170 Z" />
          
          {/* Mid quadrant */}
          <path d="M 44,162 C 28,160 14,150 6,138 C 20,132 38,134 46,148 Z" />
          <path d="M 40,138 C 26,132 14,120 8,106 C 22,104 38,110 44,124 Z" />
          
          {/* Upper quadrant */}
          <path d="M 40,114 C 28,104 20,90 18,74 C 30,76 42,86 46,102 Z" />
          <path d="M 46,92 C 36,80 32,64 34,48 C 44,54 52,66 54,82 Z" />
          <path d="M 58,74 C 52,60 52,44 58,30 C 64,40 70,54 68,68 Z" />
        </g>

        {/* ================= LAUREL WREATH (RIGHT BRANCH) ================= */}
        <g id="rightWreath" fill="url(#wreathBlueGrad)" filter="url(#leafShadow)">
          {/* Main right stem curve */}
          <path
            d="M 120,244 C 145,244 186,228 204,182 C 218,146 215,108 198,84 C 196,81 192,83 193,87 C 208,109 210,143 198,176 C 182,218 146,233 122,236 Z"
            opacity="0.95"
          />

          {/* Right Branch Leaves */}
          {/* Base leaves */}
          <path d="M 128,238 C 144,242 162,252 176,258 C 164,248 152,236 138,234 Z" />
          <path d="M 140,230 C 158,236 178,242 194,244 C 180,234 164,224 148,222 Z" />
          
          {/* Lower quadrant */}
          <path d="M 164,220 C 182,226 202,228 216,226 C 202,214 184,206 168,208 Z" />
          <path d="M 176,204 C 196,208 214,208 226,202 C 212,190 192,184 178,190 Z" />
          <path d="M 188,184 C 206,186 222,180 232,170 C 218,160 198,158 188,170 Z" />
          
          {/* Mid quadrant */}
          <path d="M 196,162 C 212,160 226,150 234,138 C 220,132 202,134 194,148 Z" />
          <path d="M 200,138 C 214,132 226,120 232,106 C 218,104 202,110 196,124 Z" />
          
          {/* Upper quadrant */}
          <path d="M 200,114 C 212,104 220,90 222,74 C 210,76 198,86 194,102 Z" />
          <path d="M 194,92 C 204,80 208,64 206,48 C 196,54 188,66 186,82 Z" />
          <path d="M 182,74 C 188,60 188,44 182,30 C 176,40 170,54 172,68 Z" />
        </g>

        {/* Branch Tie Ribbons at bottom */}
        <g fill="url(#wreathBlueGrad)">
          <path d="M 112,238 C 104,248 94,258 84,266 C 96,260 110,248 116,240 Z" />
          <path d="M 128,238 C 136,248 146,258 156,266 C 144,260 130,248 124,240 Z" />
          <circle cx="120" cy="240" r="5" fill="#2563eb" />
        </g>

        {/* ================= CENTRAL FLAME (TORCH OF DIPLOMACY) ================= */}
        {/* Outer Flame Shadow / Radiance */}
        <g>
          {/* Outer Main Flame Body */}
          <path
            d="M 118,230 
               C 92,216 70,178 72,138 
               C 74,106 94,84 98,54 
               C 100,40 96,24 92,10 
               C 106,28 122,58 120,86 
               C 128,70 132,52 130,34 
               C 142,54 150,80 144,108 
               C 160,94 164,76 162,58 
               C 174,78 178,110 166,138 
               C 156,160 142,176 146,196 
               C 148,206 142,218 132,226 
               Z"
            fill="url(#flameGradPrimary)"
          />

          {/* Left Flowing Flame Flake */}
          <path
            d="M 114,228 
               C 86,210 68,172 74,136 
               C 78,112 90,96 94,76 
               C 86,96 82,120 90,144 
               C 96,162 108,178 106,204 
               Z"
            fill="#ff3d00"
            opacity="0.85"
          />

          {/* Right Secondary Tongue of Flame */}
          <path
            d="M 124,228 
               C 144,204 158,172 152,136 
               C 148,114 136,96 140,74 
               C 148,94 156,118 152,142 
               C 148,166 134,188 132,214 
               Z"
            fill="#ff6d00"
            opacity="0.9"
          />

          {/* Inner Golden Luminescent Core */}
          <path
            d="M 118,218 
               C 102,196 92,166 96,132 
               C 98,108 108,90 112,68 
               C 116,88 124,106 122,128 
               C 128,114 132,98 130,82 
               C 138,98 142,120 136,142 
               C 132,158 122,172 126,190 
               Z"
            fill="url(#flameGradCore)"
          />

          {/* High Incandescent Flame Tip / Heart Spark */}
          <path
            d="M 118,198 
               C 110,182 106,160 108,138 
               C 110,122 116,108 118,92 
               C 120,106 124,120 122,134 
               C 126,146 124,162 120,182 
               Z"
            fill="#ffffff"
            opacity="0.8"
          />
        </g>
      </svg>
    </div>
  );
};
