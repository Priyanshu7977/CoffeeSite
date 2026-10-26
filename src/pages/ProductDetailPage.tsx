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
  Share2
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
  onOpenCart,
  cartCount,
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
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 border-b border-[#2D2926]/10 px-4 sm:px-8 py-3.5 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/collection')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/15 text-xs font-semibold hover:bg-neutral-200 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Collection</span>
            </button>
            <span className="hidden sm:inline-block text-xs font-mono text-[#8C827A]">
              / LOT #{product.num}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-[#2D2926]/15 hover:bg-neutral-100 text-[#2D2926] transition-colors relative"
              title="Share lot"
            >
              <Share2 className="h-4 w-4" />
              {isCopied && (
                <span className="absolute -bottom-8 right-0 text-[10px] bg-black text-white px-2 py-0.5 rounded shadow">
                  Copied!
                </span>
              )}
            </button>
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2926] text-[#FAF7F5] text-xs font-bold hover:bg-black transition-colors"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="h-4 w-4 rounded-full bg-[#E05A7E] text-white text-[10px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Product Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Product Imagery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-3xl overflow-hidden bg-neutral-900 border border-[#2D2926]/10 shadow-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover object-center filter contrast-105"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[#FAF7F5] text-[11px] font-mono tracking-wider font-semibold">
                  LOT #{product.num}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#F5DADF] text-[#2D2926] text-[11px] font-bold tracking-tight shadow-md">
                  {product.badge}
                </span>
              </div>

              {/* Stock Watermark Badge on Image */}
              <div className="absolute bottom-4 right-4">
                {stockStatus === 'OUT_OF_STOCK' && (
                  <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <AlertTriangle className="h-3 w-3" /> Out of Stock
                  </span>
                )}
                {stockStatus === 'LOW_STOCK' && (
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-mono text-xs font-bold shadow-lg">
                    Vault Allocation: Only {currentStock} Left
                  </span>
                )}
                {stockStatus === 'IN_STOCK' && (
                  <span className="px-3 py-1 rounded-full bg-emerald-700 text-white font-mono text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Check className="h-3 w-3" /> In Stock ({currentStock} Units)
                  </span>
                )}
              </div>
            </div>

            {/* Terroir & Origin Quick Bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-[#2D2926]/10 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-xs text-[#8C827A] mb-1">
                  <Mountain className="h-3.5 w-3.5 text-[#E05A7E]" /> Altitude
                </div>
                <div className="font-mono text-xs font-bold text-[#2D2926]">{product.altitude}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#2D2926]/10 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-xs text-[#8C827A] mb-1">
                  <Layers className="h-3.5 w-3.5 text-[#E05A7E]" /> Process
                </div>
                <div className="font-mono text-xs font-bold text-[#2D2926] truncate">{product.process}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#2D2926]/10 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-xs text-[#8C827A] mb-1">
                  <Flame className="h-3.5 w-3.5 text-[#E05A7E]" /> Roast
                </div>
                <div className="font-mono text-xs font-bold text-[#2D2926] truncate">{product.roastLevel}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Purchasing & Specifications */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#8C827A] mb-1">
                {product.origin} • {product.region}
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-[#2D2926]">
                {product.name}
              </h1>

              {/* Price & Stock Indicator */}
              <div className="mt-4 flex items-baseline gap-4">
                <span className="text-3xl font-display font-bold text-[#2D2926] tracking-tight">
                  {product.price}
                </span>
                <span className="text-xs text-[#8C827A] font-mono">
                  Includes all custom roasting & tax
                </span>
              </div>

              {/* Flavor Profile Pill Tags */}
              <div className="mt-5 flex flex-wrap gap-2">
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

              {/* Description */}
              <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#5E5854]">
                {product.description}
              </p>

              {/* Sensory Radar Metrics */}
              <div className="mt-6 p-5 rounded-2xl bg-white border border-[#2D2926]/10 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#8C827A] font-bold">
                  Sensory Cupping Metrics
                </h4>
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
              <div className="mt-6">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8C827A] font-bold mb-2">
                  Select Grind Specification:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {GRIND_OPTIONS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGrind(g.label)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedGrind === g.label
                          ? 'border-[#2D2926] bg-[#2D2926] text-[#FAF7F5] shadow-md'
                          : 'border-[#2D2926]/10 bg-white hover:border-[#2D2926]/30 text-[#2D2926]'
                      }`}
                    >
                      <div className="text-xs font-bold">{g.label}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          selectedGrind === g.label ? 'text-[#FAF7F5]/75' : 'text-[#8C827A]'
                        }`}
                      >
                        {g.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Purchasing & Cart Action Bar */}
            <div className="mt-8 pt-6 border-t border-[#2D2926]/10 space-y-4">
              {/* Inventory Alert Banner if Low or Exhausted */}
              {availability.message && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>{availability.message}</span>
                </div>
              )}

              <div className="flex items-center gap-4">
                {/* Quantity Controller */}
                <div className="flex items-center border border-[#2D2926]/20 bg-white rounded-2xl p-1 shadow-sm">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1 || stockStatus === 'OUT_OF_STOCK'}
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-[#2D2926] hover:bg-neutral-100 disabled:opacity-30 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-mono font-bold text-sm text-[#2D2926]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= availability.maxAddable || stockStatus === 'OUT_OF_STOCK'}
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-[#2D2926] hover:bg-neutral-100 disabled:opacity-30 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add To Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!availability.available || availability.maxAddable <= 0}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    justAdded
                      ? 'bg-emerald-600 text-white'
                      : stockStatus === 'OUT_OF_STOCK'
                      ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                      : 'bg-[#2D2926] text-[#FAF7F5] hover:bg-black active:scale-[0.99]'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="h-4 w-4" /> Added to Allocation!
                    </>
                  ) : stockStatus === 'OUT_OF_STOCK' ? (
                    <>Out of Stock</>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      Add to Allocation • {product.price}
                    </>
                  )}
                </button>
              </div>

              {/* Ethics / Freshness Guarantee */}
              <div className="flex items-center justify-between text-[11px] text-[#8C827A] pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Roasted in small 12kg micro-batches
                </span>
                <span className="flex items-center gap-1">
                  <PackageCheck className="h-3.5 w-3.5 text-[#E05A7E]" /> Shipped with Origin Certificate
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Brew Recommendation Card */}
        <section className="mt-16 p-6 sm:p-8 rounded-3xl bg-white border border-[#2D2926]/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center text-[#E05A7E]">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#2D2926]">
                Master Roaster's Brew Recommendation
              </h3>
              <p className="text-xs text-[#8C827A]">
                Calibrated specifically for {product.name}
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-[#5E5854] max-w-3xl">
            {product.brewRecommendation}
          </p>
        </section>

        {/* Related Lots */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-xl text-[#2D2926]">
                Explore Companion Micro-Lots
              </h3>
              <p className="text-xs text-[#8C827A]">
                Discover complementary terroirs and acidity profiles
              </p>
            </div>
            <Link
              to="/collection"
              className="text-xs font-mono font-bold text-[#E05A7E] hover:underline"
            >
              View All 10 Lots →
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
    </div>
  );
};
