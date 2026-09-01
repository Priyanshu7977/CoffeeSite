import React, { useState } from 'react';
import { X, Sparkles, Check, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Product } from '../types';

interface ProductDetailOverlayProps {
  product: Product | null;
  onClose: () => void;
  onAddToCollection: (product: Product, grind: string) => void;
  isInCollection: boolean;
}

export const ProductDetailOverlay: React.FC<ProductDetailOverlayProps> = ({
  product,
  onClose,
  onAddToCollection,
  isInCollection,
}) => {
  const [selectedGrind, setSelectedGrind] = useState<string>('Whole Bean');
  const [isAddedLocal, setIsAddedLocal] = useState<boolean>(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCollection(product, selectedGrind);
    setIsAddedLocal(true);

    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#c89658', '#e5b877', '#f4eee6', '#2b221c'],
      });
    } catch {
      // Ignored
    }

    setTimeout(() => {
      setIsAddedLocal(false);
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-y-auto">
      {/* Dark Ambient Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#070605]/92 backdrop-blur-2xl transition-opacity duration-300"
      />

      {/* Full-screen Luxury Detail Modal */}
      <div className="relative z-10 w-full max-w-5xl rounded-3xl bg-[#0f0c09] border border-[#c89658]/40 p-6 sm:p-10 lg:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.95)] text-[#f4eee6] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#2b221a] bg-[#14100c] text-[#8c827a] hover:border-[#c89658] hover:text-[#f4eee6] transition-all cursor-pointer shadow-lg"
          aria-label="Close Product Overlay"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Product Visual & Package Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-[#c89658]/40 shadow-2xl group">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover object-center filter brightness-90 contrast-110 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070605]/90 via-transparent to-transparent pointer-events-none" />

              {/* Product Badge Tag */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-[#070605]/80 px-3.5 py-1 text-[10px] font-sans tracking-[0.2em] text-[#e5b877] uppercase border border-[#c89658]/30 backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-[#c89658]" />
                <span>{product.badge}</span>
              </div>

              {/* Bottom Specs HUD */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-[#090705]/90 p-3 backdrop-blur-md border border-[#c89658]/25 text-xs">
                <span className="font-mono text-[#c89658] font-bold">
                  {product.num} / 05
                </span>
                <span className="font-sans text-[#a89d93]">
                  {product.origin}
                </span>
                <span className="font-mono text-[#e5b877] font-bold">
                  {product.price}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: In-Depth Editorial Story & Collection Action */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs tracking-[0.3em] text-[#c89658] uppercase">
                  {product.num} • {product.year}
                </span>
                <span className="h-[1px] w-8 bg-[#c89658]/40" />
                <span className="text-[11px] font-sans tracking-[0.2em] text-[#8c827a] uppercase">
                  {product.roastLevel}
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#f4eee6] font-normal tracking-tight mb-3">
                {product.name}
              </h2>

              <span className="text-xs font-sans tracking-[0.2em] text-[#e5b877] uppercase block mb-4">
                {product.origin} — {product.region} • {product.altitude}
              </span>

              <p className="font-sans text-xs sm:text-sm text-[#b5aaa0] font-light leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Flavor Profile Badges */}
              <div className="mb-6">
                <span className="text-[10px] font-sans tracking-[0.25em] text-[#8c827a] uppercase block mb-2">
                  Cupping Tasting Notes
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.notes.map((note) => (
                    <span
                      key={note}
                      className="px-3 py-1.5 rounded-lg bg-[#14100c] border border-[#261f19] text-xs font-sans text-[#e5b877]"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sensory Meters */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#080605] border border-[#221c17] mb-6">
                <div>
                  <div className="flex justify-between text-[10px] font-sans uppercase text-[#8c827a] mb-1">
                    <span>Acidity</span>
                    <span className="font-mono text-[#f4eee6]">{product.acidity}%</span>
                  </div>
                  <div className="h-1 bg-[#1a140f] rounded-full overflow-hidden">
                    <div className="h-full bg-[#c89658] rounded-full" style={{ width: `${product.acidity}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-sans uppercase text-[#8c827a] mb-1">
                    <span>Body</span>
                    <span className="font-mono text-[#f4eee6]">{product.body}%</span>
                  </div>
                  <div className="h-1 bg-[#1a140f] rounded-full overflow-hidden">
                    <div className="h-full bg-[#c89658] rounded-full" style={{ width: `${product.body}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-sans uppercase text-[#8c827a] mb-1">
                    <span>Sweetness</span>
                    <span className="font-mono text-[#f4eee6]">{product.sweetness}%</span>
                  </div>
                  <div className="h-1 bg-[#1a140f] rounded-full overflow-hidden">
                    <div className="h-full bg-[#c89658] rounded-full" style={{ width: `${product.sweetness}%` }} />
                  </div>
                </div>
              </div>

              {/* Brewing Recommendation */}
              <div className="p-3.5 rounded-xl bg-[#14100c] border border-[#221c17] flex items-start gap-2.5 mb-6">
                <Coffee className="h-4 w-4 text-[#c89658] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-sans tracking-[0.2em] text-[#8c827a] uppercase block">
                    Atelier Brew Recommendation
                  </span>
                  <p className="font-serif italic text-xs text-[#f4eee6]">
                    {product.brewRecommendation}
                  </p>
                </div>
              </div>

              {/* Grind Selector */}
              <div className="mb-6">
                <span className="text-[10px] font-sans tracking-[0.2em] text-[#8c827a] uppercase block mb-2">
                  Select Grind Preparation
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {['Whole Bean', 'Espresso (Fine)', 'Filter / Chemex'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGrind(g)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-sans tracking-wide border transition-all cursor-pointer text-center ${
                        selectedGrind === g
                          ? 'bg-[#c89658] border-[#c89658] text-[#070605] font-bold shadow-md'
                          : 'bg-[#120e0b] border-[#221c17] text-[#a89d93] hover:border-[#c89658]/40'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action: Add to Collection */}
            <div className="pt-4 border-t border-[#221c17] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-sans tracking-[0.2em] text-[#8c827a] uppercase block">
                  Numbered 250g Tin
                </span>
                <span className="font-mono text-2xl font-bold text-[#f4eee6]">
                  {product.price}
                </span>
              </div>

              <button
                onClick={handleAdd}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-sans text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
                  isAddedLocal || isInCollection
                    ? 'bg-[#e5b877] text-[#070605] shadow-[0_0_25px_rgba(200,150,88,0.4)]'
                    : 'bg-[#c89658] text-[#070605] hover:bg-[#e5b877] hover:shadow-[0_0_20px_rgba(200,150,88,0.3)]'
                }`}
              >
                {isAddedLocal || isInCollection ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>In Your Collection</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Add to Collection</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
