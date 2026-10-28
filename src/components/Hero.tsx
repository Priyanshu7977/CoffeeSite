import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Compass } from 'lucide-react';
import { gsap } from '../utils/animations';

interface HeroProps {
  onExplore?: () => void;
}

interface HeroVisualScene {
  id: string;
  label: string;
  badgeText: string;
  src: string;
}

const HERO_SCENES: HeroVisualScene[] = [
  {
    id: 'terroir',
    label: 'Estate Terroir',
    badgeText: '01/05 Terroir • 1,900M ASL Baba Budan Range',
    src: '/assets/hero-estate-plantation.jpg',
  },
  {
    id: 'harvest',
    label: 'Crimson Cherries',
    badgeText: '02/05 Harvest • Selective Shade-Grown Handpick',
    src: '/assets/hero-crimson-cherries.jpg',
  },
  {
    id: 'roast',
    label: 'Cast-Iron Roast',
    badgeText: '03/05 Roastery • Slow Cast-Iron Convection',
    src: '/assets/hero-roasting-drum.jpg',
  },
  {
    id: 'cooling',
    label: 'Peaberry Discharge',
    badgeText: '04/05 Cooling • Rapid Sweep Arm Chilling',
    src: '/assets/hero-cooling-beans.jpg',
  },
  {
    id: 'kaapi',
    label: 'Brass Filter Kaapi',
    badgeText: '05/05 Ritual • Traditional Brass Davarah Extraction',
    src: '/assets/hero-brass-kaapi.jpg',
  },
];

export const Hero: React.FC<HeroProps> = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const titleLine1Ref = useRef<HTMLHeadingElement | null>(null);
  const titleLine2Ref = useRef<HTMLHeadingElement | null>(null);
  const titleLine3Ref = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);

  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);

  // Preload all assets and play each after 1 second like an animated montage video
  useEffect(() => {
    HERO_SCENES.forEach((scene) => {
      const img = new Image();
      img.src = scene.src;
    });

    const interval = setInterval(() => {
      setCurrentSceneIndex((prev) => (prev + 1) % HERO_SCENES.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const textContainer = textContainerRef.current;

    if (!section || !container || !textContainer) return;

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
      {/* Dynamic Background Showcase: 1-Second Fast Montage Video Animation */}
      <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden bg-[#1F1C1A]">
        {HERO_SCENES.map((scene, idx) => {
          const isActive = idx === currentSceneIndex;
          return (
            <div
              key={scene.id}
              className={`absolute inset-0 transition-opacity duration-300 ease-in-out will-change-transform overflow-hidden ${
                isActive ? 'opacity-100 z-1' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={scene.src}
                alt={scene.label}
                className="h-full w-full object-cover object-center filter brightness-95 contrast-105"
              />
            </div>
          );
        })}

        {/* Cinematic Overlays: Warm Espresso Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1C1A] via-transparent to-[#1F1C1A]/70 pointer-events-none z-2" />
        <div className="absolute inset-0 bg-[#1F1C1A]/35 pointer-events-none z-2" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.05)_0%,rgba(31,28,26,0.65)_100%)] pointer-events-none z-2" />
      </div>

      {/* Floating Heritage Badge - Dynamic with Active Scene */}
      <div
        ref={badgeRef}
        className="absolute top-20 sm:top-22 lg:top-24 right-5 sm:right-8 z-20 hidden lg:flex items-center gap-2 rounded-full border border-white/15 bg-black/45 backdrop-blur-md px-3.5 py-1.5 shadow-lg text-white"
      >
        <Compass className="h-3.5 w-3.5 text-[#E05A7E] animate-spin-slow shrink-0" />
        <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#FAF7F5] font-sans uppercase font-bold transition-all duration-300">
          {HERO_SCENES[currentSceneIndex].badgeText}
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

        {/* Live Cinema Reel Segment Indicator (Replaces static pill buttons) */}
        <div className="mt-4 sm:mt-5 flex items-center justify-center gap-1.5 z-20">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/10 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E05A7E] animate-ping" />
            <span className="text-[9px] font-mono tracking-widest text-[#F5DADF] uppercase font-bold">
              Live Reel
            </span>
            <div className="flex items-center gap-1 ml-0.5">
              {HERO_SCENES.map((scene, idx) => (
                <div
                  key={scene.id}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === currentSceneIndex
                      ? 'w-5 sm:w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      : 'w-1.5 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
