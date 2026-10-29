import React, { useEffect, useRef, useState } from 'react';
import { Mountain, Sun, Layers, Compass, Wind, Sparkles } from 'lucide-react';
import { gsap } from '../utils/animations';

export const SectionBean: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const storyHeadlineRef = useRef<HTMLDivElement | null>(null);
  const specsCardRef = useRef<HTMLDivElement | null>(null);

  const [activeTab, setActiveTab] = useState<'altitude' | 'soil' | 'harvest'>('altitude');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const TABS: ('altitude' | 'soil' | 'harvest')[] = ['altitude', 'soil', 'harvest'];

  // Start 1-second auto cycle ONLY when properly landed on this section
  const startAutoCycle = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setActiveTab('altitude');

    timerRef.current = setInterval(() => {
      setActiveTab((prev) => {
        const nextIdx = (TABS.indexOf(prev) + 1) % TABS.length;
        return TABS[nextIdx];
      });
    }, 1000);
  };

  // Stop auto cycle and lock back to Tab 1 (altitude) until next proper landing
  const stopAutoCycle = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setActiveTab('altitude');
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleTabClick = (tab: 'altitude' | 'soil' | 'harvest') => {
    setActiveTab(tab);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setActiveTab((prev) => {
          const nextIdx = (TABS.indexOf(prev) + 1) % TABS.length;
          return TABS[nextIdx];
        });
      }, 1000);
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const storyHeadline = storyHeadlineRef.current;
    const specsCard = specsCardRef.current;

    if (!section || !image || !storyHeadline || !specsCard) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: triggers landing ONLY when section pins at top of viewport
      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=100%',
            pin: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => startAutoCycle(),
            onEnterBack: () => startAutoCycle(),
            onLeave: () => stopAutoCycle(),
            onLeaveBack: () => stopAutoCycle(),
          },
        });

        // Landing Settle Hold
        tl.to({}, { duration: 0.25 });

        tl.fromTo(
          image,
          { scale: 1.05, opacity: 0.85 },
          { scale: 1.18, opacity: 0.95, ease: 'none', duration: 1.2 },
          0.25
        )
          .fromTo(
            storyHeadline,
            { y: 35, opacity: 0 },
            { y: 0, opacity: 1, ease: 'power3.out', duration: 0.8 },
            0.3
          )
          .fromTo(
            specsCard,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, ease: 'power3.out', duration: 0.7 },
            0.5
          );
      });

      // Mobile: triggers landing only when section is centered and landed on screen
      mm.add('(max-width: 1023px)', () => {
        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 15%',
            end: 'bottom 15%',
            onEnter: () => startAutoCycle(),
            onEnterBack: () => startAutoCycle(),
            onLeave: () => stopAutoCycle(),
            onLeaveBack: () => stopAutoCycle(),
          },
        });

        mobileTl
          .fromTo(
            storyHeadline,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
          )
          .fromTo(
            specsCard,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
            '-=0.3'
          );
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const specs = {
    altitude: {
      title: '1,900 Metres Above Sea Level',
      desc: 'High in the mist-veiled Western Ghats, extreme diurnal temperature drops force shade cherries to mature over 230 unhurried days—locking in dense sugars and wild cardamom aromatics.',
      detail: 'Diurnal Range: 14°C – 28°C • Slow Ripening',
    },
    soil: {
      title: 'Biodiversity Forest Loam',
      desc: 'Deep volcanic humus roots nourished beneath a living canopy of silver oak, black pepper vines, and wild cardamom pods, giving our coffee its rounded body and velvety mouthfeel.',
      detail: '100% Native Forest Shade • Micro-Organisms',
    },
    harvest: {
      title: 'Generational Hand-Selective Plucking',
      desc: 'Estate pickers harvest exclusively crimson cherries at peak 22° Brix sugar maturity, naturally sun-dried on raised teakwood beds to preserve fruit esters.',
      detail: 'Single-Pass Crimson Harvest • Brix 22°',
    },
  };

  const currentSpec = specs[activeTab];

  return (
    <section
      id="section-bean"
      ref={sectionRef}
      aria-label="Section 01: The Story & Terroir"
      className="relative min-h-screen w-full bg-[#FAF7F5] text-[#2D2926] flex items-center justify-center overflow-visible lg:overflow-hidden py-12 sm:py-16 lg:py-0 border-t border-[#2D2926]/10"
    >
      {/* Background Soft Coffee Plantation Mist Visual */}
      <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={imageRef}
          src="/assets/origin-farm-mist.jpg"
          alt="Coffee plantation in Chikmagalur Western Ghats"
          className="h-full w-full object-cover object-center will-change-transform opacity-25 filter brightness-105 contrast-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F5] via-[#FAF7F5]/75 to-[#FAF7F5]" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 mx-auto max-w-6xl w-full px-5 sm:px-8 md:px-12 flex flex-col justify-between min-h-[70vh] lg:min-h-[76vh] py-4 sm:py-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#2D2926]/10 pb-3 gap-2">
          <div className="text-[11px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#2D2926] font-sans font-bold uppercase flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Sparkles className="h-3.5 w-3.5 text-[#E05A7E] shrink-0" />
            <span>01 / ORIGIN & TERROIR</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-[#8C827A] truncate">
            <Compass className="h-3.5 w-3.5 text-[#2D2926] shrink-0" />
            <span className="truncate">
              <span className="hidden sm:inline">13°19'N, 75°46'E • </span>BABA BUDAN GIRI
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center my-auto py-6">
          {/* Left Column: Big Dominant Headline & Supporting Text */}
          <div ref={storyHeadlineRef} className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs tracking-[0.3em] font-sans uppercase text-[#E05A7E] font-bold mb-3">
              WESTERN GHATS • CHIKMAGALUR
            </span>

            {/* Headline */}
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-[#2D2926] leading-[1.08] tracking-tight mb-4">
              Every bean has a story worth <span className="italic text-[#E05A7E] font-medium">slowing down for.</span>
            </h2>

            {/* Supporting Description */}
            <p className="font-sans text-sm sm:text-base text-[#5E5854] font-normal leading-relaxed max-w-lg">
              Shade-grown under native canopies in Chikmagalur since 1670. High altitude, rich forest soil, and unhurried time create coffee of rare balance and velvety sweetness.
            </p>
          </div>

          {/* Right Column: Agronomy Specs Card */}
          <div ref={specsCardRef} className="lg:col-span-6">
            <div className="rounded-3xl bg-white border border-[#2D2926]/10 p-5 sm:p-8 shadow-[0_20px_50px_rgba(45,41,38,0.06)] backdrop-blur-xl">
              {/* Segmented Tab Buttons */}
              <div
                role="tablist"
                aria-label="Origin Factors"
                className="flex items-center gap-1 mb-5 p-1 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 w-full sm:w-fit overflow-x-auto scrollbar-none"
              >
                <button
                  role="tab"
                  aria-selected={activeTab === 'altitude'}
                  onClick={() => handleTabClick('altitude')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    activeTab === 'altitude'
                      ? 'bg-[#F5DADF] text-[#2D2926] font-bold shadow-sm scale-[1.02]'
                      : 'text-[#5E5854] hover:text-[#2D2926]'
                  }`}
                >
                  <Mountain className="h-3 w-3" />
                  <span>Altitude</span>
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'soil'}
                  onClick={() => handleTabClick('soil')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    activeTab === 'soil'
                      ? 'bg-[#F5DADF] text-[#2D2926] font-bold shadow-sm scale-[1.02]'
                      : 'text-[#5E5854] hover:text-[#2D2926]'
                  }`}
                >
                  <Layers className="h-3 w-3" />
                  <span>Forest Soil</span>
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'harvest'}
                  onClick={() => handleTabClick('harvest')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    activeTab === 'harvest'
                      ? 'bg-[#F5DADF] text-[#2D2926] font-bold shadow-sm scale-[1.02]'
                      : 'text-[#5E5854] hover:text-[#2D2926]'
                  }`}
                >
                  <Sun className="h-3 w-3" />
                  <span>Harvest</span>
                </button>
              </div>

              {/* Tab Content */}
              <div key={activeTab} className="transition-all duration-150">
                <h3 className="font-display text-xl sm:text-2xl text-[#2D2926] mb-2 font-bold">
                  {currentSpec.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-[#5E5854] leading-relaxed mb-5 font-normal">
                  {currentSpec.desc}
                </p>

                <div className="pt-3 border-t border-[#2D2926]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-[#8C827A]">
                  <span className="text-[11px] sm:text-xs leading-snug">{currentSpec.detail}</span>
                  <span className="font-sans text-[#2D2926] font-bold flex items-center gap-1 shrink-0 text-[11px] sm:text-xs">
                    <Wind className="h-3 w-3 text-[#E05A7E]" /> 100% Shade-Grown
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Marker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#2D2926]/10 pt-3 gap-1.5 text-xs text-[#8C827A]">
          <span className="italic text-[#5E5854] text-[11px] sm:text-xs leading-snug">“Seven sacred seeds began India's greatest coffee lineage.”</span>
          <span className="font-mono text-[#2D2926] font-bold text-[10px] sm:text-xs self-end sm:self-auto shrink-0">1,900M ASL ELEVATION</span>
        </div>
      </div>
    </section>
  );
};
