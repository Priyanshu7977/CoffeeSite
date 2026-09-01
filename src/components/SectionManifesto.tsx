import React, { useEffect, useRef } from 'react';
import { gsap } from '../utils/animations';

export const SectionManifesto: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const quoteRef = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const quote = quoteRef.current;
    const details = detailsRef.current;

    if (!section || !quote || !details) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'bottom 25%',
        scrub: 1,
      },
    });

    tl.fromTo(
      quote,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, ease: 'power3.out' }
    ).fromTo(
      details,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, ease: 'power2.out' },
      0.2
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="section-manifesto"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#070605] py-28 md:py-40 px-6 md:px-12 flex items-center justify-center overflow-hidden border-t border-[#221c17]"
    >
      {/* Subtle background ambient smoke glow */}
      <div className="absolute inset-0 bg-radial-at-c from-[#c89658]/10 via-[#070605] to-[#070605] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Eyebrow */}
        <div className="mb-8 flex items-center justify-center gap-3 text-xs tracking-[0.35em] text-[#c89658] font-sans font-semibold uppercase">
          <span className="h-[1px] w-8 bg-[#c89658]/70" />
          <span>THE NOIR MANIFESTO</span>
          <span className="h-[1px] w-8 bg-[#c89658]/70" />
        </div>

        {/* Monumental Editorial Statement */}
        <div ref={quoteRef} className="space-y-4 mb-16">
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#f4eee6] leading-[1.1]">
            WE DO NOT MASS PRODUCE.
          </h2>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light italic text-[#e5b877] leading-[1.1]">
            WE DO NOT RUSH.
          </h2>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider text-[#f4eee6] uppercase leading-[1.1]">
            WE DO NOT COMPROMISE.
          </h2>
        </div>

        {/* Philosophy Paragraph */}
        <div ref={detailsRef} className="mx-auto max-w-2xl space-y-6">
          <p className="font-sans text-sm sm:text-base leading-relaxed text-[#b5aaa0] font-light">
            In an industry obsessed with speed and automated consistency, NOIR ROAST stands as a sanctuary of deliberate friction. We roast exclusively on cast-iron drum machines, by hand, by sound, and by aroma.
          </p>
          <p className="font-sans text-sm sm:text-base leading-relaxed text-[#b5aaa0] font-light">
            Each lot is traced directly to the individual mountain ridge, paid at 350% above Fair Trade minimums, and released in strictly limited numbers to those who understand that perfection is finite.
          </p>

          {/* Master Roaster Signature Mark */}
          <div className="pt-10 flex flex-col items-center justify-center gap-2">
            <div className="h-14 w-14 rounded-full border border-[#c89658]/60 bg-[#120e0b] flex items-center justify-center shadow-[0_0_20px_rgba(200,150,88,0.2)] mb-2">
              <span className="font-serif text-xl font-bold text-[#c89658]">NR</span>
            </div>
            <span className="font-serif italic text-base text-[#f4eee6]">
              Henri de Noir
            </span>
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#8c827a]">
              Master Roaster & Founder • Kyoto & Zurich
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
