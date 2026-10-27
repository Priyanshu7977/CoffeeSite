import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Check, 
  MapPin, 
  Sun, 
  Droplet, 
  Compass, 
  Wind,
  Calendar,
  Flame,
  Activity
} from 'lucide-react';
import { gsap } from '../utils/animations';
import { NOIR_PRODUCTS } from '../data/products';
import type { Product } from '../types';

interface EstateAtlasPageProps {
  onDiscoverProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, grind: string) => void;
}

// 4 Distinct South Indian Terroir Regions
interface RegionData {
  id: string;
  name: string;
  state: string;
  elevation: string;
  soil: string;
  rainfall: string;
  varietals: string;
  canopyTrees: string;
  cuppingProfile: string;
  scaScore: string;
  harvestWindow: string;
  image: string;
  description: string;
  keyAromas: string[];
}

const REGIONS: RegionData[] = [
  {
    id: 'baba-budan',
    name: 'Mullayanagiri & Baba Budan Giri',
    state: 'Chikmagalur, Karnataka',
    elevation: '1,700m – 1,920m ASL',
    soil: 'Iron-Rich Red Laterite Loam (pH 6.1)',
    rainfall: '2,200mm – 2,800mm Southwest Monsoon',
    varietals: 'Selection 795, Chandragiri, Old Paradenia',
    canopyTrees: 'Silver Oak, Wild Fig, Rosewood, Wild Pepper Vines',
    cuppingProfile: 'Floral Jasmine, Smoked Cardamom, Bittersweet Mysore Cacao',
    scaScore: '91.2 SCA Points',
    harvestWindow: 'December to February (Selective Handpicking)',
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=1200&auto=format&fit=crop&q=85',
    description: 'The sacred cradle of Indian coffee where seven smuggled Sufi beans were planted in 1670. High cloud-cover and steep mountain slopes slow bean maturation, concentrating rich floral terpenes and natural sucrose.',
    keyAromas: ['Jasmine Blossom', 'Cardamom Pod', 'Dark Mysore Cocoa', 'Black Honey'],
  },
  {
    id: 'kodagu',
    name: 'Kodagu Rainforest (Coorg)',
    state: 'Western Ghats, Karnataka',
    elevation: '1,200m – 1,600m ASL',
    soil: 'Deep Volcanic Humus & Forest Clay',
    rainfall: '3,000mm High Evergreen Monsoon',
    varietals: 'Peaberry Arabica, Sln 9, Kent',
    canopyTrees: 'Wild Jackfruit, Teakwood, Malabar Orange Blossom',
    cuppingProfile: 'Spherical Peaberry Density, Black Fig, Ceylon Cinnamon, Jaggery',
    scaScore: '89.5 SCA Points',
    harvestWindow: 'January to March',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop&q=85',
    description: 'A dense biodiverse sanctuary where single-bean Peaberry cherries are cultivated under thick, multi-tiered evergreen jungle canopies alongside wild spices and native honeybees.',
    keyAromas: ['Black Fig', 'Sweet Nutmeg', 'Ceylon Cinnamon', 'Raw Sugarcane'],
  },
  {
    id: 'malabar',
    name: 'Malabar Maritime Winds',
    state: 'Arabian Sea Shorelines, Kerala',
    elevation: 'Sea Level – 1,200m ASL',
    soil: 'Coastal Marine Loam & Sandstone Beds',
    rainfall: '3,500mm Intense Maritime Monsoon',
    varietals: 'Super-Bold Elephant Arabica AA',
    canopyTrees: 'Coconut Groves, Coastal Casuarina, Teak',
    cuppingProfile: 'Zero Acidity, Liquid Dark Chocolate, Molasses, Charred Malabar Oak',
    scaScore: '88.5 SCA Points',
    harvestWindow: 'June to September (16-Week Sea-Wind Curing)',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&auto=format&fit=crop&q=85',
    description: 'Exposed to saline, moisture-saturated Arabian Sea winds for 16 consecutive weeks. The beans swell by 150%, turning golden-straw and shedding harsh chlorogenic acids for unprecedented syrupy body.',
    keyAromas: ['Molasses', 'Charred Oak', 'Bakers Dark Chocolate', 'Roasted Malt'],
  },
  {
    id: 'araku',
    name: 'Araku Valley Highlands',
    state: 'Eastern Ghats, Andhra Pradesh',
    elevation: '1,300m – 1,550m ASL',
    soil: 'Virgin Red Loam & Mineral Silt',
    rainfall: '1,600mm Mist Valley Precipitation',
    varietals: 'Bio-Dynamic Pulped Arabica, Sln 5B',
    canopyTrees: 'Mango, Silver Oak, Indigenous Shade Polyculture',
    cuppingProfile: 'Wild Forest Honey, Toasted Cashew, Mandarin Citrus, Caramel',
    scaScore: '89.8 SCA Points',
    harvestWindow: 'December to January',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=85',
    description: 'Cultivated bio-dynamically by indigenous tribal families without synthetic fertilizers. The cool valley microclimate creates exceptional natural sweetness and lively citrus brightness.',
    keyAromas: ['Wild Forest Honey', 'Mandarin Orange', 'Toasted Cashew', 'Bergamot'],
  },
];

// Biochemical Processing Protocols
const PROCESSES = [
  {
    title: '96h Anaerobic Natural',
    tag: 'Cold Fermentation',
    temp: '16°C – 18°C Controlled Tank',
    chemistry: 'Sugar Brix: 23.5° • Carbonic Maceration',
    desc: 'Whole ripe cherries sealed in air-tight stainless steel bioreactors purged with inert gas. Anaerobic yeast pathways break down cherry sugars into complex floral esters, creating intoxicating jasmine and blackberry notes.',
    icon: Droplet,
  },
  {
    title: 'Coastal Monsoon Wind Curing',
    tag: 'Maritime Oxidation',
    temp: '28°C • 95% Relative Humidity',
    chemistry: 'Chlorogenic Acid Drop: -42% • Size Expansion: +50%',
    desc: 'Sun-dried beans spread across open-sided coastal warehouses along the Malabar shores. High-salinity monsoon winds strip away sharp bitterness, leaving dense, velvety dark chocolate and pipe tobacco body.',
    icon: Wind,
  },
  {
    title: 'Pulped Golden Honey',
    tag: 'Mucilage Retention',
    temp: '22°C • Raised African Beds',
    chemistry: 'Natural Fructose Transfer • Slow Dehydration',
    desc: 'The outer cherry pulp is gently removed while 80% of the sticky golden mucilage is preserved on the parchment. Drying on raised mesh beds infuses the bean core with natural honey and candied apricot sweetness.',
    icon: Sun,
  },
  {
    title: 'Slow Cast-Iron Convection',
    tag: 'Thermal Physics',
    temp: '198°C – 208°C Drum Core',
    chemistry: 'Extended Maillard Curve • Zero Pyrolytic Scorch',
    desc: 'Sub-15kg drum roasters using 70% convective airflow and 30% cast-iron conductive heat. The bean interior caramelizes without scorching the outer chaff, ensuring roastery-fresh aromatics without burnt ash.',
    icon: Flame,
  },
];

export const EstateAtlasPage: React.FC<EstateAtlasPageProps> = ({
  onDiscoverProduct,
  onAddToCart,
}) => {
  const navigate = useNavigate();

  // Active Region Selector State
  const [selectedRegionId, setSelectedRegionId] = useState<string>('baba-budan');
  const activeRegion = REGIONS.find((r) => r.id === selectedRegionId) || REGIONS[0];

  // Active Cupping Lot Selector State
  const [activeCuppingLotId, setActiveCuppingLotId] = useState<string>('prod-01');
  const activeCuppingLot = NOIR_PRODUCTS.find((p) => p.id === activeCuppingLotId) || NOIR_PRODUCTS[0];

  // Selected Grind for Quick-Add
  const [selectedGrinds, setSelectedGrinds] = useState<{ [id: string]: string }>({
    'prod-01': 'Filter Fine (Brass Davarah)',
    'prod-02': 'Espresso / Heavy Body',
    'prod-03': 'Medium Fine (Pour Over / V60)',
    'prod-04': 'Whole Roasted Bean',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Animation Refs for Coffee Guide Landing & Scroll Effects
  const heroRef = useRef<HTMLElement | null>(null);
  const heroBadgeRef = useRef<HTMLDivElement | null>(null);
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const heroDescRef = useRef<HTMLParagraphElement | null>(null);
  const heroMetricsRef = useRef<HTMLDivElement | null>(null);

  const section1Ref = useRef<HTMLElement | null>(null);
  const section2Ref = useRef<HTMLElement | null>(null);
  const section3Ref = useRef<HTMLElement | null>(null);
  const section4Ref = useRef<HTMLElement | null>(null);
  const section5Ref = useRef<HTMLElement | null>(null);
  const section6Ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Landing Entrance
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (heroBadgeRef.current) {
        heroTl.fromTo(
          heroBadgeRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7, delay: 0.1 }
        );
      }
      if (heroTitleRef.current) {
        heroTl.fromTo(
          heroTitleRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.4'
        );
      }
      if (heroDescRef.current) {
        heroTl.fromTo(
          heroDescRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        );
      }
      if (heroMetricsRef.current) {
        heroTl.fromTo(
          heroMetricsRef.current.children,
          { opacity: 0, y: 30, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1 },
          '-=0.4'
        );
      }

      // 2. Sections Progressive Scroll Reveals
      const scrollSections = [
        section1Ref.current,
        section2Ref.current,
        section3Ref.current,
        section4Ref.current,
        section5Ref.current,
        section6Ref.current,
      ];

      scrollSections.forEach((sec) => {
        if (!sec) return;
        gsap.fromTo(
          sec,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 82%',
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const handleAddLotToCart = (product: Product) => {
    const grind = selectedGrinds[product.id] || 'Filter Fine (Brass Davarah)';
    if (onAddToCart) {
      onAddToCart(product, grind);
    }
    setToastMessage(`Added ${product.name} (${grind}) to your cart.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] selection:bg-[#F5DADF] selection:text-[#2D2926]">
      {/* 1. Sticky Navigation Sub-Bar */}
      <div className="sticky top-16 z-30 border-b border-[#2D2926]/10 bg-white/92 backdrop-blur-md px-6 py-3.5 transition-all">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 text-xs font-sans font-bold tracking-widest uppercase text-[#5E5854] hover:text-[#2D2926] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Overview</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-mono font-bold tracking-wider text-[#8C827A] uppercase">
              SOUTH INDIAN COFFEE & ORIGIN GUIDE
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#E05A7E]" />
            <span className="font-mono text-xs font-bold text-[#E05A7E]">COFFEE GUIDE</span>
          </div>

          <button
            onClick={() => navigate('/collection')}
            className="flex items-center gap-1.5 rounded-full bg-[#2D2926] px-4 py-1.5 text-xs font-sans font-bold text-white shadow-sm hover:bg-[#E05A7E] transition-all cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Shop All Coffees</span>
          </button>
        </div>
      </div>

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-8 right-6 z-50 animate-bounce rounded-2xl bg-[#2D2926] px-5 py-3 text-white shadow-2xl flex items-center gap-3 border border-white/10 text-xs font-sans">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-4 w-4" />
          </div>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 2. Hero Section: Clean & Friendly */}
      <section ref={heroRef} className="relative overflow-hidden border-b border-[#2D2926]/10 bg-gradient-to-b from-white to-[#FAF7F5] pt-14 pb-16 px-6 md:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <div ref={heroBadgeRef} className="inline-flex items-center gap-2 rounded-full border border-[#2D2926]/10 bg-[#F5DADF]/60 px-4 py-1.5 text-xs font-mono font-bold tracking-widest text-[#2D2926] uppercase mb-6 shadow-2xs">
            <Compass className="h-3.5 w-3.5 text-[#E05A7E]" />
            <span>COFFEE ORIGINS • TASTING NOTES • BREWING GUIDE</span>
          </div>

          <h1 ref={heroTitleRef} className="font-display text-4xl sm:text-5xl md:text-6xl text-[#2D2926] font-bold tracking-tight leading-[1.12] mb-6">
            The South Indian <br />
            <span className="italic text-[#E05A7E]">Estate & Terroir Atlas.</span>
          </h1>

          <p ref={heroDescRef} className="mx-auto max-w-3xl font-serif text-base sm:text-lg text-[#5E5854] leading-relaxed mb-10">
            Beyond standard single-origins lies the profound microclimate science of the Western and Eastern Ghats. 
            Inspect elevation topographies, red laterite soil mineral density, biochemical fermentation kinetics, 
            and verified SCA cupping fingerprints across India's most sacred coffee valleys.
          </p>

          {/* Key Metrics Strip */}
          <div ref={heroMetricsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4 border-t border-[#2D2926]/10">
            <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-2xs">
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#2D2926] block mb-0.5">1,920m</span>
              <span className="text-[11px] font-sans tracking-wider uppercase text-[#8C827A] font-bold">Peak Altitude</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-2xs">
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#E05A7E] block mb-0.5">91.2 SCA</span>
              <span className="text-[11px] font-sans tracking-wider uppercase text-[#8C827A] font-bold">Top Cupping Score</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-2xs">
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#2D2926] block mb-0.5">23.5° Brix</span>
              <span className="text-[11px] font-sans tracking-wider uppercase text-[#8C827A] font-bold">Cherry Sugar Density</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-2xs">
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#2D2926] block mb-0.5">16 Weeks</span>
              <span className="text-[11px] font-sans tracking-wider uppercase text-[#8C827A] font-bold">Monsoon Wind Curing</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Regional Terroir Inspector */}
      <section ref={section1Ref} className="py-8 sm:py-12 lg:py-14 px-4 sm:px-8 md:px-12 border-b border-[#2D2926]/10 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 sm:mb-8 text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono tracking-[0.25em] text-[#E05A7E] font-bold uppercase block mb-1.5">
              SECTION 01 / TERROIR GEOGRAPHY
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#2D2926] font-bold">
              Explore the 4 Premier Microclimates.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5E5854] mt-1.5">
              Select an origin valley below to inspect its elevation, mineral soil composition, and native canopy biodiversity.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 max-w-3xl mx-auto mb-6 sm:mb-8 shadow-2xs">
            {REGIONS.map((region) => {
              const isSelected = selectedRegionId === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegionId(region.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? 'bg-[#2D2926] text-white shadow-md scale-[1.02]'
                      : 'text-[#5E5854] hover:text-[#2D2926]'
                  }`}
                >
                  <span className="truncate w-full">{region.name.split(' ')[0]}</span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-[#F5DADF]' : 'text-[#8C827A]'}`}>
                    {region.elevation.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Terroir Panel */}
          <div className="rounded-2xl sm:rounded-3xl border border-[#2D2926]/10 bg-[#FAF7F5] p-4 sm:p-6 lg:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Left Image & Agronomy Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[16/11] sm:aspect-[4/3] max-h-[34vh] sm:max-h-[38vh] overflow-hidden rounded-xl sm:rounded-2xl border border-[#2D2926]/10 shadow-md">
                  <img
                    src={activeRegion.image}
                    alt={activeRegion.name}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-2.5 left-2.5 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-mono font-bold text-[#2D2926] shadow-sm">
                    {activeRegion.state}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#F5DADF] font-bold block mb-0.5">
                      VERIFIED SCA CUPPING BENCHMARK
                    </span>
                    <span className="font-display text-base sm:text-lg font-bold">
                      {activeRegion.scaScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Agronomy Specs Grid */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#E05A7E] font-bold uppercase mb-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{activeRegion.state} • {activeRegion.elevation}</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2D2926] mb-1.5">
                    {activeRegion.name}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#5E5854] leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {activeRegion.description}
                  </p>
                </div>

                {/* Technical Agronomy Data Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-[#2D2926]/10 shadow-2xs">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C827A] font-bold block mb-0.5">
                      Soil Mineral Profile
                    </span>
                    <span className="font-sans text-xs font-bold text-[#2D2926]">
                      {activeRegion.soil}
                    </span>
                  </div>

                  <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-[#2D2926]/10 shadow-2xs">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C827A] font-bold block mb-0.5">
                      Rainfall & Monsoon Vector
                    </span>
                    <span className="font-sans text-xs font-bold text-[#2D2926]">
                      {activeRegion.rainfall}
                    </span>
                  </div>

                  <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-[#2D2926]/10 shadow-2xs">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C827A] font-bold block mb-0.5">
                      Botanical Arabica Varietals
                    </span>
                    <span className="font-sans text-xs font-bold text-[#2D2926]">
                      {activeRegion.varietals}
                    </span>
                  </div>

                  <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-[#2D2926]/10 shadow-2xs">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C827A] font-bold block mb-0.5">
                      Shade Canopy Ecosystem
                    </span>
                    <span className="font-sans text-xs font-bold text-[#2D2926]">
                      {activeRegion.canopyTrees}
                    </span>
                  </div>
                </div>

                {/* Key Aroma Compounds */}
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#8C827A] font-bold block mb-1.5">
                    Dominant Olfactory Aromatics
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeRegion.keyAromas.map((aroma) => (
                      <span
                        key={aroma}
                        className="rounded-full bg-white px-2.5 py-0.5 text-xs font-sans font-semibold text-[#2D2926] border border-[#2D2926]/10 shadow-2xs"
                      >
                        {aroma}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SCA Q-Grader Cupping Radar & Brix Sugar Analysis */}
      <section ref={section2Ref} className="py-8 sm:py-12 lg:py-14 px-4 sm:px-8 md:px-12 border-b border-[#2D2926]/10 bg-[#FAF7F5]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 sm:mb-8 text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono tracking-[0.25em] text-[#E05A7E] font-bold uppercase block mb-1.5">
              SECTION 02 / SENSORY LAB ANALYSIS
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#2D2926] font-bold">
              Q-Grader Cupping Fingerprints.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5E5854] mt-1.5">
              Every single-estate batch is evaluated by licensed sensory cuppers for natural sweetness, body viscosity, and clean cup clarity.
            </p>
          </div>

          {/* Cupping Lot Selector */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
            {NOIR_PRODUCTS.slice(0, 5).map((prod) => {
              const isSelected = activeCuppingLotId === prod.id;
              return (
                <button
                  key={prod.id}
                  onClick={() => setActiveCuppingLotId(prod.id)}
                  className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2D2926] text-white shadow-sm scale-[1.02]'
                      : 'bg-white text-[#5E5854] border border-[#2D2926]/10 hover:text-[#2D2926]'
                  }`}
                >
                  {prod.name}
                </button>
              );
            })}
          </div>

          {/* Interactive Sensory Radar Dashboard */}
          <div className="rounded-2xl sm:rounded-3xl border border-[#2D2926]/10 bg-white p-4 sm:p-6 lg:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Lot Profile Summary */}
              <div className="lg:col-span-5 space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E05A7E]/10 px-2.5 py-0.5 text-xs font-mono font-bold text-[#E05A7E]">
                  <span>{activeCuppingLot.origin} • {activeCuppingLot.altitude}</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2D2926]">
                  {activeCuppingLot.name}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#5E5854] leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {activeCuppingLot.description}
                </p>

                <div className="p-3 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/10 space-y-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C827A] font-bold block">
                    Tasting Notes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCuppingLot.notes.map((note) => (
                      <span
                        key={note}
                        className="rounded-lg bg-white px-2 py-0.5 text-[11px] font-mono font-bold text-[#2D2926] border border-[#2D2926]/10"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="font-mono text-base sm:text-lg font-bold text-[#2D2926]">
                    {activeCuppingLot.price}
                  </span>
                  <button
                    onClick={() => handleAddLotToCart(activeCuppingLot)}
                    className="rounded-xl bg-[#2D2926] text-white px-3.5 py-1.5 text-xs font-sans font-bold hover:bg-[#E05A7E] transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>

              {/* Sensory Metric Bars */}
              <div className="lg:col-span-7 space-y-4 bg-[#FAF7F5] p-4 sm:p-5 rounded-2xl border border-[#2D2926]/10">
                <div className="flex items-center justify-between pb-2 border-b border-[#2D2926]/10">
                  <span className="text-xs font-mono font-bold uppercase text-[#2D2926]">
                    Sensory Metric Breakdown
                  </span>
                  <span className="text-xs font-mono text-[#E05A7E] font-bold">
                    SCA Standard Scale (0–100)
                  </span>
                </div>

                {/* Metric 1: Sweetness / Brix */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-[#2D2926]">Natural Sucrose Sweetness</span>
                    <span className="font-bold text-[#E05A7E]">{activeCuppingLot.sweetness} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-[#2D2926]/10">
                    <div
                      className="h-full bg-gradient-to-r from-[#C89658] to-[#E05A7E] rounded-full transition-all duration-500"
                      style={{ width: `${activeCuppingLot.sweetness}%` }}
                    />
                  </div>
                </div>

                {/* Metric 2: Body / Viscosity */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-[#2D2926]">Body & Crema Viscosity</span>
                    <span className="font-bold text-[#2D2926]">{activeCuppingLot.body} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-[#2D2926]/10">
                    <div
                      className="h-full bg-[#2D2926] rounded-full transition-all duration-500"
                      style={{ width: `${activeCuppingLot.body}%` }}
                    />
                  </div>
                </div>

                {/* Metric 3: Acidity Balance */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-[#2D2926]">Clean Fruit Acidity</span>
                    <span className="font-bold text-[#2D2926]">{activeCuppingLot.acidity} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-[#2D2926]/10">
                    <div
                      className="h-full bg-gradient-to-r from-[#2D2926] to-[#C89658] rounded-full transition-all duration-500"
                      style={{ width: `${activeCuppingLot.acidity}%` }}
                    />
                  </div>
                </div>

                {/* Scientific Extraction Recommendation */}
                <div className="pt-1.5 text-xs font-mono text-[#5E5854] flex items-start gap-2">
                  <Activity className="h-3.5 w-3.5 text-[#E05A7E] shrink-0 mt-0.5" />
                  <span>
                    <strong>Optimal Extraction Window:</strong> {activeCuppingLot.brewRecommendation}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Biochemical Fermentation & Roastery Physics */}
      <section ref={section3Ref} className="py-8 sm:py-12 lg:py-14 px-4 sm:px-8 md:px-12 border-b border-[#2D2926]/10 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 sm:mb-8 text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono tracking-[0.25em] text-[#E05A7E] font-bold uppercase block mb-1.5">
              SECTION 03 / BIOCHEMICAL PROCESSES
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#2D2926] font-bold">
              The Science of Fermentation & Roasting.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5E5854] mt-1.5">
              How precise anaerobic tank purging, Malabar ocean winds, and convective drum physics transform raw cherries into liquid silk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {PROCESSES.map((proc, idx) => {
              const Icon = proc.icon;
              return (
                <div
                  key={proc.title}
                  className="rounded-2xl border border-[#2D2926]/10 bg-[#FAF7F5] p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between hover:border-[#E05A7E] transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="font-mono text-xs font-bold text-[#E05A7E]">
                        METHOD 0{idx + 1}
                      </span>
                      <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center border border-[#2D2926]/10">
                        <Icon className="h-3.5 w-3.5 text-[#2D2926] group-hover:text-[#E05A7E] transition-colors" />
                      </div>
                    </div>

                    <h3 className="font-display text-base font-bold text-[#2D2926] mb-0.5">
                      {proc.title}
                    </h3>
                    <div className="text-[10px] font-mono text-[#E05A7E] font-semibold mb-2">
                      {proc.tag}
                    </div>

                    <p className="font-sans text-xs text-[#5E5854] leading-relaxed mb-3 line-clamp-3">
                      {proc.desc}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-[#2D2926]/10 space-y-0.5 text-[10px] font-mono text-[#8C827A]">
                    <div><strong>Parameter:</strong> {proc.temp}</div>
                    <div><strong>Kinetics:</strong> {proc.chemistry}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Water Mineral Chemistry & Brewing Extraction Metrics */}
      <section ref={section4Ref} className="py-8 sm:py-12 lg:py-14 px-4 sm:px-8 md:px-12 border-b border-[#2D2926]/10 bg-[#FAF7F5]">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 sm:mb-8 text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono tracking-[0.25em] text-[#E05A7E] font-bold uppercase block mb-1.5">
              SECTION 04 / WATER & EXTRACTION CHEMISTRY
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#2D2926] font-bold">
              The 98% Solvent: Water Chemistry.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5E5854] mt-1.5">
              Coffee is 98% water. Standard municipal tap water contains excess bicarbonates that mute fruit sugars. Here are our calibrated brewing specs:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            <div className="rounded-2xl bg-white border border-[#2D2926]/10 p-4 sm:p-5 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E05A7E] font-bold block mb-1">
                TOTAL DISSOLVED SOLIDS
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2D2926] mb-1.5">120 – 140 PPM</h3>
              <p className="font-sans text-xs text-[#5E5854] leading-relaxed">
                Clean, mineral-balanced spring water. Below 80 PPM extracts excessive sharp acidity; above 200 PPM causes chalky, muted extraction.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-[#2D2926]/10 p-4 sm:p-5 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E05A7E] font-bold block mb-1">
                CALCIUM & MAGNESIUM
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2D2926] mb-1.5">2:1 Ion Ratio</h3>
              <p className="font-sans text-xs text-[#5E5854] leading-relaxed">
                Magnesium ions bind directly with oxygenated fruit terpenes, while Calcium highlights rich Mysore cocoa lipids and natural crema body.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-[#2D2926]/10 p-4 sm:p-5 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E05A7E] font-bold block mb-1">
                EXTRACTION YIELD TARGET
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2D2926] mb-1.5">19.5% – 21.2%</h3>
              <p className="font-sans text-xs text-[#5E5854] leading-relaxed">
                The golden extraction sweet-spot. Extracts sweet core fructose and aromatic oils while leaving bitter plant lignins behind in the spent puck.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Seasonal Agricultural Harvest Calendar */}
      <section ref={section5Ref} className="py-8 sm:py-12 lg:py-14 px-4 sm:px-8 md:px-12 border-b border-[#2D2926]/10 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 sm:mb-8 text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono tracking-[0.25em] text-[#E05A7E] font-bold uppercase block mb-1.5">
              SECTION 05 / CROP ROTATION CALENDAR
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#2D2926] font-bold">
              The 12-Month Western Ghats Cycle.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/10">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#E05A7E] font-bold uppercase mb-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>DEC – FEB</span>
              </div>
              <h4 className="font-display text-sm font-bold text-[#2D2926] mb-1">Peak Arabica Harvest</h4>
              <p className="text-xs text-[#5E5854] leading-relaxed">
                Selective 22° Brix handpicking in high Chikmagalur peaks. Pulping and raised bed fermentation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/10">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#E05A7E] font-bold uppercase mb-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>MAR – MAY</span>
              </div>
              <h4 className="font-display text-sm font-bold text-[#2D2926] mb-1">Blossom Irrigation</h4>
              <p className="text-xs text-[#5E5854] leading-relaxed">
                Pre-monsoon blossom showers trigger millions of fragrant white jasmine flowers across the hillsides.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/10">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#E05A7E] font-bold uppercase mb-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>JUN – SEP</span>
              </div>
              <h4 className="font-display text-sm font-bold text-[#2D2926] mb-1">Monsoon Cask Curing</h4>
              <p className="text-xs text-[#5E5854] leading-relaxed">
                High-altitude cherries swell under Arabian Sea winds in coastal Mangalore and Wayanad sheds.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/10">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#E05A7E] font-bold uppercase mb-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>OCT – NOV</span>
              </div>
              <h4 className="font-display text-sm font-bold text-[#2D2926] mb-1">Canopy Pruning & Prep</h4>
              <p className="text-xs text-[#5E5854] leading-relaxed">
                Silver oak trimming to optimize sunlight filtration before cherries turn deep burgundy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Direct Single-Estate Coffee Cards */}
      <section ref={section6Ref} className="py-8 sm:py-12 lg:py-14 px-4 sm:px-8 md:px-12 bg-[#FAF7F5]">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
            <div>
              <span className="text-xs font-mono tracking-[0.25em] text-[#E05A7E] font-bold uppercase block mb-1">
                FRESH ROASTED SELECTION
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#2D2926] font-bold">
                Order Fresh Roasted Coffee.
              </h2>
            </div>
            <button
              onClick={() => navigate('/collection')}
              className="text-xs font-sans font-bold tracking-wider uppercase text-[#E05A7E] hover:underline flex items-center gap-1"
            >
              <span>View All 12 Coffees</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {NOIR_PRODUCTS.slice(0, 4).map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl sm:rounded-3xl border border-[#2D2926]/10 bg-white p-3.5 sm:p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  <div 
                    onClick={() => {
                      if (onDiscoverProduct) onDiscoverProduct(prod);
                      else navigate(`/product/${prod.id}`);
                    }}
                    className="relative aspect-[16/11] sm:aspect-[4/3] overflow-hidden rounded-xl sm:rounded-2xl mb-2.5 bg-[#FAF7F5] border border-[#2D2926]/10 cursor-pointer"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 rounded-full bg-white/95 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold text-[#2D2926] shadow-sm">
                      {prod.badge}
                    </div>
                  </div>

                  <h3 
                    onClick={() => {
                      if (onDiscoverProduct) onDiscoverProduct(prod);
                      else navigate(`/product/${prod.id}`);
                    }}
                    className="font-display text-sm sm:text-base font-bold text-[#2D2926] mb-0.5 group-hover:text-[#E05A7E] transition-colors cursor-pointer truncate"
                  >
                    {prod.name}
                  </h3>
                  <div className="text-[10px] sm:text-[11px] font-mono text-[#8C827A] mb-1.5 font-medium truncate">
                    {prod.region} • {prod.altitude}
                  </div>

                  <p className="text-xs font-sans text-[#5E5854] line-clamp-2 leading-relaxed mb-2.5">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[#2D2926]/10 space-y-2">
                  <div>
                    <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#8C827A] block mb-1">
                      Select Grind Profile
                    </label>
                    <select
                      value={selectedGrinds[prod.id] || 'Filter Fine (Brass Davarah)'}
                      onChange={(e) => setSelectedGrinds((prev) => ({ ...prev, [prod.id]: e.target.value }))}
                      className="w-full rounded-lg bg-[#FAF7F5] border border-[#2D2926]/15 px-2 py-1 text-[11px] text-[#2D2926] font-sans font-medium focus:border-[#E05A7E] focus:outline-none"
                    >
                      <option value="Filter Fine (Brass Davarah)">Filter Fine (Brass Davarah)</option>
                      <option value="Medium Fine (Pour Over / V60)">Medium Fine (Pour Over)</option>
                      <option value="Coarse Grind (French Press / Cold Brew)">Coarse (French Press)</option>
                      <option value="Whole Roasted Bean">Whole Roasted Bean</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-sm sm:text-base font-bold text-[#2D2926]">
                      {prod.price}
                    </span>
                    <button
                      onClick={() => handleAddLotToCart(prod)}
                      className="rounded-xl bg-[#2D2926] text-white px-3 py-1.5 text-xs font-sans font-bold hover:bg-[#E05A7E] transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <ShoppingBag className="h-3 w-3" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EstateAtlasPage;
