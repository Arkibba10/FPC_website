import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GalleryItem } from '../types';
import { Calendar, User, Download } from 'lucide-react';
import { FilmReel } from './animated/FilmReel';

interface HorizontalGalleryProps {
  gallery: GalleryItem[];
}

export const HorizontalGallery: React.FC<HorizontalGalleryProps> = ({ gallery }) => {
  const targetRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Map scroll progress to horizontal translation
  const totalItems = gallery.length;
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(totalItems - 1) * 85}%`]);

  // Film running effect: sprocket holes crawl with scroll
  const sprocketX = useTransform(scrollYProgress, [0, 1], ['0px', '-120px']);

  // Reels drift vertically with scroll
  const reelY = useTransform(scrollYProgress, [0, 1], [40, -160]);
  const reelY2 = useTransform(scrollYProgress, [0, 1], [-40, 160]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-beige">
      {/* Sticky container that stays in viewport */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden py-12 relative">

        {/* Scroll-movable film reels */}
        <motion.div style={{ y: reelY }} className="absolute left-3 md:left-8 top-16 z-10 opacity-30 pointer-events-none will-change-transform">
          <FilmReel size={90} />
        </motion.div>
        <motion.div style={{ y: reelY2 }} className="absolute right-3 md:right-8 bottom-16 z-10 opacity-30 pointer-events-none will-change-transform">
          <FilmReel size={70} />
        </motion.div>

        {/* Gallery Title & Header */}
        <div className="max-w-6xl mx-auto w-full px-6 md:px-12 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-burgundy font-mono uppercase tracking-widest text-xs block mb-3">
              Curated Exhibition
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-charcoal leading-tight">
              The Digital <span className="italic text-burgundy font-normal">Gallery</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <p className="text-sm font-mono text-charcoal/60 uppercase tracking-widest">
              ✦ Scroll down to traverse
            </p>
            <div className="w-24 h-[1px] bg-burgundy/30 mt-2"></div>
          </div>
        </div>

        {/* Horizontal Moving Content */}
        <div className="relative flex-1 flex items-center">
          <motion.div style={{ x }} className="flex flex-col w-max will-change-transform">
            {/* Top film band with sprocket holes */}
            <div className="relative h-7 md:h-10 bg-[#151515] border-2 border-b-0 border-[#2A2A2A] rounded-t-2xl overflow-hidden">
              <motion.div style={{ x: sprocketX }} className="film-holes absolute inset-y-0 left-0 w-[300%] will-change-transform" />
            </div>

            {/* Card row */}
            <div className="flex gap-8 px-6 md:px-12 py-3">
              {gallery.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="relative w-[80vw] md:w-[65vw] lg:w-[50vw] h-[52vh] md:h-[56vh] rounded-3xl overflow-hidden shadow-2xl group border border-charcoal/5 flex-shrink-0 bg-charcoal"
                  >
                    {/* Image with hover zoom */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
                    </div>

                    {/* Download Floating Button at Top Right of the card */}
                    <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a
                        href={item.image}
                        download={`${item.title.replace(/\s+/g, '_')}.jpg`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full bg-black/60 hover:bg-burgundy text-white hover:text-gold border border-white/10 hover:border-gold/30 flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 cursor-pointer"
                        title="Download High-Res"
                      >
                        <Download size={16} />
                      </a>
                    </div>

                    {/* Glass Card Details at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10 flex flex-col justify-end h-1/2">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-gold text-charcoal text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-2 group-hover:text-gold transition-colors duration-300">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-sm text-white/70 font-sans line-clamp-2 max-w-xl mb-4 group-hover:text-white/90 transition-colors duration-300">
                          {item.description}
                        </p>
                      )}

                      <div className="w-full h-[1px] bg-white/10 my-3"></div>

                      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/50">
                        <div className="flex items-center gap-1.5">
                          <User size={12} className="text-gold" />
                          <span>By {item.photographer}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-gold" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Frame Border */}
                    <div className="absolute inset-4 border border-white/0 group-hover:border-white/10 rounded-2xl pointer-events-none transition-all duration-700"></div>
                  </div>
                );
              })}
            </div>

            {/* Bottom film band with sprocket holes */}
            <div className="relative h-7 md:h-10 bg-[#151515] border-2 border-t-0 border-[#2A2A2A] rounded-b-2xl overflow-hidden">
              <motion.div style={{ x: sprocketX }} className="film-holes absolute inset-y-0 left-0 w-[300%] will-change-transform" />
            </div>
          </motion.div>
        </div>

        {/* Bottom Progress Bar */}
        <div className="max-w-6xl mx-auto w-full px-6 md:px-12 mt-5">
          <div className="w-full h-[2px] bg-charcoal/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-burgundy origin-left"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
        </div>

        <style>{`
          .film-holes {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='24'%3E%3Crect x='8' y='5' width='6' height='14' rx='2.5' fill='%23F5F0E8'/%3E%3C/svg%3E");
            background-size: 22px 100%;
            background-repeat: repeat-x;
            background-position: center;
          }
        `}</style>
      </div>
    </section>
  );
};
