import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Facebook, Linkedin, Instagram, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
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
  'head of photography',
  'head of videography',
  'web master',
  'organizing secretary',
  'executive member',
  'member',
];

const roleRank = (position: string) => {
  const s = position.toLowerCase();
  const idx = ROLES.findIndex((r) => s.includes(r));
  return idx === -1 ? ROLES.length + 100 : idx;
};

const DUST_PARTICLES = [
  { left: '8%', size: 2, dur: 9, delay: 0 },
  { left: '18%', size: 1.5, dur: 12, delay: 3 },
  { left: '30%', size: 1.5, dur: 8, delay: 1.5 },
  { left: '42%', size: 2, dur: 11, delay: 5 },
  { left: '55%', size: 1.5, dur: 9, delay: 2 },
  { left: '66%', size: 2, dur: 13, delay: 0.5 },
  { left: '76%', size: 1.5, dur: 10, delay: 6 },
  { left: '86%', size: 2, dur: 8.5, delay: 4 },
  { left: '94%', size: 1.5, dur: 12, delay: 7 },
  { left: '50%', size: 1.5, dur: 10.5, delay: 2.5 },
];

const SPRING = { type: 'spring', stiffness: 190, damping: 27, mass: 0.9 } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const useViewportWidth = () => {
  const [vw, setVw] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1280));
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return vw;
};

const CardSquare: React.FC<{ member: Member; className?: string }> = ({ member, className }) => (
  <div className={`relative overflow-hidden rounded-2xl border border-charcoal/10 bg-charcoal shadow-[0_18px_40px_-24px_rgba(42,42,42,0.5)] ${className ?? ''}`}>
    <img
      src={member.photo}
      alt={member.name}
      loading="lazy"
      draggable={false}
      className="vintage absolute inset-0 h-full w-full object-cover object-center"
    />
    <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay" />
    <div className="card-vignette pointer-events-none absolute inset-0" />
    <span className="pointer-events-none absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.3em] text-white/70 mix-blend-difference">
      {member.order.toString().padStart(2, '0')}
    </span>
  </div>
);

const Nameplate: React.FC<{ member: Member }> = ({ member }) => {
  const icons = [
    { key: 'instagram', show: !!member.instagram, icon: Instagram, href: member.instagram, label: 'Instagram' },
    { key: 'facebook', show: !!member.facebook, icon: Facebook, href: member.facebook, label: 'Facebook' },
    { key: 'linkedin', show: !!member.linkedin, icon: Linkedin, href: member.linkedin, label: 'LinkedIn' },
    { key: 'mail', show: !!member.email, icon: Mail, href: `mailto:${member.email}`, label: 'Email' },
  ].filter((i) => i.show);

  return (
    <div className="rounded-xl border border-white/50 bg-white/40 px-3 py-2 shadow-[0_10px_30px_-12px_rgba(42,42,42,0.35)] backdrop-blur-md">
      <p className="truncate font-sans text-[13px] font-bold leading-tight text-charcoal">{member.name}</p>
      <p className="mt-0.5 truncate font-mono text-[8px] uppercase tracking-[0.18em] text-burgundy">{member.position}</p>
      {icons.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5">
          {icons.map(({ key, icon: Icon, href, label }) => (
            <a
              key={key}
              href={href}
              target={key === 'mail' ? undefined : '_blank'}
              rel={key === 'mail' ? undefined : 'noopener noreferrer'}
              aria-label={`${member.name} on ${label}`}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-charcoal/[0.06] text-charcoal/60 transition-colors duration-300 hover:bg-burgundy hover:text-gold"
            >
              <Icon size={10} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const useReducedMotion = () => {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
};

export const SpotlightMembers: React.FC<SpotlightMembersProps> = ({ members }) => {
  const reduced = useReducedMotion();
  const vw = useViewportWidth();

  const sorted = useMemo(
    () => [...members].sort((a, b) => roleRank(a.position) - roleRank(b.position) || a.order - b.order),
    [members]
  );
  const n = sorted.length;

  const card = Math.round(Math.min(Math.max(176, vw * 0.27), 330));
  const cardH = Math.round(card * 1.5);
  const spacing1 = Math.min(card * 0.58, vw * 0.2);
  const spacing2 = Math.min(card * 1.02, vw * 0.34);
  const maxPeek = vw < 640 ? 1 : 2;
  const stageH = cardH + 104;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  /* Constant auto-advancing circular loop — paused while the stage is hovered. */
  useEffect(() => {
    if (reduced || paused || n === 0) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % n), 4200);
    return () => window.clearInterval(id);
  }, [reduced, paused, n]);

  const goPrev = () => setIndex((i) => (i - 1 + n) % n);
  const goNext = () => setIndex((i) => (i + 1) % n);

  const offsetOf = (i: number) => {
    const offset = ((i - index) % n + n) % n;
    return offset > n / 2 ? offset - n : offset;
  };

  const navBtnClass =
    'z-40 flex h-11 w-11 items-center justify-center rounded-full border border-burgundy/40 text-burgundy transition-all duration-300 hover:bg-burgundy hover:text-gold hover:shadow-[0_10px_26px_-10px_rgba(110,30,42,0.7)] active:scale-90';

  /* Reduced motion: plain static grid. */
  if (reduced) {
    return (
      <section className="relative overflow-hidden bg-white" aria-label="Executive Members">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-white" />
          <div className="bg-paperish absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(110%_80%_at_18%_-10%,rgba(110,30,42,0.05),transparent_55%)]" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-charcoal/45">FPC · CSE-UAP — Executive Board</p>
          <h2 className="mt-4 text-4xl font-playfair font-bold text-charcoal leading-tight md:text-5xl lg:text-6xl">
            Executive Members
          </h2>
          <div className="mt-10 h-px w-24 bg-burgundy/40" />
          <div className="mt-14 columns-1 gap-6 sm:columns-2 xl:columns-3">
            {sorted.map((member) => (
              <div key={member.id} className="mb-10 break-inside-avoid">
                <CardSquare member={member} className="aspect-[2/3] w-full" />
                <div className="mt-3">
                  <Nameplate member={member} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <CarouselStyles />
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white" aria-label="Executive Members">
      {/* Layered background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-white" />
        <div className="bg-paperish absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#fbf7f2]" />
        <div className="absolute inset-0 bg-[radial-gradient(110%_80%_at_18%_-10%,rgba(110,30,42,0.05),transparent_55%)]" />
        {DUST_PARTICLES.map((d, i) => (
          <span
            key={i}
            className="dust"
            style={{ left: d.left, width: d.size, height: d.size, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s` }}
          />
        ))}
      </div>

      {/* Editorial heading */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16 md:pt-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-charcoal/45">FPC · CSE-UAP — Executive Board</p>
        <h2 className="mt-4 text-4xl font-playfair font-bold text-charcoal leading-tight md:text-5xl lg:text-6xl">
          Executive Members
        </h2>
        <div className="mt-10 h-px w-24 bg-burgundy/40" />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 font-mono text-[9.5px] uppercase tracking-[0.3em] text-charcoal/45">
          <span className="hidden sm:inline">Auto-playing circular gallery — hover to pause · drag or use the arrows to browse</span>
          <span className="sm:hidden">Circular gallery — use the arrows to browse</span>
          <span className="tabular-nums">
            {String(index + 1).padStart(2, '0')} — {String(n).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Circular carousel stage */}
      <div
        ref={stageRef}
        className="relative z-10 mx-auto w-full px-4 pt-8 pb-8 sm:px-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Transparent cutout camcorder — left of the carousel */}
        <div className="pointer-events-none select-none absolute left-[-14vw] top-[42%] z-20 hidden -translate-y-1/2 lg:block lg:w-[42vw]">
          <motion.img
            src="/images/camcorder.png"
            alt=""
            draggable={false}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 1.1, delay: 0.6, ease: EASE }}
            className="relative w-full blur-[2px]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#6E1E2A]/70 via-transparent to-transparent"
            style={{
              WebkitMaskImage: 'url(/images/camcorder.png)',
              maskImage: 'url(/images/camcorder.png)',
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
            }}
          />
        </div>

        {/* Transparent cutout camera — right of the carousel */}
        <div className="pointer-events-none select-none absolute right-[-11vw] top-[34%] z-20 hidden -translate-y-1/2 lg:block lg:w-[34vw]">
          <motion.img
            src="/images/camera.png"
            alt=""
            draggable={false}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 1.1, delay: 0.75, ease: EASE }}
            className="relative w-full blur-[2px]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#6E1E2A]/70 via-transparent to-transparent"
            style={{
              WebkitMaskImage: 'url(/images/camera.png)',
              maskImage: 'url(/images/camera.png)',
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
            }}
          />
        </div>

        <div className="relative mx-auto w-full" style={{ height: stageH }}>
          {/* Portrait positioning zone */}
          <div className="absolute left-0 right-0 top-0" style={{ height: cardH }}>
            {/* Drag-to-browse layer (behind cards) */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_, info) => {
                if (info.offset.x < -40) goNext();
                else if (info.offset.x > 40) goPrev();
              }}
              className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
              aria-hidden
            />

            {sorted.map((member, i) => {
              const off = offsetOf(i);
              const absOff = Math.abs(off);
              const baseScale = off === 0 ? 1 : absOff === 1 ? 0.62 : absOff === 2 ? 0.4 : 0.32;
              const opacity = absOff === 0 ? 1 : absOff === 1 ? 0.55 : absOff === 2 && maxPeek > 1 ? 0.18 : 0;
              const zIndex = Math.max(0, 30 - absOff * 10);
              const offsetX = Math.sign(off) * (absOff <= 1 ? spacing1 : spacing2);

              return (
                <motion.div
                  key={member.id}
                  className="absolute top-0 will-change-transform"
                  style={{ left: '50%', width: card, height: cardH, marginLeft: -card / 2, zIndex, pointerEvents: absOff > 1 ? 'none' : 'auto' }}
                  initial={false}
                  animate={{ x: offsetX, scale: baseScale, rotate: off * 3, opacity }}
                  transition={SPRING}
                  whileHover={{ scale: baseScale * 1.07 }}
                  onClick={() => off !== 0 && setIndex(i)}
                  role="button"
                  tabIndex={off === 0 ? 0 : -1}
                  aria-label={`${member.name}, ${member.position}`}
                >
                  <CardSquare member={member} className="h-full w-full" />
                  <div className="absolute left-0 right-0" style={{ top: cardH + 10 }}>
                    <Nameplate member={member} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Prev / next arrows */}
          <button type="button" onClick={goPrev} aria-label="Previous member" className={`absolute left-1 -translate-y-1/2 sm:left-2 ${navBtnClass}`} style={{ top: cardH / 2 }}>
            <ChevronLeft size={20} />
          </button>
          <button type="button" onClick={goNext} aria-label="Next member" className={`absolute right-1 -translate-y-1/2 sm:right-2 ${navBtnClass}`} style={{ top: cardH / 2 }}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Auto-play progress hairline */}
        <div className="mx-auto mt-10 h-[3px] max-w-3xl overflow-hidden rounded-full bg-charcoal/10">
          <div
            className="h-full origin-left bg-burgundy transition-transform duration-300 ease-linear"
            style={{ transform: `scaleX(${(index + 1) / n})` }}
          />
        </div>
      </div>

      <CarouselStyles />
    </section>
  );
};

const CarouselStyles: React.FC = () => (
  <style>{`
    .text-outline {
      -webkit-text-stroke: 1.5px var(--color-burgundy);
      color: transparent;
    }
    .vintage {
      filter: saturate(0.82) contrast(1.06) brightness(0.99) sepia(0.08) grayscale(0.1);
    }
    .card-vignette {
      background: radial-gradient(120% 100% at 50% 18%, transparent 50%, rgba(20,10,12,0.34) 100%);
    }
    .bg-paperish {
      background-image:
        radial-gradient(120% 90% at 15% 0%, rgba(255,255,255,0.9), transparent 60%),
        radial-gradient(90% 60% at 85% 100%, rgba(110,30,42,0.04), transparent 60%);
    }
    @keyframes dustUp {
      0% { transform: translate3d(0, 10vh, 0); opacity: 0; }
      12% { opacity: 0.5; }
      100% { transform: translate3d(0, -110vh, 0); opacity: 0; }
    }
    .dust {
      position: absolute;
      bottom: -4px;
      border-radius: 9999px;
      background: rgba(110, 30, 42, 0.4);
      filter: blur(1px);
      will-change: transform, opacity;
      animation: dustUp linear infinite;
    }
  `}</style>
);
