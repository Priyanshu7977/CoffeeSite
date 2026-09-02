import React, { useEffect, useRef, useState } from 'react';
import { Award, Sparkles, Droplets, CheckCircle2 } from 'lucide-react';
import { gsap } from '../utils/animations';

export const SectionPour: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const radarContainerRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const cuppingCardRef = useRef<HTMLDivElement | null>(null);

  const [activeNote, setActiveNote] = useState<number>(0);

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

  useEffect(() => {
    const section = sectionRef.current;
    const radarContainer = radarContainerRef.current;
    const headline = headlineRef.current;
    const cuppingCard = cuppingCardRef.current;

    if (!section || !radarContainer || !headline || !cuppingCard) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=130%',
            pin: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
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

      mm.add('(max-width: 1023px)', () => {
        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
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
      className="relative min-h-screen w-full bg-[#FAF7F5] text-[#2D2926] flex items-center justify-center overflow-hidden py-16 lg:py-0 border-t border-[#2D2926]/10"
    >
      <div className="relative z-10 mx-auto max-w-6xl w-full px-6 md:px-12 flex flex-col justify-between min-h-[75vh] lg:h-[82vh] py-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#2D2926]/10 pb-3">
          <div className="text-xs tracking-[0.25em] text-[#2D2926] font-sans font-bold uppercase flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#E05A7E]" />
            <span>03 / EXTRACTION & SENSORY</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white border border-[#2D2926]/10 px-3 py-1 text-xs text-[#2D2926] shadow-sm">
            <Award className="h-3.5 w-3.5 text-[#E05A7E]" />
            <span className="font-mono font-bold text-[#2D2926]">94.5 SCA CUPPING SCORE</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center my-auto py-6">
          {/* Left: Extraction Radar Animation & Telemetry Ring */}
          <div ref={radarContainerRef} className="lg:col-span-5 flex justify-center">
            <div className="relative aspect-square w-full max-w-sm flex items-center justify-center">
              {/* Concentric Telemetry Radar Rings */}
              <div className="absolute inset-0 rounded-full border border-[#2D2926]/15 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full border border-[#E05A7E]/20 animate-pulse" />
              <div className="absolute inset-10 rounded-full border border-[#2D2926]/10" />

              {/* Central Porcelain Cup Extraction Visual */}
              <div className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-full overflow-hidden border-2 border-[#2D2926] shadow-[0_10px_35px_rgba(245,218,223,0.8)]">
                <img
                  src="https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=1200&auto=format&fit=crop&q=85"
                  alt="Velvet coffee extraction with golden crema"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Gauge Overlays */}
              <div className="absolute top-2 left-2 rounded-full bg-white/95 border border-[#2D2926]/10 px-3 py-1 text-[10px] font-mono text-[#2D2926] backdrop-blur-md shadow-md flex items-center gap-1.5 font-bold">
                <Droplets className="h-3 w-3 text-[#E05A7E]" />
                <span>9.0 BAR EXTRACTION</span>
              </div>
              <div className="absolute bottom-2 right-2 rounded-full bg-white/95 border border-[#2D2926]/10 px-3 py-1 text-[10px] font-mono text-[#2D2926] backdrop-blur-md shadow-md flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="h-3 w-3 text-[#E05A7E]" />
                <span>4MM GOLDEN CREMA</span>
              </div>
            </div>
          </div>

          {/* Right: Headline & Flavor Selector */}
          <div ref={cuppingCardRef} className="lg:col-span-7 flex flex-col justify-center">
            <div ref={headlineRef}>
              <span className="text-xs tracking-[0.3em] font-sans uppercase text-[#E05A7E] font-bold mb-3 block">
                SENSORY CUPPING RADAR
              </span>

              {/* Headline */}
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#2D2926] leading-tight tracking-tight mb-4">
                Liquid velvet, <span className="italic text-[#E05A7E] font-medium">poured with purpose.</span>
              </h2>
            </div>

            {/* Flavor Note Buttons */}
            <div className="flex flex-wrap gap-2 mb-5">
              {flavorNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => setActiveNote(note.id)}
                  className={`px-4 py-2 rounded-full text-xs font-sans tracking-wide transition-all cursor-pointer ${
                    activeNote === note.id
                      ? 'bg-[#F5DADF] border border-[#2D2926]/20 text-[#2D2926] font-bold shadow-sm'
                      : 'bg-white border border-[#2D2926]/10 text-[#5E5854] hover:text-[#2D2926]'
                  }`}
                >
                  {note.name}
                </button>
              ))}
            </div>

            {/* Selected Flavor Card */}
            <div className="rounded-3xl bg-white border border-[#2D2926]/10 p-6 shadow-[0_20px_50px_rgba(45,41,38,0.06)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono tracking-widest text-[#E05A7E] uppercase font-bold">
                  {current.category}
                </span>
                <span className="font-mono text-xs text-[#2D2926] font-bold">
                  INTENSITY {current.intensity}%
                </span>
              </div>

              {/* Intensity Bar */}
              <div className="h-2 w-full bg-[#F3ECE7] rounded-full overflow-hidden mb-3 border border-[#2D2926]/10">
                <div
                  className="h-full bg-gradient-to-r from-[#F5DADF] to-[#E05A7E] rounded-full transition-all duration-500"
                  style={{ width: `${current.intensity}%` }}
                />
              </div>

              <h3 className="font-display text-xl sm:text-2xl text-[#2D2926] mb-2 font-bold">
                {current.name}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#5E5854] leading-relaxed mb-4 font-normal">
                {current.description}
              </p>

              <div className="pt-3 border-t border-[#2D2926]/10 flex items-center gap-2 text-xs text-[#8C827A]">
                <Sparkles className="h-3.5 w-3.5 text-[#E05A7E]" />
                <span>Pair with: <strong className="text-[#2D2926] font-semibold">{current.pairing}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Marker */}
        <div className="flex items-center justify-between border-t border-[#2D2926]/10 pt-3 text-xs text-[#8C827A]">
          <span>Traditional Brass Davarah & 9-Bar Extraction</span>
          <span className="font-mono text-[#2D2926] font-bold">BENGALURU ATELIER PROTOCOL</span>
        </div>
      </div>
    </section>
  );
};
