import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  animate,
  motion,
  MotionValue,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
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
  'head of photography',
  'head of videography',
  'web master',
  'executive member',
  'member',
];

const roleRank = (position: string) => {
  const s = position.toLowerCase();
  const idx = ROLES.findIndex((r) => s.includes(r));
  return idx === -1 ? ROLES.length + 100 : idx;
};

const CARD_WIDTH = 260;
const CARD_HEIGHT = 520;
const CARD_RADIUS = 36;
const SLOT_SPACING = 80;
const SLOT_ROTATION = 9;
const FLOAT_MS = 7000;
const FLOAT_AMPLITUDE = 6;
const MAX_TILT = 8;
const PERSPECTIVE = 1800;
const HOVER_SCALE = 1.04;
const HOVER_ROTATE_KEEP = 0.15;
const CASCADE_Y = 16;
const ROTATION_FULL = 0.85;
const BACK_SCALE = 0.045;
const FINAL_FADE = 0.35;
const REVEAL_SCALE = 0.88;
const PAGE_MARGIN = 36;
const CAPTION_RESERVE = 150;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface TierConfig {
  half: number;
  spacing: number;
  rotation: number;
  cardW: number;
  cardH: number;
  captionScale: number;
  fadeStart: number;
  fadeEnd: number;
}

const TIERS: { name: 'mobile' | 'tablet' | 'desktop'; query: string; cfg: TierConfig }[] = [
  { name: 'mobile', query: '(max-width: 639px)', cfg: { half: 1, spacing: 0.62, rotation: 0.55, cardW: 205, cardH: 400, captionScale: 0.8, fadeStart: 1.35, fadeEnd: 2.35 } },
  { name: 'tablet', query: '(min-width: 640px) and (max-width: 1023px)', cfg: { half: 1.5, spacing: 0.85, rotation: 0.8, cardW: 240, cardH: 470, captionScale: 0.9, fadeStart: 1.5, fadeEnd: 2.5 } },
  { name: 'desktop', query: '(min-width: 1024px)', cfg: { half: 2, spacing: 1, rotation: 1, cardW: CARD_WIDTH, cardH: CARD_HEIGHT, captionScale: 1, fadeStart: 2.5, fadeEnd: 4.2 } },
];

const hierarchyPhase = (i: number): number => {
  if (i === 0) return 0;
  const slot = Math.ceil(i / 2);
  return (i % 2 === 1 ? 1 : -1) * slot;
};

const cardOpacity = (r: number, half: number, fadeStart: number, fadeEnd: number, fadeAmount: number) => {
  const d = Math.abs(r);
  const base = 1 - Math.min(d, half) * 0.05;
  if (d <= fadeStart) return base;
  const t = (d - fadeStart) / Math.max(0.0001, fadeEnd - fadeStart);
  const fade = Math.max(0, 1 - t);
  return base * (1 + (fade - 1) * fadeAmount);
};

interface FanCardProps {
  member: Member;
  phase: number;
  spread: MotionValue<number>;
  reveal: MotionValue<number>;
  cfg: TierConfig;
  fadeStart: number;
  fadeEnd: number;
  reduced: boolean;
  inView: boolean;
}

const FanCard: React.FC<FanCardProps> = ({
  member,
  phase: phaseNum,
  spread,
  reveal,
  cfg,
  fadeStart,
  fadeEnd,
  reduced,
  inView,
}) => {
  const hoverFactor = useMotionValue(0);
  const phase = useMotionValue(phaseNum);
  const depth = useTransform(phase, (p) => 100 - Math.min(Math.abs(p), cfg.half + 1) * 24);
  const x = useTransform([phase, spread, reveal], (latest: number[]) => latest[0] * SLOT_SPACING * cfg.spacing * latest[1] * latest[2]);
  const yOff = useTransform([phase, reveal], (latest: number[]) => -Math.abs(latest[0]) * CASCADE_Y * latest[1]);
  const rotate = useTransform([phase, reveal, hoverFactor], (latest: number[]) => {
    const [p, r, h] = latest;
    return -p * SLOT_ROTATION * cfg.rotation * ROTATION_FULL * r * (1 - (1 - HOVER_ROTATE_KEEP) * h);
  });
  const scale = useTransform([phase, reveal, hoverFactor], (latest: number[]) => {
    const [p, r, h] = latest;
    return (1 - Math.min(Math.abs(p), cfg.half + 0.5) * BACK_SCALE) * (REVEAL_SCALE + (1 - REVEAL_SCALE) * r) * (1 + (HOVER_SCALE - 1) * h);
  });
  const opacity = useTransform([phase, reveal], (latest: number[]) =>
    cardOpacity(latest[0], cfg.half, fadeStart, fadeEnd, FINAL_FADE) * latest[1]
  );
  const zIndex = useTransform(phase, (p) => Math.max(1, 100 - Math.min(Math.abs(p), cfg.half + 1) * 12));
  const capOpacity = useTransform([phase, reveal], (latest: number[]) => {
    const [p, r] = latest;
    const center = Math.abs(p) <= 0.5 ? 1 : 0;
    if (r >= 0.6) return 1;
    return Math.max(center, r > 0.45 ? (r - 0.45) / 0.15 : 0);
  });
  const socialOpacity = useTransform(phase, (p) => (Math.abs(p) <= 0.5 ? 1 : 0));

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      reveal.set(1);
      return;
    }
    const delay = 0.15 + Math.abs(phaseNum) * 0.12;
    const controls = animate(reveal, 1, { delay, duration: 1, ease: EASE });
    return () => controls.stop();
  }, [inView, reduced, reveal, phaseNum]);

  const [canHover, setCanHover] = useState(cardOpacity(Math.abs(phaseNum), cfg.half, fadeStart, fadeEnd, FINAL_FADE) * reveal.get() > 0.15);
  const canHoverRef = useRef(canHover);
  const showSocials = Math.abs(phaseNum) <= 0.5;
  const canInteract = useTransform([phase, reveal], (latest: number[]) =>
    cardOpacity(latest[0], cfg.half, fadeStart, fadeEnd, FINAL_FADE) * latest[1] > 0.15
  );
  useMotionValueEvent(canInteract, 'change', (v) => {
    if (v !== canHoverRef.current) {
      canHoverRef.current = v;
      setCanHover(v);
    }
  });

  const startHover = () => {
    animate(hoverFactor, 1, { type: 'spring', stiffness: 300, damping: 22 });
  };
  const endHover = () => {
    animate(hoverFactor, 0, { type: 'spring', stiffness: 220, damping: 24 });
  };

  return (
    <motion.div
      className="absolute top-0 will-change-transform"
      style={{ width: cfg.cardW, height: cfg.cardH, left: '50%', marginLeft: -cfg.cardW / 2, transformStyle: 'preserve-3d' }}
      animate={reduced ? { y: 0 } : { y: [FLOAT_AMPLITUDE, -FLOAT_AMPLITUDE] }}
      transition={
        reduced
          ? undefined
          : { duration: FLOAT_MS / 1000, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: (Math.abs(phaseNum) % 5) * 0.55 }
      }
    >
      <div className="will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
        <motion.div
          className="relative will-change-transform cursor-pointer"
          style={{ x, y: yOff, rotate, scale, zIndex, opacity, z: depth, transformStyle: 'preserve-3d', pointerEvents: canHover ? 'auto' : 'none' }}
          onHoverStart={startHover}
          onHoverEnd={endHover}
        >
          <div className="relative overflow-hidden bg-charcoal" style={{ width: cfg.cardW, height: cfg.cardH, borderRadius: CARD_RADIUS }}>
            <img src={member.photo} alt={member.name} loading="lazy" draggable={false} className="w-full h-full object-cover" />
          </div>

          <motion.div
            className="absolute left-1/2 -translate-x-1/2 text-center"
            style={{ top: cfg.cardH + 20, width: cfg.cardW + 90, opacity: capOpacity }}
          >
            <h3 className="font-playfair font-bold text-charcoal leading-tight" style={{ fontSize: Math.round(22 * cfg.captionScale) }}>
              {member.name}
            </h3>
            <p className="font-mono text-burgundy uppercase tracking-widest mt-1" style={{ fontSize: Math.round(11 * cfg.captionScale) }}>
              {member.position}
            </p>
            {member.quote && (
              <p className="font-playfair italic text-charcoal/80 mt-2 leading-relaxed" style={{ fontSize: Math.round(14 * cfg.captionScale) }}>
                <Quote size={12} className="inline text-gold/70 mr-1" />
                {member.quote}
              </p>
            )}
            <motion.div className="flex items-center justify-center gap-2 mt-3" style={{ opacity: socialOpacity, pointerEvents: showSocials ? 'auto' : 'none' }}>
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  aria-label={`Email ${member.name}`}
                  className="p-2 rounded-full bg-white/60 text-charcoal/70 border border-charcoal/15 hover:bg-burgundy hover:text-gold hover:border-burgundy hover:scale-110 transition-all"
                >
                  <Mail size={14} />
                </a>
              )}
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
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const SpotlightMembers: React.FC<SpotlightMembersProps> = ({ members }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const tiltAreaRef = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [tierName, setTierName] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const sorted = useMemo(
    () => [...members].sort((a, b) => roleRank(a.position) - roleRank(b.position) || a.order - b.order),
    [members]
  );
  const total = sorted.length;

  const reveal = useMotionValue(0);
  const fullSpreadMV = useMotionValue(1);
  const rotY = useMotionValue(0);
  const rotX = useMotionValue(0);
  const tiltRY = useSpring(rotY, { stiffness: 120, damping: 18, mass: 0.5 });
  const tiltRX = useSpring(rotX, { stiffness: 120, damping: 18, mass: 0.5 });

  const cfg = TIERS.find((t) => t.name === tierName)!.cfg;
  const fadeEnd = Math.min(Math.max(cfg.fadeEnd, total / 2 - 0.5), total / 2 + 0.6);
  const fadeStart = Math.min(cfg.fadeStart, fadeEnd);
  const maxOffset = Math.floor(total / 2);

  useEffect(() => {
    const mqs = TIERS.map((t) => ({ name: t.name, mq: window.matchMedia(t.query) }));
    const apply = () => {
      for (const { name, mq } of mqs) {
        if (mq.matches) {
          setTierName(name);
          return;
        }
      }
    };
    apply();
    mqs.forEach(({ mq }) => mq.addEventListener('change', apply));
    return () => mqs.forEach(({ mq }) => mq.removeEventListener('change', apply));
  }, []);

  useEffect(() => {
    if (maxOffset === 0) return;
    const compute = () => {
      const base = SLOT_SPACING * cfg.spacing;
      const vw = window.innerWidth;
      const target = Math.max(0.05, (vw / 2 - cfg.cardW / 2 - PAGE_MARGIN) / (maxOffset * base));
      fullSpreadMV.set(target);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [cfg, maxOffset, fullSpreadMV]);

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = tiltAreaRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    const nx = Math.max(-0.5, Math.min(0.5, (e.clientX - rect.left) / rect.width - 0.5));
    const ny = Math.max(-0.5, Math.min(0.5, (e.clientY - rect.top) / rect.height - 0.5));
    rotY.set(-nx * MAX_TILT * 2);
    rotX.set(ny * MAX_TILT * 2);
  };

  const handleTiltLeave = () => {
    rotX.set(0);
    rotY.set(0);
  };

  if (total === 0) return null;

  return (
    <section ref={sectionRef} className="relative bg-beige overflow-hidden py-20 md:py-28">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 mb-10 md:mb-14 px-6 text-center">
        <span className="text-burgundy font-mono uppercase tracking-widest text-xs block mb-3">Behind the Lenses</span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-charcoal leading-tight">
          Executive <span className="italic text-burgundy font-normal">Members</span>
        </h2>
      </div>

      <div
        ref={tiltAreaRef}
        className="relative z-10 w-full max-w-4xl mx-auto"
        style={{ perspective: PERSPECTIVE }}
        onMouseMove={reduced ? undefined : handleTiltMove}
        onMouseLeave={reduced ? undefined : handleTiltLeave}
      >
        <motion.div
          className="relative flex items-start justify-center"
          style={{ rotateX: tiltRX, rotateY: tiltRY, transformStyle: 'preserve-3d' }}
        >
          <div
            className="relative"
            style={{
              width: cfg.cardW,
              height: cfg.cardH + Math.round(CAPTION_RESERVE * cfg.captionScale),
              transformStyle: 'preserve-3d',
            }}
          >
            {sorted.map((member, i) => {
              const d = hierarchyPhase(i);
              if (Math.abs(d) > maxOffset) return null;
              return (
                <FanCard
                  key={member.id}
                  member={member}
                  phase={d}
                  spread={fullSpreadMV}
                  reveal={reveal}
                  cfg={cfg}
                  fadeStart={fadeStart}
                  fadeEnd={fadeEnd}
                  reduced={reduced}
                  inView={inView}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
