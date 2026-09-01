import React, { useState, useEffect } from 'react';
import { ArrowUp, Compass, Sparkles } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface FooterProps {
  onBackToTop: () => void;
  onNavigate?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onBackToTop, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [times, setTimes] = useState({
    kyoto: '',
    zurich: '',
    milan: '',
    newyork: '',
  });

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setTimes({
        kyoto: now.toLocaleTimeString('en-US', { timeZone: 'Asia/Tokyo', hour12: false, hour: '2-digit', minute: '2-digit' }),
        zurich: now.toLocaleTimeString('en-US', { timeZone: 'Europe/Zurich', hour12: false, hour: '2-digit', minute: '2-digit' }),
        milan: now.toLocaleTimeString('en-US', { timeZone: 'Europe/Rome', hour12: false, hour: '2-digit', minute: '2-digit' }),
        newyork: now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit' }),
      });
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setIsSubscribed(false);
    }, 4000);
  };

  const navLinks = [
    { label: 'ORIGINS', target: '#section-bean' },
    { label: 'ROASTS', target: '#section-roast' },
    { label: 'COLLECTION', target: '#section-collection' },
    { label: 'RITUAL', target: '#section-brew-ritual' },
    { label: 'INSTAGRAM', target: 'https://instagram.com' },
    { label: 'CONTACT', target: 'mailto:atelier@noirroast.com' },
  ];

  return (
    <footer className="relative bg-[#050403] pt-24 pb-14 text-[#f4eee6] overflow-hidden border-t border-[#261f18]">
      {/* Background Radiant Amber Glow Flares */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[850px] rounded-full bg-radial-at-c from-[#c89658]/25 via-[#8b5a2b]/10 to-transparent mix-blend-screen opacity-70" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-radial-at-c from-[#c89658]/15 to-transparent mix-blend-screen" />

      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        {/* Monumental Farewell Statement with Warm Golden Glow */}
        <div className="mb-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#120e0a] border border-[#c89658]/35 mb-4 shadow-[0_0_15px_rgba(200,150,88,0.2)]">
            <Sparkles className="h-3.5 w-3.5 text-[#c89658]" />
            <span className="text-[11px] font-sans tracking-[0.35em] uppercase text-[#e5b877] font-semibold">
              THE FINAL IMPRESSION
            </span>
          </div>

          <h2 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#f4eee6] font-light tracking-tight leading-[0.92]">
            SEE YOU <br />
            <span className="italic text-[#e5b877] font-display font-semibold drop-shadow-[0_0_35px_rgba(200,150,88,0.45)]">
              AT THE FIRST SIP.
            </span>
          </h2>
        </div>

        {/* Global Ateliers World Clocks Glass Island */}
        <div className="mb-16 rounded-3xl bg-[#090705]/95 border border-[#c89658]/30 p-7 grid grid-cols-2 md:grid-cols-4 gap-6 text-center backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          <div className="space-y-1">
            <span className="text-[10px] font-sans tracking-[0.25em] text-[#8c827a] uppercase block">
              Kyoto Atelier
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-[#f4eee6] drop-shadow-[0_0_10px_rgba(200,150,88,0.3)]">
              {times.kyoto || '18:42'} <span className="text-xs text-[#c89658]">JST</span>
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-sans tracking-[0.25em] text-[#8c827a] uppercase block">
              Zurich Roastery
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-[#f4eee6] drop-shadow-[0_0_10px_rgba(200,150,88,0.3)]">
              {times.zurich || '10:42'} <span className="text-xs text-[#c89658]">CET</span>
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-sans tracking-[0.25em] text-[#8c827a] uppercase block">
              Milan Tasting Room
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-[#f4eee6] drop-shadow-[0_0_10px_rgba(200,150,88,0.3)]">
              {times.milan || '10:42'} <span className="text-xs text-[#c89658]">CET</span>
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-sans tracking-[0.25em] text-[#8c827a] uppercase block">
              New York Vault
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-[#f4eee6] drop-shadow-[0_0_10px_rgba(200,150,88,0.3)]">
              {times.newyork || '04:42'} <span className="text-xs text-[#c89658]">EST</span>
            </span>
          </div>
        </div>

        {/* Middle Row: Brand Signature, VIP Dispatch, and Back-to-Top Button */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16 pb-16 border-b border-[#221c17]">
          {/* Brand Left with Radiant Golden Glow */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-display text-3xl sm:text-4xl tracking-[0.3em] font-bold text-[#f4eee6] uppercase drop-shadow-[0_0_25px_rgba(200,150,88,0.45)]">
              NOIR ROAST
            </h3>
            <p className="font-sans text-xs text-[#a89d93] font-light max-w-sm leading-relaxed">
              Fictional haute roastery est. 1998. Dedicated to micro-terroir transparency, slow convection alchemy, and unhurried sensory contemplation.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#120e0b] border border-[#c89658]/30 px-3.5 py-1 text-[10px] font-mono text-[#e5b877] tracking-widest uppercase">
              <Compass className="h-3.5 w-3.5 text-[#c89658] animate-spin-slow" />
              <span>Gesha Village • Bench Maji 2,400m ASL</span>
            </div>
          </div>

          {/* VIP Private Allocation Form */}
          <div className="lg:col-span-4">
            <span className="text-[10px] font-sans tracking-[0.25em] text-[#c89658] uppercase block mb-2 font-semibold">
              Private Release Dispatches
            </span>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-full bg-[#120e0b] border border-[#2b221a] px-5 py-3 text-xs text-[#f4eee6] placeholder-[#665a50] focus:border-[#c89658] focus:shadow-[0_0_15px_rgba(200,150,88,0.25)] focus:outline-none font-sans"
                />
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-[#c89658] to-[#e5b877] px-6 py-3 text-xs font-sans font-bold tracking-widest text-[#070605] uppercase hover:shadow-[0_0_20px_rgba(200,150,88,0.5)] transition-all shrink-0 cursor-pointer"
                >
                  Join
                </button>
              </div>
              {isSubscribed && (
                <span className="text-[10px] font-mono text-[#e5b877] block">
                  ✓ Priority invitation dispatched to your inbox.
                </span>
              )}
            </form>
          </div>

          {/* Circular Magnetic Back-To-Top Button */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <MagneticButton strength={0.4}>
              <button
                onClick={onBackToTop}
                aria-label="Back to Top of Page"
                className="group relative flex h-24 w-24 flex-col items-center justify-center rounded-full border border-[#c89658]/40 bg-[#0f0c09] transition-all duration-500 hover:border-[#c89658] hover:shadow-[0_0_35px_rgba(200,150,88,0.45)] cursor-pointer"
              >
                <ArrowUp className="h-5 w-5 text-[#c89658] transition-transform duration-300 group-hover:-translate-y-1.5" />
                <span className="text-[8px] font-sans tracking-[0.25em] text-[#8c827a] uppercase mt-1 transition-colors group-hover:text-[#f4eee6]">
                  BACK TO TOP
                </span>
              </button>
            </MagneticButton>
          </div>
        </div>

        {/* Bottom Glowing Nav Headers & Rights */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-xs text-[#8c827a]">
          {/* Glowing Header Links (ORIGINS, ROASTS, COLLECTION, RITUAL, etc.) */}
          <div className="flex flex-wrap gap-4 sm:gap-7 justify-center md:justify-start">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.target.startsWith('#') ? undefined : link.target}
                onClick={
                  link.target.startsWith('#') && onNavigate
                    ? (e) => {
                        e.preventDefault();
                        onNavigate(link.target);
                      }
                    : undefined
                }
                className="group relative font-sans text-xs sm:text-[13px] tracking-[0.25em] uppercase font-bold text-[#e5b877] drop-shadow-[0_0_10px_rgba(200,150,88,0.45)] hover:text-[#f4eee6] hover:drop-shadow-[0_0_20px_rgba(200,150,88,0.9)] transition-all duration-300 cursor-pointer py-1"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-[#c89658] to-[#e5b877] transition-all duration-300 group-hover:w-full shadow-[0_0_8px_#c89658]" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[10px] font-mono tracking-wider text-[#8c827a]">
            <span>© 1998–2026 NOIR ROAST MAISON</span>
            <span>•</span>
            <span className="text-[#c89658] drop-shadow-[0_0_8px_rgba(200,150,88,0.4)]">ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
