import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClub } from '../context/useClub';
import { UpdatePost } from '../types';
import { Calendar, Sparkles, X, ArrowUpRight, Megaphone, Trophy, PartyPopper } from 'lucide-react';
import { Clapperboard } from './animated/Clapperboard';

export const UpdatesFeed: React.FC = () => {
  const { updates } = useClub();
  const [selectedUpdate, setSelectedEvent] = useState<UpdatePost | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Achievement': return <Trophy size={14} className="text-gold" />;
      case 'Announcement': return <Megaphone size={14} className="text-gold" />;
      case 'Celebration': return <PartyPopper size={14} className="text-gold" />;
      default: return <Sparkles size={14} className="text-gold" />;
    }
  };

  return (
    <section className="py-24 bg-charcoal relative overflow-hidden">
      {/* Film sprocket holes on top and bottom of the section to look like a giant 35mm film strip! */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-black flex justify-around items-center opacity-40 z-10 select-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={`sprocket-t-${i}`} className="w-4 h-3 bg-charcoal rounded-sm" />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-black flex justify-around items-center opacity-40 z-10 select-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={`sprocket-b-${i}`} className="w-4 h-3 bg-charcoal rounded-sm" />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 py-4">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-gold font-mono uppercase tracking-widest text-xs block mb-3">
              Live Bulletins
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white leading-tight">
              Updates <span className="italic text-gold font-normal">&amp; Highlights</span>
            </h2>
            <div className="w-20 h-[1px] bg-gold/40 mt-6"></div>
          </div>
          
          {/* Animated Clapperboard next to header */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest text-right hidden sm:block">
              ✦ Click or Hover <br />to trigger action
            </span>
            <Clapperboard size={60} />
          </div>
        </div>

        {/* Updates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {updates.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              onClick={() => setSelectedEvent(post)}
              className="group bg-charcoal-dark border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-gold/30 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all duration-500 flex flex-col h-full"
            >
              {/* Photo Header — retro box TV overlay */}
              <div className="relative aspect-video w-full overflow-hidden bg-[#1f1f1f] flex-shrink-0">
                <div className="absolute inset-0 p-[5%] flex flex-col">
                  {/* Antenna */}
                  <div className="h-[18%] flex items-center justify-center gap-[4%] shrink-0">
                    <div className="w-[2.5%] h-[85%] max-w-[6px] bg-gradient-to-b from-[#9a9a9a] to-[#565656] rounded-sm rotate-[-32deg] shadow-sm" />
                    <div className="w-[2.5%] h-[85%] max-w-[6px] bg-gradient-to-b from-[#9a9a9a] to-[#565656] rounded-sm rotate-[32deg] shadow-sm" />
                  </div>

                  {/* CRT Screen */}
                  <div className="relative flex-1 min-h-0 rounded-[10px] border-[3px] border-[#3a3a3a] bg-black overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    {/* Scanlines */}
                    <div className="absolute inset-0 pointer-events-none scanlines opacity-40" />
                    {/* Glass reflection */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/15 via-transparent to-transparent" />
                    {/* Screen curvature vignette */}
                    <div className="absolute inset-0 pointer-events-none rounded-[7px] shadow-[inset_0_0_24px_rgba(0,0,0,0.65)]" />

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-burgundy/90 text-gold border border-gold/30 text-[9px] font-mono uppercase tracking-wider px-2 py-1 rounded-full shadow-lg z-10">
                      {getCategoryIcon(post.category)}
                      <span>{post.category}</span>
                    </div>
                  </div>

                  {/* Control knobs + power LED */}
                  <div className="h-[16%] flex items-center justify-center gap-[4%] shrink-0">
                    <div className="w-[4%] max-w-[10px] aspect-square rounded-full bg-gradient-to-br from-[#8f8f8f] to-[#3a3a3a] border border-black/50 shadow-inner" />
                    <div className="w-[4%] max-w-[10px] aspect-square rounded-full bg-gradient-to-br from-[#8f8f8f] to-[#3a3a3a] border border-black/50 shadow-inner" />
                    <div className="w-[4%] max-w-[10px] aspect-square rounded-full bg-gradient-to-br from-[#8f8f8f] to-[#3a3a3a] border border-black/50 shadow-inner" />
                    <div className="w-[5%] max-w-[10px] aspect-square rounded-full bg-red-500/90 shadow-[0_0_6px_rgba(255,40,40,0.9)]" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40">
                    <Calendar size={12} className="text-gold/50" />
                    <span>{post.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-playfair font-bold text-white group-hover:text-gold transition-colors duration-300 leading-tight">
                    {post.title}
                  </h3>

                  {/* Content snippet */}
                  <p className="text-xs text-white/50 font-sans line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Footer link */}
                <div className="border-t border-white/5 pt-4 mt-5 flex items-center justify-between text-[10px] font-mono text-gold uppercase tracking-wider">
                  <span>Read Bulletin</span>
                  <div className="p-1.5 rounded-full bg-white/5 text-gold group-hover:bg-burgundy group-hover:scale-110 transition-all duration-300">
                    <ArrowUpRight size={12} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Update Modal */}
      <AnimatePresence>
        {selectedUpdate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-black/95 backdrop-blur-md z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative bg-charcoal-dark border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden z-50 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 border border-white/10 text-white hover:bg-burgundy hover:text-gold hover:scale-110 transition-all duration-300 z-50 cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Cover Image */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img src={selectedUpdate.image} alt={selectedUpdate.title} className="w-full h-full object-cover opacity-85" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute bottom-6 left-6 flex items-center gap-1.5 bg-burgundy text-gold border border-gold/30 text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full">
                  {getCategoryIcon(selectedUpdate.category)}
                  <span>{selectedUpdate.category}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                  <Calendar size={14} className="text-gold" />
                  <span>{selectedUpdate.date}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-white leading-tight">
                  {selectedUpdate.title}
                </h2>

                <div className="w-12 h-[1px] bg-gold/40 my-3"></div>

                <p className="text-white/80 text-sm leading-relaxed font-sans whitespace-pre-line">
                  {selectedUpdate.content}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .scanlines {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0) 0px,
            rgba(0, 0, 0, 0) 2px,
            rgba(0, 0, 0, 0.32) 2px,
            rgba(0, 0, 0, 0.32) 3px
          );
        }
        @media (prefers-reduced-motion: reduce) {
          .scanlines {
            background-size: 100% 3px;
          }
        }
      `}</style>
    </section>
  );
};
