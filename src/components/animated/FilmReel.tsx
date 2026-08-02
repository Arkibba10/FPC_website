import React from 'react';

interface FilmReelProps {
  size?: number;
  className?: string;
  speed?: number; // duration in seconds
}

export const FilmReel: React.FC<FilmReelProps> = ({ 
  size = 120, 
  className = "",
  speed = 40
}) => {
  return (
    <div 
      className={`relative select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full animate-spin-slow hover:animate-spin-fast"
        style={{
          animation: `spinReel ${speed}s linear infinite`
        }}
      >
        {/* Outer Rim */}
        <circle cx="50" cy="50" r="45" fill="#181818" stroke="#C8A96A" strokeWidth="3" />
        <circle cx="50" cy="50" r="41" stroke="#2A2A2A" strokeWidth="1" />

        {/* Inner Hub */}
        <circle cx="50" cy="50" r="14" fill="#2A2A2A" stroke="#C8A96A" strokeWidth="2" />
        <circle cx="50" cy="50" r="5" fill="#111" />

        {/* Film Spokes & Reels Holes (5 holes) */}
        <g stroke="#C8A96A" strokeWidth="1.5">
          {/* Spoke lines */}
          <line x1="50" y1="14" x2="50" y2="41" />
          <line x1="15.8" y1="39.5" x2="41.7" y2="47.3" />
          <line x1="28.9" y1="79.1" x2="44.8" y2="58.5" />
          <line x1="71.1" y1="79.1" x2="55.2" y2="58.5" />
          <line x1="84.2" y1="39.5" x2="58.3" y2="47.3" />
        </g>

        {/* Outer Circular Film Holes */}
        <circle cx="50" cy="24" r="7" fill="#111" stroke="#C8A96A" strokeWidth="1.5" />
        <circle cx="25.3" cy="41.9" r="7" fill="#111" stroke="#C8A96A" strokeWidth="1.5" />
        <circle cx="34.7" cy="71" r="7" fill="#111" stroke="#C8A96A" strokeWidth="1.5" />
        <circle cx="65.3" cy="71" r="7" fill="#111" stroke="#C8A96A" strokeWidth="1.5" />
        <circle cx="74.7" cy="41.9" r="7" fill="#111" stroke="#C8A96A" strokeWidth="1.5" />

        {/* Film strip wrapping effect (Decorative) */}
        <path d="M 50,5 A 45,45 0 0,1 95,50" stroke="#C8A96A" strokeWidth="0.5" strokeDasharray="3 3" />
      </svg>

      {/* CSS Keyframes injected directly */}
      <style>{`
        @keyframes spinReel {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
