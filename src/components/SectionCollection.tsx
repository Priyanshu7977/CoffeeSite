import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Compass } from 'lucide-react';
import { gsap } from '../utils/animations';
import { NOIR_PRODUCTS } from '../data/products';
import { MagneticButton } from './MagneticButton';
import type { Product } from '../types';

interface SectionCollectionProps {
  onDiscoverProduct: (product: Product) => void;
  onOpenCollectionPage?: () => void;
}

export const SectionCollection: React.FC<SectionCollectionProps> = ({ onDiscoverProduct, onOpenCollectionPage }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const productsContainerRef = useRef<HTMLDivElement | null>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeProductIndex, setActiveProductIndex] = useState<number>(0);
  
  // Section 04 features the 4 flagship signature lots on the landing story
  const featuredProducts = NOIR_PRODUCTS.slice(0, 4);

  useEffect(() => {
    const section = sectionRef.current;
    const productsContainer = productsContainerRef.current;

    if (!section || !productsContainer) return;

    const ctx = gsap.context(() => {
      const slides = slidesRef.current.filter(Boolean) as HTMLDivElement[];
      if (slides.length === 0) return;

      // Set initial states: Slide 0 is visibly landed by default, while 1, 2, 3 wait off-screen
      slides.forEach((slide, i) => {
        gsap.set(slide, {
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 35,
          scale: i === 0 ? 1.0 : 0.95,
          visibility: i === 0 ? 'visible' : 'hidden',
          pointerEvents: i === 0 ? 'auto' : 'none',
        });
      });

      // Calibrated pinned scroll timeline with balanced pacing and solid hold for Slide 4
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.25) {
              setActiveProductIndex(0);
            } else if (p < 0.50) {
              setActiveProductIndex(1);
            } else if (p < 0.75) {
              setActiveProductIndex(2);
            } else {
              setActiveProductIndex(3);
            }
          },
        },
      });

      // 1. Slide 0 Hold Window (Baba Budan Obsidian)
      tl.to({}, { duration: 0.5 });

      // 2. Slide 0 -> Slide 1 Transition (02 Malabar Monsooned Cask)
      tl.to(slides[0], {
        opacity: 0,
        y: -30,
        scale: 0.95,
        visibility: 'hidden',
        pointerEvents: 'none',
        duration: 0.35,
        ease: 'power2.inOut',
      });
      tl.fromTo(
        slides[1],
        { opacity: 0, y: 35, scale: 0.95, visibility: 'hidden', pointerEvents: 'none' },
        { opacity: 1, y: 0, scale: 1.0, visibility: 'visible', pointerEvents: 'auto', duration: 0.4, ease: 'power2.out' },
        '<0.15'
      );

      // Slide 1 Hold Window
      tl.to({}, { duration: 0.5 });

      // 3. Slide 1 -> Slide 2 Transition (03 Araku Valley Tribal Honey)
      tl.to(slides[1], {
        opacity: 0,
        y: -30,
        scale: 0.95,
        visibility: 'hidden',
        pointerEvents: 'none',
        duration: 0.35,
        ease: 'power2.inOut',
      });
      tl.fromTo(
        slides[2],
        { opacity: 0, y: 35, scale: 0.95, visibility: 'hidden', pointerEvents: 'none' },
        { opacity: 1, y: 0, scale: 1.0, visibility: 'visible', pointerEvents: 'auto', duration: 0.4, ease: 'power2.out' },
        '<0.15'
      );

      // Slide 2 Hold Window
      tl.to({}, { duration: 0.5 });

      // 4. Slide 2 -> Slide 3 Transition (04 Coorg Rainforest Peaberry)
      tl.to(slides[2], {
        opacity: 0,
        y: -30,
        scale: 0.95,
        visibility: 'hidden',
        pointerEvents: 'none',
        duration: 0.35,
        ease: 'power2.inOut',
      });
      tl.fromTo(
        slides[3],
        { opacity: 0, y: 35, scale: 0.95, visibility: 'hidden', pointerEvents: 'none' },
        { opacity: 1, y: 0, scale: 1.0, visibility: 'visible', pointerEvents: 'auto', duration: 0.4, ease: 'power2.out' },
        '<0.15'
      );

      // 5. Generous Hold Window for the Last Slide (Slide 3) so it never rushes or glitches away
      tl.to({}, { duration: 0.8 });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const goToSlide = (idx: number) => {
    setActiveProductIndex(idx);
    const slides = slidesRef.current.filter(Boolean) as HTMLDivElement[];
    slides.forEach((slide, i) => {
      if (i === idx) {
        gsap.to(slide, {
          opacity: 1,
          y: 0,
          scale: 1.0,
          visibility: 'visible',
          pointerEvents: 'auto',
          duration: 0.4,
          ease: 'power2.out',
        });
      } else {
        gsap.to(slide, {
          opacity: 0,
          y: i < idx ? -30 : 30,
          scale: 0.94,
          visibility: 'hidden',
          pointerEvents: 'none',
          duration: 0.35,
          ease: 'power2.out',
        });
      }
    });
  };

  return (
    <section
      id="section-collection"
      ref={sectionRef}
      aria-label="Section 04: The Coffee Collection"
      className="relative h-screen w-full bg-[#FAF7F5] text-[#2D2926] flex items-center justify-center overflow-hidden border-t border-[#2D2926]/10"
    >
      <div
        ref={productsContainerRef}
        className="relative z-10 mx-auto max-w-6xl w-full px-6 md:px-12 flex flex-col justify-between h-[86vh] py-6"
      >
        {/* Top Header & Number Navigation */}
        <div className="flex items-center justify-between border-b border-[#2D2926]/10 pb-3 gap-3">
          <div className="text-xs tracking-[0.25em] text-[#2D2926] font-sans font-bold uppercase flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#E05A7E]" />
            <span>04 / THE COLLECTION</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenCollectionPage && (
              <button
                onClick={onOpenCollectionPage}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#2D2926]/15 text-xs font-sans font-bold text-[#2D2926] hover:bg-[#F5DADF] transition-all cursor-pointer shadow-sm"
              >
                <span>View All 10 Lots</span>
                <ArrowRight className="h-3 w-3 text-[#E05A7E]" />
              </button>
            )}

            <div className="flex items-center gap-1.5 py-0.5">
              {featuredProducts.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => goToSlide(idx)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    activeProductIndex === idx
                      ? 'bg-[#F5DADF] text-[#2D2926] font-bold shadow-sm'
                      : 'text-[#8C827A] hover:text-[#2D2926]'
                  }`}
                >
                  {p.num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stacked Product Slides */}
        <div className="relative flex-1 flex items-center justify-center my-auto py-4">
          {featuredProducts.map((product, idx) => (
            <div
              key={product.id}
              ref={(el) => {
                slidesRef.current[idx] = el;
              }}
              className="product-slide absolute inset-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center will-change-transform"
            >
              {/* Left Column: Dominant Large Product Visual */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="relative aspect-[4/5] max-h-[48vh] w-full max-w-sm overflow-hidden rounded-3xl border border-[#2D2926]/10 shadow-[0_20px_50px_rgba(45,41,38,0.08)] bg-white group">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center filter brightness-100 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 rounded-full bg-[#F5DADF] px-3 py-1 border border-[#2D2926]/10 text-[11px] font-mono text-[#2D2926] font-bold shadow-sm">
                    {product.roastLevel}
                  </div>
                  <div className="absolute bottom-4 right-4 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 border border-[#2D2926]/10 text-[11px] font-mono text-[#5E5854] shadow-sm">
                    {product.altitude}
                  </div>
                </div>
              </div>

              {/* Right Column: Content Hierarchy */}
              <div className="lg:col-span-6 flex flex-col justify-center text-left items-start">
                {/* Category / Origin */}
                <span className="text-xs tracking-[0.3em] font-sans uppercase text-[#E05A7E] font-bold mb-2 flex items-center gap-1.5">
                  <Compass className="h-3 w-3 text-[#E05A7E]" />
                  {product.origin.toUpperCase()}
                </span>

                {/* Coffee Name */}
                <h3 className="font-display text-3xl sm:text-5xl text-[#2D2926] font-bold tracking-tight mb-2">
                  {product.name}
                </h3>

                {/* Tasting Notes */}
                <p className="font-sans text-xs sm:text-sm text-[#E05A7E] font-bold tracking-wide mb-4">
                  {product.notes.join(' · ')}
                </p>

                {/* Short Description */}
                <p className="font-sans text-xs sm:text-sm text-[#5E5854] font-normal leading-relaxed max-w-md mb-6">
                  {product.description}
                </p>

                {/* Price & Explore Action */}
                <div className="flex items-center gap-6">
                  <span className="font-display text-2xl sm:text-3xl text-[#2D2926] font-bold">
                    {product.price}
                  </span>

                  <MagneticButton strength={0.3}>
                    <button
                      onClick={() => onDiscoverProduct(product)}
                      className="flex items-center gap-2 rounded-full bg-[#2D2926] text-white px-6 py-3 text-xs font-sans font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-md hover:bg-[#1F1C1A] hover:scale-105 cursor-pointer"
                    >
                      <span>Explore Lot</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </MagneticButton>

                  {/* Mobile Quick Arrows */}
                  <div className="flex items-center gap-1.5 sm:hidden">
                    <button
                      onClick={() => goToSlide((activeProductIndex - 1 + featuredProducts.length) % featuredProducts.length)}
                      aria-label="Previous Coffee"
                      className="h-9 w-9 rounded-full border border-[#2D2926]/10 bg-white flex items-center justify-center text-[#2D2926] shadow-sm cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => goToSlide((activeProductIndex + 1) % featuredProducts.length)}
                      aria-label="Next Coffee"
                      className="h-9 w-9 rounded-full border border-[#2D2926]/10 bg-white flex items-center justify-center text-[#2D2926] shadow-sm cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Marker */}
        <div className="flex items-center justify-between border-t border-[#2D2926]/10 pt-3 text-xs text-[#8C827A]">
          <span>Single-Estate Harvests • 250g Micro-Tins</span>
          <div className="flex items-center gap-3">
            {onOpenCollectionPage && (
              <button
                onClick={onOpenCollectionPage}
                className="font-sans font-bold text-[#E05A7E] hover:underline cursor-pointer"
              >
                Explore All 10 Curations →
              </button>
            )}
            <span className="font-mono text-[#2D2926] font-bold">
              0{activeProductIndex + 1} OF 04 LOTS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
