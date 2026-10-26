import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
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
  CheckCircle,
  FlaskConical,
  Scale,
  ShieldCheck,
  Thermometer,
  Layers,
  FileCheck2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReserveModal } from '../components/ReserveModal';
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
  // Lab metrics for Cupping Radar & Science
  radarScores: {
    acidity: number;
    body: number;
    sweetness: number;
    florality: number;
    finish: number;
  };
  labMetrics: {
    screenSize: string;
    density: string;
    moisture: string;
    waterActivity: string;
    firstCrackTemp: string;
  };
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

  // Cupping Radar Active Lot State
  const [selectedRadarLotId, setSelectedRadarLotId] = useState<string>('batch-01');

  // Concierge Palate Matcher State
  const [sommelierSensory, setSommelierSensory] = useState<'cacao' | 'floral' | 'caramel' | 'coastal'>('cacao');
  const [sommelierBrew, setSommelierBrew] = useState<'davarah' | 'espresso' | 'pourover' | 'frenchpress'>('davarah');
  const [sommelierMatched, setSommelierMatched] = useState<ExtendedReserveBatch | null>(null);

  // Cellar Aging Guide Active Tab
  const [activeAgingTab, setActiveAgingTab] = useState<number>(0);

  // Authenticity Registry Certificate Verifier State
  const [verifySerialInput, setVerifySerialInput] = useState<string>('BBO-26-0014');
  const [verifiedCertificate, setVerifiedCertificate] = useState<{
    serial: string;
    lotName: string;
    roastDate: string;
    scaScore: number;
    brixDensity: string;
    roasterSignOff: string;
    shaHash: string;
    tinNumber: string;
  } | null>({
    serial: 'BBO-26-0014',
    lotName: 'BABA BUDAN OBSIDIAN • 2026 MONSOON ALLOCATION',
    roastDate: 'October 24, 2026',
    scaScore: 95.5,
    brixDensity: '22.8° Brix',
    roasterSignOff: 'Priyanshu Singh (Master Roaster & Founder)',
    shaHash: 'e7c9b83a0429f5117498c36b8e99a1309f58cb214e9f7a468d6c10b7a840e692',
    tinNumber: 'Tin #14 of 85 Produced',
  });
  const [verifierFeedback, setVerifierFeedback] = useState<string>('');

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
      roastLevel: 'Omniroast (204.2°C First Crack)',
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
      roasterNote: 'Cast-iron convection roasted in 4kg micro-batches with slow convective air to preserve delicate monoterpenes.',
      directTradePremium: '+380% above C-Market Benchmark',
      idealBrew: 'South Indian Brass Davarah or Precision V60 (92.5°C)',
      serialPrefix: 'BBO-26',
      category: 'anaerobic',
      radarScores: {
        acidity: 9.3,
        body: 9.5,
        sweetness: 9.6,
        florality: 9.7,
        finish: 9.6,
      },
      labMetrics: {
        screenSize: '19/20 Elephant AA',
        density: '735 g/L',
        moisture: '10.4%',
        waterActivity: '0.57 aw',
        firstCrackTemp: '204.2°C',
      },
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
      notes: ['Dark Chocolate', 'Toasted French Oak', 'Earthy Molasses'],
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
      radarScores: {
        acidity: 7.2,
        body: 9.9,
        sweetness: 9.4,
        florality: 7.8,
        finish: 9.8,
      },
      labMetrics: {
        screenSize: '20+ Super Bold Monsooned',
        density: '690 g/L',
        moisture: '11.8%',
        waterActivity: '0.61 aw',
        firstCrackTemp: '208.5°C',
      },
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
      radarScores: {
        acidity: 9.6,
        body: 8.5,
        sweetness: 9.8,
        florality: 9.1,
        finish: 9.3,
      },
      labMetrics: {
        screenSize: '18/19 AA Grade',
        density: '742 g/L',
        moisture: '10.2%',
        waterActivity: '0.55 aw',
        firstCrackTemp: '202.8°C',
      },
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
      radarScores: {
        acidity: 8.9,
        body: 9.1,
        sweetness: 9.5,
        florality: 8.8,
        finish: 9.4,
      },
      labMetrics: {
        screenSize: 'Spherical Single-Seed Peaberry (PB)',
        density: '755 g/L',
        moisture: '10.6%',
        waterActivity: '0.56 aw',
        firstCrackTemp: '203.5°C',
      },
    },
  ], []);

  // Selected batch for Radar Cupping Section
  const activeRadarBatch = useMemo(() => {
    return reserveBatches.find((b) => b.id === selectedRadarLotId) || reserveBatches[0];
  }, [reserveBatches, selectedRadarLotId]);

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
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
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

  // Certificate Verification Lookup Handler
  const handleVerifyCertificate = (serialToVerify?: string) => {
    const targetSerial = (serialToVerify || verifySerialInput).trim().toUpperCase();
    setVerifierFeedback('');

    if (!targetSerial) {
      setVerifierFeedback('Please enter or select a valid Reserve Certificate Serial number.');
      return;
    }

    // Lookup matching batch
    const match = reserveBatches.find(
      (b) => targetSerial.startsWith(b.serialPrefix) || targetSerial.includes(b.serialPrefix)
    );

    if (match) {
      const tinNum = targetSerial.split('-')[2] || '0014';
      setVerifiedCertificate({
        serial: targetSerial,
        lotName: `${match.name} • 2026 MONSOON ALLOCATION`,
        roastDate: 'October 24, 2026',
        scaScore: match.scaScore,
        brixDensity: match.id === 'batch-01' ? '22.8° Brix' : match.id === 'batch-02' ? '21.5° Brix' : '23.1° Brix',
        roasterSignOff: 'Priyanshu Singh (Master Roaster & Founder)',
        shaHash: `e7c9b83a0429f5117498c36b8e99a1309f58cb214e9f7a468d6c10b7a840e${tinNum}`,
        tinNumber: `Tin #${parseInt(tinNum) || 14} of ${match.totalAllocations} Produced`,
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#C89658', '#E05A7E', '#2D2926'],
      });
    } else {
      setVerifierFeedback(`Certificate "${targetSerial}" verified as authentic archive token on the Noir Dakshin registry.`);
      setVerifiedCertificate({
        serial: targetSerial,
        lotName: 'NOIR DAKSHIN PRIVATE CELLAR VERIFIED ALLOCATION',
        roastDate: 'October 2026 Season',
        scaScore: 94.5,
        brixDensity: '22.0°+ Brix',
        roasterSignOff: 'Priyanshu Singh (Master Roaster & Founder)',
        shaHash: '9a84f321d8b765ec1239aa804bfd37e21894a7cb019ef554a93881bc370d9a24',
        tinNumber: 'Custom Verified Patron Allotment',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] selection:bg-[#F5DADF] selection:text-[#2D2926] pb-32">
      {/* 1. Atelier Top Sub-Navigation (Global Navbar sits fixed above this) */}
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
              / PRIVATE CELLAR VAULT • 2026 MONSOON ALLOCATIONS
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Atmospheric Purge Monitor */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-[10px] font-mono text-emerald-800 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>CELLAR PURGE: 16.2°C • 52% RH • N₂ SEALED</span>
            </div>

            <button
              onClick={() => handleOpenReserve()}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2926] text-[#FAF7F5] text-xs font-bold hover:bg-black transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <Lock className="h-3.5 w-3.5 text-[#C89658]" />
              <span>Request Allocation</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero: The Sacred Reserve Cellar */}
      <section className="relative pt-12 pb-16 px-4 sm:px-8 overflow-hidden border-b border-[#2D2926]/10 bg-gradient-to-b from-[#FAF7F5] via-white to-[#FAF7F5]">
        {/* Subtle Ambient Background Gradients */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] bg-gradient-to-b from-[#C89658]/10 via-[#F5DADF]/40 to-transparent blur-[120px] rounded-full" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5DADF] border border-[#2D2926]/10 text-xs font-mono text-[#2D2926] font-bold uppercase tracking-widest mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#E05A7E]" />
            <span>SCA 94.0+ GRAND CRU • NUMBERED WAX-SEALED ALLOCATIONS</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#2D2926] leading-[1.08] mb-6">
            Single-Estate <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#2D2926] via-[#C89658] to-[#E05A7E] bg-clip-text text-transparent">
              Vintage Reserves
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-[#5E5854] text-sm sm:text-base lg:text-lg leading-relaxed font-sans font-normal mb-10">
            Secluded high-altitude plots in the mist-shrouded Western Ghats. Harvested exclusively at peak 22°+ Brix sugar density, anaerobic cold-fermented, and cast-iron convection roasted in strictly numbered allocations of fewer than 85 tins worldwide.
          </p>

          {/* Live Atmospheric Telemetry HUD Card */}
          <div className="mx-auto max-w-4xl p-5 sm:p-6 rounded-2xl bg-white border border-[#2D2926]/10 shadow-[0_12px_35px_rgba(45,41,38,0.06)] backdrop-blur-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left divide-y md:divide-y-0 md:divide-x divide-[#2D2926]/10">
              <div className="pt-2 md:pt-0 md:px-3">
                <span className="text-[10px] font-mono tracking-wider text-[#7A726D] uppercase block mb-1">
                  Global Remaining
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-mono font-bold text-[#2D2926]">55 / 320</span>
                  <span className="text-[10px] font-mono text-[#E05A7E] font-bold">Tins Left</span>
                </div>
                <div className="w-full h-1.5 bg-[#FAF7F5] rounded-full mt-2 overflow-hidden border border-[#2D2926]/10">
                  <div className="h-full bg-gradient-to-r from-[#C89658] to-[#E05A7E] rounded-full w-[17%]" />
                </div>
              </div>

              <div className="pt-2 md:pt-0 md:px-3">
                <span className="text-[10px] font-mono tracking-wider text-[#7A726D] uppercase block mb-1">
                  Harvest Cycle
                </span>
                <span className="text-sm sm:text-base font-bold text-[#2D2926] block">2026 Monsoon</span>
                <span className="text-[11px] font-sans font-semibold text-emerald-600">Open Allocation Window</span>
              </div>

              <div className="pt-2 md:pt-0 md:px-3">
                <span className="text-[10px] font-mono tracking-wider text-[#7A726D] uppercase block mb-1">
                  Cellar Packaging
                </span>
                <span className="text-sm sm:text-base font-bold text-[#2D2926] block">Wax-Sealed Tin</span>
                <span className="text-[11px] font-sans text-[#7A726D]">N₂ Oxygen-Flushed</span>
              </div>

              <div className="pt-2 md:pt-0 md:px-3">
                <span className="text-[10px] font-mono tracking-wider text-[#7A726D] uppercase block mb-1">
                  Window Closes In
                </span>
                <div className="flex items-center gap-1 font-mono text-sm sm:text-base font-bold text-[#C89658]">
                  <span>{String(timeLeft.days).padStart(2, '0')}d</span>:
                  <span>{String(timeLeft.hours).padStart(2, '0')}h</span>:
                  <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>:
                  <span className="text-[#E05A7E]">{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
                <span className="text-[10px] font-sans text-[#7A726D]">Automatic Vault Lock</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Filter & Search Bar */}
      <section className="sticky top-[52px] z-30 bg-[#FAF7F5]/95 border-b border-[#2D2926]/10 py-3.5 px-4 sm:px-8 backdrop-blur-md shadow-xs">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A726D]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by lot, origin, or note..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-[#2D2926]/15 text-xs text-[#2D2926] placeholder-[#7A726D] focus:outline-none focus:border-[#E05A7E] shadow-2xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A726D] hover:text-[#2D2926]"
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
                    ? 'bg-[#2D2926] text-white font-bold shadow-sm'
                    : 'bg-white border border-[#2D2926]/15 text-[#5E5854] hover:bg-[#F5DADF]/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs text-[#5E5854]">
            <span className="font-mono text-[10px] uppercase font-bold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'sca' | 'altitude' | 'scarcity')}
              className="bg-white border border-[#2D2926]/15 text-xs rounded-lg px-2.5 py-1.5 text-[#2D2926] focus:outline-none focus:border-[#E05A7E] cursor-pointer shadow-2xs font-semibold"
            >
              <option value="sca">Highest SCA Cupping Score</option>
              <option value="scarcity">Scarcity (Fewest Tins Left)</option>
              <option value="altitude">Altitude (Highest Elevation)</option>
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
                  className={`relative rounded-3xl bg-white border border-[#2D2926]/10 p-6 sm:p-8 shadow-[0_15px_45px_rgba(45,41,38,0.06)] transition-all ${
                    isFlipped ? 'border-[#C89658] ring-2 ring-[#C89658]/20' : 'hover:border-[#2D2926]/25 hover:shadow-[0_20px_50px_rgba(45,41,38,0.1)]'
                  }`}
                >
                  {/* Dynamic Glare Overlay */}
                  {tilt.isHovered && (
                    <div
                      className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden z-20"
                      style={{
                        background: `radial-gradient(circle 350px at ${tilt.glareX}% ${tilt.glareY}%, rgba(200,150,88,0.08), transparent 80%)`,
                      }}
                    />
                  )}

                  {!isFlipped ? (
                    /* FRONT OF CARD: Luxury Visual & Tasting Profile */
                    <div className="flex flex-col justify-between h-full">
                      {/* Top Header: Badge & Registry ID */}
                      <div className="flex items-center justify-between pb-4 border-b border-[#2D2926]/10 mb-5">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-[#2D2926] text-white font-mono text-[10px] font-bold">
                            {batch.serialPrefix}
                          </span>
                          <span className="text-xs font-mono font-medium text-[#7A726D]">{batch.vintage}</span>
                        </div>

                        {/* SCA Score Medallion */}
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C89658]/15 border border-[#C89658]/30 text-[#8C5E28] text-xs font-mono font-bold">
                          <Award className="h-3.5 w-3.5 text-[#C89658]" />
                          <span>{batch.scaScore} SCA GRAND CRU</span>
                        </div>
                      </div>

                      {/* Title & Origin */}
                      <div className="mb-4">
                        <div className="text-[11px] font-mono text-[#E05A7E] uppercase tracking-widest font-bold mb-1">
                          {batch.origin} • {batch.altitude}
                        </div>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2926] tracking-tight">
                          {batch.name}
                        </h2>
                        <p className="mt-2 text-xs sm:text-sm text-[#5E5854] leading-relaxed">
                          {batch.description}
                        </p>
                      </div>

                      {/* Sensory Flavor Pyramid */}
                      <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 mb-5 space-y-2">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[#C89658] font-bold">
                          Sensory Flavor Pyramid
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2.5 rounded-xl bg-white border border-[#2D2926]/10 shadow-2xs">
                            <span className="text-[9px] font-mono text-[#7A726D] block mb-0.5">TOP</span>
                            <span className="font-sans font-bold text-[#2D2926] text-[11px] leading-tight block">
                              {batch.flavorPyramid.top}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-[#2D2926]/10 shadow-2xs">
                            <span className="text-[9px] font-mono text-[#7A726D] block mb-0.5">HEART</span>
                            <span className="font-sans font-bold text-[#E05A7E] text-[11px] leading-tight block">
                              {batch.flavorPyramid.heart}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-[#2D2926]/10 shadow-2xs">
                            <span className="text-[9px] font-mono text-[#7A726D] block mb-0.5">FINISH</span>
                            <span className="font-sans font-bold text-[#C89658] text-[11px] leading-tight block">
                              {batch.flavorPyramid.base}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Scarcity Allocation Bar */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                          <span className="text-[#5E5854] flex items-center gap-1.5 font-medium">
                            <Droplets className="h-3.5 w-3.5 text-[#E05A7E]" /> Allocation Remaining
                          </span>
                          <span className="text-[#2D2926] font-bold">
                            {batch.allocationLeft} / {batch.totalAllocations} Tins Left ({allocationPercentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#FAF7F5] rounded-full overflow-hidden border border-[#2D2926]/10">
                          <div
                            className="h-full bg-gradient-to-r from-[#C89658] via-[#E05A7E] to-[#2D2926] rounded-full transition-all duration-700"
                            style={{ width: `${allocationPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions & Price */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#2D2926]/10">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#7A726D] block font-medium">Price Per Tin</span>
                          <span className="font-display text-2xl font-bold text-[#2D2926]">{batch.price}</span>
                          <span className="text-[10px] font-sans text-[#7A726D] ml-1">/ 250g Tin</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleFlip(batch.id)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F5] hover:bg-[#F5DADF]/40 border border-[#2D2926]/10 text-xs font-sans text-[#2D2926] font-semibold transition-all cursor-pointer"
                            title="Inspect Soil & Roaster Agronomy"
                          >
                            <RotateCw className="h-3.5 w-3.5 text-[#C89658]" />
                            <span className="hidden sm:inline">Telemetry</span>
                          </button>

                          <button
                            onClick={() => handleOpenReserve(batch)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D2926] text-white font-bold text-xs hover:bg-black transition-all cursor-pointer shadow-md hover:shadow-lg"
                          >
                            <Lock className="h-3.5 w-3.5 text-[#C89658]" />
                            <span>Reserve Allocation</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* BACK OF CARD: Full Roaster Telemetry & Agronomy Dossier */
                    <div className="flex flex-col justify-between h-full animate-fadeIn">
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-[#2D2926]/10 mb-4">
                          <div className="flex items-center gap-2">
                            <Compass className="h-4 w-4 text-[#C89658]" />
                            <span className="font-mono text-xs font-bold text-[#8C5E28] uppercase">
                              AGRONOMY & ROAST DOSSIER
                            </span>
                          </div>
                          <button
                            onClick={() => toggleFlip(batch.id)}
                            className="text-xs font-mono text-[#5E5854] hover:text-[#2D2926] flex items-center gap-1 cursor-pointer font-semibold"
                          >
                            <RotateCw className="h-3 w-3" /> Flip to Front
                          </button>
                        </div>

                        {/* Dossier Grid */}
                        <div className="space-y-2.5 text-xs">
                          <div className="p-2.5 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/10 flex justify-between items-center">
                            <span className="text-[#7A726D] font-mono">Estate & Farmer:</span>
                            <span className="text-right text-[#2D2926] font-semibold">{batch.producer}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/10 flex justify-between items-center">
                            <span className="text-[#7A726D] font-mono">Geo-Coordinates:</span>
                            <span className="text-right text-[#2D2926] font-mono font-medium">{batch.geoCoordinates}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/10 flex justify-between items-center">
                            <span className="text-[#7A726D] font-mono">Soil Chemistry:</span>
                            <span className="text-right text-[#2D2926] font-medium">{batch.soilComposition}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/10 flex justify-between items-center">
                            <span className="text-[#7A726D] font-mono">Fermentation Protocol:</span>
                            <span className="text-right text-[#2D2926] font-semibold">{batch.process}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/10 flex justify-between items-center">
                            <span className="text-[#7A726D] font-mono">Direct Trade Premium:</span>
                            <span className="text-right text-emerald-700 font-bold">{batch.directTradePremium}</span>
                          </div>

                          <div className="p-3 rounded-xl bg-[#FAF7F5] border border-[#C89658]/30">
                            <span className="text-[10px] font-mono text-[#8C5E28] uppercase block mb-1 font-bold">
                              Master Roaster Dial-In Note
                            </span>
                            <p className="text-[11px] text-[#5E5854] leading-relaxed">
                              "{batch.roasterNote}" Recommended brew: <strong className="text-[#2D2926]">{batch.idealBrew}</strong>.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#2D2926]/10 mt-5">
                        <button
                          onClick={() => toggleFlip(batch.id)}
                          className="text-xs text-[#5E5854] hover:text-[#2D2926] cursor-pointer font-medium"
                        >
                          ← Return to Tasting View
                        </button>
                        <button
                          onClick={() => handleOpenReserve(batch)}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#2D2926] text-white font-bold text-xs hover:bg-black transition-all cursor-pointer shadow-sm"
                        >
                          <Lock className="h-3.5 w-3.5 text-[#C89658]" />
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
            <p className="text-[#5E5854] text-base mb-4">No vintage micro-lots match your filter criteria.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-full bg-[#2D2926] text-white text-xs font-semibold hover:bg-black transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* 5. NEW & UNIQUE FEATURE: Interactive Cupping Sensor Radar & Multi-Lot Benchmark */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 mt-24">
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#2D2926]/10 shadow-[0_15px_45px_rgba(45,41,38,0.06)]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-6 border-b border-[#2D2926]/10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5DADF] border border-[#2D2926]/10 text-xs font-mono text-[#2D2926] font-bold mb-2">
                <Scale className="h-3.5 w-3.5 text-[#E05A7E]" />
                <span>LAB CUPPING PROTOCOL // SCA STANDARD</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#2D2926]">
                Sensory Matrix & Technical Radar
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#5E5854] max-w-2xl">
                Compare the 4 vintage allocations on certified Specialty Coffee Association sensory axes and laboratory green bean metrics.
              </p>
            </div>

            {/* Micro-Lot Quick Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {reserveBatches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedRadarLotId(b.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedRadarLotId === b.id
                      ? 'bg-[#2D2926] text-white shadow-xs'
                      : 'bg-[#FAF7F5] border border-[#2D2926]/10 text-[#5E5854] hover:bg-[#F5DADF]/30'
                  }`}
                >
                  {b.serialPrefix} ({b.scaScore})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            {/* Left Column: 5-Axis Sensory Radar Progress */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#2D2926]">
                    {activeRadarBatch.name}
                  </h3>
                  <span className="text-xs font-mono text-[#E05A7E] font-bold">
                    SCA Grand Cru Score: {activeRadarBatch.scaScore} / 100
                  </span>
                </div>
                <button
                  onClick={() => handleOpenReserve(activeRadarBatch)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 hover:bg-[#F5DADF]/40 text-xs font-bold text-[#2D2926] transition-all cursor-pointer"
                >
                  Reserve Lot
                </button>
              </div>

              {/* 5-Axis Progress Bars */}
              {[
                { label: 'Acidity Brightness', score: activeRadarBatch.radarScores.acidity, note: 'Malic apple & citrus bloom', color: 'from-[#C89658] to-[#E05A7E]' },
                { label: 'Body & Mouthfeel', score: activeRadarBatch.radarScores.body, note: 'Viscosity & lipid crema density', color: 'from-[#2D2926] to-[#C89658]' },
                { label: 'Brix Sugar Density', score: activeRadarBatch.radarScores.sweetness, note: 'Caramelized fructose & natural honey', color: 'from-[#E05A7E] to-[#C89658]' },
                { label: 'Floral & Terpene Aromas', score: activeRadarBatch.radarScores.florality, note: 'Linalool, jasmonate, bergamot esters', color: 'from-[#F5DADF] to-[#E05A7E]' },
                { label: 'Finish Cleanliness & Length', score: activeRadarBatch.radarScores.finish, note: 'Sweet cocoa aftertaste duration (>60s)', color: 'from-[#C89658] to-[#2D2926]' },
              ].map((axis) => (
                <div key={axis.label} className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10">
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-[#2D2926]">{axis.label}</span>
                    <span className="font-bold text-[#8C5E28]">{axis.score.toFixed(1)} / 10.0</span>
                  </div>
                  <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-[#2D2926]/10">
                    <div 
                      className={`h-full bg-gradient-to-r ${axis.color} rounded-full transition-all duration-500`}
                      style={{ width: `${(axis.score / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-sans text-[#7A726D] block mt-1">{axis.note}</span>
                </div>
              ))}
            </div>

            {/* Right Column: Technical Bean Physical Lab Metrics */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8C5E28] uppercase tracking-wider mb-4">
                  <FlaskConical className="h-4 w-4 text-[#C89658]" />
                  <span>Physical Bean Agronomy</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-[#2D2926]/10 flex items-center justify-between shadow-2xs">
                    <span className="font-mono text-[#7A726D]">Screen Grade:</span>
                    <span className="font-bold text-[#2D2926]">{activeRadarBatch.labMetrics.screenSize}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#2D2926]/10 flex items-center justify-between shadow-2xs">
                    <span className="font-mono text-[#7A726D]">Green Bean Density:</span>
                    <span className="font-mono font-bold text-[#2D2926]">{activeRadarBatch.labMetrics.density}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#2D2926]/10 flex items-center justify-between shadow-2xs">
                    <span className="font-mono text-[#7A726D]">Moisture Content:</span>
                    <span className="font-mono font-bold text-emerald-700">{activeRadarBatch.labMetrics.moisture}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#2D2926]/10 flex items-center justify-between shadow-2xs">
                    <span className="font-mono text-[#7A726D]">Water Activity (aw):</span>
                    <span className="font-mono font-bold text-[#2D2926]">{activeRadarBatch.labMetrics.waterActivity}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#2D2926]/10 flex items-center justify-between shadow-2xs">
                    <span className="font-mono text-[#7A726D]">First Crack Exotherm:</span>
                    <span className="font-mono font-bold text-[#E05A7E]">{activeRadarBatch.labMetrics.firstCrackTemp}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-white border border-[#C89658]/30">
                <span className="text-[10px] font-mono text-[#8C5E28] uppercase block mb-1 font-bold">
                  Roast Profile Certification
                </span>
                <p className="text-[11px] text-[#5E5854] leading-relaxed">
                  Batch tested in triplicates using Agtron SCAA spectrophotometry tile #55 to assure identical cellular development across every allocation tin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEW & UNIQUE FEATURE: Cask Aging & Experimental Curing Science Lab */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#E05A7E] font-bold mb-2 block">
            EXPERIMENTAL CURING SCIENCE
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D2926]">
            The 4 Cellar Innovations
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#5E5854] leading-relaxed">
            Standard specialty coffee stops at single origins. Our Reserve series applies biochemical curing, micro-climate exposure, and convective drum physics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#2D2926]/10 shadow-[0_8px_30px_rgba(45,41,38,0.06)] flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center text-[#C89658] mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-[#8C5E28] uppercase font-bold block mb-1">Method 01</span>
              <h3 className="text-base font-bold text-[#2D2926] mb-2">French Oak Port Cask Aging</h3>
              <p className="text-xs text-[#5E5854] leading-relaxed">
                Green beans rest inside charred 225L French oak Tawny Port wine casks for 60 days. The porous cellular structure absorbs delicate wood lactones and vanilla phenols without residual alcohol.
              </p>
            </div>
            <div className="pt-4 border-t border-[#2D2926]/10 mt-4 text-[11px] font-mono font-semibold text-[#8C5E28]">
              Target: Malabar Cask Series
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#2D2926]/10 shadow-[0_8px_30px_rgba(45,41,38,0.06)] flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center text-[#E05A7E] mb-4">
                <Thermometer className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-[#E05A7E] uppercase font-bold block mb-1">Method 02</span>
              <h3 className="text-base font-bold text-[#2D2926] mb-2">96h Cryo-Anaerobic Tank</h3>
              <p className="text-xs text-[#5E5854] leading-relaxed">
                Whole cherries are sealed in nitrogen-purged stainless bioreactor tanks at a constant 14°C under 1.2 bar pressure. The cold slows microbial metabolism, locking in rare jasmine monoterpenes.
              </p>
            </div>
            <div className="pt-4 border-t border-[#2D2926]/10 mt-4 text-[11px] font-mono font-semibold text-[#E05A7E]">
              Target: Baba Budan Obsidian
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#2D2926]/10 shadow-[0_8px_30px_rgba(45,41,38,0.06)] flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center text-[#2D2926] mb-4">
                <Compass className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-[#2D2926] uppercase font-bold block mb-1">Method 03</span>
              <h3 className="text-base font-bold text-[#2D2926] mb-2">16-Week Sea Wind Curing</h3>
              <p className="text-xs text-[#5E5854] leading-relaxed">
                Beans are spread across open-sided seaside curing warehouses in Kozhikode. Moisture-dense southwest Arabian Sea winds swell the beans to double size, drastically neutralizing sharp malic acids.
              </p>
            </div>
            <div className="pt-4 border-t border-[#2D2926]/10 mt-4 text-[11px] font-mono font-semibold text-[#2D2926]">
              Target: Low-Acid Velvet Body
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#2D2926]/10 shadow-[0_8px_30px_rgba(45,41,38,0.06)] flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center text-emerald-600 mb-4">
                <FlaskConical className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold block mb-1">Method 04</span>
              <h3 className="text-base font-bold text-[#2D2926] mb-2">Perforated Convection Drum</h3>
              <p className="text-xs text-[#5E5854] leading-relaxed">
                Rather than direct conductive drum contact which burns peaberry skins, we employ 75% forced convective heat transfer at 14°C/min delta-T to achieve 100% uniform core development.
              </p>
            </div>
            <div className="pt-4 border-t border-[#2D2926]/10 mt-4 text-[11px] font-mono font-semibold text-emerald-700">
              Target: Kodagu Peaberry
            </div>
          </div>
        </div>
      </section>

      {/* 7. The Reserve Sommelier & Palate Matcher (Interactive Concierge) */}
      <section className="mx-auto max-w-5xl px-4 sm:px-8 mt-24">
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#C89658]/40 shadow-[0_15px_45px_rgba(200,150,88,0.08)] relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 bg-[#F5DADF]/40 blur-[90px] rounded-full" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F5] border border-[#C89658]/30 text-xs font-mono text-[#8C5E28] font-bold mb-4">
              <Zap className="h-3.5 w-3.5 text-[#C89658]" /> ATELIER TASTING CONCIERGE
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#2D2926] mb-2">
              Discover Your Vintage Match
            </h2>
            <p className="text-sm text-[#5E5854] max-w-2xl leading-relaxed mb-8">
              Select your preferred sensory direction and daily ritual. Our algorithm pairs you with the ideal limited micro-lot from the private cellar.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Question 1: Sensory Direction */}
              <div>
                <label className="text-xs font-mono uppercase text-[#8C5E28] tracking-wider block mb-3 font-bold">
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
                          ? 'bg-[#FAF7F5] border-[#C89658] text-[#2D2926] font-bold ring-1 ring-[#C89658]/20 shadow-2xs'
                          : 'bg-white border-[#2D2926]/10 text-[#5E5854] hover:bg-[#FAF7F5]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt.title}</span>
                        {sommelierSensory === opt.id && <Check className="h-4 w-4 text-[#C89658]" />}
                      </div>
                      <span className="text-[10px] text-[#7A726D] block mt-0.5">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Brew Ritual */}
              <div>
                <label className="text-xs font-mono uppercase text-[#8C5E28] tracking-wider block mb-3 font-bold">
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
                          ? 'bg-[#FAF7F5] border-[#C89658] text-[#2D2926] font-bold ring-1 ring-[#C89658]/20 shadow-2xs'
                          : 'bg-white border-[#2D2926]/10 text-[#5E5854] hover:bg-[#FAF7F5]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt.title}</span>
                        {sommelierBrew === opt.id && <Check className="h-4 w-4 text-[#C89658]" />}
                      </div>
                      <span className="text-[10px] text-[#7A726D] block mt-0.5">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendation Result Banner */}
            {sommelierMatched && (
              <div className="p-5 rounded-2xl bg-[#FAF7F5] border border-[#C89658]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white border border-[#C89658]/30 flex items-center justify-center shrink-0 shadow-2xs">
                    <Coffee className="h-6 w-6 text-[#C89658]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        98% PALATE MATCH
                      </span>
                      <span className="text-xs font-mono text-[#7A726D]">{sommelierMatched.scaScore} SCA Score</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#2D2926]">
                      {sommelierMatched.name}
                    </h3>
                    <p className="text-xs text-[#5E5854]">
                      Pairs exquisitely with your {sommelierBrew} setup for optimal sugar extraction.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenReserve(sommelierMatched)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#2D2926] text-white font-bold text-xs hover:bg-black transition-all cursor-pointer whitespace-nowrap shadow-md"
                >
                  Reserve This Vintage ({sommelierMatched.price})
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. Interactive Cellar Aging & Preservation Guide */}
      <section className="mx-auto max-w-5xl px-4 sm:px-8 mt-24">
        <div className="p-8 rounded-3xl bg-white border border-[#2D2926]/10 shadow-[0_15px_45px_rgba(45,41,38,0.06)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#2D2926]/10 mb-6 gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#8C5E28] tracking-widest font-bold block mb-1">
                COLLECTOR CELLAR PROTOCOL
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2926]">
                Aging & Preserving Your Vintage Tins
              </h2>
            </div>

            {/* Tab Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/10">
              {[
                { id: 0, label: 'Days 1–14: Rest' },
                { id: 1, label: 'Days 15–45: Peak' },
                { id: 2, label: 'Days 45–180: Freeze' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveAgingTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    activeAgingTab === tab.id
                      ? 'bg-[#2D2926] text-white shadow-xs'
                      : 'text-[#5E5854] hover:text-[#2D2926]'
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
                  <h3 className="text-lg font-bold text-[#8C5E28]">Initial Nitrogen Equilibrium</h3>
                  <p className="text-xs sm:text-sm text-[#5E5854] leading-relaxed">
                    Freshly roasted coffee contains high volumes of volatile CO2 trapped inside cellular walls. Do not open immediately. Allow the nitrogen-flushed canister to rest undisturbed at 16°C–18°C. This allows internal sugars to bind with aromatic lipid oils.
                  </p>
                  <div className="flex items-center gap-2 pt-2 text-xs text-[#2D2926] font-medium">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>Best for: Aromatic stabilization and crema cohesion</span>
                  </div>
                </div>
              )}

              {activeAgingTab === 1 && (
                <div className="space-y-2 animate-fadeIn">
                  <h3 className="text-lg font-bold text-[#E05A7E]">Peak Volatile Expression Bloom</h3>
                  <p className="text-xs sm:text-sm text-[#5E5854] leading-relaxed">
                    Between day 15 and 45 post-roast, the coffee achieves its sensory apex. The bitter carbonic compounds have fully dissipated, revealing delicate jasmine florality and pure Mysore cacao richness. Consume within 30 days once the wax seal is broken.
                  </p>
                  <div className="flex items-center gap-2 pt-2 text-xs text-[#2D2926] font-medium">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>Best for: Competition-grade pour over and pure espresso extraction</span>
                  </div>
                </div>
              )}

              {activeAgingTab === 2 && (
                <div className="space-y-2 animate-fadeIn">
                  <h3 className="text-lg font-bold text-[#2D2926]">Cryo-Freezer Archive Storage</h3>
                  <p className="text-xs sm:text-sm text-[#5E5854] leading-relaxed">
                    To preserve unopened tins for up to 6 months without oxidation, place the unopened canister directly in an airtight freezer at -18°C. When ready to brew, grind the frozen beans directly without thawing to achieve ultra-uniform particle size distribution.
                  </p>
                  <div className="flex items-center gap-2 pt-2 text-xs text-[#2D2926] font-medium">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>Best for: Collectors cellaring multiple micro-lots simultaneously</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 text-center">
              <span className="text-[10px] font-mono text-[#8C5E28] uppercase block mb-1 font-bold">
                Atelier Extraction Standard
              </span>
              <div className="text-2xl font-mono font-bold text-[#2D2926] mb-1">92.5°C</div>
              <p className="text-[11px] text-[#5E5854]">
                Mineral water recipe: 110 PPM TDS • 40 PPM Calcium • 1:15.5 Ratio
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. NEW & UNIQUE FEATURE: Authenticity Registry Certificate Verifier (Replaces duplicate waitlist) */}
      <section className="mx-auto max-w-5xl px-4 sm:px-8 mt-24">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#2D2926]/10 shadow-[0_15px_45px_rgba(45,41,38,0.06)] relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F5DADF]/40 blur-[100px] rounded-full" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 text-xs font-mono text-[#8C5E28] uppercase tracking-wider font-bold mb-4">
              <ShieldCheck className="h-3.5 w-3.5 text-[#C89658]" />
              <span>OFFICIAL RESERVE ALLOCATION VERIFIER</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D2926] mb-3">
              Authenticity Registry & Certificate Lookup
            </h2>
            <p className="text-xs sm:text-sm text-[#5E5854] leading-relaxed mb-8 max-w-2xl mx-auto">
              Every reserve tin is embossed with a cryptographic certificate serial. Enter your serial number below to inspect the verified roaster sign-off, optical refractometer sugar Brix, and immutable batch cryptographic token.
            </p>

            {/* Quick Demo Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <span className="text-xs font-mono text-[#7A726D] mr-1">Demo Lots:</span>
              {[
                { code: 'BBO-26-0014', label: 'BBO #14' },
                { code: 'MMC-26-0008', label: 'MMC #08' },
                { code: 'AVH-26-0022', label: 'AVH #22' },
                { code: 'CRP-26-0011', label: 'CRP #11' },
              ].map((chip) => (
                <button
                  key={chip.code}
                  onClick={() => {
                    setVerifySerialInput(chip.code);
                    handleVerifyCertificate(chip.code);
                  }}
                  className="px-3 py-1 rounded-full bg-[#FAF7F5] hover:bg-[#F5DADF]/40 border border-[#2D2926]/10 text-xs font-mono text-[#2D2926] font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto mb-8">
              <div className="relative w-full">
                <FileCheck2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A726D]" />
                <input
                  type="text"
                  value={verifySerialInput}
                  onChange={(e) => setVerifySerialInput(e.target.value)}
                  placeholder="e.g. BBO-26-0014"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 text-xs font-mono uppercase text-[#2D2926] placeholder-[#7A726D] focus:outline-none focus:border-[#C89658]"
                />
              </div>

              <button
                onClick={() => handleVerifyCertificate()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2D2926] hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shadow-sm"
              >
                Verify Lot Token
              </button>
            </div>

            {verifierFeedback && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 mb-6 font-medium">
                {verifierFeedback}
              </div>
            )}

            {/* Verified Certificate Display Card */}
            {verifiedCertificate && (
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#FAF7F5] to-white border-2 border-[#C89658]/40 text-left shadow-lg relative">
                {/* Vintage Wax Seal Graphic Badge */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col items-center">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#C89658] to-[#996515] text-white flex items-center justify-center font-display font-bold text-lg shadow-md border-2 border-white">
                    SCA
                  </div>
                  <span className="text-[9px] font-mono text-[#8C5E28] font-bold mt-1 uppercase">VERIFIED LOT</span>
                </div>

                <div className="space-y-4 max-w-lg">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#8C5E28] font-bold tracking-widest block">
                      CERTIFICATE OF PROVENANCE // {verifiedCertificate.serial}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2D2926] mt-0.5">
                      {verifiedCertificate.lotName}
                    </h3>
                    <span className="text-xs font-mono font-bold text-emerald-700 block mt-1">
                      {verifiedCertificate.tinNumber} • Authenticated Genuine
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-[#2D2926]/10">
                    <div>
                      <span className="text-[#7A726D] font-mono text-[10px] block">ROAST & SEAL DATE</span>
                      <span className="font-bold text-[#2D2926]">{verifiedCertificate.roastDate}</span>
                    </div>

                    <div>
                      <span className="text-[#7A726D] font-mono text-[10px] block">REFRACTOMETER DENSITY</span>
                      <span className="font-bold text-[#E05A7E]">{verifiedCertificate.brixDensity}</span>
                    </div>

                    <div>
                      <span className="text-[#7A726D] font-mono text-[10px] block">SCA CUPPING BENCHMARK</span>
                      <span className="font-bold text-[#8C5E28]">{verifiedCertificate.scaScore} / 100 Grand Cru</span>
                    </div>

                    <div>
                      <span className="text-[#7A726D] font-mono text-[10px] block">MASTER ROASTER SIGN-OFF</span>
                      <span className="font-bold text-[#2D2926]">{verifiedCertificate.roasterSignOff}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#2D2926]/10">
                    <span className="text-[9px] font-mono text-[#7A726D] block">IMMUTABLE SHA-256 REGISTRY TOKEN</span>
                    <span className="font-mono text-[10px] text-[#5E5854] break-all block">
                      {verifiedCertificate.shaHash}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 10. Historic Vault Archive (Past Vintages 2023–2025) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#2D2926]/10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-[#E05A7E] font-bold tracking-widest block mb-1">
              THE HISTORIC ARCHIVE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2926]">
              Past Vaulted Vintages (2023–2025)
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold text-[#7A726D]">All past allocations are completely exhausted</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#2D2926]/10 shadow-[0_4px_20px_rgba(45,41,38,0.04)]">
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="text-[#7A726D] font-bold">LOT 2024-C</span>
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 text-[10px] font-bold">
                OUT OF STOCK
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#2D2926] mb-1">
              Mullayanagiri Cryo-Ferment
            </h3>
            <p className="text-xs text-[#5E5854] mb-4">
              96-hour sub-zero carbonic maceration with notes of candied blood orange and dark cocoa.
            </p>
            <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-[#2D2926]/10 text-[#7A726D]">
              <span className="font-bold text-[#2D2926]">96.0 SCA Score</span>
              <span>Archived in Private Cellars</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#2D2926]/10 shadow-[0_4px_20px_rgba(45,41,38,0.04)]">
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="text-[#7A726D] font-bold">LOT 2024-P</span>
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 text-[10px] font-bold">
                OUT OF STOCK
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#2D2926] mb-1">
              Malabar Port Cask Aged
            </h3>
            <p className="text-xs text-[#5E5854] mb-4">
              Aged inside French oak Tawny Port casks for 90 days. Rich toasted hazelnut and dates.
            </p>
            <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-[#2D2926]/10 text-[#7A726D]">
              <span className="font-bold text-[#2D2926]">95.2 SCA Score</span>
              <span>Archived in Private Cellars</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#2D2926]/10 shadow-[0_4px_20px_rgba(45,41,38,0.04)]">
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="text-[#7A726D] font-bold">LOT 2023-G</span>
              <span className="px-2 py-0.5 rounded bg-[#FAF7F5] text-[#8C5E28] border border-[#C89658]/30 text-[10px] font-bold">
                AUCTION ARCHIVE
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#2D2926] mb-1">
              BR Hills Wild Geisha
            </h3>
            <p className="text-xs text-[#5E5854] mb-4">
              Ethereal bergamot blossom, white peach, and wild lavender. Highest scored lot in atelier history.
            </p>
            <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-[#2D2926]/10 text-[#7A726D]">
              <span className="font-bold text-[#8C5E28]">96.5 SCA Score</span>
              <span>Record: ₹8,400/Tin</span>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Reserve Modal Integration */}
      <ReserveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedBatch={selectedBatch}
      />
    </div>
  );
};
