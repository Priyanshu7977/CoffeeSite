import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface PageLoaderProps {
  onLoadingComplete: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Fast incremental progression up to 100% in ~1.5s
      current += Math.floor(Math.random() * 8) + 4;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            onLoadingComplete();
          }, 600);
        }, 300);
      } else {
        setProgress(current);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-[300] flex flex-col items-center justify-between bg-[#070605] p-8 sm:p-12 text-[#f4eee6] select-none transition-opacity duration-700 ease-in-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Tagline */}
      <div className="flex items-center gap-2 text-[10px] font-sans tracking-[0.35em] uppercase text-[#c89658]">
        <Sparkles className="h-3 w-3 text-[#c89658] animate-spin-slow" />
        <span>HAUTE ROASTERY & ATELIER</span>
      </div>

      {/* Center Brand Title & Reveal */}
      <div className="flex flex-col items-center text-center">
        <span className="font-display text-2xl sm:text-3xl tracking-[0.35em] font-bold text-[#f4eee6] mb-2 uppercase">
          NOIR ROAST
        </span>
        <span className="font-serif italic text-sm text-[#8c827a] tracking-widest">
          Est. 1998 • Kyoto / Zurich
        </span>
      </div>

      {/* Bottom Progress Counter & Progress Bar */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3">
        <div className="flex justify-between items-center w-full text-xs font-mono text-[#8c827a]">
          <span className="text-[10px] uppercase tracking-[0.2em]">Crafting Film</span>
          <span className="text-[#e5b877] font-bold">{progress}%</span>
        </div>
        <div className="h-[2px] w-full bg-[#1c1612] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#c89658] to-[#e5b877] transition-all duration-100 ease-out shadow-[0_0_10px_#c89658]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
