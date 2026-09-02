import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
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

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        // Initialize slides: first visible, rest hidden
        slides.forEach((slide, i) => {
          gsap.set(slide, {
            opacity: i === 0 ? 1 : 0,
            y: i === 0 ? 0 : 30,
            scale: i === 0 ? 1 : 0.96,
            pointerEvents: i === 0 ? 'auto' : 'none',
          });
        });

        // Generous pinned scroll distance so all 5 images land crisply and the last image HOLDS before unpinning
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${(totalProducts + 2.0) * 100}%`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress;
              if (progress <= 0.12) {
                setActiveProductIndex(0);
              } else {
                const productProg = Math.min(1, Math.max(0, (progress - 0.12) / 0.80));
                const idx = Math.min(totalProducts - 1, Math.floor(productProg * totalProducts));
                setActiveProductIndex(idx);
              }
            },
          },
        });

        // 1. Intro Curtain Reveal (0.0 -> 0.12)
        tl.fromTo(
          introBlackout,
          { opacity: 1 },
          { opacity: 1, duration: 0.05 },
          0
        )
          .fromTo(
            introText,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1.0, ease: 'power2.out', duration: 0.06 },
            0.01
          )
          .to(
            introText,
            { opacity: 0, y: -30, ease: 'power2.in', duration: 0.04 },
            0.07
          )
          .to(
            introBlackout,
            { opacity: 0, ease: 'power2.inOut', duration: 0.05 },
            0.08
          );

        // 2. Sequential Crisp Product Landings (0.12 -> 0.82)
        slides.forEach((slide, i) => {
          if (i === 0) return;

          const prevSlide = slides[i - 1];
          const startTime = 0.12 + (i * 0.16);

          tl.to(
            prevSlide,
            {
              opacity: 0,
              y: -25,
              scale: 0.96,
              pointerEvents: 'none',
              ease: 'power2.inOut',
              duration: 0.07,
            },
            startTime
          );

          tl.fromTo(
            slide,
            {
              opacity: 0,
              y: 25,
              scale: 0.96,
              pointerEvents: 'none',
            },
            {
              opacity: 1,
              y: 0,
              scale: 1.0,
              pointerEvents: 'auto',
              ease: 'power2.out',
              duration: 0.09,
            },
            startTime + 0.04
          );
        });

        // 3. Generous Dwell / Wait Phase for the Final 5th Image (0.82 -> 1.0)
        tl.to({}, { duration: 0.18 }, 0.82);
      });

      mm.add('(max-width: 1023px)', () => {
        gsap.to(introBlackout, {
          opacity: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=30%',
            scrub: true,
          },
        });
      });
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
      className="relative min-h-screen lg:h-screen w-full bg-[#070605] flex items-center justify-center overflow-hidden border-t border-[#221c17] py-12 lg:py-0"
    >
      {/* Intro Blackout Curtain with Centered "FIND YOUR ROAST." */}
      <div
        ref={introBlackoutRef}
        className="pointer-events-none absolute inset-0 z-40 bg-[#070605] flex items-center justify-center will-change-transform hidden lg:flex"
      >
        <div ref={introTextRef} className="text-center px-6">
          <span className="text-[11px] font-sans tracking-[0.4em] uppercase text-[#c89658] block mb-3 font-semibold">
            THE NOIR DAKSHIN COLLECTION
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#f4eee6] font-light tracking-tight">
            FIND YOUR <span className="italic text-[#e5b877] font-display font-semibold">ROAST.</span>
          </h2>
        </div>
      </div>

      {/* Main Products Sequence Container: 100vh framed */}
      <div
        ref={productsContainerRef}
        className="relative z-10 mx-auto max-w-7xl w-full px-6 md:px-12 flex flex-col justify-between min-h-[70vh] lg:h-[84vh] py-6"
      >
        {/* Top Header & Indicator */}
        <div className="flex items-center justify-between border-b border-[#221c17]/80 pb-3">
          <div className="flex items-center gap-3 text-xs tracking-[0.3em] text-[#c89658] font-sans font-semibold uppercase">
            <span className="font-mono text-[#c89658]">04</span>
            <span className="h-[1px] w-8 bg-[#c89658]/60" />
            <span>THE COLLECTION / DAKSHIN ARCHIVE</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#8c827a]">
            {NOIR_PRODUCTS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 cursor-pointer focus-visible:ring-1 focus-visible:ring-[#c89658] ${
                  activeProductIndex === idx
                    ? 'font-bold text-[#c89658] scale-125'
                    : 'text-[#473e36] hover:text-[#8c827a]'
                }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Stacked Product Slides */}
        <div className="relative flex-1 flex items-center justify-center my-auto py-4">
          {NOIR_PRODUCTS.map((product, idx) => (
            <div
              key={product.id}
              ref={(el) => {
                slidesRef.current[idx] = el;
              }}
              className="product-slide absolute inset-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center will-change-transform"
            >
              {/* Left Column: Product Visual */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="product-img-box relative aspect-[4/5] max-h-[44vh] sm:max-h-[48vh] w-full max-w-sm overflow-hidden rounded-2xl border border-[#c89658]/40 shadow-[0_25px_80px_rgba(0,0,0,0.95)] group bg-[#0d0a08]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center filter brightness-95 contrast-110 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070605]/85 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-[#070605]/90 px-3 py-0.5 text-[9px] font-sans tracking-[0.2em] text-[#e5b877] uppercase border border-[#c89658]/30 backdrop-blur-md">
                    <Sparkles className="h-3 w-3 text-[#c89658]" />
                    <span>{product.badge}</span>
                  </div>

                  {/* Bottom Numbered Marker */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-[#090705]/95 p-2.5 backdrop-blur-md border border-[#c89658]/25">
                    <span className="font-mono text-xs font-bold text-[#c89658]">
                      EDITION {product.num}
                    </span>
                    <span className="font-sans text-[11px] text-[#a89d93]">
                      {product.origin}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#e5b877]">
                      {product.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Typography & Discover CTA */}
              <div className="product-text-box lg:col-span-6 flex flex-col justify-center">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#c89658]">
                    {product.num} / 05
                  </span>
                  <span className="h-[1px] w-6 bg-[#c89658]/40" />
                  <span className="text-[10px] font-sans tracking-[0.2em] text-[#8c827a] uppercase">
                    {product.origin} • {product.roastLevel}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#f4eee6] font-normal tracking-tight mb-2.5">
                  {product.name}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-[#b5aaa0] font-light leading-relaxed max-w-lg mb-4">
                  {product.description}
                </p>

                {/* Flavor Notes Badges */}
                <div className="mb-5">
                  <span className="text-[9px] font-sans tracking-[0.25em] text-[#8c827a] uppercase block mb-1.5">
                    Primary Flavor Notes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.notes.map((note) => (
                      <span
                        key={note}
                        className="px-2.5 py-1 rounded-lg bg-[#14100c] border border-[#261f19] text-[11px] font-sans text-[#e5b877]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Discover Button */}
                <div className="flex items-center gap-3">
                  <MagneticButton strength={0.35}>
                    <button
                      onClick={() => onDiscoverProduct(product)}
                      className="flex items-center gap-2.5 rounded-full border border-[#c89658] bg-[#c89658] px-6 sm:px-7 py-2.5 sm:py-3 text-[11px] font-sans font-bold tracking-[0.2em] text-[#070605] uppercase transition-all duration-300 hover:bg-[#e5b877] hover:shadow-[0_0_20px_rgba(200,150,88,0.4)] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#c89658]"
                    >
                      <span>Discover Roast</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </MagneticButton>

                  <span className="text-xs font-mono text-[#8c827a]">
                    250g Tin
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Footer Telemetry */}
        <div className="flex items-center justify-between border-t border-[#221c17]/80 pt-3 text-xs text-[#8c827a]">
          <span className="font-serif italic text-[#a89d93] text-[11px] sm:text-xs">
            “Roasted to order in small Indian batches. Delivered within 48 hours of cracking.”
          </span>
          <span className="font-mono text-[10px] text-[#c89658] uppercase">
            Edition 0{activeProductIndex + 1} of 05
          </span>
        </div>
      </div>
    </section>
  );
};
