import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Compass, Mountain, Coffee, Flame, Film } from 'lucide-react';
import { gsap } from '../utils/animations';

interface HeroProps {
  onExplore?: () => void;
}

interface HeroVisualMode {
  id: 'plantation' | 'brass_kaapi' | 'roasting_drum' | 'video';
  label: string;
  badgeText: string;
  icon: React.ComponentType<{ className?: string }>;
  type: 'image' | 'video';
  src: string;
}

const HERO_MODES: HeroVisualMode[] = [
  {
    id: 'plantation',
    label: 'Estate Terroir',
    badgeText: 'Altitude: 1,900M ASL • Baba Budan Giri Range',
    icon: Mountain,
    type: 'image',
    src: '/assets/hero-estate-plantation.jpg',
  },
  {
    id: 'brass_kaapi',
    label: 'Brass Filter Kaapi',
    badgeText: 'Davarah Extraction • 85:15 Peaberry Blend',
    icon: Coffee,
    type: 'image',
    src: '/assets/hero-brass-kaapi.jpg',
  },
  {
    id: 'roasting_drum',
    label: 'Cast-Iron Roast',
    badgeText: 'Slow Cast-Iron Convection • Batch 0984',
    icon: Flame,
    type: 'image',
    src: '/assets/hero-roasting-drum.jpg',
  },
  {
    id: 'video',
    label: 'Cinema Reel',
    badgeText: 'Roastery Aroma Telemetry • Est. 1998',
    icon: Film,
    type: 'video',
    src: '/assets/videos/coffee-manifesto-smoke.mp4',
  },
];

export const Hero: React.FC<HeroProps> = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const titleLine1Ref = useRef<HTMLHeadingElement | null>(null);
  const titleLine2Ref = useRef<HTMLHeadingElement | null>(null);
  const titleLine3Ref = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);

  const [currentModeIndex, setCurrentModeIndex] = useState<number>(0);
  const [isAutoCycling, setIsAutoCycling] = useState<boolean>(true);

  // Auto-cycle through the curated estate visuals every 7.5 seconds
  useEffect(() => {
    if (!isAutoCycling) return;
    const interval = setInterval(() => {
      setCurrentModeIndex((prev) => (prev + 1) % HERO_MODES.length);
    }, 7500);
    return () => clearInterval(interval);
  }, [isAutoCycling]);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const textContainer = textContainerRef.current;

    if (!section || !container || !textContainer) return;

    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    const ctx = gsap.context(() => {
      // 1. Initial Page Load Typography Entrance
      const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      introTl
        .fromTo(
          container,
          { scale: 1.12, opacity: 0 },
          { scale: 1.0, opacity: 1, duration: 1.6, ease: 'power2.out' }
        )
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, delay: 0.1 },
          '-=1.2'
        )
        .fromTo(
          [titleLine1Ref.current, titleLine2Ref.current, titleLine3Ref.current],
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out' },
          '-=0.7'
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          badgeRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        );

      // 2. Smooth, non-pinning cinematic parallax scroll
      gsap.to(container, {
        yPercent: 12,
        scale: 1.06,
        filter: 'blur(2px) brightness(0.8) contrast(115%)',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });

      // Text gently settles downward and dissolves to 0 without ever colliding into the header
      gsap.to(textContainer, {
        y: 20,
        scale: 0.97,
        opacity: 0,
        filter: 'blur(3px)',
        ease: 'power1.out',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '50% top',
          scrub: 0.5,
        },
      });

      if (badgeRef.current) {
        gsap.to(badgeRef.current, {
          opacity: 0,
          y: -10,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '40% top',
            scrub: 0.5,
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden bg-[#1F1C1A] flex flex-col items-center justify-center pt-20 sm:pt-24 pb-8 sm:pb-10"
    >
      {/* Dynamic Background Showcase: Plantation Estate, Brass Davarah, Cast-Iron Drum & Smoke */}
      <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden bg-[#1F1C1A]">
        {HERO_MODES.map((mode, idx) => {
          const isActive = idx === currentModeIndex;
          if (mode.type === 'video') {
            return (
              <video
                key={mode.id}
                ref={videoRef}
                src={mode.src}
                autoPlay
                muted
                loop
                playsInline
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 will-change-transform filter brightness-90 contrast-110 ${
                  isActive ? 'opacity-100 z-1' : 'opacity-0 z-0 pointer-events-none'
                }`}
              />
            );
          }
          return (
            <div
              key={mode.id}
              className={`absolute inset-0 transition-opacity duration-1000 will-change-transform overflow-hidden ${
                isActive ? 'opacity-100 z-1' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={mode.src}
                alt={mode.label}
                className={`h-full w-full object-cover object-center filter brightness-95 contrast-105 transition-transform duration-[12000ms] ease-out will-change-transform ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Cinematic Overlays: Warm Espresso Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1C1A] via-transparent to-[#1F1C1A]/70 pointer-events-none z-2" />
        <div className="absolute inset-0 bg-[#1F1C1A]/35 pointer-events-none z-2" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.05)_0%,rgba(31,28,26,0.65)_100%)] pointer-events-none z-2" />
      </div>

      {/* Floating Heritage Badge - Dynamic with Active Mode */}
      <div
        ref={badgeRef}
        className="absolute top-20 sm:top-22 lg:top-24 right-5 sm:right-8 z-20 hidden lg:flex items-center gap-2 rounded-full border border-white/15 bg-black/45 backdrop-blur-md px-3.5 py-1.5 shadow-lg text-white"
      >
        <Compass className="h-3.5 w-3.5 text-[#E05A7E] animate-spin-slow shrink-0" />
        <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#FAF7F5] font-sans uppercase font-bold transition-all duration-300">
          {HERO_MODES[currentModeIndex].badgeText}
        </span>
      </div>

      {/* Hero Typography Container: Fluid Vertically Constrained */}
      <div
        ref={textContainerRef}
        className="relative z-20 mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-4 sm:px-6 text-center will-change-transform select-none"
      >
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="mb-2 sm:mb-3.5 inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#F5DADF] text-[#2D2926] text-[9px] sm:text-[10px] md:text-xs tracking-[0.22em] font-sans font-bold uppercase shadow-sm"
        >
          <Sparkles className="h-3 w-3 text-[#E05A7E]" />
          <span>NOIR DAKSHIN ROAST / BABA BUDAN ROASTERY EST. 1998</span>
        </div>

        {/* Monumental Modern Headline in Space Grotesk */}
        <div className="flex flex-col leading-[0.92] tracking-[-0.025em] text-white">
          <h1
            ref={titleLine1Ref}
            className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] font-bold tracking-tight text-white drop-shadow-2xl"
          >
            KAAPI,
          </h1>
          <h1
            ref={titleLine2Ref}
            className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] font-medium tracking-tight text-[#F5DADF] italic my-0.5 sm:my-1 drop-shadow-[0_0_35px_rgba(245,218,223,0.5)]"
          >
            WITHOUT
          </h1>
          <h1
            ref={titleLine3Ref}
            className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] font-bold tracking-widest text-white uppercase drop-shadow-[0_0_35px_rgba(245,218,223,0.35)]"
          >
            COMPROMISE.
          </h1>
        </div>

        {/* Editorial Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-2.5 sm:mt-3.5 max-w-md font-sans text-[11px] sm:text-xs md:text-sm tracking-[0.18em] uppercase text-[#FAF7F5] font-semibold leading-relaxed"
        >
          Shade-Grown Western Ghats Terroir. Slow Cast-Iron Convection.
        </p>

        {/* Ambient Telemetry Pills */}
        <div className="mt-2 sm:mt-2.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-[9px] sm:text-[10px] md:text-[11px] font-sans tracking-[0.18em] text-[#F5DADF]/85 uppercase font-medium">
          <span>Batch No. 0984-DAKSHIN</span>
          <span>•</span>
          <span>Chikmagalur 1,900M</span>
          <span>•</span>
          <span>Malabar Monsooned</span>
        </div>

        {/* Interactive Experience Switcher */}
        <div className="mt-4 sm:mt-5 flex items-center justify-center gap-1.5 sm:gap-2.5 z-20 flex-wrap px-2">
          {HERO_MODES.map((mode, idx) => {
            const Icon = mode.icon;
            const isSelected = idx === currentModeIndex;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setCurrentModeIndex(idx);
                  setIsAutoCycling(false);
                }}
                className={`group flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10.5px] font-sans font-bold tracking-wider transition-all duration-300 cursor-pointer backdrop-blur-md ${
                  isSelected
                    ? 'bg-white text-[#2D2926] shadow-lg scale-105 border border-white'
                    : 'bg-black/40 text-white/80 hover:text-white hover:bg-black/60 border border-white/10'
                }`}
              >
                <Icon className={`w-3 h-3 transition-colors ${isSelected ? 'text-[#E05A7E]' : 'text-white/60 group-hover:text-white'}`} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
