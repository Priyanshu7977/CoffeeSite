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
      name: 'Baba Budan Obsidian 1,900M',
      vintage: '2026 Monsoon Harvest',
      origin: 'India / Chikmagalur',
      region: 'Mullayanagiri & Chandragiri Hills',
      altitude: '1,900m ASL',
      varietal: 'Wild 1931 Arabica Selection',
      process: '96h Anaerobic Natural',
      notes: ['Smoked Cardamom', '85% Dark Cacao', 'Black Cherry', 'Jasmine'],
      allocationLeft: 14,
      totalAllocations: 85,
      roastLevel: 'Omniroast Filter & Espresso',
      price: '₹2,800',
      badge: 'Strictly Limited / 14 Left',
      shortDesc: 'Grown on sacred Chikmagalur peaks with 96h anaerobic natural fermentation.',
      description: 'Grown on the highest peaks of Baba Budan Giri. Fermented in sealed stainless tanks under controlled temperature before slow raised-bed drying for 32 days.',
      bullets: [
        'Single-estate sacred Baba Budan Arabica',
        '1,900m ASL high-altitude Western Ghats terroir',
        'Smoked cardamom & 85% Mysore cacao finish',
        'Strictly limited to 85 numbered tins',
      ],
      rating: '4.9/5',
      ratingCount: 'rated by 1,400+ sommeliers',
      iconSvg: (
        <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <path d="M56 22 C30 24 18 45 20 72 C22 92 38 102 54 100 C57 78 52 50 56 22 Z" fill="url(#beanGrad1)" stroke="#52361b" strokeWidth="1.5" filter="drop-shadow(0 10px 18px rgba(0,0,0,0.8))" />
          <path d="M64 22 C90 24 102 45 100 72 C98 92 82 102 66 100 C63 78 68 50 64 22 Z" fill="url(#beanGrad2)" stroke="#52361b" strokeWidth="1.5" />
          <path d="M58 24 Q65 48 55 68 Q46 88 62 98" stroke="url(#goldCrema)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M40 16 Q48 8 44 2" stroke="#e5b877" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
          <path d="M60 14 Q68 6 64 0" stroke="#e5b877" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <path d="M80 16 Q88 8 84 2" stroke="#e5b877" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
        </svg>
      ),
    },
    {
      id: 'batch-02',
      name: 'Malabar Monsooned AA Cask',
      vintage: 'Coastal Wind Series',
      origin: 'India / Malabar Coast',
      region: 'Wayanad & Arabian Sea Shore',
      altitude: '1,400m ASL',
      varietal: 'Monsooned Arabica AA Super-Bold',
      process: '16-Week Sea Wind Monsooning',
      notes: ['Dark Chocolate', 'Charred Oak', 'Earthy Molasses', 'Cardamom'],
      allocationLeft: 8,
      totalAllocations: 60,
      roastLevel: 'Medium-Dark Velvet',
      price: '₹2,400',
      badge: 'Master Cask Release',
      shortDesc: 'Sun-cured beans exposed to Arabian Sea monsoon winds.',
      description: 'Sun-cured beans naturally conditioned by moisture-laden Arabian Sea winds for 16 weeks, swelling to super-bold size with low acidity and dense chocolate crema.',
      bullets: [
        '16-week natural Arabian Sea monsoon cured',
        'Super-bold zero-defect AA bean selection',
        'Molasses, dark chocolate & toasted malt',
        'Hand-numbered 12kg micro-batch tins',
      ],
      rating: '4.9/5',
      ratingCount: 'rated by 980+ connoisseurs',
      iconSvg: (
        <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <path d="M38 24 Q60 20 82 24 Q96 60 82 96 Q60 100 38 96 Q24 60 38 24 Z" fill="url(#barrelGrad)" stroke="#2b1a0e" strokeWidth="2" filter="drop-shadow(0 10px 18px rgba(0,0,0,0.85))" />
          <path d="M32 38 Q60 33 88 38" stroke="url(#metalHoop)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M26 56 Q60 50 94 56" stroke="url(#metalHoop)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M26 64 Q60 58 94 64" stroke="url(#metalHoop)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M32 82 Q60 77 88 82" stroke="url(#metalHoop)" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="60" cy="60" r="4.5" fill="#ffd994" stroke="#c89658" strokeWidth="1.5" />
          <path d="M60 66 L60 74 Q60 77 63 77" stroke="#e5b877" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'batch-03',
      name: 'Araku Valley Tribal Honey',
      vintage: 'Eastern Ghats Micro-Lot',
      origin: 'India / Andhra Pradesh',
      region: 'Ananthagiri & Araku Highland Ridge',
      altitude: '1,400m ASL',
      varietal: 'Bio-Dynamic Arabica',
      process: 'Pulped Golden Honey Process',
      notes: ['Wild Forest Honey', 'Roasted Cashew', 'Mandarin Nectar', 'Caramel'],
      allocationLeft: 22,
      totalAllocations: 100,
      roastLevel: 'Medium Roast Filter',
      price: '₹2,600',
      badge: 'Tribal Terroir',
      shortDesc: 'Bio-dynamically grown by indigenous farmers in the red loam valleys.',
      description: 'Bio-dynamically cultivated in the pristine Eastern Ghats. Naturally sweet golden honey processing yields bright tropical citrus and silky toasted cashew notes.',
      bullets: [
        '100% tribal farmer direct ethical trade',
        'Bio-dynamic red loam soil cultivation',
        'Wild honey nectar & toasted cashew sweetness',
        'Crisp sparkling citrus acidity',
      ],
      rating: '5.0/5',
      ratingCount: 'rated by 2,200+ connoisseurs',
      iconSvg: (
        <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      name: 'Coorg Rainforest Peaberry',
      vintage: 'Kodagu Special Edition',
      origin: 'India / Karnataka',
      region: 'Madikeri & Brahmagiri Range',
      altitude: '1,600m ASL',
      varietal: 'Single-Bean Peaberry Arabica',
      process: 'Slow Cast-Iron Convection',
      notes: ['Black Fig', 'Wild Green Cardamom', 'Raw Jaggery', 'Cacao'],
      allocationLeft: 11,
      totalAllocations: 75,
      roastLevel: 'Light-Medium Omniroast',
      price: '₹2,200',
      badge: 'Kodagu Peaberry',
      shortDesc: 'Slow-roasted in cast iron for intense sweetness and cardamom warmth.',
      description: 'Rare single-bean Peaberry cherries hand-harvested beneath silver oak and pepper vine shade canopies. Slow-roasted in cast-iron drums for syrupy jaggery body.',
      bullets: [
        'Rare single-bean Peaberry cherry selection',
        'Shade-grown in Kodagu rainforest canopy',
        'Black fig, raw jaggery & cardamom warmth',
        'Includes batch tasting calibration booklet',
      ],
      rating: '4.9/5',
      ratingCount: 'rated by 1,800+ connoisseurs',
      iconSvg: (
        <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      gsap.set(cardElements, {
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
        rotationY: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

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
      aria-label="Section 07: The Dakshin Reserve Vault On-Scroll Card Flip"
      className="relative min-h-screen w-full bg-[#070605] py-16 flex items-center justify-center overflow-hidden border-t border-[#221c17]"
    >
      <div className="mx-auto max-w-7xl w-full px-6 md:px-12 flex flex-col justify-between min-h-[88vh] py-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#221c17] pb-4">
          <div>
            <div className="flex items-center gap-3 text-xs tracking-[0.3em] text-[#c89658] font-sans font-semibold uppercase mb-2">
              <span className="font-mono text-[#c89658]">07</span>
              <span className="h-[1px] w-8 bg-[#c89658]/60" />
              <span>THE DAKSHIN VAULT / PRIVATE ALLOCATIONS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f4eee6] font-light tracking-tight max-w-2xl">
              The Dakshin Vault. <br />
              <span className="italic text-[#e5b877] font-display font-semibold">On-Scroll Flipping Editions.</span>
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

        {/* 4 3D Flipping Cards in Grid */}
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
              {/* 3D Flipping Inner Element */}
              <div
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="flip-card-inner relative h-full w-full preserve-3d will-change-transform rounded-3xl"
              >
                {/* Front Face */}
                <div className="absolute inset-0 backface-hidden rounded-3xl bg-[#13110f] border border-[#2e2620] p-7 flex flex-col justify-between items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:border-[#c89658]/60 hover:shadow-[0_20px_50px_rgba(200,150,88,0.15)] transition-colors">
                  <div className="w-full flex justify-end">
                    <span className="h-2 w-2 rounded-full bg-[#c89658]/50" />
                  </div>

                  <div className="my-auto flex flex-col items-center justify-center">
                    {card.iconSvg}
                  </div>

                  <div className="w-full pt-4">
                    <h3 className="font-sans text-lg sm:text-xl font-bold text-[#f4eee6] tracking-tight leading-snug">
                      {card.name}
                    </h3>
                    <span className="text-[11px] font-sans text-[#8c827a] block mt-1 tracking-wider uppercase">
                      {card.origin} • {card.price}
                    </span>
                  </div>
                </div>

                {/* Back Face */}
                <div
                  className="absolute inset-0 backface-hidden rounded-3xl bg-[#14110f] border border-[#3d3128] p-7 flex flex-col justify-between text-left shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
                  style={{
                    transform: 'rotateY(180deg)',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <div>
                    <h3 className="font-sans text-lg sm:text-xl font-bold text-[#f4eee6] tracking-tight mb-1.5">
                      {card.name}
                    </h3>

                    <p className="font-sans text-xs text-[#a89d93] leading-relaxed mb-4">
                      {card.shortDesc}
                    </p>

                    <ul className="space-y-2.5 mb-4">
                      {card.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs font-sans text-[#cfc6bc] leading-tight">
                          <span className="text-[#c89658] text-sm leading-none mt-0.5">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-[#261f18] flex items-end justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-sans font-bold text-[#f4eee6]">
                        <Star className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />
                        <span>{card.rating}</span>
                      </div>
                      <span className="text-[10px] font-sans text-[#786e64] block leading-tight mt-0.5">
                        {card.ratingCount}
                      </span>
                    </div>

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
            “Roasted slowly to order in 12kg numbered Western Ghats micro-casks.”
          </span>
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#c89658]">
            Scroll Down to Flip • Scroll Up to Reset
          </span>
        </div>
      </div>
    </section>
  );
};
