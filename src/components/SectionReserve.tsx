import React, { useEffect, useRef } from 'react';
import { ArrowRight, Star, Shield, RotateCw } from 'lucide-react';
import { gsap } from '../utils/animations';
import type { ReserveBatch } from '../types';

interface SectionReserveProps {
  onSelectBatch: (batch: ReserveBatch) => void;
}

export const SectionReserve: React.FC<SectionReserveProps> = ({ onSelectBatch }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardGridRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const reserveCards: (ReserveBatch & {
    bullets: string[];
    rating: string;
    ratingCount: string;
    shortDesc: string;
    iconSvg: React.ReactNode;
  })[] = [
    {
      id: 'batch-01',
      name: 'Obsidian Gesha 2,400M',
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
        '2,400m ASL high-altitude volcanic terroir',
        'Bergamot blossom & 85% cacao finish',
        'Strictly limited to 85 numbered tins',
      ],
      rating: '4.9/5',
      ratingCount: 'rated by 1,400+ sommeliers',
      iconSvg: (
        <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 3D Metallic Roasted Coffee Bean with Golden Crema Spiral */}
          <defs>
            <linearGradient id="beanGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d49b5c" />
              <stop offset="45%" stopColor="#7a4b22" />
              <stop offset="100%" stopColor="#24150a" />
            </linearGradient>
            <linearGradient id="beanGrad2" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f3c28a" />
              <stop offset="50%" stopColor="#8c5828" />
              <stop offset="100%" stopColor="#1a0f07" />
            </linearGradient>
            <linearGradient id="goldCrema" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffe4a0" />
              <stop offset="50%" stopColor="#c89658" />
              <stop offset="100%" stopColor="#66441b" />
            </linearGradient>
          </defs>
          {/* Left Bean Half */}
          <path d="M56 22 C30 24 18 45 20 72 C22 92 38 102 54 100 C57 78 52 50 56 22 Z" fill="url(#beanGrad1)" stroke="#52361b" strokeWidth="1.5" filter="drop-shadow(0 10px 18px rgba(0,0,0,0.8))" />
          {/* Right Bean Half */}
          <path d="M64 22 C90 24 102 45 100 72 C98 92 82 102 66 100 C63 78 68 50 64 22 Z" fill="url(#beanGrad2)" stroke="#52361b" strokeWidth="1.5" />
          {/* Center S-Curve Crevice */}
          <path d="M58 24 Q65 48 55 68 Q46 88 62 98" stroke="url(#goldCrema)" strokeWidth="3.5" strokeLinecap="round" />
          {/* Aromatic Steam Waves */}
          <path d="M40 16 Q48 8 44 2" stroke="#e5b877" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
          <path d="M60 14 Q68 6 64 0" stroke="#e5b877" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <path d="M80 16 Q88 8 84 2" stroke="#e5b877" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
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
          {/* 3D Charred Oak Aging Barrel with Golden Hoops */}
          <defs>
            <linearGradient id="barrelGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3d2a1c" />
              <stop offset="30%" stopColor="#784f2d" />
              <stop offset="50%" stopColor="#9e6c40" />
              <stop offset="70%" stopColor="#784f2d" />
              <stop offset="100%" stopColor="#24180f" />
            </linearGradient>
            <linearGradient id="metalHoop" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8c775d" />
              <stop offset="50%" stopColor="#ffd994" />
              <stop offset="100%" stopColor="#5c452b" />
            </linearGradient>
          </defs>
          {/* Barrel Body */}
          <path d="M38 24 Q60 20 82 24 Q96 60 82 96 Q60 100 38 96 Q24 60 38 24 Z" fill="url(#barrelGrad)" stroke="#2b1a0e" strokeWidth="2" filter="drop-shadow(0 10px 18px rgba(0,0,0,0.85))" />
          {/* Metallic Hoops */}
          <path d="M32 38 Q60 33 88 38" stroke="url(#metalHoop)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M26 56 Q60 50 94 56" stroke="url(#metalHoop)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M26 64 Q60 58 94 64" stroke="url(#metalHoop)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M32 82 Q60 77 88 82" stroke="url(#metalHoop)" strokeWidth="4.5" strokeLinecap="round" />
          {/* Golden Tap Droplet */}
          <circle cx="60" cy="60" r="4.5" fill="#ffd994" stroke="#c89658" strokeWidth="1.5" />
          <path d="M60 66 L60 74 Q60 77 63 77" stroke="#e5b877" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'batch-03',
      name: 'Midnight Volcano',
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
      shortDesc: 'Dense shade-grown volcanic cherries processed via wet-hulling.',
      description: 'Dense shade-grown volcanic cherries processed via traditional wet-hulling with triple hand-sorting to eliminate every minor defect.',
      bullets: [
        'Triple hand-sorted zero-defect grade 1',
        'Heavy dark espresso roast profile',
        'Smoked fig, cedar resin & dark truffle',
        'Low wine acidity with massive crema',
      ],
      rating: '5.0/5',
      ratingCount: 'rated by 2,200+ connoisseurs',
      iconSvg: (
        <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 3D Bottomless Portafilter with Liquid Amber Stream */}
          <defs>
            <linearGradient id="chromeSteel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#9c9388" />
              <stop offset="70%" stopColor="#574f46" />
              <stop offset="100%" stopColor="#241e19" />
            </linearGradient>
            <linearGradient id="amberStream" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffd28d" />
              <stop offset="50%" stopColor="#c87f35" />
              <stop offset="100%" stopColor="#5e3009" />
            </linearGradient>
          </defs>
          <path d="M20 78 L42 62" stroke="#1c1612" strokeWidth="12" strokeLinecap="round" />
          <path d="M20 78 L38 64" stroke="#c89658" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="68" cy="46" rx="34" ry="20" fill="url(#chromeSteel)" stroke="#2b231c" strokeWidth="2" filter="drop-shadow(0 10px 18px rgba(0,0,0,0.85))" />
          <ellipse cx="68" cy="46" rx="26" ry="14" fill="#361f10" stroke="#c89658" strokeWidth="1.5" />
          <path d="M50 46 Q68 54 86 46" stroke="#e5b877" strokeWidth="2.5" />
          <path d="M56 42 Q68 48 80 42" stroke="#d49048" strokeWidth="2" />
          <path d="M68 56 Q66 75 68 102" stroke="url(#amberStream)" strokeWidth="6" strokeLinecap="round" />
          <circle cx="68" cy="104" r="5" fill="#ffe09c" />
        </svg>
      ),
    },
    {
      id: 'batch-04',
      name: 'Kyoto Atelier Roast',
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
      shortDesc: 'Slow-roasted in Kyoto convection roaster for exquisite clarity.',
      description: 'Slow-roasted in our Kyoto convection roaster with precise airflow curve profiling for sweet acidity and lingering honey finish.',
      bullets: [
        'Dual-origin Gesha & Pink Bourbon fusion',
        'Slow drum convection thermal curve',
        'Champagne acidity & wild plum honey',
        'Includes batch calibration booklet',
      ],
      rating: '4.9/5',
      ratingCount: 'rated by 1,800+ connoisseurs',
      iconSvg: (
        <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 3D Cast-Iron Roaster Drum & Precision Convection Flame */}
          <defs>
            <linearGradient id="roasterDrum" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7a7065" />
              <stop offset="40%" stopColor="#3d352c" />
              <stop offset="100%" stopColor="#140f0c" />
            </linearGradient>
            <linearGradient id="flameGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#c84518" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fffbeb" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="38" rx="38" ry="16" fill="url(#roasterDrum)" stroke="#c89658" strokeWidth="1.5" />
          <path d="M22 38 L22 74 Q60 90 98 74 L98 38 Z" fill="url(#roasterDrum)" stroke="#2e251e" strokeWidth="2" filter="drop-shadow(0 10px 18px rgba(0,0,0,0.85))" />
          <ellipse cx="60" cy="74" rx="38" ry="16" fill="#140f0c" stroke="#c89658" strokeWidth="1.5" />
          <circle cx="60" cy="56" r="13" fill="#070605" stroke="#e5b877" strokeWidth="2" />
          <path d="M60 48 Q67 56 60 64 Q53 56 60 48 Z" fill="url(#flameGrad)" filter="drop-shadow(0 0 8px #f59e0b)" />
          <circle cx="50" cy="40" r="1.5" fill="#ffe299" />
          <circle cx="70" cy="36" r="2" fill="#ffe299" />
          <circle cx="60" cy="28" r="1.8" fill="#ffe299" />
        </svg>
      ),
    },
  ];

  const handleCardClick = (index: number) => {
    const cardEl = cardsRef.current[index];
    if (!cardEl) return;
    const currentRot = (gsap.getProperty(cardEl, 'rotationY') as number) || 0;
    const isBack = Math.abs(currentRot % 360) >= 90 && Math.abs(currentRot % 360) <= 270;
    gsap.to(cardEl, {
      rotationY: isBack ? 0 : 180,
      duration: 0.7,
      ease: 'power3.out',
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    const cardElements = cardsRef.current.filter(Boolean) as HTMLDivElement[];

    if (!section || cardElements.length === 0) return;

    const ctx = gsap.context(() => {
      // 1. Initialize 3D properties on all cards
      gsap.set(cardElements, {
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
        rotationY: 0,
      });

      // 2. PINNED ScrollTrigger Timeline: Sequentially flips each card as user scrolls
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1.0,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Sequential 3D Flip from 0deg to 180deg
      cardElements.forEach((card, index) => {
        const startTime = index * 0.22;
        tl.to(
          card,
          {
            rotationY: 180,
            ease: 'power2.inOut',
            duration: 0.38,
          },
          startTime
        );
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="section-reserve"
      ref={sectionRef}
      aria-label="Section 07: The Reserve Vault On-Scroll Card Flip"
      className="relative min-h-screen w-full bg-[#070605] py-16 flex items-center justify-center overflow-hidden border-t border-[#221c17]"
    >
      <div className="mx-auto max-w-7xl w-full px-6 md:px-12 flex flex-col justify-between min-h-[88vh] py-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#221c17] pb-4">
          <div>
            <div className="flex items-center gap-3 text-xs tracking-[0.3em] text-[#c89658] font-sans font-semibold uppercase mb-2">
              <span className="font-mono text-[#c89658]">07</span>
              <span className="h-[1px] w-8 bg-[#c89658]/60" />
              <span>THE VAULT / PRIVATE EDITIONS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f4eee6] font-light tracking-tight max-w-2xl">
              The Reserve Vault. <br />
              <span className="italic text-[#e5b877] font-display font-semibold">On-Scroll Flipping Cards.</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-sans text-xs tracking-[0.2em] text-[#8c827a] uppercase">
              <Shield className="h-4 w-4 text-[#c89658]" />
              <span>12kg Numbered Tins</span>
            </div>
            <span className="text-[#3a3026]">•</span>
            <span className="text-[11px] font-sans tracking-[0.2em] uppercase text-[#c89658] flex items-center gap-1.5">
              <RotateCw className="h-3 w-3 animate-spin-slow" />
              Scroll Down to Flip Cards
            </span>
          </div>
        </div>

        {/* 4 3D Flipping Cards in Grid matching reference design */}
        <div
          ref={cardGridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1500 my-auto py-6"
        >
          {reserveCards.map((card, index) => (
            <div
              key={card.id}
              className="flip-card-wrapper relative h-[460px] sm:h-[480px] w-full perspective-1200 cursor-pointer"
              onClick={() => handleCardClick(index)}
            >
              {/* 3D Flipping Inner Element - Controlled smoothly by GSAP rotationY */}
              <div
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="flip-card-inner relative h-full w-full preserve-3d will-change-transform rounded-3xl"
              >
                {/* ==================== FRONT FACE (Exact match to Reference Image 1) ==================== */}
                <div className="absolute inset-0 backface-hidden rounded-3xl bg-[#13110f] border border-[#2e2620] p-7 flex flex-col justify-between items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:border-[#c89658]/60 hover:shadow-[0_20px_50px_rgba(200,150,88,0.15)] transition-colors">
                  {/* Top Ambient Dot */}
                  <div className="w-full flex justify-end">
                    <span className="h-2 w-2 rounded-full bg-[#c89658]/50" />
                  </div>

                  {/* Centered 3D Metallic Coffee Icon */}
                  <div className="my-auto flex flex-col items-center justify-center">
                    {card.iconSvg}
                  </div>

                  {/* Clean Bold Title at Bottom */}
                  <div className="w-full pt-4">
                    <h3 className="font-sans text-lg sm:text-xl font-bold text-[#f4eee6] tracking-tight leading-snug">
                      {card.name}
                    </h3>
                    <span className="text-[11px] font-sans text-[#8c827a] block mt-1 tracking-wider uppercase">
                      {card.origin}
                    </span>
                  </div>
                </div>

                {/* ==================== BACK FACE (Exact match to Reference Image 2) ==================== */}
                <div
                  className="absolute inset-0 backface-hidden rounded-3xl bg-[#14110f] border border-[#3d3128] p-7 flex flex-col justify-between text-left shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
                  style={{
                    transform: 'rotateY(180deg)',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                  }}
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
                      <span>Request Batch</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="flex items-center justify-between border-t border-[#221c17] pt-3 text-xs text-[#8c827a]">
          <span className="font-serif italic text-[#a89d93]">
            “Roasted slowly to order in 12kg numbered micro-casks.”
          </span>
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#c89658]">
            Scroll Down to Flip • Scroll Up to Reset
          </span>
        </div>
      </div>
    </section>
  );
};
