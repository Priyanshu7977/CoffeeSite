import React, { useEffect, useRef } from 'react';
import { Flame, Shield, Award, Sparkles } from 'lucide-react';
import { gsap } from '../utils/animations';

export const SectionManifesto: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;

    if (!section || !leftCol || !rightCol) return;

    if (video) {
      video.play().catch(() => {});
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 0.8,
        },
      });

      if (video) {
        tl.fromTo(
          video,
          { scale: 1.05, opacity: 0.55 },
          { scale: 1.18, opacity: 0.85, ease: 'none', duration: 1.0 },
          0
        );
      }

      tl.fromTo(
        leftCol,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power3.out', duration: 0.8 },
        0.1
      ).fromTo(
        rightCol,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power3.out', duration: 0.8 },
        0.25
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
      aria-label="Section 08: The Dakshin Manifesto & About Noir"
      className="relative min-h-screen w-full bg-[#1F1C1A] text-white flex items-center justify-center py-8 sm:py-12 lg:py-10 border-t border-[#2D2926] overflow-hidden"
    >
      {/* Background Video from Original Section 8 - Full Height & Width Coverage */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#1F1C1A]">
        <video
          ref={videoRef}
          src="/assets/videos/coffee-manifesto-smoke.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full min-h-full min-w-full object-cover object-center filter brightness-105 contrast-125 opacity-85 will-change-transform"
        />
        {/* Subtle Luxury Overlays preserving full-height video visibility behind text and image */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1F1C1A]/70 via-black/20 to-[#1F1C1A]/70 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1)_0%,rgba(31,28,26,0.7)_100%)] pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl w-full px-5 sm:px-8 md:px-12 flex flex-col justify-between my-auto py-2 sm:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left Column: Philosophy Statement */}
          <div ref={leftColRef} className="lg:col-span-7 flex flex-col justify-center">
            <div className="text-[11px] sm:text-xs tracking-[0.25em] text-[#F5DADF] font-sans font-bold uppercase mb-2 sm:mb-3 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#E05A7E]" />
              <span>08 / OUR MANIFESTO</span>
            </div>

            {/* Headline Statement */}
            <div className="space-y-0.5 sm:space-y-1 mb-3 sm:mb-4">
              <h2 className="font-display text-2xl sm:text-4xl lg:text-[2.6rem] font-bold text-white leading-[1.1] tracking-tight">
                We do not mass produce.
              </h2>
              <h2 className="font-display text-2xl sm:text-4xl lg:text-[2.6rem] font-medium italic text-[#E05A7E] leading-[1.1]">
                We do not rush.
              </h2>
              <h2 className="font-display text-2xl sm:text-4xl lg:text-[2.6rem] font-bold tracking-widest text-white uppercase leading-[1.1]">
                We do not compromise.
              </h2>
            </div>

            {/* Glassmorphic Supporting Copy */}
            <div className="rounded-2xl sm:rounded-3xl bg-[#2D2926]/85 border border-white/15 p-4 sm:p-5 backdrop-blur-xl shadow-2xl space-y-2.5 sm:space-y-3">
              <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#FAF7F5]/90 font-normal">
                In an industry driven by automated speed, NOIR DAKSHIN stands for deliberate friction. In 1670, Sufi mystic Baba Budan brought seven sacred seeds to the misty Chandragiri hills of Chikmagalur.
              </p>
              <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#FAF7F5]/75 font-normal">
                We honor this lineage—roasting exclusively in small cast-iron drums by hand, by sound, and by aroma. Every lot is shade-grown beneath silver oaks and cardamom canopies in the Western Ghats, paid at +350% above Fair Trade minimums, and released in numbered batches to those who understand that great coffee takes time.
              </p>

              {/* 3 Pillars */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 pt-2.5 sm:pt-3 border-t border-white/10">
                <div className="rounded-xl bg-white/5 border border-white/10 p-1.5 sm:p-2.5 flex flex-col justify-between min-w-0">
                  <Flame className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#E05A7E] mb-1 shrink-0" />
                  <span className="font-display text-[9.5px] sm:text-sm text-white block font-bold leading-tight truncate">100% Cast Iron</span>
                  <span className="text-[7.5px] sm:text-[9px] font-sans text-[#FAF7F5]/60 uppercase font-semibold leading-tight block mt-0.5 truncate">Slow Convection</span>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-1.5 sm:p-2.5 flex flex-col justify-between min-w-0">
                  <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#E05A7E] mb-1 shrink-0" />
                  <span className="font-display text-[9.5px] sm:text-sm text-white block font-bold leading-tight truncate">+350% Direct</span>
                  <span className="text-[7.5px] sm:text-[9px] font-sans text-[#FAF7F5]/60 uppercase font-semibold leading-tight block mt-0.5 truncate">Estate Premium</span>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-1.5 sm:p-2.5 flex flex-col justify-between min-w-0">
                  <Award className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#E05A7E] mb-1 shrink-0" />
                  <span className="font-display text-[9.5px] sm:text-sm text-white block font-bold leading-tight truncate">85 Tins Max</span>
                  <span className="text-[7.5px] sm:text-[9px] font-sans text-[#FAF7F5]/60 uppercase font-semibold leading-tight block mt-0.5 truncate">Numbered Lots</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Roastery Photo Card */}
          <div ref={rightColRef} className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full aspect-[4/5] max-h-[38vh] sm:max-h-[44vh] max-w-xs sm:max-w-sm rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.5)] bg-black/40 group">
              <img
                src="/assets/roast-drum.jpg"
                alt="NOIR DAKSHIN Drum Roastery"
                className="h-full w-full object-cover object-center filter brightness-100 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 rounded-xl sm:rounded-2xl bg-[#1F1C1A]/90 p-3 sm:p-3.5 backdrop-blur-md border border-white/15 shadow-md">
                <span className="text-[11px] sm:text-xs font-serif italic text-white block font-medium">
                  “The acoustic crack guides our craft.”
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-[#F5DADF] tracking-widest uppercase block mt-0.5 sm:mt-1 font-bold">
                  CHIKMAGALUR & BENGALURU ROASTERY
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
