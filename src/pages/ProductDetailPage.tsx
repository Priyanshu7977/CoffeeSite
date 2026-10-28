import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  ShieldCheck, 
  Coffee, 
  Mountain, 
  Layers, 
  Flame, 
  Check, 
  AlertTriangle,
  PackageCheck,
  Share2,
  Sparkles,
  Truck
} from 'lucide-react';
import { NOIR_PRODUCTS } from '../data/products';
import { useInventory } from '../hooks/useInventory';
import type { Product } from '../types';

interface ProductDetailPageProps {
  onAddToCart: (product: Product, grind: string, quantity?: number) => void;
  onOpenCart: () => void;
  cartCount: number;
  cartItems: Array<{ product: Product; quantity: number; grind: string }>;
}

const GRIND_OPTIONS = [
  { id: 'whole-bean', label: 'Whole Bean', desc: 'Preserves peak aromatics up to 90 days' },
  { id: 'brass-filter', label: 'South Indian Brass Filter', desc: 'Fine-medium chicory-ready grind' },
  { id: 'pour-over', label: 'Pour Over / V60', desc: 'Medium-fine grind for maximum clarity' },
  { id: 'french-press', label: 'French Press / Cold Brew', desc: 'Coarse grind for full-body immersion' },
  { id: 'espresso', label: '9-Bar Espresso', desc: 'Micro-fine grind for dense golden crema' },
];

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  onAddToCart,
  onOpenCart: _onOpenCart,
  cartCount: _cartCount,
  cartItems,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getStock, getStockStatus, checkAvailability } = useInventory();

  const product = NOIR_PRODUCTS.find((p) => p.id === id) || NOIR_PRODUCTS[0];
  const [selectedGrind, setSelectedGrind] = useState<string>('Whole Bean');
  const [quantity, setQuantity] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  // Check inventory for this product
  const currentStock = getStock(product.id);
  const stockStatus = getStockStatus(product.id);
  const inCartQty = cartItems
    .filter((item) => item.product.id === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const availability = checkAvailability(product.id, inCartQty, quantity);

  // Price calculations
  const unitPrice = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;
  const totalPriceFormatted = '₹' + (unitPrice * quantity).toLocaleString('en-IN');

  const handleQuantityChange = (delta: number) => {
    const next = quantity + delta;
    if (next < 1) return;
    if (next > availability.maxAddable) return;
    setQuantity(next);
  };

  const handleAddToCart = () => {
    if (!availability.available || availability.maxAddable <= 0) return;
    onAddToCart(product, selectedGrind, quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 2000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const relatedProducts = NOIR_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] pb-28 selection:bg-[#F5DADF] selection:text-[#2D2926]">
      {/* 1. Top Sub-Bar (Safely spaced below global floating Navbar with pt-24 sm:pt-28) */}
      <div className="pt-24 sm:pt-28 pb-4 px-4 sm:px-8 border-b border-[#2D2926]/10 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/collection')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/15 text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-2xs cursor-pointer active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Collection</span>
            </button>
            <span className="hidden sm:inline-block text-xs font-mono text-[#8C827A]">
              / LOT #{product.num} • {product.origin}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-[#2D2926]/15 hover:bg-neutral-100 text-[#2D2926] transition-colors relative cursor-pointer active:scale-95"
              title="Share micro-lot"
            >
              <Share2 className="h-4 w-4" />
              {isCopied && (
                <span className="absolute -bottom-8 right-0 text-[10px] bg-black text-white px-2.5 py-0.5 rounded shadow whitespace-nowrap z-30">
                  Copied!
                </span>
              )}
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 text-xs font-mono font-medium text-[#5E5854]">
              <span className={`h-2 w-2 rounded-full ${stockStatus === 'OUT_OF_STOCK' ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
              <span className="hidden sm:inline font-semibold">
                {stockStatus === 'OUT_OF_STOCK' ? 'OUT OF STOCK' : `${currentStock} TINS REMAINING`}
              </span>
              <span className="sm:hidden font-semibold">
                {stockStatus === 'OUT_OF_STOCK' ? 'SOLD OUT' : `${currentStock} LEFT`}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Product Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ================= LEFT COLUMN: Visuals, Agronomy & Brew Guide ================= */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28">
            {/* Product Image Frame */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-square w-full rounded-3xl overflow-hidden bg-neutral-900 border border-[#2D2926]/10 shadow-xl group">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-700"
              />
              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#FAF7F5] text-[11px] font-mono tracking-wider font-semibold">
                  LOT #{product.num}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#F5DADF] text-[#2D2926] text-[11px] font-bold tracking-tight shadow-md">
                  {product.badge}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-mono">
                  {product.year}
                </span>
              </div>

              {/* In-Stock Indicator */}
              <div className="absolute bottom-4 right-4">
                {stockStatus === 'OUT_OF_STOCK' ? (
                  <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <AlertTriangle className="h-3 w-3" /> Out of Stock
                  </span>
                ) : stockStatus === 'LOW_STOCK' ? (
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-mono text-xs font-bold shadow-lg">
                    Low Stock: {currentStock} Left
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-emerald-700 text-white font-mono text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Check className="h-3 w-3" /> In Stock ({currentStock} Units)
                  </span>
                )}
              </div>
            </div>

            {/* Terroir & Origin Micro-Cards Triad */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-white border border-[#2D2926]/10 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-[11px] text-[#8C827A] mb-0.5">
                  <Mountain className="h-3 w-3 text-[#E05A7E]" /> Altitude
                </div>
                <div className="font-mono text-xs font-bold text-[#2D2926] truncate">{product.altitude}</div>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#2D2926]/10 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-[11px] text-[#8C827A] mb-0.5">
                  <Layers className="h-3 w-3 text-[#E05A7E]" /> Process
                </div>
                <div className="font-mono text-xs font-bold text-[#2D2926] truncate">{product.process}</div>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#2D2926]/10 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-[11px] text-[#8C827A] mb-0.5">
                  <Flame className="h-3 w-3 text-[#E05A7E]" /> Roast
                </div>
                <div className="font-mono text-xs font-bold text-[#2D2926] truncate">{product.roastLevel}</div>
              </div>
            </div>

            {/* Master Roaster's Brew Recommendation (Directly in Left Column to eliminate empty space) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#2D2926]/10 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-[#E05A7E]">
                <Coffee className="h-4 w-4 shrink-0" />
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#2D2926]">
                  Master Roaster's Brew Calibration
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-[#5E5854]">
                {product.brewRecommendation}
              </p>
              <div className="pt-2 border-t border-[#2D2926]/5 flex items-center justify-between text-[10px] font-mono text-[#8C827A]">
                <span>Water Temp: 92°C — 94°C</span>
                <span>Rest 7 Days Post-Roast</span>
              </div>
            </div>

            {/* Roastery Craft Guarantee Pills */}
            <div className="p-3.5 rounded-2xl bg-white/70 border border-[#2D2926]/10 text-[11px] text-[#5E5854] space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Small 12kg convection drum roast in Indiranagar</span>
              </div>
              <div className="flex items-center gap-2">
                <PackageCheck className="h-3.5 w-3.5 text-[#E05A7E] shrink-0" />
                <span>Signed Single-Estate Terroir Certificate included</span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Specs, Cupping Metrics & Purchase Card ================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header: Origin & Title */}
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#8C827A] mb-1 flex items-center gap-1.5">
                <span>{product.origin}</span>
                <span>•</span>
                <span>{product.region}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight text-[#2D2926]">
                {product.name}
              </h1>

              {/* Price & Inclusions */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-display font-bold text-[#2D2926] tracking-tight">
                  {product.price}
                </span>
                <span className="text-xs text-[#8C827A] font-mono">
                  Numbered 250g nitrogen-sealed tin • All taxes included
                </span>
              </div>
            </div>

            {/* Flavor Profile Pill Tags */}
            <div className="flex flex-wrap gap-2">
              {product.notes.map((note, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-[#F3ECE7] border border-[#2D2926]/10 text-xs font-medium text-[#2D2926] flex items-center gap-1.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E05A7E]" />
                  {note}
                </span>
              ))}
            </div>

            {/* Terroir Story & Description */}
            <p className="text-sm sm:text-base leading-relaxed text-[#5E5854]">
              {product.description}
            </p>

            {/* Sensory Radar Cupping Metrics */}
            <div className="p-5 rounded-2xl bg-white border border-[#2D2926]/10 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#8C827A] font-bold">
                  Sensory Cupping Radar
                </h4>
                <span className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Q-Grader Calibrated
                </span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs font-medium text-[#2D2926] mb-1">
                    <span>Acidity (Crispness & Fruit Luster)</span>
                    <span className="font-mono">{product.acidity}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#FAF7F5] overflow-hidden">
                    <div
                      className="h-full bg-[#E05A7E] rounded-full transition-all duration-700"
                      style={{ width: `${product.acidity}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-[#2D2926] mb-1">
                    <span>Body (Syrup & Velvet Mouthfeel)</span>
                    <span className="font-mono">{product.body}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#FAF7F5] overflow-hidden">
                    <div
                      className="h-full bg-[#2D2926] rounded-full transition-all duration-700"
                      style={{ width: `${product.body}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-[#2D2926] mb-1">
                    <span>Sweetness (Natural Sucrose & Honey)</span>
                    <span className="font-mono">{product.sweetness}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#FAF7F5] overflow-hidden">
                    <div
                      className="h-full bg-[#c89658] rounded-full transition-all duration-700"
                      style={{ width: `${product.sweetness}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Grind Selector */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8C827A] font-bold mb-2">
                Select Grind Specification:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GRIND_OPTIONS.map((g) => {
                  const isSelected = selectedGrind === g.label;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGrind(g.label)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#2D2926] bg-[#2D2926] text-[#FAF7F5] shadow-md ring-1 ring-[#2D2926]'
                          : 'border-[#2D2926]/10 bg-white hover:border-[#2D2926]/30 text-[#2D2926]'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center justify-between">
                        <span>{g.label}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#F5DADF]" />}
                      </div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          isSelected ? 'text-[#FAF7F5]/75' : 'text-[#8C827A]'
                        }`}
                      >
                        {g.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ================= COMPLETE UNIFIED PURCHASE ACTION CARD ================= */}
            {/* Resolves empty space on the left and creates a balanced, conversion-focused purchasing box */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#2D2926]/15 shadow-md space-y-4">
              {/* Inventory Alert Banner if Low or Exhausted */}
              {availability.message && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>{availability.message}</span>
                </div>
              )}

              {/* Quantity & Order Subtotal Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2D2926]/10">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C827A] block font-bold">
                    Numbered Tin Allocation
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-display text-2xl font-bold text-[#2D2926]">
                      {totalPriceFormatted}
                    </span>
                    <span className="text-xs text-[#8C827A] font-mono">
                      ({quantity} × {product.price})
                    </span>
                  </div>
                </div>

                {/* Stepper Controller */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-mono text-[#8C827A] mr-1 hidden sm:inline">Qty:</span>
                  <div className="flex items-center border border-[#2D2926]/20 bg-[#FAF7F5] rounded-xl p-1 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1 || stockStatus === 'OUT_OF_STOCK'}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-[#2D2926] hover:bg-white disabled:opacity-30 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-xs text-[#2D2926]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= availability.maxAddable || stockStatus === 'OUT_OF_STOCK'}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-[#2D2926] hover:bg-white disabled:opacity-30 transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* High-Impact Add To Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!availability.available || availability.maxAddable <= 0}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
                  justAdded
                    ? 'bg-emerald-600 text-white'
                    : stockStatus === 'OUT_OF_STOCK'
                    ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed font-bold'
                    : 'bg-[#2D2926] text-[#FAF7F5] hover:bg-black hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Added to Cellar Cart!</span>
                  </>
                ) : stockStatus === 'OUT_OF_STOCK' ? (
                  <span>Micro-Lot Out of Stock</span>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 text-[#F5DADF]" />
                    <span>Add {quantity} {quantity > 1 ? 'Tins' : 'Tin'} to Cart • {totalPriceFormatted}</span>
                  </>
                )}
              </button>

              {/* Delivery & Security Guarantees */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#8C827A] pt-1 gap-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Free Express Courier across India</span>
                </span>
                <span className="font-mono text-[#E05A7E]">
                  Grind: {selectedGrind}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Companion Micro-Lots Carousel */}
        <section className="mt-20 pt-12 border-t border-[#2D2926]/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#2D2926]">
                Explore Companion Micro-Lots
              </h3>
              <p className="text-xs text-[#8C827A] mt-0.5">
                Discover complementary terroirs and acidity profiles across the Western Ghats
              </p>
            </div>
            <Link
              to="/collection"
              className="text-xs font-mono font-bold text-[#E05A7E] hover:underline"
            >
              View All 12 Micro-Lots →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                to={`/product/${rel.id}`}
                className="group p-4 rounded-2xl bg-white border border-[#2D2926]/10 hover:shadow-lg transition-all"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900 mb-3">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="font-mono text-[10px] text-[#E05A7E] font-bold">
                  LOT #{rel.num}
                </div>
                <h4 className="font-display font-bold text-sm text-[#2D2926] truncate">
                  {rel.name}
                </h4>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-[#8C827A] truncate text-[11px]">{rel.region}</span>
                  <span className="font-bold text-[#2D2926]">{rel.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* 4. Mobile Sticky Bottom Action Bar (Ensures seamless checkout on smartphones) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#2D2926]/10 p-3 px-4 flex items-center justify-between gap-3 shadow-[0_-10px_25px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={product.image}
            alt={product.name}
            className="h-10 w-10 rounded-xl object-cover border border-[#2D2926]/10 shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-display font-bold text-xs text-[#2D2926] truncate">{product.name}</h4>
            <div className="font-mono text-xs font-bold text-[#E05A7E]">{totalPriceFormatted}</div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!availability.available || availability.maxAddable <= 0}
          className="px-5 py-2.5 rounded-full bg-[#2D2926] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-sm disabled:opacity-50 cursor-pointer active:scale-95"
        >
          {justAdded ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-3.5 w-3.5 text-[#F5DADF]" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
