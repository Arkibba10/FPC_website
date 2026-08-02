import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const FilmstripLoader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [frame, setFrame] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  // Frame counter ticking independently of the scrolling speed
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev >= 36 ? 1 : prev + 1));
    }, 120); // Steady mechanical tick

    // Auto-dismiss loader after 3 seconds
    const timeout = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        setTimeout(onComplete, 800); // Allow exit transition to complete
      }
    }, 3200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  // Format frame number like "01/36"
  const formattedFrame = frame.toString().padStart(2, '0');

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 bg-charcoal-dark z-[999] flex flex-col items-center justify-center select-none"
        >
          {/* Subtle Ambient Red Safelight Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#E11D48]/5 rounded-full blur-[120px] pointer-events-none"></div>

          {/* Projector Gate / Letterboxed Window */}
          <div className="relative w-full max-w-4xl px-4 flex flex-col items-center">
            
            {/* Projector Frame Outer Border */}
            <div className="w-full h-44 bg-black border border-white/5 rounded-2xl flex items-center justify-center overflow-hidden relative shadow-[inset_0_4px_30px_rgba(0,0,0,0.9)]">
              
              {/* Edge Fading Gradient Mask (Left & Right fade to black) */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>

              {/* Active Frame Outline (Center Safe-Light Red highlight) */}
              <div className="absolute inset-y-0 w-44 border-x border-y-0 border-[#E11D48]/80 z-30 pointer-events-none flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.15)]">
                {/* Active Frame Indicator Dot */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse"></div>
              </div>

              {/* Continuous scrolling filmstrip */}
              <div 
                className="flex absolute left-0 w-max animate-filmstrip h-32 select-none"
                style={{
                  animation: 'scrollFilmstrip 14s linear infinite',
                }}
              >
                {/* 12 duplicated frames to ensure seamless looping */}
                {Array.from({ length: 12 }).map((_, idx) => (
                  <div 
                    key={idx}
                    className="w-44 h-32 flex-shrink-0 border-r-2 border-black relative flex flex-col justify-between bg-black py-2.5"
                  >
                    {/* Top Sprocket Holes */}
                    <div className="flex justify-around px-2">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <div key={`sprocket-t-${s}`} className="w-3 h-4 bg-charcoal rounded-sm border border-white/5" />
                      ))}
                    </div>

                    {/* Frame Exposure (Abstract Moody Gradient) */}
                    <div className="flex-1 mx-1.5 my-1.5 rounded bg-gradient-to-tr from-[#1E1E1E] via-[#2D1217] to-[#121212] relative overflow-hidden flex items-center justify-center">
                      {/* Abstract Light Leak inside frame */}
                      <div className="absolute inset-0 bg-radial-leak opacity-40 mix-blend-color-dodge"></div>
                      {/* Heavy Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-85"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-85"></div>
                      
                      {/* Frame markings */}
                      <span className="absolute bottom-1 right-2 font-mono text-[7px] text-white/20 tracking-wider">
                        ISO 400
                      </span>
                    </div>

                    {/* Bottom Sprocket Holes */}
                    <div className="flex justify-around px-2">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <div key={`sprocket-b-${s}`} className="w-3 h-4 bg-charcoal rounded-sm border border-white/5" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Monospace Frame Counter & Label */}
            <div className="mt-8 flex flex-col items-center gap-1.5 font-mono text-xs tracking-[0.3em] uppercase text-white/50">
              <span className="text-[#E11D48] font-bold text-sm tracking-widest">
                {formattedFrame} <span className="text-white/30 font-normal">/ 36</span>
              </span>
              <span className="text-[10px] text-white/40 tracking-[0.4em] font-semibold animate-pulse">
                DEVELOPING
              </span>
            </div>

          </div>

          {/* CSS Animation Keyframes & Styles */}
          <style>{`
            @keyframes scrollFilmstrip {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); } /* Scroll exactly half of the duplicated strip width */
            }
            .bg-radial-leak {
              background: radial-gradient(circle, rgba(225,29,72,0.2) 0%, rgba(0,0,0,0) 70%);
            }
            /* Respect reduced-motion preferences */
            @media (prefers-reduced-motion: reduce) {
              .animate-filmstrip {
                animation: none !important;
                transform: translateX(-10%);
              }
              .animate-pulse {
                animation: none !important;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
