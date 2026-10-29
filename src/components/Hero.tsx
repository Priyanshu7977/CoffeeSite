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
      {/* Background Full-Screen Real Macro Coffee Brewing Video */}
      <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden bg-[#1F1C1A]">
        <video
          ref={videoRef}
          src="/assets/videos/coffee-hero.mp4"
          poster="/assets/hero-aperture-reveal.jpg"
          preload="metadata"
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
        className="absolute top-20 sm:top-22 lg:top-24 right-5 sm:right-8 z-20 hidden lg:flex items-center gap-2 rounded-full border border-[#2D2926]/10 bg-white/90 px-3 py-1 backdrop-blur-md shadow-md text-[#2D2926]"
      >
        <Compass className="h-3 w-3 text-[#E05A7E] animate-spin-slow" />
        <span className="text-[8.5px] sm:text-[9.5px] tracking-[0.2em] text-[#2D2926] font-sans uppercase font-bold">
          Altitude: 1,900M ASL • Baba Budan Giri
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
          className="mb-2 sm:mb-3.5 inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#F5DADF] text-[#2D2926] text-[9px] sm:text-[10px] md:text-xs tracking-[0.16em] sm:tracking-[0.22em] font-sans font-bold uppercase shadow-sm max-w-full"
        >
          <Sparkles className="h-3 w-3 text-[#E05A7E] shrink-0" />
          <span className="hidden sm:inline">NOIR ROAST / BABA BUDAN ROASTERY EST. 1998</span>
          <span className="sm:hidden truncate">NOIR ROAST • EST. 1998</span>
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
            className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] font-bold tracking-wider sm:tracking-widest text-white uppercase drop-shadow-[0_0_35px_rgba(245,218,223,0.35)]"
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

        {/* Ambient Pill */}
        <div className="mt-2 sm:mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[9px] sm:text-[10px] md:text-[11px] font-sans tracking-[0.14em] sm:tracking-[0.18em] text-[#F5DADF]/85 uppercase font-medium">
          <span className="whitespace-nowrap">Batch No. 0984-DAKSHIN</span>
          <span className="hidden sm:inline">•</span>
          <span className="whitespace-nowrap">Chikmagalur 1,900M</span>
          <span className="hidden sm:inline">•</span>
          <span className="whitespace-nowrap">Malabar Monsooned</span>
        </div>
      </div>
    </section>
  );
};
