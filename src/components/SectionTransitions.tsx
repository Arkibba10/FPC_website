import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Scissors } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

const FILM_HOLES =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='24'%3E%3Crect x='8' y='5' width='6' height='14' rx='2.5' fill='%23F5F0E8'/%3E%3C/svg%3E\")";

const FilmDivider: React.FC = () => (
  <div className="flex items-center gap-4">
    <span className="h-px flex-1 bg-burgundy/30" />
    <div
      className="relative h-6 w-28 overflow-hidden rounded-md border border-[#2A2A2A] bg-[#151515] shadow-[0_6px_18px_-8px_rgba(0,0,0,0.5)]"
      aria-hidden
    >
      <div className="absolute inset-y-0 left-0 w-[300%]" style={{ backgroundImage: FILM_HOLES, backgroundSize: '22px 100%', backgroundRepeat: 'repeat-x' }} />
    </div>
    <span className="h-px flex-1 bg-burgundy/30" />
  </div>
);

const PerfDivider: React.FC = () => (
  <div className="flex items-center">
    <span className="h-0 flex-1 border-t-2 border-dashed border-burgundy/30" />
    <span className="mx-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-burgundy/30 bg-white/40 text-burgundy/70 backdrop-blur-sm">
      <Scissors size={11} />
    </span>
    <span className="h-0 flex-1 border-t-2 border-dashed border-burgundy/30" />
  </div>
);

const GrainDivider: React.FC = () => (
  <div className="flex items-center gap-3">
    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-burgundy/50 to-gold/70" />
    <span className="h-2 w-2 rotate-45 border border-gold/80 bg-gold/20" />
    <span className="h-px flex-1 bg-gradient-to-l from-transparent via-burgundy/50 to-gold/70" />
  </div>
);

const StarsDivider: React.FC = () => (
  <div className="flex items-center justify-center gap-3 text-gold/80">
    <span className="h-px w-12 bg-charcoal/30 sm:w-16" />
    <span className="text-[9px] tracking-[0.2em]">✦</span>
    <span className="h-px w-20 bg-charcoal/30 sm:w-28" />
    <span className="text-[9px] tracking-[0.2em]">✦</span>
    <span className="h-px w-12 bg-charcoal/30 sm:w-16" />
  </div>
);

const DoubleDivider: React.FC = () => (
  <div className="flex items-center gap-3">
    <span className="h-[7px] w-[7px] shrink-0 rotate-45 border border-burgundy/50 bg-burgundy/10" />
    <span className="flex-1 space-y-[5px]">
      <span className="block h-px bg-burgundy/40" />
      <span className="block h-px bg-burgundy/40" />
    </span>
    <span className="h-[7px] w-[7px] shrink-0 rotate-45 border border-burgundy/50 bg-burgundy/10" />
  </div>
);

const AngleDivider: React.FC = () => {
  const chev = (dir: 'left' | 'right') =>
    dir === 'left'
      ? { clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }
      : { clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' };
  return (
    <div className="flex items-center justify-center gap-1.5 text-burgundy/50">
      {[0, 1, 2, 3].map((i) => (
        <span key={`l${i}`} className="block h-2 w-4" style={{ ...chev('left'), background: 'currentColor' }} />
      ))}
      <span className="mx-1.5 h-1.5 w-1.5 rounded-full bg-gold/70" />
      {[0, 1, 2, 3].map((i) => (
        <span key={`r${i}`} className="block h-2 w-4" style={{ ...chev('right'), background: 'currentColor' }} />
      ))}
    </div>
  );
};

export type DividerVariant = 'film' | 'perf' | 'grain' | 'stars' | 'double' | 'angle';

const DIVIDER_MAP: Record<DividerVariant, React.FC> = {
  film: FilmDivider,
  perf: PerfDivider,
  grain: GrainDivider,
  stars: StarsDivider,
  double: DoubleDivider,
  angle: AngleDivider,
};

export const SectionDivider: React.FC<{ variant?: DividerVariant }> = ({ variant = 'film' }) => {
  const Variant = DIVIDER_MAP[variant] ?? FilmDivider;
  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-8 sm:py-10" aria-hidden>
      <Variant />
    </div>
  );
};

export const SectionMotion: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.06, margin: '0px 0px -10% 0px' });

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 24 }}
      transition={{ duration: 0.4, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
