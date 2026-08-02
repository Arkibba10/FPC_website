import React, { useState } from 'react';
import { useClub } from '../context/useClub';
import { Instagram, Youtube, ArrowRight, Heart, MessageCircle, Send } from 'lucide-react';

export const SocialHub: React.FC = () => {
  const { settings } = useClub();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  // Mock Instagram feed images
  const mockInstaPics = [
    { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300', likes: 142, comments: 12 },
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', likes: 98, comments: 8 },
    { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300', likes: 215, comments: 24 },
    { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300', likes: 167, comments: 15 },
  ];

  return (
    <section className="py-24 bg-beige text-charcoal relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-burgundy/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Editorial Header */}
        <div className="mb-16 text-center md:text-left">
          <span className="text-burgundy font-mono uppercase tracking-widest text-xs block mb-3">
            Digital Darkroom
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-charcoal leading-tight">
            Connect <span className="italic text-burgundy font-normal">With Us</span>
          </h2>
          <div className="w-20 h-[1px] bg-burgundy/40 mt-6 mx-auto md:mx-0"></div>
        </div>

        {/* Social Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Box 1: Mock Instagram Feed (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white/50 border border-charcoal/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm backdrop-blur-sm">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-burgundy text-gold">
                    <Instagram size={20} />
                  </div>
                  <div>
                    <h3 className="font-playfair font-bold text-lg text-charcoal">@uap.cse.fpc</h3>
                    <p className="text-[10px] font-mono text-charcoal/50 uppercase tracking-wider">Instagram Portfolio</p>
                  </div>
                </div>
                <a
                  href={settings?.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full border border-burgundy/20 hover:bg-burgundy hover:text-gold hover:border-burgundy text-xs font-mono uppercase tracking-wider font-bold transition-all"
                >
                  Follow
                </a>
              </div>

              {/* Grid of photos */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
                {mockInstaPics.map((pic, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group bg-black">
                    <img src={pic.url} alt="Insta" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-xs font-mono">
                      <div className="flex items-center gap-1">
                        <Heart size={12} className="fill-gold text-gold" />
                        <span>{pic.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={12} className="text-white" />
                        <span>{pic.comments}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-charcoal/60 leading-relaxed font-sans mt-2">
              ✦ We update our grid weekly with curated visual narratives, photowalk captures, and student features. Tag us to get featured!
            </p>
          </div>

          {/* Box 2: Mock Youtube & Newsletter (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Mock YouTube Reel Card */}
            <a
              href={settings?.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/50 border border-charcoal/5 rounded-3xl p-6 flex items-center gap-5 shadow-sm hover:border-gold/50 hover:shadow-md transition-all group backdrop-blur-sm"
            >
              <div className="p-4 rounded-2xl bg-burgundy/10 text-burgundy group-hover:bg-burgundy group-hover:text-gold transition-all duration-300">
                <Youtube size={24} />
              </div>
              <div>
                <h3 className="font-playfair font-bold text-lg text-charcoal flex items-center gap-1.5 group-hover:text-burgundy transition-colors">
                  Cinematic Channel
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-charcoal/60 leading-relaxed mt-1 font-sans">
                  Watch short films, behind-the-scenes diaries, and cinematography tutorials by our student crews.
                </p>
              </div>
            </a>

            {/* Newsletter Signup (Darkroom Bulletins) */}
            <div className="bg-charcoal text-white rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
              {/* Film grain inside */}
              <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>

              <div>
                <span className="text-gold font-mono text-[9px] uppercase tracking-widest block mb-1">
                  DARKROOM JOURNAL
                </span>
                <h3 className="font-playfair font-bold text-xl text-white mb-2">
                  Subscribe to <span className="italic text-gold font-normal">Bulletins</span>
                </h3>
                <p className="text-xs text-white/50 leading-relaxed font-sans mb-6">
                  Get monthly exhibition digests, photography tips, and early access to workshops right in your inbox.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs text-white focus:outline-none focus:border-gold/50 font-sans"
                />
                <button
                  type="submit"
                  className="absolute right-2 p-2 rounded-lg bg-burgundy text-gold border border-gold/20 hover:bg-burgundy-light hover:scale-105 transition-all cursor-pointer"
                >
                  {subscribed ? <Check size={14} className="text-gold" /> : <Send size={14} />}
                </button>
              </form>

              {subscribed && (
                <p className="text-[10px] font-mono text-gold mt-3 animate-pulse">
                  ✓ Welcome to the Darkroom community! Check your inbox soon.
                </p>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

// Simple inline check icon helper if not imported
const Check = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
