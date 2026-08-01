import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ClubProvider } from './context/ClubContext';
import { useClub } from './context/useClub';
import { FilmGrain } from './components/FilmGrain';
import FloatingDust from './components/FloatingDust';
import { FilmstripLoader } from './components/FilmstripLoader';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MottoSection } from './components/MottoSection';
import { Timeline } from './components/Timeline';
import { SpotlightMembers } from './components/SpotlightMembers';
import { ConvenerShowcase } from './components/ConvenerShowcase';
import { HorizontalGallery } from './components/HorizontalGallery';
import { AlumniCarousels } from './components/AlumniCarousels';
import { UpdatesFeed } from './components/UpdatesFeed';
import { SocialHub } from './components/SocialHub';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';

// Animated Elements
import { Polaroid } from './components/animated/Polaroid';
import { Clapperboard } from './components/animated/Clapperboard';

const EASE = [0.16, 1, 0.3, 1] as const;

const AppContent: React.FC = () => {
  const { members, events, gallery, alumni } = useClub();
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoaderFinished, setIsLoaderFinished] = useState(false);

  return (
    <div className="relative min-h-screen bg-charcoal text-white selection:bg-gold selection:text-charcoal selection:font-bold">
      {/* Horizontal Filmstrip Loading Animation */}
      <FilmstripLoader onComplete={() => setIsLoaderFinished(true)} />

      {/* Render the actual site only when the loading animation is complete (or if we are in Admin View) */}
      {(isLoaderFinished || isAdminView) && (
        <div className="animate-fade-in">
          {/* Cinematic Film Grain Overlay */}
          <FilmGrain />

          {/* Site-wide ambient dust floating up & dissolving */}
          <FloatingDust />

          {/* Editorial Navigation Header */}
          <Header
            isAdminView={isAdminView}
            onAdminClick={() => setIsAdminView(!isAdminView)}
            onHomeClick={() => setIsAdminView(false)}
          />

          {/* Main View Router */}
          <AnimatePresence mode="wait">
            {isAdminView ? (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="pt-20"
              >
                <AdminDashboard />
              </motion.div>
            ) : (
              <motion.div
                key="main"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {/* Section 1: Hero — cinematic "looking through a camera" landing */}
                <div id="hero" className="relative">
                  <HeroSection />
                </div>

              {/* Section 2: Fullscreen Motto Manifesto */}
              <div id="manifesto">
                <MottoSection />
              </div>

              {/* Section 3: Cinematic Movie-Poster Timeline */}
              <div id="timeline" className="relative bg-beige">
                <Timeline events={events} />
                
                {/* Clapperboard floating decorative element */}
                <div className="absolute right-12 top-24 z-20 hidden md:block">
                  <Clapperboard size={70} />
                </div>
              </div>

              {/* Section 4: Live Bulletins, Celebrations, & Highlights */}
              <div id="updates">
                <UpdatesFeed />
              </div>

              {/* Section 5: Members Spotlight Reveal */}
              <div id="members" className="relative bg-beige">
                <SpotlightMembers members={members} />
              </div>

              {/* Section 6: Prestigious Convener Showcase */}
              <div id="convener" className="relative">
                <ConvenerShowcase />

                {/* Floating Polaroid of a vintage camera near convener */}
                <div className="absolute right-12 bottom-12 z-20 hidden lg:block">
                  <Polaroid
                    image="https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=300"
                    caption="Analog Soul // FPC"
                    rotate={-5}
                    width={140}
                  />
                </div>
              </div>

              {/* Section 7: Pinned Horizontal Gallery */}
              <div id="gallery">
                <HorizontalGallery gallery={gallery} />
              </div>

              {/* Section 8: Infinite Alumni Carousels */}
              <div id="alumni">
                <AlumniCarousels alumni={alumni} />
              </div>

              {/* Section 9: Connect & Social Hub */}
              <div id="socials">
                <SocialHub />
              </div>

              {/* Section 10: Premium Footer */}
              <Footer />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* CSS Fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <ClubProvider>
      <AppContent />
    </ClubProvider>
  );
}

export default App;
