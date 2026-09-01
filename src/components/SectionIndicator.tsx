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
    { code: '01', title: 'THE BEAN', target: '#section-bean' },
    { code: '02', title: 'THE ROAST', target: '#section-roast' },
    { code: '03', title: 'THE POUR', target: '#section-pour' },
    { code: '04', title: 'COLLECTION', target: '#section-collection' },
    { code: '05', title: 'GALLERY', target: '#section-gallery' },
    { code: '06', title: 'YOUR RITUAL', target: '#section-brew-ritual' },
    { code: '07', title: 'THE VAULT', target: '#section-reserve' },
  ];

  return (
    <aside
      aria-label="Section Navigator Rail"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-row items-center gap-4 md:flex lg:right-10 select-none"
    >
      {/* Dynamic Vertical Scroll Progress Line */}
      <div className="relative h-56 w-[2px] bg-[#1c1612] rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#c89658] to-[#e5b877] transition-all duration-150 ease-out rounded-full shadow-[0_0_8px_#c89658]"
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
              <span className="pointer-events-none absolute right-8 whitespace-nowrap rounded bg-[#14100c] px-2.5 py-1 text-[10px] tracking-[0.25em] uppercase text-[#f4eee6] opacity-0 shadow-xl border border-[#c89658]/30 transition-all duration-300 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0">
                {sec.title}
              </span>

              {/* Number and dot */}
              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-[10px] tracking-[0.15em] transition-all duration-300 ${
                    isActive
                      ? 'font-bold text-[#c89658] scale-125'
                      : 'text-[#5a524c] group-hover:text-[#a89d93]'
                  }`}
                >
                  {sec.code}
                </span>

                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-5 bg-[#c89658] shadow-[0_0_10px_#c89658]'
                      : 'w-1.5 bg-[#2b231d] group-hover:w-3 group-hover:bg-[#8c827a]'
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
