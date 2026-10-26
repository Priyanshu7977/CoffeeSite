import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Coffee, 
  Play, 
  Pause, 
  RotateCcw, 
  Droplet, 
  Thermometer, 
  Timer, 
  Sparkles
} from 'lucide-react';
import { NOIR_BREW_METHODS } from '../data/brewing';
import type { BrewMethod } from '../types';

export const BrewingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<BrewMethod>(NOIR_BREW_METHODS[0]);
  const [coffeeGrams, setCoffeeGrams] = useState<number>(18);
  const [ratio, setRatio] = useState<number>(16); // 1:16 default
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Calculate target water output based on ratio
  const targetWaterMl = Math.round(coffeeGrams * ratio);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 border-b border-[#2D2926]/10 px-4 sm:px-8 py-3.5 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/15 text-xs font-semibold hover:bg-neutral-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </button>
          <div className="text-xs font-mono uppercase tracking-widest text-[#8C827A]">
            The Ritual Laboratory & Extraction Calculator
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 pt-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5DADF] text-[#2D2926] text-xs font-bold uppercase tracking-wider mb-3">
            <Coffee className="h-3.5 w-3.5 text-[#E05A7E]" /> Extraction Precision
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#2D2926] tracking-tight">
            The Master Brew Rituals
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#5E5854]">
            Scientific water-to-coffee ratios, thermal profiles, and calibrated timers designed to release terroir volatiles.
          </p>
        </div>

        {/* Method Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 justify-start sm:justify-center mb-8 scrollbar-none">
          {NOIR_BREW_METHODS.map((m: BrewMethod) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMethod(m);
                handleResetTimer();
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedMethod.id === m.id
                  ? 'bg-[#2D2926] text-[#FAF7F5] shadow-lg'
                  : 'bg-white border border-[#2D2926]/10 text-[#2D2926] hover:bg-neutral-100'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Interactive Calculator & Method Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Method Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#2D2926]/10 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#E05A7E] font-bold">
                  {selectedMethod.tagline}
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#2D2926] mt-1">
                  {selectedMethod.name}
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 text-xs font-mono font-bold text-[#2D2926]">
                Target: {selectedMethod.time}
              </span>
            </div>

            <p className="text-sm text-[#5E5854] leading-relaxed">
              {selectedMethod.description}
            </p>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/5 text-center">
                <Thermometer className="h-4 w-4 text-[#E05A7E] mx-auto mb-1" />
                <div className="text-[10px] text-[#8C827A] font-mono">WATER TEMP</div>
                <div className="text-xs font-bold text-[#2D2926] mt-0.5">{selectedMethod.temp}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/5 text-center">
                <Coffee className="h-4 w-4 text-[#E05A7E] mx-auto mb-1" />
                <div className="text-[10px] text-[#8C827A] font-mono">GRIND SIZE</div>
                <div className="text-xs font-bold text-[#2D2926] mt-0.5 truncate">{selectedMethod.grind}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/5 text-center">
                <Droplet className="h-4 w-4 text-[#E05A7E] mx-auto mb-1" />
                <div className="text-[10px] text-[#8C827A] font-mono">BREW RATIO</div>
                <div className="text-xs font-bold text-[#2D2926] mt-0.5">{selectedMethod.ratio}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/5 text-center">
                <Timer className="h-4 w-4 text-[#E05A7E] mx-auto mb-1" />
                <div className="text-[10px] text-[#8C827A] font-mono">EXTRACTION</div>
                <div className="text-xs font-bold text-[#2D2926] mt-0.5">{selectedMethod.time}</div>
              </div>
            </div>

            {/* Pro Tip Callout */}
            <div className="p-4 rounded-2xl bg-[#F5DADF]/30 border border-[#E05A7E]/20 flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-[#E05A7E] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#2D2926] uppercase font-mono">
                  Roaster's Secret
                </h4>
                <p className="text-xs text-[#5E5854] mt-1 leading-relaxed">
                  {selectedMethod.proTip}
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Extraction Calculator & Stop Timer */}
          <div className="lg:col-span-5 space-y-6">
            {/* Water / Coffee Ratio Calculator */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D2926]/10 shadow-sm space-y-5">
              <h3 className="font-display font-bold text-lg text-[#2D2926] flex items-center gap-2">
                <Droplet className="h-4 w-4 text-[#E05A7E]" />
                Live Extraction Calculator
              </h3>

              {/* Coffee Dose Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[#2D2926] mb-2">
                  <span>Coffee Ground Dose</span>
                  <span className="font-mono text-[#E05A7E] text-sm">{coffeeGrams} grams</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="45"
                  step="1"
                  value={coffeeGrams}
                  onChange={(e) => setCoffeeGrams(Number(e.target.value))}
                  className="w-full accent-[#2D2926] cursor-pointer"
                />
              </div>

              {/* Brew Ratio Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[#2D2926] mb-2">
                  <span>Brew Ratio</span>
                  <span className="font-mono text-[#E05A7E] text-sm">1 : {ratio}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="18"
                  step="0.5"
                  value={ratio}
                  onChange={(e) => setRatio(Number(e.target.value))}
                  className="w-full accent-[#2D2926] cursor-pointer"
                />
              </div>

              {/* Target Yield Result */}
              <div className="p-4 rounded-2xl bg-[#2D2926] text-[#FAF7F5] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-[#F5DADF] uppercase">
                    Target Hot Water Yield
                  </div>
                  <div className="text-2xl font-display font-bold">
                    {targetWaterMl} <span className="text-sm font-normal text-neutral-300">ml / grams</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-[#8C827A] uppercase">Bloom Water</div>
                  <div className="text-sm font-mono font-bold text-[#F5DADF]">
                    ~{Math.round(coffeeGrams * 2.5)} ml
                  </div>
                </div>
              </div>
            </div>

            {/* Precision Timer */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D2926]/10 shadow-sm text-center">
              <div className="text-xs font-mono uppercase tracking-widest text-[#8C827A] mb-1">
                Precision Extraction Clock
              </div>
              <div className="text-5xl font-mono font-bold text-[#2D2926] my-4 tracking-tighter">
                {formatTimer(timerSeconds)}
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-6 py-3 rounded-full font-bold text-xs flex items-center gap-2 shadow-md transition-all ${
                    isTimerRunning
                      ? 'bg-amber-600 text-white'
                      : 'bg-[#2D2926] text-white hover:bg-black'
                  }`}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="h-4 w-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" /> Start Brew Timer
                    </>
                  )}
                </button>
                <button
                  onClick={handleResetTimer}
                  className="p-3 rounded-full border border-[#2D2926]/15 hover:bg-neutral-100 text-[#2D2926] transition-colors"
                  title="Reset clock"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
