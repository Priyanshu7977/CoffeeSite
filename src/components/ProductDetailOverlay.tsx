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
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F5DADF', '#E05A7E', '#2D2926', '#FFFFFF'],
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
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#2D2926]/60 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-4xl rounded-3xl bg-white border border-[#2D2926]/10 p-6 sm:p-10 shadow-2xl text-[#2D2926] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#2D2926]/10 bg-[#FAF7F5] text-[#5E5854] hover:text-[#2D2926] transition-all cursor-pointer shadow-sm"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Product Visual */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-[#2D2926]/10 shadow-md bg-[#FAF7F5] group">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 rounded-full bg-[#F5DADF] px-3 py-1 border border-[#2D2926]/10 text-xs font-mono text-[#2D2926] font-bold shadow-sm">
                {product.roastLevel}
              </div>
            </div>
          </div>

          {/* Right Column: Content Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <span className="text-xs tracking-[0.3em] font-sans uppercase text-[#E05A7E] font-bold block mb-1">
                {product.origin.toUpperCase()} • {product.altitude}
              </span>

              <h2 className="font-display text-3xl sm:text-4xl text-[#2D2926] font-bold tracking-tight mb-2">
                {product.name}
              </h2>

              <p className="font-sans text-xs sm:text-sm text-[#E05A7E] font-bold tracking-wide mb-4">
                {product.notes.join(' · ')}
              </p>

              <p className="font-sans text-xs sm:text-sm text-[#5E5854] leading-relaxed mb-6 font-normal">
                {product.description}
              </p>

              {/* Brewing Recommendation */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 flex items-start gap-2.5 mb-6">
                <Coffee className="h-4 w-4 text-[#E05A7E] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-sans tracking-widest text-[#2D2926] uppercase block font-bold">
                    Atelier Brewing Recommendation
                  </span>
                  <p className="font-serif italic text-xs text-[#5E5854] font-medium">
                    {product.brewRecommendation}
                  </p>
                </div>
              </div>

              {/* Grind Selector */}
              <div className="mb-6">
                <span className="text-xs font-sans tracking-wider text-[#8C827A] uppercase block mb-2 font-bold">
                  Select Grind Customization
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {['Whole Bean', 'Filter Kaapi', 'Pour Over'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGrind(g)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-sans tracking-wide border transition-all cursor-pointer text-center ${
                        selectedGrind === g
                          ? 'bg-[#F5DADF] border-[#2D2926]/20 text-[#2D2926] font-bold shadow-sm'
                          : 'bg-[#FAF7F5] border-[#2D2926]/10 text-[#5E5854] hover:text-[#2D2926]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action: Price & Add to Cart */}
            <div className="pt-4 border-t border-[#2D2926]/10 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#8C827A] uppercase block font-bold">
                  Numbered 250g Micro-Tin
                </span>
                <span className="font-display text-2xl sm:text-3xl font-bold text-[#2D2926]">
                  {product.price}
                </span>
              </div>

              <button
                onClick={handleAdd}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-sans text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer shadow-md ${
                  isAddedLocal || isInCollection
                    ? 'bg-[#F5DADF] text-[#2D2926] shadow-sm'
                    : 'bg-[#2D2926] text-white hover:bg-[#1F1C1A] hover:scale-105'
                }`}
              >
                {isAddedLocal || isInCollection ? (
                  <>
                    <Check className="h-4 w-4 text-[#E05A7E]" />
                    <span>In Cart</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Add to Cart</span>
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
