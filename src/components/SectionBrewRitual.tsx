import React, { useState } from 'react';
import { Timer, Coffee, Sparkles } from 'lucide-react';
import { NOIR_BREW_METHODS } from '../data/brewing';

export const SectionBrewRitual: React.FC = () => {
  const [activeMethodId, setActiveMethodId] = useState<string>('filter-kaapi');

  const currentMethod =
    NOIR_BREW_METHODS.find((m) => m.id === activeMethodId) || NOIR_BREW_METHODS[0];

  return (
    <section
      id="section-brew-ritual"
      aria-label="Section 06: Brewing Ritual"
      className="relative min-h-screen w-full bg-[#F3ECE7] text-[#2D2926] py-16 md:py-24 px-6 md:px-12 flex items-center justify-center overflow-hidden border-t border-[#2D2926]/10"
    >
      <div className="mx-auto max-w-6xl w-full">
        {/* Section Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2D2926]/10 pb-5">
          <div>
            <div className="text-xs tracking-[0.25em] text-[#2D2926] font-sans font-bold uppercase mb-2 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#E05A7E]" />
              <span>06 / BREWING ATELIER</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#2D2926] font-bold tracking-tight">
              The daily <span className="italic text-[#E05A7E] font-medium">ritual.</span>
            </h2>
          </div>

          {/* 3 Brew Method Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/90 border border-[#2D2926]/10 shadow-sm overflow-x-auto max-w-full">
            {NOIR_BREW_METHODS.map((method) => {
              const isSelected = activeMethodId === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setActiveMethodId(method.id)}
                  className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full font-sans text-xs font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#F5DADF] text-[#2D2926] shadow-sm'
                      : 'text-[#5E5854] hover:text-[#2D2926]'
                  }`}
                >
                  {method.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Multi-Panel Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Visual Panel */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative aspect-[4/5] max-h-[48vh] w-full max-w-sm overflow-hidden rounded-3xl border border-[#2D2926]/10 shadow-[0_20px_50px_rgba(45,41,38,0.08)] bg-white group">
              {NOIR_BREW_METHODS.map((m) => (
                <img
                  key={m.id}
                  src={m.image}
                  alt={m.name}
                  className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${
                    m.id === activeMethodId ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                />
              ))}
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Tag overlay */}
              <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 rounded-full bg-[#F5DADF] px-3 py-1 text-xs font-mono text-[#2D2926] border border-[#2D2926]/10 font-bold shadow-sm">
                <Coffee className="h-3.5 w-3.5 text-[#E05A7E]" />
                <span>{currentMethod.tagline}</span>
              </div>

              {/* Bottom Specs */}
              <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between rounded-2xl bg-white/95 p-3 backdrop-blur-md border border-[#2D2926]/10 text-xs shadow-md">
                <div className="flex items-center gap-1.5 text-[#2D2926]">
                  <Timer className="h-4 w-4 text-[#E05A7E]" />
                  <span className="font-mono font-bold">{currentMethod.time}</span>
                </div>
                <span className="font-mono font-bold text-[#2D2926]">
                  {currentMethod.yieldVolume}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Brewing Specs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono tracking-widest uppercase text-[#E05A7E] font-bold block mb-1">
                  EXTRACTION RATIO: {currentMethod.ratio}
                </span>

                <h3 className="font-display text-2xl sm:text-3xl text-[#2D2926] font-bold mb-2">
                  {currentMethod.name} Ceremony
                </h3>

                <p className="font-sans text-xs sm:text-sm text-[#5E5854] leading-relaxed max-w-lg font-normal">
                  {currentMethod.description}
                </p>
              </div>

              {/* 4 Clean Specs Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-sm">
                  <span className="text-[10px] font-sans tracking-widest uppercase text-[#8C827A] block mb-0.5 font-bold">
                    Extraction Time
                  </span>
                  <span className="font-mono text-lg text-[#2D2926] font-bold">
                    {currentMethod.time}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-sm">
                  <span className="text-[10px] font-sans tracking-widest uppercase text-[#8C827A] block mb-0.5 font-bold">
                    Water Temperature
                  </span>
                  <span className="font-mono text-lg text-[#E05A7E] font-bold">
                    {currentMethod.temp}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-sm">
                  <span className="text-[10px] font-sans tracking-widest uppercase text-[#8C827A] block mb-0.5 font-bold">
                    Grind Geometry
                  </span>
                  <span className="font-display text-base text-[#2D2926] font-bold">
                    {currentMethod.grind}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-sm">
                  <span className="text-[10px] font-sans tracking-widest uppercase text-[#8C827A] block mb-0.5 font-bold">
                    Brew Ratio
                  </span>
                  <span className="font-mono text-lg text-[#2D2926] font-bold">
                    {currentMethod.ratio}
                  </span>
                </div>
              </div>

              {/* Master Roaster Pro Tip */}
              <div className="p-4 rounded-2xl bg-[#F5DADF]/60 border border-[#2D2926]/10 flex items-start gap-3 shadow-sm">
                <Sparkles className="h-4 w-4 text-[#E05A7E] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-sans tracking-widest text-[#2D2926] uppercase block mb-0.5 font-bold">
                    Master Roaster Pro Tip
                  </span>
                  <p className="font-serif italic text-xs text-[#2D2926] font-medium">
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
