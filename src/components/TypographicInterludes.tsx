import React from 'react';

export const InterludeFarmToCup: React.FC = () => {
  return (
    <div className="relative w-full py-16 md:py-24 bg-[#F5DADF] overflow-hidden border-y border-[#2D2926]/10 flex items-center justify-center select-none">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 px-6 text-center">
        <span className="font-display text-2xl sm:text-4xl md:text-5xl text-[#2D2926] font-medium tracking-tight uppercase">
          FROM WESTERN GHATS
        </span>
        <span className="h-[2px] w-12 sm:w-16 bg-[#2D2926]" />
        <span className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-wider text-[#2D2926] uppercase">
          TO BRASS DAVARAH.
        </span>
      </div>
    </div>
  );
};

export const InterludeTakesTime: React.FC = () => {
  return (
    <div className="relative w-full py-20 md:py-32 bg-[#F3ECE7] overflow-hidden flex items-center justify-center select-none border-y border-[#2D2926]/10">
      <div className="relative flex flex-col items-center text-center px-6 max-w-4xl z-10">
        <span className="text-xs font-sans tracking-[0.35em] uppercase text-[#E05A7E] mb-4 font-bold">
          THE PHILOSOPHY OF SLOWNESS
        </span>
        <h2 className="font-display text-4xl sm:text-6xl md:text-8xl text-[#2D2926] font-bold tracking-tight leading-[0.95]">
          Good kaapi <br />
          <span className="italic text-[#E05A7E] font-medium">takes time.</span>
        </h2>
        <span className="font-sans text-xs sm:text-sm text-[#5E5854] tracking-[0.2em] uppercase mt-6 font-semibold">
          230-day shade ripening • Cast-iron drum convection
        </span>
      </div>
    </div>
  );
};

export const InterludeOriginArt: React.FC = () => {
  return (
    <div className="relative w-full py-16 md:py-20 bg-[#FAF7F5] overflow-hidden border-y border-[#2D2926]/10 select-none flex flex-col gap-6">
      {/* Infinite Animated Marquee Ribbon */}
      <div className="flex whitespace-nowrap overflow-hidden">
        <div className="animate-marquee-left flex whitespace-nowrap">
          <div className="flex items-center text-[#2D2926]/20 uppercase font-display font-bold text-4xl sm:text-6xl md:text-7xl tracking-widest">
            <span className="mx-6 hover:text-[#2D2926] transition-colors">BABA BUDAN 1670</span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#E05A7E] mx-4" />
            <span className="mx-6 hover:text-[#2D2926] transition-colors">SHADE-GROWN KAAPI</span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#E05A7E] mx-4" />
            <span className="mx-6 hover:text-[#2D2926] transition-colors">CHIKMAGALUR TERROIR</span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#E05A7E] mx-4" />
            <span className="mx-6 hover:text-[#2D2926] transition-colors">MALABAR MONSOONED</span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#E05A7E] mx-4" />
          </div>

          <div className="flex items-center text-[#2D2926]/20 uppercase font-display font-bold text-4xl sm:text-6xl md:text-7xl tracking-widest">
            <span className="mx-6 hover:text-[#2D2926] transition-colors">BABA BUDAN 1670</span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#E05A7E] mx-4" />
            <span className="mx-6 hover:text-[#2D2926] transition-colors">SHADE-GROWN KAAPI</span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#E05A7E] mx-4" />
            <span className="mx-6 hover:text-[#2D2926] transition-colors">CHIKMAGALUR TERROIR</span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#E05A7E] mx-4" />
            <span className="mx-6 hover:text-[#2D2926] transition-colors">MALABAR MONSOONED</span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#E05A7E] mx-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
