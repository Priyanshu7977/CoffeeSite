import React, { useEffect, useRef, useState } from 'react';

interface PageLoaderProps {
  onLoadingComplete: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onLoadingComplete }) => {
  const [isFading, setIsFading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isFinishedRef = useRef<boolean>(false);

  const handleFinish = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setIsFading(true);
    setTimeout(() => {
      onLoadingComplete();
    }, 500);
  };

  // Play single video immediately on mount and transition to home page after exactly 3 seconds
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    const timer = setTimeout(() => {
      handleFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      onClick={handleFinish}
      className={`fixed inset-0 z-[300] flex items-center justify-center select-none overflow-hidden transition-all duration-700 ease-in-out bg-[#0D0B0A] ${
        isFading
          ? 'opacity-0 scale-105 pointer-events-none filter blur-sm'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. Single Pure Specialty Coffee Pour Video (Plays clean for 3 seconds) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#0D0B0A]">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/opening-brass-kaapi.jpg"
          src="/assets/videos/coffee-decoction-pour.mp4"
          className="h-full w-full object-cover object-center filter brightness-90 contrast-110 will-change-transform"
        />

        {/* Cinematic Overlays: Warm Espresso Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0A] via-[#0D0B0A]/30 to-[#0D0B0A]/70 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#2D2926]/40 to-[#0D0B0A]/85 mix-blend-multiply z-10 pointer-events-none" />
      </div>

      {/* 2. Centerpiece: Pure Luxury Brand Emblem */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        {/* Ambient Warm Golden Glow */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-40 w-40 sm:h-48 sm:w-48 rounded-full bg-[#F5DADF]/20 filter blur-2xl animate-pulse" />

          {/* Luxury Brand Monogram Emblem */}
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white/95 border border-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col items-center justify-center text-[#2D2926]">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#2D2926]">
              N
            </span>
            <div className="h-[2.5px] w-4 bg-[#E05A7E] rounded-full mt-0.5" />
          </div>
        </div>

        {/* Clean Typographic Identity */}
        <div className="mt-4 flex flex-col items-center">
          <span className="font-display text-sm sm:text-base tracking-[0.28em] font-bold text-white uppercase drop-shadow-md">
            NOIR DAKSHIN
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.22em] text-[#F5DADF] uppercase font-semibold mt-1">
            ESTATE HARVEST • BABA BUDAN ROASTERY
          </span>
        </div>
      </div>
    </div>
  );
};
