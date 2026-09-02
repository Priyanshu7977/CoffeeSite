import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from '../utils/animations';
import { NOIR_PRODUCTS } from '../data/products';
import { MagneticButton } from './MagneticButton';
import type { Product } from '../types';

interface SectionCollectionProps {
  onDiscoverProduct: (product: Product) => void;
}

export const SectionCollection: React.FC<SectionCollectionProps> = ({ onDiscoverProduct }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const introBlackoutRef = useRef<HTMLDivElement | null>(null);
  const introTextRef = useRef<HTMLDivElement | null>(null);
  const productsContainerRef = useRef<HTMLDivElement | null>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeProductIndex, setActiveProductIndex] = useState<number>(0);

  useEffect(() => {
    const section = sectionRef.current;
    const introBlackout = introBlackoutRef.current;
    const introText = introTextRef.current;
    const productsContainer = productsContainerRef.current;

    if (!section || !introBlackout || !introText || !productsContainer) return;

    const ctx = gsap.context(() => {
      const slides = slidesRef.current.filter(Boolean) as HTMLDivElement[];
      const totalProducts = slides.length;

      // Initialize slides: first visible, rest hidden and translated
      slides.forEach((slide, i) => {
        gsap.set(slide, {
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 25,
          scale: i === 0 ? 1 : 0.96,
          pointerEvents: i === 0 ? 'auto' : 'none',
        });
      });

      // Pinned scroll timeline active across all devices
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${(totalProducts + 1.8) * 100}%`,
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            if (progress <= 0.1) {
              setActiveProductIndex(0);
            } else {
              const productProg = Math.min(1, Math.max(0, (progress - 0.1) / 0.82));
              const idx = Math.min(totalProducts - 1, Math.floor(productProg * totalProducts));
              setActiveProductIndex(idx);
            }
          },
        },
      });

      // 1. Intro Curtain Reveal (0.0 -> 0.1)
      tl.fromTo(
        introBlackout,
        { opacity: 1 },
        { opacity: 1, duration: 0.04 },
        0
      )
        .fromTo(
          introText,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1.0, ease: 'power2.out', duration: 0.05 },
          0.01
        )
        .to(
          introText,
          { opacity: 0, y: -25, ease: 'power2.in', duration: 0.03 },
          0.06
        )
        .to(
          introBlackout,
          { opacity: 0, ease: 'power2.inOut', duration: 0.04 },
          0.07
        );

      // 2. Sequential Product Landings (0.1 -> 0.85)
      slides.forEach((slide, i) => {
        if (i === 0) return;

        const prevSlide = slides[i - 1];
        const startTime = 0.1 + (i * 0.16);

        tl.to(
          prevSlide,
          {
            opacity: 0,
            y: -20,
            scale: 0.96,
            pointerEvents: 'none',
            ease: 'power2.inOut',
            duration: 0.06,
          },
          startTime
        );

        tl.fromTo(
          slide,
          {
            opacity: 0,
            y: 20,
            scale: 0.96,
            pointerEvents: 'none',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1.0,
            pointerEvents: 'auto',
            ease: 'power2.out',
            duration: 0.08,
          },
          startTime + 0.03
        );
      });

      // 3. Generous Dwell Phase for the Final 5th Image (0.85 -> 1.0)
      tl.to({}, { duration: 0.15 }, 0.85);
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const goToSlide = (idx: number) => {
    setActiveProductIndex(idx);
    const slides = slidesRef.current.filter(Boolean) as HTMLDivElement[];
    slides.forEach((slide, i) => {
      gsap.to(slide, {
        opacity: i === idx ? 1 : 0,
        y: i === idx ? 0 : 20,
        scale: i === idx ? 1 : 0.96,
        pointerEvents: i === idx ? 'auto' : 'none',
        duration: 0.4,
        ease: 'power2.out',
      });
    });
  };

  return (
    <section
      id="section-collection"
      ref={sectionRef}
      aria-label="Section 04: The Collection Indian Coffee Editions"
      className="relative h-screen w-full bg-[#070605] flex items-center justify-center overflow-hidden border-t border-[#221c17] py-6 lg:py-0"
    >
      {/* Intro Blackout Curtain */}
      <div
        ref={introBlackoutRef}
        className="pointer-events-none absolute inset-0 z-40 bg-[#070605] flex items-center justify-center will-change-transform"
      >
        <div ref={introTextRef} className="text-center px-6">
          <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.4em] uppercase text-[#c89658] block mb-2 sm:mb-3 font-semibold">
            THE NOIR DAKSHIN COLLECTION
          </span>
          <h2 className="font-serif text-3xl sm:text-6xl md:text-7xl text-[#f4eee6] font-light tracking-tight">
            FIND YOUR <span className="italic text-[#e5b877] font-display font-semibold">ROAST.</span>
          </h2>
        </div>
      </div>

      {/* Main Products Sequence Container */}
      <div
        ref={productsContainerRef}
        className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-12 flex flex-col justify-between h-[90vh] sm:h-[84vh] py-3 sm:py-6"
      >
        {/* Top Header & Indicator */}
        <div className="flex items-center justify-between border-b border-[#221c17]/80 pb-2 sm:pb-3">
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] text-[#c89658] font-sans font-semibold uppercase">
            <span className="font-mono text-[#c89658]">04</span>
            <span className="h-[1px] w-6 sm:w-8 bg-[#c89658]/60" />
            <span>THE COLLECTION</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 font-mono text-xs text-[#8c827a]">
            {NOIR_PRODUCTS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => goToSlide(idx)}
                className={`px-1.5 py-0.5 rounded transition-all duration-300 cursor-pointer text-[10px] sm:text-xs focus-visible:ring-1 focus-visible:ring-[#c89658] ${
                  activeProductIndex === idx
                    ? 'font-bold text-[#c89658] scale-110 bg-[#1c140d] border border-[#c89658]/40'
                    : 'text-[#5c5044] hover:text-[#8c827a]'
                }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Stacked Product Slides */}
        <div className="relative flex-1 flex items-center justify-center my-auto py-2 sm:py-4">
          {NOIR_PRODUCTS.map((product, idx) => (
            <div
              key={product.id}
              ref={(el) => {
                slidesRef.current[idx] = el;
              }}
              className="product-slide absolute inset-0 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-12 items-center will-change-transform"
            >
              {/* Left Column: Product Visual */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="product-img-box relative aspect-[4/5] max-h-[32vh] sm:max-h-[44vh] w-full max-w-[260px] sm:max-w-sm overflow-hidden rounded-2xl border border-[#c89658]/40 shadow-[0_20px_60px_rgba(0,0,0,0.95)] group bg-[#0d0a08]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center filter brightness-95 contrast-110 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070605]/85 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 flex items-center gap-1.5 rounded-full bg-[#070605]/90 px-2.5 sm:px-3 py-0.5 text-[8px] sm:text-[9px] font-sans tracking-[0.2em] text-[#e5b877] uppercase border border-[#c89658]/30 backdrop-blur-md">
                    <Sparkles className="h-2.5 sm:h-3 w-2.5 sm:w-3 text-[#c89658]" />
                    <span>{product.badge}</span>
                  </div>

                  {/* Bottom Numbered Marker */}
                  <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 right-2.5 sm:right-4 flex items-center justify-between rounded-xl bg-[#090705]/95 p-2 sm:p-2.5 backdrop-blur-md border border-[#c89658]/25">
                    <span className="font-mono text-[10px] sm:text-xs font-bold text-[#c89658]">
                      EDITION {product.num}
                    </span>
                    <span className="font-sans text-[9px] sm:text-[11px] text-[#a89d93] truncate max-w-[100px]">
                      {product.origin.split('/')[1] || product.origin}
                    </span>
                    <span className="font-mono text-[10px] sm:text-xs font-bold text-[#e5b877]">
                      {product.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Typography & Discover CTA */}
              <div className="product-text-box lg:col-span-6 flex flex-col justify-center text-center lg:text-left items-center lg:items-start">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#c89658]">
                    {product.num} / 05
                  </span>
                  <span className="h-[1px] w-4 sm:w-6 bg-[#c89658]/40" />
                  <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.2em] text-[#8c827a] uppercase">
                    {product.roastLevel}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-3xl lg:text-4xl text-[#f4eee6] font-normal tracking-tight mb-1 sm:mb-2">
                  {product.name}
                </h3>

                <p className="font-sans text-[11px] sm:text-xs text-[#b5aaa0] font-light leading-relaxed max-w-lg mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3">
                  {product.description}
                </p>

                {/* Flavor Notes Badges */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex flex-wrap justify-center lg:justify-start gap-1 sm:gap-1.5">
                    {product.notes.map((note) => (
                      <span
                        key={note}
                        className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-[#14100c] border border-[#261f19] text-[9px] sm:text-[11px] font-sans text-[#e5b877]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Discover Button & Mobile Quick Nav */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <MagneticButton strength={0.35}>
                    <button
                      onClick={() => onDiscoverProduct(product)}
                      className="flex items-center gap-2 rounded-full border border-[#c89658] bg-[#c89658] px-5 sm:px-7 py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.18em] text-[#070605] uppercase transition-all duration-300 hover:bg-[#e5b877] hover:shadow-[0_0_20px_rgba(200,150,88,0.4)] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#c89658]"
                    >
                      <span>Discover Roast</span>
                      <ArrowRight className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                    </button>
                  </MagneticButton>

                  {/* Mobile Quick Arrows */}
                  <div className="flex items-center gap-1 sm:hidden">
                    <button
                      onClick={() => goToSlide((activeProductIndex - 1 + NOIR_PRODUCTS.length) % NOIR_PRODUCTS.length)}
                      aria-label="Previous Product"
                      className="h-8 w-8 rounded-full border border-[#332b24] bg-[#14100c] flex items-center justify-center text-[#c89658]"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => goToSlide((activeProductIndex + 1) % NOIR_PRODUCTS.length)}
                      aria-label="Next Product"
                      className="h-8 w-8 rounded-full border border-[#332b24] bg-[#14100c] flex items-center justify-center text-[#c89658]"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="hidden sm:inline text-xs font-mono text-[#8c827a]">
                    250g Tin
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Footer Telemetry */}
        <div className="flex items-center justify-between border-t border-[#221c17]/80 pt-2 sm:pt-3 text-[10px] sm:text-xs text-[#8c827a]">
          <span className="font-serif italic text-[#a89d93] text-[10px] sm:text-xs truncate max-w-[200px] sm:max-w-none">
            “Roasted to order in small Indian batches.”
          </span>
          <span className="font-mono text-[9px] sm:text-[10px] text-[#c89658] uppercase">
            Edition 0{activeProductIndex + 1} of 05
          </span>
        </div>
      </div>
    </section>
  );
};
