import React, { useState } from 'react';
import { ArrowUp, Compass, Sparkles, Shield, Award, CheckCircle2, Star, Mail, Check } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface FooterProps {
  onBackToTop: () => void;
  onNavigate?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onBackToTop, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setIsSubscribed(false);
    }, 4000);
  };

  const reviews = [
    {
      id: 'rev-01',
      name: 'Dr. Vikramaditya Rao',
      role: 'Licensed Q-Arabica Grader & Judge',
      location: 'Bengaluru, Karnataka',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      lot: 'BABA BUDAN OBSIDIAN • 1,900M',
      rating: 5,
      date: '2 Days Ago',
      quote: 'The 1,900M high-elevation Baba Budan micro-lot is extraordinary. The smoked cardamom nuances, 85% Mysore dark cacao finish, and floral jasmine esters rival the finest Geishas in the world. An Indian terroir masterpiece.',
    },
    {
      id: 'rev-02',
      name: 'Ananya Deshmukh',
      role: 'Head Sommelier & Beverage Director',
      location: 'Colaba, Mumbai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      lot: 'MALABAR MONSOONED AA',
      rating: 5,
      date: '3 Days Ago',
      quote: 'The golden crema on the Malabar Monsooned 9-bar extraction is like liquid silk. Notes of jaggery molasses and roasted oak without a single trace of bitterness. My private cellar members are captivated.',
    },
    {
      id: 'rev-03',
      name: 'Chef Rohan Mehra',
      role: 'Executive Chef, Contemporary Indian',
      location: 'New Delhi',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      lot: 'DAKSHIN FILTER KAAPI CEREMONY',
      rating: 5,
      date: '5 Days Ago',
      quote: 'When poured from a height between traditional brass davarah and tumbler, the aeration produces a golden foam that elevates Indian coffee to haute cuisine. Absolutely peerless.',
    },
    {
      id: 'rev-04',
      name: 'Pooja Hegde-Iyer',
      role: 'Specialty Kaapi Advocate',
      location: 'Indiranagar, Bengaluru',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      lot: 'COORG RAINFOREST PEABERRY',
      rating: 5,
      date: '1 Week Ago',
      quote: 'The hand-harvested 22° Brix Kodagu peaberries have a spherical density that roasts evenly across the cast-iron drum. Wild dark berries and silver oak notes in every single cup.',
    },
    {
      id: 'rev-05',
      name: 'Devansh Kothari',
      role: 'Cellar Member & Collector',
      location: 'Jubilee Hills, Hyderabad',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      lot: 'DAKSHIN RESERVE 1998 • TIN #048',
      rating: 5,
      date: '1 Week Ago',
      quote: 'The wax-sealed numbered tin arrived via white-glove courier within 36 hours of cracking. The packaging, freshness, and explosive aroma upon breaking the vacuum seal were breathtaking.',
    },
    {
      id: 'rev-06',
      name: 'Kavita Nambiar',
      role: 'Estate Agronomist',
      location: 'Wayanad, Kerala',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      lot: 'ARAKU VALLEY TRIBAL HONEY',
      rating: 5,
      date: '2 Weeks Ago',
      quote: 'Noir Dakshin pays +350% above standard auction minimums directly to tribal growers in the Eastern Ghats. You can taste the genuine regenerative care and ethical craft in every sip.',
    },
    {
      id: 'rev-07',
      name: 'Raghavan Swaminathan',
      role: 'Kaapi Historian & Author',
      location: 'Mylapore, Chennai',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      lot: 'TRADITIONAL BRASS DECOCTION',
      rating: 5,
      date: '2 Weeks Ago',
      quote: 'Growing up in Mylapore, I have tasted thousands of filter coffees. Noir Dakshin is the first maison to honor the 1670 Baba Budan lineage with modern thermodynamic precision. Pure perfection.',
    },
    {
      id: 'rev-08',
      name: 'Meera Sengupta',
      role: 'Coffee Roasting Guild Lead',
      location: 'Kolkata, West Bengal',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      lot: 'BABA BUDAN OBSIDIAN • POUR OVER',
      rating: 5,
      date: '3 Weeks Ago',
      quote: 'The sweetness level on the refractometer consistently registers above 22° Brix. The acoustic cracking profile unlocks essential oils that linger on the palate for minutes.',
    },
  ];

  const archiveEditions = [
    { label: 'Baba Budan Obsidian Gesha', target: '#section-reserve' },
    { label: 'Malabar Monsooned AA', target: '#section-reserve' },
    { label: 'Araku Valley Tribal Honey', target: '#section-reserve' },
    { label: 'Coorg Rainforest Peaberry', target: '#section-reserve' },
  ];

  const ritualLinks = [
    { label: 'South Indian Filter Kaapi', target: '#section-brew-ritual' },
    { label: 'Baba Budan V60 Pour Over', target: '#section-brew-ritual' },
    { label: 'Malabar 9.0 Bar Espresso', target: '#section-brew-ritual' },
    { label: 'Mysore Cold Maceration', target: '#section-brew-ritual' },
  ];

  const sensoryNotes = [
    { name: 'Jasmine Bloom', note: 'Chikmagalur Arabica' },
    { name: 'Smoked Cardamom', note: 'Coorg Silver Oak' },
    { name: 'Dark Mysore Cacao', note: 'Baba Budan Hills' },
    { name: 'Monsoon Cured Oak', note: 'Malabar Coast' },
    { name: 'Raw Jaggery Nectar', note: 'Araku Valley' },
  ];

  return (
    <footer className="relative bg-[#040302] pt-16 sm:pt-20 pb-12 text-[#f4eee6] overflow-hidden border-t border-[#221c17]">
      {/* Background Ambient Amber Radiance & Watermark */}
      <div className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 h-[500px] w-[1000px] rounded-full bg-radial-at-c from-[#c89658]/18 via-[#8b5a2b]/8 to-transparent mix-blend-screen opacity-80" />

      {/* Background Typography Watermark */}
      <div className="pointer-events-none absolute bottom-28 left-0 right-0 w-full text-center select-none overflow-hidden opacity-[0.03]">
        <span className="inline-block font-display text-[7.5vw] font-black uppercase tracking-[0.08em] text-[#e5b877] max-w-full">
          NOIR DAKSHIN
        </span>
      </div>

      <div className="relative z-10 w-full">
        {/* ================= 1. REVIEWS SECTION HEADER ================= */}
        <div className="mb-10 text-center flex flex-col items-center px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#120e0a]/90 border border-[#c89658]/40 mb-4 shadow-[0_0_20px_rgba(200,150,88,0.2)] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#c89658]" />
            <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.3em] uppercase text-[#e5b877] font-semibold">
              VERIFIED CELLAR ALLOCATIONS • 4.98 / 5.0 RATING
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#f4eee6] font-light tracking-tight leading-tight">
            PRAISE FROM THE <span className="italic text-[#e5b877] font-display font-semibold drop-shadow-[0_0_35px_rgba(200,150,88,0.4)]">CELLAR CIRCLE.</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#a89d93] mt-2 max-w-xl font-light">
            Verified dispatches from Q-graders, coffee sommeliers, Michelin chefs, and estate collectors across India.
          </p>
        </div>

        {/* ================= 2. MOVING REVIEWS CAROUSEL (LEFT TO RIGHT) ================= */}
        <div className="relative mb-20 w-full overflow-hidden hover-pause select-none py-4">
          {/* Subtle edge fades */}
          <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#040302] to-transparent z-20" />
          <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#040302] to-transparent z-20" />

          {/* Continuous Left-to-Right Moving Track */}
          <div className="animate-marquee-right flex gap-5 sm:gap-6 will-change-transform">
            {/* Duplicated list for infinite seamless loop */}
            {[...reviews, ...reviews].map((rev, idx) => (
              <div
                key={`${rev.id}-${idx}`}
                className="w-[340px] sm:w-[420px] shrink-0 rounded-3xl bg-[#0c0907]/95 border border-[#c89658]/30 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_15px_45px_rgba(0,0,0,0.85)] flex flex-col justify-between transition-all duration-300 hover:border-[#c89658] hover:shadow-[0_15px_45px_rgba(200,150,88,0.2)] hover:-translate-y-1 group"
              >
                <div>
                  {/* Top Row: Reviewer Avatar, Name, Location & Verified Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-[#221a14]">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={rev.avatar}
                          alt={rev.name}
                          className="h-12 w-12 rounded-full object-cover object-center border-2 border-[#c89658]/60 shadow-[0_0_12px_rgba(200,150,88,0.35)] group-hover:border-[#e5b877] transition-colors"
                        />
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[#18120d] border border-[#c89658] flex items-center justify-center text-[#c89658]">
                          <Check className="h-2.5 w-2.5" />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-serif text-base font-bold text-[#f4eee6] leading-tight group-hover:text-[#e5b877] transition-colors">
                          {rev.name}
                        </h4>
                        <span className="text-[10px] font-sans text-[#a89d93] block leading-tight">
                          {rev.role}
                        </span>
                        <span className="text-[9px] font-mono text-[#8c827a] block mt-0.5">
                          {rev.location}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 text-[8px] font-mono font-bold text-emerald-400 shrink-0">
                      <CheckCircle2 className="h-2.5 w-2.5" /> VERIFIED
                    </span>
                  </div>

                  {/* Rating Stars & Lot Tag */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-[#e5b877]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-[#e5b877]" />
                      ))}
                    </div>

                    <span className="font-mono text-[9px] text-[#c89658] font-bold tracking-wider uppercase bg-[#18120d] px-2 py-0.5 rounded-full border border-[#332519]">
                      {rev.lot}
                    </span>
                  </div>

                  {/* Review Quote Body */}
                  <p className="font-serif italic text-xs sm:text-[13px] text-[#ded5cb] leading-relaxed line-clamp-4">
                    “{rev.quote}”
                  </p>
                </div>

                {/* Footer Timestamp */}
                <div className="pt-3 mt-4 border-t border-[#1c1510] flex items-center justify-between text-[9px] font-mono text-[#786e64]">
                  <span>Maison Noir Dakshin Cellar Book</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 3. Sensory Cupping & Indian Terroir Matrix Strip ================= */}
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mb-16 rounded-3xl bg-[#0d0a08]/85 border border-[#2b2118] p-5 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="h-2 w-2 rounded-full bg-[#c89658] animate-ping" />
                <span className="text-[10px] font-mono font-bold text-[#c89658] tracking-widest uppercase">
                  DAKSHIN SENSORY MATRIX
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
                NOIR DAKSHIN
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#a89d93] font-light max-w-sm leading-relaxed">
                Haute Indian Kaapi Maison est. 1998. Dedicated to shade-grown Western Ghats terroir, traditional brass davarah alchemy, and slow cast-iron drum convection.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#120e0b] border border-[#c89658]/35 px-4 py-1.5 text-[10px] font-mono text-[#e5b877] tracking-widest uppercase shadow-md">
                <Compass className="h-3.5 w-3.5 text-[#c89658] animate-spin-slow" />
                <span>Baba Budan Giri • Chikmagalur 1,900m ASL</span>
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
                Kaapi Rituals
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
                  Private Dakshin Dispatches
                </span>
              </div>
              <p className="font-sans text-xs text-[#a89d93] leading-relaxed">
                Receive strictly private allocations of numbered 12kg Chikmagalur micro-batches before public cellar release.
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

          {/* ================= 5. Masterpiece Bottom Bar ================= */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-4">
            {/* Left: Founder Wax Seal Emblem */}
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-full border border-[#c89658]/60 bg-[#120e0a] flex items-center justify-center shadow-[0_0_15px_rgba(200,150,88,0.25)]">
                <Award className="h-5 w-5 text-[#c89658]" />
              </div>
              <div>
                <span className="font-serif italic text-sm text-[#f4eee6] block leading-tight">
                  Maison Noir Dakshin
                </span>
                <span className="font-mono text-[9px] text-[#8c827a] tracking-widest uppercase">
                  12.9716° N, 77.5946° E • BENGALURU & CHIKMAGALUR
                </span>
              </div>
            </div>

            {/* Right: Sommelier Direct & Back To Top */}
            <div className="flex items-center gap-4">
              <a
                href="mailto:atelier@noirroast.com"
                className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#120e0b] border border-[#c89658]/35 px-4 py-2 text-[10px] font-sans tracking-widest uppercase text-[#e5b877] hover:bg-[#1a140f] hover:border-[#c89658] transition-all"
              >
                <Mail className="h-3 w-3 text-[#c89658]" />
                <span>Dakshin Sommelier</span>
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

          {/* Bottom Copyright */}
          <div className="mt-12 pt-6 border-t border-[#1a140f] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-[#6e6358] tracking-wider">
            <span>© 1998–2026 NOIR DAKSHIN ROAST MAISON DE HAUTE TORRÉFACTION.</span>
            <span className="text-[#c89658]/80">ALL RIGHTS RESERVED • CHIKMAGALUR & BENGALURU</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
