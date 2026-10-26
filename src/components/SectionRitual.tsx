import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Timer, Sparkles } from 'lucide-react';
import { gsap } from '../utils/animations';

export const SectionRitual: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Brew Companion State
  const [coffeeGrams, setCoffeeGrams] = useState<number>(20);
  const [brewSeconds, setBrewSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);

  // Calculations
  const waterGrams = Math.round(coffeeGrams * 16);
  const bloomWater = Math.round(coffeeGrams * 2.5);

  const steps = [
    {
      num: '01',
      title: 'The Micron Grind',
      metric: '280µm Unimodal',
      desc: 'Ground using 98mm blind titanium burrs. Tight particle size distribution prevents micro-fines from choking the filter bed, allowing clean extraction.',
      tip: 'Adjust grinder until ground consistency mirrors raw sea salt crystals.',
    },
    {
      num: '02',
      title: 'The 45-Second Bloom',
      metric: `${bloomWater}g at 93°C`,
      desc: 'Saturate the dry coffee bed with precisely 2.5x dry weight in water. Wait 45 seconds as trapped roasting carbon dioxide expands in violent, fragrant bubbles.',
      tip: 'Do not agitate violently during bloom—allow gentle capillary saturation.',
    },
    {
      num: '03',
      title: 'The Concentric Spiral',
      metric: `${waterGrams}g Total Yield`,
      desc: 'Pour in slow, unbroken spirals starting from the exact center outward, maintaining a laminar 4.5ml/second flow rate without touching the paper rim.',
      tip: 'Complete final drawdown at 3:15 for maximum sweetness and crisp clarity.',
    },
  ];

  // Timer interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setBrewSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setBrewSeconds(0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;

    if (!section || !image || !content) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'bottom 25%',
        scrub: 1.2,
      },
    });

    tl.fromTo(
      image,
      { scale: 1.25, filter: 'brightness(0.6)' },
      { scale: 1.05, filter: 'brightness(1.0)', ease: 'none' }
    ).fromTo(
      content,
      { y: 70, opacity: 0 },
      { y: 0, opacity: 1, ease: 'power3.out' },
      0.1
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="section-ritual"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#070605] py-24 md:py-36 px-6 md:px-12 flex items-center justify-center overflow-hidden border-t border-[#221c17]"
    >
      <div className="mx-auto max-w-7xl w-full">
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#221c17] pb-8">
          <div>
            <div className="flex items-center gap-3 text-xs tracking-[0.3em] text-[#c89658] font-sans font-semibold uppercase mb-3">
              <span className="font-mono text-[#c89658]">04</span>
              <span className="h-[1px] w-8 bg-[#c89658]/60" />
              <span>THE RITUAL / THE NOIR CEREMONY</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#f4eee6] font-light tracking-tight max-w-2xl">
              The Ceremony <br />
              of <span className="italic text-[#e5b877]">Unbroken Precision.</span>
            </h2>
          </div>

          <div className="flex items-center gap-3 font-sans text-xs tracking-[0.2em] text-[#8c827a] uppercase">
            <span>Golden Ratio 1:16 • 93°C Alpine Spring</span>
          </div>
        </div>

        {/* Split Grid: Steps Left / Live Brew Assistant Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left Column: 3-Stage Ceremony Cards */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-4">
              {steps.map((st, idx) => {
                const isSelected = activeStep === idx;
                return (
                  <div
                    key={st.num}
                    onClick={() => setActiveStep(idx)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#120e0b] border-[#c89658] shadow-[0_0_25px_rgba(200,150,88,0.15)]'
                        : 'bg-[#0a0806]/80 border-[#221c17] hover:border-[#382d24]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-[#c89658]">
                          {st.num}
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl text-[#f4eee6]">
                          {st.title}
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-[#e5b877] bg-[#c89658]/10 px-3 py-1 rounded-full border border-[#c89658]/20">
                        {st.metric}
                      </span>
                    </div>

                    <p className="font-sans text-xs sm:text-sm text-[#b0a59b] font-light leading-relaxed mb-3">
                      {st.desc}
                    </p>

                    {isSelected && (
                      <div className="pt-3 border-t border-[#221c17] flex items-center gap-2 text-[11px] font-serif italic text-[#c89658]">
                        <Sparkles className="h-3 w-3 shrink-0" />
                        <span>Pro Tip: {st.tip}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live Interactive Brew Companion & Ratio Calculator */}
          <div ref={contentRef} className="lg:col-span-6 rounded-2xl bg-[#0f0c09]/95 border border-[#c89658]/30 p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#221c17]">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-[#c89658]" />
                  <span className="text-xs font-sans tracking-[0.2em] text-[#f4eee6] uppercase font-semibold">
                    Live Ceremony Companion
                  </span>
                </div>
                <span className="font-mono text-xs text-[#8c827a] tracking-widest uppercase">
                  PID 93.0°C
                </span>
              </div>

              {/* Live Brewing Stopwatch Display */}
              <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-[#070605] border border-[#221c17] mb-8">
                <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#8c827a] mb-2">
                  Drawdown Timer
                </span>
                <span className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-[#e5b877] gold-glow mb-6">
                  {formatTime(brewSeconds)}
                </span>

                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleTimer}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#c89658] text-[#070605] font-sans text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#e5b877] transition-all cursor-pointer shadow-[0_0_15px_rgba(200,150,88,0.3)]"
                  >
                    {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    <span>{isTimerRunning ? 'Pause' : 'Start Bloom'}</span>
                  </button>
                  <button
                    onClick={resetTimer}
                    className="p-2.5 rounded-full border border-[#332b24] text-[#8c827a] hover:text-[#f4eee6] hover:border-[#c89658] transition-all cursor-pointer"
                    aria-label="Reset Timer"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Interactive Ratio Calculator */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-sans uppercase tracking-[0.15em]">
                  <span className="text-[#8c827a]">Coffee Dose (Dry Grounds)</span>
                  <span className="font-mono font-bold text-[#f4eee6]">{coffeeGrams}g</span>
                </div>

                <input
                  type="range"
                  min={15}
                  max={35}
                  step={1}
                  value={coffeeGrams}
                  onChange={(e) => setCoffeeGrams(Number(e.target.value))}
                  className="w-full accent-[#c89658] cursor-pointer bg-[#221c17] h-1.5 rounded-lg appearance-none"
                />

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#221c17]">
                  <div className="rounded-xl bg-[#14100c] p-3.5 border border-[#221c17]">
                    <span className="text-[10px] font-sans tracking-[0.2em] text-[#8c827a] uppercase block mb-1">
                      Bloom Water (45s)
                    </span>
                    <span className="font-mono text-base font-bold text-[#e5b877]">
                      {bloomWater}g (93°C)
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#14100c] p-3.5 border border-[#221c17]">
                    <span className="text-[10px] font-sans tracking-[0.2em] text-[#8c827a] uppercase block mb-1">
                      Total Water Yield
                    </span>
                    <span className="font-mono text-base font-bold text-[#f4eee6]">
                      {waterGrams}g (1:16)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
