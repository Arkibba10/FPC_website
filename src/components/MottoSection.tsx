import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useClub } from '../context/useClub';

export const MottoSection: React.FC = () => {
  const { settings } = useClub();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll tracking for parallax collage
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const y2 = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const y4 = useTransform(scrollYProgress, [0, 1], [35, -35]);

  // Split motto into words/lines
  const mottoText = settings?.motto || "WE DO NOT CAPTURE SUBJECTS. WE CAPTURE THE SOUL, THE LIGHT, THE EMOTION, AND THE UNTOLD NARRATIVES THAT LINGER IN THE SHADOWS.";
  const lines = mottoText.split('. ');

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden py-24 px-6 md:px-12"
    >
      {/* Film Texture & Light Leaks Overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none z-10"></div>
      
      {/* Animated Light Leaks */}
      <div className="absolute inset-0 pointer-events-none z-10 mix-blend-screen opacity-40">
        <div className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] bg-radial-leak-1 animate-leak-1 rounded-full blur-[100px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] bg-radial-leak-2 animate-leak-2 rounded-full blur-[100px]" />
      </div>

      {/* Faint Collage of Photographs (Parallax Background) */}
      <div className="absolute inset-0 w-full h-full opacity-15 pointer-events-none select-none">
        
        {/* Photo 1 - Top Left */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-[12%] left-[6%] w-[160px] md:w-[240px] aspect-[4/3] rounded-lg overflow-hidden border border-white/10 rotate-[-6deg] shadow-2xl"
        >
          <img
            src="/images/gallery1.jpg"
            alt="Collage 1"
            className="w-full h-full object-cover grayscale"
          />
        </motion.div>

        {/* Photo 2 - Top Right */}
        <motion.div
          style={{ y: y2 }}
          className="absolute top-[18%] right-[9%] w-[140px] md:w-[210px] aspect-[3/4] rounded-lg overflow-hidden border border-white/10 rotate-[8deg] shadow-2xl"
        >
          <img
            src="/images/gallery2.jpg"
            alt="Collage 2"
            className="w-full h-full object-cover grayscale"
          />
        </motion.div>

        {/* Photo 3 - Bottom Left */}
        <motion.div
          style={{ y: y3 }}
          className="absolute bottom-[12%] left-[11%] w-[140px] md:w-[220px] aspect-[3/4] rounded-lg overflow-hidden border border-white/10 rotate-[4deg] shadow-2xl"
        >
          <img
            src="/images/gallery3.jpg"
            alt="Collage 3"
            className="w-full h-full object-cover grayscale"
          />
        </motion.div>

        {/* Photo 4 - Bottom Right */}
        <motion.div
          style={{ y: y4 }}
          className="absolute bottom-[14%] right-[6%] w-[180px] md:w-[260px] aspect-[16/10] rounded-lg overflow-hidden border border-white/10 rotate-[-5deg] shadow-2xl"
        >
          <img
            src="/images/gallery4.jpg"
            alt="Collage 4"
            className="w-full h-full object-cover grayscale"
          />
        </motion.div>
      </div>

      {/* Fullscreen Editorial Content (Minimalist & Elegantly Proportioned) */}
      <div className="max-w-3xl mx-auto text-center z-20 relative">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-gold font-mono uppercase tracking-[0.25em] text-[10px] block mb-6"
        >
          ✦ OUR MANIFESTO ✦
        </motion.span>

        <div className="space-y-4">
          {lines.map((line, idx) => {
            if (!line.trim()) return null;
            const text = line.endsWith('.') ? line : line + '.';
            return (
              <div key={idx} className="overflow-hidden">
                <motion.h2
                  initial={{ y: '100%', opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 1.1,
                    delay: idx * 0.2,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-playfair font-medium text-white/90 leading-relaxed tracking-wide"
                >
                  {idx === 0 ? (
                    <span>{text}</span>
                  ) : (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/90 via-gold/80 to-white/70 italic font-normal">
                      {text}
                    </span>
                  )}
                </motion.h2>
              </div>
            );
          })}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.6, ease: 'easeInOut' }}
          className="w-20 h-[1px] bg-gold/30 mx-auto mt-10"
        ></motion.div>
      </div>

      <style>{`
        .bg-radial-leak-1 {
          background: radial-gradient(circle, rgba(110,30,42,0.25) 0%, rgba(200,169,106,0.08) 50%, rgba(0,0,0,0) 100%);
        }
        .bg-radial-leak-2 {
          background: radial-gradient(circle, rgba(200,169,106,0.15) 0%, rgba(110,30,42,0.1) 50%, rgba(0,0,0,0) 100%);
        }
        @keyframes leak1 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(40px, 20px) scale(1.1) rotate(180deg); }
          100% { transform: translate(0, 0) scale(1) rotate(360deg); }
        }
        @keyframes leak2 {
          0% { transform: translate(0, 0) scale(1.05) rotate(0deg); }
          50% { transform: translate(-30px, -15px) scale(0.95) rotate(-180deg); }
          100% { transform: translate(0, 0) scale(1.05) rotate(-360deg); }
        }
        .animate-leak-1 {
          animation: leak1 25s ease-in-out infinite;
        }
        .animate-leak-2 {
          animation: leak2 20s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
