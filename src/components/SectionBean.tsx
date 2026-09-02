import React, { useEffect, useRef, useState } from 'react';
import { Mountain, Sun, Layers, Compass } from 'lucide-react';
import { gsap } from '../utils/animations';

export const SectionBean: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const storyHeadlineRef = useRef<HTMLDivElement | null>(null);
  const pillarsRef = useRef<HTMLDivElement | null>(null);
  const specsCardRef = useRef<HTMLDivElement | null>(null);

  const [activeTab, setActiveTab] = useState<'altitude' | 'soil' | 'harvest'>('altitude');

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const storyHeadline = storyHeadlineRef.current;
    const pillars = pillarsRef.current;
    const specsCard = specsCardRef.current;

    if (!section || !image || !storyHeadline || !pillars || !specsCard) return;

    const ctx = gsap.context(() => {
      const storyWords = storyHeadline.querySelectorAll('.word-reveal');
      const pillarWords = pillars.querySelectorAll('.pillar-item');

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=140%',
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          image,
          { scale: 1.05, filter: 'brightness(0.5) contrast(110%)' },
          { scale: 1.2, filter: 'brightness(0.85) contrast(115%)', ease: 'none', duration: 1.5 },
          0
        )
          .fromTo(
            storyWords,
            { y: 40, opacity: 0, scale: 0.92 },
            { y: 0, opacity: 1, scale: 1, stagger: 0.08, ease: 'power3.out', duration: 0.8 },
            0.1
          )
          .fromTo(
            pillarWords,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, ease: 'power2.out', duration: 0.8 },
            0.4
          )
          .fromTo(
            specsCard,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, ease: 'power3.out', duration: 0.8 },
            0.5
          );
      });

      mm.add('(max-width: 1023px)', () => {
        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
          },
        });

        mobileTl
          .fromTo(
            image,
            { scale: 1.15, opacity: 0.3 },
            { scale: 1.0, opacity: 0.6, duration: 1.0, ease: 'power2.out' }
          )
          .fromTo(
            storyWords,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: 'power3.out' },
            '-=0.7'
          )
          .fromTo(
            pillarWords,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out' },
            '-=0.4'
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
      title: '1,900 Metres Above Sea',
      tag: 'Baba Budan Giri & Western Ghats',
      metric: '1,900m ASL',
      desc: 'High in the mist-veiled Western Ghats of Chikmagalur, Karnataka, extreme diurnal cooling forces shade-grown coffee cherries to mature slowly, locking in complex floral aromatics, smoked cardamom nuances, and refined fruit acidity.',
      stats: [
        { label: 'Diurnal Range', value: '13°C Drop' },
        { label: 'Ripening Cycle', value: '230 Days' },
        { label: 'Density Index', value: '0.84 g/ml' },
      ],
    },
    soil: {
      title: 'Nutrient-Dense Forest Humus',
      tag: 'Cardamom & Silver Oak Canopy',
      metric: 'pH 5.9 Loam',
      desc: 'Deep roots absorb organic nutrients under a multi-tier biodiversity canopy of silver oak, wild cardamom, and black pepper vines. This symbiotic soil profile imbues NOIR DAKSHIN beans with their distinctive velvety mouthfeel.',
      stats: [
        { label: 'Soil Bed', value: 'Volcanic Loam' },
        { label: 'Canopy Cover', value: '100% Native Shade' },
        { label: 'Biodiversity', value: 'UNESCO Zone' },
      ],
    },
    harvest: {
      title: '100% Selective Hand-Picking',
      tag: 'Peak Brix Indian Arabica',
      metric: '22° Brix Sugar',
      desc: 'Only fully crimson, ripe cherries reaching 22° Brix on refractometers are hand-harvested by generational estate pickers. Each lot is naturally pulped and sun-dried on elevated teakwood African beds.',
      stats: [
        { label: 'Sugar Maturity', value: '22° Brix' },
        { label: 'Lot Selection', value: 'Top 5% Microlot' },
        { label: 'Water Source', value: 'Ghat Springs' },
      ],
    },
  };

  const currentSpec = specs[activeTab];

  return (
    <section
      id="section-bean"
      ref={sectionRef}
      aria-label="Section 01: The Indian Coffee Origin & Terroir"
      className="relative min-h-screen w-full bg-[#070605] flex items-center justify-center overflow-hidden border-t border-[#221c17] py-8 sm:py-12 lg:py-0"
    >
      {/* Background High-Altitude Western Ghats Coffee Plantation in Morning Mist */}
      <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={imageRef}
          src="/assets/origin-farm-mist.jpg"
          alt="High-altitude shade-grown coffee plantation in Chikmagalur Western Ghats with morning mountain mist"
          className="h-full w-full object-cover object-center will-change-transform opacity-60 filter brightness-90 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070605] via-[#070605]/70 to-[#070605]" />
        <div className="absolute inset-0 bg-radial-vignette opacity-90" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-12 flex flex-col justify-between min-h-[75vh] lg:h-[84vh] py-4 sm:py-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#221c17]/80 pb-2 sm:pb-3">
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] text-[#c89658] font-sans font-semibold uppercase">
            <span className="font-mono text-[#c89658]">01</span>
            <span className="h-[1px] w-6 sm:w-8 bg-[#c89658]/60" />
            <span>THE BEAN / DAKSHIN ORIGIN</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#8c827a]">
            <Compass className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#c89658]" />
            <span className="hidden sm:inline">13°19'N 75°46'E •</span>
            <span className="text-[#e5b877]">CHIKMAGALUR 1,900M</span>
          </div>
        </div>

        {/* Middle Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto py-3 sm:py-4">
          {/* Left Column: Headline Words */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div
              ref={storyHeadlineRef}
              className="flex flex-wrap gap-x-2.5 sm:gap-x-4 gap-y-0.5 sm:gap-y-1 font-serif text-2xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#f4eee6] leading-[1.08] mb-3 sm:mb-6"
            >
              <span className="word-reveal inline-block">EVERY</span>
              <span className="word-reveal inline-block font-display font-bold text-[#e5b877]">BEAN</span>
              <span className="word-reveal inline-block">HAS</span>
              <span className="word-reveal inline-block">A</span>
              <span className="word-reveal inline-block italic text-[#c89658]">STORY.</span>
            </div>

            {/* Sub-Pillars */}
            <div
              ref={pillarsRef}
              className="flex flex-wrap gap-2.5 sm:gap-6 font-sans text-[10px] sm:text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase font-semibold text-[#a89d93]"
            >
              <div className="pillar-item flex items-center gap-1.5 sm:gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c89658]" />
                <span className="text-[#f4eee6]">Altitude.</span>
              </div>
              <div className="pillar-item flex items-center gap-1.5 sm:gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c89658]" />
                <span className="text-[#f4eee6]">Western Ghats.</span>
              </div>
              <div className="pillar-item flex items-center gap-1.5 sm:gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c89658]" />
                <span className="text-[#f4eee6]">Monsoon.</span>
              </div>
              <div className="pillar-item flex items-center gap-1.5 sm:gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c89658]" />
                <span className="text-[#f4eee6]">Time.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Agronomy Glass Card */}
          <div ref={specsCardRef} className="lg:col-span-6">
            <div className="rounded-2xl bg-[#0f0c09]/90 border border-[#c89658]/30 p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
              {/* Tab Selector */}
              <div
                role="tablist"
                aria-label="Agronomy Factors"
                className="flex items-center gap-1 sm:gap-1.5 mb-3 sm:mb-4 p-1 rounded-xl bg-[#14100c] border border-[#261f19] w-fit"
              >
                <button
                  role="tab"
                  aria-selected={activeTab === 'altitude'}
                  onClick={() => setActiveTab('altitude')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-[9px] sm:text-[11px] font-sans tracking-[0.12em] sm:tracking-[0.15em] uppercase transition-all cursor-pointer focus-visible:ring-1 focus-visible:ring-[#c89658] ${
                    activeTab === 'altitude'
                      ? 'bg-[#c89658] text-[#070605] font-bold shadow-md'
                      : 'text-[#8c827a] hover:text-[#f4eee6]'
                  }`}
                >
                  <Mountain className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
                  <span>Altitude</span>
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'soil'}
                  onClick={() => setActiveTab('soil')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-[9px] sm:text-[11px] font-sans tracking-[0.12em] sm:tracking-[0.15em] uppercase transition-all cursor-pointer focus-visible:ring-1 focus-visible:ring-[#c89658] ${
                    activeTab === 'soil'
                      ? 'bg-[#c89658] text-[#070605] font-bold shadow-md'
                      : 'text-[#8c827a] hover:text-[#f4eee6]'
                  }`}
                >
                  <Layers className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
                  <span>Shade Soil</span>
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'harvest'}
                  onClick={() => setActiveTab('harvest')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-[9px] sm:text-[11px] font-sans tracking-[0.12em] sm:tracking-[0.15em] uppercase transition-all cursor-pointer focus-visible:ring-1 focus-visible:ring-[#c89658] ${
                    activeTab === 'harvest'
                      ? 'bg-[#c89658] text-[#070605] font-bold shadow-md'
                      : 'text-[#8c827a] hover:text-[#f4eee6]'
                  }`}
                >
                  <Sun className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
                  <span>Harvest</span>
                </button>
              </div>

              {/* Card Body */}
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.2em] sm:tracking-[0.25em] text-[#c89658] uppercase">
                  {currentSpec.tag}
                </span>
                <span className="font-mono text-[10px] sm:text-xs font-bold text-[#e5b877] bg-[#c89658]/15 px-2 sm:px-2.5 py-0.5 rounded-full border border-[#c89658]/30">
                  {currentSpec.metric}
                </span>
              </div>

              <h3 className="font-serif text-lg sm:text-2xl text-[#f4eee6] mb-1 sm:mb-2">
                {currentSpec.title}
              </h3>

              <p className="font-sans text-[11px] sm:text-xs text-[#b5aaa0] font-light leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                {currentSpec.desc}
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 pt-2 sm:pt-3 border-t border-[#221c17]">
                {currentSpec.stats.map((st) => (
                  <div key={st.label}>
                    <span className="text-[8px] sm:text-[9px] font-sans tracking-[0.15em] sm:tracking-[0.18em] text-[#8c827a] uppercase block mb-0.5">
                      {st.label}
                    </span>
                    <span className="font-mono text-[10px] sm:text-xs font-bold text-[#f4eee6]">
                      {st.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Quote */}
        <div className="flex items-center justify-between border-t border-[#221c17]/80 pt-2 sm:pt-3 text-[10px] sm:text-xs text-[#8c827a]">
          <span className="font-serif italic text-[#a89d93] text-[10px] sm:text-xs truncate max-w-[220px] sm:max-w-none">
            “Seven sacred seeds began India's greatest coffee lineage.”
          </span>
          <span className="font-sans text-[8px] sm:text-[10px] tracking-[0.2em] uppercase text-[#c89658]">
            100% Shade-Grown
          </span>
        </div>
      </div>
    </section>
  );
};
