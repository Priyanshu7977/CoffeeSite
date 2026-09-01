import React, { useEffect, useRef } from 'react';
import { Sparkles, Shield, ArrowRight } from 'lucide-react';
import { gsap } from '../utils/animations';
import type { ReserveBatch } from '../types';

interface SectionReserveProps {
  onSelectBatch: (batch: ReserveBatch) => void;
}

export const SectionReserve: React.FC<SectionReserveProps> = ({ onSelectBatch }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);

  const batches: ReserveBatch[] = [
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
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const cardContainer = cardContainerRef.current;

    if (!section || !cardContainer) return;

    const cards = cardContainer.querySelectorAll('.reserve-card');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'bottom 25%',
        scrub: 0.8,
      },
    });

    tl.fromTo(
      cards,
      { y: 60, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.12, ease: 'power3.out' }
    );

    return () => {
      tl.kill();
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

          <div className="flex items-center gap-2 font-sans text-xs tracking-[0.2em] text-[#8c827a] uppercase">
            <Shield className="h-4 w-4 text-[#c89658]" />
            <span>Roasted to order in 12kg numbered tins</span>
          </div>
        </div>

        {/* 3 Interactive Batch Allocation Cards */}
        <div
          ref={cardContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {batches.map((batch) => {
            const allocationPercent = Math.round(
              ((batch.totalAllocations - batch.allocationLeft) / batch.totalAllocations) * 100
            );

            return (
              <div
                key={batch.id}
                className="reserve-card group relative flex flex-col justify-between rounded-2xl bg-[#0f0c09]/90 border border-[#c89658]/25 p-6 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-[#c89658] hover:shadow-[0_15px_40px_rgba(200,150,88,0.15)] hover:-translate-y-1"
              >
                <div>
                  {/* Top Badge & Price */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c89658]/15 px-3 py-0.5 text-[9px] font-sans tracking-[0.2em] text-[#e5b877] uppercase border border-[#c89658]/30">
                      <Sparkles className="h-3 w-3 text-[#c89658]" />
                      {batch.badge}
                    </span>
                    <span className="font-mono text-base font-bold text-[#f4eee6]">
                      {batch.price}
                    </span>
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
                  <div className="flex flex-wrap gap-1 mb-5">
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
                <div className="pt-4 border-t border-[#221c17] space-y-3">
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

                  {/* Request Allocation CTA */}
                  <button
                    onClick={() => onSelectBatch(batch)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#c89658]/60 bg-[#c89658]/10 py-2.5 text-xs font-sans font-bold tracking-[0.2em] text-[#f4eee6] uppercase transition-all duration-300 hover:bg-[#c89658] hover:text-[#070605] hover:shadow-[0_0_20px_rgba(200,150,88,0.4)] cursor-pointer"
                  >
                    <span>Request Allocation</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
