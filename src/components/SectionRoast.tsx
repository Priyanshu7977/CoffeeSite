import React, { useEffect, useRef, useState } from 'react';
import { Flame } from 'lucide-react';
import { gsap } from '../utils/animations';

export const SectionRoast: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const blackoutRef = useRef<HTMLDivElement | null>(null);
  const lightLeakRef = useRef<HTMLDivElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [activeStage, setActiveStage] = useState<number>(2); // Default to First Crack

  const stages = [
    {
      id: 0,
      name: 'Drying Phase',
      time: '0:00 - 4:00',
      temp: '100°C - 160°C',
      colorName: 'Raw Jade to Pale Amber',
      desc: 'Free water inside the green Western Ghats bean evaporates steadily under convection heat. The bean structure expands and prepares for enzymatic transformation.',
      gasPercent: 75,
      airFlow: 'Low',
    },
    {
      id: 1,
      name: 'Maillard Reaction',
      time: '4:00 - 8:00',
      temp: '160°C - 195°C',
      colorName: 'Golden Honey to Light Tan',
      desc: 'Amino acids and natural jaggery sugars react in thermal synergy, generating over 800 distinct aromatic compounds and complex spice notes.',
      gasPercent: 60,
      airFlow: 'Medium',
    },
    {
      id: 2,
      name: 'The First Crack',
      time: '8:00 - 10:00',
      temp: '204°C',
      colorName: 'Rich Mahogany Brown',
      desc: 'Internal moisture boils into pressurized steam, shattering cellular walls with an audible crack. Cardamom and chocolate oils migrate to the surface.',
      gasPercent: 40,
      airFlow: 'High',
    },
    {
      id: 3,
      name: 'Development & Drop',
      time: '10:00 - 11:30',
      temp: '218°C',
      colorName: 'Obsidian Velvet Gloss',
      desc: 'Measured development ratio (18.5%). Beans are dumped instantly into the vortex cooling tray to lock in peak volatile aromatics.',
      gasPercent: 20,
      airFlow: 'Max Cooling',
    },
  ];

  const current = stages[activeStage];

  useEffect(() => {
    const section = sectionRef.current;
    const blackout = blackoutRef.current;
    const lightLeak = lightLeakRef.current;
    const image = imageRef.current;
    const headline = headlineRef.current;
    const card = cardRef.current;

    if (!section || !blackout || !lightLeak || !image || !headline || !card) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          blackout,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.inOut', duration: 0.5 },
          0
        )
          .fromTo(
            lightLeak,
            { scale: 0.4, opacity: 0 },
            { scale: 1.6, opacity: 0.75, ease: 'power1.out', duration: 0.8 },
            0.1
          )
          .fromTo(
            image,
            { scale: 1.25, opacity: 0 },
            { scale: 1.0, opacity: 1, ease: 'power2.out', duration: 1.0 },
            0.2
          )
          .fromTo(
            headline,
            { x: -80, opacity: 0 },
            { x: 0, opacity: 1, ease: 'power3.out', duration: 0.8 },
            0.4
          )
          .fromTo(
            card,
            { y: 50, opacity: 0 },
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
          .fromTo(blackout, { opacity: 0.8 }, { opacity: 0, duration: 0.5 })
          .fromTo(image, { scale: 1.15, opacity: 0.3 }, { scale: 1.0, opacity: 0.65, duration: 0.8 }, '-=0.3')
          .fromTo(headline, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.5')
          .fromTo(card, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3');
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="section-roast"
      ref={sectionRef}
      aria-label="Section 02: The Dakshin Roast Thermal Alchemy"
      className="relative min-h-screen w-full bg-[#070605] flex items-center justify-center overflow-hidden border-t border-[#221c17] py-8 sm:py-12 lg:py-0"
    >
      {/* Blackout Transition Curtain */}
      <div
        ref={blackoutRef}
        className="pointer-events-none absolute inset-0 z-30 bg-[#070605] will-change-transform"
      />

      {/* Glowing Warm Amber Light Leak */}
      <div
        ref={lightLeakRef}
        className="pointer-events-none absolute inset-0 z-10 bg-radial-at-c from-[#c89658]/35 via-[#9b5a2b]/10 to-transparent mix-blend-screen will-change-transform"
      />

      {/* Roaster Drum Background Imagery */}
      <div ref={imageContainerRef} className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={imageRef}
          src="/assets/roast-drum.jpg"
          alt="Glowing cast-iron coffee roasting drum in Chikmagalur roastery"
          className="h-full w-full object-cover object-center will-change-transform opacity-65 filter brightness-85 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070605] via-[#070605]/70 to-[#070605]" />
        <div className="absolute inset-0 bg-radial-vignette opacity-85" />
      </div>

      {/* Section Content */}
      <div className="relative z-20 mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-12 flex flex-col justify-between min-h-[75vh] lg:h-[84vh] py-4 sm:py-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#221c17]/80 pb-2 sm:pb-3">
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] text-[#c89658] font-sans font-semibold uppercase">
            <span className="font-mono text-[#c89658]">02</span>
            <span className="h-[1px] w-6 sm:w-8 bg-[#c89658]/60" />
            <span>THE ROAST / CAST-IRON</span>
          </div>

          <div className="flex items-center gap-2 font-sans text-[10px] sm:text-xs tracking-[0.16em] sm:tracking-[0.2em] text-[#8c827a] uppercase">
            <Flame className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#c89658] animate-pulse" />
            <span>204°C First Crack</span>
          </div>
        </div>

        {/* Middle Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto py-3 sm:py-4">
          {/* Left Column: Headline */}
          <div ref={headlineRef} className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex flex-col leading-[0.98] tracking-tight mb-2 sm:mb-4">
              <span className="font-serif text-2xl sm:text-5xl md:text-6xl font-light text-[#f4eee6]">
                ROASTED
              </span>
              <span className="font-display text-2xl sm:text-5xl md:text-6xl font-bold italic text-[#e5b877] uppercase gold-glow my-0.5">
                WITH
              </span>
              <span className="font-serif text-2xl sm:text-5xl md:text-6xl font-light text-[#c89658] italic">
                PATIENCE.
              </span>
            </div>

            <p className="font-sans text-[11px] sm:text-sm text-[#b5aaa0] font-light leading-relaxed max-w-md line-clamp-3 sm:line-clamp-none">
              Cast-iron drum convection transfers steady conductive heat to the core of each dense Western Ghats bean. At 204°C, cell walls rupture in the First Crack.
            </p>
          </div>

          {/* Right Column: Interactive Roast HUD */}
          <div ref={cardRef} className="lg:col-span-7">
            <div className="rounded-2xl bg-[#0f0c09]/95 border border-[#c89658]/35 p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
              {/* Stage Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {stages.map((st) => {
                  const isSelected = activeStage === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setActiveStage(st.id)}
                      className={`p-2 sm:p-2.5 rounded-xl border transition-all text-left cursor-pointer focus-visible:ring-1 focus-visible:ring-[#c89658] ${
                        isSelected
                          ? 'bg-[#1a140f] border-[#c89658] shadow-md'
                          : 'bg-[#120e0b] border-[#221c17] hover:border-[#382d24]'
                      }`}
                    >
                      <span className="font-mono text-[8px] sm:text-[9px] text-[#c89658] block">
                        0{st.id + 1}
                      </span>
                      <span className={`font-sans text-[10px] sm:text-[11px] font-semibold block truncate ${isSelected ? 'text-[#f4eee6]' : 'text-[#8c827a]'}`}>
                        {st.name}
                      </span>
                      <span className="font-mono text-[9px] sm:text-[10px] text-[#e5b877] font-bold">
                        {st.temp}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Stage Details */}
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.2em] sm:tracking-[0.25em] text-[#c89658] uppercase">
                  Stage 0{current.id + 1} • {current.time}
                </span>
                <span className="font-mono text-[10px] sm:text-xs font-bold text-[#e5b877] bg-[#c89658]/15 px-2 sm:px-2.5 py-0.5 rounded-full border border-[#c89658]/30">
                  {current.temp}
                </span>
              </div>

              <h3 className="font-serif text-lg sm:text-2xl text-[#f4eee6] mb-1 sm:mb-1.5">
                {current.name}
              </h3>

              <p className="font-sans text-[11px] sm:text-xs text-[#b5aaa0] font-light leading-relaxed mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-none">
                {current.desc}
              </p>

              {/* Telemetry Progress Bars */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-[#221c17]">
                <div>
                  <div className="flex justify-between text-[8px] sm:text-[9px] font-sans uppercase tracking-[0.15em] text-[#8c827a] mb-1">
                    <span>Gas Load</span>
                    <span className="font-mono text-[#f4eee6]">{current.gasPercent}%</span>
                  </div>
                  <div className="h-1 sm:h-1.5 w-full bg-[#1c1612] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#c89658] to-[#e5b877] rounded-full transition-all duration-500"
                      style={{ width: `${current.gasPercent}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[8px] sm:text-[9px] font-sans uppercase tracking-[0.15em] text-[#8c827a] mb-1">
                    <span>Air Damper</span>
                    <span className="font-mono text-[#e5b877]">{current.airFlow}</span>
                  </div>
                  <div className="h-1 sm:h-1.5 w-full bg-[#1c1612] rounded-full overflow-hidden">
                    <div className="h-full bg-[#c89658] rounded-full animate-pulse" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex items-center justify-between border-t border-[#221c17]/80 pt-2 sm:pt-3 text-[10px] sm:text-xs text-[#8c827a]">
          <span className="font-mono text-[9px] sm:text-[10px] text-[#8c827a]">
            Cast-Iron Convection: 52 RPM Drum
          </span>
          <span className="font-sans text-[8px] sm:text-[10px] tracking-[0.2em] uppercase text-[#c89658]">
            Dakshin Convection Alchemy
          </span>
        </div>
      </div>
    </section>
  );
};
