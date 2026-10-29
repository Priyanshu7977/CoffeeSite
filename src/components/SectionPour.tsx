import React, { useEffect, useRef, useState } from 'react';
import { Award, Sparkles, Droplets, CheckCircle2 } from 'lucide-react';
import { gsap } from '../utils/animations';

export const SectionPour: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const radarContainerRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const cuppingCardRef = useRef<HTMLDivElement | null>(null);

  const [activeNote, setActiveNote] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const flavorNotes = [
    {
      id: 0,
      name: 'Mysore Dark Cacao',
      category: 'Primary Note',
      intensity: 95,
      description: 'Bittersweet dark chocolate with an unyielding velvety texture and a luxurious lingering truffle finish.',
      pairing: 'Pure mineral water or dark chocolate crisp',
    },
    {
      id: 1,
      name: 'Wild Cardamom & Oak',
      category: 'Spice & Wood',
      intensity: 88,
      description: 'Aromatic green cardamom pod and shade-grown silver oak resin from the high peaks of Chikmagalur.',
      pairing: 'Cardamom shortbread or toasted pistachios',
    },
    {
      id: 2,
      name: 'Raw Jaggery Caramel',
      category: 'Natural Sweetness',
      intensity: 92,
      description: 'Dense jaggery molasses sweetness balanced by stewed dark figs and subtle sweet citrus acidity.',
      pairing: 'Warm ghee-roasted cashews',
    },
    {
      id: 3,
      name: 'Monsooned Sweet Malt',
      category: 'Coastal Curing',
      intensity: 90,
      description: 'Arabian Sea moisture-cured malt sweetness and mellow low-acid chocolate richness.',
      pairing: 'Aged Gouda or dark roasted cacao nibs',
    },
  ];

  const current = flavorNotes[activeNote];

  // Start 1-second auto cycle ONLY when properly landed on this section
  const startAutoCycle = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setActiveNote(0);

    timerRef.current = setInterval(() => {
      setActiveNote((prev) => (prev + 1) % 4);
    }, 1000);
  };

  // Stop auto cycle and lock back to Note 1 (0) until next proper landing
  const stopAutoCycle = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setActiveNote(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleNoteClick = (noteId: number) => {
    setActiveNote(noteId);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setActiveNote((prev) => (prev + 1) % 4);
      }, 1000);
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    const radarContainer = radarContainerRef.current;
    const headline = headlineRef.current;
    const cuppingCard = cuppingCardRef.current;

    if (!section || !radarContainer || !headline || !cuppingCard) return;

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
          radarContainer,
          { scale: 0.85, opacity: 0 },
          { scale: 1.0, opacity: 1, ease: 'power2.out', duration: 1.0 },
          0.25
        )
          .fromTo(
            headline,
            { y: 35, opacity: 0 },
            { y: 0, opacity: 1, ease: 'power3.out', duration: 0.8 },
            0.35
          )
          .fromTo(
            cuppingCard,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, ease: 'power3.out', duration: 0.8 },
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
          .fromTo(radarContainer, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' })
          .fromTo(headline, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
          .fromTo(cuppingCard, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="section-pour"
      ref={sectionRef}
      aria-label="Section 03: The Extraction & Cupping"
      className="relative min-h-screen w-full bg-[#FAF7F5] text-[#2D2926] flex items-center justify-center overflow-visible lg:overflow-hidden py-12 sm:py-16 lg:py-0 border-t border-[#2D2926]/10"
    >
      <div className="relative z-10 mx-auto max-w-6xl w-full px-5 sm:px-8 md:px-12 flex flex-col justify-between min-h-[70vh] lg:min-h-[75vh] py-3 sm:py-5">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#2D2926]/10 pb-2.5 gap-2">
          <div className="text-[11px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#2D2926] font-sans font-bold uppercase flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Sparkles className="h-3.5 w-3.5 text-[#E05A7E] shrink-0" />
            <span>03 / EXTRACTION<span className="hidden sm:inline"> & SENSORY</span></span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white border border-[#2D2926]/10 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs text-[#2D2926] shadow-sm shrink-0">
            <Award className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#E05A7E]" />
            <span className="font-mono font-bold text-[#2D2926]">94.5 SCA<span className="hidden sm:inline"> CUPPING SCORE</span></span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-12 items-center my-auto py-2 sm:py-4">
          {/* Left: Extraction Radar Animation & Telemetry Ring */}
          <div ref={radarContainerRef} className="lg:col-span-5 flex justify-center">
            <div className="relative aspect-square w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[340px] flex items-center justify-center">
              {/* Concentric Telemetry Radar Rings */}
              <div className="absolute inset-0 rounded-full border border-[#2D2926]/15 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full border border-[#E05A7E]/20 animate-pulse" />
              <div className="absolute inset-8 sm:inset-10 rounded-full border border-[#2D2926]/10" />

              {/* Central Porcelain Cup Extraction Visual */}
              <div className="relative h-32 w-32 sm:h-40 sm:w-40 lg:h-44 lg:w-44 rounded-full overflow-hidden border-2 border-[#2D2926] shadow-[0_10px_35px_rgba(245,218,223,0.8)]">
                <img
                  src="https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=1200&auto=format&fit=crop&q=85"
                  alt="Velvet coffee extraction with golden crema"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Gauge Overlays */}
              <div className="absolute top-1 left-1 sm:top-2 sm:left-2 rounded-full bg-white/95 border border-[#2D2926]/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-mono text-[#2D2926] backdrop-blur-md shadow-md flex items-center gap-1 sm:gap-1.5 font-bold">
                <Droplets className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#E05A7E]" />
                <span>9.0 BAR EXTRACTION</span>
              </div>
              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 rounded-full bg-white/95 border border-[#2D2926]/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-mono text-[#2D2926] backdrop-blur-md shadow-md flex items-center gap-1 sm:gap-1.5 font-bold">
                <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#E05A7E]" />
                <span>4MM GOLDEN CREMA</span>
              </div>
            </div>
          </div>

          {/* Right: Headline & Flavor Selector */}
          <div ref={cuppingCardRef} className="lg:col-span-7 flex flex-col justify-center">
            <div ref={headlineRef}>
              <span className="text-[11px] sm:text-xs tracking-[0.3em] font-sans uppercase text-[#E05A7E] font-bold mb-1.5 sm:mb-2 block">
                SENSORY CUPPING RADAR
              </span>

              {/* Headline */}
              <h2 className="font-display text-2xl sm:text-4xl lg:text-3xl xl:text-4xl font-bold text-[#2D2926] leading-[1.15] tracking-tight mb-2.5 sm:mb-3">
                Liquid velvet, <span className="italic text-[#E05A7E] font-medium">poured with purpose.</span>
              </h2>
            </div>

            {/* Flavor Note Buttons - Clean 4-Column / 2-Column Grid to Prevent Flutter/Orphan Wrap */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
              {flavorNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => handleNoteClick(note.id)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-sans text-center transition-all duration-200 cursor-pointer flex items-center justify-center ${
                    activeNote === note.id
                      ? 'bg-[#F5DADF] border-2 border-[#2D2926] text-[#2D2926] font-bold shadow-sm scale-[1.02]'
                      : 'bg-white border border-[#2D2926]/15 text-[#2D2926]/80 hover:text-[#2D2926] hover:border-[#2D2926]/30 font-medium'
                  }`}
                >
                  <span className="truncate">{note.name}</span>
                </button>
              ))}
            </div>

            {/* Selected Flavor Card */}
            <div key={activeNote} className="rounded-2xl sm:rounded-3xl bg-white border border-[#2D2926]/10 p-4 sm:p-5 shadow-[0_15px_40px_rgba(45,41,38,0.06)] transition-all duration-150">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#E05A7E] uppercase font-bold">
                  {current.category}
                </span>
                <span className="font-mono text-[11px] sm:text-xs text-[#2D2926] font-bold">
                  INTENSITY {current.intensity}%
                </span>
              </div>

              {/* Intensity Bar */}
              <div className="h-1.5 sm:h-2 w-full bg-[#F3ECE7] rounded-full overflow-hidden mb-2 sm:mb-2.5 border border-[#2D2926]/10">
                <div
                  className="h-full bg-gradient-to-r from-[#F5DADF] to-[#E05A7E] rounded-full transition-all duration-500"
                  style={{ width: `${current.intensity}%` }}
                />
              </div>

              <h3 className="font-display text-lg sm:text-xl lg:text-2xl text-[#2D2926] mb-1 sm:mb-1.5 font-bold">
                {current.name}
              </h3>
              <p className="font-sans text-xs sm:text-[13px] text-[#5E5854] leading-relaxed mb-2.5 sm:mb-3 font-normal">
                {current.description}
              </p>

              <div className="pt-2 sm:pt-2.5 border-t border-[#2D2926]/10 flex items-center gap-2 text-xs text-[#8C827A]">
                <Sparkles className="h-3.5 w-3.5 text-[#E05A7E] shrink-0" />
                <span className="leading-snug">Pair with: <strong className="text-[#2D2926] font-semibold">{current.pairing}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Marker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#2D2926]/10 pt-2.5 sm:pt-3 gap-1 text-[10.5px] sm:text-xs text-[#8C827A]">
          <span className="truncate">Traditional Brass Davarah & 9-Bar Extraction</span>
          <span className="font-mono text-[#2D2926] font-bold self-end sm:self-auto shrink-0">BENGALURU ROASTERY GUIDE</span>
        </div>
      </div>
    </section>
  );
};
