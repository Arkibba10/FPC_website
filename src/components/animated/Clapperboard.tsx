import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const Clapperboard: React.FC<{ size?: number; className?: string }> = ({ size = 64, className = "" }) => {
  const [isSnapping, setIsSnapping] = useState(false);

  const handleClap = () => {
    if (isSnapping) return;
    setIsSnapping(true);
    // After animation completes, reset
    setTimeout(() => setIsSnapping(false), 600);
  };

  return (
    <div 
      onClick={handleClap}
      onMouseEnter={handleClap}
      className={`cursor-pointer select-none relative flex flex-col items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
      >
        {/* Clapperboard Base (Bottom) */}
        <rect x="15" y="45" width="70" height="40" rx="4" fill="#2A2A2A" stroke="#C8A96A" strokeWidth="2.5" />
        
        {/* Board Slate text */}
        <text x="50" y="62" fill="#C8A96A" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          SCENE: UAP
        </text>
        <text x="50" y="73" fill="#C8A96A" fontSize="6" fontFamily="monospace" textAnchor="middle">
          TAKE: CSE-FPC
        </text>
        <text x="50" y="81" fill="rgba(255,255,255,0.4)" fontSize="4" fontFamily="monospace" textAnchor="middle">
          DIR: ADVISED // CAM: STUDENT
        </text>

        {/* Hinge Pin */}
        <circle cx="20" cy="42" r="3" fill="#C8A96A" />

        {/* Clapper Top Bar (Pivot Point at left, bottom of top bar, i.e., x=20, y=42) */}
        <motion.g
          style={{ originX: '20px', originY: '42px' }}
          animate={
            isSnapping 
              ? { rotate: [0, -28, 2, -1, 0] } 
              : { rotate: 0 }
          }
          transition={{ 
            duration: 0.55, 
            ease: "easeInOut" 
          }}
        >
          {/* Top Bar Body */}
          <path
            d="M15 32 L85 32 L85 42 L15 42 Z"
            fill="#1E1E1E"
            stroke="#C8A96A"
            strokeWidth="2.5"
          />
          {/* Stripes on Top Bar */}
          <path d="M25 32 L35 42" stroke="#FFFFFF" strokeWidth="3" />
          <path d="M45 32 L55 42" stroke="#FFFFFF" strokeWidth="3" />
          <path d="M65 32 L75 42" stroke="#FFFFFF" strokeWidth="3" />
        </motion.g>

        {/* Fixed hinge base */}
        <path d="M15 42 L85 42" stroke="#C8A96A" strokeWidth="3" />
      </svg>
      {isSnapping && (
        <span className="absolute -top-6 bg-burgundy text-gold font-mono text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider animate-bounce">
          Action!
        </span>
      )}
    </div>
  );
};
