import React, { useEffect, useRef } from 'react';
import { Mountain, Sun, Flame, Droplet, ArrowRight, Sparkles } from 'lucide-react';
import { gsap } from '../utils/animations';

export const SectionHorizontalGallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const slides = [
    {
      id: '01',
      tag: 'TERROIR & ELEVATION',
      title: 'COFFEE FARM',
      location: 'Bench Maji & Gesha Village • 2,400m ASL',
      quote: 'High altitude slows cherry ripening, generating dense complex sugars under acacia canopy.',
      image: '/assets/origin-beans.jpg',
      icon: Mountain,
      accent: '#c89658',
    },
    {
      id: '02',
      tag: 'NATURAL DRYING',
      title: 'GREEN BEANS',
      location: 'African Raised Beds • 32 Days Slow Cure',
      quote: 'Whole cherries are rotated by hand every 45 minutes on ventilated mesh beds.',
      image: '/assets/cupping-notes.jpg',
      icon: Sun,
      accent: '#e5b877',
    },
    {
      id: '03',
      tag: 'THERMAL ALCHEMY',
      title: 'ROASTING',
      location: '12kg Cast-Iron Drum • 204°C First Crack',
      quote: 'Convection heat creates the acoustic cell fracture that frees locked aromatic oils.',
      image: '/assets/roast-drum.jpg',
      icon: Flame,
      accent: '#d97706',
    },
    {
      id: '04',
      tag: 'EXTRACTION CEREMONY',
      title: 'ESPRESSO',
      location: '9.0 Bar Pressure • 1:2 Golden Ratio',
      quote: 'Liquid velvet cascading through bottomless portafilters into heated porcelain.',
      image: '/assets/pour-espresso.jpg',
      icon: Droplet,
      accent: '#c89658',
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const totalSlides = slides.length;
      const xPercentage = -((totalSlides - 1) / totalSlides) * 100;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        // Pinned timeline with dedicated hold / dwell phase on the final 4th spread
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${(totalSlides + 1.6) * 100}%`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1. Smooth horizontal pan across all spreads (0.0 -> 0.75 progress)
        tl.to(
          track,
          {
            xPercent: xPercentage,
            ease: 'none',
            duration: 0.75,
          },
          0
        );

        // 2. Dedicated Hold / Dwell Window for Spread 04 (0.75 -> 1.0 progress)
        // Spread 04 stays static, fully visible, and displayed while scrolling before unpinning
        tl.to({}, { duration: 0.25 }, 0.75);
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [slides.length]);

  return (
    <section
      id="section-gallery"
      ref={sectionRef}
      aria-label="Section 05: Cinematic Magazine Archive Spreads"
      className="relative min-h-screen lg:h-screen w-full bg-[#070605] overflow-hidden border-t border-[#221c17]"
    >
      {/* Top Floating Gallery Eyebrow */}
      <div className="absolute top-6 left-6 md:left-12 z-30 flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs tracking-[0.3em] text-[#c89658] font-sans font-semibold uppercase bg-[#070605]/80 px-4 py-1.5 rounded-full border border-[#c89658]/30 backdrop-blur-md">
          <Sparkles className="h-3 w-3 text-[#c89658]" />
          <span>CINEMATIC ARCHIVE / MAGAZINE SPREADS</span>
        </div>
      </div>

      {/* Horizontal Moving Track on Desktop, Stacked on Mobile */}
      <div
        ref={trackRef}
        className="flex flex-col lg:flex-row h-auto lg:h-full w-full lg:w-[400vw] will-change-transform"
      >
        {slides.map((slide, idx) => {
          const Icon = slide.icon;
          const isLast = idx === slides.length - 1;

          return (
            <div
              key={slide.id}
              className="relative flex min-h-screen lg:h-screen w-full lg:w-screen flex-shrink-0 items-center justify-center p-6 md:p-12 lg:p-20 overflow-hidden select-none border-b lg:border-b-0 border-[#1c1612]"
            >
              {/* Background Full Bleed Spread Photography */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover object-center filter brightness-[0.55] contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#070605]/95 via-[#070605]/60 to-[#070605]/90" />
                <div className="absolute inset-0 bg-radial-vignette opacity-80" />
              </div>

              {/* Spread Magazine Layout */}
              <div className="relative z-10 mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-16 lg:py-0">
                {/* Left Side: Headline & Quote */}
                <div className="lg:col-span-7 flex flex-col justify-center max-w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#c89658]">
                      Spread 0{idx + 1} of 04
                    </span>
                    <span className="h-[1px] w-12 bg-[#c89658]/40" />
                    <span className="text-[10px] font-sans tracking-[0.2em] text-[#8c827a] uppercase">
                      {slide.tag}
                    </span>
                  </div>

                  <h2 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-bold tracking-wider lg:tracking-[0.14em] text-[#f4eee6] uppercase drop-shadow-[0_0_35px_rgba(200,150,88,0.25)] leading-[0.95] my-2 break-words">
                    {slide.title}
                  </h2>

                  <p className="font-serif italic text-base sm:text-xl md:text-2xl text-[#e5b877] max-w-xl mt-4 leading-relaxed">
                    “{slide.quote}”
                  </p>
                </div>

                {/* Right Side: Editorial Metadata Card */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="rounded-2xl bg-[#0f0c09]/95 border border-[#c89658]/35 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
                    <div className="flex items-center justify-between border-b border-[#221c17] pb-4">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-[#c89658]" />
                        <span className="text-xs font-sans tracking-[0.2em] text-[#f4eee6] uppercase font-bold">
                          Atelier Specification
                        </span>
                      </div>
                      <span className="font-mono text-xl font-bold text-[#c89658]">
                        {slide.id}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-sans tracking-[0.2em] text-[#8c827a] uppercase block mb-1">
                        Location & Altitude
                      </span>
                      <span className="font-serif text-base sm:text-lg text-[#f4eee6]">
                        {slide.location}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-[#221c17] flex items-center justify-between text-xs text-[#8c827a]">
                      <span className="font-sans uppercase tracking-[0.15em]">
                        Continuous Film Pan
                      </span>
                      <span className="flex items-center gap-1.5 font-mono text-[#e5b877]">
                        <span>{isLast ? 'Final Spread (Hold)' : 'Scroll Down to Pan'}</span>
                        <ArrowRight className="h-3 w-3 animate-pulse" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Spread Marker */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between border-t border-[#221c17]/60 pt-3 text-[10px] font-mono text-[#8c827a] uppercase tracking-widest">
                <span>NOIR ROAST ARCHIVE 1998–2026</span>
                <span>{slide.title} • SPREAD 0{idx + 1}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
