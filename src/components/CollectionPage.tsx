import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Sparkles, 
  Search, 
  Check, 
  SlidersHorizontal,
  Compass,
  Coffee,
  ShieldCheck,
  User
} from 'lucide-react';
import { NOIR_PRODUCTS } from '../data/products';
import { MagneticButton } from './MagneticButton';
import type { Product } from '../types';
import type { UserSession } from './LoginModal';

interface CollectionPageProps {
  onBackToHome: () => void;
  onDiscoverProduct: (product: Product) => void;
  onAddToCart: (product: Product, grind: string) => void;
  onOpenCart: () => void;
  cartCount: number;
  onOpenLogin: () => void;
  userSession: UserSession | null;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  onBackToHome,
  onDiscoverProduct,
  onAddToCart,
  onOpenCart,
  cartCount,
  onOpenLogin,
  userSession,
}) => {
  const [selectedRoastFilter, setSelectedRoastFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'acidity'>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 'Whole Bean');
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1800);
  };

  const filteredProducts = useMemo(() => {
    return NOIR_PRODUCTS.filter((product) => {
      // Roast filter
      if (selectedRoastFilter === 'light' && !product.roastLevel.toLowerCase().includes('light')) {
        return false;
      }
      if (selectedRoastFilter === 'medium' && !product.roastLevel.toLowerCase().includes('medium')) {
        return false;
      }
      if (selectedRoastFilter === 'dark' && !product.roastLevel.toLowerCase().includes('dark') && !product.roastLevel.toLowerCase().includes('noir')) {
        return false;
      }
      if (selectedRoastFilter === 'reserve' && !product.badge.toLowerCase().includes('reserve') && !product.badge.toLowerCase().includes('heritage')) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesOrigin = product.origin.toLowerCase().includes(q);
        const matchesRegion = product.region.toLowerCase().includes(q);
        const matchesNotes = product.notes.some((n) => n.toLowerCase().includes(q));
        if (!matchesName && !matchesOrigin && !matchesRegion && !matchesNotes) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
      const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'acidity') return b.acidity - a.acidity;
      return 0; // featured natural order
    });
  }, [selectedRoastFilter, sortBy, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] pb-24">
      {/* Top Fixed Collection Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 border-b border-[#2D2926]/10 px-3 sm:px-8 py-2.5 sm:py-3.5 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <MagneticButton strength={0.3}>
              <button
                onClick={onBackToHome}
                className="flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-[#5E5854] hover:text-[#2D2926] transition-colors cursor-pointer py-1.5 px-2.5 sm:px-3 rounded-full hover:bg-[#FAF7F5] border border-transparent hover:border-[#2D2926]/10 whitespace-nowrap active:scale-95"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-[#E05A7E]" />
                <span className="hidden sm:inline">Back to Story</span>
                <span className="sm:hidden">Back</span>
              </button>
            </MagneticButton>

            <div className="h-4 w-[1px] bg-[#2D2926]/10 hidden sm:block" />

            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#2D2926] text-white">
                <span className="font-display text-[10px] font-bold">N</span>
              </div>
              <span className="font-display text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-bold text-[#2D2926] uppercase truncate max-w-[130px] sm:max-w-none">
                <span className="hidden sm:inline">THE ATELIER COLLECTION</span>
                <span className="sm:hidden">ATELIER</span>
              </span>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              onClick={onOpenLogin}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 sm:px-3.5 py-1.5 text-[10px] sm:text-[11px] font-sans tracking-[0.1em] sm:tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer ${
                userSession?.isLoggedIn
                  ? 'border-[#E05A7E] bg-[#F5DADF] text-[#2D2926] font-bold'
                  : 'border-[#2D2926]/15 bg-[#FAF7F5] text-[#2D2926] hover:bg-[#F5DADF]/40'
              }`}
            >
              {userSession?.isLoggedIn ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2D2926]" />
                  <span className="max-w-[60px] sm:max-w-[80px] truncate font-bold">{userSession.name.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <User className="h-3.5 w-3.5 text-[#5E5854]" />
                  <span className="hidden sm:inline font-bold">VIP Pass</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenCart}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 sm:px-3.5 py-1.5 text-[10px] sm:text-[11px] font-sans tracking-[0.1em] sm:tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer ${
                cartCount > 0
                  ? 'border-[#2D2926]/15 bg-[#F5DADF] text-[#2D2926] font-bold shadow-sm'
                  : 'border-[#2D2926]/15 bg-[#FAF7F5] text-[#2D2926] hover:bg-[#F5DADF]/40'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#2D2926]" />
              <span>({cartCount.toString().padStart(2, '0')})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Collection Header */}
      <section className="relative px-4 sm:px-8 md:px-12 pt-6 sm:pt-10 pb-6 border-b border-[#2D2926]/10 bg-[#FAF7F5]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5DADF] border border-[#2D2926]/10 text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#2D2926] mb-2.5">
                <Sparkles className="h-3.5 w-3.5 text-[#E05A7E]" />
                <span>10 SINGLE-ESTATE HARVESTS • 250G MICRO-TINS</span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2D2926]">
                Single-Origin <span className="italic text-[#E05A7E]">Curations.</span>
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#5E5854] max-w-2xl mt-1.5 leading-relaxed font-normal">
                Shade-grown under native canopies in Chikmagalur, Coorg, Nilgiris, and Araku. Roast-profiled in small batches and nitrogen-sealed at peak aroma.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 bg-white border border-[#2D2926]/10 rounded-2xl p-2.5 sm:p-4 shadow-sm self-start md:self-auto">
              <div>
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#8C827A] block font-bold">Showing</span>
                <span className="font-display text-base sm:text-xl font-bold text-[#2D2926]">
                  {filteredProducts.length} of {NOIR_PRODUCTS.length} Lots
                </span>
              </div>
              <div className="h-7 sm:h-8 w-[1px] bg-[#2D2926]/10" />
              <div>
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#8C827A] block font-bold">Dispatch</span>
                <span className="font-display text-xs sm:text-sm font-bold text-[#E05A7E]">Free Across India</span>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="mt-6 pt-5 border-t border-[#2D2926]/10 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
            {/* Roast Level Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none w-full lg:w-auto">
              {[
                { id: 'all', label: 'All 10 Lots' },
                { id: 'light', label: 'Light Roast' },
                { id: 'medium', label: 'Medium Roast' },
                { id: 'dark', label: 'Dark Roast' },
                { id: 'reserve', label: 'Reserve' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedRoastFilter(tab.id)}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-sans tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                    selectedRoastFilter === tab.id
                      ? 'bg-[#2D2926] text-white shadow-sm'
                      : 'bg-white border border-[#2D2926]/10 text-[#5E5854] hover:text-[#2D2926] hover:bg-[#F5DADF]/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search & Sort Cluster */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              {/* Search Box */}
              <div className="relative flex items-center flex-1 sm:flex-initial">
                <Search className="absolute left-3.5 h-3.5 w-3.5 text-[#8C827A]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lot or tasting note..."
                  className="w-full sm:w-60 rounded-full bg-white border border-[#2D2926]/15 pl-9 pr-4 py-2 text-xs font-sans text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none"
                />
              </div>

              {/* Sort Select */}
              <div className="flex items-center gap-2 bg-white border border-[#2D2926]/15 rounded-full px-3 py-1.5 shadow-sm">
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#E05A7E] shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-transparent text-xs font-sans font-bold text-[#2D2926] focus:outline-none cursor-pointer w-full sm:w-auto"
                >
                  <option value="featured">Featured Lots</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="acidity">Highest Acidity</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10-Product Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#2D2926]/10 p-8">
            <Coffee className="h-10 w-10 text-[#E05A7E] mx-auto mb-3" />
            <h3 className="font-display text-xl font-bold text-[#2D2926]">No Coffee Lots Match Your Filter</h3>
            <p className="font-sans text-xs text-[#5E5854] mt-1">Try selecting a different roast level or clearing your search term.</p>
            <button
              onClick={() => {
                setSelectedRoastFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-6 py-2.5 rounded-full bg-[#2D2926] text-white text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const isJustAdded = addedProductId === product.id;

              return (
                <div
                  key={product.id}
                  onClick={() => onDiscoverProduct(product)}
                  className="group rounded-3xl bg-white border border-[#2D2926]/10 p-5 shadow-[0_15px_40px_rgba(45,41,38,0.04)] hover:shadow-[0_20px_50px_rgba(45,41,38,0.12)] transition-all duration-500 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                >
                  <div>
                    {/* Visual Card Image */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[#2D2926]/10 bg-[#FAF7F5] mb-5">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover object-center filter brightness-100 transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Roast Badge */}
                      <div className="absolute top-3 left-3 rounded-full bg-[#F5DADF] px-3 py-1 border border-[#2D2926]/10 text-[10px] font-mono text-[#2D2926] font-bold shadow-sm">
                        {product.roastLevel}
                      </div>

                      {/* Altitude Tag */}
                      <div className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-1 border border-[#2D2926]/10 text-[10px] font-mono text-[#5E5854] font-semibold shadow-sm">
                        {product.altitude}
                      </div>

                      {/* Badge Pill */}
                      <div className="absolute bottom-3 left-3 rounded-full bg-[#2D2926]/90 backdrop-blur-md text-white px-2.5 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider">
                        {product.badge}
                      </div>
                    </div>

                    {/* Origin & Region */}
                    <div className="flex items-center gap-1.5 text-xs font-sans text-[#E05A7E] font-bold uppercase tracking-wider mb-1.5">
                      <Compass className="h-3.5 w-3.5 text-[#E05A7E]" />
                      <span>{product.origin}</span>
                    </div>

                    {/* Name */}
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2D2926] tracking-tight mb-2 group-hover:text-[#E05A7E] transition-colors">
                      {product.name}
                    </h3>

                    {/* Tasting Notes */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {product.notes.map((note) => (
                        <span
                          key={note}
                          className="px-2.5 py-0.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 text-[11px] font-sans font-medium text-[#5E5854]"
                        >
                          {note}
                        </span>
                      ))}
                    </div>

                    {/* Short Description */}
                    <p className="font-sans text-xs text-[#5E5854] leading-relaxed line-clamp-2 mb-4">
                      {product.description}
                    </p>

                    {/* Radar Profile Meters */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[#2D2926]/10 mb-4 text-center">
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C827A] block font-bold">Acidity</span>
                        <div className="w-full bg-[#FAF7F5] h-1.5 rounded-full mt-1 overflow-hidden border border-[#2D2926]/10">
                          <div className="bg-[#E05A7E] h-full rounded-full" style={{ width: `${product.acidity}%` }} />
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C827A] block font-bold">Body</span>
                        <div className="w-full bg-[#FAF7F5] h-1.5 rounded-full mt-1 overflow-hidden border border-[#2D2926]/10">
                          <div className="bg-[#2D2926] h-full rounded-full" style={{ width: `${product.body}%` }} />
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C827A] block font-bold">Sweetness</span>
                        <div className="w-full bg-[#FAF7F5] h-1.5 rounded-full mt-1 overflow-hidden border border-[#2D2926]/10">
                          <div className="bg-[#F5DADF] border border-[#2D2926]/20 h-full rounded-full" style={{ width: `${product.sweetness}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Price & Quick Action */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#8C827A] block font-bold">Numbered Tin</span>
                      <span className="font-display text-2xl font-bold text-[#2D2926]">
                        {product.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                          isJustAdded
                            ? 'bg-[#F5DADF] text-[#2D2926]'
                            : 'bg-[#2D2926] text-white hover:bg-[#1F1C1A] hover:scale-105'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[#E05A7E]" />
                            <span>In Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span>Quick Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default CollectionPage;