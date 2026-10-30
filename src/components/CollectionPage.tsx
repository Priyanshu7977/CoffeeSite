import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Sparkles, 
  Search, 
  Check, 
  SlidersHorizontal,
  Compass,
  Coffee,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { NOIR_PRODUCTS } from '../data/products';
import { MagneticButton } from './MagneticButton';
import { useInventory } from '../hooks/useInventory';
import { useWishlist } from '../utils/wishlist';
import { gsap } from '../utils/animations';
import { SeoHead } from './SeoHead';
import { Breadcrumbs } from './Breadcrumbs';
import { CoffeeKnowledgeFaq } from './CoffeeKnowledgeFaq';
import type { Product } from '../types';
import type { UserSession } from './LoginModal';

interface CollectionPageProps {
  onBackToHome: () => void;
  onDiscoverProduct: (product: Product) => void;
  onAddToCart: (product: Product, grind: string) => void;
  onOpenCart?: () => void;
  cartCount?: number;
  onOpenLogin?: () => void;
  userSession?: UserSession | null;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  onBackToHome,
  onDiscoverProduct,
  onAddToCart,
  onOpenCart: _onOpenCart,
  cartCount: _cartCount,
  onOpenLogin: _onOpenLogin,
  userSession: _userSession,
}) => {
  const [selectedRoastFilter, setSelectedRoastFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'acidity'>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const { getStock } = useInventory();
  const { isWishlisted, toggle: toggleWishlist, wishlist } = useWishlist();


  // Animation Refs
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const heroBadgeRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroDescRef = useRef<HTMLParagraphElement>(null);
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // GSAP Initial Landing Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (heroBadgeRef.current) {
        tl.fromTo(
          heroBadgeRef.current,
          { opacity: 0, y: 22, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65, delay: 0.1 }
        );
      }

      if (heroTitleRef.current) {
        tl.fromTo(
          heroTitleRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' },
          '-=0.4'
        );
      }

      if (heroDescRef.current) {
        tl.fromTo(
          heroDescRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5'
        );
      }

      if (heroStatsRef.current) {
        tl.fromTo(
          heroStatsRef.current,
          { opacity: 0, y: 20, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65 },
          '-=0.5'
        );
      }

      if (filterBarRef.current) {
        tl.fromTo(
          filterBarRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.35'
        );
      }

      if (gridContainerRef.current && gridContainerRef.current.children.length) {
        tl.fromTo(
          gridContainerRef.current.children,
          { opacity: 0, y: 45, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.07,
            ease: 'power3.out',
          },
          '-=0.3'
        );
      }
    }, pageContainerRef);

    return () => ctx.revert();
  }, []);

  // Smooth Stagger Cascade when filter or search changes
  useEffect(() => {
    if (!gridContainerRef.current || !gridContainerRef.current.children.length) return;
    gsap.fromTo(
      gridContainerRef.current.children,
      { opacity: 0, y: 20, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.04, ease: 'power2.out' }
    );
  }, [selectedRoastFilter, sortBy, searchQuery]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const stock = getStock(product.id);
    if (stock <= 0) return;

    onAddToCart(product, 'Whole Bean');
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1800);
  };

  const filteredProducts = useMemo(() => {
    return NOIR_PRODUCTS.filter((product) => {
      // Roast filter
      if (selectedRoastFilter === 'saved' && !wishlist.includes(product.id)) {
        return false;
      }
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
  }, [selectedRoastFilter, sortBy, searchQuery, wishlist]);

  const breadcrumbs = useMemo(() => [
    { name: 'Reserve Collection', url: '/collection' }
  ], []);

  const collectionJsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'NOIR ROAST Single-Estate Coffee Micro-Lots',
    description: 'Artisanal shade-grown South Indian specialty coffee collection',
    numberOfItems: NOIR_PRODUCTS.length,
    itemListElement: NOIR_PRODUCTS.map((prod, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: prod.name,
      url: `https://coffee-site-ivory.vercel.app/product/${prod.id}`,
    })),
  }), []);

  return (
    <div ref={pageContainerRef} className="min-h-screen bg-[#FAF7F5] text-[#2D2926] pb-24 relative overflow-hidden">
      <SeoHead
        title="Reserve Coffee Collection"
        description="Explore 8 single-estate South Indian specialty coffee micro-lots from Chikmagalur, Coorg, Nilgiris, Malabar Coast, and Araku Valley. Roasted fresh in Bengaluru."
        canonical="/collection"
        keywords="specialty coffee collection, buy single estate coffee beans, filter kaapi roasts, chikmagalur arabica, malabar monsooned espresso, peaberry coffee beans"
        ogType="website"
        breadcrumbs={breadcrumbs}
        jsonLd={collectionJsonLd}
      />
      {/* Warm Ambient Glow Landing Accents */}
      <div className="absolute top-8 right-1/4 w-[420px] h-[420px] bg-[#C89658]/8 rounded-full blur-3xl pointer-events-none animate-pulseGlow" />
      <div className="absolute top-28 left-6 w-[360px] h-[360px] bg-[#F5DADF]/40 rounded-full blur-3xl pointer-events-none animate-floatSoft" />

      {/* Sub-Header (Safely positioned below global Navbar) */}
      <div className="pt-[max(calc(env(safe-area-inset-top)+5.25rem),6.5rem)] sm:pt-28 md:pt-32 pb-3.5 sm:pb-4 px-3 sm:px-8 border-b border-[#2D2926]/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-2 sm:gap-4 animate-fadeIn">
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
                <span className="hidden sm:inline">COFFEE COLLECTION</span>
                <span className="sm:hidden">COFFEES</span>
              </span>
            </div>
          </div>

          {/* Right Status Badge (Global Navbar handles VIP & Cart) */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 text-[10px] sm:text-[11px] font-mono font-semibold text-[#5E5854]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="hidden min-[380px]:inline">12 SINGLE-ORIGIN LOTS</span>
              <span className="min-[380px]:hidden">12 LOTS</span>
            </span>
          </div>
        </div>
      </div>

      {/* Hero Collection Header */}
      <section className="relative px-4 sm:px-8 md:px-12 pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12 border-b border-[#2D2926]/10 bg-gradient-to-b from-white to-[#FAF7F5]">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs items={breadcrumbs} className="mb-4" />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div>
              <div 
                ref={heroBadgeRef}
                className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#F5DADF] border border-[#2D2926]/10 text-[9.5px] sm:text-xs font-mono font-bold uppercase tracking-[0.14em] sm:tracking-[0.2em] text-[#2D2926] mb-4 sm:mb-5 shadow-2xs hover:scale-105 transition-transform duration-300 max-w-full"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#E05A7E] shrink-0" />
                <span className="hidden sm:inline">12 SINGLE-ESTATE HARVESTS • 250G MICRO-TINS</span>
                <span className="sm:hidden">12 SINGLE-ESTATE HARVESTS</span>
              </div>
              <h1 
                ref={heroTitleRef}
                className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#2D2926] mb-3 sm:mb-4"
              >
                Single-Origin <span className="italic text-[#E05A7E]">Curations.</span>
              </h1>
              <p 
                ref={heroDescRef}
                className="font-sans text-sm sm:text-base text-[#5E5854] max-w-2xl leading-relaxed mb-4 sm:mb-6 font-normal"
              >
                Shade-grown under native canopies in Chikmagalur, Coorg, Nilgiris, and Araku. Roast-profiled in small batches and nitrogen-sealed at peak aroma.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div 
              ref={heroStatsRef}
              className="flex items-center gap-3 bg-white border border-[#2D2926]/10 rounded-2xl p-3 shadow-xs self-start md:self-auto hover:shadow-md transition-shadow duration-300 mb-2 md:mb-6"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] block font-bold">Showing</span>
                <span className="font-display text-sm sm:text-base font-bold text-[#2D2926]">
                  {filteredProducts.length} of {NOIR_PRODUCTS.length} Lots
                </span>
              </div>
              <div className="h-7 w-[1px] bg-[#2D2926]/10" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] block font-bold">Dispatch</span>
                <span className="font-display text-xs sm:text-sm font-bold text-[#E05A7E] flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E05A7E] animate-ping" />
                  Free Across India
                </span>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div 
            ref={filterBarRef}
            className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#2D2926]/10 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4"
          >
            {/* Roast Level Filter Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none w-full lg:w-auto">
              {[
                { id: 'all', label: 'All 12 Lots' },
                { id: 'saved', label: `Saved (${wishlist.length})` },
                { id: 'light', label: 'Light Roast' },
                { id: 'medium', label: 'Medium Roast' },
                { id: 'dark', label: 'Dark Roast' },
                { id: 'reserve', label: 'Reserve' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedRoastFilter(tab.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-sans tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
              {/* Search Box */}
              <div className="relative flex items-center flex-1 sm:flex-initial">
                <Search className="absolute left-3.5 h-3.5 w-3.5 text-[#8C827A]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lot or tasting note..."
                  className="w-full sm:w-60 rounded-full bg-white border border-[#2D2926]/15 pl-9 pr-4 py-2 text-xs font-sans text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none shadow-2xs"
                />
              </div>

              {/* Sort Select */}
              <div className="flex items-center gap-1.5 bg-white border border-[#2D2926]/15 rounded-full px-3.5 py-1.5 shadow-2xs">
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#E05A7E] shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-transparent text-xs font-sans font-bold text-[#2D2926] focus:outline-none cursor-pointer w-full sm:w-auto py-0.5"
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

      {/* 12-Product Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#2D2926]/10 p-8">
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
          <div ref={gridContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredProducts.map((product) => {
              const isJustAdded = addedProductId === product.id;
              const stock = getStock(product.id);

              return (
                <div
                  key={product.id}
                  onClick={() => onDiscoverProduct(product)}
                  className="group rounded-2xl sm:rounded-3xl bg-white border border-[#2D2926]/10 p-4 sm:p-4.5 shadow-[0_15px_40px_rgba(45,41,38,0.04)] hover:shadow-[0_22px_55px_rgba(45,41,38,0.13)] transition-shadow duration-400 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
                >
                  <div>
                    {/* Visual Card Image */}
                    <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-[#2D2926]/10 bg-[#FAF7F5] mb-3 sm:mb-3.5">
                      <img
                        src={product.image}
                        alt={`${product.name} - ${product.origin} ${product.roastLevel} single-estate coffee beans`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-center filter brightness-100 transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Roast Badge */}
                      <div className="absolute top-2.5 left-2.5 rounded-full bg-[#F5DADF] px-2.5 py-0.5 border border-[#2D2926]/10 text-[9px] sm:text-[10px] font-mono text-[#2D2926] font-bold shadow-sm">
                        {product.roastLevel}
                      </div>

                      {/* Wishlist Heart Toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className={`absolute top-2.5 right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border transition-all cursor-pointer shadow-sm active:scale-90 ${
                          isWishlisted(product.id)
                            ? 'bg-rose-50 border-rose-300 text-rose-600'
                            : 'bg-white/90 backdrop-blur-md border-[#2D2926]/15 text-[#8C827A] hover:text-[#2D2926]'
                        }`}
                        title={isWishlisted(product.id) ? 'Remove from Saved Micro-Lots' : 'Save Micro-Lot'}
                        aria-label="Save to wishlist"
                      >
                        <Heart className={`h-3.5 w-3.5 ${isWishlisted(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>

                      {/* Badge Pill */}
                      <div className="absolute bottom-2.5 left-2.5 rounded-full bg-[#2D2926]/90 backdrop-blur-md text-white px-2 py-0.5 text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-wider">
                        {product.badge}
                      </div>

                      {/* Altitude Tag */}
                      <div className="absolute bottom-2.5 right-2.5 rounded-full bg-white/95 backdrop-blur-md px-2 py-0.5 border border-[#2D2926]/10 text-[9px] sm:text-[10px] font-mono text-[#5E5854] font-semibold shadow-sm">
                        {product.altitude}
                      </div>
                    </div>

                    {/* Origin & Region */}
                    <div className="flex items-center gap-1 text-[11px] font-sans text-[#E05A7E] font-bold uppercase tracking-wider mb-1">
                      <Compass className="h-3 w-3 text-[#E05A7E]" />
                      <span>{product.origin}</span>
                    </div>

                    {/* Name */}
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[#2D2926] tracking-tight mb-1.5 group-hover:text-[#E05A7E] transition-colors truncate">
                      {product.name}
                    </h3>

                    {/* Tasting Notes */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {product.notes.map((note) => (
                        <span
                          key={note}
                          className="px-2 py-0.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 text-[10px] sm:text-[11px] font-sans font-medium text-[#5E5854]"
                        >
                          {note}
                        </span>
                      ))}
                    </div>

                    {/* Short Description */}
                    <p className="font-sans text-[11px] sm:text-xs text-[#5E5854] leading-relaxed line-clamp-2 mb-2.5">
                      {product.description}
                    </p>

                    {/* Radar Profile Meters */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-[#2D2926]/10 mb-3 text-center">
                      <div>
                        <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-[#8C827A] block font-bold">Acidity</span>
                        <div className="w-full bg-[#FAF7F5] h-1.5 rounded-full mt-0.5 overflow-hidden border border-[#2D2926]/10">
                          <div className="bg-[#E05A7E] h-full rounded-full" style={{ width: `${product.acidity}%` }} />
                        </div>
                      </div>
                      <div>
                        <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-[#8C827A] block font-bold">Body</span>
                        <div className="w-full bg-[#FAF7F5] h-1.5 rounded-full mt-0.5 overflow-hidden border border-[#2D2926]/10">
                          <div className="bg-[#2D2926] h-full rounded-full" style={{ width: `${product.body}%` }} />
                        </div>
                      </div>
                      <div>
                        <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-[#8C827A] block font-bold">Sweetness</span>
                        <div className="w-full bg-[#FAF7F5] h-1.5 rounded-full mt-0.5 overflow-hidden border border-[#2D2926]/10">
                          <div className="bg-[#F5DADF] border border-[#2D2926]/20 h-full rounded-full" style={{ width: `${product.sweetness}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Price & Quick Action */}
                  <div className="flex items-center justify-between gap-2 pt-1.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-[#8C827A] block font-bold">
                          Numbered Tin
                        </span>
                        {stock > 0 && stock <= 3 && (
                          <span className="text-[8px] sm:text-[9px] font-mono font-bold text-amber-600 bg-amber-50 px-1 py-0.2 rounded">
                            {stock} Left
                          </span>
                        )}
                      </div>
                      <span className="font-display text-xl sm:text-2xl font-bold text-[#2D2926]">
                        {product.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/product/${product.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border border-[#2D2926]/15 text-[11px] font-bold text-[#2D2926] hover:bg-neutral-100 transition-colors"
                      >
                        Details
                      </Link>

                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        disabled={stock <= 0}
                        className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                          stock <= 0
                            ? 'bg-neutral-100 text-neutral-500 border border-neutral-300 cursor-not-allowed font-bold'
                            : isJustAdded
                            ? 'bg-[#F5DADF] text-[#2D2926]'
                            : 'bg-[#2D2926] text-white hover:bg-[#1F1C1A] hover:scale-105'
                        }`}
                      >
                        {stock <= 0 ? (
                          <span>Out of Stock</span>
                        ) : isJustAdded ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[#E05A7E]" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-3.5 w-3.5 text-[#F5DADF]" />
                            <span>Add</span>
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

      {/* Authoritative AEO/AIO Terroir & Brewing Knowledge FAQ */}
      <div className="border-t border-[#2D2926]/10 mt-16 bg-white/50 backdrop-blur-sm">
        <CoffeeKnowledgeFaq />
      </div>
    </div>
  );
};

export default CollectionPage;