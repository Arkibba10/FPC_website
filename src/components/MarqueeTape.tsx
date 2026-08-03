import React from 'react';
import { useReducedMotion } from 'framer-motion';

const FILM_HOLES =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='24'%3E%3Crect x='8' y='5' width='6' height='14' rx='2.5' fill='%23F5F0E8'/%3E%3C/svg%3E\")";

const REPEATS = Array.from({ length: 4 });

const TapeContent: React.FC = () => (
  <div className="flex shrink-0 items-center pr-16 sm:pr-24">
    {REPEATS.map((_, i) => (
      <React.Fragment key={i}>
        <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.45em] text-gold sm:text-lg">
          Film and Photography Club
        </span>
        <span className="mx-8 text-xs text-gold/40 sm:mx-12">✦</span>
      </React.Fragment>
    ))}
  </div>
);

export const MarqueeTape: React.FC = () => {
  const reduced = useReducedMotion();

  return (
    <div
      className="relative w-full overflow-hidden border-y border-[#2A2A2A] bg-[#151515]"
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[14px] opacity-70"
        style={{ backgroundImage: FILM_HOLES, backgroundSize: '22px 100%', backgroundRepeat: 'repeat-x' }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[14px] opacity-70"
        style={{ backgroundImage: FILM_HOLES, backgroundSize: '22px 100%', backgroundRepeat: 'repeat-x' }}
      />
      <div className={reduced ? 'flex w-max py-4 sm:py-6' : 'flex w-max py-4 sm:py-6 marquee-scroll'}>
        <TapeContent />
        <TapeContent />
      </div>
      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-scroll {
          animation: marqueeScroll 24s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-scroll {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};
