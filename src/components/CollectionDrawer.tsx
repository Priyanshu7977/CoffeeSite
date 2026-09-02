import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
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
  onClearCollection: _onClearCollection,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  // Calculate pricing in INR (₹)
  const subtotalNumeric = items.reduce((sum, item) => {
    const raw = parseFloat(item.product.price.replace(/[^0-9.]/g, '')) || 950;
    return sum + raw * item.quantity;
  }, 0);

  const formattedSubtotal = `₹${subtotalNumeric.toLocaleString('en-IN')}`;

  return (
    <div className="fixed inset-0 z-[220] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#2D2926]/60 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative z-10 h-full w-full max-w-md bg-white border-l border-[#2D2926]/10 p-6 sm:p-8 flex flex-col justify-between text-[#2D2926] shadow-2xl overflow-y-auto animate-fadeIn">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#2D2926]/10 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#E05A7E]" />
            <h3 className="font-display text-sm tracking-[0.2em] font-bold text-[#2D2926] uppercase">
              COFFEE VAULT ({items.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2D2926]/10 bg-[#FAF7F5] text-[#5E5854] hover:text-[#2D2926] transition-all cursor-pointer shadow-sm"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-12">
            <div className="h-16 w-16 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center text-[#2D2926]">
              <ShoppingBag className="h-7 w-7 text-[#E05A7E]" />
            </div>
            <h4 className="font-display text-xl text-[#2D2926] font-bold">Your Vault is Empty</h4>
            <p className="font-sans text-xs text-[#5E5854] max-w-xs font-normal">
              Explore our single-estate Chikmagalur micro-lots and select your preferred grind.
            </p>
          </div>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto pr-1 my-2">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.grind}`}
                className="flex gap-3.5 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 p-3.5 shadow-sm"
              >
                {/* Product Image */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-18 w-18 rounded-xl object-cover border border-[#2D2926]/10 shrink-0"
                />

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-display text-sm text-[#2D2926] font-bold leading-tight">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[#8C827A] hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="text-[10px] font-mono text-[#E05A7E] block mt-0.5 font-bold">
                      {item.grind}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-display text-sm text-[#2D2926] font-bold">
                      {item.product.price}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center rounded-lg border border-[#2D2926]/15 bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="px-2 py-0.5 text-xs text-[#5E5854] hover:text-[#2D2926] font-mono font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono text-xs font-bold text-[#2D2926]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="px-2 py-0.5 text-xs text-[#5E5854] hover:text-[#2D2926] font-mono font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-[#2D2926]/10 space-y-4">
            <div className="space-y-1.5 text-xs text-[#5E5854]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-display text-sm font-bold text-[#2D2926]">{formattedSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Estate Dispatch</span>
                <span className="text-[#E05A7E] font-bold">FREE</span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 rounded-full bg-[#2D2926] text-white font-sans text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 shadow-md hover:bg-[#1F1C1A] hover:scale-105 transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#8C827A]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#E05A7E]" />
              <span>NITROGEN-SEALED FRESHNESS GUARANTEED</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
