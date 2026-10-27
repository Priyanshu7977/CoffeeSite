import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Coffee, 
  Sparkles, 
  Layers, 
  ShoppingBag, 
  Check, 
  Heart,
  Droplet,
  Sun
} from 'lucide-react';
import { NOIR_PRODUCTS } from '../data/products';
import type { Product } from '../types';

interface HeritagePageProps {
  onDiscoverProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, grind: string) => void;
}

export const HeritagePage: React.FC<HeritagePageProps> = ({
  onDiscoverProduct,
  onAddToCart,
}) => {
  const navigate = useNavigate();

  // Active Blend Ratio Tab State
  const [activeBlend, setActiveBlend] = useState<'pure' | '85-15' | '80-20'>('80-20');

  // Selected Grind for Quick-Add lots
  const [selectedGrinds, setSelectedGrinds] = useState<{ [productId: string]: string }>({
    'prod-01': 'Filter Fine (Brass Davarah)',
    'prod-02': 'Espresso / Decoction',
    'prod-04': 'Filter Fine (Brass Davarah)',
    'prod-11': 'Whole Roasted Bean',
  });

  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  // 4 Featured Heritage Lots from NOIR_PRODUCTS
  const heritageLots: Product[] = [
    NOIR_PRODUCTS.find((p) => p.id === 'prod-01') || NOIR_PRODUCTS[0],
    NOIR_PRODUCTS.find((p) => p.id === 'prod-02') || NOIR_PRODUCTS[1],
    NOIR_PRODUCTS.find((p) => p.id === 'prod-04') || NOIR_PRODUCTS[3],
    NOIR_PRODUCTS.find((p) => p.id === 'prod-11') || NOIR_PRODUCTS[10],
  ];

  const handleAddLotToCart = (product: Product) => {
    const grind = selectedGrinds[product.id] || 'Filter Fine (Brass Davarah)';
    if (onAddToCart) {
      onAddToCart(product, grind);
    }
    setAddedItemNotice(`Added ${product.name} (${grind}) to your allocation.`);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 3500);
  };

  const handleGrindChange = (productId: string, grind: string) => {
    setSelectedGrinds((prev) => ({ ...prev, [productId]: grind }));
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] selection:bg-[#F5DADF] selection:text-[#2D2926]">
      {/* 1. Top Sub-Navigation Bar */}
      <div className="sticky top-16 z-30 border-b border-[#2D2926]/10 bg-white/90 backdrop-blur-md px-6 py-3.5 transition-all">
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
              SOUTH INDIAN COFFEE HERITAGE
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#E05A7E]" />
            <span className="font-mono text-xs font-bold text-[#E05A7E]">EST. 1998</span>
          </div>

          <button
            onClick={() => navigate('/collection')}
            className="flex items-center gap-1.5 rounded-full bg-[#2D2926] px-4 py-1.5 text-xs font-sans font-bold text-white shadow-sm hover:bg-[#E05A7E] transition-all cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Shop All 12 Lots</span>
          </button>
        </div>
      </div>

      {/* Added to cart toast notification */}
      {addedItemNotice && (
        <div className="fixed bottom-8 right-6 z-50 animate-bounce rounded-2xl bg-[#2D2926] px-5 py-3 text-white shadow-2xl flex items-center gap-3 border border-white/10 text-xs font-sans">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-4 w-4" />
          </div>
          <span className="font-medium">{addedItemNotice}</span>
        </div>
      )}

      {/* 2. Hero Story Header (Clean Editorial Layout inspired by Leo Coffee) */}
      <section className="relative overflow-hidden border-b border-[#2D2926]/10 bg-gradient-to-b from-white to-[#FAF7F5] pt-14 pb-16 px-6 md:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2D2926]/10 bg-[#F5DADF]/60 px-4 py-1.5 text-xs font-mono font-bold tracking-widest text-[#2D2926] uppercase mb-6 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#E05A7E]" />
            <span>ESTATE TO CUP TRADITION • WESTERN GHATS TERROIR</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#2D2926] font-bold tracking-tight leading-[1.12] mb-6">
            From the Misty Western Ghats <br />
            to the <span className="italic text-[#E05A7E]">Brass Davarah.</span>
          </h1>

          <p className="mx-auto max-w-3xl font-serif text-base sm:text-lg text-[#5E5854] leading-relaxed mb-10">
            For over a century, South Indian coffee has stood as one of the world's great culinary rituals. 
            Rooted in the high-altitude cloud forests of Chikmagalur and Kodagu, Noir Dakshin honors this 
            living tradition: single-estate shade-grown cherries, the sacred discipline of daily small-batch 
            convective drum roasting, and the soul-stirring alchemy of thick, bittersweet filter kaapi.
          </p>

          {/* Quick Credibility Badges (Clean, Timeless) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4 border-t border-[#2D2926]/10">
            <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-2xs">
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#2D2926] block mb-0.5">1,900m</span>
              <span className="text-[11px] font-sans tracking-wider uppercase text-[#8C827A] font-bold">Peak Elevation</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-2xs">
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#E05A7E] block mb-0.5">Grind Daily</span>
              <span className="text-[11px] font-sans tracking-wider uppercase text-[#8C827A] font-bold">Zero Shelf Aging</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-2xs">
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#2D2926] block mb-0.5">100% Shade</span>
              <span className="text-[11px] font-sans tracking-wider uppercase text-[#8C827A] font-bold">Rainforest Canopy</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-2xs">
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#2D2926] block mb-0.5">Pure Brass</span>
              <span className="text-[11px] font-sans tracking-wider uppercase text-[#8C827A] font-bold">Gravity Extraction</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 'Grind Daily' Philosophy (Leo Coffee Core Legend) */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-b border-[#2D2926]/10 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Visual Panel Left */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden rounded-3xl border border-[#2D2926]/10 shadow-xl bg-[#2D2926]">
                <img
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop&q=85"
                  alt="Traditional South Indian Coffee Grinding and Roasting"
                  className="h-full w-full object-cover object-center filter saturate-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-[#E05A7E] text-white px-2.5 py-1 rounded-full font-bold mb-2 inline-block">
                    ROASTERY CODE OF HONOUR
                  </span>
                  <p className="font-serif text-sm italic text-[#FAF7F5]">
                    “Freshly roasted whole beans ground moments before packaging—preserving the fragile volatile aromatics of the Western Ghats.”
                  </p>
                </div>
              </div>
            </div>

            {/* Narrative Right */}
            <div className="lg:col-span-6 space-y-5">
              <div className="text-xs font-mono tracking-[0.25em] text-[#E05A7E] font-bold uppercase">
                THE FOUNDATIONAL DISCIPLINE
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-[#2D2926] font-bold tracking-tight">
                The "Grind Daily" Promise.
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#5E5854] leading-relaxed">
                Walk through the cultural quarter of Mylapore in Chennai or the historic plantation estates of 
                Chikmagalur at dawn, and one scent commands the air: the intoxicating perfume of coffee beans 
                being freshly ground inside traditional brass mills.
              </p>
              <p className="font-sans text-sm sm:text-base text-[#5E5854] leading-relaxed">
                Industrial supermarket coffee sits in warehouses for six months, bleeding its delicate terpenes and 
                leaving only dull, oxidised bitterness. At Noir Dakshin, we roast strictly in micro-batches of under 
                15 kilograms using slow cast-iron drum convection. We grind to order, sealing each canister under inert 
                nitrogen with a one-way aroma valve.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10">
                  <h4 className="font-display text-sm font-bold text-[#2D2926] mb-1">Zero Artificial Essences</h4>
                  <p className="text-xs text-[#8C827A] leading-relaxed">
                    100% natural estate coffee and pure roasted chicory root. No added flavour chemicals, oils, or synthetic caramel.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10">
                  <h4 className="font-display text-sm font-bold text-[#2D2926] mb-1">Small Batch Precision</h4>
                  <p className="text-xs text-[#8C827A] leading-relaxed">
                    Each drum rotation is monitored by master roasters for uniform core bean caramelization without scorched chaff.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Estate-to-Cup Journey (Clean 4-Step Editorial Flow) */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-b border-[#2D2926]/10 bg-[#FAF7F5]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono tracking-[0.25em] text-[#E05A7E] font-bold uppercase block mb-2">
              ESTATE AGRONOMY
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#2D2926] font-bold">
              The Journey of a Dakshin Bean.
            </h2>
            <p className="font-sans text-sm text-[#5E5854] mt-3">
              How high-altitude cloud forests, wild spice canopies, and generational plantation knowledge shape every cup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="rounded-3xl bg-white border border-[#2D2926]/10 p-6 shadow-sm flex flex-col justify-between hover:border-[#E05A7E] transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-bold text-[#E05A7E]">01</span>
                  <div className="h-8 w-8 rounded-full bg-[#FAF7F5] flex items-center justify-center border border-[#2D2926]/10">
                    <Sun className="h-4 w-4 text-[#C89658]" />
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold text-[#2D2926] mb-2 group-hover:text-[#E05A7E] transition-colors">
                  Canopy Shade Growth
                </h3>
                <p className="text-xs font-sans text-[#5E5854] leading-relaxed mb-4">
                  Cherries mature slowly at 1,400m–1,900m beneath silver oak, wild jackfruit, and fig trees. The deep shade allows dense sugars to concentrate up to 22° Brix.
                </p>
              </div>
              <div className="pt-3 border-t border-[#2D2926]/5 text-[11px] font-mono text-[#8C827A] font-semibold">
                Region: Chikmagalur & Kodagu
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl bg-white border border-[#2D2926]/10 p-6 shadow-sm flex flex-col justify-between hover:border-[#E05A7E] transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-bold text-[#E05A7E]">02</span>
                  <div className="h-8 w-8 rounded-full bg-[#FAF7F5] flex items-center justify-center border border-[#2D2926]/10">
                    <Layers className="h-4 w-4 text-[#C89658]" />
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold text-[#2D2926] mb-2 group-hover:text-[#E05A7E] transition-colors">
                  Spice Intercropping
                </h3>
                <p className="text-xs font-sans text-[#5E5854] leading-relaxed mb-4">
                  Our coffee plants share the rich red loam with wild black pepper vines, cardamom pods, and cinnamon bark, naturally imparting subtle warm aromatic notes.
                </p>
              </div>
              <div className="pt-3 border-t border-[#2D2926]/5 text-[11px] font-mono text-[#8C827A] font-semibold">
                Biodiversity: 100% Organic Soil
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl bg-white border border-[#2D2926]/10 p-6 shadow-sm flex flex-col justify-between hover:border-[#E05A7E] transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-bold text-[#E05A7E]">03</span>
                  <div className="h-8 w-8 rounded-full bg-[#FAF7F5] flex items-center justify-center border border-[#2D2926]/10">
                    <Coffee className="h-4 w-4 text-[#C89658]" />
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold text-[#2D2926] mb-2 group-hover:text-[#E05A7E] transition-colors">
                  Convective Roasting
                </h3>
                <p className="text-xs font-sans text-[#5E5854] leading-relaxed mb-4">
                  Slow cast-iron drum convection allows gentle heat transfer without scorch. The bean caramelizes evenly from outer shell to the inner embryonic core.
                </p>
              </div>
              <div className="pt-3 border-t border-[#2D2926]/5 text-[11px] font-mono text-[#8C827A] font-semibold">
                Method: Micro-Drum Convection
              </div>
            </div>

            {/* Step 4 */}
            <div className="rounded-3xl bg-white border border-[#2D2926]/10 p-6 shadow-sm flex flex-col justify-between hover:border-[#E05A7E] transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-bold text-[#E05A7E]">04</span>
                  <div className="h-8 w-8 rounded-full bg-[#FAF7F5] flex items-center justify-center border border-[#2D2926]/10">
                    <Droplet className="h-4 w-4 text-[#C89658]" />
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold text-[#2D2926] mb-2 group-hover:text-[#E05A7E] transition-colors">
                  The Brass Drip Alchemy
                </h3>
                <p className="text-xs font-sans text-[#5E5854] leading-relaxed mb-4">
                  Gravity extraction inside traditional two-chamber brass filters produces the prized thick 'Modhal Decoction', dense with crema-forming aromatic lipids.
                </p>
              </div>
              <div className="pt-3 border-t border-[#2D2926]/5 text-[11px] font-mono text-[#8C827A] font-semibold">
                Extraction: Natural Gravity 1:4
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. The South Indian Blend Science (Leo Coffee Style Transparency) */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-b border-[#2D2926]/10 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono tracking-[0.25em] text-[#E05A7E] font-bold uppercase block mb-2">
                TRADITIONAL BLEND ARCHITECTURE
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#2D2926] font-bold">
                Decoding Coffee & Chicory.
              </h2>
              <p className="font-sans text-sm text-[#5E5854] max-w-xl mt-2">
                In authentic South Indian filter coffee tradition, the interplay of high-elevation Arabica with roasted Jamnagar chicory root is a master craft. Explore our 3 signature proportions:
              </p>
            </div>

            {/* Blend Selector Tabs */}
            <div className="flex items-center gap-2 rounded-2xl bg-[#FAF7F5] p-1.5 border border-[#2D2926]/10">
              <button
                onClick={() => setActiveBlend('80-20')}
                className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer ${
                  activeBlend === '80-20'
                    ? 'bg-[#2D2926] text-white shadow-sm'
                    : 'text-[#5E5854] hover:text-[#2D2926]'
                }`}
              >
                80:20 Madras Classic
              </button>
              <button
                onClick={() => setActiveBlend('85-15')}
                className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer ${
                  activeBlend === '85-15'
                    ? 'bg-[#2D2926] text-white shadow-sm'
                    : 'text-[#5E5854] hover:text-[#2D2926]'
                }`}
              >
                85:15 Royale Dakshin
              </button>
              <button
                onClick={() => setActiveBlend('pure')}
                className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer ${
                  activeBlend === 'pure'
                    ? 'bg-[#2D2926] text-white shadow-sm'
                    : 'text-[#5E5854] hover:text-[#2D2926]'
                }`}
              >
                100% Pure Coffee
              </button>
            </div>
          </div>

          {/* Active Blend Presentation Card */}
          <div className="rounded-3xl border border-[#2D2926]/10 bg-[#FAF7F5] p-8 lg:p-12 shadow-sm">
            {activeBlend === '80-20' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#E05A7E]/10 px-3 py-1 text-xs font-mono font-bold text-[#E05A7E]">
                    <span>THE QUINTESSENTIAL SOUTH INDIAN CUP</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2926]">
                    80% Plantation Estate Arabica • 20% Roasted French Chicory
                  </h3>
                  <p className="font-sans text-sm text-[#5E5854] leading-relaxed">
                    This is the iconic ratio celebrated in Chennai and Bangalore households for over a century. The 20% premium Jamnagar chicory root adds natural caramelized sweetness, a deep mahogany hue, and an irresistible thick viscosity that holds up proudly to steaming whole buffalo milk.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-white border border-[#2D2926]/10">
                      <span className="text-[10px] font-mono text-[#8C827A] uppercase block">Body</span>
                      <span className="font-sans text-sm font-bold text-[#2D2926]">Viscous & Heavy</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#2D2926]/10">
                      <span className="text-[10px] font-mono text-[#8C827A] uppercase block">Flavour Profile</span>
                      <span className="font-sans text-sm font-bold text-[#2D2926]">Dark Cacao, Molasses</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#2D2926]/10">
                      <span className="text-[10px] font-mono text-[#8C827A] uppercase block">Best Enjoyed</span>
                      <span className="font-sans text-sm font-bold text-[#2D2926]">With Hot Frothy Milk</span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-[#2D2926]/10 shadow-sm text-center">
                  <span className="text-xs font-mono tracking-widest text-[#8C827A] uppercase block mb-1">
                    RECOMMENDED HERITAGE LOT
                  </span>
                  <h4 className="font-display text-xl font-bold text-[#2D2926] mb-2">
                    DAKSHIN RESERVE 1998
                  </h4>
                  <p className="text-xs text-[#5E5854] mb-4">
                    Our flagship heritage filter blend. Roasted dark in cast-iron drums and ground to micro-perforated brass filter fineness.
                  </p>
                  <button
                    onClick={() => handleAddLotToCart(heritageLots[0])}
                    className="w-full py-2.5 rounded-xl bg-[#2D2926] text-white text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#E05A7E] transition-all cursor-pointer shadow-sm"
                  >
                    Add 1998 Lot to Cart (₹2,600)
                  </button>
                </div>
              </div>
            )}

            {activeBlend === '85-15' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#C89658]/20 px-3 py-1 text-xs font-mono font-bold text-[#2D2926]">
                    <span>SPECIAL A ROYALE ESTATE BLEND</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2926]">
                    85% High-Grown Peaberry & Arabica • 15% Chicory
                  </h3>
                  <p className="font-sans text-sm text-[#5E5854] leading-relaxed">
                    Designed for discerning palates who desire the rich golden crema of chicory while allowing the delicate floral and nutmeg undertones of high-altitude Arabica to shine through. Silky, aromatic, and perfectly balanced.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-white border border-[#2D2926]/10">
                      <span className="text-[10px] font-mono text-[#8C827A] uppercase block">Body</span>
                      <span className="font-sans text-sm font-bold text-[#2D2926]">Medium-Heavy Velvet</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#2D2926]/10">
                      <span className="text-[10px] font-mono text-[#8C827A] uppercase block">Flavour Profile</span>
                      <span className="font-sans text-sm font-bold text-[#2D2926]">Hazelnut, Brown Butter</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#2D2926]/10">
                      <span className="text-[10px] font-mono text-[#8C827A] uppercase block">Best Enjoyed</span>
                      <span className="font-sans text-sm font-bold text-[#2D2926]">Light Milk or Black</span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-[#2D2926]/10 shadow-sm text-center">
                  <span className="text-xs font-mono tracking-widest text-[#8C827A] uppercase block mb-1">
                    RECOMMENDED HERITAGE LOT
                  </span>
                  <h4 className="font-display text-xl font-bold text-[#2D2926] mb-2">
                    COORG RAINFOREST PEABERRY
                  </h4>
                  <p className="text-xs text-[#5E5854] mb-4">
                    Spherical Peaberry cherries hand-harvested beneath silver oak canopies. Roasted slow with subtle 15% chicory harmony.
                  </p>
                  <button
                    onClick={() => handleAddLotToCart(heritageLots[2])}
                    className="w-full py-2.5 rounded-xl bg-[#2D2926] text-white text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#E05A7E] transition-all cursor-pointer shadow-sm"
                  >
                    Add Peaberry Lot to Cart (₹2,200)
                  </button>
                </div>
              </div>
            )}

            {activeBlend === 'pure' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-mono font-bold text-emerald-800">
                    <span>100% PURE ESTATE COFFEE • ZERO CHICORY</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2926]">
                    100% Single-Estate Western Ghats Arabica
                  </h3>
                  <p className="font-sans text-sm text-[#5E5854] leading-relaxed">
                    For the specialty coffee purist. Unblended single-origin beans harvested from Baba Budangiri and Malabar. Zero chicory added. Experience the natural crystalline fruit acidity, jasmine aroma, and dark cocoa terpenes of unadulterated Indian terroir.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-white border border-[#2D2926]/10">
                      <span className="text-[10px] font-mono text-[#8C827A] uppercase block">Body</span>
                      <span className="font-sans text-sm font-bold text-[#2D2926]">Silky & Clean</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#2D2926]/10">
                      <span className="text-[10px] font-mono text-[#8C827A] uppercase block">Flavour Profile</span>
                      <span className="font-sans text-sm font-bold text-[#2D2926]">Wild Cardamom, Jasmine</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#2D2926]/10">
                      <span className="text-[10px] font-mono text-[#8C827A] uppercase block">Best Enjoyed</span>
                      <span className="font-sans text-sm font-bold text-[#2D2926]">Pour Over, AeroPress, Pure Kaapi</span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-[#2D2926]/10 shadow-sm text-center">
                  <span className="text-xs font-mono tracking-widest text-[#8C827A] uppercase block mb-1">
                    RECOMMENDED HERITAGE LOT
                  </span>
                  <h4 className="font-display text-xl font-bold text-[#2D2926] mb-2">
                    BABA BUDAN OBSIDIAN
                  </h4>
                  <p className="text-xs text-[#5E5854] mb-4">
                    1,900m sacred mountain Arabica with 96h anaerobic natural fermentation. Unblended pure terroir excellence.
                  </p>
                  <button
                    onClick={() => handleAddLotToCart(heritageLots[0])}
                    className="w-full py-2.5 rounded-xl bg-[#2D2926] text-white text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#E05A7E] transition-all cursor-pointer shadow-sm"
                  >
                    Add Baba Budan to Cart (₹2,800)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. The Traditional Davarah Brewing Guide (Editorial Storytelling, NO Clocks) */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-b border-[#2D2926]/10 bg-[#FAF7F5]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono tracking-[0.25em] text-[#E05A7E] font-bold uppercase block mb-2">
              THE SACRED ATELIER RITUAL
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#2D2926] font-bold">
              How to Brew Traditional Filter Kaapi.
            </h2>
            <p className="font-sans text-sm text-[#5E5854] mt-3">
              No digital clocks or complicated apparatus required. Follow these three time-honored steps perfected across South Indian homes for over a century.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="rounded-3xl bg-white border border-[#2D2926]/10 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center font-mono font-bold text-sm text-[#2D2926] mb-5">
                  1
                </div>
                <h3 className="font-display text-lg font-bold text-[#2D2926] mb-2">
                  The Tamp & Level
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#5E5854] leading-relaxed mb-4">
                  Add 2.5 to 3 tablespoons (approx. 25g–30g) of freshly ground coffee into the top perforated brass cylinder. Gently rest the umbrella pressing disc on top. 
                  <strong className="text-[#2D2926]"> Do not compress too hard</strong>—allow the grounds to breathe.
                </p>
              </div>
              <div className="pt-3 border-t border-[#2D2926]/5 text-[11px] font-mono text-[#8C827A]">
                Proportion: 30g powder : 120ml water
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl bg-white border border-[#2D2926]/10 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center font-mono font-bold text-sm text-[#2D2926] mb-5">
                  2
                </div>
                <h3 className="font-display text-lg font-bold text-[#2D2926] mb-2">
                  The Slow Decoction Drip
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#5E5854] leading-relaxed mb-4">
                  Boil fresh water to 94°C (just off the boil). Pour 120ml gently over the perforated disc. Close the brass lid. Let natural gravity do its work for 8 to 10 minutes. The resulting syrup is the prized <em className="text-[#2D2926] font-serif">Modhal Decoction</em>.
                </p>
              </div>
              <div className="pt-3 border-t border-[#2D2926]/5 text-[11px] font-mono text-[#8C827A]">
                Temperature: 92°C – 94°C
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl bg-white border border-[#2D2926]/10 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center font-mono font-bold text-sm text-[#2D2926] mb-5">
                  3
                </div>
                <h3 className="font-display text-lg font-bold text-[#2D2926] mb-2">
                  The Metre Froth Pour
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#5E5854] leading-relaxed mb-4">
                  Pour 30ml of thick decoction into the davarah. Add 90ml of hot whole boiled milk and organic jaggery or raw sugar. Pour back and forth between the tumbler and davarah in wide, graceful arcs to dissolve sugar, cool slightly, and crown with golden crema.
                </p>
              </div>
              <div className="pt-3 border-t border-[#2D2926]/5 text-[11px] font-mono text-[#8C827A]">
                Vessel: Traditional Brass Davarah
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Featured Heritage Lots Showcase (Clean 1-Click Purchase) */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-b border-[#2D2926]/10 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-mono tracking-[0.25em] text-[#E05A7E] font-bold uppercase block mb-1">
                SELECTION DE MAISON
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#2D2926] font-bold">
                The Heritage Collection.
              </h2>
            </div>
            <button
              onClick={() => navigate('/collection')}
              className="text-xs font-sans font-bold tracking-wider uppercase text-[#E05A7E] hover:underline flex items-center gap-1"
            >
              <span>View All 12 Curated Lots</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {heritageLots.map((prod) => (
              <div
                key={prod.id}
                className="rounded-3xl border border-[#2D2926]/10 bg-[#FAF7F5] p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  <div 
                    onClick={() => {
                      if (onDiscoverProduct) onDiscoverProduct(prod);
                      else navigate(`/product/${prod.id}`);
                    }}
                    className="relative aspect-square overflow-hidden rounded-2xl mb-4 bg-white border border-[#2D2926]/10 cursor-pointer"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-mono font-bold text-[#2D2926] shadow-sm">
                      {prod.badge}
                    </div>
                  </div>

                  <h3 
                    onClick={() => {
                      if (onDiscoverProduct) onDiscoverProduct(prod);
                      else navigate(`/product/${prod.id}`);
                    }}
                    className="font-display text-base font-bold text-[#2D2926] mb-1 group-hover:text-[#E05A7E] transition-colors cursor-pointer"
                  >
                    {prod.name}
                  </h3>
                  <div className="text-[11px] font-mono text-[#8C827A] mb-2 font-medium">
                    {prod.region} • {prod.altitude}
                  </div>

                  <p className="text-xs font-sans text-[#5E5854] line-clamp-2 leading-relaxed mb-4">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#2D2926]/10 space-y-3">
                  {/* Grind Selector */}
                  <div>
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#8C827A] block mb-1">
                      Select Grind Fineness
                    </label>
                    <select
                      value={selectedGrinds[prod.id] || 'Filter Fine (Brass Davarah)'}
                      onChange={(e) => handleGrindChange(prod.id, e.target.value)}
                      className="w-full rounded-xl bg-white border border-[#2D2926]/15 px-2.5 py-1.5 text-xs text-[#2D2926] font-sans font-medium focus:border-[#E05A7E] focus:outline-none"
                    >
                      <option value="Filter Fine (Brass Davarah)">Filter Fine (Brass Davarah)</option>
                      <option value="Medium Grind (Pour Over / Drip)">Medium Grind (Pour Over)</option>
                      <option value="Coarse Grind (French Press / Cold Brew)">Coarse (French Press)</option>
                      <option value="Whole Roasted Bean">Whole Roasted Bean</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-base font-bold text-[#2D2926]">
                      {prod.price}
                    </span>
                    <button
                      onClick={() => handleAddLotToCart(prod)}
                      className="rounded-xl bg-[#2D2926] text-white px-3.5 py-1.5 text-xs font-sans font-bold hover:bg-[#E05A7E] transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
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

      {/* 8. Direct Roastery Founder Commitment (Leo Coffee Warmth) */}
      <section className="py-14 px-6 md:px-12 bg-gradient-to-t from-white to-[#FAF7F5]">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#2D2926]/10 bg-white p-8 sm:p-12 shadow-sm text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F5DADF] text-[#2D2926] mb-4">
            <Heart className="h-5 w-5 text-[#E05A7E]" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2926] mb-3">
            The Founder's Personal Cup Guarantee.
          </h2>
          <p className="font-serif text-sm sm:text-base text-[#5E5854] leading-relaxed max-w-2xl mx-auto mb-6">
            “If your morning cup does not evoke the rich, aromatic comfort of a traditional South Indian 
            household, contact me directly. Every single tin of Noir Dakshin carries my personal dedication to this craft.”
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono font-bold text-[#2D2926] mb-6">
            <span>Priyanshu Singh • Founder</span>
            <span className="text-[#8C827A]">•</span>
            <a href="tel:+917977641125" className="text-[#E05A7E] hover:underline">+91 79776 41125</a>
            <span className="text-[#8C827A]">•</span>
            <a href="mailto:priyanshubipin2006@gmail.com" className="text-[#E05A7E] hover:underline">priyanshubipin2006@gmail.com</a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/collection')}
              className="px-6 py-2.5 rounded-full bg-[#2D2926] text-white text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#E05A7E] transition-all cursor-pointer shadow-sm"
            >
              Order Roastery-Fresh Coffee
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-2.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/15 text-[#2D2926] text-xs font-sans font-bold uppercase tracking-wider hover:bg-white transition-all cursor-pointer"
            >
              Roastery Map & Direct Desk
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeritagePage;
