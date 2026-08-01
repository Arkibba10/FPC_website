import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Facebook, Linkedin, Instagram, Mail, Quote } from 'lucide-react';
import { Member } from '../types';

interface SpotlightMembersProps {
  members: Member[];
}

const ROLES = [
  'president',
  'vice president',
  'general secretary',
  'joint secretary',
  'treasurer',
  'secretary',
  'event coordinator',
  'creative head',
  'media head',
  'web master',
  'executive member',
  'member',
];

const roleRank = (position: string) => {
  const s = position.toLowerCase();
  const idx = ROLES.findIndex((r) => s.includes(r));
  return idx === -1 ? ROLES.length + 100 : idx;
};

const MemberCard: React.FC<{ member: Member; index: number }> = ({ member, index }) => (
  <div className="flex flex-col md:flex-row items-center md:items-center gap-10 md:gap-14 lg:gap-16 flex-shrink-0">
    {/* Large rounded portrait — left */}
    <div className="relative group w-auto h-[44vh] md:h-[60vh] lg:h-[64vh] aspect-[3/4] flex-shrink-0">
      {/* Soft spotlight behind portrait */}
      <div className="absolute -inset-3 bg-gradient-to-tr from-burgundy/10 to-gold/20 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

      {/* Gold frame accent */}
      <div className="absolute inset-0 border border-gold/30 rounded-3xl translate-x-3 translate-y-3 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-500 -z-10" />

      {/* Portrait container */}
      <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-charcoal/5 bg-charcoal">
        <img
          src={member.photo}
          alt={member.name}
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent opacity-30" />
      </div>

      {/* Hierarchy / Rank Badge */}
      <div className="absolute top-4 left-4 z-20 w-14 h-14 rounded-2xl bg-burgundy text-gold border border-gold/40 shadow-2xl flex flex-col items-center justify-center">
        <span className="font-mono text-base font-bold leading-none">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="text-[7px] font-mono uppercase tracking-widest mt-1">
          {index === 0 ? 'Lead' : 'Exec'}
        </span>
      </div>

      {/* Batch chip */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/85 text-charcoal/70 text-[10px] font-mono px-3 py-1 rounded-full border border-charcoal/10 uppercase tracking-wider">
        {member.batch}
      </div>
    </div>

    {/* Editorial details — right of the portrait, outside the image box */}
    <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left min-w-[240px] max-w-[480px] flex-1">
      {/* Small uppercase role label */}
      <span className="text-burgundy font-mono uppercase tracking-[0.25em] text-[11px] block mb-3">
        Executive {String(index + 1).padStart(2, '0')}
      </span>

      {/* Elegant large serif name */}
      <h3 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-charcoal leading-[1.05]">
        {member.name}
      </h3>

      {/* Uppercase position / title */}
      <p className="text-xs md:text-sm font-mono text-burgundy uppercase tracking-widest mt-3">
        {member.position}
      </p>

      {/* Short burgundy divider */}
      <div className="w-16 h-[1px] bg-burgundy/40 my-6"></div>

      {/* Subtle quote / message card */}
      {member.quote && (
        <div className="relative bg-white/40 border border-charcoal/5 p-5 rounded-2xl shadow-sm backdrop-blur-sm w-full">
          <Quote className="absolute -top-3 -left-3 text-gold/30 w-8 h-8 fill-gold/10" />
          <p className="font-playfair italic text-lg text-charcoal/90 leading-relaxed pl-4">
            "{member.quote}"
          </p>
        </div>
      )}

      {/* Short bio */}
      {member.bio && (
        <p className="text-sm text-charcoal/70 leading-relaxed mt-5 font-sans w-full">
          {member.bio}
        </p>
      )}

      {/* Contact & social information — bottom */}
      <div className="mt-7 pt-6 border-t border-charcoal/10 w-full flex flex-wrap items-center gap-x-6 gap-y-4 justify-center md:justify-start">
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-2 text-xs font-mono text-charcoal/60 hover:text-burgundy transition-colors duration-300"
          >
            <Mail size={14} className="text-burgundy" />
            <span className="break-all">{member.email}</span>
          </a>
        )}
        <div className="flex items-center gap-2">
          {member.facebook && (
            <a
              href={member.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on Facebook`}
              className="p-2 rounded-full bg-white/60 text-charcoal/70 border border-charcoal/15 hover:bg-burgundy hover:text-gold hover:border-burgundy hover:scale-110 transition-all"
            >
              <Facebook size={14} />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              className="p-2 rounded-full bg-white/60 text-charcoal/70 border border-charcoal/15 hover:bg-burgundy hover:text-gold hover:border-burgundy hover:scale-110 transition-all"
            >
              <Linkedin size={14} />
            </a>
          )}
          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on Instagram`}
              className="p-2 rounded-full bg-white/60 text-charcoal/70 border border-charcoal/15 hover:bg-burgundy hover:text-gold hover:border-burgundy hover:scale-110 transition-all"
            >
              <Instagram size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const SpotlightMembers: React.FC<SpotlightMembersProps> = ({ members }) => {
  const targetRef = useRef<HTMLElement>(null);

  const sorted = [...members].sort(
    (a, b) => roleRank(a.position) - roleRank(b.position) || a.order - b.order
  );
  const total = sorted.length;

  // Track scroll progress of the pinned container
  const { scrollYProgress } = useScroll({ target: targetRef });

  // Map scroll progress to horizontal translation (page stays pinned)
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', total > 1 ? `-${((total - 1) / total) * 100}%` : '0%']
  );

  return (
    <section
      ref={targetRef}
      className="relative bg-beige"
      style={{ height: `${(total + 1) * 60}vh` }}
    >
      {/* Sticky container that stays in viewport */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden py-12">
        {/* Background soft ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />

        {/* Section Header */}
        <div className="relative max-w-6xl mx-auto w-full px-6 md:px-12 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 z-20">
          <div>
            <span className="text-burgundy font-mono uppercase tracking-widest text-xs block mb-3">
              Behind the Lenses
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-charcoal leading-tight">
              Executive <span className="italic text-burgundy font-normal">Members</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <p className="text-sm font-mono text-charcoal/50 uppercase tracking-widest">
              ✦ Scroll down to traverse
            </p>
            <div className="w-24 h-[1px] bg-burgundy/30 mt-2"></div>
          </div>
        </div>

        {/* Horizontal moving members track */}
        <div className="relative flex-1 flex items-center z-20">
          <motion.div style={{ x }} className="flex items-center gap-12 px-6 md:px-12 w-max">
            {sorted.map((member, i) => (
              <MemberCard key={member.id} member={member} index={i} />
            ))}
          </motion.div>
        </div>

        {/* Bottom Progress Bar */}
        <div className="relative max-w-6xl mx-auto w-full px-6 md:px-12 mt-6 z-20">
          <div className="w-full h-[2px] bg-charcoal/10 rounded-full overflow-hidden">
            <motion.div className="h-full bg-burgundy origin-left" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </section>
  );
};
