import React, { useState, useEffect } from 'react';
import { ArrowUp, Compass, Sparkles, Shield, Award, CheckCircle2, Coffee, Flame, Mail, Droplets } from 'lucide-react';
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

  const atelierClocks = [
    { city: 'Kyoto Atelier', code: 'JST', time: times.kyoto || '18:42', status: 'Slow Drum Roasting' },
    { city: 'Zurich Roastery', code: 'CET', time: times.zurich || '10:42', status: 'Cupping Lab Active' },
    { city: 'Milan Tasting Room', code: 'CET', time: times.milan || '10:42', status: '9.0 Bar Extraction' },
    { city: 'New York Vault', code: 'EST', time: times.newyork || '04:42', status: 'Cellar Allocations' },
  ];

  const archiveEditions = [
    { label: 'Obsidian Gesha 2,400M', target: '#section-reserve' },
    { label: 'Cask Bourbon Reserve', target: '#section-reserve' },
    { label: 'Midnight Volcano', target: '#section-reserve' },
    { label: 'Kyoto Atelier Roast', target: '#section-reserve' },
  ];

  const ritualLinks = [
    { label: '9.0 Bar Velvet Espresso', target: '#section-brew-ritual' },
    { label: 'V60 Conical Extraction', target: '#section-brew-ritual' },
    { label: 'Chemex Clarification', target: '#section-brew-ritual' },
    { label: 'French Press Emulsion', target: '#section-brew-ritual' },
  ];

  const sensoryNotes = [
    { name: 'Jasmine Blossom', note: 'Ethiopia Gesha' },
    { name: 'Smoked Bergamot', note: 'Acoustic Crack' },
    { name: 'Obsidian Cacao', note: 'Volcanic Ash' },
    { name: 'Charred Bourbon Cask', note: 'Oak Aged' },
    { name: 'Wild Honeycomb', note: 'Anaerobic Slow' },
  ];

  const atelierCertifications = [
    { icon: <Flame className="h-3.5 w-3.5 text-[#c89658]" />, title: '100% Cast-Iron Convection', desc: 'Acoustic roasting' },
    { icon: <Droplets className="h-3.5 w-3.5 text-[#e5b877]" />, title: 'Micro-Terroir Lot 2,400M', desc: 'Single volcanic ridge' },
    { icon: <Shield className="h-3.5 w-3.5 text-[#c89658]" />, title: '+350% Direct Ethical Premium', desc: 'Fair trade minimums' },
    { icon: <Coffee className="h-3.5 w-3.5 text-[#e5b877]" />, title: 'Q-Grader Certified 94+ PTS', desc: 'Laboratory cupped' },
  ];

  return (
    <footer className="relative bg-[#040302] pt-24 pb-12 text-[#f4eee6] overflow-hidden border-t border-[#221c17]">
      {/* Background Ambient Amber Radiance & Watermark */}
      <div className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 h-[500px] w-[1000px] rounded-full bg-radial-at-c from-[#c89658]/20 via-[#8b5a2b]/8 to-transparent mix-blend-screen opacity-80" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-radial-at-c from-[#c89658]/10 to-transparent mix-blend-screen" />

      {/* Background Typography Watermark - Perfectly Sized & Centered Without Clipping */}
      <div className="pointer-events-none absolute bottom-28 left-0 right-0 w-full text-center select-none overflow-hidden opacity-[0.035]">
        <span className="inline-block font-display text-[7.5vw] font-black uppercase tracking-[0.08em] text-[#e5b877] max-w-full">
          NOIR ROAST
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        {/* ================= 1. Monumental Editorial Farewell Header ================= */}
        <div className="mb-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#120e0a]/90 border border-[#c89658]/40 mb-5 shadow-[0_0_20px_rgba(200,150,88,0.2)] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#c89658]" />
            <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.35em] uppercase text-[#e5b877] font-semibold">
              THE FINAL IMPRESSION • HAUTE TORRÉFACTION
            </span>
          </div>

          <h2 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#f4eee6] font-light tracking-tight leading-[0.92] max-w-5xl">
            SEE YOU <br />
            <span className="italic text-[#e5b877] font-display font-semibold drop-shadow-[0_0_40px_rgba(200,150,88,0.5)]">
              AT THE FIRST SIP.
            </span>
          </h2>
        </div>

        {/* ================= 2. Haute Horlogerie Global Timepieces (4 Dials) ================= */}
        <div className="mb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {atelierClocks.map((clock) => (
            <div
              key={clock.city}
              className="rounded-3xl bg-[#0c0907]/90 border border-[#c89658]/25 p-5 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex flex-col justify-between transition-all duration-300 hover:border-[#c89658]/60 hover:shadow-[0_15px_40px_rgba(200,150,88,0.15)] group"
            >
              <div className="flex items-center justify-between mb-3 border-b border-[#211a14] pb-2.5">
                <span className="text-[10px] font-sans tracking-[0.22em] text-[#a89d93] uppercase font-semibold">
                  {clock.city}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold text-[#c89658] bg-[#1c150e] px-2 py-0.5 rounded-full border border-[#382a1d]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c89658] animate-pulse" />
                  {clock.code}
                </span>
              </div>

              <div className="my-1">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-[#f4eee6] tracking-tight group-hover:text-[#e5b877] transition-colors drop-shadow-[0_0_12px_rgba(200,150,88,0.25)]">
                  {clock.time}
                </span>
              </div>

              <div className="mt-2 text-[10px] font-sans text-[#786e64] flex items-center gap-1.5">
                <span>{clock.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ================= 3. Sensory Cupping & Terroir Telemetry Strip ================= */}
        <div className="mb-16 rounded-3xl bg-[#0d0a08]/85 border border-[#2b2118] p-5 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="h-2 w-2 rounded-full bg-[#c89658] animate-ping" />
              <span className="text-[10px] font-mono font-bold text-[#c89658] tracking-widest uppercase">
                TASTING NOTES MATRIX
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {sensoryNotes.map((item) => (
                <div
                  key={item.name}
                  className="rounded-full bg-[#140f0c] border border-[#33251a] px-3.5 py-1 text-xs text-[#cfc5ba] flex items-center gap-2 transition-all hover:border-[#c89658] hover:text-[#e5b877]"
                >
                  <span className="font-serif italic">{item.name}</span>
                  <span className="text-[9px] font-mono text-[#8c827a] uppercase">• {item.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= 4. Four-Column Luxury Architecture & VIP Dispatches ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16 pb-16 border-b border-[#221c17]">
          {/* Col 1: Maison Noir Brand & Origin Seal (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-display text-2xl sm:text-3xl tracking-[0.28em] font-bold text-[#f4eee6] uppercase drop-shadow-[0_0_25px_rgba(200,150,88,0.4)]">
              NOIR ROAST
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#a89d93] font-light max-w-sm leading-relaxed">
              Haute roastery maison est. 1998. Dedicated to extreme single-ridge terroir transparency, slow cast-iron convection, and unhurried sensory contemplation.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#120e0b] border border-[#c89658]/35 px-4 py-1.5 text-[10px] font-mono text-[#e5b877] tracking-widest uppercase shadow-md">
              <Compass className="h-3.5 w-3.5 text-[#c89658] animate-spin-slow" />
              <span>Volcanic Gesha Village • 2,400m ASL</span>
            </div>
          </div>

          {/* Col 2: The Archive Editions (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[10px] font-sans tracking-[0.25em] text-[#c89658] uppercase block font-bold mb-2">
              The Vault Batches
            </span>
            <ul className="space-y-2 text-xs font-sans text-[#cfc5ba]">
              {archiveEditions.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.target}
                    onClick={
                      onNavigate
                        ? (e) => {
                            e.preventDefault();
                            onNavigate(item.target);
                          }
                        : undefined
                    }
                    className="hover:text-[#e5b877] transition-colors flex items-center gap-1.5 group cursor-pointer"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#c89658]/50 group-hover:bg-[#c89658] transition-colors" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: The Ritual Atelier (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[10px] font-sans tracking-[0.25em] text-[#c89658] uppercase block font-bold mb-2">
              Brewing Ritual
            </span>
            <ul className="space-y-2 text-xs font-sans text-[#cfc5ba]">
              {ritualLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.target}
                    onClick={
                      onNavigate
                        ? (e) => {
                            e.preventDefault();
                            onNavigate(item.target);
                          }
                        : undefined
                    }
                    className="hover:text-[#e5b877] transition-colors flex items-center gap-1.5 group cursor-pointer"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#c89658]/50 group-hover:bg-[#c89658] transition-colors" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: VIP Private Dispatches (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-[#c89658]" />
              <span className="text-[10px] font-sans tracking-[0.25em] text-[#c89658] uppercase font-bold">
                Private Vault Dispatches
              </span>
            </div>
            <p className="font-sans text-xs text-[#a89d93] leading-relaxed">
              Receive strictly private allocations of numbered 12kg micro-batches before public cellar release.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter private email"
                  className="w-full rounded-full bg-[#120e0b] border border-[#33281e] px-5 py-3 pr-28 text-xs text-[#f4eee6] placeholder-[#665a50] focus:border-[#c89658] focus:shadow-[0_0_20px_rgba(200,150,88,0.3)] focus:outline-none font-sans"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 rounded-full bg-gradient-to-r from-[#c89658] to-[#e5b877] px-5 py-2 text-xs font-sans font-bold tracking-wider text-[#070605] uppercase hover:shadow-[0_0_20px_rgba(200,150,88,0.5)] transition-all cursor-pointer"
                >
                  Join
                </button>
              </div>
              {isSubscribed && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#e5b877] pt-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Priority allocation invitation dispatched to your inbox.</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* ================= 5. Masterpiece Bottom Bar: Atelier Certifications & Seal ================= */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-4">
          {/* Left: Founder Wax Seal Emblem */}
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-full border border-[#c89658]/60 bg-[#120e0a] flex items-center justify-center shadow-[0_0_15px_rgba(200,150,88,0.25)]">
              <Award className="h-5 w-5 text-[#c89658]" />
            </div>
            <div>
              <span className="font-serif italic text-sm text-[#f4eee6] block leading-tight">
                Maison Noir Atelier
              </span>
              <span className="font-mono text-[9px] text-[#8c827a] tracking-widest uppercase">
                35.0116° N, 135.7681° E • KYOTO & ZURICH
              </span>
            </div>
          </div>

          {/* Center: Atelier Craftsmanship & Sourcing Badges (Replacing repetitive nav) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl">
            {atelierCertifications.map((cert) => (
              <div
                key={cert.title}
                className="rounded-2xl bg-[#0e0b08] border border-[#261e16] p-2.5 flex flex-col justify-between hover:border-[#c89658]/50 transition-colors"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {cert.icon}
                  <span className="font-mono text-[10px] font-bold text-[#f4eee6] truncate">{cert.title}</span>
                </div>
                <span className="text-[8px] font-sans text-[#8c827a] uppercase tracking-wider">{cert.desc}</span>
              </div>
            ))}
          </div>

          {/* Right: Sommelier Direct & Magnetic Back To Summit Button */}
          <div className="flex items-center gap-4">
            <a
              href="mailto:concierge@noirroast.com"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#120e0b] border border-[#c89658]/35 px-4 py-2 text-[10px] font-sans tracking-widest uppercase text-[#e5b877] hover:bg-[#1a140f] hover:border-[#c89658] transition-all"
            >
              <Mail className="h-3 w-3 text-[#c89658]" />
              <span>Sommelier Concierge</span>
            </a>

            <MagneticButton strength={0.4}>
              <button
                onClick={onBackToTop}
                aria-label="Back to Top of Page"
                className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-[#c89658]/40 bg-[#0f0c09] transition-all duration-500 hover:border-[#c89658] hover:shadow-[0_0_25px_rgba(200,150,88,0.5)] cursor-pointer"
              >
                <ArrowUp className="h-4 w-4 text-[#c89658] transition-transform duration-300 group-hover:-translate-y-1" />
              </button>
            </MagneticButton>
          </div>
        </div>

        {/* Bottom Micro Copyright Bar */}
        <div className="mt-12 pt-6 border-t border-[#1a140f] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-[#6e6358] tracking-wider">
          <span>© 1998–2026 NOIR ROAST MAISON DE HAUTE TORRÉFACTION.</span>
          <span className="text-[#c89658]/80">ALL RIGHTS RESERVED • CRAFTED OBSESSIVELY</span>
        </div>
      </div>
    </footer>
  );
};
