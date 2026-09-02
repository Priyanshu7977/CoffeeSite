import React, { useEffect, useRef, useState } from 'react';
import { Award, Sparkles, ShieldCheck } from 'lucide-react';
import { gsap } from '../utils/animations';

export const SectionPour: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const backgroundRingsRef = useRef<HTMLDivElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cuppingCardRef = useRef<HTMLDivElement | null>(null);

  const [activeNote, setActiveNote] = useState<number>(0);

  const flavorNotes = [
    {
      id: 0,
      name: '85% Single-Origin Mysore Dark Cacao',
      category: 'Primary Note',
      intensity: 95,
      description: 'Deep, rich bittersweet chocolate with an unyielding velvety texture and a luxurious lingering truffle finish.',
      pairing: 'Mysore Pak confectionery or pure mineral water',
    },
    {
      id: 1,
      name: 'Wild Cardamom & Silver Oak',
      category: 'Wood & Spice',
      intensity: 88,
      description: 'Aromatic green cardamom pod and shade-grown silver oak resin from the high ridges of Chikmagalur.',
      pairing: 'Toasted pistachio crisp or cardamom shortbread',
    },
    {
      id: 2,
      name: 'Raw Jaggery Caramel & Black Fig',
      category: 'Natural Sweetness',
      intensity: 92,
      description: 'Dense jaggery molasses balanced by stewed dark figs and subtle sweet citrus acidity.',
      pairing: 'Warm ghee roast cashews or dark plum tart',
    },
    {
      id: 3,
      name: 'Malabar Monsooned Smoked Oak',
      category: 'Coastal Curing',
      intensity: 84,
      description: 'Arabian Sea moisture-cured oak, malt sweetness, and mellow low-acid chocolate richness.',
      pairing: 'Dark spiced chocolate or aged Gouda',
    },
    {
      id: 4,
      name: 'Jasmine Blossom & Orange Nectar',
      category: 'Floral Terroir',
      intensity: 80,
      description: 'Soft, delicate floral jasmine perfume with sweet mandarin orange and wild forest honey nectar.',
      pairing: 'Almond biscotti or fresh honeycomb',
    },
  ];

  const current = flavorNotes[activeNote];

  useEffect(() => {
    const section = sectionRef.current;
    const backgroundRings = backgroundRingsRef.current;
    const imageContainer = imageContainerRef.current;
    const image = imageRef.current;
    const cuppingCard = cuppingCardRef.current;

    if (!section || !backgroundRings || !imageContainer || !image || !cuppingCard) return;

    const ctx = gsap.context(() => {
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
          backgroundRings,
          { scale: 0.85, opacity: 0 },
          { scale: 1.05, opacity: 0.8, ease: 'power2.out', duration: 1.0 },
          0
        )
          .fromTo(
            imageContainer,
            { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
            { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, ease: 'power2.out', duration: 1.0 },
            0.1
          )
          .fromTo(
            image,
            { scale: 1.0 },
            { scale: 1.1, ease: 'none', duration: 1.2 },
            0.2
          )
          .fromTo(
            cuppingCard,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, ease: 'power2.out', duration: 0.8 },
            0.4
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
          .fromTo(backgroundRings, { opacity: 0 }, { opacity: 0.6, duration: 0.8 })
          .fromTo(imageContainer, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5')
          .fromTo(cuppingCard, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
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
      aria-label="Section 03: The Pour & Extraction"
      className="relative min-h-screen w-full bg-[#070605] flex items-center justify-center overflow-hidden border-t border-[#221c17] py-8 sm:py-12 lg:py-0"
    >
      {/* Background Atmospheric Visual */}
      <div
        ref={backgroundRingsRef}
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none will-change-transform"
      >
        <div className="absolute h-[500px] w-[500px] sm:h-[800px] sm:w-[800px] rounded-full bg-radial-at-c from-[#c89658]/16 via-[#7a491d]/6 to-transparent mix-blend-screen opacity-70" />

        <svg
          viewBox="0 0 800 800"
          className="w-[550px] h-[550px] sm:w-[950px] sm:h-[950px] opacity-[0.22] stroke-[#c89658]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="400" cy="400" r="140" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="400" cy="400" r="240" strokeWidth="1" opacity="0.6" />
          <circle cx="400" cy="400" r="340" strokeWidth="1" strokeDasharray="6 12" opacity="0.4" />
          <circle cx="400" cy="400" r="380" strokeWidth="1.5" opacity="0.3" />
          <line x1="400" y1="20" x2="400" y2="780" strokeWidth="1" strokeDasharray="4 10" opacity="0.3" />
          <line x1="20" y1="400" x2="780" y2="400" strokeWidth="1" strokeDasharray="4 10" opacity="0.3" />
        </svg>

        <div className="absolute inset-0 z-0 opacity-15 overflow-hidden mix-blend-screen">
          <img
            src="https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=1200&auto=format&fit=crop&q=85"
            alt="ambient extraction"
            className="h-full w-full object-cover object-center filter blur-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070605] via-transparent to-[#070605]" />
          <div className="absolute inset-0 bg-radial-vignette" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-12 flex flex-col justify-between min-h-[75vh] lg:h-[84vh] py-4 sm:py-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#221c17]/80 pb-2 sm:pb-3">
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] text-[#c89658] font-sans font-semibold uppercase">
            <span className="font-mono text-[#c89658]">03</span>
            <span className="h-[1px] w-6 sm:w-8 bg-[#c89658]/60" />
            <span>THE POUR / EXTRACTION</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#c89658]/40 bg-[#120e0b] px-2.5 sm:px-3 py-0.5">
            <Award className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#c89658]" />
            <span className="font-mono text-[10px] sm:text-xs font-bold text-[#e5b877]">94.5 Cupping Score</span>
          </div>
        </div>

        {/* Middle Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto py-3 sm:py-4">
          {/* Left Column: Image Container */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div
              ref={imageContainerRef}
              className="relative aspect-[4/5] max-h-[30vh] sm:max-h-[44vh] w-full max-w-[240px] sm:max-w-md overflow-hidden rounded-2xl border border-[#c89658]/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)] will-change-transform"
            >
              <img
                ref={imageRef}
                src="https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=1200&auto=format&fit=crop&q=85"
                alt="Velvet coffee extraction with golden crema and aroma"
                className="h-full w-full object-cover object-center will-change-transform"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070605]/85 via-transparent to-transparent pointer-events-none" />

              {/* Extraction HUD Metrics Overlay */}
              <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 grid grid-cols-4 gap-1 rounded-xl bg-[#090705]/95 p-1.5 sm:p-2.5 backdrop-blur-md border border-[#c89658]/25">
                <div className="flex flex-col text-center">
                  <span className="text-[7.5px] sm:text-[8px] font-sans tracking-[0.15em] text-[#8c827a] uppercase">Dose</span>
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-[#f4eee6]">18.5g</span>
                </div>
                <div className="flex flex-col text-center border-l border-[#221c17]">
                  <span className="text-[7.5px] sm:text-[8px] font-sans tracking-[0.15em] text-[#8c827a] uppercase">Yield</span>
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-[#e5b877]">37.0g</span>
                </div>
                <div className="flex flex-col text-center border-l border-[#221c17]">
                  <span className="text-[7.5px] sm:text-[8px] font-sans tracking-[0.15em] text-[#8c827a] uppercase">Time</span>
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-[#f4eee6]">27.5s</span>
                </div>
                <div className="flex flex-col text-center border-l border-[#221c17]">
                  <span className="text-[7.5px] sm:text-[8px] font-sans tracking-[0.15em] text-[#8c827a] uppercase">Temp</span>
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-[#e5b877]">93.5°C</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Cupping Wheel & Sensory Dial */}
          <div ref={cuppingCardRef} className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-[8px] sm:text-[9px] font-sans tracking-[0.2em] sm:tracking-[0.25em] text-[#8c827a] uppercase mb-1.5 sm:mb-2 block">
              Sensory Profile & Flavor Dial (Select Note)
            </span>

            {/* Flavor Pills Selection */}
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
              {flavorNotes.map((note) => {
                const isSelected = activeNote === note.id;
                return (
                  <button
                    key={note.id}
                    onClick={() => setActiveNote(note.id)}
                    className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl text-[9px] sm:text-[11px] font-sans tracking-wide transition-all cursor-pointer border focus-visible:ring-1 focus-visible:ring-[#c89658] ${
                      isSelected
                        ? 'bg-[#c89658] border-[#c89658] text-[#070605] font-bold shadow-md'
                        : 'bg-[#120e0b] border-[#2b231c] text-[#a89d93] hover:border-[#c89658]/50 hover:text-[#f4eee6]'
                    }`}
                  >
                    {note.name}
                  </button>
                );
              })}
            </div>

            {/* Active Sensory Note Display Box */}
            <div className="rounded-2xl bg-[#0f0c09]/95 border border-[#c89658]/35 p-4 sm:p-5 backdrop-blur-xl shadow-2xl mb-2 sm:mb-3">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.2em] sm:tracking-[0.25em] text-[#c89658] uppercase">
                  {current.category}
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[8px] sm:text-[9px] font-sans tracking-[0.2em] text-[#8c827a] uppercase">Intensity</span>
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-[#e5b877]">
                    {current.intensity}%
                  </span>
                </div>
              </div>

              <h3 className="font-serif text-lg sm:text-2xl text-[#f4eee6] mb-1 sm:mb-1.5">
                {current.name}
              </h3>

              <p className="font-sans text-[11px] sm:text-xs leading-relaxed text-[#c7bcb1] font-light mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-none">
                {current.description}
              </p>

              {/* Intensity Progress Bar */}
              <div className="mb-2 sm:mb-3">
                <div className="h-1 sm:h-1.5 w-full bg-[#1c1612] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#c89658] to-[#e5b877] rounded-full transition-all duration-500"
                    style={{ width: `${current.intensity}%` }}
                  />
                </div>
              </div>

              {/* Sommelier Pairing */}
              <div className="pt-2 sm:pt-2.5 border-t border-[#221c17] flex items-start gap-2">
                <Sparkles className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#c89658] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[8px] sm:text-[9px] font-sans tracking-[0.16em] text-[#8c827a] uppercase block">
                    Recommended Pairing
                  </span>
                  <span className="font-serif italic text-[11px] sm:text-xs text-[#f4eee6]">
                    {current.pairing}
                  </span>
                </div>
              </div>
            </div>

            {/* Crema Viscosity Guarantee */}
            <div className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl bg-[#0a0806] border border-[#221c17]">
              <ShieldCheck className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-[#c89658] shrink-0" />
              <span className="font-sans text-[9px] sm:text-[11px] text-[#8c827a]">
                4mm thick golden crema holding sugar for 6+ seconds.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex items-center justify-between border-t border-[#221c17]/80 pt-2 sm:pt-3 text-[10px] sm:text-xs text-[#8c827a]">
          <span className="font-mono text-[9px] sm:text-[10px] text-[#8c827a]">
            Extraction: 9.0 Bar PID Controlled & Brass Decoction
          </span>
          <span className="font-sans text-[8px] sm:text-[10px] tracking-[0.2em] uppercase text-[#c89658]">
            Dakshin Liquid Gold
          </span>
        </div>
      </div>
    </section>
  );
};
