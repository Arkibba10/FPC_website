import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PolaroidProps {
  image: string;
  caption: string;
  rotate?: number;
  className?: string;
  width?: number;
}

export const Polaroid: React.FC<PolaroidProps> = ({ 
  image, 
  caption, 
  rotate = -4, 
  className = "",
  width = 180
}) => {
  // Generate a static serial number once on mount to preserve purity in render
  const [serial] = useState(() => Math.floor(1000 + Math.random() * 9000));

  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      whileDrag={{ scale: 1.08, zIndex: 40, rotate: rotate + 5 }}
      whileHover={{ scale: 1.04, rotate: rotate - 2, zIndex: 30 }}
      initial={{ rotate, opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", damping: 15 }}
      className={`bg-[#F9F8F6] p-3 pb-6 rounded-sm shadow-[0_10px_25px_rgba(0,0,0,0.25)] border border-white/40 flex flex-col items-center cursor-grab active:cursor-grabbing relative select-none flex-shrink-0 ${className}`}
      style={{ width }}
    >
      {/* Matte Tape at top */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 bg-white/30 backdrop-blur-[1px] rotate-[-2deg] border-x border-dashed border-black/5 shadow-sm"></div>

      {/* Photo area */}
      <div className="w-full aspect-square overflow-hidden bg-black border border-black/10 rounded-sm mb-3 relative">
        <img 
          src={image} 
          alt={caption} 
          className="w-full h-full object-cover pointer-events-none" 
          loading="lazy"
        />
        {/* Film sheen overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 mix-blend-overlay"></div>
      </div>

      {/* Caption (Handwritten style) */}
      <p className="font-playfair italic text-xs text-charcoal/80 text-center font-semibold tracking-wide truncate w-full">
        {caption}
      </p>

      {/* Tiny decorative serial number */}
      <div className="absolute bottom-1 right-2 text-[6px] font-mono text-black/20">
        FPC-{serial}
      </div>
    </motion.div>
  );
};
