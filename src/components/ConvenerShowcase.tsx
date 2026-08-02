import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useClub } from '../context/useClub';
import { Mail, Phone, Quote } from 'lucide-react';

export const ConvenerShowcase: React.FC = () => {
  const { convener } = useClub();
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView && videoRef.current && !videoFailed) {
      videoRef.current.play().catch(() => setVideoFailed(true));
    }
  }, [isInView, videoFailed]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-beige py-24 px-6 md:px-12 flex items-center justify-center overflow-hidden"
    >
      {/* Background Spotlight glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left Column: Portrait (lg:col-span-5) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group w-full max-w-[380px] aspect-[3/4]">
            
            {/* Subtle Spotlight behind portrait */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-burgundy/10 to-gold/20 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

            {/* Frame accent */}
            <div className="absolute inset-0 border border-gold/30 rounded-2xl translate-x-3 translate-y-3 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-500 -z-10" />

            {/* Main Portrait Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-charcoal/5 bg-charcoal"
            >
              {isInView && !videoFailed ? (
                <video
                  ref={videoRef}
                  src="/videos/convener.mov"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  muted
                  playsInline
                  preload="metadata"
                  poster={convener.photo}
                  onError={() => setVideoFailed(true)}
                  onEnded={(e) => e.currentTarget.pause()}
                />
              ) : (
                <img
                  src={convener.photo}
                  alt={convener.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
              )}
              {/* Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-40" />
            </motion.div>

            {/* Floating Camera Icon Badge */}
            <div className="absolute -bottom-5 -right-5 bg-burgundy text-gold border border-gold/40 p-4 rounded-2xl shadow-2xl flex items-center justify-center">
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                CONVENER // FPC
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Message & Info (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <span className="text-burgundy font-mono uppercase tracking-widest text-xs block mb-3">
              Leadership Welcome
            </span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal leading-tight">
              {convener.name}
            </h2>
            <p className="text-sm font-mono text-burgundy uppercase tracking-widest mt-2">
              {convener.designation}
            </p>
            <div className="w-20 h-[1px] bg-burgundy/40 mt-6"></div>
          </motion.div>

          {/* Quote Block */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative bg-white/40 border border-charcoal/5 p-6 rounded-2xl mb-8 shadow-sm backdrop-blur-sm"
          >
            <Quote className="absolute -top-4 -left-4 text-gold/30 w-10 h-10 fill-gold/10" />
            <p className="font-playfair italic text-lg text-charcoal/90 leading-relaxed pl-4">
              "{convener.quote}"
            </p>
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-charcoal/80 text-sm leading-relaxed space-y-4 mb-8 font-sans"
          >
            <p>{convener.welcomeMessage}</p>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-6 text-xs font-mono text-charcoal/60 pt-6 border-t border-charcoal/10"
          >
            <a
              href={`mailto:${convener.email}`}
              className="flex items-center gap-2 hover:text-burgundy transition-colors duration-300"
            >
              <Mail size={14} className="text-burgundy" />
              <span>{convener.email}</span>
            </a>
            {convener.phone && (
              <a
                href={`tel:${convener.phone}`}
                className="flex items-center gap-2 hover:text-burgundy transition-colors duration-300"
              >
                <Phone size={14} className="text-burgundy" />
                <span>{convener.phone}</span>
              </a>
            )}
          </motion.div>
        </div>

      </div>
    </section>
  );
};
