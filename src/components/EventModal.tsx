import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Download, Image as ImageIcon } from 'lucide-react';
import { Event } from '../types';

interface EventModalProps {
  event: Event | null;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'gallery' | 'video'>('details');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!event) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-40"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="relative bg-charcoal-dark border border-white/10 rounded-3xl w-full max-w-4xl h-[90vh] md:h-[80vh] flex flex-col md:flex-row overflow-hidden z-50 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 border border-white/10 text-white hover:bg-burgundy hover:text-gold hover:scale-110 transition-all duration-300 z-50 cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Left Column: Cover Image */}
          <div className="relative w-full md:w-1/2 h-[35%] md:h-full overflow-hidden bg-black flex-shrink-0">
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-charcoal-dark via-transparent to-transparent md:from-transparent md:via-transparent md:to-charcoal-dark" />
            
            {/* Download Cover Button */}
            <div className="absolute top-4 left-4 z-20">
              <a
                href={event.coverImage}
                download={`${event.title.replace(/\s+/g, '_')}_cover.jpg`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-black/60 hover:bg-burgundy text-white hover:text-gold border border-white/10 hover:border-gold/30 flex items-center justify-center transition-all shadow-lg hover:scale-110 cursor-pointer"
                title="Download Cover Image"
              >
                <Download size={14} />
              </a>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white md:hidden">
              <span className="text-gold font-mono text-[10px] uppercase tracking-widest bg-burgundy/80 px-2.5 py-0.5 rounded-full border border-gold/30">
                Past Event
              </span>
              <h2 className="text-2xl font-playfair font-bold mt-2 text-white drop-shadow-md">
                {event.title}
              </h2>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex-1 flex flex-col h-[65%] md:h-full p-6 md:p-8 overflow-y-auto bg-charcoal-dark">
            {/* Desktop Header */}
            <div className="hidden md:block mb-6">
              <span className="text-gold font-mono text-[10px] uppercase tracking-widest bg-burgundy/60 px-3 py-1 rounded-full border border-gold/20">
                Past Event Showcase
              </span>
              <h2 className="text-3xl lg:text-4xl font-playfair font-bold mt-4 text-white">
                {event.title}
              </h2>
            </div>

            {/* Quick Metadata */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-xs font-mono text-white/60 bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gold" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gold" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-white/10 mb-6 gap-6 text-sm">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 font-mono uppercase tracking-wider relative transition-colors duration-300 ${
                  activeTab === 'details' ? 'text-gold' : 'text-white/40 hover:text-white'
                }`}
              >
                Details
                {activeTab === 'details' && (
                  <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
                )}
              </button>
              
              {event.images && event.images.length > 0 && (
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`pb-3 font-mono uppercase tracking-wider relative transition-colors duration-300 ${
                    activeTab === 'gallery' ? 'text-gold' : 'text-white/40 hover:text-white'
                  }`}
                >
                  Gallery ({event.images.length})
                  {activeTab === 'gallery' && (
                    <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
                  )}
                </button>
              )}

              {event.videoUrl && (
                <button
                  onClick={() => setActiveTab('video')}
                  className={`pb-3 font-mono uppercase tracking-wider relative transition-colors duration-300 ${
                    activeTab === 'video' ? 'text-gold' : 'text-white/40 hover:text-white'
                  }`}
                >
                  Cinematic Reel
                  {activeTab === 'video' && (
                    <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
                  )}
                </button>
              )}
            </div>

            {/* Tab Contents */}
            <div className="flex-1">
              {/* Details Tab */}
              {activeTab === 'details' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 text-white/80 text-sm leading-relaxed"
                >
                  <p className="text-gold/90 italic font-playfair text-lg leading-relaxed mb-4">
                    "{event.description}"
                  </p>
                  <div className="w-12 h-[1px] bg-gold/40 my-4"></div>
                  <p>{event.details}</p>
                </motion.div>
              )}

              {/* Gallery Tab */}
              {activeTab === 'gallery' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {event.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-xl overflow-hidden border border-white/5 cursor-zoom-in group bg-black"
                    >
                      <img
                        src={img}
                        alt={`${event.title} gallery ${idx}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onClick={() => setSelectedImage(img)}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                      
                      {/* Download Individual Image Button */}
                      <div className="absolute bottom-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <a
                          href={img}
                          download={`${event.title.replace(/\s+/g, '_')}_gallery_${idx}.jpg`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-black/70 border border-white/10 text-white hover:text-gold hover:bg-burgundy transition-all"
                          title="Download Photo"
                        >
                          <Download size={12} />
                        </a>
                        <div className="p-1.5 rounded-lg bg-black/50 border border-white/10 text-white/80">
                          <ImageIcon size={12} />
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Video Tab */}
              {activeTab === 'video' && event.videoUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black relative flex items-center justify-center"
                >
                  <video
                    src={event.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                  />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Image Zoom with Download Option */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/98">
          {/* Top Bar Actions */}
          <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
            <a
              href={selectedImage}
              download="FPC_HighRes_Capture.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-burgundy hover:text-gold transition-colors cursor-pointer flex items-center justify-center shadow-lg"
              title="Download High-Res Image"
            >
              <Download size={20} />
            </a>
            <button
              onClick={() => setSelectedImage(null)}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-burgundy hover:text-gold transition-colors cursor-pointer flex items-center justify-center shadow-lg"
              title="Close Zoom"
            >
              <X size={20} />
            </button>
          </div>
          <img
            src={selectedImage}
            alt="Zoomed"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </AnimatePresence>
  );
};
