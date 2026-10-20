import React from 'react';

export default function ServiGoLogo({ className = "h-[76px] sm:h-[88px] w-auto", showText = true }) {
  return (
    <div className="flex items-center space-x-3 group shrink-0 select-none">
      <div className="relative shrink-0">
        <img 
          src="/uploads/servigo-icon.png" 
          alt="Servi-Go" 
          className={`${className} object-contain drop-shadow-[0_4px_12px_rgba(255,0,0,0.3)] group-hover:drop-shadow-[0_4px_20px_rgba(255,0,0,0.6)] group-hover:scale-105 transition-all duration-300`}
        />
      </div>
      {showText && (
        <div className="hidden sm:flex flex-col justify-center">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] via-[#ff8c00] to-[#ff3b00] drop-shadow-[0_2px_4px_rgba(255,107,0,0.4)] leading-none mb-1">
            Servi-Go
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-zinc-400 tracking-[0.2em] uppercase leading-none">
            Directorio Local
          </span>
        </div>
      )}
    </div>
  );
}
