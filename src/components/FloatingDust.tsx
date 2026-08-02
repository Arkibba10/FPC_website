import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const seededRng = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// Responsive particle budget: fewer dust motes on small screens so the
// compositor has less to animate. Desktop keeps the full cinematic density.
const getDustCount = () => {
  if (typeof window === 'undefined') return 34;
  if (window.matchMedia('(max-width: 640px)').matches) return 12;
  if (window.matchMedia('(max-width: 1024px)').matches) return 20;
  return 34;
};

const FloatingDust: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [dustCount, setDustCount] = useState(getDustCount);

  // React to viewport changes (portrait -> landscape, resize, etc.) instead of
  // evaluating the breakpoint once at module load.
  useEffect(() => {
    const queries = [
      window.matchMedia('(max-width: 640px)'),
      window.matchMedia('(max-width: 1024px)'),
    ];
    const update = () => setDustCount(getDustCount());
    queries.forEach((q) => q.addEventListener('change', update));
    return () => queries.forEach((q) => q.removeEventListener('change', update));
  }, []);

  const particles = useMemo(() => {
    const rng = seededRng(0x9e3779b9);
    return Array.from({ length: dustCount }).map((_, i) => {
      const r = rng();
      return {
        id: i,
        left: r * 100,
        size: 1.5 + rng() * 2,
        dur: 9 + rng() * 7,
        delay: rng() * 8,
        drift: (rng() - 0.5) * 30,
        start: 100 + rng() * 12,
        rise: 55 + rng() * 40,
        peak: 0.35 + rng() * 0.35,
        isRing: i % 6 === 2,
        ringSize: 5 + rng() * 4,
      };
    });
  }, [dustCount]);

  // Respect users who prefer reduced motion: keep the dust still but visible.
  if (reduceMotion) {
    return (
      <div aria-hidden className="fixed inset-0 overflow-hidden pointer-events-none select-none z-[45]">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: p.left + '%',
              top: p.start + 'vh',
              width: p.isRing ? p.ringSize : p.size,
              height: p.isRing ? p.ringSize : p.size,
              borderRadius: '9999px',
              backgroundColor: p.isRing ? 'transparent' : 'rgba(200,169,106,0.5)',
              border: p.isRing ? '1px solid rgba(200,169,106,0.4)' : 'none',
              opacity: p.peak,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden className="fixed inset-0 overflow-hidden pointer-events-none select-none z-[45]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: p.left + '%',
            top: p.start + 'vh',
            width: p.isRing ? p.ringSize : p.size,
            height: p.isRing ? p.ringSize : p.size,
            borderRadius: '9999px',
            backgroundColor: p.isRing ? 'transparent' : 'rgba(200,169,106,0.95)',
            border: p.isRing ? '1px solid rgba(200,169,106,0.7)' : 'none',
            boxShadow: p.isRing
              ? '0 0 0 0.5px rgba(42,42,42,0.2)'
              : '0 0 5px 1px rgba(200,169,106,0.4), 0 0 0 0.5px rgba(42,42,42,0.35)',
          }}
          animate={{
            y: [0, `-${p.rise}vh`],
            x: [0, p.drift, 0],
            opacity: [0, p.peak, 0],
            scale: [0.6, 1, 0.7],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.4, 0.85],
          }}
        />
      ))}
    </div>
  );
};

export default FloatingDust;
