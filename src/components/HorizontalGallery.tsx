import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GalleryItem } from '../types';
import { Calendar, User, Download } from 'lucide-react';

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

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-beige">
      {/* Sticky container that stays in viewport */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden py-12">
        
        {/* Gallery Title & Header */}
        <div className="max-w-6xl mx-auto w-full px-6 md:px-12 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
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
          <motion.div style={{ x }} className="flex gap-8 px-6 md:px-12 w-max">
            {gallery.map((item) => {
              return (
                <div
                  key={item.id}
                  className="relative w-[80vw] md:w-[65vw] lg:w-[50vw] h-[55vh] md:h-[60vh] rounded-3xl overflow-hidden shadow-2xl group border border-charcoal/5 flex-shrink-0 bg-charcoal"
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
          </motion.div>
        </div>

        {/* Bottom Progress Bar */}
        <div className="max-w-6xl mx-auto w-full px-6 md:px-12 mt-6">
          <div className="w-full h-[2px] bg-charcoal/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-burgundy origin-left"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
