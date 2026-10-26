import React, { useEffect, useRef, useState } from 'react';
import { Mountain, Sun, Flame, Droplet, Compass, Sparkles } from 'lucide-react';
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
      location: 'Baba Budan Giri • 1,900m ASL',
      quote: 'Shade-grown under native silver oak, wild pepper, and cardamom canopies since 1670.',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1800&auto=format&fit=crop&q=85',
      icon: Mountain,
    },
    {
      id: '02',
      tag: 'MONSOON CURING',
      title: 'MALABAR SHORE',
      location: 'Arabian Sea Shoreline • 16-Week Wind Curing',
      quote: 'Raw beans naturally conditioned by ocean winds, developing sweet chocolate richness and low acidity.',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1800&auto=format&fit=crop&q=85',
      icon: Sun,
    },
    {
      id: '03',
      tag: 'THERMAL ALCHEMY',
      title: 'CAST IRON ROAST',
      location: 'Chikmagalur Roastery • 204°C First Crack',
      quote: 'Slow drum convection releases essential cardamom oils and deep caramel sweetness.',
      image: 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?w=1800&auto=format&fit=crop&q=85',
      icon: Flame,
    },
    {
      id: '04',
      tag: 'EXTRACTION CEREMONY',
      title: 'FILTER KAAPI',
      location: 'Traditional Brass Davarah & Tumbler',
      quote: 'Liquid velvet cascading between brass vessels, aerated naturally without steam.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1800&auto=format&fit=crop&q=85',
      icon: Droplet,
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const slideElements = slidesRef.current.filter(Boolean) as HTMLDivElement[];
      const totalSlides = slideElements.length;

      slideElements.forEach((el, idx) => {
        gsap.set(el, {
          xPercent: idx === 0 ? 0 : 100,
          zIndex: idx + 1,
          opacity: 1,
          boxShadow: idx === 0 ? 'none' : '-20px 0 50px rgba(0,0,0,0.85)',
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalSlides * 110}%`,
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: [0, 0.33, 0.66, 1],
            duration: { min: 0.25, max: 0.5 },
            delay: 0.05,
            ease: 'power2.inOut',
          },
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.25) setActiveSlideIndex(0);
            else if (p < 0.55) setActiveSlideIndex(1);
            else if (p < 0.85) setActiveSlideIndex(2);
            else setActiveSlideIndex(3);
          },
        },
      });

      timelineRef.current = tl;

      // 1. Dwell on Slide 0
      tl.to({}, { duration: 0.4 });

      // 2. Slide 1 (Malabar Shore)
      tl.to(
        slideElements[0],
        { xPercent: -15, scale: 0.96, opacity: 0.7, ease: 'power2.inOut', duration: 1.0 },
        'step1'
      ).to(
        slideElements[1],
        { xPercent: 0, ease: 'power2.out', duration: 1.0 },
        'step1'
      );
      tl.to({}, { duration: 0.4 });

      // 3. Slide 2 (Cast Iron Roast)
      tl.to(
        slideElements[1],
        { xPercent: -15, scale: 0.96, opacity: 0.7, ease: 'power2.inOut', duration: 1.0 },
        'step2'
      ).to(
        slideElements[2],
        { xPercent: 0, ease: 'power2.out', duration: 1.0 },
        'step2'
      );
      tl.to({}, { duration: 0.4 });

      // 4. Slide 3 (Filter Kaapi)
      tl.to(
        slideElements[2],
        { xPercent: -15, scale: 0.96, opacity: 0.7, ease: 'power2.inOut', duration: 1.0 },
        'step3'
      ).to(
        slideElements[3],
        { xPercent: 0, ease: 'power2.out', duration: 1.0 },
        'step3'
      );
      tl.to({}, { duration: 0.6 });
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
        gsap.to(slide, { xPercent: -15, scale: 0.96, opacity: 0.7, duration: 0.5, ease: 'power2.out' });
      } else if (i === targetIdx) {
        gsap.to(slide, { xPercent: 0, scale: 1.0, opacity: 1, duration: 0.5, ease: 'power2.out' });
      } else {
        gsap.to(slide, { xPercent: 100, scale: 1.0, opacity: 1, duration: 0.5, ease: 'power2.out' });
      }
    });
  };

  return (
    <section
      id="section-gallery"
      ref={sectionRef}
      aria-label="Section 05: Editorial Magazine Stories"
      className="relative h-screen w-full bg-[#FAF7F5] text-[#2D2926] overflow-hidden border-t border-[#2D2926]/10"
    >
      {/* Top Floating Magazine Header */}
      <div className="absolute top-4 sm:top-6 left-6 md:left-12 right-6 md:right-12 z-40 flex items-center justify-between pointer-events-auto border-b border-[#2D2926]/10 pb-3">
        <div className="text-xs tracking-[0.25em] text-[#2D2926] font-sans font-bold uppercase flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[#E05A7E]" />
          <span>05 / CINEMATIC ARCHIVE</span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-white/90 border border-[#2D2926]/10 p-1 backdrop-blur-md shadow-sm">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => goToSlide(idx)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                activeSlideIndex === idx
                  ? 'bg-[#F5DADF] text-[#2D2926] font-bold shadow-sm'
                  : 'text-[#8C827A] hover:text-[#2D2926]'
              }`}
            >
              0{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Full-Screen Magazine Spreads Stack */}
      <div className="relative h-full w-full">
        {slides.map((slide, idx) => {
          const Icon = slide.icon;

          return (
            <div
              key={slide.id}
              ref={(el) => {
                slidesRef.current[idx] = el;
              }}
              className="absolute inset-0 h-full w-full flex items-center justify-center p-6 sm:p-12 lg:p-16 overflow-hidden select-none will-change-transform bg-[#FAF7F5]"
            >
              {/* Background Photography */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover object-center filter brightness-95 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F5]/92 via-[#FAF7F5]/75 to-[#FAF7F5]/35" />
              </div>

              {/* Spread Magazine Content Grid */}
              <div className="relative z-10 mx-auto max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center py-10 lg:py-0">
                {/* Left: Headline & Quote */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <span className="text-xs tracking-[0.3em] font-sans uppercase text-[#E05A7E] font-bold mb-3">
                    {slide.tag}
                  </span>

                  {/* Headline */}
                  <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#2D2926] uppercase leading-tight mb-4">
                    {slide.title}
                  </h2>

                  {/* Quote */}
                  <p className="font-serif text-lg sm:text-2xl text-[#5E5854] leading-relaxed max-w-xl font-medium">
                    “{slide.quote}”
                  </p>
                </div>

                {/* Right: Editorial Metadata Card */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="rounded-3xl bg-white border border-[#2D2926]/10 p-6 sm:p-8 shadow-[0_20px_50px_rgba(45,41,38,0.06)] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#2D2926]/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-[#E05A7E]" />
                        <span className="text-xs font-sans tracking-widest text-[#2D2926] uppercase font-bold">
                          Terroir Focus
                        </span>
                      </div>
                      <span className="font-mono text-sm font-bold text-[#2D2926]">
                        0{idx + 1}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-sans tracking-widest text-[#8C827A] uppercase block mb-1">
                        Location & Climate
                      </span>
                      <span className="font-display text-sm sm:text-base text-[#2D2926] font-bold">
                        {slide.location}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[#2D2926]/10 flex items-center justify-between text-xs text-[#8C827A]">
                      <div className="flex items-center gap-1.5">
                        <Compass className="h-3.5 w-3.5 text-[#2D2926]" />
                        <span>Maison Archive</span>
                      </div>
                      <span className="font-mono text-[#2D2926]">Spread 0{idx + 1} of 04</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Marker */}
              <div className="absolute bottom-4 sm:bottom-6 left-6 md:left-12 right-6 md:right-12 flex items-center justify-between border-t border-[#2D2926]/10 pt-3 text-xs text-[#8C827A]">
                <span>NOIR DAKSHIN • HAUTE KAAPI MAGAZINE</span>
                <span className="font-mono text-[#2D2926] font-bold">{slide.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
