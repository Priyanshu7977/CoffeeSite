import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Sparkles, 
  Lock, 
  Award, 
  Compass, 
  Droplets, 
  RotateCw, 
  Search, 
  Check, 
  Zap, 
  Coffee,
  CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReserveModal } from '../components/ReserveModal';
import { sanitizeName, isValidEmail, isValidName, hasMaliciousContent } from '../utils/validation';
import type { ReserveBatch } from '../types';

interface ExtendedReserveBatch extends ReserveBatch {
  scaScore: number;
  image: string;
  producer: string;
  geoCoordinates: string;
  soilComposition: string;
  flavorPyramid: {
    top: string;
    heart: string;
    base: string;
  };
  roasterNote: string;
  directTradePremium: string;
  idealBrew: string;
  serialPrefix: string;
  category: 'anaerobic' | 'altitude' | 'cask' | 'peaberry';
}

interface TiltState {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
  isHovered: boolean;
}

export const ReservePage: React.FC = () => {
  const navigate = useNavigate();

  // Selection & Modal States
  const [selectedBatch, setSelectedBatch] = useState<ReserveBatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'sca' | 'altitude' | 'scarcity'>('sca');

  // Interactive Card Flip & 3D Tilt States
  const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>({});
  const [cardTilts, setCardTilts] = useState<{ [key: string]: TiltState }>({});

  // Concierge Palate Matcher State
  const [sommelierSensory, setSommelierSensory] = useState<'cacao' | 'floral' | 'caramel' | 'coastal'>('cacao');
  const [sommelierBrew, setSommelierBrew] = useState<'davarah' | 'espresso' | 'pourover' | 'frenchpress'>('davarah');
  const [sommelierMatched, setSommelierMatched] = useState<ExtendedReserveBatch | null>(null);

  // Cellar Aging Guide Active Tab
  const [activeAgingTab, setActiveAgingTab] = useState<number>(0);

  // VIP Waitlist Form State
  const [waitlistName, setWaitlistName] = useState<string>('');
  const [waitlistEmail, setWaitlistEmail] = useState<string>('');
  const [waitlistCity, setWaitlistCity] = useState<string>('Bengaluru');
  const [waitlistError, setWaitlistError] = useState<string>('');
  const [waitlistSuccess, setWaitlistSuccess] = useState<string>('');

  // Live Countdown Timer (14 days, 8 hours, 42 min countdown)
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 14,
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Complete Extended Reserve Dataset
  const reserveBatches: ExtendedReserveBatch[] = useMemo(() => [
    {
      id: 'batch-01',
      name: 'BABA BUDAN OBSIDIAN',
      vintage: '2026 Monsoon Harvest',
      origin: 'Chikmagalur, Karnataka',
      region: 'Mullayanagiri & Chandragiri Hills',
      altitude: '1,900m — 2,100m ASL',
      varietal: 'Wild Heirloom Arabica Selection 795',
      process: '96h Anaerobic Cold Natural',
      notes: ['Floral Jasmine', 'Smoked Cardamom', 'Bittersweet Mysore Cacao'],
      allocationLeft: 14,
      totalAllocations: 85,
      roastLevel: 'Omniroast (204°C First Crack)',
      price: '₹2,800',
      badge: '14 Tins Remaining',
      description: 'Single-estate sacred Baba Budan micro-lot grown on ancestral slopes with 96h anaerobic cold-tank fermentation.',
      scaScore: 95.5,
      image: '/assets/product-black-origin.jpg',
      producer: 'Arjun Gowda — Chandragiri Heritage Estate (Est. 1892)',
      geoCoordinates: "13°19'N, 75°46'E",
      soilComposition: 'Deep Volcanic Humus & Forest Loam (pH 6.2)',
      flavorPyramid: {
        top: 'Wild Jasmine Petals & Bergamot Bloom',
        heart: 'Crushed Green Cardamom & Black Plum',
        base: 'Dense Mysore Dark Cacao & Smoked Truffle',
      },
      roasterNote: 'Cast-iron roasted in 4kg micro-batches with slow convective air to preserve delicate monoterpenes.',
      directTradePremium: '+380% above C-Market Benchmark',
      idealBrew: 'South Indian Brass Davarah or Precision V60 (92.5°C)',
      serialPrefix: 'BBO-26',
      category: 'anaerobic',
    },
    {
      id: 'batch-02',
      name: 'MALABAR MONSOONED CASK',
      vintage: 'Coastal Wind Series 2026',
      origin: 'Malabar Coast, Kerala',
      region: 'Arabian Sea Shoreline',
      altitude: '1,400m ASL',
      varietal: 'Super-Bold A-Grade Arabica',
      process: '16-Week Oceanic Sea Wind Cured',
      notes: ['Dark Chocolate', 'Toasted Oak', 'Earthy Molasses'],
      allocationLeft: 8,
      totalAllocations: 60,
      roastLevel: 'Medium-Dark Velvet Espresso',
      price: '₹2,400',
      badge: '8 Tins Remaining',
      description: 'Sun-cured beans exposed to moisture-laden Arabian Sea winds for 16 weeks, yielding an unctuous low-acid crema.',
      scaScore: 94.8,
      image: '/assets/product-reserve-1998.jpg',
      producer: 'Suresh Kurien — Malabar Coastal Curing House',
      geoCoordinates: "11°15'N, 75°46'E",
      soilComposition: 'Coastal Alluvial Loam with Sea Mineral Deposits',
      flavorPyramid: {
        top: 'Candied Orange Peel & Nutmeg',
        heart: 'Charred French Oak & Toasted Hazelnut',
        base: 'Thick Blackstrap Molasses & Dark Cocoa Nib',
      },
      roasterNote: 'Roast curve extended through the Maillard phase for 6 minutes to maximize body and golden crema stability.',
      directTradePremium: '+320% above C-Market Benchmark',
      idealBrew: '9-Bar Lever Espresso (19g in, 38g out in 28s)',
      serialPrefix: 'MMC-26',
      category: 'cask',
    },
    {
      id: 'batch-03',
      name: 'ARAKU VALLEY TRIBAL HONEY',
      vintage: 'Eastern Ghats Bio-Dynamic Lot',
      origin: 'Araku Valley, Andhra Pradesh',
      region: 'Ananthagiri Mountain Ridge',
      altitude: '1,450m — 1,600m ASL',
      varietal: 'Bio-Dynamic Red Catuai & S9',
      process: 'Pulped Golden Honey (African Raised Beds)',
      notes: ['Wild Forest Honey', 'Roasted Cashew', 'Sweet Mandarin'],
      allocationLeft: 22,
      totalAllocations: 100,
      roastLevel: 'Medium Filter Roast',
      price: '₹2,600',
      badge: '22 Tins Remaining',
      description: 'Bio-dynamically cultivated by indigenous adivasi tribal collectives in mineral-rich red soil valleys.',
      scaScore: 94.2,
      image: '/assets/product-high-altitude.jpg',
      producer: 'Araku Smallholder Tribal Cooperative',
      geoCoordinates: "18°19'N, 82°52'E",
      soilComposition: 'Iron-Rich Ferruginous Red Loam & High Silica',
      flavorPyramid: {
        top: 'Mandarin Zest & Sun-Dried Apricot',
        heart: 'Raw Golden Honey & Warm Nutmeg',
        base: 'Roasted Cashew Butter & Cane Sugar Toffee',
      },
      roasterNote: 'Rapid roast cycle designed to accentuate the crisp malic brightness and delicate pulped honey sweetness.',
      directTradePremium: '+410% above C-Market Benchmark',
      idealBrew: 'Chemex or Kalita Wave Flat-Bed (94°C, 1:16)',
      serialPrefix: 'AVH-26',
      category: 'altitude',
    },
    {
      id: 'batch-04',
      name: 'COORG RAINFOREST PEABERRY',
      vintage: 'Kodagu Special Edition',
      origin: 'Coorg, Karnataka',
      region: 'Brahmagiri Mountain Range',
      altitude: '1,650m ASL',
      varietal: 'Single-Bean Peaberry Selection',
      process: 'Double Washed & Slow Cast-Iron Roast',
      notes: ['Black Fig', 'Green Cardamom', 'Raw Jaggery Caramel'],
      allocationLeft: 11,
      totalAllocations: 75,
      roastLevel: 'Light-Medium Convection',
      price: '₹2,200',
      badge: '11 Tins Remaining',
      description: 'Rare spherical single-bean Peaberry cherries hand-harvested beneath silver oak, pepper vines, and wild figs.',
      scaScore: 94.0,
      image: '/assets/product-midnight.jpg',
      producer: 'Madappa Family — Kutta Valley Estate (Est. 1912)',
      geoCoordinates: "12°25'N, 75°44'E",
      soilComposition: 'Humus-Dense Biodiversity Soil with Pepper Residue',
      flavorPyramid: {
        top: 'Fresh Black Mission Fig & Dried Cranberry',
        heart: 'Cracked Green Cardamom Seed',
        base: 'Dense Raw Jaggery Molasses & Toasted Brioche',
      },
      roasterNote: 'Even thermal conductivity roast in perforated cast-iron drum ensures uniform peaberry core caramelization.',
      directTradePremium: '+340% above C-Market Benchmark',
      idealBrew: 'Aeropress Inverted or French Press (91°C)',
      serialPrefix: 'CRP-26',
      category: 'peaberry',
    },
  ], []);

  // Filter and Sort Processing
  const filteredBatches = useMemo(() => {
    return reserveBatches
      .filter((batch) => {
        const matchesCategory = activeCategory === 'all' || batch.category === activeCategory;
        const matchesQuery = 
          batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          batch.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          batch.notes.some(n => n.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'sca') return b.scaScore - a.scaScore;
        if (sortBy === 'scarcity') return a.allocationLeft - b.allocationLeft;
        if (sortBy === 'altitude') return parseInt(b.altitude) - parseInt(a.altitude);
        return 0;
      });
  }, [reserveBatches, activeCategory, searchQuery, sortBy]);

  // Dynamic Palate Matcher Calculation
  useEffect(() => {
    let bestMatch: ExtendedReserveBatch = reserveBatches[0];
    if (sommelierSensory === 'cacao' && sommelierBrew === 'davarah') {
      bestMatch = reserveBatches[0]; // BABA BUDAN OBSIDIAN
    } else if (sommelierSensory === 'coastal' || sommelierBrew === 'espresso') {
      bestMatch = reserveBatches[1]; // MALABAR MONSOONED CASK
    } else if (sommelierSensory === 'caramel' || sommelierBrew === 'pourover') {
      bestMatch = reserveBatches[2]; // ARAKU VALLEY
    } else if (sommelierSensory === 'floral' || sommelierBrew === 'frenchpress') {
      bestMatch = reserveBatches[3]; // COORG PEABERRY
    }
    setSommelierMatched(bestMatch);
  }, [sommelierSensory, sommelierBrew, reserveBatches]);

  const handleOpenReserve = (batch?: ReserveBatch) => {
    setSelectedBatch(batch || reserveBatches[0]);
    setIsModalOpen(true);
  };

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 3D Mouse Tilt Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setCardTilts((prev) => ({
      ...prev,
      [cardId]: { rotateX, rotateY, glareX, glareY, isHovered: true },
    }));
  };

  const handleMouseLeave = (cardId: string) => {
    setCardTilts((prev) => ({
      ...prev,
      [cardId]: { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false },
    }));
  };

  // VIP Waitlist Submission Handler
  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistError('');
    setWaitlistSuccess('');

    if (hasMaliciousContent(waitlistName) || hasMaliciousContent(waitlistEmail)) {
      setWaitlistError('Security Alert: Script or HTML tags are strictly blocked.');
      return;
    }

    if (!isValidName(waitlistName)) {
      setWaitlistError('Please enter a valid full name (alphabets only).');
      return;
    }

    if (!isValidEmail(waitlistEmail)) {
      setWaitlistError('Please enter a valid personal or enterprise email address.');
      return;
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#E05A7E', '#C89658', '#FAF7F5'],
    });

    setWaitlistSuccess(
      `Priority Confirmed for ${sanitizeName(waitlistName)}. You are #48 on the private allocation register for the 2026/2027 Winter harvest allotment.`
    );
    setWaitlistName('');
    setWaitlistEmail('');
  };

  return (
    <div className="min-h-screen bg-[#0E0C0A] text-[#FAF7F5] selection:bg-[#E05A7E] selection:text-white pb-32">
      {/* 1. Atelier Top Navigation & Live Vault Monitor */}
      <header className="sticky top-0 z-40 bg-[#0E0C0A]/90 border-b border-white/10 px-4 sm:px-8 py-3.5 backdrop-blur-xl transition-all">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 text-[#FAF7F5] transition-all cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#E05A7E]" />
              <span>Back to Atelier</span>
            </button>
            <span className="text-xs font-mono text-white/40 hidden md:inline">
              / PRIVATE CELLAR VAULT • 2026 MONSOON ALLOCATIONS
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Atmospheric Purge Monitor */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-[10px] font-mono text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>VAULT PURGE ACTIVE: 16.2°C • 52% RH • N₂ SEALED</span>
            </div>

            <button
              onClick={() => handleOpenReserve()}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#C89658] to-[#E05A7E] text-[#0E0C0A] text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow-[0_0_20px_rgba(200,150,88,0.25)]"
            >
              <Lock className="h-3.5 w-3.5 text-[#0E0C0A]" />
              <span>Request Allocation</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero: The Sacred Reserve Vault */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 overflow-hidden border-b border-white/10">
        {/* Subtle Ambient Background Gradients */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] bg-gradient-to-b from-[#C89658]/15 via-[#E05A7E]/10 to-transparent blur-[120px] rounded-full" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-40" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#F5DADF] uppercase tracking-widest mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#E05A7E]" />
            <span>SCA 94.5+ GRAND CRU • NUMBERED WAX-SEALED ALLOCATIONS</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FAF7F5] leading-[1.08] mb-6">
            Single-Estate <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#FAF7F5] via-[#F5DADF] to-[#C89658] bg-clip-text text-transparent">
              Vintage Reserves
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-[#A8A199] text-sm sm:text-base lg:text-lg leading-relaxed font-sans font-normal mb-10">
            Secluded high-altitude plots in the mist-shrouded Western Ghats. Harvested exclusively at peak 22°+ Brix sugar density, anaerobic cold-fermented, and cast-iron roasted in strictly numbered allocations of fewer than 85 tins worldwide.
          </p>

          {/* Live Atmospheric Telemetry HUD Card */}
          <div className="mx-auto max-w-4xl p-4 sm:p-6 rounded-2xl bg-[#161311] border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="pt-2 md:pt-0 md:px-3">
                <span className="text-[10px] font-mono tracking-wider text-[#A8A199] uppercase block mb-1">
                  Global Remaining
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-mono font-bold text-[#FAF7F5]">55 / 320</span>
                  <span className="text-[10px] font-mono text-[#E05A7E] font-semibold">Tins Left</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#C89658] to-[#E05A7E] rounded-full w-[17%]" />
                </div>
              </div>

              <div className="pt-2 md:pt-0 md:px-3">
                <span className="text-[10px] font-mono tracking-wider text-[#A8A199] uppercase block mb-1">
                  Harvest Cycle
                </span>
                <span className="text-sm sm:text-base font-bold text-[#FAF7F5] block">2026 Monsoon</span>
                <span className="text-[11px] font-sans text-emerald-400">Open Allocation Window</span>
              </div>

              <div className="pt-2 md:pt-0 md:px-3">
                <span className="text-[10px] font-mono tracking-wider text-[#A8A199] uppercase block mb-1">
                  Cellar Packaging
                </span>
                <span className="text-sm sm:text-base font-bold text-[#FAF7F5] block">Wax-Sealed Tin</span>
                <span className="text-[11px] font-sans text-[#A8A199]">N₂ Oxygen-Flushed</span>
              </div>

              <div className="pt-2 md:pt-0 md:px-3">
                <span className="text-[10px] font-mono tracking-wider text-[#A8A199] uppercase block mb-1">
                  Window Closes In
                </span>
                <div className="flex items-center gap-1 font-mono text-sm sm:text-base font-bold text-[#C89658]">
                  <span>{String(timeLeft.days).padStart(2, '0')}d</span>:
                  <span>{String(timeLeft.hours).padStart(2, '0')}h</span>:
                  <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>:
                  <span className="text-[#E05A7E]">{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
                <span className="text-[10px] font-sans text-white/40">Automatic Vault Lock</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Filter & Search Bar */}
      <section className="sticky top-[57px] z-30 bg-[#0E0C0A]/95 border-b border-white/10 py-4 px-4 sm:px-8 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by lot, origin, or note..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-[#FAF7F5] placeholder-white/40 focus:outline-none focus:border-[#E05A7E] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Allocations (4)' },
              { id: 'anaerobic', label: 'Anaerobic Ferment' },
              { id: 'cask', label: 'Arabian Sea Cask' },
              { id: 'altitude', label: 'High Altitude 1,900m+' },
              { id: 'peaberry', label: 'Rare Peaberry' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-sans whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#FAF7F5] text-[#0E0C0A] font-bold shadow-md'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs text-white/60">
            <span className="font-mono text-[10px] uppercase">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'sca' | 'altitude' | 'scarcity')}
              className="bg-white/5 border border-white/10 text-xs rounded-lg px-2.5 py-1.5 text-[#FAF7F5] focus:outline-none focus:border-[#E05A7E] cursor-pointer"
            >
              <option value="sca" className="bg-[#161311]">Highest SCA Cupping Score</option>
              <option value="scarcity" className="bg-[#161311]">Scarcity (Fewest Tins Left)</option>
              <option value="altitude" className="bg-[#161311]">Altitude (Highest Elevation)</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4. Main Reserve Batches Showcase (3D Tilt Cards with Flip Agronomy) */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredBatches.map((batch) => {
            const isFlipped = flippedCards[batch.id];
            const tilt = cardTilts[batch.id] || { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false };
            const allocationPercentage = Math.round((batch.allocationLeft / batch.totalAllocations) * 100);

            return (
              <div
                key={batch.id}
                onMouseMove={(e) => handleMouseMove(e, batch.id)}
                onMouseLeave={() => handleMouseLeave(batch.id)}
                style={{
                  perspective: '1200px',
                }}
                className="group relative"
              >
                {/* 3D Tilting Card Container */}
                <div
                  style={{
                    transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                    transition: tilt.isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s ease-out',
                    transformStyle: 'preserve-3d',
                  }}
                  className={`relative rounded-3xl bg-[#161311] border border-white/10 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.5)] transition-all ${
                    isFlipped ? 'border-[#C89658]/40 ring-1 ring-[#C89658]/20' : 'hover:border-white/20'
                  }`}
                >
                  {/* Dynamic Glare Overlay */}
                  {tilt.isHovered && (
                    <div
                      className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden z-20"
                      style={{
                        background: `radial-gradient(circle 350px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.06), transparent 80%)`,
                      }}
                    />
                  )}

                  {!isFlipped ? (
                    /* FRONT OF CARD: Luxury Visual & Tasting Profile */
                    <div className="flex flex-col justify-between h-full">
                      {/* Top Header: Badge & Registry ID */}
                      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-[#FAF7F5] text-[#0E0C0A] font-mono text-[10px] font-bold">
                            {batch.serialPrefix}
                          </span>
                          <span className="text-xs font-mono text-[#A8A199]">{batch.vintage}</span>
                        </div>

                        {/* SCA Score Medallion */}
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C89658]/15 border border-[#C89658]/30 text-[#C89658] text-xs font-mono font-bold">
                          <Award className="h-3.5 w-3.5 text-[#C89658]" />
                          <span>{batch.scaScore} SCA GRAND CRU</span>
                        </div>
                      </div>

                      {/* Title & Origin */}
                      <div className="mb-4">
                        <div className="text-[11px] font-mono text-[#E05A7E] uppercase tracking-widest font-bold mb-1">
                          {batch.origin} • {batch.altitude}
                        </div>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FAF7F5] tracking-tight">
                          {batch.name}
                        </h2>
                        <p className="mt-2 text-xs sm:text-sm text-[#A8A199] leading-relaxed">
                          {batch.description}
                        </p>
                      </div>

                      {/* Sensory Flavor Pyramid */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-5 space-y-2">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[#C89658] font-bold">
                          Sensory Flavor Pyramid
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                            <span className="text-[9px] font-mono text-white/40 block mb-0.5">TOP</span>
                            <span className="font-sans font-medium text-white text-[11px] leading-tight block">
                              {batch.flavorPyramid.top}
                            </span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                            <span className="text-[9px] font-mono text-white/40 block mb-0.5">HEART</span>
                            <span className="font-sans font-medium text-[#F5DADF] text-[11px] leading-tight block">
                              {batch.flavorPyramid.heart}
                            </span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                            <span className="text-[9px] font-mono text-white/40 block mb-0.5">FINISH</span>
                            <span className="font-sans font-medium text-[#C89658] text-[11px] leading-tight block">
                              {batch.flavorPyramid.base}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Scarcity Allocation Bar */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                          <span className="text-[#A8A199] flex items-center gap-1.5">
                            <Droplets className="h-3 w-3 text-[#E05A7E]" /> Allocation Remaining
                          </span>
                          <span className="text-[#FAF7F5] font-bold">
                            {batch.allocationLeft} / {batch.totalAllocations} Tins Left ({allocationPercentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#C89658] via-[#E05A7E] to-[#F5DADF] rounded-full transition-all duration-700"
                            style={{ width: `${allocationPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions & Price */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-white/40 block">Price Per Tin</span>
                          <span className="font-display text-2xl font-bold text-[#FAF7F5]">{batch.price}</span>
                          <span className="text-[10px] font-sans text-white/40 ml-1">/ 250g Tin</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleFlip(batch.id)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-sans text-white/80 transition-all cursor-pointer"
                            title="Inspect Soil & Roaster Agronomy"
                          >
                            <RotateCw className="h-3.5 w-3.5 text-[#C89658]" />
                            <span className="hidden sm:inline">Telemetry</span>
                          </button>

                          <button
                            onClick={() => handleOpenReserve(batch)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C89658] to-[#E05A7E] text-[#0E0C0A] font-bold text-xs hover:brightness-110 transition-all cursor-pointer shadow-lg"
                          >
                            <Lock className="h-3.5 w-3.5 text-[#0E0C0A]" />
                            <span>Reserve Allocation</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* BACK OF CARD: Full Roaster Telemetry & Agronomy Dossier */
                    <div className="flex flex-col justify-between h-full animate-fadeIn">
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                          <div className="flex items-center gap-2">
                            <Compass className="h-4 w-4 text-[#C89658]" />
                            <span className="font-mono text-xs font-bold text-[#C89658] uppercase">
                              AGRONOMY & ROAST DOSSIER
                            </span>
                          </div>
                          <button
                            onClick={() => toggleFlip(batch.id)}
                            className="text-xs font-mono text-white/60 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCw className="h-3 w-3" /> Flip to Front
                          </button>
                        </div>

                        {/* Dossier Grid */}
                        <div className="space-y-3 text-xs">
                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                            <span className="text-[#A8A199] font-mono">Estate & Farmer:</span>
                            <span className="text-right text-[#FAF7F5] font-semibold">{batch.producer}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                            <span className="text-[#A8A199] font-mono">Geo-Coordinates:</span>
                            <span className="text-right text-[#FAF7F5] font-mono">{batch.geoCoordinates}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                            <span className="text-[#A8A199] font-mono">Soil Chemistry:</span>
                            <span className="text-right text-[#FAF7F5]">{batch.soilComposition}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                            <span className="text-[#A8A199] font-mono">Fermentation Protocol:</span>
                            <span className="text-right text-[#FAF7F5] font-semibold">{batch.process}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                            <span className="text-[#A8A199] font-mono">Direct Trade Premium:</span>
                            <span className="text-right text-emerald-400 font-bold">{batch.directTradePremium}</span>
                          </div>

                          <div className="p-3 rounded-xl bg-[#C89658]/10 border border-[#C89658]/20">
                            <span className="text-[10px] font-mono text-[#C89658] uppercase block mb-1 font-bold">
                              Master Roaster Dial-In Note
                            </span>
                            <p className="text-[11px] text-[#FAF7F5]/80 leading-relaxed">
                              "{batch.roasterNote}" Recommended brew: <strong className="text-[#FAF7F5]">{batch.idealBrew}</strong>.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-5">
                        <button
                          onClick={() => toggleFlip(batch.id)}
                          className="text-xs text-[#A8A199] hover:text-white cursor-pointer"
                        >
                          ← Return to Tasting View
                        </button>
                        <button
                          onClick={() => handleOpenReserve(batch)}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#FAF7F5] text-[#0E0C0A] font-bold text-xs hover:bg-white transition-all cursor-pointer"
                        >
                          <Lock className="h-3.5 w-3.5 text-[#0E0C0A]" />
                          <span>Reserve {batch.serialPrefix}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredBatches.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[#A8A199] text-base mb-4">No vintage micro-lots match your filter criteria.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-full bg-white/10 text-xs font-semibold hover:bg-white/20 transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* 5. NEW FEATURE: The Reserve Sommelier & Palate Matcher (Interactive Concierge) */}
      <section className="mx-auto max-w-5xl px-4 sm:px-8 mt-24">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#1A1614] to-[#120F0D] border border-[#C89658]/30 shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 bg-[#C89658]/10 blur-[90px] rounded-full" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C89658]/20 border border-[#C89658]/30 text-xs font-mono text-[#C89658] mb-4">
              <Zap className="h-3.5 w-3.5" /> ATELIER TASTING CONCIERGE
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#FAF7F5] mb-2">
              Discover Your Vintage Match
            </h2>
            <p className="text-sm text-[#A8A199] max-w-2xl leading-relaxed mb-8">
              Answer two questions about your sensory palate and daily ritual. Our algorithm will pair you with the ideal limited micro-lot from the private cellar.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Question 1: Sensory Direction */}
              <div>
                <label className="text-xs font-mono uppercase text-[#C89658] tracking-wider block mb-3 font-bold">
                  1. Which aromatic spectrum moves you?
                </label>
                <div className="space-y-2.5">
                  {[
                    { id: 'cacao', title: 'Dense Dark Cacao & Smoked Truffle', sub: 'Velvety, bold, and luxurious' },
                    { id: 'coastal', title: 'Charred Oak & Blackstrap Molasses', sub: 'Low acid, thick crema, sea breeze' },
                    { id: 'caramel', title: 'Raw Golden Honey & Sweet Mandarin', sub: 'Juicy, bright, and floral' },
                    { id: 'floral', title: 'Black Mission Fig & Cardamom Pods', sub: 'Aromatic, rare peaberry complexity' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSommelierSensory(opt.id as any)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        sommelierSensory === opt.id
                          ? 'bg-[#C89658]/20 border-[#C89658] text-[#FAF7F5] font-semibold'
                          : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt.title}</span>
                        {sommelierSensory === opt.id && <Check className="h-4 w-4 text-[#C89658]" />}
                      </div>
                      <span className="text-[10px] text-white/40 block mt-0.5">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Brew Ritual */}
              <div>
                <label className="text-xs font-mono uppercase text-[#C89658] tracking-wider block mb-3 font-bold">
                  2. What is your daily extraction ritual?
                </label>
                <div className="space-y-2.5">
                  {[
                    { id: 'davarah', title: 'Traditional South Indian Brass Davarah', sub: 'Intense micro-percolation with unyielding body' },
                    { id: 'espresso', title: '9-Bar Lever Espresso Machine', sub: 'High pressure extraction and golden crema' },
                    { id: 'pourover', title: 'Precision Flat-Bed Pour Over (V60 / Kalita)', sub: 'Delicate clarity and nuanced fruit esters' },
                    { id: 'frenchpress', title: 'French Press or Inverted Aeropress', sub: 'Full immersion with rich natural oils' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSommelierBrew(opt.id as any)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        sommelierBrew === opt.id
                          ? 'bg-[#C89658]/20 border-[#C89658] text-[#FAF7F5] font-semibold'
                          : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt.title}</span>
                        {sommelierBrew === opt.id && <Check className="h-4 w-4 text-[#C89658]" />}
                      </div>
                      <span className="text-[10px] text-white/40 block mt-0.5">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendation Result Banner */}
            {sommelierMatched && (
              <div className="p-5 rounded-2xl bg-[#0E0C0A] border border-[#C89658]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#C89658]/20 border border-[#C89658]/40 flex items-center justify-center shrink-0">
                    <Coffee className="h-6 w-6 text-[#C89658]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        98% PALATE MATCH
                      </span>
                      <span className="text-xs font-mono text-white/50">{sommelierMatched.scaScore} SCA Score</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#FAF7F5]">
                      {sommelierMatched.name}
                    </h3>
                    <p className="text-xs text-[#A8A199]">
                      Pairs exquisitely with your {sommelierBrew} setup for optimal sugar extraction.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenReserve(sommelierMatched)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C89658] to-[#E05A7E] text-[#0E0C0A] font-bold text-xs hover:brightness-110 transition-all cursor-pointer whitespace-nowrap shadow-lg"
                >
                  Reserve This Vintage ({sommelierMatched.price})
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. Direct Trade Transparency & Micro-Lot Provenance Matrix */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#E05A7E] font-bold mb-2 block">
            ETHICAL HARVEST MATRIX
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FAF7F5]">
            Uncompromising Provenance Standard
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#A8A199] leading-relaxed">
            Every vintage tin represents a direct relationship with fourth-generation estate stewards, paying far above fair-trade commodity rates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-3xl font-display font-bold text-[#C89658] mb-2">+380%</div>
            <h3 className="text-sm font-bold text-[#FAF7F5] mb-1">Above C-Market Price</h3>
            <p className="text-xs text-[#A8A199] leading-relaxed">
              We pay roaster premiums directly into estate irrigation and tribal worker welfare funds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-3xl font-display font-bold text-[#E05A7E] mb-2">22.5° Brix</div>
            <h3 className="text-sm font-bold text-[#FAF7F5] mb-1">Peak Sugar Harvesting</h3>
            <p className="text-xs text-[#A8A199] leading-relaxed">
              Every cherry is measured with digital optical refractometers before hand-selective plucking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-3xl font-display font-bold text-[#FAF7F5] mb-2">100%</div>
            <h3 className="text-sm font-bold text-[#FAF7F5] mb-1">Native Canopy Shade</h3>
            <p className="text-xs text-[#A8A199] leading-relaxed">
              Cultivated beneath living silver oak, fig trees, and cardamom bushes preserving biodiversity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-3xl font-display font-bold text-emerald-400 mb-2">0.0 PPM</div>
            <h3 className="text-sm font-bold text-[#FAF7F5] mb-1">Synthetic Chemical Residue</h3>
            <p className="text-xs text-[#A8A199] leading-relaxed">
              Strict organic composting and biodynamic cow horn silica horn preparations only.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Interactive Cellar Aging & Preservation Guide */}
      <section className="mx-auto max-w-5xl px-4 sm:px-8 mt-24">
        <div className="p-8 rounded-3xl bg-[#161311] border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 mb-6 gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#C89658] tracking-widest font-bold block mb-1">
                COLLECTOR CELLAR PROTOCOL
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FAF7F5]">
                Aging & Preserving Your Vintage Tins
              </h2>
            </div>

            {/* Tab Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5">
              {[
                { id: 0, label: 'Days 1–14: Rest' },
                { id: 1, label: 'Days 15–45: Peak' },
                { id: 2, label: 'Days 45–180: Freeze' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveAgingTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    activeAgingTab === tab.id
                      ? 'bg-[#FAF7F5] text-[#0E0C0A] font-bold shadow'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              {activeAgingTab === 0 && (
                <div className="space-y-2 animate-fadeIn">
                  <h3 className="text-lg font-bold text-[#C89658]">Initial Nitrogen Equilibrium</h3>
                  <p className="text-xs sm:text-sm text-[#A8A199] leading-relaxed">
                    Freshly roasted coffee contains high volumes of volatile CO2 trapped inside cellular walls. Do not open immediately. Allow the nitrogen-flushed canister to rest undisturbed at 16°C–18°C. This allows internal sugars to bind with aromatic lipid oils.
                  </p>
                  <div className="flex items-center gap-2 pt-2 text-xs text-white/70">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span>Best for: Aromatic stabilization and crema cohesion</span>
                  </div>
                </div>
              )}

              {activeAgingTab === 1 && (
                <div className="space-y-2 animate-fadeIn">
                  <h3 className="text-lg font-bold text-[#E05A7E]">Peak Volatile Expression Bloom</h3>
                  <p className="text-xs sm:text-sm text-[#A8A199] leading-relaxed">
                    Between day 15 and 45 post-roast, the coffee achieves its sensory apex. The bitter carbonic compounds have fully dissipated, revealing delicate jasmine florality and pure Mysore cacao richness. Consume within 30 days once the wax seal is broken.
                  </p>
                  <div className="flex items-center gap-2 pt-2 text-xs text-white/70">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span>Best for: Competition-grade pour over and pure espresso extraction</span>
                  </div>
                </div>
              )}

              {activeAgingTab === 2 && (
                <div className="space-y-2 animate-fadeIn">
                  <h3 className="text-lg font-bold text-[#FAF7F5]">Cryo-Freezer Archive Storage</h3>
                  <p className="text-xs sm:text-sm text-[#A8A199] leading-relaxed">
                    To preserve unopened tins for up to 6 months without oxidation, place the unopened canister directly in an airtight freezer at -18°C. When ready to brew, grind the frozen beans directly without thawing to achieve ultra-uniform particle size distribution.
                  </p>
                  <div className="flex items-center gap-2 pt-2 text-xs text-white/70">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span>Best for: Collectors cellaring multiple micro-lots simultaneously</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] font-mono text-[#C89658] uppercase block mb-1">
                Atelier Extraction Standard
              </span>
              <div className="text-2xl font-mono font-bold text-[#FAF7F5] mb-1">92.5°C</div>
              <p className="text-[11px] text-[#A8A199]">
                Mineral water recipe: 110 PPM TDS • 40 PPM Calcium • 1:15.5 Ratio
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Historic Vault Archive (Past Vintages 2023–2025) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-[#E05A7E] font-bold tracking-widest block mb-1">
              THE HISTORIC ARCHIVE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FAF7F5]">
              Past Vaulted Vintages (2023–2025)
            </h2>
          </div>
          <span className="text-xs font-mono text-[#A8A199]">All past allocations are completely exhausted</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#161311] border border-white/10 opacity-75 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="text-white/40">LOT 2024-C</span>
              <span className="px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-500/20 text-[10px] font-bold">
                OUT OF STOCK
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#FAF7F5] mb-1">
              Mullayanagiri Cryo-Ferment
            </h3>
            <p className="text-xs text-[#A8A199] mb-4">
              96-hour sub-zero carbonic maceration with notes of candied blood orange and dark cocoa.
            </p>
            <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-white/10 text-white/50">
              <span>96.0 SCA Score</span>
              <span>Archived in Private Cellars</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#161311] border border-white/10 opacity-75 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="text-white/40">LOT 2024-P</span>
              <span className="px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-500/20 text-[10px] font-bold">
                OUT OF STOCK
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#FAF7F5] mb-1">
              Malabar Port Cask Aged
            </h3>
            <p className="text-xs text-[#A8A199] mb-4">
              Aged inside French oak Tawny Port casks for 90 days. Rich toasted hazelnut and dates.
            </p>
            <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-white/10 text-white/50">
              <span>95.2 SCA Score</span>
              <span>Archived in Private Cellars</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#161311] border border-white/10 opacity-75 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="text-white/40">LOT 2023-G</span>
              <span className="px-2 py-0.5 rounded bg-[#C89658]/20 text-[#C89658] border border-[#C89658]/30 text-[10px] font-bold">
                AUCTION ARCHIVE
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#FAF7F5] mb-1">
              BR Hills Wild Geisha
            </h3>
            <p className="text-xs text-[#A8A199] mb-4">
              Ethereal bergamot blossom, white peach, and wild lavender. Highest scored lot in atelier history.
            </p>
            <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-white/10 text-white/50">
              <span>96.5 SCA Score</span>
              <span>Auction Record: ₹8,400/Tin</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. VIP Waitlist Priority Allocation Registration Form */}
      <section className="mx-auto max-w-4xl px-4 sm:px-8 mt-24">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#1C1815] to-[#120F0D] border border-white/10 text-center relative overflow-hidden shadow-2xl">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E05A7E]/10 blur-[100px] rounded-full" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#F5DADF] uppercase tracking-wider mb-4">
              <Shield className="h-3.5 w-3.5 text-[#E05A7E]" />
              <span>PRIVATE CELLAR PATRON CLUB</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FAF7F5] mb-3">
              Join the 2026/2027 Harvest Register
            </h2>
            <p className="text-xs sm:text-sm text-[#A8A199] leading-relaxed mb-8">
              Registered patrons receive 48-hour priority access prior to public release of our next Winter harvest allocation. Strictly limited to 150 collectors worldwide.
            </p>

            <form onSubmit={handleWaitlistSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#A8A199] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={waitlistName}
                    onChange={(e) => setWaitlistName(e.target.value)}
                    placeholder="e.g. Vikramaditya Rao"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-[#FAF7F5] placeholder-white/30 focus:outline-none focus:border-[#E05A7E]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-[#A8A199] block mb-1">Personal Email</label>
                  <input
                    type="email"
                    required
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="e.g. v.rao@estate.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-[#FAF7F5] placeholder-white/30 focus:outline-none focus:border-[#E05A7E]"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="text-[10px] font-mono uppercase text-[#A8A199] block mb-1">Collector City / Country</label>
                <input
                  type="text"
                  value={waitlistCity}
                  onChange={(e) => setWaitlistCity(e.target.value)}
                  placeholder="e.g. Bengaluru / London"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-[#FAF7F5] placeholder-white/30 focus:outline-none focus:border-[#E05A7E]"
                />
              </div>

              {waitlistError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-xs text-red-200 text-left">
                  {waitlistError}
                </div>
              )}

              {waitlistSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-200 text-left font-medium">
                  {waitlistSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C89658] via-[#E05A7E] to-[#FAF7F5] text-[#0E0C0A] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer shadow-lg"
              >
                Request Patron Invitation
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 10. Reserve Modal Integration */}
      <ReserveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedBatch={selectedBatch}
      />
    </div>
  );
};
