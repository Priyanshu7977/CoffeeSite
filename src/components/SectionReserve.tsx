import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Star, Shield } from 'lucide-react';
import { gsap } from '../utils/animations';
import type { ReserveBatch } from '../types';

interface SectionReserveProps {
  onSelectBatch: (batch: ReserveBatch) => void;
}

export const SectionReserve: React.FC<SectionReserveProps> = ({ onSelectBatch }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardGridRef = useRef<HTMLDivElement | null>(null);

  // Allow manual toggle click for mobile/touch devices
  const [flippedCards, setFlippedCards] = useState<{ [id: string]: boolean }>({});

  const toggleCard = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const reserveCards: (ReserveBatch & {
    bullets: string[];
    rating: string;
    ratingCount: string;
    shortDesc: string;
    iconSvg: React.ReactNode;
  })[] = [
    {
      id: 'batch-01',
      name: 'Obsidian Geisha 2,400M',
      vintage: '2026 Reserve Allocation',
      origin: 'Ethiopia / Gesha Village',
      region: 'Bench Maji Block 04',
      altitude: '2,400m ASL',
      varietal: 'Wild 1931 Gesha',
      process: '96h Anaerobic Natural',
      notes: ['Bergamot Blossom', '85% Dark Cacao', 'Black Cherry', 'Jasmine'],
      allocationLeft: 14,
      totalAllocations: 85,
      roastLevel: 'Omniroast Filter & Espresso',
      price: '$48.00',
      badge: 'Strictly Limited / 14 Left',
      shortDesc: 'Grown on volcanic crests with 96h anaerobic natural fermentation.',
      description: 'Grown on the highest volcanic crests of Bench Maji. Fermented in sealed stainless tanks under controlled temperature before slow raised-bed drying for 32 days.',
      bullets: [
        'Single-estate wild heirloom 1931 Gesha',
        '2,400m ASL high-altitude volcanic soil',
        'Bergamot blossom & 85% cacao finish',
        'Strictly limited to 85 numbered tins',
      ],
      rating: '4.9/5',
      ratingCount: 'rated by 1,400+ connoisseurs',
      iconSvg: (
        <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 3D Isometric Luxury Package with Origami Wing */}
          <defs>
            <linearGradient id="boxGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e5b877" />
              <stop offset="50%" stopColor="#a37640" />
              <stop offset="100%" stopColor="#4a3319" />
            </linearGradient>
            <linearGradient id="boxGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8c827a" />
              <stop offset="100%" stopColor="#2b231c" />
            </linearGradient>
            <linearGradient id="silverShine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#b3aba2" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3d352e" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {/* Box Bottom & Sides */}
          <path d="M60 100 L25 80 L25 50 L60 70 Z" fill="url(#boxGrad2)" stroke="#5c4a3b" strokeWidth="1.5" />
          <path d="M60 100 L95 80 L95 50 L60 70 Z" fill="#1c1612" stroke="#5c4a3b" strokeWidth="1.5" />
          {/* Flaps open */}
          <path d="M25 50 L10 40 L45 30 L60 40 Z" fill="url(#silverShine)" stroke="#8c827a" strokeWidth="1.5" />
          <path d="M95 50 L110 40 L75 30 L60 40 Z" fill="url(#silverShine)" stroke="#8c827a" strokeWidth="1.5" />
          {/* Origami Aeroplane / Golden Wing Taking Flight */}
          <path d="M35 55 L85 25 L65 70 Z" fill="url(#boxGrad1)" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.6))" />
          <path d="M65 70 L85 25 L55 45 Z" fill="#ffd28d" opacity="0.9" />
          <path d="M35 55 L65 70 L55 45 Z" fill="#8c5825" />
        </svg>
      ),
    },
    {
      id: 'batch-02',
      name: 'Cask Bourbon Reserve',
      vintage: 'Atelier Limited Series',
      origin: 'Guatemala / Antigua Valley',
      region: 'Volcán de Fuego Slopes',
      altitude: '1,950m ASL',
      varietal: 'Bourbon & Pacamara',
      process: '90-Day Charred Oak Aged',
      notes: ['Kentucky Bourbon', 'Charred White Oak', 'Pecan Praline', 'Molasses'],
      allocationLeft: 8,
      totalAllocations: 60,
      roastLevel: 'Medium-Dark Velvet',
      price: '$54.00',
      badge: 'Master Cask Release',
      shortDesc: 'Raw green beans rested in charred oak Kentucky bourbon barrels.',
      description: 'Raw green beans rested in freshly dumped 12-year Kentucky Bourbon barrels for 90 days, absorbing deep whiskey esters before precision drum roasting.',
      bullets: [
        '90-day charred American white oak aged',
        'Infused with 12-year bourbon esters',
        'Molasses, roasted pecan & sweet smoke',
        'Hand-numbered 12kg micro-cask tins',
      ],
      rating: '4.9/5',
      ratingCount: 'rated by 980+ connoisseurs',
      iconSvg: (
        <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tagGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#cfc8be" />
              <stop offset="50%" stopColor="#786e64" />
              <stop offset="100%" stopColor="#2e2721" />
            </linearGradient>
            <linearGradient id="goldCoin" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffe6a3" />
              <stop offset="60%" stopColor="#c89658" />
              <stop offset="100%" stopColor="#69451d" />
            </linearGradient>
          </defs>
          {/* Main 3D Angled Price Tag */}
          <path d="M40 25 L80 25 L100 65 L60 105 L20 65 Z" fill="url(#tagGrad)" stroke="#8c827a" strokeWidth="2" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.7))" />
          <circle cx="60" cy="40" r="7" fill="#070605" stroke="#a3988d" strokeWidth="2" />
          {/* Percentage / Seal Symbol on Tag */}
          <text x="60" y="80" textAnchor="middle" fill="#f4eee6" fontSize="26" fontWeight="bold" fontFamily="sans-serif">%</text>
          {/* 3D Floating Golden Coins */}
          <ellipse cx="25" cy="85" rx="14" ry="10" fill="url(#goldCoin)" stroke="#ffd28d" strokeWidth="1.5" />
          <ellipse cx="90" cy="35" rx="12" ry="8" fill="url(#goldCoin)" stroke="#ffd28d" strokeWidth="1.5" />
          <ellipse cx="102" cy="50" rx="9" ry="6" fill="url(#goldCoin)" stroke="#ffd28d" strokeWidth="1.2" />
        </svg>
      ),
    },
    {
      id: 'batch-03',
      name: 'Custom Product Boxes',
      vintage: 'Single Estate Crop',
      origin: 'Sumatra / Mount Kerinci',
      region: 'Kerinci Highlands',
      altitude: '1,750m ASL',
      varietal: 'Andung Sari & Sigarar Utang',
      process: 'Triple-Picked Giling Basah',
      notes: ['Charred Cedar', 'Smoked Fig', '90% Cacao Truffle', 'Black Pepper'],
      allocationLeft: 22,
      totalAllocations: 100,
      roastLevel: 'Heavy Espresso Roast',
      price: '$42.00',
      badge: 'Intense Body Edition',
      shortDesc: 'Dense volcanic cherries crafted with custom micro-lot pairing.',
      description: 'Dense shade-grown volcanic cherries processed via traditional wet-hulling with triple hand-sorting to eliminate every minor defect.',
      bullets: [
        'Bespoke roast profiling to order',
        'Wet-hulled Giling Basah heritage method',
        'Smoked fig, cedar resin & dark truffle',
        '100% zero-defect sorted beans',
      ],
      rating: '5.0/5',
      ratingCount: 'rated by 2,200+ stores',
      iconSvg: (
        <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="storeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b3aba2" />
              <stop offset="100%" stopColor="#2e2721" />
            </linearGradient>
            <linearGradient id="awningGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e5b877" />
              <stop offset="100%" stopColor="#734f24" />
            </linearGradient>
          </defs>
          {/* Main Atelier / Shop Front Window */}
          <rect x="25" y="35" width="70" height="65" rx="10" fill="url(#storeGrad)" stroke="#665c52" strokeWidth="2" filter="drop-shadow(0 10px 16px rgba(0,0,0,0.8))" />
          {/* Awning stripes */}
          <path d="M20 38 Q60 22 100 38 L95 55 Q60 40 25 55 Z" fill="url(#awningGrad)" stroke="#2b231c" strokeWidth="1.5" />
          {/* Atelier Display Door / Coffee Machine Window */}
          <rect x="42" y="60" width="36" height="40" rx="5" fill="#070605" stroke="#8c827a" strokeWidth="1.5" />
          {/* Slider Equalizer Knobs on side */}
          <rect x="75" y="48" width="38" height="32" rx="7" fill="#1f1a16" stroke="#c89658" strokeWidth="1.5" />
          <line x1="82" y1="56" x2="106" y2="56" stroke="#665c52" strokeWidth="2" />
          <circle cx="89" cy="56" r="3.5" fill="#e5b877" />
          <line x1="82" y1="70" x2="106" y2="70" stroke="#665c52" strokeWidth="2" />
          <circle cx="99" cy="70" r="3.5" fill="#e5b877" />
        </svg>
      ),
    },
    {
      id: 'batch-04',
      name: 'Sales Booster Pack',
      vintage: 'Kyoto Special Edition',
      origin: 'Japan & Colombia Terroir',
      region: 'Kyoto Atelier Blend No. 4',
      altitude: '2,100m ASL',
      varietal: 'Pink Bourbon & Gesha',
      process: 'Slow Drum Convection',
      notes: ['Honey Plum', 'Toasted Hazelnut', 'Golden Honey', 'Champagne'],
      allocationLeft: 11,
      totalAllocations: 75,
      roastLevel: 'Medium Roast Filter',
      price: '$46.00',
      badge: 'Kyoto Atelier Special',
      shortDesc: 'Curated limited batch pack designed for maximum sensory finish.',
      description: 'Slow-roasted in our Kyoto convection roaster with precise airflow curve profiling for sweet acidity and lingering honey finish.',
      bullets: [
        'Dual-origin Gesha & Pink Bourbon fusion',
        'Optimized for pour-over & cold drip',
        'Bright champagne acidity & plum honey',
        'Includes batch calibration booklet',
      ],
      rating: '4.9/5',
      ratingCount: 'rated by 3,100+ stores',
      iconSvg: (
        <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e5b877" />
              <stop offset="50%" stopColor="#9e733d" />
              <stop offset="100%" stopColor="#3d2b16" />
            </linearGradient>
            <linearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#d6cec5" />
              <stop offset="100%" stopColor="#8c827a" />
            </linearGradient>
          </defs>
          {/* 3D Ascending Growth Bars */}
          <rect x="22" y="72" width="16" height="32" rx="4" fill="url(#barGrad)" stroke="#c89658" strokeWidth="1.5" />
          <rect x="44" y="54" width="16" height="50" rx="4" fill="url(#barGrad)" stroke="#c89658" strokeWidth="1.5" />
          <rect x="66" y="38" width="16" height="66" rx="4" fill="url(#barGrad)" stroke="#c89658" strokeWidth="1.5" />
          <rect x="88" y="24" width="16" height="80" rx="4" fill="url(#barGrad)" stroke="#c89658" strokeWidth="1.5" />
          {/* 3D Ascending Growth Arrow */}
          <path d="M15 65 L45 42 L70 50 L102 14" stroke="url(#arrowGrad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.8))" />
          <path d="M84 14 L104 14 L104 34" stroke="url(#arrowGrad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const cardGrid = cardGridRef.current;

    if (!section || !cardGrid) return;

    const cards = cardGrid.querySelectorAll('.flip-card-wrapper');

    const ctx = gsap.context(() => {
      // Scroll-Driven 3D Flip Cascade
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'bottom 20%',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      // Smooth 3D entrance and settling
      tl.fromTo(
        cards,
        {
          transform: 'perspective(1400px) rotateY(-80deg) scale(0.9)',
          opacity: 0,
          y: 40,
        },
        {
          transform: 'perspective(1400px) rotateY(0deg) scale(1)',
          opacity: 1,
          y: 0,
          stagger: 0.12,
          ease: 'power3.out',
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="section-reserve"
      ref={sectionRef}
      aria-label="Section 07: The Reserve Vault Card Showcase"
      className="relative min-h-screen w-full bg-[#070605] py-20 md:py-32 px-6 md:px-12 flex items-center justify-center overflow-hidden border-t border-[#221c17]"
    >
      <div className="mx-auto max-w-7xl w-full">
        {/* Section Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#221c17] pb-8">
          <div>
            <div className="flex items-center gap-3 text-xs tracking-[0.3em] text-[#c89658] font-sans font-semibold uppercase mb-3">
              <span className="font-mono text-[#c89658]">07</span>
              <span className="h-[1px] w-8 bg-[#c89658]/60" />
              <span>THE VAULT / PRIVATE EDITIONS</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#f4eee6] font-light tracking-tight max-w-2xl">
              The Reserve Vault. <br />
              <span className="italic text-[#e5b877]">Interactive Allocation Cards.</span>
            </h2>
          </div>

          <div className="flex items-center gap-3 font-sans text-xs tracking-[0.2em] text-[#8c827a] uppercase">
            <Shield className="h-4 w-4 text-[#c89658]" />
            <span>Hover or Click Any Card to Flip in 3D</span>
          </div>
        </div>

        {/* 4 3D Flipping Cards in Grid matching reference */}
        <div
          ref={cardGridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1500"
        >
          {reserveCards.map((card) => {
            const isFlipped = !!flippedCards[card.id];

            return (
              <div
                key={card.id}
                className="flip-card-wrapper relative h-[460px] w-full perspective-1200 cursor-pointer group"
                onClick={() => toggleCard(card.id)}
              >
                {/* 3D Flipping Inner Element */}
                <div
                  className={`flip-card-inner relative h-full w-full preserve-3d transition-transform duration-700 ease-[cubic-bezier(0.4,0.2,0.2,1)] rounded-3xl ${
                    isFlipped ? '[transform:rotateY(180deg)]' : 'group-hover:[transform:rotateY(180deg)]'
                  }`}
                >
                  {/* ==================== FRONT FACE (Exact match to Reference Image 1) ==================== */}
                  <div className="absolute inset-0 backface-hidden rounded-3xl bg-[#13110f] border border-[#2e2620] p-8 flex flex-col justify-between items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:border-[#c89658]/60 group-hover:shadow-[0_20px_50px_rgba(200,150,88,0.15)]">
                    {/* Top Ambient Glow Pill */}
                    <div className="w-full flex justify-end">
                      <span className="h-2 w-2 rounded-full bg-[#c89658]/40 group-hover:bg-[#c89658] group-hover:shadow-[0_0_8px_#c89658] transition-all" />
                    </div>

                    {/* Centered 3D Metallic Coffee / Batch Icon */}
                    <div className="my-auto flex flex-col items-center justify-center transform transition-transform duration-500 group-hover:scale-105">
                      {card.iconSvg}
                    </div>

                    {/* Clean Bold Title at Bottom */}
                    <div className="w-full pt-4">
                      <h3 className="font-sans text-lg sm:text-xl font-bold text-[#f4eee6] tracking-tight leading-snug">
                        {card.name}
                      </h3>
                    </div>
                  </div>

                  {/* ==================== BACK FACE (Exact match to Reference Image 2) ==================== */}
                  <div
                    className="absolute inset-0 backface-hidden rounded-3xl bg-[#14110f] border border-[#3d3128] p-7 flex flex-col justify-between text-left shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
                    style={{ transform: 'rotateY(180deg)' }}
                  >
                    <div>
                      {/* Title at top */}
                      <h3 className="font-sans text-lg sm:text-xl font-bold text-[#f4eee6] tracking-tight mb-1.5">
                        {card.name}
                      </h3>

                      {/* Brief description */}
                      <p className="font-sans text-xs text-[#a89d93] leading-relaxed mb-4">
                        {card.shortDesc}
                      </p>

                      {/* Bulleted Points with clean dots */}
                      <ul className="space-y-2.5 mb-4">
                        {card.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs font-sans text-[#cfc6bc] leading-tight">
                            <span className="text-[#c89658] text-sm leading-none mt-0.5">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Row: Rating on Left, Pill Button on Right */}
                    <div className="pt-4 border-t border-[#261f18] flex items-end justify-between gap-2">
                      {/* Left: Gold Star Rating */}
                      <div>
                        <div className="flex items-center gap-1.5 text-sm font-sans font-bold text-[#f4eee6]">
                          <Star className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />
                          <span>{card.rating}</span>
                        </div>
                        <span className="text-[10px] font-sans text-[#786e64] block leading-tight mt-0.5">
                          {card.ratingCount}
                        </span>
                      </div>

                      {/* Right: Rounded Pill Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBatch(card);
                        }}
                        className="flex items-center gap-1.5 rounded-full bg-[#f4eee6] hover:bg-[#e5b877] text-[#070605] px-4 py-2 text-xs font-sans font-bold tracking-tight transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(229,184,119,0.5)] cursor-pointer shrink-0"
                      >
                        <span>Buy Plugin</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
