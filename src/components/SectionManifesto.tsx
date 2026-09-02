import React, { useEffect, useRef } from 'react';
import { Sparkles, Shield, Flame, Award, Compass, ArrowUpRight } from 'lucide-react';
import { gsap } from '../utils/animations';

export const SectionManifesto: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);
  const imageCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;
    const imageCard = imageCardRef.current;

    if (!section || !leftCol || !rightCol || !imageCard) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'bottom 25%',
          scrub: 0.8,
        },
      });

      tl.fromTo(
        leftCol,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, ease: 'power3.out', duration: 0.8 },
        0
      )
        .fromTo(
          rightCol,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, ease: 'power3.out', duration: 0.8 },
          0.1
        )
        .fromTo(
          imageCard,
          { scale: 0.92, y: 30 },
          { scale: 1.0, y: 0, ease: 'power2.out', duration: 1.0 },
          0.2
        );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="section-manifesto"
      ref={sectionRef}
      aria-label="Section 08: The Noir Manifesto & About Noir"
      className="relative min-h-screen w-full bg-[#070605] py-20 md:py-32 px-6 md:px-12 flex items-center justify-center overflow-hidden border-t border-[#221c17]"
    >
      {/* Background Ambient Warm Embers Glow */}
      <div className="absolute inset-0 bg-radial-at-c from-[#c89658]/12 via-[#070605] to-[#070605] pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#140f0c] via-transparent to-transparent opacity-60 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* ================= LEFT COLUMN: The Philosophy Block ================= */}
          <div ref={leftColRef} className="lg:col-span-7 flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-3 text-xs tracking-[0.35em] text-[#c89658] font-sans font-semibold uppercase">
              <span className="font-mono text-[#c89658]">08</span>
              <span className="h-[1px] w-8 bg-[#c89658]/70" />
              <span>THE NOIR MANIFESTO / ABOUT NOIR</span>
            </div>

            {/* Monumental 3-Line Statement */}
            <div className="space-y-1.5 mb-8">
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#f4eee6] leading-[1.05]">
                WE DO NOT MASS PRODUCE.
              </h2>
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light italic text-[#e5b877] leading-[1.05]">
                WE DO NOT RUSH.
              </h2>
              <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-wider text-[#f4eee6] uppercase leading-[1.05] drop-shadow-[0_0_30px_rgba(200,150,88,0.3)]">
                WE DO NOT COMPROMISE.
              </h2>
            </div>

            {/* Luxury Glassmorphic Philosophy Card */}
            <div className="rounded-3xl bg-[#0f0c09]/95 border border-[#c89658]/30 p-7 sm:p-9 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-6">
              <p className="font-sans text-sm sm:text-base leading-relaxed text-[#cfc5ba] font-light">
                In an industry obsessed with speed and automated consistency, NOIR ROAST stands as a sanctuary of deliberate friction. We roast exclusively on cast-iron drum machines—by hand, by acoustic crack, and by aroma.
              </p>

              <p className="font-sans text-sm sm:text-base leading-relaxed text-[#a89d93] font-light">
                Each lot is traced directly to the individual mountain ridge, paid at 350% above Fair Trade minimums, and released in strictly limited numbers to those who understand that perfection is finite.
              </p>

              {/* 3 Core Pillar Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="rounded-2xl bg-[#16110d] border border-[#2b2118] p-3.5 flex flex-col justify-between">
                  <Flame className="h-4 w-4 text-[#c89658] mb-2" />
                  <span className="font-mono text-xs font-bold text-[#f4eee6]">100% Cast Iron</span>
                  <span className="text-[10px] font-sans text-[#8c827a] uppercase tracking-wider mt-0.5">Slow Convection</span>
                </div>

                <div className="rounded-2xl bg-[#16110d] border border-[#2b2118] p-3.5 flex flex-col justify-between">
                  <Shield className="h-4 w-4 text-[#e5b877] mb-2" />
                  <span className="font-mono text-xs font-bold text-[#f4eee6]">+350% Direct</span>
                  <span className="text-[10px] font-sans text-[#8c827a] uppercase tracking-wider mt-0.5">Fair Trade Premium</span>
                </div>

                <div className="rounded-2xl bg-[#16110d] border border-[#2b2118] p-3.5 flex flex-col justify-between">
                  <Award className="h-4 w-4 text-[#c89658] mb-2" />
                  <span className="font-mono text-xs font-bold text-[#f4eee6]">85 Tins Max</span>
                  <span className="text-[10px] font-sans text-[#8c827a] uppercase tracking-wider mt-0.5">Numbered Batches</span>
                </div>
              </div>

              {/* Master Roaster Signature Mark */}
              <div className="pt-4 border-t border-[#261f18] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full border border-[#c89658]/60 bg-[#140f0c] flex items-center justify-center shadow-[0_0_15px_rgba(200,150,88,0.25)]">
                    <span className="font-serif text-lg font-bold text-[#c89658]">NR</span>
                  </div>
                  <div>
                    <span className="font-serif italic text-base text-[#f4eee6] block leading-tight">
                      Henri de Noir
                    </span>
                    <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#8c827a]">
                      Master Roaster & Founder
                    </span>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-mono tracking-widest text-[#e5b877] uppercase block">
                    KYOTO & ZURICH
                  </span>
                  <span className="text-[9px] font-sans text-[#786e64] uppercase tracking-wider">
                    ATELIER NO. 04
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Visual Feature Card ================= */}
          <div ref={rightColRef} className="lg:col-span-5 flex flex-col items-center justify-center">
            <div
              ref={imageCardRef}
              className="relative w-full aspect-[4/5] max-w-md rounded-3xl overflow-hidden border border-[#c89658]/40 shadow-[0_25px_80px_rgba(0,0,0,0.95)] group bg-[#0d0a08]"
            >
              {/* Main Photo: Cast Iron Drum Roaster / High Elevation Terroir */}
              <img
                src="/assets/roast-drum.jpg"
                alt="NOIR Roasting Atelier Drum"
                className="h-full w-full object-cover object-center filter brightness-90 contrast-115 transition-transform duration-700 group-hover:scale-105"
              />

              {/* Cinematic Vignette Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070605] via-[#070605]/30 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />

              {/* Floating Top Badge */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                <div className="flex items-center gap-2 rounded-full bg-[#070605]/85 px-3.5 py-1 text-[10px] font-sans tracking-[0.2em] text-[#e5b877] uppercase border border-[#c89658]/35 backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-[#c89658]" />
                  <span>THE ATELIER ROAST</span>
                </div>

                <div className="h-8 w-8 rounded-full bg-[#070605]/85 border border-[#c89658]/35 flex items-center justify-center backdrop-blur-md">
                  <Compass className="h-4 w-4 text-[#c89658] animate-spin-slow" />
                </div>
              </div>

              {/* Floating Inset Telemetry Card at Bottom */}
              <div className="absolute bottom-5 left-5 right-5 z-10 rounded-2xl bg-[#0a0705]/95 p-4 backdrop-blur-xl border border-[#c89658]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#c89658]">
                    PRECISION THERMAL PROFILE
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-[#e5b877]" />
                </div>

                <p className="font-sans text-xs text-[#b5aaa0] font-light leading-relaxed">
                  204°C First Crack acoustic trigger. Zero electrical automation.
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#221c17] text-[10px] font-mono text-[#8c827a]">
                  <span>Batch: #0984-NOIR</span>
                  <span className="text-[#e5b877]">12kg Drum</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
