import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface PageLoaderProps {
  onLoadingComplete: () => void;
}

const COFFEE_JOURNEY_STAGES = [
  {
    step: 'I',
    title: 'ESTATE ORIGIN',
    subtitle: 'BABA BUDAN GIRI HIGHLANDS • 1,900M ASL',
    description: 'Native shade canopies and morning mountain mist',
    type: 'image' as const,
    src: '/assets/opening-estate-sunrise.jpg',
  },
  {
    step: 'II',
    title: 'SELECTIVE HARVEST',
    subtitle: 'HAND-PICKED CRIMSON CHERRIES',
    description: 'Only 100% ripe heirloom Arabica cherries harvested',
    type: 'image' as const,
    src: '/assets/opening-crimson-cherries.jpg',
  },
  {
    step: 'III',
    title: 'ARTISANAL EXTRACTION',
    subtitle: 'SLOW-DRIP KAAPI DECOCTION',
    description: 'Metre-pour extraction creating rich aromatic crema',
    type: 'video' as const,
    src: '/assets/videos/coffee-decoction-pour.mp4',
    poster: '/assets/opening-brass-kaapi.jpg',
  },
];

export const PageLoader: React.FC<PageLoaderProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isFinishedRef = useRef<boolean>(false);

  // Active Stage: 0 (Estate) -> 1 (Cherries) -> 2 (Decoction Pour Video)
  // Transition smoothly roughly every ~1 second across the ~3s progression
  const activeStageIndex = progress < 36 ? 0 : progress < 72 ? 1 : 2;
  const currentStage = COFFEE_JOURNEY_STAGES[activeStageIndex];

  const handleFinish = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setProgress(100);
    setIsFading(true);
    setTimeout(() => {
      onLoadingComplete();
    }, 650);
  };

  // 1. Procedural Highland Mist & Golden Dew Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mistClouds = Array.from({ length: 14 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.85,
      radius: Math.random() * 260 + 140,
      vx: Math.random() * 0.35 + 0.12,
      vy: (Math.random() - 0.5) * 0.08,
      alpha: Math.random() * 0.22 + 0.08,
    }));

    const particles = Array.from({ length: 24 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      vx: Math.random() * 0.25 - 0.12,
      vy: -Math.random() * 0.4 - 0.15,
      alpha: Math.random() * 0.55 + 0.15,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      mistClouds.forEach((cloud) => {
        cloud.x += cloud.vx;
        cloud.y += cloud.vy;

        if (cloud.x - cloud.radius > width) {
          cloud.x = -cloud.radius;
        }

        const gradient = ctx.createRadialGradient(
          cloud.x,
          cloud.y,
          0,
          cloud.x,
          cloud.y,
          cloud.radius
        );
        gradient.addColorStop(0, `rgba(245, 218, 223, ${cloud.alpha * 0.5})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${cloud.alpha * 0.25})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(245, 218, 223, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 2. Play extraction video when stage 2 is reached
  useEffect(() => {
    if (activeStageIndex === 2 && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [activeStageIndex]);

  // 3. Sequential 1-second coffee guide animation pacing (~2.8s total)
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (isFinishedRef.current) {
        clearInterval(interval);
        return;
      }

      current += 1;
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          handleFinish();
        }, 300);
      }
    }, 28);

    return () => clearInterval(interval);
  }, []);

  // Circumference for the circular progress ring (r = 46)
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`fixed inset-0 z-[300] flex items-center justify-center select-none overflow-hidden transition-all duration-700 ease-in-out bg-[#0D0B0A] ${
        isFading
          ? 'opacity-0 scale-105 pointer-events-none filter blur-md'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. Multi-Stage Animated Video Background (Plays each stage ~1 sec like an animation film reel) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#0D0B0A]">
        {/* Stage 0: The Misty Estate Sunrise */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            activeStageIndex === 0 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src="/assets/opening-estate-sunrise.jpg"
            alt="Baba Budan Giri Estate"
            className="h-full w-full object-cover object-center filter brightness-90 contrast-105 transform scale-105 transition-transform duration-[6000ms] ease-out will-change-transform"
          />
        </div>

        {/* Stage 1: Hand-Picked Ripe Crimson Cherries */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            activeStageIndex === 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src="/assets/opening-crimson-cherries.jpg"
            alt="Hand-Picked Crimson Cherries"
            className="h-full w-full object-cover object-center filter brightness-95 contrast-110 transform scale-108 transition-transform duration-[6000ms] ease-out will-change-transform"
          />
        </div>

        {/* Stage 2: Master Artisanal Pour Video (Completely distinct from hero roasting beans!) */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            activeStageIndex === 2 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster="/assets/opening-brass-kaapi.jpg"
            src="/assets/videos/coffee-decoction-pour.mp4"
            className="h-full w-full object-cover object-center filter brightness-90 contrast-115 will-change-transform"
          />
        </div>

        {/* Procedural Mountain Mist & Sunbeam Overlay */}
        <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-65" />

        {/* Warm Anamorphic Espresso Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0A] via-[#0D0B0A]/35 to-[#0D0B0A]/75 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#2D2926]/40 to-[#0D0B0A]/90 mix-blend-multiply z-10 pointer-events-none" />
      </div>

      {/* 2. Centerpiece: Luxury Brand Emblem & Coffee Guide Pacing */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-lg">
        <div className="relative flex items-center justify-center">
          {/* Ambient Warm Glow */}
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

          {/* Center Emblem */}
          <div className="absolute h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white/95 border border-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col items-center justify-center text-[#2D2926] transition-transform duration-500">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#2D2926]">
              N
            </span>
            <div className="h-[2.5px] w-4 bg-[#E05A7E] rounded-full mt-0.5" />
          </div>
        </div>

        {/* Dynamic Coffee Guide / Animated Journey Title */}
        <div className="mt-5 flex flex-col items-center">
          <span className="font-display text-sm sm:text-base tracking-[0.28em] font-bold text-white uppercase drop-shadow-md">
            NOIR DAKSHIN
          </span>

          {/* Step Pill with Smooth Dynamic Text Transition */}
          <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md shadow-sm transition-all duration-500">
            <Sparkles className="h-3 w-3 text-[#E05A7E] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-[#F5DADF] uppercase font-bold">
              {currentStage.step}. {currentStage.title}
            </span>
          </div>

          <p className="text-[11px] sm:text-xs font-sans text-white/80 mt-1.5 font-medium tracking-wide transition-all duration-500">
            {currentStage.subtitle}
          </p>

          {/* 3 Sequential Stage Progress Dots */}
          <div className="mt-3 flex items-center gap-2">
            {COFFEE_JOURNEY_STAGES.map((s, idx) => (
              <div
                key={s.step}
                className={`h-1 rounded-full transition-all duration-500 ${
                  activeStageIndex === idx
                    ? 'w-7 bg-[#F5DADF]'
                    : activeStageIndex > idx
                    ? 'w-3 bg-white/60'
                    : 'w-3 bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Terroir Progress Pill */}
          <div className="mt-3 flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
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
