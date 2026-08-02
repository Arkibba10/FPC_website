import React from 'react';
import { Alumni } from '../types';
import { Briefcase, GraduationCap } from 'lucide-react';

export const AlumniCarousels: React.FC<{ alumni: Alumni[] }> = ({ alumni }) => {
  // Duplicate the array to ensure seamless infinite looping
  const duplicatedAlumni = [...alumni, ...alumni, ...alumni];

  return (
    <section className="py-24 bg-charcoal overflow-hidden relative">
      {/* Background Cinematic Lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-burgundy/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Editorial Header */}
      <div className="max-w-6xl mx-auto w-full px-6 md:px-12 mb-16 relative z-10">
        <span className="text-gold font-mono uppercase tracking-widest text-xs block mb-3">
          Our Legacy
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white leading-tight">
          Alumni <span className="italic text-gold font-normal">Showcase</span>
        </h2>
        <div className="w-20 h-[1px] bg-gold/40 mt-6"></div>
      </div>

      {/* Carousels Container */}
      <div className="flex flex-col gap-10 relative z-10">
        
        {/* ROW 1: Scrolling Left */}
        <div className="w-full overflow-hidden py-4 group">
          <div 
            className="flex gap-6 w-max animate-scroll-left hover:[animation-play-state:paused]"
            style={{
              animation: 'scrollLeft 38s linear infinite'
            }}
          >
            {duplicatedAlumni.map((item, idx) => (
              <div
                key={`alumni-l-${item.id}-${idx}`}
                className="w-[200px] md:w-[240px] aspect-[10/16] bg-charcoal-dark border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:border-gold/30 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1.5 group"
              >
                {/* Photo taking most of the space (82%!) */}
                <div className="relative h-[82%] w-full overflow-hidden bg-black">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  
                  {/* Graduation Batch Badge */}
                  <div className="absolute top-4 left-4 bg-burgundy/80 text-gold border border-gold/30 text-[8px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <GraduationCap size={10} />
                    <span>{item.batch}</span>
                  </div>
                </div>

                {/* Info at the bottom (18%) */}
                <div className="h-[18%] p-3 flex flex-col justify-center bg-charcoal-dark/95 border-t border-white/5">
                  <h3 className="font-playfair text-xs md:text-sm font-bold text-white group-hover:text-gold transition-colors duration-300 truncate">
                    {item.name}
                  </h3>
                  
                  <div className="flex items-start gap-1 text-[9px] text-white/50 font-sans truncate mt-0.5">
                    <Briefcase size={10} className="text-gold mt-0.5 flex-shrink-0" />
                    <div className="truncate leading-tight">
                      <span className="font-semibold text-white/80 truncate block">{item.currentPosition}</span>
                      <span className="text-white/30 truncate block">{item.organization}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2: Scrolling Right */}
        <div className="w-full overflow-hidden py-4 group">
          <div 
            className="flex gap-6 w-max animate-scroll-right hover:[animation-play-state:paused]"
            style={{
              animation: 'scrollRight 38s linear infinite'
            }}
          >
            {duplicatedAlumni.map((item, idx) => (
              <div
                key={`alumni-r-${item.id}-${idx}`}
                className="w-[200px] md:w-[240px] aspect-[10/16] bg-charcoal-dark border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:border-gold/30 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1.5 group"
              >
                {/* Photo taking most of the space (82%!) */}
                <div className="relative h-[82%] w-full overflow-hidden bg-black">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  
                  {/* Graduation Batch Badge */}
                  <div className="absolute top-4 left-4 bg-burgundy/80 text-gold border border-gold/30 text-[8px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <GraduationCap size={10} />
                    <span>{item.batch}</span>
                  </div>
                </div>

                {/* Info at the bottom (18%) */}
                <div className="h-[18%] p-3 flex flex-col justify-center bg-charcoal-dark/95 border-t border-white/5">
                  <h3 className="font-playfair text-xs md:text-sm font-bold text-white group-hover:text-gold transition-colors duration-300 truncate">
                    {item.name}
                  </h3>
                  
                  <div className="flex items-start gap-1 text-[9px] text-white/50 font-sans truncate mt-0.5">
                    <Briefcase size={10} className="text-gold mt-0.5 flex-shrink-0" />
                    <div className="truncate leading-tight">
                      <span className="font-semibold text-white/80 truncate block">{item.currentPosition}</span>
                      <span className="text-white/30 truncate block">{item.organization}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CSS Keyframes injected directly */}
      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};
