import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  ArrowRight,
  AlertTriangle,
  Mail,
  Clock,
  Star,
  Tag,
  CheckCircle2,
  Send,
  Check
} from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import type { CollectionItem } from '../types';
import type { AutomatedEmail } from '../utils/emailService';
import { 
  getAutomationState, 
  saveAutomationState, 
  triggerAutomationStep, 
  type CartAutomationState 
} from '../utils/emailAutomationSystem';

interface CartPageProps {
  items: CollectionItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenCheckout: () => void;
  onEmailDispatched?: (email: AutomatedEmail) => void;
  userEmail?: string;
  userName?: string;
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
  onEmailDispatched,
  userEmail,
  userName,
}) => {
  const navigate = useNavigate();
  const { getStock } = useInventory();
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string>('');

  // Email Automation State
  const [autoState, setAutoState] = useState<CartAutomationState>(() => getAutomationState());
  const [recipientEmail, setRecipientEmail] = useState<string>(() => {
    return userEmail || getAutomationState().customerEmail || '';
  });
  const [automationNotice, setAutomationNotice] = useState<string>('');

  useEffect(() => {
    if (userEmail && !recipientEmail) {
      setRecipientEmail(userEmail);
    }
  }, [userEmail, recipientEmail]);

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
      setPromoMessage('10% Discount applied successfully!');
    } else if (clean === 'COFFEE20') {
      setDiscountPercent(20);
      setPromoMessage('20% Discount applied successfully!');
    } else {
      setPromoMessage('Invalid coupon code. Try "NOIRVIP10"');
    }
  };

  const handleTriggerAutomation = (step: '1h' | '24h' | '48h') => {
    const targetEmail = recipientEmail.trim() || userEmail || 'customer@noirroast.com';
    const targetName = userName || 'Coffee Lover';

    const dispatched = triggerAutomationStep(
      step,
      items,
      `₹${finalTotal.toLocaleString('en-IN')}`,
      targetEmail,
      targetName
    );

    setAutoState(getAutomationState());

    if (step === '48h') {
      // Auto-apply the 10% discount code
      setPromoCode('NOIRVIP10');
      setDiscountPercent(10);
      setPromoMessage('10% Discount automatically applied via 48-Hour Urgency!');
      setAutomationNotice('48-Hour Urgency email dispatched with exclusive 10% coupon "NOIRVIP10" applied!');
    } else if (step === '1h') {
      setAutomationNotice(`1-Hour Cart reservation email dispatched to ${targetEmail}!`);
    } else {
      setAutomationNotice(`24-Hour Review & taste feedback email dispatched to ${targetEmail}!`);
    }

    if (onEmailDispatched) {
      onEmailDispatched(dispatched);
    }

    setTimeout(() => setAutomationNotice(''), 6000);
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail.trim()) return;
    const current = getAutomationState();
    saveAutomationState({
      ...current,
      customerEmail: recipientEmail.trim(),
    });
    setAutoState(getAutomationState());
    setAutomationNotice(`Email address saved for automatic roast alerts: ${recipientEmail.trim()}`);
    setTimeout(() => setAutomationNotice(''), 4000);
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
      {/* Sub-Header (Safely positioned below global Navbar) */}
      <div className="pt-24 sm:pt-28 pb-4 px-4 sm:px-8 border-b border-[#2D2926]/10 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <button
            onClick={() => navigate('/collection')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/15 text-xs font-semibold hover:bg-neutral-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Continue Shopping</span>
          </button>
          <div className="text-xs font-mono uppercase tracking-widest text-[#8C827A]">
            Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)} Items)
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-8 pt-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#2D2926] mb-8">
          Your Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#2D2926]/10 max-w-2xl mx-auto p-8 shadow-sm">
            <ShoppingBag className="h-16 w-16 text-[#8C827A]/40 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-[#2D2926]">
              Your Cart is Empty
            </h2>
            <p className="mt-2 text-sm text-[#8C827A] max-w-md mx-auto">
              Your cart is currently empty. Explore our fresh roasted coffees.
            </p>
            <button
              onClick={() => navigate('/collection')}
              className="mt-6 px-6 py-3 rounded-full bg-[#2D2926] text-[#FAF7F5] font-bold text-xs hover:bg-black transition-colors"
            >
              Explore All Coffees →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Cart Items & Automation Panel */}
            <div className="lg:col-span-8 space-y-6">
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
                      ? 'You have unlocked Free Express Shipping!'
                      : `Add ₹${3500 - subtotal} more for Free Express Shipping`}
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

              {/* 1h / 24h / 48h Email Automation Suite Panel */}
              <div className="bg-white rounded-3xl border border-[#2D2926]/10 p-6 sm:p-7 shadow-sm space-y-5">
                <div className="border-b border-[#2D2926]/10 pb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E05A7E]/10 text-[#E05A7E] font-mono text-[10px] font-bold uppercase tracking-wider">
                      <Clock className="h-3 w-3" /> 1HR • 24HR • 48HR EMAIL AUTOMATION
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      ACTIVE AUTOMATION SYSTEM
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#2D2926] mt-2">
                    Roastery Email Sequences & Batch Hold
                  </h3>
                  <p className="text-xs text-[#5E5854] mt-1 leading-relaxed">
                    Automatically guides visitors who add coffee to cart: 1-hour cart hold reminder, 24-hour customer reviews & tasting notes, and a 48-hour 10% discount urgency to complete your roast purchase.
                  </p>
                </div>

                {/* Recipient Configuration */}
                <form onSubmit={handleSaveEmail} className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs flex-1">
                    <Mail className="h-4 w-4 text-[#E05A7E] shrink-0" />
                    <span className="text-[#5E5854] font-medium whitespace-nowrap">Your Email:</span>
                    <input
                      type="email"
                      placeholder="Enter email to receive real automated messages"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-mono focus:outline-none focus:border-[#2D2926] flex-1 max-w-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#2D2926] text-white text-xs font-bold hover:bg-black transition-colors shrink-0"
                  >
                    Save Email
                  </button>
                </form>

                {automationNotice && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{automationNotice}</span>
                  </div>
                )}

                {/* Automation Sequence 3-Stage Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {/* Stage 1: 1-Hour Cart Hold Alert */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          1-HOUR SEQUENCE
                        </span>
                        {autoState.step1hSent ? (
                          <span className="text-[10px] font-mono text-emerald-700 flex items-center gap-0.5 font-bold">
                            <Check className="h-3 w-3" /> Dispatched
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-amber-600">Pending</span>
                        )}
                      </div>
                      <h4 className="font-display font-bold text-sm text-[#2D2926] mt-2">
                        Cart & Small-Batch Hold
                      </h4>
                      <p className="text-[11px] text-[#5E5854] mt-1 leading-relaxed">
                        Triggered when user visits & adds coffee to cart. Shares cart item summary and reserves the fresh roast lot.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTriggerAutomation('1h')}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-100 border border-[#2D2926]/15 text-[#2D2926] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Send className="h-3 w-3 text-amber-600" />
                      <span>{autoState.step1hSent ? 'Resend 1-Hr Alert' : 'Trigger 1-Hr Alert'}</span>
                    </button>
                  </div>

                  {/* Stage 2: 24-Hour Review & Social Proof */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
                          24-HOUR SEQUENCE
                        </span>
                        {autoState.step24hSent ? (
                          <span className="text-[10px] font-mono text-emerald-700 flex items-center gap-0.5 font-bold">
                            <Check className="h-3 w-3" /> Dispatched
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-sky-600">Pending</span>
                        )}
                      </div>
                      <h4 className="font-display font-bold text-sm text-[#2D2926] mt-2">
                        Taste Reviews & Feedback
                      </h4>
                      <p className="text-[11px] text-[#5E5854] mt-1 leading-relaxed">
                        Shares 5-star customer feedback, tasting notes, and freshness guarantees on added items, urging them to buy.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTriggerAutomation('24h')}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-100 border border-[#2D2926]/15 text-[#2D2926] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Star className="h-3 w-3 text-sky-600" />
                      <span>{autoState.step24hSent ? 'Resend 24-Hr Feedback' : 'Trigger 24-Hr Review'}</span>
                    </button>
                  </div>

                  {/* Stage 3: 48-Hour Urgency & 10% Discount */}
                  <div className="p-4 rounded-2xl bg-gradient-to-b from-rose-50/70 to-[#FAF7F5] border border-rose-200 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                          48-HOUR URGE
                        </span>
                        {autoState.step48hSent ? (
                          <span className="text-[10px] font-mono text-emerald-700 flex items-center gap-0.5 font-bold">
                            <Check className="h-3 w-3" /> Dispatched
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-rose-600">Pending</span>
                        )}
                      </div>
                      <h4 className="font-display font-bold text-sm text-[#2D2926] mt-2">
                        10% Urgency Voucher
                      </h4>
                      <p className="text-[11px] text-[#5E5854] mt-1 leading-relaxed">
                        Urges immediate order completion with code <span className="font-mono font-bold text-rose-700">NOIRVIP10</span> before batch reservation expires.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTriggerAutomation('48h')}
                      className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-rose-600/20"
                    >
                      <Tag className="h-3 w-3" />
                      <span>Apply 10% & Dispatch 48-Hr</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <button
                  onClick={onClearCart}
                  className="text-[#8C827A] hover:text-rose-600 underline font-mono"
                >
                  Clear Cart
                </button>
                <Link to="/collection" className="text-[#2D2926] font-bold hover:underline">
                  + Add More Coffee
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D2926]/10 shadow-sm space-y-6">
                <h3 className="font-display font-bold text-xl text-[#2D2926]">
                  Order Summary
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
                      <span>Discount ({discountPercent}%)</span>
                      <span className="font-mono font-bold">
                        -₹{discountAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-mono font-bold text-[#2D2926]">
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="flex justify-between pt-3 border-t border-[#2D2926]/10 text-base font-display font-bold text-[#2D2926]">
                    <span>Total Amount</span>
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
                  <span>Proceed to Checkout</span>
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
