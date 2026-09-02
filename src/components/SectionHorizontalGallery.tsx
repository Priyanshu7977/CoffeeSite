import React, { useEffect, useRef, useState } from 'react';
import { Mountain, Sun, Flame, Droplet, Sparkles, Compass } from 'lucide-react';
import { gsap } from '../utils/animations';

export const SectionHorizontalGallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const slides = [
    {
      id: '01',
      tag: 'TERROIR & ELEVATION',
      title: 'CHIKMAGALUR',
      location: 'Baba Budan Giri & Mullayanagiri • 1,900m ASL',
      quote: 'Shade-grown under native silver oak, wild pepper, and cardamom canopies since 1670.',
      image: '/assets/origin-beans.jpg',
      icon: Mountain,
      accent: '#c89658',
    },
    {
      id: '02',
      tag: 'MONSOON CURING',
      title: 'MALABAR SHORE',
      location: 'Arabian Sea Shorelines • 16-Week Wind Curing',
      quote: 'Raw beans naturally conditioned by ocean winds, developing sweet chocolate richness.',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&auto=format&fit=crop&q=85',
      icon: Sun,
      accent: '#e5b877',
    },
    {
      id: '03',
      tag: 'THERMAL ALCHEMY',
      title: 'CAST IRON ROAST',
      location: 'Bengaluru & Chikmagalur • 204°C First Crack',
      quote: 'Acoustic drum convection releases locked cardamom oils and deep jaggery molasses.',
      image: '/assets/roast-drum.jpg',
      icon: Flame,
      accent: '#d97706',
    },
    {
      id: '04',
      tag: 'EXTRACTION CEREMONY',
      title: 'FILTER KAAPI',
      location: 'Brass Davarah & Tumbler • Meter-High Froth Aeration',
      quote: 'Liquid velvet cascading between brass vessels, aerated naturally without steam.',
      image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=1200&auto=format&fit=crop&q=85',
      icon: Droplet,
      accent: '#c89658',
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const slideElements = slidesRef.current.filter(Boolean) as HTMLDivElement[];
      const totalSlides = slideElements.length;

      // Initialize all slides: Slide 0 is centered at xPercent: 0, Slides 1..3 start offscreen at xPercent: 100
      slideElements.forEach((el, idx) => {
        gsap.set(el, {
          xPercent: idx === 0 ? 0 : 100,
          zIndex: idx + 1,
          opacity: 1,
          boxShadow: idx === 0 ? 'none' : '-25px 0 60px rgba(0,0,0,0.85)',
        });
      });

      // Pinned sequential timeline enabled on all viewports (Mobile, Tablet, Desktop)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${(totalSlides + 1.2) * 100}%`,
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: [0, 0.28, 0.58, 0.88],
            duration: { min: 0.25, max: 0.5 },
            delay: 0.05,
            ease: 'power2.inOut',
          },
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.2) {
              setActiveSlideIndex(0);
            } else if (p < 0.45) {
              setActiveSlideIndex(1);
            } else if (p < 0.75) {
              setActiveSlideIndex(2);
            } else {
              setActiveSlideIndex(3);
            }
          },
        },
      });

      timelineRef.current = tl;

      // 1. Dwell on Slide 0 (Chikmagalur)
      tl.to({}, { duration: 0.5 });

      // 2. Slide 1 (Malabar Shore) slides in from RIGHT to LAND ON SCREEN
      tl.to(
        slideElements[0],
        { xPercent: -18, scale: 0.96, filter: 'brightness(0.55)', ease: 'power2.inOut', duration: 1.0 },
        'step1'
      ).to(
        slideElements[1],
        { xPercent: 0, ease: 'power2.out', duration: 1.0 },
        'step1'
      );

      // Dwell on Slide 1
      tl.to({}, { duration: 0.6 });

      // 3. Slide 2 (Cast Iron Roast) slides in from RIGHT to LAND ON SCREEN
      tl.to(
        slideElements[1],
        { xPercent: -18, scale: 0.96, filter: 'brightness(0.55)', ease: 'power2.inOut', duration: 1.0 },
        'step2'
      ).to(
        slideElements[2],
        { xPercent: 0, ease: 'power2.out', duration: 1.0 },
        'step2'
      );

      // Dwell on Slide 2
      tl.to({}, { duration: 0.6 });

      // 4. Slide 3 (Filter Kaapi) slides in from RIGHT to LAND ON SCREEN
      tl.to(
        slideElements[2],
        { xPercent: -18, scale: 0.96, filter: 'brightness(0.55)', ease: 'power2.inOut', duration: 1.0 },
        'step3'
      ).to(
        slideElements[3],
        { xPercent: 0, ease: 'power2.out', duration: 1.0 },
        'step3'
      );

      // Final dwell hold on Slide 3 before releasing pin
      tl.to({}, { duration: 0.8 });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [slides.length]);

  const goToSlide = (targetIdx: number) => {
    setActiveSlideIndex(targetIdx);
    const slideElements = slidesRef.current.filter(Boolean) as HTMLDivElement[];

    slideElements.forEach((slide, i) => {
      if (i < targetIdx) {
        gsap.to(slide, {
          xPercent: -18,
          scale: 0.96,
          filter: 'brightness(0.55)',
          duration: 0.5,
          ease: 'power2.out',
        });
      } else if (i === targetIdx) {
        gsap.to(slide, {
          xPercent: 0,
          scale: 1.0,
          filter: 'brightness(1)',
          duration: 0.5,
          ease: 'power2.out',
        });
      } else {
        gsap.to(slide, {
          xPercent: 100,
          scale: 1.0,
          filter: 'brightness(1)',
          duration: 0.5,
          ease: 'power2.out',
        });
      }
    });
  };

  return (
    <section
      id="section-gallery"
      ref={sectionRef}
      aria-label="Section 05: Cinematic Magazine Archive Spreads"
      className="relative h-screen w-full bg-[#070605] overflow-hidden border-t border-[#221c17]"
    >
      {/* Top Floating Gallery Header */}
      <div className="absolute top-3 sm:top-5 left-3 sm:left-6 md:left-12 right-3 sm:right-6 md:right-12 z-40 flex items-center justify-between gap-2 sm:gap-3 pointer-events-auto">
        <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#c89658] font-sans font-semibold uppercase bg-[#070605]/90 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[#c89658]/40 backdrop-blur-md shadow-lg">
          <Sparkles className="h-2.5 sm:h-3 w-2.5 sm:w-3 text-[#c89658]" />
          <span>DAKSHIN MAGAZINE</span>
        </div>

        {/* Interactive Spread Navigation Indicators */}
        <div className="flex items-center gap-1 p-0.5 sm:p-1 rounded-full bg-[#070605]/90 border border-[#c89658]/35 backdrop-blur-md shadow-lg">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => goToSlide(idx)}
              className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                activeSlideIndex === idx
                  ? 'bg-[#c89658] text-[#070605] font-bold shadow-[0_0_12px_rgba(200,150,88,0.45)]'
                  : 'text-[#8c827a] hover:text-[#f4eee6]'
              }`}
            >
              0{idx + 1} <span className="hidden sm:inline">• {s.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Full-Screen Magazine Spreads Stack (100% full screen on all viewports) */}
      <div className="relative h-full w-full">
        {slides.map((slide, idx) => {
          const Icon = slide.icon;

          return (
            <div
              key={slide.id}
              ref={(el) => {
                slidesRef.current[idx] = el;
              }}
              className="absolute inset-0 h-full w-full flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20 overflow-hidden select-none will-change-transform bg-[#070605]"
            >
              {/* Background Full Bleed Spread Photography */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover object-center filter brightness-[0.52] contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#070605]/95 via-[#070605]/75 to-[#070605]/90" />
                <div className="absolute inset-0 bg-radial-vignette opacity-85" />
              </div>

              {/* Spread Magazine Layout */}
              <div className="relative z-10 mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12 items-center py-10 lg:py-0">
                {/* Left Side: Headline & Quote */}
                <div className="lg:col-span-7 flex flex-col justify-center max-w-full">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#c89658]">
                      Spread 0{idx + 1} of 04
                    </span>
                    <span className="h-[1px] w-6 sm:w-10 bg-[#c89658]/40" />
                    <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.2em] text-[#8c827a] uppercase">
                      {slide.tag}
                    </span>
                  </div>

                  {/* Strictly Non-Breaking Responsive Title */}
                  <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-wider text-[#f4eee6] uppercase drop-shadow-[0_0_35px_rgba(200,150,88,0.25)] leading-tight my-1 sm:my-2 whitespace-nowrap">
                    {slide.title}
                  </h2>

                  <p className="font-serif italic text-sm sm:text-lg md:text-xl lg:text-2xl text-[#e5b877] max-w-xl mt-1.5 sm:mt-3 leading-relaxed">
                    “{slide.quote}”
                  </p>
                </div>

                {/* Right Side: Editorial Metadata Card */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="rounded-2xl sm:rounded-3xl bg-[#0f0c09]/95 border border-[#c89658]/40 p-4 sm:p-7 backdrop-blur-xl shadow-2xl space-y-3 sm:space-y-5">
                    <div className="flex items-center justify-between border-b border-[#221c17] pb-2.5 sm:pb-4">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 sm:h-5 w-4 sm:w-5 text-[#c89658]" />
                        <span className="text-[10px] sm:text-xs font-sans tracking-[0.2em] text-[#f4eee6] uppercase font-bold">
                          Atelier Specification
                        </span>
                      </div>
                      <span className="font-mono text-base sm:text-xl font-bold text-[#c89658]">
                        {slide.id}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.2em] text-[#8c827a] uppercase block mb-0.5 sm:mb-1">
                        Location & Terroir
                      </span>
                      <span className="font-serif text-xs sm:text-base text-[#f4eee6]">
                        {slide.location}
                      </span>
                    </div>

                    <div className="pt-2 sm:pt-3 border-t border-[#221c17] flex items-center justify-between text-[10px] sm:text-xs text-[#8c827a]">
                      <div className="flex items-center gap-1.5 font-mono text-[#8c827a]">
                        <Compass className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#c89658]" />
                        <span>Dakshin Archive</span>
                      </div>
                      <span className="font-mono text-[#e5b877] font-bold">
                        0{idx + 1} / 04
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Spread Marker */}
              <div className="absolute bottom-3 sm:bottom-5 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between border-t border-[#221c17]/60 pt-2 sm:pt-3 text-[8px] sm:text-[10px] font-mono text-[#8c827a] uppercase tracking-widest">
                <span>NOIR DAKSHIN ROAST 1998–2026</span>
                <span>{slide.title} • SPREAD 0{idx + 1}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
