import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Event } from '../types';
import { Calendar, MapPin, ChevronDown, ChevronUp, ArrowRight, Sparkles } from 'lucide-react';
import { EventModal } from './EventModal';

interface TimelineProps {
  events: Event[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Group events by year, most recent first
  const groupedEvents = events.reduce<Record<string, Event[]>>((acc, event) => {
    const year = event.date.match(/\d{4}/)?.[0] ?? 'Unknown';
    (acc[year] ??= []).push(event);
    return acc;
  }, {});

  const groupNames = Object.keys(groupedEvents).sort((a, b) => {
    if (a === 'Unknown') return 1;
    if (b === 'Unknown') return -1;
    return Number(b) - Number(a);
  });

  const [expandedGroup, setExpandedGroup] = useState<string | null>(groupNames[0] ?? null);

  const toggleGroup = (groupName: string) => {
    setExpandedGroup(expandedGroup === groupName ? null : groupName);
  };

  // Use the first event's cover as the group banner image
  const getGroupBannerImage = (groupName: string) => {
    return groupedEvents[groupName][0]?.coverImage ?? '/images/event1.jpg';
  };

  return (
    <section className="py-24 bg-beige relative overflow-hidden">
      {/* Background Subtle Elements */}
      <div className="absolute top-10 left-10 text-[12vw] font-playfair font-bold text-charcoal/[0.02] select-none pointer-events-none">
        CHRONICLES
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Editorial Header */}
        <div className="mb-16">
          <span className="text-burgundy font-mono uppercase tracking-widest text-xs block mb-3">
            Our Chronicles
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-charcoal leading-tight">
            Cinematic <span className="italic text-burgundy font-normal">Timeline</span>
          </h2>
          <div className="w-20 h-[1px] bg-burgundy/40 mt-6"></div>
        </div>

        {/* Wide Banners Accordion */}
        <div className="space-y-6">
          {groupNames.map(groupName => {
            const groupEvents = groupedEvents[groupName];
            const isExpanded = expandedGroup === groupName;
            const bannerImage = getGroupBannerImage(groupName);

            return (
              <div 
                key={groupName}
                className="border border-charcoal/5 rounded-3xl overflow-hidden bg-white/40 shadow-sm backdrop-blur-sm transition-all duration-300"
              >
                {/* WIDE BANNER (Clickable Header) */}
                <div
                  onClick={() => toggleGroup(groupName)}
                  className="relative h-44 md:h-52 w-full flex items-center justify-between px-6 md:px-12 cursor-pointer overflow-hidden group select-none"
                >
                  {/* Background Image with zoom on hover */}
                  <div className="absolute inset-0 bg-black overflow-hidden z-0">
                    <img
                      src={bannerImage}
                      alt={groupName}
                      className="w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    {/* Golden/Burgundy gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                  </div>

                  {/* Film Sprockets inside banner */}
                  <div className="absolute top-3 inset-x-0 h-1 flex justify-between px-4 opacity-15 select-none pointer-events-none">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="w-2 h-1 bg-white rounded-sm" />
                    ))}
                  </div>
                  <div className="absolute bottom-3 inset-x-0 h-1 flex justify-between px-4 opacity-15 select-none pointer-events-none">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="w-2 h-1 bg-white rounded-sm" />
                    ))}
                  </div>

                  {/* Banner content */}
                  <div className="relative z-10 text-white space-y-2">
                    <div className="flex items-center gap-2 text-gold font-mono text-[10px] uppercase tracking-[0.25em] font-bold">
                      <Sparkles size={12} />
                      <span>{groupEvents.length} Captured Chronicles</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-playfair font-bold tracking-wide">
                      {groupName}
                    </h3>
                  </div>

                  {/* Expand/Collapse Button */}
                  <div className="relative z-10 p-4 rounded-full bg-white/5 border border-white/10 text-gold group-hover:bg-burgundy group-hover:border-gold/30 transition-all duration-300">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* EXPANDED STACK OF EVENTS */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden bg-white/10 border-t border-charcoal/5"
                    >
                      <div className="p-6 md:p-8 space-y-6">
                        {groupEvents.map((event, idx) => (
                          <motion.div
                            key={event.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => setSelectedEvent(event)}
                            className="flex flex-col md:flex-row items-stretch gap-6 bg-white/60 hover:bg-white border border-charcoal/5 hover:border-gold/30 p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 group"
                          >
                            {/* Event image thumbnail */}
                            <div className="w-full md:w-48 aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-charcoal flex-shrink-0 relative">
                              <img
                                src={event.coverImage}
                                alt={event.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                              {/* Dark vignette */}
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                            </div>

                            {/* Event details */}
                            <div className="flex-1 flex flex-col justify-between py-1">
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-charcoal/60">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar size={12} className="text-burgundy" />
                                    <span>{event.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <MapPin size={12} className="text-burgundy" />
                                    <span className="truncate max-w-[150px]">{event.location}</span>
                                  </div>
                                </div>

                                <h4 className="text-xl md:text-2xl font-playfair font-bold text-charcoal group-hover:text-burgundy transition-colors duration-300">
                                  {event.title}
                                </h4>

                                <p className="text-xs md:text-sm text-charcoal/70 font-sans leading-relaxed line-clamp-2 max-w-2xl">
                                  {event.description}
                                </p>
                              </div>

                              {/* View Details Link */}
                              <div className="flex items-center gap-1.5 text-xs font-mono text-burgundy font-bold uppercase tracking-wider mt-4">
                                <span>Reveal Reel &amp; Gallery</span>
                                <ArrowRight size={12} className="group-hover:translate-x-1.5 transition-transform" />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Fullscreen Modal */}
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </section>
  );
};
