import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Shield, Sparkles, Award, RefreshCw } from 'lucide-react';
import { gsap } from '../utils/animations';
import type { ReserveBatch } from '../types';

interface SectionReserveProps {
  onSelectBatch: (batch: ReserveBatch) => void;
}

interface TiltState {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
  isHovered: boolean;
}

export const SectionReserve: React.FC<SectionReserveProps> = ({ onSelectBatch }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardGridRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>({});
  const [mobileActiveIndex, setMobileActiveIndex] = useState<number>(0);
  const [cardTilts, setCardTilts] = useState<{ [key: string]: TiltState }>({});

  const reserveBatches: ReserveBatch[] = [
    {
      id: 'batch-01',
      name: 'BABA BUDAN OBSIDIAN',
      vintage: '2026 Monsoon Harvest',
      origin: 'Chikmagalur, Karnataka',
      region: 'Mullayanagiri Hills',
      altitude: '1,900m ASL',
      varietal: 'Wild Arabica Selection',
      process: '96h Anaerobic Natural',
      notes: ['Cardamom', 'Dark Cacao', 'Jasmine'],
      allocationLeft: 14,
      totalAllocations: 85,
      roastLevel: 'Omniroast',
      price: '₹2,800',
      badge: '14 Tins Remaining',
      description: 'Single-estate sacred Baba Budan micro-lot with 96h anaerobic natural fermentation.',
    },
    {
      id: 'batch-02',
      name: 'MALABAR MONSOONED CASK',
      vintage: 'Coastal Wind Series',
      origin: 'Malabar Coast, Kerala',
      region: 'Arabian Sea Shore',
      altitude: '1,400m ASL',
      varietal: 'Super-Bold Arabica',
      process: '16-Week Sea Wind Cured',
      notes: ['Dark Chocolate', 'Toasted Oak', 'Molasses'],
      allocationLeft: 8,
      totalAllocations: 60,
      roastLevel: 'Medium-Dark Velvet',
      price: '₹2,400',
      badge: '8 Tins Remaining',
      description: 'Sun-cured beans exposed to moisture-laden Arabian Sea winds for 16 weeks.',
    },
    {
      id: 'batch-03',
      name: 'ARAKU VALLEY TRIBAL HONEY',
      vintage: 'Eastern Ghats Lot',
      origin: 'Araku Valley, Andhra Pradesh',
      region: 'Ananthagiri Ridge',
      altitude: '1,400m ASL',
      varietal: 'Bio-Dynamic Arabica',
      process: 'Pulped Golden Honey',
      notes: ['Wild Honey', 'Roasted Cashew', 'Mandarin'],
      allocationLeft: 22,
      totalAllocations: 100,
      roastLevel: 'Medium Roast',
      price: '₹2,600',
      badge: '22 Tins Remaining',
      description: 'Bio-dynamically cultivated by indigenous tribal farmers in the red loam valleys.',
    },
    {
      id: 'batch-04',
      name: 'COORG RAINFOREST PEABERRY',
      vintage: 'Kodagu Special Edition',
      origin: 'Coorg, Karnataka',
      region: 'Brahmagiri Range',
      altitude: '1,600m ASL',
      varietal: 'Peaberry Arabica',
      process: 'Slow Cast-Iron Convection',
      notes: ['Black Fig', 'Green Cardamom', 'Raw Jaggery'],
      allocationLeft: 11,
      totalAllocations: 75,
      roastLevel: 'Light-Medium',
      price: '₹2,200',
      badge: '11 Tins Remaining',
      description: 'Rare single-bean Peaberry cherries hand-harvested beneath silver oak canopies.',
    },
  ];

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates (-1 to 1)
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    const maxRotation = 12; // Degrees of 3D tilt
    setCardTilts((prev) => ({
      ...prev,
      [id]: {
        rotateX: -normY * maxRotation,
        rotateY: normX * maxRotation,
        glareX: (x / rect.width) * 100,
        glareY: (y / rect.height) * 100,
        isHovered: true,
      },
    }));
  };

  const handleMouseLeave = (id: string) => {
    setCardTilts((prev) => ({
      ...prev,
      [id]: {
        rotateX: 0,
        rotateY: 0,
        glareX: 50,
        glareY: 50,
        isHovered: false,
      },
    }));
  };

  useEffect(() => {
    const section = sectionRef.current;
    const cardElements = cardsRef.current.filter(Boolean) as HTMLDivElement[];

    if (!section || cardElements.length === 0) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: Pinned 3D one-by-one landing scroll sequence with generous holding pause
      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=220%',
            pin: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Initialize cards off-screen with 3D perspective tilt
        gsap.set(cardElements, {
          y: 75,
          opacity: 0,
          scale: 0.9,
          rotateX: 12,
        });

        // Initial slight pause as section pins
        tl.to({}, { duration: 0.15 });

        // 1. Card 01 lands (Baba Budan)
        tl.to(cardElements[0], {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 0.45,
          ease: 'power2.out',
        });
        tl.to({}, { duration: 0.18 });

        // 2. Card 02 lands (Malabar)
        tl.to(cardElements[1], {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 0.45,
          ease: 'power2.out',
        });
        tl.to({}, { duration: 0.18 });

        // 3. Card 03 lands (Araku)
        tl.to(cardElements[2], {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 0.45,
          ease: 'power2.out',
        });
        tl.to({}, { duration: 0.18 });

        // 4. Card 04 lands (Coorg - Last one)
        tl.to(cardElements[3], {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 0.45,
          ease: 'power2.out',
        });

        // 5. Generous Hold / Stop Window once all 4 cards appear so user can comfortably inspect & flip
        tl.to({}, { duration: 1.0 });
      });

      // Mobile / Tablet: Smooth staggered entrance
      mm.add('(max-width: 1023px)', () => {
        gsap.fromTo(
          cardElements,
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
            },
          }
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
      aria-label="Section 07: Private Allocations"
      className="relative min-h-screen w-full bg-[#FAF7F5] text-[#2D2926] py-16 flex items-center justify-center overflow-hidden border-t border-[#2D2926]/10"
    >
      {/* 3D Background Floating Ambient Orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-[#F5DADF]/40 to-transparent blur-3xl opacity-70 animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-gradient-to-tl from-[#E05A7E]/15 to-transparent blur-3xl opacity-70" />

      <div className="relative z-10 mx-auto max-w-6xl w-full px-6 md:px-12 flex flex-col justify-between min-h-[82vh] py-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2D2926]/10 pb-5">
          <div>
            <div className="text-xs tracking-[0.25em] text-[#2D2926] font-sans font-bold uppercase mb-2 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#E05A7E]" />
              <span>07 / PRIVATE ALLOCATIONS</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl text-[#2D2926] font-bold tracking-tight">
              The Reserve <span className="italic text-[#E05A7E] font-medium">Vault.</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#5E5854]">
            <Shield className="h-4 w-4 text-[#E05A7E]" />
            <span>Numbered 12kg Single-Ridge Micro-Lots</span>
          </div>
        </div>

        {/* Mobile Batch Tabs */}
        <div className="flex lg:hidden items-center justify-between gap-1 p-1 rounded-full bg-white/90 border border-[#2D2926]/10 my-4 overflow-x-auto shadow-sm">
          {reserveBatches.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => setMobileActiveIndex(idx)}
              className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all whitespace-nowrap ${
                mobileActiveIndex === idx
                  ? 'bg-[#F5DADF] text-[#2D2926] font-bold shadow-sm'
                  : 'text-[#5E5854]'
              }`}
            >
              0{idx + 1} {card.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* 4 3D Tilt & Flip Interactive Cards Grid */}
        <div
          ref={cardGridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-auto py-6 perspective-1500"
        >
          {reserveBatches.map((card, index) => {
            const isFlipped = !!flippedCards[card.id];
            const isVisibleOnMobile = mobileActiveIndex === index;
            const tilt = cardTilts[card.id] || { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false };

            return (
              <div
                key={card.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className={`relative h-[415px] w-full cursor-pointer preserve-3d ${
                  isVisibleOnMobile ? 'block' : 'hidden lg:block'
                }`}
                onMouseMove={(e) => handleMouseMove(e, card.id)}
                onMouseLeave={() => handleMouseLeave(card.id)}
                onClick={() => toggleFlip(card.id)}
                style={{
                  transform: tilt.isHovered && !isFlipped
                    ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(15px) scale3d(1.025, 1.025, 1.025)`
                    : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)',
                  transition: tilt.isHovered
                    ? 'transform 0.12s ease-out'
                    : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                {/* 3D Flip Inner Container */}
                <div className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                  {/* FRONT FACE: Frosted Glass Card with 3D Specular Light Sheen */}
                  <div className="flip-card-front rounded-3xl bg-white/85 border border-white/90 p-6 shadow-[0_20px_45px_rgba(45,41,38,0.06)] hover:shadow-[0_30px_60px_rgba(224,90,126,0.18)] hover:border-[#E05A7E]/50 flex flex-col justify-between backdrop-blur-2xl transition-shadow duration-300 overflow-hidden">
                    {/* Dynamic 3D Interactive Specular Glare */}
                    {tilt.isHovered && (
                      <div
                        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.6) 0%, rgba(245, 218, 223, 0.2) 35%, transparent 70%)`,
                        }}
                      />
                    )}

                    {/* Ambient Glass Gradients */}
                    <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br from-white/80 to-transparent blur-xl" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-[#F5DADF]/15" />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between text-xs text-[#8C827A] mb-3">
                        <span className="font-mono font-bold text-[#2D2926]">BATCH 0{index + 1}</span>
                        <span className="text-[10px] text-[#2D2926] bg-[#F5DADF] border border-[#2D2926]/10 px-2.5 py-0.5 rounded-full font-bold uppercase shadow-sm">
                          {card.badge}
                        </span>
                      </div>

                      <span className="text-[10px] font-sans tracking-widest text-[#E05A7E] uppercase font-bold block mb-1">
                        {card.origin}
                      </span>

                      <h3 className="font-display text-xl sm:text-2xl text-[#2D2926] font-bold mb-2 leading-snug">
                        {card.name}
                      </h3>

                      <p className="font-sans text-xs text-[#E05A7E] font-bold mb-3">
                        {card.notes.join(' · ')}
                      </p>

                      <p className="font-sans text-xs text-[#5E5854] leading-relaxed mb-4 font-normal">
                        {card.description}
                      </p>
                    </div>

                    <div className="relative z-10 pt-4 border-t border-[#2D2926]/10 flex items-center justify-between">
                      <span className="font-display text-2xl text-[#2D2926] font-bold">
                        {card.price}
                      </span>

                      <div className="flex items-center gap-1.5 text-xs text-[#2D2926] font-mono font-bold bg-[#FAF7F5] border border-[#2D2926]/10 px-3 py-1.5 rounded-full shadow-sm">
                        <span>Specs</span>
                        <RefreshCw className="h-3 w-3 text-[#E05A7E]" />
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE: Frosted Espresso Luxury Passport Card */}
                  <div className="flip-card-back rounded-3xl bg-[#1F1C1A]/94 border border-white/20 p-6 shadow-2xl flex flex-col justify-between backdrop-blur-2xl text-left text-white overflow-hidden">
                    {/* Subtle Dark Glass Sheen */}
                    <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br from-[#E05A7E]/20 to-transparent blur-xl" />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                        <span className="text-[10px] font-mono text-[#F5DADF] font-bold uppercase tracking-wider">
                          ALLOCATION PASSPORT
                        </span>
                        <Award className="h-4 w-4 text-[#F5DADF]" />
                      </div>

                      <div className="space-y-2.5 text-xs text-[#FAF7F5]/85">
                        <div>
                          <span className="text-[10px] text-[#FAF7F5]/50 block uppercase font-mono">Varietal</span>
                          <span className="font-semibold text-white">{card.varietal}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#FAF7F5]/50 block uppercase font-mono">Process</span>
                          <span className="font-semibold text-white">{card.process}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#FAF7F5]/50 block uppercase font-mono">Altitude</span>
                          <span className="font-mono font-bold text-[#F5DADF]">{card.altitude}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#FAF7F5]/50 block uppercase font-mono">Vintage</span>
                          <span className="font-semibold text-white">{card.vintage}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBatch(card);
                      }}
                      className="relative z-10 w-full py-2.5 rounded-full bg-[#F5DADF] text-[#2D2926] font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:bg-white hover:scale-105 transition-all cursor-pointer"
                    >
                      <span>Request Allocation</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Marker */}
        <div className="flex items-center justify-between border-t border-[#2D2926]/10 pt-3 text-xs text-[#8C827A]">
          <span>Single-Ridge Micro-Lots • Nitrogen Sealed In Chikmagalur</span>
          <span className="font-mono text-[#2D2926] font-bold">STRICTLY NUMBERED RELEASES</span>
        </div>
      </div>
    </section>
  );
};
