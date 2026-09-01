import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Shield, ArrowRight, RotateCw, CheckCircle2, Award } from 'lucide-react';
import { gsap } from '../utils/animations';
import type { ReserveBatch } from '../types';

interface SectionReserveProps {
  onSelectBatch: (batch: ReserveBatch) => void;
}

export const SectionReserve: React.FC<SectionReserveProps> = ({ onSelectBatch }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);

  // State to track individual card flip (3D rotateY 180deg)
  const [flippedCards, setFlippedCards] = useState<{ [id: string]: boolean }>({});

  const toggleFlip = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const batches: (ReserveBatch & {
    certNo: string;
    scores: { label: string; score: string; percent: number }[];
    harvestDetails: { label: string; val: string }[];
  })[] = [
    {
      id: 'batch-01',
      name: 'OBSIDIAN GEISHA 2,400M',
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
      description: 'Grown on the highest volcanic crests of Bench Maji. Fermented in sealed stainless tanks under controlled temperature before slow raised-bed drying for 32 days.',
      certNo: 'NOIR-2026-ETH-085',
      scores: [
        { label: 'Floral Aroma & Jasmine', score: '9.8', percent: 98 },
        { label: 'Crystalline Acidity', score: '9.7', percent: 97 },
        { label: 'Dark Cacao Viscosity', score: '9.6', percent: 96 },
        { label: 'Sweet Clean Finish', score: '9.9', percent: 99 },
      ],
      harvestDetails: [
        { label: 'Fermentation', val: '96h Sealed Tank' },
        { label: 'Moisture Content', val: '10.2%' },
        { label: 'Drying Time', val: '32 Days Beds' },
        { label: 'Lot Selection', val: 'Top 4% Harvest' },
      ],
    },
    {
      id: 'batch-02',
      name: 'CASK BOURBON RESERVE',
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
      description: 'Raw green beans rested in freshly dumped 12-year Kentucky Bourbon barrels for 90 days, absorbing deep whiskey esters before precision drum roasting.',
      certNo: 'NOIR-2026-GTM-060',
      scores: [
        { label: 'Bourbon Wood Esters', score: '9.9', percent: 99 },
        { label: 'Molasses Sweetness', score: '9.7', percent: 97 },
        { label: 'Full Velvet Body', score: '9.8', percent: 98 },
        { label: 'Charred Oak Finish', score: '9.6', percent: 96 },
      ],
      harvestDetails: [
        { label: 'Cask Ageing', val: '90 Days Oak' },
        { label: 'Barrel Vintage', val: '12-Yr Bourbon' },
        { label: 'Drum Flame', val: 'Slow Convection' },
        { label: 'Tin Allocation', val: 'No. 08 of 60' },
      ],
    },
    {
      id: 'batch-03',
      name: 'MIDNIGHT VOLCANO',
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
      description: 'Dense shade-grown volcanic cherries processed via traditional wet-hulling with triple hand-sorting to eliminate every minor defect.',
      certNo: 'NOIR-2026-SUM-100',
      scores: [
        { label: 'Earth & Cedar Intensity', score: '9.7', percent: 97 },
        { label: 'Smoked Truffle Body', score: '9.9', percent: 99 },
        { label: 'Low Wine Acidity', score: '9.4', percent: 94 },
        { label: 'Lingering Dark Finish', score: '9.8', percent: 98 },
      ],
      harvestDetails: [
        { label: 'Hulling Method', val: 'Wet-Hulled Basah' },
        { label: 'Sorting Standard', val: 'Triple Hand-Pick' },
        { label: 'Defect Rate', val: '0.0% Grade 1' },
        { label: 'Roast Drop Temp', val: '221°C Dark' },
      ],
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const cardContainer = cardContainerRef.current;

    if (!section || !cardContainer) return;

    const cards = cardContainer.querySelectorAll('.flip-card-inner');

    const ctx = gsap.context(() => {
      // 3D Perspective Flip on Scroll Sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // 3D Staggered Roll & Flip Entrance
      tl.fromTo(
        cards,
        {
          transform: 'perspective(1200px) rotateY(-75deg) rotateX(15deg) translateZ(-80px)',
          opacity: 0,
          scale: 0.88,
        },
        {
          transform: 'perspective(1200px) rotateY(0deg) rotateX(0deg) translateZ(0px)',
          opacity: 1,
          scale: 1,
          stagger: 0.15,
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
      className="relative min-h-screen w-full bg-[#070605] py-16 md:py-24 px-6 md:px-12 flex items-center justify-center overflow-hidden border-t border-[#221c17]"
    >
      <div className="mx-auto max-w-7xl w-full">
        {/* Section Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#221c17] pb-6">
          <div>
            <div className="flex items-center gap-3 text-xs tracking-[0.3em] text-[#c89658] font-sans font-semibold uppercase mb-2">
              <span className="font-mono text-[#c89658]">07</span>
              <span className="h-[1px] w-8 bg-[#c89658]/60" />
              <span>THE VAULT / PRIVATE ALLOCATIONS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f4eee6] font-light tracking-tight max-w-2xl">
              The Reserve Vault. <br />
              <span className="italic text-[#e5b877]">Numbered Micro-Batches.</span>
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
              Scroll / Click to Flip Cards
            </span>
          </div>
        </div>

        {/* 3 Interactive 3D Flipping Cards Grid */}
        <div
          ref={cardContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1500"
        >
          {batches.map((batch) => {
            const isFlipped = !!flippedCards[batch.id];
            const allocationPercent = Math.round(
              ((batch.totalAllocations - batch.allocationLeft) / batch.totalAllocations) * 100
            );

            return (
              <div
                key={batch.id}
                className="relative h-[530px] w-full perspective-1200 select-none group"
                onClick={() => toggleFlip(batch.id)}
              >
                {/* 3D Flipping Inner Wrapper */}
                <div
                  className="flip-card-inner relative h-full w-full preserve-3d transition-transform duration-700 ease-out cursor-pointer"
                  style={{
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* ================= FRONT FACE: Allocation Details ================= */}
                  <div className="absolute inset-0 backface-hidden rounded-2xl bg-[#0f0c09]/95 border border-[#c89658]/30 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between transition-all duration-300 group-hover:border-[#c89658] group-hover:shadow-[0_15px_40px_rgba(200,150,88,0.2)]">
                    <div>
                      {/* Top Badge, Price & Flip Button */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c89658]/15 px-3 py-0.5 text-[9px] font-sans tracking-[0.2em] text-[#e5b877] uppercase border border-[#c89658]/30">
                          <Sparkles className="h-3 w-3 text-[#c89658]" />
                          {batch.badge}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-[#f4eee6]">
                            {batch.price}
                          </span>
                          <button
                            onClick={(e) => toggleFlip(batch.id, e)}
                            className="p-1.5 rounded-lg bg-[#1a140f] border border-[#382d24] text-[#c89658] hover:text-[#f4eee6] hover:border-[#c89658] transition-colors"
                            title="Flip to Certificate"
                            aria-label="Flip to Certificate"
                          >
                            <RotateCw className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Batch Title */}
                      <h3 className="font-serif text-xl sm:text-2xl text-[#f4eee6] font-normal tracking-wide mb-1.5 group-hover:text-[#e5b877] transition-colors">
                        {batch.name}
                      </h3>

                      <span className="text-[10px] font-sans tracking-[0.25em] text-[#c89658] uppercase block mb-3">
                        {batch.origin} • {batch.altitude}
                      </span>

                      <p className="font-sans text-xs text-[#b0a59b] font-light leading-relaxed mb-4">
                        {batch.description}
                      </p>

                      {/* Flavor Chips */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {batch.notes.map((note) => (
                          <span
                            key={note}
                            className="rounded-lg bg-[#18130f] px-2 py-0.5 text-[10px] font-sans text-[#cfc5ba] border border-[#2b221a]"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Allocation Bar & Action Button */}
                    <div className="pt-3 border-t border-[#221c17] space-y-3">
                      {/* Allocation Counter Bar */}
                      <div>
                        <div className="flex justify-between text-[10px] font-sans uppercase tracking-[0.15em] text-[#8c827a] mb-1">
                          <span>Allocation Reserved</span>
                          <span className="font-mono text-[#e5b877]">{allocationPercent}% Claimed</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#1c1612] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#c89658] to-[#e5b877] rounded-full"
                            style={{ width: `${allocationPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Request Allocation CTA + Flip Hint */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectBatch(batch);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#c89658] bg-[#c89658] py-2.5 text-xs font-sans font-bold tracking-[0.2em] text-[#070605] uppercase transition-all duration-300 hover:bg-[#e5b877] hover:shadow-[0_0_20px_rgba(200,150,88,0.4)] cursor-pointer"
                        >
                          <span>Request Allocation</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => toggleFlip(batch.id, e)}
                          className="px-3 py-2.5 rounded-xl border border-[#2e241c] bg-[#14100c] text-[10px] font-sans tracking-[0.15em] text-[#8c827a] uppercase hover:text-[#e5b877] hover:border-[#c89658]/40 transition-colors shrink-0"
                        >
                          Certificate ↻
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ================= BACK FACE: Vault Certificate & Sommelier Cupping ================= */}
                  <div
                    className="absolute inset-0 backface-hidden rounded-2xl bg-[#0c0907] border border-[#e5b877]/40 p-6 backdrop-blur-2xl shadow-2xl flex flex-col justify-between"
                    style={{ transform: 'rotateY(180deg)' }}
                  >
                    <div>
                      {/* Certificate Header */}
                      <div className="flex items-center justify-between border-b border-[#261f18] pb-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-[#e5b877]" />
                          <span className="font-mono text-[10px] tracking-[0.25em] text-[#e5b877] uppercase font-bold">
                            VAULT CERTIFICATE
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-[#8c827a]">
                          {batch.certNo}
                        </span>
                      </div>

                      {/* Micro-Lot Terroir Specs Matrix */}
                      <div className="grid grid-cols-2 gap-2 mb-3 bg-[#140f0c] p-2.5 rounded-xl border border-[#2b2118]">
                        {batch.harvestDetails.map((hd) => (
                          <div key={hd.label}>
                            <span className="text-[8px] font-sans tracking-[0.18em] text-[#8c827a] uppercase block">
                              {hd.label}
                            </span>
                            <span className="font-mono text-[11px] font-bold text-[#f4eee6]">
                              {hd.val}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* 4 Sommelier Cupping Radar Bars */}
                      <div className="space-y-2 mb-3">
                        <span className="text-[9px] font-sans tracking-[0.2em] text-[#c89658] uppercase block">
                          Sommelier Cupping Telemetry
                        </span>
                        {batch.scores.map((sc) => (
                          <div key={sc.label}>
                            <div className="flex justify-between text-[9px] font-sans text-[#a89d93] mb-0.5">
                              <span>{sc.label}</span>
                              <span className="font-mono font-bold text-[#e5b877]">{sc.score} / 10</span>
                            </div>
                            <div className="h-1 w-full bg-[#1c1510] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#c89658] to-[#e5b877] rounded-full"
                                style={{ width: `${sc.percent}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Master Roaster Signature & Action */}
                    <div className="pt-3 border-t border-[#261f18] space-y-3">
                      <div className="flex items-center justify-between text-[9px] font-sans text-[#8c827a]">
                        <span className="flex items-center gap-1 text-[#e5b877]">
                          <CheckCircle2 className="h-3 w-3" />
                          Authenticated Kyoto Atelier
                        </span>
                        <span className="font-mono text-[#a89d93]">Roast Master #04</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectBatch(batch);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#c89658] bg-[#c89658] py-2.5 text-xs font-sans font-bold tracking-[0.2em] text-[#070605] uppercase transition-all duration-300 hover:bg-[#e5b877] hover:shadow-[0_0_20px_rgba(200,150,88,0.4)] cursor-pointer"
                        >
                          <span>Claim Allocation</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => toggleFlip(batch.id, e)}
                          className="px-3 py-2.5 rounded-xl border border-[#2e241c] bg-[#14100c] text-[10px] font-sans tracking-[0.15em] text-[#e5b877] uppercase hover:border-[#c89658] transition-colors shrink-0"
                        >
                          Overview ↻
                        </button>
                      </div>
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
