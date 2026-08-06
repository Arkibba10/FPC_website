import React from 'react';
import { Mail, MapPin, Instagram, Facebook, Linkedin, ChevronUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white pt-20 pb-10 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
      {/* Background Subtle Burgundy/Gold Glows on Left and Right */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-burgundy/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[350px] h-[350px] bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Film Grain Texture overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16">
          
          {/* Column 1: Brand Info (md:col-span-4) */}
          <div className="md:col-span-4 space-y-6">
            <div 
              onClick={handleScrollToTop} 
              className="flex items-center gap-4 cursor-pointer group w-max select-none"
            >
              {/* Club Logo */}
              <div className="group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(200,169,106,0.4)] transition-[transform,filter] duration-300">
                <img
                  src="/images/FPC_Logo.png"
                  alt="FPC CSE-UAP Logo"
                  className="h-14 w-auto object-contain"
                />
              </div>
              
              {/* Brand Typography */}
              <div className="flex flex-col">
                <span className="font-playfair font-bold text-lg leading-tight text-white">Film &amp;</span>
                <span className="font-playfair font-bold text-lg leading-tight text-white">Photography</span>
                <span className="font-playfair font-bold text-lg leading-tight text-white">Club</span>
                <span className="font-mono font-extrabold text-[11px] uppercase tracking-[0.25em] text-gold mt-1">
                  CSE-UAP
                </span>
              </div>
            </div>

            <p className="text-sm text-white/60 font-sans max-w-sm leading-relaxed">
              Capturing moments, creating memories, and fostering visual storytelling since 2017.
            </p>
          </div>

          {/* Column 2: Quick Links (md:col-span-2) */}
          <div className="md:col-span-2 space-y-5">
            <h4 className="text-sm font-sans font-bold text-white tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-3.5 text-sm font-sans text-white/50">
              <li>
                <button 
                  onClick={() => handleNavClick('timeline')}
                  className="hover:text-gold transition-colors cursor-pointer text-left"
                >
                  Events
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('gallery')}
                  className="hover:text-gold transition-colors cursor-pointer text-left"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('updates')}
                  className="hover:text-gold transition-colors cursor-pointer text-left"
                >
                  Registration
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('socials')}
                  className="hover:text-gold transition-colors cursor-pointer text-left"
                >
                  Join Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us (md:col-span-3) */}
          <div className="md:col-span-3 space-y-5">
            <h4 className="text-sm font-sans font-bold text-white tracking-wide">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm font-sans text-white/50">
              <li className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-burgundy/20 text-gold flex-shrink-0">
                  <Mail size={16} />
                </div>
                <a 
                  href="mailto:fpc@uap-bd.edu" 
                  className="hover:text-gold transition-colors"
                >
                  fpc@uap-bd.edu
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1.5 rounded bg-burgundy/20 text-gold mt-0.5 flex-shrink-0">
                  <MapPin size={16} />
                </div>
                <span className="leading-relaxed">UAP Campus, Dhaka</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Follow Us (md:col-span-3) */}
          <div className="md:col-span-3 space-y-5">
            <h4 className="text-sm font-sans font-bold text-white tracking-wide">
              Follow Us
            </h4>
            
            {/* Social Icons matching the image */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-burgundy hover:text-gold hover:border-gold/30 flex items-center justify-center transition-colors duration-300"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com/fpc.uap"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-burgundy hover:text-gold hover:border-gold/30 flex items-center justify-center transition-colors duration-300"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-burgundy hover:text-gold hover:border-gold/30 flex items-center justify-center transition-colors duration-300"
              >
                <Linkedin size={18} />
              </a>
            </div>

            <p className="text-xs text-white/50 leading-relaxed font-sans">
              Join our community of photographers and filmmakers!
            </p>
          </div>

        </div>

        {/* Divider Line */}
        <div className="w-full h-[1px] bg-white/10 mb-8"></div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-sans text-white/40">
          <div className="space-y-1.5 text-center md:text-left">
            <p>© 2026 Film &amp; Photography Club, CSE-UAP. All rights reserved.</p>
            <p>
              Design &amp; Development by{' '}
              <a
                href="https://www.tinyurl.com/arkibba10"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold font-bold hover:text-white transition-colors cursor-pointer"
              >
                Md Arkive
              </a>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-6 items-center justify-center">
            <span className="hover:text-gold transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gold transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>

      {/* Back to Top Floating Button */}
      <button
        onClick={handleScrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-burgundy hover:bg-burgundy-light text-white flex items-center justify-center shadow-[0_4px_20px_rgba(110,30,42,0.45)] hover:shadow-[0_4px_25px_rgba(110,30,42,0.6)] hover:scale-110 transition-[transform,background-color,box-shadow] duration-300 z-40 cursor-pointer group"
      >
        <ChevronUp size={22} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
      </button>
    </footer>
  );
};
