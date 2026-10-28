import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface PageLoaderProps {
  onLoadingComplete: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isFinishedRef = useRef<boolean>(false);

  const handleFinish = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setProgress(100);
    setIsFading(true);
    setTimeout(() => {
      onLoadingComplete();
    }, 500);
  };

  // Play single video immediately on mount and track exactly 3 seconds
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    const startTime = Date.now();
    const DURATION_MS = 3000; // Plays single video for exactly 3 seconds, then home page appears

    const timer = setInterval(() => {
      if (isFinishedRef.current) {
        clearInterval(timer);
        return;
      }

      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / DURATION_MS) * 100));
      setProgress(currentProgress);

      if (elapsed >= DURATION_MS) {
        clearInterval(timer);
        handleFinish();
      }
    }, 25);

    return () => clearInterval(timer);
  }, []);

  // Circumference for the circular progress ring (r = 46)
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`fixed inset-0 z-[300] flex items-center justify-center select-none overflow-hidden transition-all duration-700 ease-in-out bg-[#0D0B0A] ${
        isFading
          ? 'opacity-0 scale-105 pointer-events-none filter blur-sm'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. Single Pure Specialty Coffee Pour Video (No multiple images, 3 seconds playback) */}
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

      {/* 2. Centerpiece: Luxury Brand Emblem & 3-Second Precision Progress Ring */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-lg">
        <div className="relative flex items-center justify-center">
          {/* Ambient Warm Golden Glow */}
          <div className="absolute h-44 w-44 sm:h-52 sm:w-52 rounded-full bg-[#F5DADF]/25 filter blur-2xl animate-pulse" />

          {/* SVG Circular Progress Ring */}
          <svg className="h-32 w-32 sm:h-36 sm:w-36 -rotate-90 transform">
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="2.5"
            />
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              fill="transparent"
              stroke="#F5DADF"
              strokeWidth="3.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-75 ease-out"
            />
          </svg>

          {/* Center Luxury Emblem */}
          <div className="absolute h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white/95 border border-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col items-center justify-center text-[#2D2926] transition-transform duration-500 hover:scale-105">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#2D2926]">
              N
            </span>
            <div className="h-[2.5px] w-4 bg-[#E05A7E] rounded-full mt-0.5" />
          </div>
        </div>

        {/* Brand Typographic Identity */}
        <div className="mt-5 flex flex-col items-center">
          <span className="font-display text-sm sm:text-base tracking-[0.28em] font-bold text-white uppercase drop-shadow-md">
            NOIR DAKSHIN
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.22em] text-[#F5DADF] uppercase font-semibold mt-1">
            ESTATE HARVEST • BABA BUDAN ROASTERY
          </span>
          <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E05A7E] animate-ping" />
            <span className="text-[9px] font-mono tracking-widest text-[#FAF7F5]/85 uppercase">
              Curating Terroir {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Skip Option (Bottom-Right) */}
      <button
        onClick={handleFinish}
        className="absolute bottom-6 right-6 z-30 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/70 border border-white/15 backdrop-blur-md text-white/70 hover:text-white text-[10px] font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer group active:scale-95"
      >
        <span>Skip Intro</span>
        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>
    </div>
  );
};
