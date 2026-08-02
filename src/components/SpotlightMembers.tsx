import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Facebook, Linkedin, Instagram, Mail } from 'lucide-react';
import { Member } from '../types';

interface SpotlightMembersProps {
  members: Member[];
}

export const SpotlightMembers: React.FC<SpotlightMembersProps> = ({ members }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.15 });

  // Render a single member card as a LONG RECTANGLE with the picture taking most of the space
  const renderCard = (member: Member) => {
    return (
      <div
        key={member.id}
        className="relative flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-charcoal-dark/80 text-white transition-all duration-500 w-full aspect-[10/16] max-w-[280px] mx-auto group hover:border-gold/40 hover:shadow-[0_0_30px_rgba(200,169,106,0.15)]"
      >
        {/* Full-bleed/Large Photo taking 78% of the card */}
        <div className="relative h-[78%] w-full overflow-hidden bg-black">
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-105 grayscale-[15%] group-hover:grayscale-0 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
          {/* Subtle vignette inside photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
          
          <div className="absolute top-4 right-4 bg-burgundy/80 text-gold border border-gold/30 text-[8px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            CSE-UAP
          </div>
        </div>

        {/* Editorial Text Area at the bottom (Latter 22%) */}
        <div className="h-[22%] p-4 flex flex-col justify-center bg-charcoal-dark/95 border-t border-white/5 relative">
          <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>

          <h3 className="font-playfair text-base md:text-lg font-bold truncate text-gold group-hover:text-white transition-colors duration-300">
            {member.name}
          </h3>
          
          <div className="flex items-center justify-between gap-2 mt-1">
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/80 truncate">
              {member.position}
            </p>
            <p className="text-[10px] font-mono text-gold/60">
              {member.batch}
            </p>
          </div>

          {/* Hover Overlay Social Links */}
          <div className="absolute inset-0 bg-charcoal/95 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 px-4">
            {member.facebook && (
              <a
                href={member.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 text-white hover:bg-burgundy hover:text-gold hover:scale-110 transition-all"
              >
                <Facebook size={14} />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 text-white hover:bg-burgundy hover:text-gold hover:scale-110 transition-all"
              >
                <Linkedin size={14} />
              </a>
            )}
            {member.instagram && (
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 text-white hover:bg-burgundy hover:text-gold hover:scale-110 transition-all"
              >
                <Instagram size={14} />
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="p-2 rounded-full bg-white/5 text-white hover:bg-burgundy hover:text-gold hover:scale-110 transition-all"
              >
                <Mail size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen bg-charcoal py-24 px-4 md:px-12 flex flex-col justify-center overflow-hidden"
    >
      {/* Background soft ambient spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-burgundy/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Editorial Header */}
      <div className="max-w-6xl mx-auto w-full mb-16 z-20">
        <span className="text-gold font-mono uppercase tracking-widest text-xs block mb-3">
          Behind the Lenses
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white leading-tight">
          Executive <span className="italic text-gold font-normal">Members</span>
        </h2>
        <div className="w-20 h-[1px] bg-gold/40 mt-6"></div>
      </div>

      {/* Realistic Professional Video Camera sliding in from left */}
      <motion.div
        initial={{ x: -200, opacity: 0, rotate: -10 }}
        animate={isInView ? { x: 0, opacity: 1, rotate: 0 } : { x: -200, opacity: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 60 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center z-30 pointer-events-none"
      >
        {/* Cinema Video Camera SVG */}
        <svg
          width="180"
          height="160"
          viewBox="0 0 180 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
        >
          {/* Top Handle */}
          <rect x="35" y="15" width="75" height="10" rx="3" fill="#3a3a3a" />
          <path d="M50 25V35H95V25" stroke="#2a2a2a" strokeWidth="4" />
          
          {/* Dual Film Reels on top */}
          <circle cx="60" cy="15" r="15" fill="#1e1e1e" stroke="#c8a96a" strokeWidth="1.5" />
          <circle cx="60" cy="15" r="5" fill="#3a3a3a" />
          <circle cx="95" cy="15" r="15" fill="#1e1e1e" stroke="#c8a96a" strokeWidth="1.5" />
          <circle cx="95" cy="15" r="5" fill="#3a3a3a" />

          {/* Main Camera Body */}
          <rect x="30" y="35" width="90" height="70" rx="6" fill="#1c1c1c" stroke="#2d2d2d" strokeWidth="2" />
          
          {/* Side monitor/controls */}
          <rect x="40" y="45" width="50" height="35" rx="3" fill="#111" />
          <rect x="45" y="50" width="40" height="25" rx="1" fill="#6e1e2a" opacity="0.3" />
          <circle cx="102" cy="52" r="4" fill="#6e1e2a" className="animate-pulse" /> {/* Recording LED */}
          <rect x="105" y="65" width="8" height="25" rx="2" fill="#3a3a3a" />

          {/* Lens Mount & Large Lens */}
          <path d="M120 50 L140 45 L140 90 L120 85 Z" fill="#2d2d2d" stroke="#3a3a3a" />
          <rect x="140" y="40" width="25" height="55" rx="4" fill="#111" stroke="#c8a96a" strokeWidth="1" />
          <circle cx="152" cy="67" r="18" fill="#1a1a1a" />
          {/* Lens Glass */}
          <circle cx="152" cy="67" r="12" fill="url(#lensGrad)" />

          {/* Matte Box / Barn doors */}
          <path d="M165 48 L178 35 M165 87 L178 100" stroke="#3a3a3a" strokeWidth="3" />
          <rect x="163" y="45" width="4" height="44" fill="#3a3a3a" />

          <defs>
            <radialGradient id="lensGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c8a96a" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#6e1e2a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#111" />
            </radialGradient>
          </defs>
        </svg>

        {/* Camera Stand/Tripod Head */}
        <div className="w-12 h-8 bg-charcoal-dark border-t-2 border-white/10 rounded-b-lg"></div>
        <div className="w-1 h-20 bg-gradient-to-b from-white/20 to-transparent"></div>

        {/* Decorative ambient spotlight beam projected from camera lens */}
        <svg className="absolute top-[67px] left-[152px] w-[1200px] h-[600px] pointer-events-none origin-left overflow-visible z-10 opacity-15">
          <defs>
            <linearGradient id="beamGrad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#C8A96A" stopOpacity="0.3" />
              <stop offset="40%" stopColor="#C8A96A" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#C8A96A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points="0,0 800,-250 800,250"
            fill="url(#beamGrad)"
          />
        </svg>
      </motion.div>

      {/* Main Grid Area (Fully illuminated and visible without spotlight mask) */}
      <div
        className="relative max-w-6xl mx-auto w-full z-20"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {members.map(member => renderCard(member))}
        </div>
      </div>
    </div>
  );
};
