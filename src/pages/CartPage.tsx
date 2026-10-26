import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import type { CollectionItem } from '../types';

interface CartPageProps {
  items: CollectionItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
}) => {
  const navigate = useNavigate();
  const { getStock } = useInventory();
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string>('');

  const subtotal = items.reduce((sum, item) => {
    const priceNum = parseFloat(item.product.price.replace(/[^0-9.]/g, '')) || 0;
    return sum + priceNum * item.quantity;
  }, 0);

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shipping = subtotal >= 3500 || subtotal === 0 ? 0 : 250;
  const finalTotal = subtotal - discountAmount + shipping;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'NOIRVIP10' || clean === 'FIRSTROAST') {
      setDiscountPercent(10);
      setPromoMessage('10% VIP Roastery Discount applied successfully!');
    } else if (clean === 'COFFEE20') {
      setDiscountPercent(20);
      setPromoMessage('20% Master Allocation Discount applied!');
    } else {
      setPromoMessage('Invalid voucher code. Try "NOIRVIP10"');
    }
  };

  // Check if any items in cart violate current inventory
  const stockErrors: string[] = [];
  items.forEach((item) => {
    const available = getStock(item.product.id);
    if (available === 0) {
      stockErrors.push(`"${item.product.name}" is now completely out of stock.`);
    } else if (item.quantity > available) {
      stockErrors.push(`Only ${available} units of "${item.product.name}" are currently available.`);
    }
  });

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] pb-24">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 border-b border-[#2D2926]/10 px-4 sm:px-8 py-3.5 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <button
            onClick={() => navigate('/collection')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/15 text-xs font-semibold hover:bg-neutral-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Continue Curating</span>
          </button>
          <div className="text-xs font-mono uppercase tracking-widest text-[#8C827A]">
            Allocation Review & Cart ({items.reduce((s, i) => s + i.quantity, 0)} Items)
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-8 pt-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#2D2926] mb-8">
          Your Curated Allocation
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#2D2926]/10 max-w-2xl mx-auto p-8 shadow-sm">
            <ShoppingBag className="h-16 w-16 text-[#8C827A]/40 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-[#2D2926]">
              Your Cart is Empty
            </h2>
            <p className="mt-2 text-sm text-[#8C827A] max-w-md mx-auto">
              You haven't allocated any specialty micro-lots yet. Discover our 10 shade-grown harvest lots.
            </p>
            <button
              onClick={() => navigate('/collection')}
              className="mt-6 px-6 py-3 rounded-full bg-[#2D2926] text-[#FAF7F5] font-bold text-xs hover:bg-black transition-colors"
            >
              Explore 10 Coffee Lots →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              {/* Stock Warning Box if any */}
              {stockErrors.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    Inventory Adjustment Notice:
                  </div>
                  {stockErrors.map((err, i) => (
                    <p key={i}>• {err}</p>
                  ))}
                </div>
              )}

              {/* Free Shipping Meter */}
              <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-sm">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span>
                    {subtotal >= 3500
                      ? '🎉 You have unlocked Complimentary Express Shipping!'
                      : `Add ₹${3500 - subtotal} more for Complimentary Express Shipping`}
                  </span>
                  <span className="font-mono text-[#E05A7E]">
                    {Math.min(100, Math.round((subtotal / 3500) * 100))}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#FAF7F5] overflow-hidden">
                  <div
                    className="h-full bg-[#E05A7E] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / 3500) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="bg-white rounded-3xl border border-[#2D2926]/10 shadow-sm divide-y divide-[#2D2926]/10 overflow-hidden">
                {items.map((item) => {
                  const available = getStock(item.product.id);
                  const priceNum = parseFloat(item.product.price.replace(/[^0-9.]/g, '')) || 0;
                  const itemLineTotal = priceNum * item.quantity;

                  return (
                    <div key={`${item.product.id}-${item.grind}`} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-20 w-20 rounded-2xl object-cover bg-neutral-900 shrink-0"
                        />
                        <div>
                          <div className="font-mono text-[10px] text-[#E05A7E] font-bold">
                            LOT #{item.product.num}
                          </div>
                          <Link
                            to={`/product/${item.product.id}`}
                            className="font-display font-bold text-base text-[#2D2926] hover:text-[#E05A7E] transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <div className="text-xs text-[#8C827A] mt-0.5">
                            Grind: <span className="font-medium text-[#2D2926]">{item.grind}</span>
                          </div>
                          <div className="text-xs text-[#8C827A]">
                            Vault Stock: <span className="font-mono font-bold text-[#2D2926]">{available} available</span>
                          </div>
                        </div>
                      </div>

                      {/* Controls and Price */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-[#2D2926]/15 rounded-xl bg-[#FAF7F5] p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors text-xs"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center font-mono font-bold text-xs text-[#2D2926]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            disabled={item.quantity >= available}
                            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-neutral-200 disabled:opacity-30 transition-colors text-xs"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right min-w-[80px]">
                          <div className="font-display font-bold text-base text-[#2D2926]">
                            ₹{itemLineTotal.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-[#8C827A] font-mono">
                            {item.product.price} each
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-2 text-[#8C827A] hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-xs">
                <button
                  onClick={onClearCart}
                  className="text-[#8C827A] hover:text-rose-600 underline font-mono"
                >
                  Clear All Allocations
                </button>
                <Link to="/collection" className="text-[#2D2926] font-bold hover:underline">
                  + Add Another Micro-Lot
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D2926]/10 shadow-sm space-y-6">
                <h3 className="font-display font-bold text-xl text-[#2D2926]">
                  Allocation Summary
                </h3>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo / Voucher Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#2D2926]/15 text-xs uppercase font-mono focus:outline-none focus:border-[#2D2926]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-[#2D2926] text-white text-xs font-bold hover:bg-black transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMessage && (
                    <p className={`text-xs ${discountPercent > 0 ? 'text-emerald-700 font-medium' : 'text-rose-600'}`}>
                      {promoMessage}
                    </p>
                  )}
                </form>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs text-[#5E5854] pt-2 border-t border-[#2D2926]/10">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold text-[#2D2926]">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>VIP Privilege Discount ({discountPercent}%)</span>
                      <span className="font-mono font-bold">
                        -₹{discountAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Climate-Neutral Shipping</span>
                    <span className="font-mono font-bold text-[#2D2926]">
                      {shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="flex justify-between pt-3 border-t border-[#2D2926]/10 text-base font-display font-bold text-[#2D2926]">
                    <span>Total Allocation</span>
                    <span className="text-xl">
                      ₹{finalTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Proceed Button */}
                <button
                  onClick={onOpenCheckout}
                  disabled={stockErrors.length > 0}
                  className="w-full py-4 rounded-2xl bg-[#2D2926] text-[#FAF7F5] font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl disabled:bg-neutral-300 disabled:cursor-not-allowed"
                >
                  <span>Proceed to Final Allocation</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="text-[11px] text-[#8C827A] text-center space-y-1">
                  <p className="flex items-center justify-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Encrypted 256-bit SSL Checkout
                  </p>
                  <p>Guaranteed freshness: Roasted within 48h of dispatch.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
