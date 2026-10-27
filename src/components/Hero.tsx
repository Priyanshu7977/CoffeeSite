import React, { useEffect, useRef } from 'react';
import { Sparkles, Compass } from 'lucide-react';
import { gsap } from '../utils/animations';

interface HeroProps {
  onExplore?: () => void;
}

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

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const textContainer = textContainerRef.current;

    if (!section || !video || !textContainer) return;

    // Ensure video plays smoothly
    video.play().catch(() => {});

    const ctx = gsap.context(() => {
      // 1. Initial Page Load Typography Entrance
      const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      introTl
        .fromTo(
          video,
          { scale: 1.15, opacity: 0 },
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

      // 2. Smooth, non-pinning cinematic parallax scroll (no jumping or scroll hijacking)
      gsap.to(video, {
        yPercent: 12,
        scale: 1.08,
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
        y: 35,
        scale: 0.96,
        opacity: 0,
        filter: 'blur(4px)',
        ease: 'power1.out',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '55% top',
          scrub: 0.6,
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
      className="relative min-h-[100dvh] w-full overflow-hidden bg-[#1F1C1A] flex flex-col items-center justify-center pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16"
    >
      {/* Background Full-Screen Real Macro Coffee Brewing Video */}
      <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden bg-[#1F1C1A]">
        <video
          ref={videoRef}
          src="/assets/videos/coffee-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover object-center will-change-transform opacity-100 filter brightness-95 contrast(110%)"
        />
        {/* Cinematic Overlays: Warm Espresso Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1C1A] via-transparent to-[#1F1C1A]/65 pointer-events-none" />
        <div className="absolute inset-0 bg-[#1F1C1A]/35 pointer-events-none" />
      </div>

      {/* Floating Heritage Badge - Top Right */}
      <div
        ref={badgeRef}
        className="absolute top-24 sm:top-28 lg:top-32 right-6 sm:right-10 z-20 hidden lg:flex items-center gap-2 rounded-full border border-[#2D2926]/10 bg-white/90 px-3.5 py-1.5 backdrop-blur-md shadow-md text-[#2D2926]"
      >
        <Compass className="h-3.5 w-3.5 text-[#E05A7E] animate-spin-slow" />
        <span className="text-[9px] sm:text-[10px] tracking-[0.22em] text-[#2D2926] font-sans uppercase font-bold">
          Altitude: 1,900M ASL • Baba Budan Giri
        </span>
      </div>

      {/* Hero Typography Container: Fluid Vertically Constrained */}
      <div
        ref={textContainerRef}
        className="relative z-20 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-4 sm:px-6 text-center will-change-transform select-none"
      >
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="mb-4 sm:mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5DADF] text-[#2D2926] text-[10px] sm:text-xs tracking-[0.25em] font-sans font-bold uppercase shadow-sm"
        >
          <Sparkles className="h-3 w-3 text-[#E05A7E]" />
          <span>NOIR DAKSHIN ROAST / BABA BUDAN ROASTERY EST. 1998</span>
        </div>

        {/* Monumental Modern Headline in Space Grotesk */}
        <div className="flex flex-col leading-[0.95] tracking-[-0.02em] text-white">
          <h1
            ref={titleLine1Ref}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-2xl"
          >
            KAAPI,
          </h1>
          <h1
            ref={titleLine2Ref}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-[#F5DADF] italic my-0.5 sm:my-1.5 drop-shadow-[0_0_35px_rgba(245,218,223,0.5)]"
          >
            WITHOUT
          </h1>
          <h1
            ref={titleLine3Ref}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-widest text-white uppercase drop-shadow-[0_0_35px_rgba(245,218,223,0.35)]"
          >
            COMPROMISE.
          </h1>
        </div>

        {/* Editorial Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-4 sm:mt-6 max-w-md font-sans text-xs sm:text-sm tracking-[0.2em] uppercase text-[#FAF7F5] font-semibold leading-relaxed"
        >
          Shade-Grown Western Ghats Terroir. Slow Cast-Iron Convection.
        </p>

        {/* Ambient Pill */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-sans tracking-[0.2em] text-[#F5DADF]/85 uppercase font-medium">
          <span>Batch No. 0984-DAKSHIN</span>
          <span>•</span>
          <span>Chikmagalur 1,900M</span>
          <span>•</span>
          <span>Malabar Monsooned</span>
        </div>
      </div>
    </section>
  );
};
