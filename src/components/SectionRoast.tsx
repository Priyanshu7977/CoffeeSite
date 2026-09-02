import React, { useEffect, useRef, useState } from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { gsap } from '../utils/animations';

export const SectionRoast: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const blackoutRef = useRef<HTMLDivElement | null>(null);
  const lightLeakRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [activeStage, setActiveStage] = useState<number>(2); // Default: First Crack

  const stages = [
    {
      id: 0,
      name: 'Drying Phase',
      time: '0:00 – 4:00',
      temp: '160°C',
      desc: 'Free water inside the green bean evaporates under steady convective heat, turning dense raw cherries into golden yellow.',
      telemetry: 'Water Evaporation Rate: 12.4% • 52 RPM Drum Speed',
    },
    {
      id: 1,
      name: 'Maillard Reaction',
      time: '4:00 – 8:00',
      temp: '195°C',
      desc: 'Natural jaggery sugars and amino acids caramelize in thermal harmony, generating over 800 complex aromatic compounds.',
      telemetry: 'Sucrose Caramelization Active • Delta T: 11°C/min',
    },
    {
      id: 2,
      name: 'The First Crack',
      time: '8:00 – 10:00',
      temp: '204°C',
      desc: 'Pressurized steam produces an audible acoustic crack, releasing essential cardamom oils and profound cacao sweetness.',
      telemetry: 'Acoustic Crack Event Verified • Expansion: 165%',
    },
    {
      id: 3,
      name: 'Drop & Cooling',
      time: '10:00 – 11:30',
      temp: '218°C',
      desc: 'Beans are dumped instantly into the vortex cooling tray to lock in peak volatile aromatics and velvety body.',
      telemetry: 'Rapid Quench: 218°C → 24°C in 90 Seconds',
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
            end: '+=140%',
            pin: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Landing Settle Hold
        tl.to({}, { duration: 0.25 });

        tl.fromTo(
          blackout,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.inOut', duration: 0.5 },
          0.25
        )
          .fromTo(
            lightLeak,
            { scale: 0.6, opacity: 0 },
            { scale: 1.4, opacity: 0.6, ease: 'power1.out', duration: 0.8 },
            0.3
          )
          .fromTo(
            image,
            { scale: 1.2, opacity: 0 },
            { scale: 1.0, opacity: 1, ease: 'power2.out', duration: 1.0 },
            0.35
          )
          .fromTo(
            headline,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, ease: 'power3.out', duration: 0.8 },
            0.45
          )
          .fromTo(
            card,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, ease: 'power3.out', duration: 0.8 },
            0.55
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
          .fromTo(image, { scale: 1.1, opacity: 0.5 }, { scale: 1.0, opacity: 0.85, duration: 0.8 }, '-=0.3')
          .fromTo(headline, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.5')
          .fromTo(card, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3');
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
      aria-label="Section 02: The Cinematic Roast"
      className="relative min-h-screen w-full bg-[#1F1C1A] text-[#FAF7F5] flex items-center justify-center overflow-hidden py-16 lg:py-0 border-t border-white/10"
    >
      {/* Blackout Transition Curtain */}
      <div
        ref={blackoutRef}
        className="pointer-events-none absolute inset-0 z-30 bg-[#1F1C1A] will-change-transform"
      />

      {/* Warm Ambient Convection Glow */}
      <div
        ref={lightLeakRef}
        className="pointer-events-none absolute inset-0 z-10 bg-radial-at-c from-[#E05A7E]/20 via-transparent to-transparent mix-blend-screen will-change-transform"
      />

      {/* Roaster Drum Background Imagery */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={imageRef}
          src="/assets/roast-drum.jpg"
          alt="Cast-iron coffee roasting drum"
          className="h-full w-full object-cover object-center will-change-transform opacity-65 filter brightness-95 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1C1A] via-[#1F1C1A]/60 to-[#1F1C1A]" />
      </div>

      {/* Section Content */}
      <div className="relative z-20 mx-auto max-w-6xl w-full px-6 md:px-12 flex flex-col justify-between min-h-[75vh] lg:h-[82vh] py-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="text-xs tracking-[0.25em] text-[#F5DADF] font-sans font-bold uppercase flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#E05A7E]" />
            <span>02 / THE ROAST • CAST IRON</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FAF7F5]/80">
            <Flame className="h-3.5 w-3.5 text-[#E05A7E]" />
            <span>204°C FIRST CRACK • 52 RPM</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center my-auto py-6">
          {/* Left: Headline & Story */}
          <div ref={headlineRef} className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-xs tracking-[0.3em] font-sans uppercase text-[#E05A7E] font-bold mb-3">
              SLOW CONVECTION DRUM
            </span>

            {/* Headline */}
            <h2 className="font-display text-4xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
              Roasted with <span className="italic text-[#F5DADF] font-medium">patience.</span>
            </h2>

            {/* Description */}
            <p className="font-sans text-sm sm:text-base text-[#FAF7F5]/80 font-normal leading-relaxed max-w-md">
              Cast-iron drum convection transfers gentle, penetrating heat to the core of every dense bean—unlocking rich chocolate and cardamom aromatics.
            </p>
          </div>

          {/* Right: Stage Selector Card */}
          <div ref={cardRef} className="lg:col-span-7">
            <div className="rounded-3xl bg-[#2D2926]/95 border border-white/15 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              {/* Stage Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                {stages.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setActiveStage(st.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeStage === st.id
                        ? 'bg-[#F5DADF] border-[#F5DADF] text-[#2D2926] shadow-md'
                        : 'bg-[#1F1C1A] border-white/10 text-[#FAF7F5]/70 hover:text-white'
                    }`}
                  >
                    <span className={`text-[10px] font-mono block font-bold ${activeStage === st.id ? 'text-[#2D2926]' : 'text-[#E05A7E]'}`}>
                      0{st.id + 1}
                    </span>
                    <span className="text-xs font-sans font-semibold block truncate">
                      {st.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Stage Info */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[#F5DADF] font-bold">
                  {current.time}
                </span>
                <span className="font-mono text-xs font-bold text-[#2D2926] bg-[#F5DADF] px-2.5 py-0.5 rounded-full shadow-sm">
                  {current.temp}
                </span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl text-white mb-2 font-bold">
                {current.name}
              </h3>

              <p className="font-sans text-xs sm:text-sm text-[#FAF7F5]/80 font-normal leading-relaxed mb-4">
                {current.desc}
              </p>

              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0 text-xs text-[#FAF7F5]/60">
                <span className="truncate max-w-full sm:max-w-none">{current.telemetry}</span>
                <span className="font-mono text-[#F5DADF] font-bold shrink-0">LIVE TELEMETRY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Marker */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-[#FAF7F5]/60">
          <span>Cast-Iron Convection Roastery • Chikmagalur</span>
          <span className="font-mono text-[#F5DADF] font-bold">STAGE 0{activeStage + 1} OF 04</span>
        </div>
      </div>
    </section>
  );
};
