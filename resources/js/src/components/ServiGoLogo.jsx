import React from 'react';

export default function ServiGoLogo({ className = "h-9 w-auto" }) {
  return (
    <div className="flex items-center space-x-3 group shrink-0">
      {/* Flame + Lightning Icon */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg 
          viewBox="0 0 44 44" 
          className="w-10 h-10 drop-shadow-[0_2px_12px_rgba(255,107,0,0.6)] group-hover:scale-105 transition-transform duration-300" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="flameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff8533" />
              <stop offset="50%" stopColor="#ff5500" />
              <stop offset="100%" stopColor="#e63900" />
            </linearGradient>
            <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ffdd99" />
            </linearGradient>
            <filter id="flameGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ff5500" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Outer Stylized Flame Silhouette */}
          <path 
            d="M22 2C24 7 30 11 32 18C34 25 31 32 25 37C32 34 36 27 34 19C33 14 29 9 26 5C25 4 23 2.5 22 2Z" 
            fill="url(#flameGrad)" 
            opacity="0.85"
          />
          <path 
            d="M21 3C15 8 10 16 11 25C12 33 18 41 27 42C18 42 7 34 7 24C7 16 12 9 17 4C18 3 20 2 21 3Z" 
            fill="url(#flameGrad)" 
            filter="url(#flameGlow)"
          />
          <path 
            d="M17 14C19 11 22 8 25 6C23 10 24 14 27 17C29 19 30 22 29 25C27 23 25 21 23 21C20 21 18 23 17 26C16 29 17 33 21 36C15 35 12 30 12 25C12 20 15 16 17 14Z" 
            fill="#ff7700"
          />

          {/* Dynamic Lightning Bolt Cutting Through Flame */}
          <path 
            d="M24 8L15 22H21L17 34L28 19H22L24 8Z" 
            fill="url(#flameGrad)" 
            stroke="#0b0f17" 
            strokeWidth="1.5" 
            strokeLinejoin="round"
          />
          <path 
            d="M23.5 9L16 21.5H21.5L18 32.5L27 19.5H22L23.5 9Z" 
            fill="#ffaa00" 
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center select-none">
        <div className="flex items-center text-2xl font-black tracking-tight leading-none mb-1">
          <span className="text-white">Servi-</span>
          <span className="text-[#ff6b00]">Go</span>
        </div>
        <span className="text-[10px] font-bold text-zinc-300 tracking-[0.22em] uppercase leading-none">
          Directorio Local
        </span>
      </div>
    </div>
  );
}
