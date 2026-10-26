import React, { useState, useEffect, useMemo } from 'react';
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
  Sparkles,
  Layers,
  ShoppingBag,
  ExternalLink,
  Scale,
  Gauge
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NOIR_BREW_METHODS } from '../data/brewing';
import { NOIR_PRODUCTS } from '../data/products';
import type { BrewMethod, Product } from '../types';

interface BrewingPageProps {
  onDiscoverProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, grind: string) => void;
}

export const BrewingPage: React.FC<BrewingPageProps> = ({
  onDiscoverProduct,
  onAddToCart,
}) => {
  const navigate = useNavigate();

  // Active Method State
  const [selectedMethodId, setSelectedMethodId] = useState<string>(NOIR_BREW_METHODS[0].id);
  const selectedMethod = useMemo(() => {
    return NOIR_BREW_METHODS.find((m) => m.id === selectedMethodId) || NOIR_BREW_METHODS[0];
  }, [selectedMethodId]);

  // Dynamic Ratio Calculator State
  const [coffeeGrams, setCoffeeGrams] = useState<number>(() => {
    return selectedMethodId === 'espresso' ? 18.5 : selectedMethodId === 'filter-kaapi' ? 30 : selectedMethodId === 'coldbrew' ? 80 : 20;
  });
  const [ratio, setRatio] = useState<number>(() => {
    return selectedMethodId === 'espresso' ? 2 : selectedMethodId === 'filter-kaapi' ? 4 : selectedMethodId === 'coldbrew' ? 8 : 16;
  });

  // Whenever method changes, initialize sensible defaults
  useEffect(() => {
    if (selectedMethodId === 'espresso') {
      setCoffeeGrams(18.5);
      setRatio(2.0);
    } else if (selectedMethodId === 'filter-kaapi') {
      setCoffeeGrams(30);
      setRatio(4.0);
    } else if (selectedMethodId === 'coldbrew') {
      setCoffeeGrams(80);
      setRatio(8.0);
    } else if (selectedMethodId === 'aeropress') {
      setCoffeeGrams(16);
      setRatio(13.5);
    } else {
      setCoffeeGrams(20);
      setRatio(16.0);
    }
    handleResetTimer();
  }, [selectedMethodId]);

  // Calculations
  const targetWaterMl = Math.round(coffeeGrams * ratio);
  const bloomWaterMl = Math.round(coffeeGrams * 2.5);
  const estimatedCups = Math.max(1, Math.round(targetWaterMl / 180));

  // Live Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [completedNotification, setCompletedNotification] = useState<boolean>(false);

  // Active Stage Calculation based on timer seconds
  const currentStageIndex = useMemo(() => {
    if (!selectedMethod.stages || selectedMethod.stages.length === 0) return 0;
    for (let i = 0; i < selectedMethod.stages.length; i++) {
      if (timerSeconds <= selectedMethod.stages[i].timeSec) {
        return i;
      }
    }
    return selectedMethod.stages.length - 1;
  }, [selectedMethod.stages, timerSeconds]);

  // Timer Tick Hook
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          const next = prev + 1;
          const maxSecs = selectedMethod.stages
            ? selectedMethod.stages[selectedMethod.stages.length - 1].timeSec
            : 240;
          
          if (next >= maxSecs && !completedNotification) {
            setCompletedNotification(true);
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.8 },
              colors: ['#E05A7E', '#C89658', '#2D2926'],
            });
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, selectedMethod.stages, completedNotification]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setCompletedNotification(false);
  };

  // Recommended Products for the Active Method
  const recommendedProducts = useMemo(() => {
    const ids = selectedMethod.recommendedProductIds || ['prod-01', 'prod-02'];
    return NOIR_PRODUCTS.filter((p) => ids.includes(p.id));
  }, [selectedMethod]);

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] selection:bg-[#F5DADF] selection:text-[#2D2926] pb-32">
      {/* 1. Sticky Sub-Header */}
      <header className="sticky top-0 z-40 bg-white/95 border-b border-[#2D2926]/10 px-4 sm:px-8 py-3 backdrop-blur-xl transition-all shadow-xs">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 text-xs font-semibold hover:bg-[#F5DADF]/40 text-[#2D2926] transition-all cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#E05A7E]" />
              <span>Back to Atelier</span>
            </button>
            <span className="text-xs font-mono text-[#7A726D] hidden md:inline">
              / THE ATELIER BREW LAB • EXTRACTION & RATIO STUDIO
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-[10px] font-mono text-emerald-800 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>EXTRACTION HUD: 93.0°C • 110 PPM TDS • 1:16.0 OPTIMAL</span>
            </div>

            <button
              onClick={() => navigate('/collection')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2926] text-[#FAF7F5] text-xs font-bold hover:bg-black transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <Coffee className="h-3.5 w-3.5 text-[#C89658]" />
              <span>Explore 12 Single-Origins</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-14 px-4 sm:px-8 overflow-hidden border-b border-[#2D2926]/10 bg-gradient-to-b from-[#FAF7F5] via-white to-[#FAF7F5]">
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[850px] bg-gradient-to-b from-[#C89658]/10 via-[#F5DADF]/35 to-transparent blur-[120px] rounded-full" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5DADF] border border-[#2D2926]/10 text-xs font-mono text-[#2D2926] font-bold uppercase tracking-widest mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#E05A7E]" />
            <span>BARISTA THERMODYNAMICS • CALIBRATED EXTRACTION STUDIO</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#2D2926] leading-[1.08] mb-6">
            The Master <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#2D2926] via-[#C89658] to-[#E05A7E] bg-clip-text text-transparent">
              Brew Laboratory
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-[#5E5854] text-sm sm:text-base lg:text-lg leading-relaxed font-sans font-normal mb-8">
            Specialty coffee is fluid physics and organic chemistry. Dial in exact water-to-coffee ratios, execute stage-guided pour timers, and unlock the sacred floral terpenes of shade-grown Western Ghats terroir.
          </p>

          {/* Quick Method Selector Pills */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-4xl mx-auto">
            {NOIR_BREW_METHODS.map((method: BrewMethod) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethodId(method.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-sans font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedMethod.id === method.id
                    ? 'bg-[#2D2926] text-white shadow-md'
                    : 'bg-white border border-[#2D2926]/15 text-[#5E5854] hover:bg-[#F5DADF]/40'
                }`}
              >
                {method.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Main Extraction Studio: Method Dossier & Live Stopwatch Clock */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Method Imagery, Specs & Stage-by-Stage Timeline */}
          <div className="lg:col-span-7 space-y-6">
            {/* Active Method Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D2926]/10 shadow-[0_12px_35px_rgba(45,41,38,0.06)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase text-[#E05A7E] font-bold tracking-wider">
                    {selectedMethod.tagline}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#2D2926] mt-1">
                    {selectedMethod.name}
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 text-xs font-mono font-bold text-[#2D2926] self-start">
                  <Timer className="h-3.5 w-3.5 text-[#C89658]" />
                  <span>Target: {selectedMethod.time}</span>
                </span>
              </div>

              {/* Method Picture */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#2D2926]/10 bg-neutral-100 shadow-sm">
                <img
                  src={selectedMethod.image}
                  alt={selectedMethod.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white text-xs font-mono font-bold">
                  Recommended Vessel: {selectedMethod.yieldVolume}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#5E5854] leading-relaxed">
                {selectedMethod.description}
              </p>

              {/* Technical Extraction Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 text-center">
                  <Thermometer className="h-4 w-4 text-[#E05A7E] mx-auto mb-1" />
                  <div className="text-[10px] text-[#7A726D] font-mono font-bold uppercase">WATER TEMP</div>
                  <div className="text-xs font-bold text-[#2D2926] mt-0.5">{selectedMethod.temp}</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 text-center">
                  <Gauge className="h-4 w-4 text-[#C89658] mx-auto mb-1" />
                  <div className="text-[10px] text-[#7A726D] font-mono font-bold uppercase">GRIND CALIBRATION</div>
                  <div className="text-xs font-bold text-[#2D2926] mt-0.5 truncate">{selectedMethod.grind}</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 text-center">
                  <Scale className="h-4 w-4 text-[#2D2926] mx-auto mb-1" />
                  <div className="text-[10px] text-[#7A726D] font-mono font-bold uppercase">STANDARD RATIO</div>
                  <div className="text-xs font-bold text-[#2D2926] mt-0.5">{selectedMethod.ratio}</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 text-center">
                  <Droplet className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                  <div className="text-[10px] text-[#7A726D] font-mono font-bold uppercase">SERVE YIELD</div>
                  <div className="text-xs font-bold text-[#2D2926] mt-0.5">{selectedMethod.yieldVolume}</div>
                </div>
              </div>

              {/* Master Roaster Pro Tip */}
              <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#C89658]/30 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-[#C89658] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#8C5E28] uppercase font-mono tracking-wider">
                    Master Roaster Dial-In Secret
                  </h4>
                  <p className="text-xs text-[#5E5854] mt-1 leading-relaxed">
                    {selectedMethod.proTip}
                  </p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Live Stage Timeline */}
            {selectedMethod.stages && selectedMethod.stages.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D2926]/10 shadow-[0_12px_35px_rgba(45,41,38,0.06)] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#2D2926]/10">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#E05A7E]" />
                    <h3 className="font-display font-bold text-lg text-[#2D2926]">
                      Stage-by-Stage Pouring Protocol
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[#7A726D]">
                    Stage {currentStageIndex + 1} of {selectedMethod.stages.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedMethod.stages.map((stage, idx) => {
                    const isActive = idx === currentStageIndex && isTimerRunning;
                    const isPassed = timerSeconds > stage.timeSec;

                    return (
                      <div
                        key={stage.title}
                        className={`p-4 rounded-2xl border transition-all ${
                          isActive
                            ? 'bg-[#FAF7F5] border-[#E05A7E] ring-2 ring-[#E05A7E]/20 shadow-xs'
                            : isPassed
                            ? 'bg-[#FAF7F5]/50 border-[#2D2926]/10 opacity-75'
                            : 'bg-white border-[#2D2926]/10'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                isActive
                                  ? 'bg-[#E05A7E] text-white animate-pulse'
                                  : isPassed
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-[#FAF7F5] text-[#2D2926] border border-[#2D2926]/15'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="font-bold text-[#2D2926]">{stage.title}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {stage.waterMl > 0 && (
                              <span className="text-[#8C5E28] font-semibold">{stage.waterMl} ml</span>
                            )}
                            <span className="text-[#7A726D]">@ {formatTimer(stage.timeSec)}</span>
                          </div>
                        </div>

                        <p className="text-xs text-[#5E5854] mt-1 pl-7 leading-relaxed">
                          {stage.instruction}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Stopwatch & Dynamic Ratio Calculator */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Precision Stopwatch */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D2926]/10 shadow-[0_12px_35px_rgba(45,41,38,0.06)] text-center relative overflow-hidden">
              <div className="text-xs font-mono uppercase tracking-widest text-[#7A726D] mb-1 font-bold">
                Live Precision Extraction Clock
              </div>

              {/* Huge Timer Digital Readout */}
              <div className="text-6xl font-mono font-bold text-[#2D2926] my-6 tracking-tighter">
                {formatTimer(timerSeconds)}
              </div>

              {/* Active Stage Indicator */}
              {selectedMethod.stages && (
                <div className="mb-6 p-2.5 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/10 text-xs font-mono">
                  <span className="text-[#7A726D] uppercase block text-[10px]">CURRENT ACTION:</span>
                  <span className="font-bold text-[#E05A7E]">
                    {selectedMethod.stages[currentStageIndex]?.title || 'Extraction Complete'}
                  </span>
                </div>
              )}

              {/* Clock Action Buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-8 py-3.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer ${
                    isTimerRunning
                      ? 'bg-amber-600 text-white'
                      : 'bg-[#2D2926] text-white hover:bg-black'
                  }`}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="h-4 w-4" /> Pause Clock
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-white" /> Start Extraction Clock
                    </>
                  )}
                </button>

                <button
                  onClick={handleResetTimer}
                  className="p-3.5 rounded-full border border-[#2D2926]/15 hover:bg-neutral-100 text-[#2D2926] transition-colors cursor-pointer"
                  title="Reset clock"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {completedNotification && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-semibold animate-fadeIn">
                  Extraction target time achieved! Savor while hot.
                </div>
              )}
            </div>

            {/* Dynamic Water & Coffee Ratio Calculator */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D2926]/10 shadow-[0_12px_35px_rgba(45,41,38,0.06)] space-y-5">
              <h3 className="font-display font-bold text-lg text-[#2D2926] flex items-center gap-2">
                <Droplet className="h-4 w-4 text-[#E05A7E]" />
                Dynamic Extraction Calculator
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
                  max="60"
                  step="0.5"
                  value={coffeeGrams}
                  onChange={(e) => setCoffeeGrams(Number(e.target.value))}
                  className="w-full accent-[#2D2926] cursor-pointer"
                />
              </div>

              {/* Brew Ratio Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[#2D2926] mb-2">
                  <span>Brew Ratio</span>
                  <span className="font-mono text-[#8C5E28] text-sm">1 : {ratio}</span>
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

              {/* Target Yield Result Banner */}
              <div className="p-5 rounded-2xl bg-[#2D2926] text-[#FAF7F5] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-[#F5DADF] uppercase">
                      Target Hot Water Yield
                    </div>
                    <div className="text-3xl font-display font-bold">
                      {targetWaterMl} <span className="text-sm font-normal text-neutral-300">ml / grams</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase">Estimated Servings</div>
                    <div className="text-sm font-mono font-bold text-[#F5DADF]">
                      ~{estimatedCups} {estimatedCups === 1 ? 'Cup' : 'Cups'}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">Recommended Bloom:</span>
                  <span className="text-emerald-400 font-bold">{bloomWaterMl} ml @ 45s</span>
                </div>
              </div>
            </div>

            {/* Recommended Coffees for this Brew Method */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D2926]/10 shadow-[0_12px_35px_rgba(45,41,38,0.06)] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2D2926]/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#C89658]" />
                  <h3 className="font-display font-bold text-base text-[#2D2926]">
                    Curated Lots for {selectedMethod.name}
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {recommendedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-between gap-3 hover:border-[#2D2926]/25 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 rounded-xl object-cover border border-[#2D2926]/10 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-mono text-[#E05A7E] font-bold block">
                          LOT #{product.num} • {product.origin}
                        </span>
                        <h4 className="font-display text-xs sm:text-sm font-bold text-[#2D2926]">
                          {product.name}
                        </h4>
                        <span className="text-[11px] font-mono font-bold text-[#8C5E28]">
                          {product.price}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          if (onDiscoverProduct) {
                            onDiscoverProduct(product);
                          } else {
                            navigate(`/product/${product.id}`);
                          }
                        }}
                        className="p-2 rounded-xl bg-white border border-[#2D2926]/15 hover:bg-[#F5DADF]/40 text-[#2D2926] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                        title="View Lot Dossier"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>

                      {onAddToCart && (
                        <button
                          onClick={() => onAddToCart(product, 'Whole Bean')}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#2D2926] text-white text-xs font-bold hover:bg-black transition-all cursor-pointer shadow-2xs"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Visual Grind Size Calibration Guide */}
        <section className="mt-20 p-6 sm:p-10 rounded-3xl bg-white border border-[#2D2926]/10 shadow-[0_12px_35px_rgba(45,41,38,0.06)]">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono uppercase text-[#E05A7E] font-bold tracking-widest block mb-1">
              BURR CALIBRATION MATRIX
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2926]">
              Visual Grind Size Reference
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#5E5854]">
              Particle distribution dictates the surface contact area and extraction velocity. Compare your burr output against our roastery calibration benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { level: 'Extra Fine', microns: '200–350 µm', texture: 'Flour / Powder', bestFor: 'Davarah & Turkish', iconColor: 'text-[#E05A7E]' },
              { level: 'Fine', microns: '350–500 µm', texture: 'Fine Table Salt', bestFor: '9-Bar Lever Espresso', iconColor: 'text-[#C89658]' },
              { level: 'Medium-Fine', microns: '500–700 µm', texture: 'Fine Sand', bestFor: 'Aeropress & Moka Pot', iconColor: 'text-[#2D2926]' },
              { level: 'Medium', microns: '700–900 µm', texture: 'Coarse Sand', bestFor: 'V60 & Kalita Wave', iconColor: 'text-emerald-700' },
              { level: 'Coarse', microns: '900–1,200 µm', texture: 'Cracked Sea Salt', bestFor: 'French Press & Cold Brew', iconColor: 'text-indigo-700' },
            ].map((grind) => (
              <div key={grind.level} className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 flex flex-col justify-between">
                <div>
                  <span className={`text-[10px] font-mono font-bold uppercase block mb-1 ${grind.iconColor}`}>
                    {grind.microns}
                  </span>
                  <h4 className="font-display font-bold text-base text-[#2D2926] mb-1">
                    {grind.level}
                  </h4>
                  <p className="text-[11px] text-[#7A726D]">
                    Tactile Feel: <strong className="text-[#2D2926]">{grind.texture}</strong>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2D2926]/10">
                  <span className="text-[9px] font-mono uppercase text-[#7A726D] block">Ideal Pairing</span>
                  <span className="text-xs font-bold text-[#2D2926] block">{grind.bestFor}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Barista Sensory Troubleshooting Guide */}
        <section className="mt-12 p-6 sm:p-10 rounded-3xl bg-white border border-[#2D2926]/10 shadow-[0_12px_35px_rgba(45,41,38,0.06)]">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono uppercase text-[#8C5E28] font-bold tracking-widest block mb-1">
              SENSORY TROUBLESHOOTING
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2926]">
              Dial-In Troubleshooting Clinic
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#5E5854]">
              Every extraction tells a story. Use your palate to identify under or over-extraction and calibrate accordingly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <h4 className="font-display font-bold text-base text-[#2D2926]">
                  Cup Tastes Sharp or Sour
                </h4>
              </div>
              <span className="text-[10px] font-mono uppercase text-[#E05A7E] font-bold block">
                DIAGNOSIS: UNDER-EXTRACTION
              </span>
              <p className="text-xs text-[#5E5854] leading-relaxed">
                Water ran too fast through large channels, leaving sweet core lipids un-dissolved and pulling only harsh volatile organic acids.
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#2D2926]/10 text-xs">
                <span className="font-bold text-[#2D2926] block mb-0.5">Barista Fix:</span>
                <span className="text-[#5E5854]">Grind 2 notches finer, increase water temperature to 94°C, and slow down your pour speed.</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-600" />
                <h4 className="font-display font-bold text-base text-[#2D2926]">
                  Cup Tastes Bitter or Astringent
                </h4>
              </div>
              <span className="text-[10px] font-mono uppercase text-[#E05A7E] font-bold block">
                DIAGNOSIS: OVER-EXTRACTION
              </span>
              <p className="text-xs text-[#5E5854] leading-relaxed">
                Water stayed in contact with coffee grounds too long, dissolving heavy cellular tannins, bitter quinic acids, and wood lignin.
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#2D2926]/10 text-xs">
                <span className="font-bold text-[#2D2926] block mb-0.5">Barista Fix:</span>
                <span className="text-[#5E5854]">Grind coarser, decrease water temperature to 91°C, and finish your drawdown 20 seconds earlier.</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-600" />
                <h4 className="font-display font-bold text-base text-[#2D2926]">
                  Cup Tastes Sweet & Transparent
                </h4>
              </div>
              <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block">
                DIAGNOSIS: SWEET SPOT (19–21% EXT)
              </span>
              <p className="text-xs text-[#5E5854] leading-relaxed">
                Harmonious balance of sparkling malic acidity, intense caramelized sugar sweetness, and clean, prolonged dark cacao finish.
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#2D2926]/10 text-xs">
                <span className="font-bold text-[#2D2926] block mb-0.5">Barista Fix:</span>
                <span className="text-[#5E5854]">Lock in your recipe! Note the exact dose, grind setting, and water temperature in your ledger.</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
