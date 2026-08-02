import React, { useRef, useState } from 'react';
import { motion, useAnimationFrame, useInView, useMotionValue } from 'framer-motion';
import { Flashlight, Timer, FlipHorizontal2 } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const DUST = [
  { x: 16, y: 22, s: 3, d: 0.2, dur: 8 },
  { x: 24, y: 74, s: 2, d: 1.4, dur: 10 },
  { x: 40, y: 32, s: 4, d: 0.8, dur: 6.5 },
  { x: 54, y: 80, s: 2, d: 2.2, dur: 9 },
  { x: 68, y: 24, s: 3, d: 0.4, dur: 7.5 },
  { x: 76, y: 66, s: 2, d: 1.8, dur: 8.5 },
  { x: 88, y: 40, s: 3, d: 1, dur: 7 },
  { x: 46, y: 56, s: 2, d: 2.6, dur: 9.5 },
  { x: 62, y: 47, s: 4, d: 0.6, dur: 6.8 },
  { x: 92, y: 72, s: 2, d: 2, dur: 7.2 },
];

const CAROUSEL_IMAGES = [
  { src: '/images/gallery1.jpg', label: 'CAMPUS FEST', rot: -6 },
  { src: '/images/event1.jpg', label: 'PHOTOWALK', rot: 4 },
  { src: '/images/gallery2.jpg', label: 'PORTRAIT', rot: -3 },
  { src: '/images/event2.jpg', label: 'GOLDEN HOUR', rot: 7 },
  { src: '/images/gallery3.jpg', label: 'STREET', rot: -5 },
  { src: '/images/event3.jpg', label: 'FILM SET', rot: 3 },
  { src: '/images/gallery4.jpg', label: 'ARCHITECTURE', rot: -7 },
  { src: '/images/gallery1.jpg', label: 'NIGHT SHOTS', rot: 5 },
  { src: '/images/event1.jpg', label: 'EXHIBIT', rot: -4 },
  { src: '/images/gallery2.jpg', label: 'WORKSHOP', rot: 2 },
  { src: '/images/event2.jpg', label: 'FRIENDS', rot: -6 },
  { src: '/images/gallery3.jpg', label: 'CINEMATIC', rot: 6 },
];

const LOOP_SECONDS = 30;
const SLOW_FACTOR = 0.6;
const COPIES = 3;

const FOCUS_POSITIONS = [
  '-top-[1.6cqw] -left-[1.6cqw] max-lg:landscape:-top-[1.4cqh] max-lg:landscape:-left-[1.4cqh] lg:-top-[0.9vw] lg:-left-[0.9vw]',
  '-top-[1.6cqw] -right-[1.6cqw] max-lg:landscape:-top-[1.4cqh] max-lg:landscape:-right-[1.4cqh] lg:-top-[0.9vw] lg:-right-[0.9vw]',
  '-bottom-[1.6cqw] -left-[1.6cqw] max-lg:landscape:-bottom-[1.4cqh] max-lg:landscape:-left-[1.4cqh] lg:-bottom-[0.9vw] lg:-left-[0.9vw]',
  '-bottom-[1.6cqw] -right-[1.6cqw] max-lg:landscape:-bottom-[1.4cqh] max-lg:landscape:-right-[1.4cqh] lg:-bottom-[0.9vw] lg:-right-[0.9vw]',
];

const FOCUS_CORNERS = [
  'border-t-[0.6cqw] border-l-[0.6cqw] rounded-tl-[0.4cqw] max-lg:landscape:border-t-[0.45cqh] max-lg:landscape:border-l-[0.45cqh] max-lg:landscape:rounded-tl-[0.3cqh] lg:border-t-[0.28vw] lg:border-l-[0.28vw] lg:rounded-tl-[0.25vw]',
  'border-t-[0.6cqw] border-r-[0.6cqw] rounded-tr-[0.4cqw] max-lg:landscape:border-t-[0.45cqh] max-lg:landscape:border-r-[0.45cqh] max-lg:landscape:rounded-tr-[0.3cqh] lg:border-t-[0.28vw] lg:border-r-[0.28vw] lg:rounded-tr-[0.25vw]',
  'border-b-[0.6cqw] border-l-[0.6cqw] rounded-bl-[0.4cqw] max-lg:landscape:border-b-[0.45cqh] max-lg:landscape:border-l-[0.45cqh] max-lg:landscape:rounded-bl-[0.3cqh] lg:border-b-[0.28vw] lg:border-l-[0.28vw] lg:rounded-bl-[0.25vw]',
  'border-b-[0.6cqw] border-r-[0.6cqw] rounded-br-[0.4cqw] max-lg:landscape:border-b-[0.45cqh] max-lg:landscape:border-r-[0.45cqh] max-lg:landscape:rounded-br-[0.3cqh] lg:border-b-[0.28vw] lg:border-r-[0.28vw] lg:rounded-br-[0.25vw]',
];

const PolaroidCarousel: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef(0);
  const x = useMotionValue(0);
  const [slow, setSlow] = useState(false);
  const isInView = useInView(wrapRef, { margin: '100px' });

  useAnimationFrame((_, delta) => {
    if (!isInView) return;
    const track = trackRef.current;
    if (!track) return;
    if (!seqRef.current) seqRef.current = track.scrollWidth / COPIES;
    const seq = seqRef.current;
    const speed = (seq / LOOP_SECONDS) * (slow ? SLOW_FACTOR : 1);
    let cur = x.get() - (speed * delta) / 1000;
    if (cur < -seq) cur += seq;
    x.set(cur);
  });

  return (
    <div
      ref={wrapRef}
      className="absolute inset-x-0 top-[4%] h-[36cqw] max-lg:landscape:top-[2%] max-lg:landscape:h-[27cqh] lg:top-[4%] lg:h-[16vw] z-10 overflow-hidden"
      onMouseEnter={() => setSlow(true)}
      onMouseLeave={() => setSlow(false)}
    >
      <motion.div
        ref={trackRef}
        style={{ x }}
        className="absolute inset-y-0 left-0 flex items-center will-change-transform"
      >
        {Array.from({ length: COPIES }).flatMap((_, c) =>
          CAROUSEL_IMAGES.map((item, i) => (
            <div
              key={`${c}-${i}`}
              style={{ transform: `rotate(${item.rot}deg)` }}
              className="relative shrink-0 aspect-[4/5] w-[24cqw] max-lg:landscape:w-[18cqh] lg:w-[10vw] bg-white rounded-[0.7cqw] max-lg:landscape:rounded-[0.4cqh] lg:rounded-[0.4vw] p-[1cqw] max-lg:landscape:p-[0.9cqh] lg:p-[0.6vw] -mr-[2cqw] max-lg:landscape:-mr-[1.4cqh] lg:-mr-[0.55vw] shadow-[0_0.5cqw_1cqw_rgba(0,0,0,0.18)] max-lg:landscape:shadow-[0_0.5cqh_1cqh_rgba(0,0,0,0.18)] lg:shadow-[0_0.25vw_0.6vw_rgba(0,0,0,0.18)] hover:scale-[1.1] hover:z-30 hover:shadow-[0_0.8cqw_1.8cqw_rgba(0,0,0,0.3)] max-lg:landscape:hover:shadow-[0_0.8cqh_1.8cqh_rgba(0,0,0,0.3)] lg:hover:shadow-[0_0.5vw_1.2vw_rgba(0,0,0,0.3)] transition-[scale,box-shadow] duration-300 flex flex-col"
            >
              <div className="flex-1 w-full overflow-hidden rounded-[0.3cqw] max-lg:landscape:rounded-[0.2cqh] lg:rounded-[0.2vw]">
                <img src={item.src} alt={item.label} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="pt-[1.4cqw] max-lg:landscape:pt-[1.2cqh] lg:pt-[0.8vw] text-center text-[2cqw] max-lg:landscape:text-[1.7cqh] lg:text-[0.7vw] font-mono uppercase tracking-[0.18em] text-[#151313]/60 whitespace-nowrap">
                {item.label}
              </p>
            </div>
          ))
        )}
      </motion.div>
    </div>
  );
};

const LandingContent: React.FC = () => {
  const dustRef = useRef<HTMLDivElement>(null);
  const dustInView = useInView(dustRef, { margin: '100px' });

  return (
  <div ref={dustRef} className="relative w-full h-full overflow-hidden bg-[#F5F0E8]">
    <div className="absolute inset-0 z-0 pointer-events-none bg-noise opacity-[0.05]" />

    <PolaroidCarousel />

    {DUST.map((d, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-[#151313]/35 z-20"
        style={{ left: d.x + '%', top: d.y + '%', width: d.s * 0.16 + 'vw', height: d.s * 0.16 + 'vw' }}
        animate={dustInView ? { y: [0, -14, 0], opacity: [0.2, 0.8, 0.2] } : { opacity: 0.5 }}
        transition={{ repeat: Infinity, duration: d.dur, delay: d.d, ease: 'easeInOut' }}
      />
    ))}

    <div className="absolute left-1/2 -translate-x-1/2 top-[31%] w-[88%] max-lg:landscape:top-[33%] max-lg:landscape:w-[84%] lg:top-[41%] lg:w-[56%] flex flex-col items-center text-center z-10 select-none">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
        className="flex items-center justify-center gap-[1.8cqw] max-lg:landscape:gap-[1.5cqh] lg:gap-[0.9vw]"
      >
        <span className="w-[4cqw] h-[0.55cqw] max-lg:landscape:w-[3cqh] max-lg:landscape:h-[0.45cqh] lg:w-[1.8vw] lg:h-[0.26vw] bg-[#641C2B] rounded-full" />
        <span className="font-mono text-[2.6cqw] max-lg:landscape:text-[2cqh] lg:text-[0.85vw] tracking-[0.35em] uppercase text-[#641C2B]">CSE — UAP</span>
      </motion.div>

      <div className="relative mt-[3cqw] max-lg:landscape:mt-[1.6cqh] lg:mt-[1.3vw]">
        {FOCUS_POSITIONS.map((pos, i) => (
          <span
            key={i}
            className={`absolute ${pos} w-[4.5cqw] h-[4.5cqw] max-lg:landscape:w-[3.5cqh] max-lg:landscape:h-[3.5cqh] lg:w-[2.4vw] lg:h-[2.4vw] border-[#641C2B]/80 ${FOCUS_CORNERS[i]}`}
          />
        ))}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease: EASE }}
          className="leading-[1.05]"
        >
        <span className="block font-medium text-[2.8cqw] max-lg:landscape:text-[2.4cqh] lg:text-[1.15vw] tracking-[0.42em] pl-[0.42em] text-[#641C2B]" style={{ fontFamily: "'Poppins', sans-serif" }}>FILM &amp;</span>
        <span className="mt-[1.4cqw] max-lg:landscape:mt-[0.8cqh] lg:mt-[0.7vw] block font-black text-[8.6cqw] max-lg:landscape:text-[7cqh] lg:text-[4.8vw] tracking-[-0.045em] leading-[1.02] text-[#151313]" style={{ fontFamily: "'Poppins', sans-serif" }}>PHOTOGRAPHY</span>
        <span className="mt-[1.6cqw] max-lg:landscape:mt-[1cqh] lg:mt-[0.8vw] block font-medium text-[3cqw] max-lg:landscape:text-[2.4cqh] lg:text-[1.25vw] tracking-[0.55em] pl-[0.55em] text-[#641C2B]" style={{ fontFamily: "'Poppins', sans-serif" }}>CLUB</span>
      </motion.h1>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
        className="mt-[3cqw] max-lg:landscape:mt-[1.5cqh] lg:mt-[1.2vw] text-[4.8cqw] max-lg:landscape:text-[3.8cqh] lg:text-[2.3vw] leading-[1.2] text-[#641C2B]"
        style={{ fontFamily: "'Great Vibes', cursive" }}
      >
        Seeing Beyond the Ordinary
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
        className="mt-[2cqw] max-lg:landscape:mt-[1.3cqh] lg:mt-[0.8vw] text-[3cqw] max-lg:landscape:text-[1.9cqh] lg:text-[1vw] leading-relaxed text-[#151313]/60 max-w-[70cqw] max-lg:landscape:max-w-[44cqw] lg:max-w-[26vw]"
      >
        Capturing moments, creating stories, and bringing creative people together.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.8, ease: EASE }}
        className="mt-[3.2cqw] max-lg:landscape:mt-[1.8cqh] lg:mt-[1.2vw] flex flex-col max-lg:landscape:flex-row lg:flex-row items-center justify-center gap-[2cqw] max-lg:landscape:gap-[1.4cqh] lg:gap-[0.9vw]"
      >
        <button
          onClick={() => scrollToId('timeline')}
          className="bg-[#641C2B] hover:bg-[#3D111B] text-[#F5F0E8] font-mono uppercase tracking-[0.22em] text-[3cqw] max-lg:landscape:text-[1.9cqh] lg:text-[0.85vw] px-[6cqw] py-[3.4cqw] max-lg:landscape:px-[2.4cqh] max-lg:landscape:py-[1.7cqh] lg:px-[1.5vw] lg:py-[0.9vw] rounded-full transition-colors cursor-pointer shadow-[0_0.6vw_1.2vw_rgba(100,28,43,0.3)]"
        >
          Explore Our Story
        </button>
        <button
          onClick={() => scrollToId('socials')}
          className="border border-[#641C2B]/40 hover:bg-[#641C2B]/10 text-[#641C2B] font-mono uppercase tracking-[0.22em] text-[3cqw] max-lg:landscape:text-[1.9cqh] lg:text-[0.85vw] px-[6cqw] py-[3.4cqw] max-lg:landscape:px-[2.4cqh] max-lg:landscape:py-[1.7cqh] lg:px-[1.5vw] lg:py-[0.9vw] rounded-full transition-colors cursor-pointer"
        >
          Contact Us
        </button>
      </motion.div>
    </div>
  </div>
  );
};

const CameraUI: React.FC = () => (
  <div className="absolute inset-0 z-30 pointer-events-none select-none font-mono">
    <div className="absolute inset-x-0 top-0 h-[10%] flex items-start justify-center pt-[1.6%] max-lg:landscape:justify-start max-lg:landscape:pl-[3%] lg:justify-start lg:pl-[2.5%] text-[#151313]">
      <div className="flex items-center gap-[2.4cqw] max-lg:landscape:gap-[2cqh] lg:gap-[0.7vw]">
        <Flashlight size={12} className="w-[3.6cqw] h-[3.6cqw] max-lg:landscape:w-[3.2cqh] max-lg:landscape:h-[3.2cqh] lg:w-[0.8vw] lg:h-[0.8vw] text-[#151313]/70" />
        <span className="rounded-full bg-[#151313]/[0.07] border border-[#151313]/15 px-[1.6cqw] py-[0.5cqw] max-lg:landscape:px-[1.3cqh] max-lg:landscape:py-[0.4cqh] lg:px-[0.45vw] lg:py-[0.14vw] text-[2.8cqw] max-lg:landscape:text-[2.3cqh] lg:text-[0.6vw] leading-none text-[#151313]">1x</span>
        <span className="relative w-[3.6cqw] h-[3.6cqw] max-lg:landscape:w-[3.2cqh] max-lg:landscape:h-[3.2cqh] lg:w-[0.8vw] lg:h-[0.8vw] rounded-full border-[0.24cqw] max-lg:landscape:border-[0.2cqh] lg:border-[0.05vw] border-[#151313]/70">
          <span className="absolute inset-[0.45cqw] max-lg:landscape:inset-[0.4cqh] lg:inset-[0.11vw] rounded-full border-[0.24cqw] max-lg:landscape:border-[0.2cqh] lg:border-[0.05vw] border-[#151313]/70" />
        </span>
        <Timer size={12} className="w-[3.6cqw] h-[3.6cqw] max-lg:landscape:w-[3.2cqh] max-lg:landscape:h-[3.2cqh] lg:w-[0.8vw] lg:h-[0.8vw] text-[#151313]/70" />
      </div>
    </div>

    <div className="absolute left-[45%] top-[15%] w-[14cqw] h-[14cqw] max-lg:landscape:top-[16%] max-lg:landscape:w-[9.5cqh] max-lg:landscape:h-[9.5cqh] lg:top-[25%] lg:w-[6vw] lg:h-[6vw]">
      <span className="absolute top-0 left-0 w-[3cqw] h-[3cqw] border-t-[0.55cqw] border-l-[0.55cqw] max-lg:landscape:w-[1.7cqh] max-lg:landscape:h-[1.7cqh] max-lg:landscape:border-t-[0.32cqh] max-lg:landscape:border-l-[0.32cqh] lg:w-[1vw] lg:h-[1vw] lg:border-t-[0.2vw] lg:border-l-[0.2vw] border-[#151313]/70 rounded-tl-[0.3vw]" />
      <span className="absolute top-0 right-0 w-[3cqw] h-[3cqw] border-t-[0.55cqw] border-r-[0.55cqw] max-lg:landscape:w-[1.7cqh] max-lg:landscape:h-[1.7cqh] max-lg:landscape:border-t-[0.32cqh] max-lg:landscape:border-r-[0.32cqh] lg:w-[1vw] lg:h-[1vw] lg:border-t-[0.2vw] lg:border-r-[0.2vw] border-[#151313]/70 rounded-tr-[0.3vw]" />
      <span className="absolute bottom-0 left-0 w-[3cqw] h-[3cqw] border-b-[0.55cqw] border-l-[0.55cqw] max-lg:landscape:w-[1.7cqh] max-lg:landscape:h-[1.7cqh] max-lg:landscape:border-b-[0.32cqh] max-lg:landscape:border-l-[0.32cqh] lg:w-[1vw] lg:h-[1vw] lg:border-b-[0.2vw] lg:border-l-[0.2vw] border-[#151313]/70 rounded-bl-[0.3vw]" />
      <span className="absolute bottom-0 right-0 w-[3cqw] h-[3cqw] border-b-[0.55cqw] border-r-[0.55cqw] max-lg:landscape:w-[1.7cqh] max-lg:landscape:h-[1.7cqh] max-lg:landscape:border-b-[0.32cqh] max-lg:landscape:border-r-[0.32cqh] lg:w-[1vw] lg:h-[1vw] lg:border-b-[0.2vw] lg:border-r-[0.2vw] border-[#151313]/70 rounded-br-[0.3vw]" />
    </div>

    <div className="absolute inset-x-0 bottom-[17%] flex justify-center max-lg:landscape:inset-x-auto max-lg:landscape:bottom-auto max-lg:landscape:top-1/2 max-lg:landscape:-translate-y-1/2 max-lg:landscape:right-[13.5%] lg:inset-x-auto lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:right-[12.5%]">
      <div className="flex items-center gap-[0.4cqw] rounded-full bg-white/75 shadow-[0_0.3cqw_0.9cqw_rgba(0,0,0,0.18)] p-[0.7cqw] max-lg:landscape:flex-col max-lg:landscape:gap-[0.5cqh] max-lg:landscape:p-[0.7cqh] lg:flex-col lg:gap-[0.2vw] lg:p-[0.26vw]">
        <span className="rounded-full bg-[#151313] text-[#F5F0E8] px-[2.2cqw] py-[0.8cqw] max-lg:landscape:px-[1cqh] max-lg:landscape:py-[1.2cqh] lg:px-[0.5vw] lg:py-[0.5vw] text-[2.8cqw] max-lg:landscape:text-[2.2cqh] lg:text-[0.6vw] tracking-[0.12em] leading-none">Photo</span>
        <span className="px-[1.8cqw] py-[0.8cqw] max-lg:landscape:px-[0.5cqh] max-lg:landscape:py-[1.2cqh] lg:px-[0.3vw] lg:py-[0.5vw] text-[2.8cqw] max-lg:landscape:text-[2.2cqh] lg:text-[0.6vw] tracking-[0.12em] leading-none text-[#151313]/60">Video</span>
        <span className="hidden max-lg:landscape:inline lg:inline px-[1.8cqw] py-[0.8cqw] max-lg:landscape:px-[0.5cqh] max-lg:landscape:py-[1.2cqh] lg:px-[0.3vw] lg:py-[0.5vw] text-[2.8cqw] max-lg:landscape:text-[2.2cqh] lg:text-[0.6vw] tracking-[0.12em] leading-none text-[#151313]/60">Portrait</span>
        <span className="hidden lg:inline px-[1.8cqw] py-[0.8cqw] lg:px-[0.3vw] lg:py-[0.5vw] text-[2.8cqw] lg:text-[0.6vw] tracking-[0.12em] leading-none text-[#151313]/60">Pano</span>
      </div>
    </div>

    <div className="absolute inset-x-0 bottom-0 h-[15%] flex items-center justify-between px-[2.5%] text-[#151313] max-lg:landscape:inset-x-auto max-lg:landscape:top-0 max-lg:landscape:right-0 max-lg:landscape:bottom-0 max-lg:landscape:left-auto max-lg:landscape:w-[12%] max-lg:landscape:h-auto max-lg:landscape:flex-col max-lg:landscape:items-center max-lg:landscape:justify-between max-lg:landscape:px-0 max-lg:landscape:pt-[3%] max-lg:landscape:pb-[3%] lg:inset-x-auto lg:top-0 lg:right-0 lg:bottom-0 lg:left-auto lg:w-[12%] lg:h-auto lg:flex-col lg:items-center lg:justify-between lg:px-0 lg:pt-[3%] lg:pb-[3%]">
      <div className="relative w-[12cqw] max-lg:landscape:w-[12cqh] lg:w-[55%] aspect-[4/3] rounded-[0.8cqw] max-lg:landscape:rounded-[0.5cqh] lg:rounded-[0.3vw] overflow-hidden border border-[#151313]/25 shadow-md">
        <img src="/images/gallery1.jpg" className="w-full h-full object-cover" />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center max-lg:landscape:static max-lg:landscape:left-auto max-lg:landscape:translate-x-0 lg:static lg:left-auto lg:translate-x-0">
        <div className="w-[18cqw] h-[18cqw] max-lg:landscape:w-[16cqh] max-lg:landscape:h-[16cqh] lg:w-[4.8vw] lg:h-[4.8vw] rounded-full border-[0.45cqw] max-lg:landscape:border-[0.4cqh] lg:border-[0.26vw] border-[#151313]/70 bg-[#F5F0E8]/50 flex items-center justify-center shadow-[0_0.5vw_1vw_rgba(0,0,0,0.25)]">
          <div className="w-[13cqw] h-[13cqw] max-lg:landscape:w-[11.5cqh] max-lg:landscape:h-[11.5cqh] lg:w-[3.5vw] lg:h-[3.5vw] rounded-full bg-white" />
        </div>
      </div>

      <div className="flex items-center justify-center w-[12cqw] max-lg:landscape:w-[12cqh] lg:w-[55%]">
        <FlipHorizontal2 size={12} className="w-[4.4cqw] h-[4.4cqw] max-lg:landscape:w-[3.8cqh] max-lg:landscape:h-[3.8cqh] lg:w-[0.9vw] lg:h-[0.9vw] text-[#151313]/70" />
      </div>
    </div>
  </div>
);

const GlassReflection: React.FC = () => (
  <div className="absolute inset-0 z-40 pointer-events-none rounded-[14%/6.5%] max-lg:landscape:rounded-[3%/6.1%] lg:rounded-[3%/6.1%] overflow-hidden">
    <div className="absolute -left-[15%] -top-[30%] h-[160%] w-[55%] rotate-[16deg] bg-gradient-to-br from-white/[0.13] via-white/[0.02] to-transparent" />
    <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.08] rounded-[14%/6.5%] max-lg:landscape:rounded-[3%/6.1%] lg:rounded-[3%/6.1%]" />
    <div className="absolute top-[0.5%] left-[3%] right-[3%] h-px bg-white/25" />
  </div>
);

// Static blurred backdrop for the hero stage. Deliberately has NO animation so the
// browser can cache the full-screen blur instead of re-running it every frame.
const BACKDROP_IMAGES = [
  '/images/gallery1.jpg',
  '/images/event1.jpg',
  '/images/gallery2.jpg',
  '/images/event2.jpg',
  '/images/gallery3.jpg',
  '/images/event3.jpg',
  '/images/gallery4.jpg',
  '/images/gallery1.jpg',
];

const HeroBackdrop: React.FC = () => (
  <div className="relative w-full h-full overflow-hidden bg-[#151313]">
    <div className="absolute inset-0 grid grid-cols-4 grid-rows-2">
      {BACKDROP_IMAGES.map((src, i) => (
        <img key={i} src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
      ))}
    </div>
    <div className="absolute inset-0 bg-noise opacity-[0.06]" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#151313] via-[#151313]/40 to-[#151313]/70" />
  </div>
);

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen bg-[#F5F0E8] overflow-hidden pt-[84px] md:pt-[96px]">
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none blur-[5px] brightness-[0.55] saturate-[0.8] scale-[1.03] [container-type:size]">
        <HeroBackdrop />
      </div>
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(21,19,19,0.6)_100%)]" />

      <div className="relative z-20 flex flex-1 items-center justify-center w-full min-h-[calc(100vh-84px)] md:min-h-[calc(100vh-96px)] pb-[3vh]">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.15, ease: EASE }}
          className="relative h-[calc(100dvh-100px)] w-auto aspect-[9/19.5] max-lg:landscape:h-[calc(100dvh-92px)] max-lg:landscape:max-w-[94vw] max-lg:landscape:aspect-[16/9.4] lg:h-auto lg:w-[84vw] lg:aspect-[16/9.4]"
        >
          <div className="absolute inset-0 rounded-[16%/8%] max-lg:landscape:rounded-[3.8%/7.4%] lg:rounded-[3.8%/7.4%] bg-gradient-to-br from-[#3d3d3d] via-[#171717] to-[#343434] p-[1.05%] shadow-[0_40px_80px_-12px_rgba(0,0,0,0.65),0_120px_220px_-40px_rgba(0,0,0,0.55)]">
            <div className="absolute -top-[1.2%] left-[14%] w-[2.6%] h-[0.9%] rounded-full bg-[#262626]" />
            <div className="absolute -top-[1.2%] left-[17.8%] w-[2.6%] h-[0.9%] rounded-full bg-[#262626]" />
            <div className="absolute -top-[1.2%] right-[10%] w-[4.2%] h-[0.9%] rounded-full bg-[#262626]" />

            <div className="relative w-full h-full rounded-[14%/6.5%] max-lg:landscape:rounded-[3%/6.1%] lg:rounded-[3%/6.1%] [container-type:size] overflow-hidden bg-[#F5F0E8]">
              <LandingContent />
              <CameraUI />
              <GlassReflection />
            </div>

            <div className="absolute left-[0.4%] top-1/2 -translate-y-1/2 w-[1.15%] h-[3.4%] rounded-full bg-[#0d0d0d] border border-white/10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
