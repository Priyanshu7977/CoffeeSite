import React, { useEffect, useRef, useState } from 'react';
import { Mountain, Sun, Flame, Droplet, Sparkles, Compass } from 'lucide-react';
import { gsap } from '../utils/animations';

export const SectionHorizontalGallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
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
      image: '/assets/cupping-notes.jpg',
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
      image: '/assets/pour-espresso.jpg',
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

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        // Initialize slides: Slide 0 is 100% visible, remaining are hidden
        slideElements.forEach((el, idx) => {
          gsap.set(el, {
            opacity: idx === 0 ? 1 : 0,
            y: idx === 0 ? 0 : 35,
            scale: idx === 0 ? 1 : 0.96,
            pointerEvents: idx === 0 ? 'auto' : 'none',
          });
        });

        // Pinned sequential timeline: Each spread stays 100% full screen until scrolled
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${(totalSlides + 1.5) * 100}%`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              // Map progress cleanly to active index
              const mapped = Math.min(totalSlides - 1, Math.floor(p * totalSlides));
              setActiveSlideIndex(mapped);
            },
          },
        });

        // Sequential Transitions: Each spread holds, then cleanly transitions to the next
        slideElements.forEach((slide, i) => {
          if (i === 0) return;

          const prevSlide = slideElements[i - 1];
          const startTime = (i - 0.15) / totalSlides;

          // Previous spread smoothly exits
          tl.to(
            prevSlide,
            {
              opacity: 0,
              y: -30,
              scale: 0.96,
              pointerEvents: 'none',
              ease: 'power2.inOut',
              duration: 0.08,
            },
            startTime
          );

          // Current spread lands 100% full-screen and crisp
          tl.fromTo(
            slide,
            {
              opacity: 0,
              y: 30,
              scale: 0.96,
              pointerEvents: 'none',
            },
            {
              opacity: 1,
              y: 0,
              scale: 1.0,
              pointerEvents: 'auto',
              ease: 'power2.out',
              duration: 0.1,
            },
            startTime + 0.04
          );
        });

        // Dedicated dwell hold for the final 4th spread before releasing pin
        tl.to({}, { duration: 0.2 }, 0.8);
      });

      mm.add('(max-width: 1023px)', () => {
        // On mobile, slides are stacked naturally
        slideElements.forEach((el) => {
          gsap.set(el, { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto' });
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [slides.length]);

  const goToSlide = (idx: number) => {
    setActiveSlideIndex(idx);
    const slideElements = slidesRef.current.filter(Boolean) as HTMLDivElement[];
    slideElements.forEach((slide, i) => {
      gsap.to(slide, {
        opacity: i === idx ? 1 : 0,
        y: i === idx ? 0 : 25,
        scale: i === idx ? 1 : 0.96,
        pointerEvents: i === idx ? 'auto' : 'none',
        duration: 0.45,
        ease: 'power2.out',
      });
    });
  };

  return (
    <section
      id="section-gallery"
      ref={sectionRef}
      aria-label="Section 05: Cinematic Magazine Archive Spreads"
      className="relative min-h-screen lg:h-screen w-full bg-[#070605] overflow-hidden border-t border-[#221c17]"
    >
      {/* Top Floating Gallery Header */}
      <div className="absolute top-5 left-4 sm:left-6 md:left-12 right-4 sm:right-6 md:right-12 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.25em] text-[#c89658] font-sans font-semibold uppercase bg-[#070605]/90 px-3.5 sm:px-4 py-1.5 rounded-full border border-[#c89658]/40 backdrop-blur-md shadow-lg">
          <Sparkles className="h-3 w-3 text-[#c89658]" />
          <span>CINEMATIC ARCHIVE / DAKSHIN MAGAZINE</span>
        </div>

        {/* Interactive Spread Navigation Indicators */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#070605]/90 border border-[#c89658]/35 backdrop-blur-md shadow-lg">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => goToSlide(idx)}
              className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                activeSlideIndex === idx
                  ? 'bg-[#c89658] text-[#070605] font-bold shadow-[0_0_12px_rgba(200,150,88,0.45)]'
                  : 'text-[#8c827a] hover:text-[#f4eee6]'
              }`}
            >
              0{idx + 1} • {s.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Full-Screen Stacked Spreads Container (100% Full Screen, Zero Half Cuts) */}
      <div className="relative h-auto lg:h-full w-full flex flex-col lg:block">
        {slides.map((slide, idx) => {
          const Icon = slide.icon;

          return (
            <div
              key={slide.id}
              ref={(el) => {
                slidesRef.current[idx] = el;
              }}
              className="relative lg:absolute lg:inset-0 min-h-screen lg:h-full w-full flex items-center justify-center p-6 md:p-12 lg:p-16 xl:p-20 overflow-hidden select-none will-change-transform border-b lg:border-b-0 border-[#1c1612]"
            >
              {/* Background Full Bleed Spread Photography */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover object-center filter brightness-[0.55] contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#070605]/95 via-[#070605]/65 to-[#070605]/90" />
                <div className="absolute inset-0 bg-radial-vignette opacity-85" />
              </div>

              {/* Spread Magazine Layout */}
              <div className="relative z-10 mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-16 lg:py-0">
                {/* Left Side: Headline & Quote */}
                <div className="lg:col-span-7 flex flex-col justify-center max-w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#c89658]">
                      Spread 0{idx + 1} of 04
                    </span>
                    <span className="h-[1px] w-10 bg-[#c89658]/40" />
                    <span className="text-[10px] font-sans tracking-[0.2em] text-[#8c827a] uppercase">
                      {slide.tag}
                    </span>
                  </div>

                  {/* Strictly Non-Breaking Title */}
                  <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-wider text-[#f4eee6] uppercase drop-shadow-[0_0_35px_rgba(200,150,88,0.25)] leading-tight my-2 whitespace-nowrap">
                    {slide.title}
                  </h2>

                  <p className="font-serif italic text-base sm:text-xl md:text-2xl text-[#e5b877] max-w-xl mt-3 leading-relaxed">
                    “{slide.quote}”
                  </p>
                </div>

                {/* Right Side: Editorial Metadata Card */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="rounded-3xl bg-[#0f0c09]/95 border border-[#c89658]/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
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
                        Location & Terroir
                      </span>
                      <span className="font-serif text-base sm:text-lg text-[#f4eee6]">
                        {slide.location}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-[#221c17] flex items-center justify-between text-xs text-[#8c827a]">
                      <div className="flex items-center gap-1.5 font-mono text-[#8c827a]">
                        <Compass className="h-3.5 w-3.5 text-[#c89658]" />
                        <span>Dakshin Magazine Archive</span>
                      </div>
                      <span className="font-mono text-[#e5b877] font-bold">
                        0{idx + 1} / 04
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Spread Marker */}
              <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between border-t border-[#221c17]/60 pt-3 text-[10px] font-mono text-[#8c827a] uppercase tracking-widest">
                <span>NOIR DAKSHIN ROAST ARCHIVE 1998–2026</span>
                <span>{slide.title} • SPREAD 0{idx + 1}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
