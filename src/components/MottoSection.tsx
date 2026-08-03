import React from 'react';
import { motion } from 'framer-motion';
import { Film, Scissors } from 'lucide-react';
import { useClub } from '../context/useClub';

const EASE = [0.16, 1, 0.3, 1] as const;

// Deterministic barcode bars (widths in px). Static, no randomness.
const BARCODE = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1, 2, 1, 4, 1, 2, 1, 3, 2, 1, 1, 2, 4, 1, 2, 1, 1, 3, 1, 2, 1, 1, 2];

// Jagged "torn" edge for the stub's left side while it tears into place.
const TEAR_OPEN = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 5% 91%, 0% 83%, 4% 75%, 0% 67%, 5% 59%, 0% 51%, 4% 43%, 0% 35%, 5% 27%, 0% 19%, 4% 11%, 0% 3%)';
const TEAR_CLOSED = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 91%, 0% 83%, 0% 75%, 0% 67%, 0% 59%, 0% 51%, 0% 43%, 0% 35%, 0% 27%, 0% 19%, 0% 11%, 0% 3%)';

export const MottoSection: React.FC = () => {
  const { settings } = useClub();
  const mottoText =
    settings?.motto ||
    'The Film & Photography Club, CSE-UAP is a creative community of students from the Department of Computer Science & Engineering at the University of Asia Pacific, dedicated to capturing stories, fostering visual creativity, and inspiring innovation through photography, filmmaking, and digital media.';

  return (
    <section className="relative min-h-screen bg-[#181818] flex items-center justify-center overflow-hidden py-14 md:py-20 px-4 sm:px-6 md:px-5 lg:px-6">
      {/* Ambient burgundy glow + film grain */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] max-w-[1100px] max-h-[1100px] bg-burgundy/15 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-gold/10 blur-[120px] rounded-full" />
      </div>
      <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none" />

      <div className="relative w-full max-w-[90rem] mx-auto">
        {/* Eyebrow above the ticket */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center justify-center gap-3 mb-8 md:mb-10"
        >
          <span className="h-px w-8 bg-gold/60" />
          <span className="font-mono uppercase tracking-[0.35em] text-[10px] text-gold">
            CSE-UAP Presents
          </span>
          <span className="h-px w-8 bg-gold/60" />
        </motion.div>

        {/* Ticket */}
        <div className="relative">
          {/* Semicircular cutouts on both sides */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.75, type: 'spring', stiffness: 320, damping: 18 }}
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#181818] border-2 border-[#2A2A2A] z-30 shadow-inner"
          />
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 320, damping: 18 }}
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#181818] border-2 border-[#2A2A2A] z-30 shadow-inner"
          />

          <motion.div
            initial={{ opacity: 0, y: 56 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative z-10 rounded-[26px] border-2 border-[#2A2A2A] bg-[#F5F0E8] text-charcoal overflow-hidden shadow-[0_40px_100px_-25px_rgba(0,0,0,0.8)]"
          >
            {/* Top film-strip perforations */}
            <div className="sprocket h-5 md:h-6 bg-[#2A2A2A]" />

            <div className="relative flex flex-col md:flex-row">
              {/* Main manifesto body */}
              <div className="flex-1 px-7 sm:px-12 md:px-20 py-10 md:py-20 text-center flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                  className="inline-flex items-center gap-2 rounded-full border border-burgundy/40 px-4 py-1.5 font-mono text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-burgundy"
                >
                  <Film size={12} />
                  Club Manifesto
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
                  className="mt-7 font-playfair text-[2.75rem] sm:text-6xl md:text-[4.5rem] font-semibold leading-[1.02] tracking-tight text-charcoal"
                >
                  Our
                  <span className="block italic font-normal text-burgundy">Manifesto</span>
                </motion.h2>

                {/* Ornament */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4, ease: 'easeInOut' }}
                  className="flex items-center gap-3 mt-6"
                >
                  <span className="w-12 h-px bg-charcoal/30" />
                  <span className="w-1.5 h-1.5 rotate-45 bg-burgundy" />
                  <span className="w-12 h-px bg-charcoal/30" />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
                  className="mt-8 font-playfair italic text-base sm:text-lg md:text-2xl leading-relaxed text-charcoal/80 max-w-2xl"
                >
                  {mottoText}
                </motion.p>

                {/* Ticket meta row */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
                  className="mt-12 w-full max-w-lg grid grid-cols-3 gap-2 font-mono text-[10px] sm:text-xs tracking-[0.18em] uppercase text-charcoal/70"
                >
                  <div className="flex flex-col items-center gap-1 rounded-lg border border-charcoal/10 bg-white/50 px-2 py-4">
                    <span className="text-burgundy">Show</span>
                    <span>The Light</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 rounded-lg border border-charcoal/10 bg-white/50 px-2 py-4">
                    <span className="text-burgundy">Run</span>
                    <span>Forever</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 rounded-lg border border-charcoal/10 bg-white/50 px-2 py-4">
                    <span className="text-burgundy">Seat</span>
                    <span>Front Row</span>
                  </div>
                </motion.div>
              </div>

              {/* Mobile perforation */}
              <div className="mx-6 md:hidden h-px border-t-2 border-dashed border-charcoal/25" />

              {/* Tear-off stub */}
              <motion.div
                initial={{ x: 90, opacity: 0.35, clipPath: TEAR_OPEN }}
                whileInView={{ x: 0, opacity: 1, clipPath: TEAR_CLOSED }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 1, delay: 0.45, ease: EASE }}
                className="relative md:w-72 shrink-0 md:border-l-2 md:border-dashed md:border-charcoal/25 px-8 md:px-8 py-10 md:py-16 flex md:flex-col items-center justify-center gap-6"
              >
                {/* Scissors marker on the perforation (desktop) */}
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-[#F5F0E8] border border-charcoal/25 text-burgundy">
                  <Scissors size={11} />
                </div>

                <div className="text-center">
                  <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-burgundy">
                    Admit
                  </div>
                  <div className="font-playfair text-4xl font-semibold text-charcoal leading-none mt-1">
                    One
                  </div>
                </div>

                {/* Barcode */}
                <div className="flex items-end gap-[2px]" aria-hidden>
                  {BARCODE.map((w, i) => (
                    <span
                      key={i}
                      className="bg-charcoal"
                      style={{ width: w, height: i % 3 === 0 ? 36 : 27 }}
                    />
                  ))}
                </div>

                <div className="text-center">
                  <div className="font-mono text-[8px] tracking-[0.28em] uppercase text-charcoal/50">
                    FPC
                  </div>
                  <div className="font-mono text-[8px] tracking-[0.28em] uppercase text-charcoal/50">
                    No. 001
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom film-strip perforations */}
            <div className="sprocket h-5 md:h-6 bg-[#2A2A2A]" />
          </motion.div>
        </div>

        {/* Floating poster image in front of the ticket (modern-poster depth) */}
        <motion.div
          initial={{ opacity: 0, y: 48, rotate: -5, scale: 1.06 }}
          whileInView={{ opacity: 1, y: 0, rotate: -3, scale: 1.04 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          className="absolute right-0 min-[1600px]:-right-[4%] -bottom-[4%] w-[44%] max-w-[420px] z-40 drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
        >
          <img
            src="/images/pop-cutout.png"
            alt=""
            aria-hidden
            className="w-full h-auto blur-[2px]"
          />
        </motion.div>

        {/* Small popcorn cutout in the top-left of the ticket (half in, half out) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -14 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
          className="absolute left-0 top-[12%] w-[30%] max-w-[200px] z-40 drop-shadow-[0_18px_18px_rgba(0,0,0,0.45)]"
        >
          <div className="-translate-x-1/2">
            <img
              src="/images/pop-cutout.png"
              alt=""
              aria-hidden
              className="w-full h-auto -scale-x-100"
            />
          </div>
        </motion.div>

        {/* Caption below the ticket */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-12 text-center font-mono text-[10px] tracking-[0.35em] uppercase text-gold/70"
        >
          ✦ Seeing Beyond the Ordinary ✦
        </motion.p>
      </div>

      <style>{`
        .sprocket {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='24'%3E%3Crect x='8' y='5' width='6' height='14' rx='2.5' fill='%23F5F0E8'/%3E%3C/svg%3E");
          background-size: 22px 100%;
          background-repeat: repeat-x;
          background-position: center;
        }
        @media (prefers-reduced-motion: reduce) {
          .sprocket {
            background-size: 22px 100%;
          }
        }
      `}</style>
    </section>
  );
};
