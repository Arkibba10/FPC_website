import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClub } from '../context/useClub';
import { UpdatePost } from '../types';
import { Clapperboard } from './animated/Clapperboard';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- Custom archival line-art icons (shutter/aperture/reel, not stock social) ---------- */

const ApertureIcon: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 3.4 18 12 12 20.6 6 12z" fill={filled ? 'currentColor' : 'none'} />
    <path d="M3.6 9.4l16.8 5.2M3.6 14.6l16.8-5.2" />
  </svg>
);

const FrameCommentIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3.5" y="4.5" width="17" height="11.5" rx="2.5" />
    <path d="M8.8 8.4h6.4M8.8 11.2h3.4" />
    <path d="M12 16v3.2l3-3.2" />
  </svg>
);

const ReelSaveIcon: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6.5 3.5h11v17l-5.5-3.7-5.5 3.7z" fill={filled ? 'currentColor' : 'none'} />
    <rect x="9.4" y="6.4" width="1.8" height="2.8" rx="0.9" fill="currentColor" />
    <rect x="12.8" y="6.4" width="1.8" height="2.8" rx="0.9" fill="currentColor" />
  </svg>
);

/* ---------- Real, persisted post engagement (localStorage, synced across tabs) ---------- */

interface Comment {
  author: string;
  text: string;
}

const KEY_LIKES = 'fpc_post_likes';
const KEY_COMMENTS = 'fpc_post_comments';

interface LikeState {
  count: number;
  me: boolean;
}

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const parseDate = (s: string): number => {
  const t = new Date(s.replace(',', '')).getTime();
  return Number.isNaN(t) ? 0 : t;
};

interface TagInfo {
  label: string;
  dim?: boolean;
  cls: string;
}

export const UpdatesFeed: React.FC = () => {
  const { updates, user } = useClub();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [likes, setLikes] = useState<Record<string, LikeState>>(() => readJson(KEY_LIKES, {}));
  const [comments, setComments] = useState<Record<string, Comment[]>>(() => readJson(KEY_COMMENTS, {}));
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  /* Persist engagement + keep it in sync across open tabs in real time. */
  useEffect(() => {
    try {
      localStorage.setItem(KEY_LIKES, JSON.stringify(likes));
    } catch {
      /* storage full — ignore */
    }
  }, [likes]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY_COMMENTS, JSON.stringify(comments));
    } catch {
      /* storage full — ignore */
    }
  }, [comments]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY_LIKES) setLikes(readJson(KEY_LIKES, {}));
      if (e.key === KEY_COMMENTS) setComments(readJson(KEY_COMMENTS, {}));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const sorted = useMemo(
    () => [...updates].sort((a, b) => parseDate(b.date) - parseDate(a.date)),
    [updates],
  );

  const recentId = useMemo(() => {
    const p = sorted.find((u) => u.status !== 'upcoming');
    return p ? p.id : null;
  }, [sorted]);

  const tagInfo = (post: UpdatePost): TagInfo => {
    if (post.status === 'upcoming') {
      return { label: 'DROPPING SOON', dim: true, cls: 'bg-charcoal text-gold border-charcoal/40' };
    }
    if (post.id === recentId) {
      return { label: 'RECENT', cls: 'bg-burgundy text-gold border-burgundy/50' };
    }
    return { label: 'EVENT RECAP', cls: 'bg-burgundy/80 text-gold border-burgundy/40' };
  };

  const active = updates.find((u) => u.id === activeId) ?? updates.find((u) => u.status !== 'upcoming') ?? updates[0];
  const frameNo = active ? sorted.findIndex((p) => p.id === active.id) + 1 : 0;

  if (!active) {
    return (
      <section className="relative py-24 bg-beige overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <p className="font-playfair text-xl text-charcoal/70">No bulletins yet.</p>
        </div>
      </section>
    );
  }

  const activeTag = tagInfo(active);
  const activeLike = likes[active.id] ?? { count: 0, me: false };
  const activeSaved = !!saved[active.id];
  const likeCount = activeLike.count;
  const commentCount = (comments[active.id] ?? []).length;

  const toggleLike = () =>
    setLikes((prev) => {
      const cur = prev[active.id] ?? { count: 0, me: false };
      const me = !cur.me;
      return { ...prev, [active.id]: { count: cur.count + (me ? 1 : -1), me } };
    });
  const toggleSave = () => setSaved((s) => ({ ...s, [active.id]: !s[active.id] }));

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInput.trim();
    if (!text) return;
    const author = user?.username || 'guest';
    setComments((prev) => ({
      ...prev,
      [active.id]: [...(prev[active.id] ?? []), { author, text }],
    }));
    setCommentInput('');
  };

  return (
    <section className="relative py-24 bg-beige overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04]" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        {/* Editorial header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-burgundy block mb-3">
              Live Bulletins
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-charcoal leading-tight">
              Updates <span className="italic font-normal text-burgundy">&amp; Highlights</span>
            </h2>
            <div className="w-20 h-px bg-burgundy/40 mt-6" />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-charcoal/40 uppercase tracking-[0.25em] text-right hidden sm:block">
              One frame at a time
              <br />
              — curated by FPC
            </span>
            <Clapperboard size={56} />
          </div>
        </div>

        {/* Two-column feed */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
          {/* Main featured post (~60%) */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.article
                key={active.id}
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -32 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="bg-white border border-charcoal/15 rounded-2xl overflow-hidden shadow-[0_24px_60px_-32px_rgba(42,42,42,0.4)]"
              >
                {/* Film-strip hairline */}
                <div className="h-[3px] bg-gradient-to-r from-burgundy via-burgundy/60 to-transparent" />

                {/* Header: avatar / poster / tag / exposure stamp */}
                <div className="flex items-center gap-3 px-5 md:px-6 pt-5 pb-4">
                  <img
                    src="/images/FPC_Logo.png"
                    alt=""
                    aria-hidden
                    className="w-11 h-11 rounded-full object-cover border border-charcoal/15 bg-charcoal/5 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-playfair font-semibold text-[15px] text-charcoal leading-tight">
                      FPC · CSE-UAP
                    </div>
                    <span
                      className={`mt-1 inline-block px-2 py-0.5 rounded-full border font-mono text-[8.5px] tracking-[0.18em] uppercase ${activeTag.cls}`}
                    >
                      {activeTag.label}
                    </span>
                  </div>
                  <div className="ml-auto text-right flex-shrink-0">
                    <div className="font-mono text-[10px] tracking-[0.22em] text-burgundy uppercase">
                      Frame {String(frameNo).padStart(2, '0')} · {active.category.toUpperCase()}
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] tracking-[0.12em] text-charcoal/50 uppercase">
                      {active.date}
                    </div>
                  </div>
                </div>

                {/* Bordered image with paper-texture edge */}
                <div className="px-5 md:px-6">
                  <div className="relative border border-charcoal/25 p-1.5 bg-[#F7F2EB]/60">
                    <div className="relative aspect-[4/3] overflow-hidden bg-charcoal/5">
                      <img
                        src={active.image}
                        alt={active.title}
                        draggable={false}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-noise opacity-[0.06] pointer-events-none" />
                      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_0_1px_rgba(42,42,42,0.14)]" />
                    </div>
                  </div>
                </div>

                {/* Interaction bar — custom line-art in maroon/ink */}
                <div className="flex items-center gap-6 px-5 md:px-6 py-4">
                  <button
                    type="button"
                    aria-label={activeLike.me ? 'Unlike this post' : 'Like this post'}
                    onClick={toggleLike}
                    className={`flex items-center gap-2 transition-colors duration-300 ${
                      activeLike.me ? 'text-burgundy' : 'text-charcoal/55 hover:text-burgundy'
                    }`}
                  >
                    <motion.span whileTap={{ scale: 0.75, rotate: -12 }} className="flex">
                      <ApertureIcon filled={activeLike.me} />
                    </motion.span>
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em]">
                      {likeCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-label="Toggle comments"
                    onClick={() => setCommentsOpen((o) => !o)}
                    className={`flex items-center gap-2 transition-colors duration-300 ${
                      commentsOpen ? 'text-burgundy' : 'text-charcoal/55 hover:text-burgundy'
                    }`}
                  >
                    <motion.span whileTap={{ scale: 0.75 }} className="flex">
                      <FrameCommentIcon />
                    </motion.span>
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em]">
                      {commentCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-label={activeSaved ? 'Remove from saved' : 'Save this post'}
                    onClick={toggleSave}
                    className={`ml-auto flex transition-colors duration-300 ${
                      activeSaved ? 'text-burgundy' : 'text-charcoal/55 hover:text-burgundy'
                    }`}
                  >
                    <motion.span whileTap={{ scale: 0.75 }} className="flex">
                      <ReelSaveIcon filled={activeSaved} />
                    </motion.span>
                  </button>
                </div>

                {/* Counts + caption */}
                <div className="px-5 md:px-6 pb-5">
                  <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/60">
                    {likeCount} likes · {commentCount} comments
                  </p>
                  <p className="mt-3 font-playfair text-[15px] leading-[1.7] text-charcoal/85">
                    {active.content}
                  </p>
                </div>

                {/* Expandable comment section */}
                <div className="px-5 md:px-6 pb-6">
                  <button
                    type="button"
                    onClick={() => setCommentsOpen((o) => !o)}
                    className="font-mono text-[10px] tracking-[0.2em] uppercase text-burgundy hover:opacity-70 transition-opacity"
                  >
                    {commentsOpen ? 'Hide comments' : `View comments (${commentCount})`}
                  </button>

                  <AnimatePresence initial={false}>
                    {commentsOpen && (
                      <motion.div
                        key="comments"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-charcoal/10 mt-3 pt-3 space-y-2.5">
                          {(comments[active.id] ?? []).map((c, i) => (
                            <div key={i} className="flex items-baseline gap-2">
                              <span className="font-sans text-[12px] font-semibold text-charcoal flex-shrink-0">
                                {c.author}
                              </span>
                              <span className="font-sans text-[13px] text-charcoal/70">{c.text}</span>
                            </div>
                          ))}
                        </div>

                        <form onSubmit={submitComment} className="mt-3 flex items-center gap-2">
                          <input
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            placeholder="Add a comment…"
                            aria-label="Add a comment"
                            className="flex-1 min-w-0 bg-charcoal/5 border border-charcoal/15 rounded-lg px-3 py-2 font-sans text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-burgundy/50 focus:bg-white transition-colors"
                          />
                          <motion.button
                            type="submit"
                            whileTap={{ scale: 0.85 }}
                            aria-label="Post comment"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-burgundy/30 bg-burgundy/10 text-burgundy hover:bg-burgundy hover:text-gold transition-colors flex-shrink-0"
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M12 19V5M5 12l7-7 7 7" transform="rotate(180 12 12)" />
                            </svg>
                          </motion.button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* Contact-sheet / light-table list (~40%) */}
          <div className="lg:col-span-2">
            <div className="bg-[#1b1b1b] border border-charcoal/25 rounded-2xl overflow-hidden shadow-[0_24px_60px_-32px_rgba(42,42,42,0.5)]">
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold/70">
                  Contact Sheet
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30">
                  {sorted.length} negatives
                </span>
              </div>

              <div className="p-4 space-y-3">
                {sorted.map((post) => {
                  const tag = tagInfo(post);
                  const isActive = post.id === active.id;
                  return (
                    <motion.button
                      key={post.id}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setActiveId(post.id);
                        setCommentsOpen(false);
                      }}
                      className={`w-full text-left group rounded-xl border p-3 transition-[border-color,background-color] duration-300 cursor-pointer ${
                        isActive
                          ? 'border-gold/60 bg-white/[0.06]'
                          : 'border-white/[0.07] bg-white/[0.03] hover:border-gold/30'
                      } ${tag.dim ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-16 h-16 rounded-md overflow-hidden border border-white/10 flex-shrink-0 bg-black transition-[filter,transform] duration-300 group-hover:brightness-125 group-hover:scale-[1.04] ${
                            tag.dim ? 'saturate-[0.35] sepia-[0.5] contrast-[0.92]' : ''
                          }`}
                        >
                          <img
                            src={post.image}
                            alt=""
                            draggable={false}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className={`font-playfair text-[13px] leading-snug line-clamp-2 transition-colors duration-300 ${
                              tag.dim ? 'text-white/40' : 'text-white/90 group-hover:text-gold'
                            }`}
                          >
                            {post.title}
                          </div>
                          <div className="mt-1.5 flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.5 rounded-full border font-mono text-[7.5px] tracking-[0.16em] uppercase ${tag.cls}`}
                            >
                              {tag.label}
                            </span>
                            <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-white/35 truncate">
                              {post.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
