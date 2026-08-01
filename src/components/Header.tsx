import React, { useRef, useState } from 'react';
import { useClub } from '../context/useClub';
import { Menu, X, Shield } from 'lucide-react';

interface HeaderProps {
  onAdminClick: () => void;
  isAdminView: boolean;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAdminClick, isAdminView, onHomeClick }) => {
  const { user } = useClub();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const clickTimesRef = useRef<number[]>([]);

  // Hidden gesture: 5 rapid clicks on the logo opens the admin panel.
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const now = Date.now();
    clickTimesRef.current = clickTimesRef.current.filter((t) => now - t < 1500);
    clickTimesRef.current.push(now);
    if (clickTimesRef.current.length >= 5) {
      clickTimesRef.current = [];
      onAdminClick();
      return;
    }
    onHomeClick();
  };

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (isAdminView) {
      onHomeClick();
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-charcoal-dark/90 backdrop-blur-md border-b border-white/5 py-4 shadow-lg transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-3 cursor-pointer group select-none"
          title="FPC CSE-UAP"
        >
          <div className="p-1 rounded-xl bg-white/5 border border-white/10 shadow-lg">
            <img
              src="/images/FPC_Logo.png"
              alt="FPC CSE-UAP Logo"
              className="h-9 md:h-10 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="font-playfair font-bold text-white text-base md:text-lg leading-tight group-hover:text-gold transition-colors">
              FPC <span className="italic text-gold font-normal">CSE-UAP</span>
            </h1>
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">
              Film & Photography Club
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        {!isAdminView && (
          <nav className="hidden lg:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-white/70">
            <button onClick={() => handleNavClick('manifesto')} className="hover:text-gold transition-colors cursor-pointer">Manifesto</button>
            <button onClick={() => handleNavClick('timeline')} className="hover:text-gold transition-colors cursor-pointer">Timeline</button>
            <button onClick={() => handleNavClick('members')} className="hover:text-gold transition-colors cursor-pointer">Executives</button>
            <button onClick={() => handleNavClick('convener')} className="hover:text-gold transition-colors cursor-pointer">Convener</button>
            <button onClick={() => handleNavClick('gallery')} className="hover:text-gold transition-colors cursor-pointer">Gallery</button>
            <button onClick={() => handleNavClick('alumni')} className="hover:text-gold transition-colors cursor-pointer">Alumni</button>
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isAdminView && user && (
            <div className="hidden md:flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[10px] font-mono text-gold">
              <Shield size={10} />
              <span className="uppercase">{user.role}</span>
            </div>
          )}

          {/* Mobile Menu Button */}
          {!isAdminView && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white/70 hover:text-white"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && !isAdminView && (
        <div className="fixed inset-x-0 top-[73px] bg-charcoal-dark border-b border-white/10 p-6 flex flex-col gap-5 text-sm font-mono uppercase tracking-wider text-white/80 z-30 lg:hidden animate-fade-in">
          <button onClick={() => handleNavClick('manifesto')} className="text-left hover:text-gold py-1">Manifesto</button>
          <button onClick={() => handleNavClick('timeline')} className="text-left hover:text-gold py-1">Timeline</button>
          <button onClick={() => handleNavClick('members')} className="text-left hover:text-gold py-1">Executives</button>
          <button onClick={() => handleNavClick('convener')} className="text-left hover:text-gold py-1">Convener</button>
          <button onClick={() => handleNavClick('gallery')} className="text-left hover:text-gold py-1">Gallery</button>
          <button onClick={() => handleNavClick('alumni')} className="text-left hover:text-gold py-1">Alumni</button>
        </div>
      )}
    </header>
  );
};
