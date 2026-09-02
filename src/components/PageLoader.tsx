import React, { useEffect, useState } from 'react';
import { Sparkles, Flame, Coffee, Compass, Droplets } from 'lucide-react';

interface PageLoaderProps {
  onLoadingComplete: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);
  const [currentStageText, setCurrentStageText] = useState<string>('HARVESTING CHIKMAGALUR 1,900M...');
  const [tempGauge, setTempGauge] = useState<string>('24°C');

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Smooth progression up to 100% in ~2.0s
      current += Math.floor(Math.random() * 4) + 2;

      if (current < 25) {
        setCurrentStageText('HARVESTING CHIKMAGALUR ARABICA 1,900M ASL...');
        setTempGauge(`${Math.floor(24 + (current / 25) * 80)}°C`);
      } else if (current < 55) {
        setCurrentStageText('CAST-IRON CONVECTION DRUM • 204°C FIRST CRACK...');
        setTempGauge(`${Math.floor(104 + ((current - 25) / 30) * 100)}°C`);
      } else if (current < 85) {
        setCurrentStageText('EXTRACTING SOUTH INDIAN BRASS DECOCTION...');
        setTempGauge('94.0°C Decoction');
      } else {
        setCurrentStageText('AERATING VELVET GOLDEN FOAM • READY');
        setTempGauge('First Sip Locked');
      }

      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            onLoadingComplete();
          }, 700);
        }, 400);
      } else {
        setProgress(current);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-[300] flex flex-col items-center justify-between bg-[#040302] p-6 sm:p-12 text-[#f4eee6] select-none transition-all duration-700 ease-in-out ${
        isFading
          ? 'opacity-0 scale-105 pointer-events-none filter blur-sm'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Amber Heat & Steam Glows */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="h-[450px] w-[450px] sm:h-[650px] sm:w-[650px] rounded-full bg-radial-at-c from-[#c89658]/22 via-[#8a4b18]/10 to-transparent mix-blend-screen animate-pulse" />
        <div className="absolute inset-0 bg-radial-vignette opacity-90" />
      </div>

      {/* Top Header: Atelier Heritage Seal */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-5xl">
        <div className="flex items-center gap-2 text-[9px] sm:text-[11px] font-sans tracking-[0.3em] uppercase text-[#c89658] bg-[#0c0906]/80 px-3.5 py-1.5 rounded-full border border-[#c89658]/35 backdrop-blur-md">
          <Sparkles className="h-3 w-3 text-[#c89658] animate-spin-slow" />
          <span>DAKSHIN COFFEE ROAST MAISON</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] text-[#8c827a] tracking-widest uppercase">
          <Compass className="h-3 w-3 text-[#c89658]" />
          <span>13°19'N • BABA BUDAN GIRI</span>
        </div>
      </div>

      {/* Centerpiece: Hyper-Cinematic Liquid Coffee Portal & Roasting Core */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto">
        {/* Animated Sacred Coffee Droplet & Glowing Convection Crucible */}
        <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
          {/* Outer Pulsing Aura Rings */}
          <div className="absolute h-36 w-36 sm:h-44 sm:w-44 rounded-full border border-[#c89658]/30 animate-ping opacity-25" />
          <div className="absolute h-28 w-28 sm:h-36 sm:w-36 rounded-full border border-[#e5b877]/40 animate-spin-slow opacity-60" />

          {/* Central Glowing Crucible Orb */}
          <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-b from-[#1c140d] to-[#0a0705] border-2 border-[#c89658] shadow-[0_0_50px_rgba(200,150,88,0.45)] flex items-center justify-center overflow-hidden group">
            {/* Liquid Fill Level in sync with Progress */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#c89658] via-[#e5b877] to-[#ffe5a3] transition-all duration-150 ease-out opacity-85 shadow-[0_0_20px_#e5b877]"
              style={{ height: `${progress}%` }}
            />

            {/* Glowing Golden Coffee Icon Center */}
            <div className="relative z-10 flex flex-col items-center justify-center text-[#070605]">
              <Coffee className="h-8 w-8 sm:h-10 sm:w-10 text-[#f4eee6] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] animate-pulse" />
              <Droplets className="h-3.5 w-3.5 text-[#e5b877] mt-1 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Monumental Brand Typography */}
        <div className="space-y-1 sm:space-y-2">
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl tracking-[0.25em] sm:tracking-[0.3em] font-bold text-[#f4eee6] uppercase drop-shadow-[0_0_35px_rgba(200,150,88,0.4)]">
            NOIR DAKSHIN
          </h1>
          <p className="font-serif italic text-xs sm:text-base text-[#e5b877] tracking-[0.15em]">
            Haute Indian Kaapi Maison • Est. 1998 Bengaluru
          </p>
        </div>

        {/* Live Roasting Telemetry Badge */}
        <div className="mt-4 sm:mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#120e0b] border border-[#382a1d] text-[10px] sm:text-xs font-mono text-[#c89658]">
          <Flame className="h-3.5 w-3.5 text-[#e5b877] animate-pulse" />
          <span className="text-[#f4eee6] font-bold">{tempGauge}</span>
          <span className="text-[#5e5146]">•</span>
          <span className="text-[#a89d93]">{currentStageText}</span>
        </div>
      </div>

      {/* Bottom Progress Bar & Calibrated Status */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-3">
        <div className="flex justify-between items-center w-full text-xs font-mono text-[#8c827a]">
          <span className="text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c89658] animate-ping" />
            <span>Decoction Brewing Film</span>
          </span>
          <span className="text-[#e5b877] font-bold text-sm tracking-wider">{progress}%</span>
        </div>

        {/* Golden Gradient Progress Track */}
        <div className="h-2 w-full bg-[#120e0b] rounded-full overflow-hidden border border-[#2b2016] p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#8a4b18] via-[#c89658] to-[#e5b877] rounded-full transition-all duration-100 ease-out shadow-[0_0_15px_#c89658]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-[9px] font-mono text-[#665a4f] uppercase tracking-widest">
          <span>Single-Estate Harvest</span>
          <span>Slow Cast-Iron Convection</span>
          <span>Brass Davarah Pour</span>
        </div>
      </div>
    </div>
  );
};
