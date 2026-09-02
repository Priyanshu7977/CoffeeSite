import React from 'react';

interface SectionIndicatorProps {
  activeCode: string;
  progress: number;
  onNavigate: (sectionId: string) => void;
}

export const SectionIndicator: React.FC<SectionIndicatorProps> = ({
  activeCode,
  progress,
  onNavigate,
}) => {
  const sections = [
    { code: '00', title: 'HERO', target: '#hero' },
    { code: '01', title: 'ORIGIN', target: '#section-bean' },
    { code: '02', title: 'ROAST', target: '#section-roast' },
    { code: '03', title: 'POUR', target: '#section-pour' },
    { code: '04', title: 'COLLECTION', target: '#section-collection' },
    { code: '05', title: 'ARCHIVE', target: '#section-gallery' },
    { code: '06', title: 'RITUAL', target: '#section-brew-ritual' },
    { code: '07', title: 'VAULT', target: '#section-reserve' },
  ];

  return (
    <aside
      aria-label="Section Navigator Rail"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-row items-center gap-4 md:flex lg:right-10 select-none pointer-events-auto"
    >
      {/* Dynamic Vertical Scroll Progress Line */}
      <div className="relative h-56 w-[2px] bg-[#2D2926]/12 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#E05A7E] to-[#2D2926] transition-all duration-150 ease-out rounded-full shadow-sm"
          style={{ height: `${progress}%` }}
        />
      </div>

      {/* Numbered Section Markers */}
      <div className="flex flex-col items-center gap-3">
        {sections.map((sec) => {
          const isActive = activeCode === sec.code;
          return (
            <button
              key={sec.code}
              onClick={() => onNavigate(sec.target)}
              className="group relative flex items-center justify-end py-0.5 focus:outline-none cursor-pointer"
              aria-label={`Navigate to ${sec.title}`}
            >
              {/* Tooltip on hover */}
              <span className="pointer-events-none absolute right-8 whitespace-nowrap rounded-full bg-white border border-[#2D2926]/10 px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-[#2D2926] opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 font-bold backdrop-blur-md">
                {sec.title}
              </span>

              {/* Number and dot */}
              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-[10px] tracking-[0.15em] transition-all duration-300 ${
                    isActive
                      ? 'font-bold text-[#2D2926] scale-110 drop-shadow-sm'
                      : 'text-[#8C827A] group-hover:text-[#2D2926]'
                  }`}
                >
                  {sec.code}
                </span>

                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-4 bg-[#E05A7E] shadow-[0_0_6px_#F5DADF]'
                      : 'w-1.5 bg-[#2D2926]/20 group-hover:w-2.5 group-hover:bg-[#E05A7E]'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
