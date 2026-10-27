import React, { useState, useEffect, useRef } from 'react';
import { Coffee, Sparkles, Droplet } from 'lucide-react';
import { gsap, ScrollTrigger } from '../utils/animations';
import { NOIR_BREW_METHODS } from '../data/brewing';

export const SectionBrewRitual: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeMethodIndex, setActiveMethodIndex] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentMethod =
    NOIR_BREW_METHODS[activeMethodIndex] || NOIR_BREW_METHODS[0];
  const activeMethodId = currentMethod.id;

  // Start 1-second auto cycle ONLY when properly landed on this section
  const startAutoCycle = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setActiveMethodIndex(0);

    timerRef.current = setInterval(() => {
      setActiveMethodIndex((prev) => (prev + 1) % NOIR_BREW_METHODS.length);
    }, 1000);
  };

  // Stop auto cycle and lock back to Method 1 (0) until next proper landing
  const stopAutoCycle = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setActiveMethodIndex(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleMethodClick = (index: number) => {
    setActiveMethodIndex(index);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setActiveMethodIndex((prev) => (prev + 1) % NOIR_BREW_METHODS.length);
      }, 1000);
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 20%',
        end: 'bottom 20%',
        onEnter: () => startAutoCycle(),
        onEnterBack: () => startAutoCycle(),
        onLeave: () => stopAutoCycle(),
        onLeaveBack: () => stopAutoCycle(),
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="section-brew-ritual"
      ref={sectionRef}
      aria-label="Section 06: Brewing Ritual"
      className="relative min-h-screen w-full bg-[#F3ECE7] text-[#2D2926] py-8 sm:py-12 lg:py-10 px-4 sm:px-8 md:px-12 flex items-center justify-center overflow-hidden border-t border-[#2D2926]/10"
    >
      <div className="mx-auto max-w-6xl w-full">
        {/* Section Header */}
        <div className="mb-4 sm:mb-6 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 border-b border-[#2D2926]/10 pb-3 sm:pb-4">
          <div>
            <div className="text-[11px] sm:text-xs tracking-[0.25em] text-[#2D2926] font-sans font-bold uppercase mb-1.5 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#E05A7E]" />
              <span>06 / BREWING GUIDE</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#2D2926] font-bold tracking-tight">
              The daily <span className="italic text-[#E05A7E] font-medium">ritual.</span>
            </h2>
          </div>

          {/* 5 Brew Method Selector Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl sm:rounded-full bg-white/95 border border-[#2D2926]/10 shadow-sm w-full md:w-auto overflow-hidden">
            {NOIR_BREW_METHODS.map((method, idx) => {
              const isSelected = activeMethodIndex === idx;
              const cleanLabel =
                method.id === 'filter-kaapi'
                  ? 'Filter Kaapi'
                  : method.id === 'pourover'
                  ? 'Pour Over'
                  : method.id === 'espresso'
                  ? 'Espresso'
                  : method.id === 'aeropress'
                  ? 'AeroPress'
                  : 'Cold Brew';

              return (
                <button
                  key={method.id}
                  onClick={() => handleMethodClick(idx)}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-full font-sans text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#F5DADF] border border-[#2D2926]/15 text-[#2D2926] shadow-sm scale-[1.02]'
                      : 'text-[#5E5854] hover:text-[#2D2926] hover:bg-neutral-50'
                  }`}
                >
                  <span>{cleanLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Multi-Panel Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left Column: Visual Panel */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative aspect-[4/5] max-h-[38vh] sm:max-h-[44vh] w-full max-w-xs sm:max-w-sm overflow-hidden rounded-2xl sm:rounded-3xl border border-[#2D2926]/10 shadow-[0_20px_50px_rgba(45,41,38,0.08)] bg-white group">
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
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 flex items-center gap-1.5 rounded-full bg-[#F5DADF] px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-mono text-[#2D2926] border border-[#2D2926]/10 font-bold shadow-sm">
                <Coffee className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#E05A7E]" />
                <span className="truncate max-w-[220px]">{currentMethod.tagline}</span>
              </div>

              {/* Bottom Specs */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-30 flex items-center justify-between rounded-xl sm:rounded-2xl bg-white/95 p-2.5 sm:p-3 backdrop-blur-md border border-[#2D2926]/10 text-xs shadow-md">
                <div className="flex items-center gap-1.5 text-[#2D2926]">
                  <Droplet className="h-3.5 w-3.5 text-[#E05A7E]" />
                  <span className="font-mono font-bold text-[11px] sm:text-xs">{currentMethod.time}</span>
                </div>
                <span className="font-mono font-bold text-[#2D2926] text-[11px] sm:text-xs">
                  {currentMethod.yieldVolume}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Brewing Specs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-[#E05A7E] font-bold block mb-0.5">
                  EXTRACTION RATIO: {currentMethod.ratio}
                </span>

                <h3 className="font-display text-xl sm:text-2xl lg:text-3xl text-[#2D2926] font-bold mb-1 sm:mb-1.5">
                  {currentMethod.name} Ceremony
                </h3>

                <p className="font-sans text-xs sm:text-sm text-[#5E5854] leading-relaxed max-w-lg font-normal line-clamp-2 sm:line-clamp-none">
                  {currentMethod.description}
                </p>
              </div>

              {/* 4 Clean Specs Cards */}
              <div key={activeMethodId} className="grid grid-cols-2 gap-2 sm:gap-2.5 transition-all duration-150">
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-[#2D2926]/10 shadow-sm">
                  <span className="text-[9px] sm:text-[10px] font-sans tracking-widest uppercase text-[#8C827A] block mb-0.5 font-bold">
                    Ideal Infusion
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-[#2D2926]">
                    {currentMethod.time}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-[#2D2926]/10 shadow-sm">
                  <span className="text-[9px] sm:text-[10px] font-sans tracking-widest uppercase text-[#8C827A] block mb-0.5 font-bold">
                    Water Temperature
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-[#E05A7E]">
                    {currentMethod.temp}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-[#2D2926]/10 shadow-sm">
                  <span className="text-[9px] sm:text-[10px] font-sans tracking-widest uppercase text-[#8C827A] block mb-0.5 font-bold">
                    Grind Geometry
                  </span>
                  <span className="font-display text-xs sm:text-sm font-bold text-[#2D2926] truncate block">
                    {currentMethod.grind}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-[#2D2926]/10 shadow-sm">
                  <span className="text-[9px] sm:text-[10px] font-sans tracking-widest uppercase text-[#8C827A] block mb-0.5 font-bold">
                    Brew Ratio
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-[#2D2926]">
                    {currentMethod.ratio}
                  </span>
                </div>
              </div>

              {/* Master Roaster Pro Tip */}
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#F5DADF]/60 border border-[#2D2926]/10 flex items-start gap-2.5 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#E05A7E] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] sm:text-[10px] font-sans tracking-widest text-[#2D2926] uppercase block mb-0.5 font-bold">
                    Master Roaster Pro Tip
                  </span>
                  <p className="font-serif italic text-xs text-[#2D2926] font-medium leading-snug">
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
