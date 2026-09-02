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
      className="relative min-h-screen w-full bg-[#1F1C1A] text-white flex items-center justify-center overflow-hidden py-20 lg:py-0 border-t border-[#2D2926]"
    >
      {/* Background Video from Original Section 8 */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#1F1C1A]">
        <video
          ref={videoRef}
          src="/assets/videos/coffee-manifesto-smoke.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover object-center filter brightness-90 contrast-115 opacity-65 will-change-transform"
        />
        {/* Cinematic Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1C1A] via-[#1F1C1A]/55 to-[#1F1C1A]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#1F1C1A]/40 to-[#1F1C1A]/90 pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl w-full px-6 md:px-12 flex flex-col justify-between my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column: Philosophy Statement */}
          <div ref={leftColRef} className="lg:col-span-7 flex flex-col justify-center">
            <div className="text-xs tracking-[0.25em] text-[#F5DADF] font-sans font-bold uppercase mb-4 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#E05A7E]" />
              <span>08 / OUR MANIFESTO</span>
            </div>

            {/* Headline Statement */}
            <div className="space-y-1 mb-6">
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight">
                We do not mass produce.
              </h2>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-medium italic text-[#E05A7E] leading-[1.08]">
                We do not rush.
              </h2>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-widest text-white uppercase leading-[1.08]">
                We do not compromise.
              </h2>
            </div>

            {/* Glassmorphic Supporting Copy */}
            <div className="rounded-3xl bg-[#2D2926]/78 border border-white/15 p-6 backdrop-blur-xl shadow-2xl space-y-4">
              <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#FAF7F5]/90 font-normal">
                In an industry driven by automated speed, NOIR DAKSHIN stands for deliberate friction. In 1670, Sufi mystic Baba Budan brought seven sacred seeds to the misty Chandragiri hills of Chikmagalur.
              </p>
              <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#FAF7F5]/75 font-normal">
                We honor this lineage—roasting exclusively in small cast-iron drums by hand, by sound, and by aroma. Every lot is shade-grown beneath silver oaks and cardamom canopies in the Western Ghats, paid at +350% above Fair Trade minimums, and released in numbered batches to those who understand that great coffee takes time.
              </p>

              {/* 3 Pillars */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col justify-between">
                  <Flame className="h-4 w-4 text-[#E05A7E] mb-1.5" />
                  <span className="font-display text-xs sm:text-sm text-white block font-bold">100% Cast Iron</span>
                  <span className="text-[10px] font-sans text-[#FAF7F5]/60 uppercase font-semibold">Slow Convection</span>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col justify-between">
                  <Shield className="h-4 w-4 text-[#E05A7E] mb-1.5" />
                  <span className="font-display text-xs sm:text-sm text-white block font-bold">+350% Direct</span>
                  <span className="text-[10px] font-sans text-[#FAF7F5]/60 uppercase font-semibold">Estate Premium</span>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col justify-between">
                  <Award className="h-4 w-4 text-[#E05A7E] mb-1.5" />
                  <span className="font-display text-xs sm:text-sm text-white block font-bold">85 Tins Max</span>
                  <span className="text-[10px] font-sans text-[#FAF7F5]/60 uppercase font-semibold">Numbered Lots</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Roastery Photo Card */}
          <div ref={rightColRef} className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full aspect-[4/5] max-h-[50vh] max-w-sm rounded-3xl overflow-hidden border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.5)] bg-black/40 group">
              <img
                src="/assets/roast-drum.jpg"
                alt="NOIR DAKSHIN Drum Roastery"
                className="h-full w-full object-cover object-center filter brightness-100 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-[#1F1C1A]/90 p-4 backdrop-blur-md border border-white/15 shadow-md">
                <span className="text-xs font-serif italic text-white block font-medium">
                  “The acoustic crack guides our craft.”
                </span>
                <span className="text-[10px] font-mono text-[#F5DADF] tracking-widest uppercase block mt-1 font-bold">
                  CHIKMAGALUR & BENGALURU ATELIER
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
