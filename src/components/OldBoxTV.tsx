import React from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Old box-shaped CRT television. Rendered as a sticky, viewport-height part of
 * the Cinematic Chronicles section, so it pins over the viewport while that
 * content scrolls through it and scrolls away with the section — it belongs to
 * the page and fades in/out together with the page's other elements (via the
 * parent section's reveal animation), never covering other pages.
 *
 * Pure decoration — pointer-events none, so nothing underneath is blocked.
 */

const Knob: React.FC<{ tick?: number }> = ({ tick = 0 }) => (
  <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[radial-gradient(circle_at_35%_30%,#4a3524,#22130a_72%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_3px_6px_rgba(0,0,0,0.65)]">
    <span
      className="absolute left-1/2 top-1/2 h-[68%] w-[2px] rounded-full bg-gold/70"
      style={{ transform: `translate(-50%, -50%) rotate(${tick}deg)` }}
    />
  </div>
);

const Scanlines: React.FC = () => (
  <div
    className="absolute inset-0"
    style={{
      backgroundImage:
        'repeating-linear-gradient(0deg, rgba(12,8,5,0.15) 0px, rgba(12,8,5,0.15) 1px, transparent 1px, transparent 3px)',
    }}
  />
);

export const OldBoxTV: React.FC = () => {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 select-none"
    >
      {/* Walnut cabinet — ONLY the bezel strips are opaque so the tube is a real
          window onto the page. The screen area itself stays unpainted. */}
      <div className="absolute inset-x-0 top-0 h-[3.5%] bg-[#221610]" />
      <div className="absolute left-0 top-[3.5%] bottom-[12vh] w-[3%] bg-[#221610] sm:bottom-[11vh]" />
      <div className="absolute right-0 top-[3.5%] bottom-[12vh] w-[3%] bg-[#221610] sm:bottom-[11vh]" />
      <div className="absolute inset-0 bg-noise opacity-[0.08]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_16%,transparent_84%,rgba(0,0,0,0.45))]" />

      {/* CRT screen (tube) */}
      <div className="absolute left-[3%] right-[3%] top-[3.5%] bottom-[12vh] sm:bottom-[11vh]">
        <div className="absolute inset-0 overflow-hidden rounded-[1.4rem] sm:rounded-[2rem] shadow-[0_0_0_5px_#120c08,0_0_0_8px_rgba(0,0,0,0.9),0_36px_90px_rgba(0,0,0,0.75)]">
          {/* Slight glass tint so the broadcast reads as a tube, not a window */}
          <div className="absolute inset-0 bg-[#0c0906]/15" />
          {/* Vignette for tube curvature */}
          <div className="absolute inset-0 shadow-[inset_0_0_130px_rgba(0,0,0,0.55),inset_0_0_44px_rgba(0,0,0,0.38)]" />
          <Scanlines />

          {/* Rolling scan band */}
          {!reduced && (
            <div className="crt-roll absolute left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-transparent via-white/[0.045] to-transparent" />
          )}

          {/* Glass reflection */}
          <div className="absolute -left-[22%] -top-[34%] h-[150%] w-[46%] rotate-[14deg] bg-gradient-to-br from-white/[0.07] via-white/[0.015] to-transparent" />

          {/* Flicker veil */}
          {!reduced && <div className="crt-flicker absolute inset-0 bg-black" />}

          {/* On-screen tube labels */}
          <div className="absolute left-4 top-3 flex items-center gap-2 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.28em] text-white/40">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#E11D48]/80 shadow-[0_0_8px_2px_rgba(225,29,72,0.5)]" />
            CH 03 · Chronicles
          </div>
          <div className="absolute right-4 top-3 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.28em] text-white/40">
            FPC Tube
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.4em] text-white/25">
            EST. 2017 — Cinematic Timeline
          </div>
        </div>
      </div>

      {/* Front control deck */}
      <div className="absolute inset-x-0 bottom-0 h-[12vh] min-h-[80px] sm:h-[11vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2c1d12] via-[#1d120b] to-[#140c07]" />
        <div className="absolute inset-0 bg-noise opacity-[0.08]" />
        <div className="absolute inset-0 shadow-[inset_0_6px_12px_rgba(0,0,0,0.6)]" />

        {/* Brand */}
        <div className="absolute left-[5%] top-1/2 flex -translate-y-1/2 flex-col gap-0.5">
          <span className="font-playfair text-sm leading-none text-gold sm:text-base">FPC</span>
          <span className="font-mono text-[6.5px] uppercase leading-tight tracking-[0.3em] text-gold/60 sm:text-[8px]">
            Cinematic Chronicles
          </span>
          <span className="font-mono text-[6.5px] uppercase tracking-[0.3em] text-white/35 sm:text-[8px]">
            EST. 2017 · CH 03
          </span>
        </div>

        {/* Speaker grille */}
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 flex-col gap-1.5 sm:flex">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="block h-[2px] w-24 rounded-full bg-white/[0.09]" />
          ))}
        </div>

        {/* Controls */}
        <div className="absolute right-[5%] top-1/2 flex -translate-y-1/2 items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E11D48] shadow-[0_0_10px_3px_rgba(225,29,72,0.55)]" />
            <span className="font-mono text-[7px] uppercase tracking-[0.28em] text-white/40">On</span>
          </div>
          <Knob tick={-45} />
          <Knob tick={40} />
        </div>
      </div>

      <style>{`
        @keyframes crtRoll {
          0% { transform: translateY(-140%); }
          100% { transform: translateY(760%); }
        }
        .crt-roll {
          animation: crtRoll 10s linear infinite;
          will-change: transform;
        }
        @keyframes crtFlicker {
          0%, 100% { opacity: 0.015; }
          50% { opacity: 0.05; }
        }
        .crt-flicker {
          animation: crtFlicker 0.16s steps(2) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .crt-roll,
          .crt-flicker {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
