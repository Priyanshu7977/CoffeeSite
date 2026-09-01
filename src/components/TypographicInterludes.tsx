import React from 'react';

export const InterludeFarmToCup: React.FC = () => {
  return (
    <div className="relative w-full py-16 md:py-24 bg-[#070605] overflow-hidden border-y border-[#221c17]/60 flex items-center justify-center select-none">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 px-6 text-center">
        <span className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#8c827a] font-light tracking-tight uppercase">
          FROM FARM
        </span>
        <span className="h-[1px] w-12 sm:w-20 bg-[#c89658]/70" />
        <span className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-widest text-[#f4eee6] uppercase drop-shadow-[0_0_25px_rgba(200,150,88,0.3)]">
          TO CUP.
        </span>
      </div>
    </div>
  );
};

export const InterludeTakesTime: React.FC = () => {
  return (
    <div className="relative w-full py-20 md:py-32 bg-[#070605] overflow-hidden flex items-center justify-center select-none border-y border-[#221c17]">
      <div className="relative flex flex-col items-center text-center px-6 max-w-6xl">
        <span className="text-[11px] font-sans tracking-[0.4em] uppercase text-[#c89658] mb-4">
          THE PHILOSOPHY OF SLOWNESS
        </span>
        <h2 className="font-serif text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-[#f4eee6] font-light tracking-tight leading-[0.92]">
          GOOD COFFEE <br />
          <span className="italic text-[#e5b877] font-display font-semibold">TAKES TIME.</span>
        </h2>
        <span className="font-sans text-xs sm:text-sm text-[#8c827a] tracking-[0.25em] uppercase mt-6">
          Uncompromised 240-day cherry development • Micro-batch convection roast
        </span>
      </div>
    </div>
  );
};

export const InterludeOriginArt: React.FC = () => {
  return (
    <div className="relative w-full py-16 md:py-24 bg-[#070605] overflow-hidden border-y border-[#221c17] select-none flex flex-col gap-6">
      {/* Row 1: Leftward Infinite Animated Moving Marquee Ribbon */}
      <div className="flex whitespace-nowrap overflow-hidden">
        <div className="animate-marquee-left flex whitespace-nowrap">
          <div className="flex items-center text-[#c89658]/35 uppercase font-display font-bold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-widest">
            <span className="mx-6 hover:text-[#c89658] transition-colors cursor-pointer">ORIGIN MATTERS</span>
            <span className="h-3.5 w-3.5 rounded-full bg-[#c89658] mx-4 shadow-[0_0_10px_#c89658]" />
            <span className="mx-6 hover:text-[#e5b877] transition-colors cursor-pointer">ROAST IS AN ART</span>
            <span className="h-3.5 w-3.5 rounded-full bg-[#c89658] mx-4 shadow-[0_0_10px_#c89658]" />
            <span className="mx-6 hover:text-[#c89658] transition-colors cursor-pointer">TERROIR IS SACRED</span>
            <span className="h-3.5 w-3.5 rounded-full bg-[#c89658] mx-4 shadow-[0_0_10px_#c89658]" />
            <span className="mx-6 hover:text-[#e5b877] transition-colors cursor-pointer">NO SHORTCUTS</span>
            <span className="h-3.5 w-3.5 rounded-full bg-[#c89658] mx-4 shadow-[0_0_10px_#c89658]" />
          </div>

          {/* Seamless duplicate loop */}
          <div className="flex items-center text-[#c89658]/35 uppercase font-display font-bold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-widest">
            <span className="mx-6 hover:text-[#c89658] transition-colors cursor-pointer">ORIGIN MATTERS</span>
            <span className="h-3.5 w-3.5 rounded-full bg-[#c89658] mx-4 shadow-[0_0_10px_#c89658]" />
            <span className="mx-6 hover:text-[#e5b877] transition-colors cursor-pointer">ROAST IS AN ART</span>
            <span className="h-3.5 w-3.5 rounded-full bg-[#c89658] mx-4 shadow-[0_0_10px_#c89658]" />
            <span className="mx-6 hover:text-[#c89658] transition-colors cursor-pointer">TERROIR IS SACRED</span>
            <span className="h-3.5 w-3.5 rounded-full bg-[#c89658] mx-4 shadow-[0_0_10px_#c89658]" />
            <span className="mx-6 hover:text-[#e5b877] transition-colors cursor-pointer">NO SHORTCUTS</span>
            <span className="h-3.5 w-3.5 rounded-full bg-[#c89658] mx-4 shadow-[0_0_10px_#c89658]" />
          </div>
        </div>
      </div>

      {/* Row 2: Rightward Counter-Moving Infinite Animated Marquee Ribbon */}
      <div className="flex whitespace-nowrap overflow-hidden">
        <div className="animate-marquee-right flex whitespace-nowrap">
          <div className="flex items-center text-[#8c827a]/25 uppercase font-serif italic text-3xl sm:text-5xl md:text-6xl tracking-widest">
            <span className="mx-6">Est. 1998</span>
            <span className="h-2 w-2 rounded-full bg-[#8c827a]/40 mx-4" />
            <span className="mx-6 text-[#e5b877]/40">2,400M Elevation</span>
            <span className="h-2 w-2 rounded-full bg-[#8c827a]/40 mx-4" />
            <span className="mx-6">Gesha Village Terroir</span>
            <span className="h-2 w-2 rounded-full bg-[#8c827a]/40 mx-4" />
            <span className="mx-6 text-[#c89658]/40">First Crack 204°C</span>
            <span className="h-2 w-2 rounded-full bg-[#8c827a]/40 mx-4" />
            <span className="mx-6">9-Bar Velvet Crema</span>
            <span className="h-2 w-2 rounded-full bg-[#8c827a]/40 mx-4" />
          </div>

          {/* Seamless duplicate loop */}
          <div className="flex items-center text-[#8c827a]/25 uppercase font-serif italic text-3xl sm:text-5xl md:text-6xl tracking-widest">
            <span className="mx-6">Est. 1998</span>
            <span className="h-2 w-2 rounded-full bg-[#8c827a]/40 mx-4" />
            <span className="mx-6 text-[#e5b877]/40">2,400M Elevation</span>
            <span className="h-2 w-2 rounded-full bg-[#8c827a]/40 mx-4" />
            <span className="mx-6">Gesha Village Terroir</span>
            <span className="h-2 w-2 rounded-full bg-[#8c827a]/40 mx-4" />
            <span className="mx-6 text-[#c89658]/40">First Crack 204°C</span>
            <span className="h-2 w-2 rounded-full bg-[#8c827a]/40 mx-4" />
            <span className="mx-6">9-Bar Velvet Crema</span>
            <span className="h-2 w-2 rounded-full bg-[#8c827a]/40 mx-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
