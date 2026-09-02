import React, { useEffect, useRef } from 'react';
import { ChevronDown, Sparkles, Compass } from 'lucide-react';
import { gsap } from '../utils/animations';
import { MagneticButton } from './MagneticButton';

interface HeroProps {
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const titleLine1Ref = useRef<HTMLHeadingElement | null>(null);
  const titleLine2Ref = useRef<HTMLHeadingElement | null>(null);
  const titleLine3Ref = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const circularMaskRef = useRef<HTMLDivElement | null>(null);
  const transitionVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const textContainer = textContainerRef.current;
    const circularMask = circularMaskRef.current;

    if (!section || !video || !textContainer || !circularMask) return;

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
          [ctaRef.current, badgeRef.current],
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
          '-=0.5'
        );

      // 2. Full Pinned Cinematic Video ScrollTrigger Sequence
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      scrollTl
        .fromTo(
          video,
          { scale: 1.0, opacity: 1, yPercent: 0, filter: 'blur(0px) brightness(0.9) contrast(115%)' },
          { scale: 1.22, opacity: 0.3, yPercent: 8, filter: 'blur(3px) brightness(0.7) contrast(120%)', ease: 'none', duration: 1.0 },
          0
        )
        .fromTo(
          textContainer,
          { y: 0, opacity: 1 },
          { y: -120, opacity: 0, ease: 'power1.in', duration: 0.8 },
          0
        )
        .fromTo(
          circularMask,
          { clipPath: 'circle(0% at 50% 50%)', opacity: 0 },
          { clipPath: 'circle(120% at 50% 50%)', opacity: 1, ease: 'power2.out', duration: 1.0 },
          0.25
        );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#070605] flex items-center justify-center"
    >
      {/* Background Full-Screen Real Macro Coffee Brewing Video */}
      <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden bg-[#070605]">
        <video
          ref={videoRef}
          src="/assets/videos/coffee-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover object-center will-change-transform opacity-100 filter brightness-90 contrast-115"
        />
        {/* Cinematic Overlays: Vignette, Black Gradients, Subtle Amber Tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070605] via-transparent to-[#070605]/65 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />
        <div className="absolute inset-0 bg-[#070605]/30 pointer-events-none" />
      </div>

      {/* Circular Organic Aperture Transition Video / Next Chapter Reveal */}
      <div
        ref={circularMaskRef}
        className="absolute inset-0 z-10 pointer-events-none overflow-hidden will-change-transform opacity-0"
        style={{ clipPath: 'circle(0% at 50% 50%)' }}
      >
        <video
          ref={transitionVideoRef}
          src="/assets/videos/coffee-bloom-transition.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover object-center filter brightness-85 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070605] via-[#070605]/40 to-[#070605]" />
      </div>

      {/* Floating Heritage Badge - Top Right */}
      <div
        ref={badgeRef}
        className="absolute top-20 sm:top-24 right-6 sm:right-10 z-20 hidden lg:flex items-center gap-2 rounded-full border border-[#c89658]/35 bg-[#070605]/80 px-3.5 py-1.5 backdrop-blur-md shadow-lg"
      >
        <Compass className="h-3.5 w-3.5 text-[#c89658] animate-spin-slow" />
        <span className="text-[9px] sm:text-[10px] tracking-[0.22em] text-[#e5b877] font-sans uppercase">
          Altitude: 1,900M ASL • Baba Budan Giri
        </span>
      </div>

      {/* Hero Typography Container: Fluid Vertically Constrained */}
      <div
        ref={textContainerRef}
        className="relative z-20 mx-auto flex h-full max-h-[85vh] max-w-5xl flex-col items-center justify-center px-6 text-center will-change-transform select-none py-8"
      >
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="mb-3 sm:mb-5 flex items-center gap-3 text-[11px] sm:text-xs tracking-[0.3em] text-[#c89658] font-sans font-semibold uppercase"
        >
          <span className="h-[1px] w-6 bg-[#c89658]/70" />
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-[#c89658]" />
            NOIR DAKSHIN ROAST / BABA BUDAN ATELIER EST. 1998
          </span>
          <span className="h-[1px] w-6 bg-[#c89658]/70" />
        </div>

        {/* Monumental Editorial Headline */}
        <div className="flex flex-col leading-[0.95] tracking-[-0.02em] text-[#f4eee6]">
          <h1
            ref={titleLine1Ref}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-[#f4eee6] drop-shadow-2xl"
          >
            KAAPI,
          </h1>
          <h1
            ref={titleLine2Ref}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-[#e5b877] italic my-0.5 sm:my-1.5 drop-shadow-2xl"
          >
            WITHOUT
          </h1>
          <h1
            ref={titleLine3Ref}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-widest text-[#f4eee6] uppercase drop-shadow-[0_0_35px_rgba(200,150,88,0.35)]"
          >
            COMPROMISE.
          </h1>
        </div>

        {/* Editorial Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-4 sm:mt-6 max-w-md font-sans text-xs sm:text-sm tracking-[0.2em] uppercase text-[#a89d93] font-light"
        >
          Shade-Grown Western Ghats Terroir. Slow Cast-Iron Convection.
        </p>

        {/* Ambient Pill */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-sans tracking-[0.2em] text-[#8c827a] uppercase">
          <span>Batch No. 0984-DAKSHIN</span>
          <span>•</span>
          <span>Chikmagalur 1,900M</span>
          <span>•</span>
          <span>Malabar Monsooned</span>
        </div>
      </div>

      {/* Bottom Scroll Indicator with Magnetic Physics */}
      <div
        ref={ctaRef}
        className="absolute bottom-6 sm:bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <MagneticButton onClick={onExplore} strength={0.4}>
          <div className="flex flex-col items-center gap-2 group">
            <span className="text-[9px] tracking-[0.3em] font-sans uppercase text-[#8c827a] transition-colors group-hover:text-[#c89658]">
              SCROLL TO DISCOVER
            </span>
            <div className="flex h-8 w-5 items-start justify-center rounded-full border border-[#c89658]/40 p-1 transition-all group-hover:border-[#c89658] group-hover:shadow-[0_0_15px_rgba(200,150,88,0.3)]">
              <ChevronDown className="h-3.5 w-3.5 text-[#c89658] animate-bounce" />
            </div>
          </div>
        </MagneticButton>
      </div>
    </section>
  );
};
