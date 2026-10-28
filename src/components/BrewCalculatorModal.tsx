import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Sparkles, 
  Volume2, 
  VolumeX 
} from 'lucide-react';

interface BrewStage {
  title: string;
  durationSec: number;
  waterPercent: number; // percentage of total water target
  instruction: string;
}

interface BrewCalculatorProfile {
  id: string;
  name: string;
  category: string;
  ratioMultiplier: number; // 1 gram coffee : X grams water
  recommendedDose: number;
  temp: string;
  grind: string;
  totalTimeSec: number;
  proTip: string;
  stages: BrewStage[];
}

const BREW_PROFILES: BrewCalculatorProfile[] = [
  {
    id: 'v60',
    name: 'V60 Pour-Over',
    category: 'Pour-Over',
    ratioMultiplier: 16,
    recommendedDose: 18,
    temp: '92°C - 94°C',
    grind: 'Medium-Fine (Kosher Salt)',
    totalTimeSec: 180,
    proTip: 'Pour in slow concentric spirals without touching the paper filter ridges.',
    stages: [
      {
        title: 'Bloom & Degassing',
        durationSec: 45,
        waterPercent: 0.2,
        instruction: 'Pour 20% total water over grounds in gentle spirals. Allow fresh CO2 to bloom.',
      },
      {
        title: 'Primary Pulse Pour',
        durationSec: 45,
        waterPercent: 0.6,
        instruction: 'Pour steadily up to 60% of total target water in center circles.',
      },
      {
        title: 'Final Pour & Drawdown',
        durationSec: 90,
        waterPercent: 1.0,
        instruction: 'Top up to 100% total water. Give one gentle swirl for a flat coffee bed.',
      },
    ],
  },
  {
    id: 'kaapi',
    name: 'South Indian Brass Kaapi',
    category: 'Traditional Decoction',
    ratioMultiplier: 5,
    recommendedDose: 30,
    temp: '96°C (Just off the boil)',
    grind: 'Fine-Medium Chicory Blend',
    totalTimeSec: 300,
    proTip: 'Gently tamp the umbrella disc without over-compacting to allow slow gravity percolation.',
    stages: [
      {
        title: 'Bed Saturation & Tamp',
        durationSec: 60,
        waterPercent: 0.3,
        instruction: 'Saturate coffee bed through top perforations and place tamper disc lightly.',
      },
      {
        title: 'Decoction Extraction',
        durationSec: 240,
        waterPercent: 1.0,
        instruction: 'Fill upper chamber with boiling water. Close lid and let viscous first-decoction drip.',
      },
    ],
  },
  {
    id: 'french-press',
    name: 'French Press Immersion',
    category: 'Full Immersion',
    ratioMultiplier: 14,
    recommendedDose: 25,
    temp: '94°C',
    grind: 'Coarse (Sea Salt)',
    totalTimeSec: 240,
    proTip: 'Break the floating crust at 4:00 and skim the foam before slowly pressing.',
    stages: [
      {
        title: 'Immersion Pour',
        durationSec: 45,
        waterPercent: 1.0,
        instruction: 'Pour all water briskly to agitate grounds completely. Place plunger on top.',
      },
      {
        title: 'Deep Steep',
        durationSec: 150,
        waterPercent: 1.0,
        instruction: 'Allow grounds to steep undisturbed in hot water.',
      },
      {
        title: 'Crust Break & Plunge',
        durationSec: 45,
        waterPercent: 1.0,
        instruction: 'Gently stir crust with spoon, skim fines, and plunge slowly with steady pressure.',
      },
    ],
  },
  {
    id: 'aeropress',
    name: 'AeroPress Inverted',
    category: 'Pressure Steep',
    ratioMultiplier: 12,
    recommendedDose: 16,
    temp: '88°C - 90°C',
    grind: 'Fine-Medium (Table Salt)',
    totalTimeSec: 105,
    proTip: 'Stop pressing as soon as you hear the first hiss of escaping steam.',
    stages: [
      {
        title: 'Inverted Fill & Agitation',
        durationSec: 30,
        waterPercent: 1.0,
        instruction: 'Pour full water into inverted chamber, stir 5 times to saturate.',
      },
      {
        title: 'Cap Seal & Steep',
        durationSec: 45,
        waterPercent: 1.0,
        instruction: 'Lock rinsed paper filter cap on. Let brew steep quietly.',
      },
      {
        title: 'Flip & Gentle Press',
        durationSec: 30,
        waterPercent: 1.0,
        instruction: 'Carefully invert onto carafe and press steadily with light forearm pressure.',
      },
    ],
  },
  {
    id: 'cold-brew',
    name: 'Chilled Slow Drip Cold Brew',
    category: 'Cold Immersion',
    ratioMultiplier: 8,
    recommendedDose: 60,
    temp: 'Filtered Room Temp / Chilled',
    grind: 'Extra Coarse (Cracked Peppercorn)',
    totalTimeSec: 60,
    proTip: 'Steep in airtight glass vessel in the refrigerator for 16-18 hours for maximum velvety sweetness.',
    stages: [
      {
        title: 'Initial Saturation',
        durationSec: 60,
        waterPercent: 1.0,
        instruction: 'Saturate extra coarse grounds with cool filtered water, cover and refrigerate for 16h.',
      },
    ],
  },
];

interface BrewCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMethodId?: string;
}

export const BrewCalculatorModal: React.FC<BrewCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialMethodId,
}) => {
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    initialMethodId || BREW_PROFILES[0].id
  );
  const currentProfile =
    BREW_PROFILES.find((p) => p.id === selectedMethodId) || BREW_PROFILES[0];

  const [coffeeGrams, setCoffeeGrams] = useState<number>(currentProfile.recommendedDose);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(currentProfile.totalTimeSec);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);

  // Sync dose when profile changes
  useEffect(() => {
    setCoffeeGrams(currentProfile.recommendedDose);
    setSecondsRemaining(currentProfile.totalTimeSec);
    setIsTimerRunning(false);
    setCurrentStageIndex(0);
  }, [selectedMethodId, currentProfile]);

  // Audio Chime using Web Audio API
  const playChime = (frequency: number = 880, duration: number = 0.25) => {
    if (isSoundMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Timer interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            playChime(1174.66, 0.6); // High D6 chime
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining, isSoundMuted]);

  // Determine active stage based on elapsed time
  const elapsedSec = currentProfile.totalTimeSec - secondsRemaining;
  useEffect(() => {
    let accumulated = 0;
    for (let i = 0; i < currentProfile.stages.length; i++) {
      accumulated += currentProfile.stages[i].durationSec;
      if (elapsedSec <= accumulated) {
        if (currentStageIndex !== i) {
          setCurrentStageIndex(i);
          playChime(659.25, 0.2); // E5 stage transition note
        }
        break;
      }
    }
  }, [elapsedSec, currentProfile.stages, currentStageIndex]);

  if (!isOpen) return null;

  // Exact calculations
  const totalWaterGrams = Math.round(coffeeGrams * currentProfile.ratioMultiplier);
  const bloomWaterGrams = Math.round(coffeeGrams * Math.min(3, currentProfile.ratioMultiplier));
  const estimatedYieldMl = Math.round(totalWaterGrams * 0.88);

  const activeStage = currentProfile.stages[currentStageIndex] || currentProfile.stages[0];
  const activeStageWaterTarget = Math.round(totalWaterGrams * activeStage.waterPercent);

  // Format time MM:SS
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setSecondsRemaining(currentProfile.totalTimeSec);
    setCurrentStageIndex(0);
  };

  const progressPercent = Math.min(
    100,
    Math.round((elapsedSec / currentProfile.totalTimeSec) * 100)
  );

  return (
    <div className="fixed inset-0 z-[280] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#2D2926]/75 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Main Dialog */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-[#FAF7F5] border border-[#2D2926]/10 p-5 sm:p-7 shadow-2xl text-[#2D2926] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2D2926]/10 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#2D2926] text-white flex items-center justify-center shrink-0">
              <Coffee className="h-4 w-4 text-[#F5DADF]" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#E05A7E] font-bold block">
                NOIR BREW LAB
              </span>
              <h3 className="font-display text-base sm:text-lg font-bold text-[#2D2926]">
                Artisanal Ratio & Live Extraction Timer
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSoundMuted(!isSoundMuted)}
              className="p-1.5 rounded-full border border-[#2D2926]/10 bg-white text-[#5E5854] hover:text-[#2D2926] transition-colors cursor-pointer"
              title={isSoundMuted ? 'Unmute Audio Beep' : 'Mute Audio Beep'}
            >
              {isSoundMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-[#E05A7E]" />}
            </button>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full border border-[#2D2926]/10 bg-white flex items-center justify-center text-[#5E5854] hover:text-[#2D2926] transition-colors cursor-pointer shadow-sm"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Method Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-5">
          {BREW_PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setSelectedMethodId(profile.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedMethodId === profile.id
                  ? 'bg-[#2D2926] text-white shadow-sm'
                  : 'bg-white border border-[#2D2926]/10 text-[#5E5854] hover:text-[#2D2926]'
              }`}
            >
              {profile.name}
            </button>
          ))}
        </div>

        {/* Coffee Dose Slider & Target Math */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-6">
          {/* Dose Stepper Card */}
          <div className="sm:col-span-6 p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C827A] font-bold">
                Ground Coffee Dose
              </span>
              <span className="font-display font-bold text-lg text-[#2D2926]">
                {coffeeGrams} grams
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="10"
              max="60"
              step="1"
              value={coffeeGrams}
              onChange={(e) => setCoffeeGrams(parseInt(e.target.value, 10))}
              className="w-full accent-[#2D2926] cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] font-mono text-[#8C827A]">
              <span>10g (Single Cup)</span>
              <span>18g (Golden Std)</span>
              <span>60g (Carafe)</span>
            </div>
          </div>

          {/* Ratio & Yield Output */}
          <div className="sm:col-span-6 grid grid-cols-2 gap-2">
            <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-[#8C827A] uppercase font-bold">
                Total Water (1:{currentProfile.ratioMultiplier})
              </span>
              <div className="font-display font-bold text-xl text-[#2D2926] mt-1">
                {totalWaterGrams} <span className="text-xs font-mono font-normal">grams</span>
              </div>
              <span className="text-[10px] text-[#E05A7E] font-mono mt-0.5 font-bold">
                Bloom: {bloomWaterGrams}g
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-[#8C827A] uppercase font-bold">
                Water Temp
              </span>
              <div className="font-display font-bold text-sm text-[#2D2926] mt-1 truncate">
                {currentProfile.temp}
              </div>
              <span className="text-[10px] text-[#8C827A] font-mono truncate mt-0.5">
                Yield: ~{estimatedYieldMl}ml
              </span>
            </div>
          </div>
        </div>

        {/* Live Step-By-Step Timer Deck */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#1F1C1A] to-[#2D2926] text-white shadow-xl space-y-4 mb-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#F5DADF] font-bold">
                STAGE {currentStageIndex + 1} OF {currentProfile.stages.length}: {activeStage.title}
              </span>
            </div>
            <span className="text-xs font-mono text-[#C89658] font-bold">
              Target Scale: {activeStageWaterTarget}g
            </span>
          </div>

          {/* Big Digital Countdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <div>
              <div className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-white">
                {formatTimer(secondsRemaining)}
              </div>
              <p className="text-xs text-[#F5DADF]/85 mt-1 leading-relaxed max-w-sm">
                {activeStage.instruction}
              </p>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-5 py-3 rounded-2xl bg-[#E05A7E] hover:bg-[#c9496b] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Start Timer</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResetTimer}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title="Reset Extraction Timer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#E05A7E] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Master Roaster Pro Tip */}
        <div className="p-3 rounded-2xl bg-[#F5DADF]/50 border border-[#2D2926]/10 flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 text-[#E05A7E] shrink-0 mt-0.5" />
          <p className="text-xs text-[#2D2926] leading-relaxed italic">
            <strong>Roaster's Note:</strong> {currentProfile.proTip} Grind geometry: <strong>{currentProfile.grind}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
