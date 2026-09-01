import React, { useState } from 'react';
import { X, Trash2, Sparkles, ArrowRight, Package } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CollectionItem } from '../types';

interface CollectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CollectionItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onClearCollection: () => void;
}

export const CollectionDrawer: React.FC<CollectionDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClearCollection,
}) => {
  const [isAllocated, setIsAllocated] = useState<boolean>(false);
  const [collectorName, setCollectorName] = useState<string>('');
  const [collectorEmail, setCollectorEmail] = useState<string>('');

  if (!isOpen) return null;

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectorName || !collectorEmail) return;

    setIsAllocated(true);
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#c89658', '#e5b877', '#f4eee6', '#8b5a2b'],
      });
    } catch {
      // Ignored
    }
  };

  const handleClose = () => {
    if (isAllocated) {
      onClearCollection();
      setIsAllocated(false);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[220] flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-[#070605]/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative z-10 w-full max-w-md bg-[#0f0c09] border-l border-[#c89658]/35 h-full p-6 sm:p-8 flex flex-col justify-between shadow-[0_0_80px_rgba(0,0,0,0.95)] text-[#f4eee6] overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#221c17] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#c89658]" />
              <h3 className="font-display text-sm tracking-[0.25em] font-bold text-[#f4eee6] uppercase">
                YOUR COLLECTION ({totalCount.toString().padStart(2, '0')})
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2b221a] bg-[#14100c] text-[#8c827a] hover:border-[#c89658] hover:text-[#f4eee6] transition-all cursor-pointer"
              aria-label="Close Collection Drawer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          {isAllocated ? (
            /* Allocation Confirmation View */
            <div className="flex flex-col items-center text-center py-10">
              <div className="h-16 w-16 rounded-full bg-[#c89658]/20 border border-[#c89658] flex items-center justify-center text-[#c89658] mb-6 shadow-[0_0_25px_rgba(200,150,88,0.35)]">
                <Sparkles className="h-8 w-8 text-[#c89658] animate-spin-slow" />
              </div>

              <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#c89658] mb-1">
                Batch Reservation Confirmed
              </span>

              <h4 className="font-serif text-3xl text-[#f4eee6] mb-3">
                Allocation Granted.
              </h4>

              <p className="font-sans text-xs text-[#b5aaa0] leading-relaxed mb-6">
                Your private allocation certificate for <strong>{totalCount} tin{totalCount > 1 ? 's' : ''}</strong> has been transmitted to the roasting atelier.
              </p>

              <div className="w-full rounded-2xl bg-[#080605] border border-[#c89658]/30 p-4 text-left mb-6 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8c827a]">Holder:</span>
                  <span className="text-[#f4eee6] font-semibold">{collectorName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8c827a]">Dispatched To:</span>
                  <span className="text-[#e5b877] font-mono">{collectorEmail}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3.5 rounded-xl bg-[#c89658] text-[#070605] font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#e5b877] transition-all cursor-pointer"
              >
                Close Collection
              </button>
            </div>
          ) : items.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center py-20 text-[#8c827a]">
              <Package className="h-12 w-12 text-[#332b24] mb-4" />
              <h4 className="font-serif text-xl text-[#f4eee6] mb-2">
                Your Vault is Empty
              </h4>
              <p className="font-sans text-xs text-[#8c827a] max-w-xs leading-relaxed">
                Explore THE COLLECTION section and select your preferred origins to request private numbered batch allocations.
              </p>
            </div>
          ) : (
            /* Collection Items List */
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="rounded-2xl bg-[#14100c] border border-[#261f19] p-4 flex gap-4 items-center justify-between"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-16 w-14 rounded-xl object-cover filter brightness-90 border border-[#2b221a]"
                  />

                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono text-[#c89658] tracking-widest block uppercase">
                      {item.product.num} • {item.product.origin}
                    </span>
                    <h4 className="font-serif text-base text-[#f4eee6] truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-[11px] text-[#8c827a] block">
                      Grind: <strong className="text-[#e5b877] font-normal">{item.grind}</strong>
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center rounded-lg border border-[#261f19] bg-[#0c0a08]">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="px-2 py-0.5 text-xs text-[#8c827a] hover:text-[#f4eee6] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono text-xs font-bold text-[#f4eee6]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="px-2 py-0.5 text-xs text-[#8c827a] hover:text-[#f4eee6] cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1 text-[#5a524c] hover:text-red-400 transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-[#e5b877]">
                      {item.product.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout/Claim Form */}
        {!isAllocated && items.length > 0 && (
          <form onSubmit={handleClaim} className="pt-6 border-t border-[#221c17] space-y-3 mt-6">
            <div>
              <input
                type="text"
                required
                value={collectorName}
                onChange={(e) => setCollectorName(e.target.value)}
                placeholder="Collector Name"
                className="w-full rounded-xl bg-[#14100c] border border-[#261f19] px-3.5 py-2.5 text-xs text-[#f4eee6] placeholder-[#4f463e] focus:border-[#c89658] focus:outline-none font-sans"
              />
            </div>
            <div>
              <input
                type="email"
                required
                value={collectorEmail}
                onChange={(e) => setCollectorEmail(e.target.value)}
                placeholder="collector@atelier.com"
                className="w-full rounded-xl bg-[#14100c] border border-[#261f19] px-3.5 py-2.5 text-xs text-[#f4eee6] placeholder-[#4f463e] focus:border-[#c89658] focus:outline-none font-sans"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#c89658] text-[#070605] font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#e5b877] transition-all cursor-pointer shadow-[0_0_20px_rgba(200,150,88,0.35)] flex items-center justify-center gap-2"
            >
              <span>Confirm {totalCount} Allocation{totalCount > 1 ? 's' : ''}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
