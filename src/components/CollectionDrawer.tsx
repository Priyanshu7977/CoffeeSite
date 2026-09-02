import React from 'react';
import { X, Trash2, ArrowRight, Package, ShieldCheck, Truck } from 'lucide-react';
import type { CollectionItem } from '../types';

interface CollectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CollectionItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onClearCollection: () => void;
  onProceedToCheckout: () => void;
}

export const CollectionDrawer: React.FC<CollectionDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotalNumeric = items.reduce((sum, item) => {
    const raw = parseFloat(item.product.price.replace(/[^0-9.]/g, '')) || 2400;
    return sum + raw * item.quantity;
  }, 0);

  const freeShippingThreshold = 3000;
  const progressPercent = Math.min(100, (subtotalNumeric / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-[220] flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#070605]/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative z-10 w-full max-w-md bg-[#0e0b08] border-l border-[#c89658]/35 h-full p-6 sm:p-8 flex flex-col justify-between shadow-[0_0_80px_rgba(0,0,0,0.95)] text-[#f4eee6] overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#221c17] pb-4 mb-5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#c89658] shadow-[0_0_8px_#c89658]" />
              <h3 className="font-display text-sm tracking-[0.25em] font-bold text-[#f4eee6] uppercase">
                YOUR DAKSHIN CART ({totalCount.toString().padStart(2, '0')})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2b221a] bg-[#14100c] text-[#8c827a] hover:border-[#c89658] hover:text-[#f4eee6] transition-all cursor-pointer"
              aria-label="Close Cart Drawer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Complimentary White-Glove Shipping Progress Bar */}
          {items.length > 0 && (
            <div className="mb-5 rounded-2xl bg-[#140f0c] border border-[#261f18] p-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-sans">
                <div className="flex items-center gap-1.5 text-[#e5b877]">
                  <Truck className="h-3.5 w-3.5" />
                  <span>
                    {subtotalNumeric >= freeShippingThreshold
                      ? 'Complimentary White-Glove Courier Unlocked'
                      : `Add ₹${(freeShippingThreshold - subtotalNumeric).toLocaleString('en-IN')} more for Free Courier`}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#8c827a]">{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#211a14] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#c89658] to-[#e5b877] transition-all duration-500 shadow-[0_0_10px_#c89658]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Body */}
          {items.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center py-20 text-[#8c827a]">
              <Package className="h-12 w-12 text-[#332b24] mb-4" />
              <h4 className="font-serif text-xl text-[#f4eee6] mb-2">
                Your Vault Cart is Empty
              </h4>
              <p className="font-sans text-xs text-[#8c827a] max-w-xs leading-relaxed mb-6">
                Explore THE COLLECTION and select your preferred Indian origins to request private numbered batch allocations.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full border border-[#c89658]/40 bg-[#140f0c] text-xs font-sans uppercase tracking-widest text-[#e5b877] hover:border-[#c89658] transition-all cursor-pointer"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            /* Cart Items List */
            <div className="space-y-3.5">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.grind}`}
                  className="rounded-2xl bg-[#140f0c] border border-[#261f19] p-4 flex gap-4 items-center justify-between"
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

        {/* Footer Checkout Trigger */}
        {items.length > 0 && (
          <div className="pt-5 border-t border-[#221c17] space-y-3 mt-6">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#8c827a]">
                <span>Allocation Subtotal ({totalCount} tins):</span>
                <span className="font-mono text-[#f4eee6]">₹{subtotalNumeric.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#8c827a]">
                <span>Master Roaster Wax Sealing:</span>
                <span className="font-mono text-[#e5b877]">COMPLIMENTARY</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#c89658] to-[#e5b877] text-[#070605] font-sans text-xs font-bold tracking-[0.2em] uppercase hover:shadow-[0_0_30px_rgba(200,150,88,0.45)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Proceed to Haute Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#786e64] pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#c89658]" />
              <span>Authentic Bengaluru & Chikmagalur Cellar Allocation</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
