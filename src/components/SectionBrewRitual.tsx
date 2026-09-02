import React, { useState } from 'react';
import { Timer, Sparkles, Coffee } from 'lucide-react';
import { NOIR_BREW_METHODS } from '../data/brewing';

export const SectionBrewRitual: React.FC = () => {
  const [activeMethodId, setActiveMethodId] = useState<string>('filter-kaapi');

  const currentMethod =
    NOIR_BREW_METHODS.find((m) => m.id === activeMethodId) || NOIR_BREW_METHODS[0];

  return (
    <section
      id="section-brew-ritual"
      className="relative min-h-screen w-full bg-[#070605] py-16 md:py-24 px-6 md:px-12 flex items-center justify-center overflow-hidden border-t border-[#221c17]"
    >
      {/* Hidden image preloader for 0-latency instant tab switching */}
      <div className="hidden" aria-hidden="true">
        {NOIR_BREW_METHODS.map((m) => (
          <img key={m.id} src={m.image} alt="preloaded" loading="eager" />
        ))}
      </div>

      <div className="mx-auto max-w-7xl w-full">
        {/* Section Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#221c17] pb-6">
          <div>
            <div className="flex items-center gap-3 text-xs tracking-[0.3em] text-[#c89658] font-sans font-semibold uppercase mb-2">
              <span className="font-mono text-[#c89658]">06</span>
              <span className="h-[1px] w-8 bg-[#c89658]/60" />
              <span>DAKSHIN ATELIER / YOUR KAAPI RITUAL</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f4eee6] font-light tracking-tight max-w-2xl">
              YOUR <span className="italic text-[#e5b877] font-display font-semibold">KAAPI RITUAL.</span>
            </h2>
          </div>

          {/* 3 Interactive Method Buttons */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#120e0b] border border-[#261f19]">
            {NOIR_BREW_METHODS.map((method) => {
              const isSelected = activeMethodId === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setActiveMethodId(method.id)}
                  onMouseEnter={() => setActiveMethodId(method.id)}
                  className={`px-3.5 sm:px-5 py-2 rounded-xl font-sans text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-[#c89658] text-[#070605] shadow-[0_0_15px_rgba(200,150,88,0.35)]'
                      : 'text-[#8c827a] hover:text-[#f4eee6]'
                  }`}
                >
                  {method.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Multi-Panel Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Guaranteed High-Res Visual Panel */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative aspect-[4/5] max-h-[46vh] sm:max-h-[50vh] w-full max-w-md overflow-hidden rounded-2xl border border-[#c89658]/40 shadow-[0_25px_80px_rgba(0,0,0,0.9)] bg-[#120e0b] group">
              {NOIR_BREW_METHODS.map((m) => (
                <img
                  key={m.id}
                  src={m.image}
                  alt={m.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop&q=85';
                  }}
                  className={`absolute inset-0 h-full w-full object-cover object-center filter brightness-90 contrast-110 transition-opacity duration-500 ${
                    m.id === activeMethodId ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                />
              ))}
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#070605]/90 via-transparent to-transparent pointer-events-none" />

              {/* Tag overlay */}
              <div className="absolute top-4 left-4 z-30 flex items-center gap-2 rounded-full bg-[#070605]/85 px-3.5 py-1 text-[11px] font-sans tracking-[0.2em] text-[#e5b877] uppercase border border-[#c89658]/30 backdrop-blur-md">
                <Coffee className="h-3.5 w-3.5 text-[#c89658]" />
                <span>{currentMethod.tagline}</span>
              </div>

              {/* Bottom Target Specs */}
              <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between rounded-xl bg-[#090705]/95 p-3 backdrop-blur-md border border-[#c89658]/25">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-[#c89658]" />
                  <span className="font-mono text-xs text-[#f4eee6] font-bold">
                    {currentMethod.time}
                  </span>
                </div>
                <span className="font-mono text-xs text-[#e5b877]">
                  {currentMethod.yieldVolume}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Brewing Specs & Telemetry */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#c89658]">
                    Method Calibration
                  </span>
                  <span className="h-[1px] w-6 bg-[#c89658]/40" />
                  <span className="text-[10px] font-sans tracking-[0.2em] text-[#8c827a] uppercase">
                    {currentMethod.ratio}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#f4eee6] font-normal mb-2.5">
                  {currentMethod.name} CEREMONY
                </h3>

                <p className="font-sans text-xs sm:text-sm text-[#b5aaa0] font-light leading-relaxed">
                  {currentMethod.description}
                </p>
              </div>

              {/* 4 Specs Telemetry Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0f0c09] border border-[#221c17] space-y-0.5">
                  <span className="text-[9px] font-sans tracking-[0.18em] uppercase text-[#8c827a] block">
                    Extraction Time
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-[#e5b877]">
                    {currentMethod.time}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0f0c09] border border-[#221c17] space-y-0.5">
                  <span className="text-[9px] font-sans tracking-[0.18em] uppercase text-[#8c827a] block">
                    Target Water Temp
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-[#f4eee6]">
                    {currentMethod.temp}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0f0c09] border border-[#221c17] space-y-0.5">
                  <span className="text-[9px] font-sans tracking-[0.18em] uppercase text-[#8c827a] block">
                    Grind Micron Setting
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-semibold text-[#e5b877]">
                    {currentMethod.grind}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0f0c09] border border-[#221c17] space-y-0.5">
                  <span className="text-[9px] font-sans tracking-[0.18em] uppercase text-[#8c827a] block">
                    Decoction Ratio
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-[#f4eee6]">
                    {currentMethod.ratio}
                  </span>
                </div>
              </div>

              {/* Pro Tip Callout */}
              <div className="p-4 rounded-xl bg-[#14100c] border border-[#c89658]/30 flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-[#c89658] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] font-sans tracking-[0.18em] text-[#8c827a] uppercase block mb-0.5">
                    Master Roaster Pro Tip
                  </span>
                  <p className="font-serif italic text-xs text-[#f4eee6]">
                    “{currentMethod.proTip}”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
