import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  CheckCircle2, 
  Shield, 
  Clock, 
  Star, 
  Tag, 
  Copy, 
  Check, 
  ArrowRight, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import type { AutomatedEmail } from '../utils/emailService';

interface EmailNotificationModalProps {
  email: AutomatedEmail | null;
  onClose: () => void;
  onApplyPromoCode?: (code: string) => void;
  onNavigateToCart?: () => void;
}

export const EmailNotificationModal: React.FC<EmailNotificationModalProps> = ({ 
  email, 
  onClose,
  onApplyPromoCode,
  onNavigateToCart 
}) => {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  if (!email) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleClaimDiscount = (code: string) => {
    if (onApplyPromoCode) {
      onApplyPromoCode(code);
    }
    if (onNavigateToCart) {
      onNavigateToCart();
    }
    onClose();
  };

  const getBadgeInfo = () => {
    switch (email.type) {
      case 'abandoned_cart_1h':
        return {
          title: '1-HOUR CART AUTOMATION',
          color: 'text-amber-700 bg-amber-50 border-amber-200',
          icon: Clock,
        };
      case 'feedback_social_proof_24h':
        return {
          title: '24-HOUR REVIEW & FEEDBACK AUTOMATION',
          color: 'text-sky-700 bg-sky-50 border-sky-200',
          icon: Star,
        };
      case 'discount_urgency_48h':
        return {
          title: '48-HOUR 10% DISCOUNT URGENCY AUTOMATION',
          color: 'text-rose-700 bg-rose-50 border-rose-200',
          icon: Tag,
        };
      case 'order_confirmation':
        return {
          title: 'ORDER CONFIRMATION DISPATCH',
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          icon: CheckCircle2,
        };
      default:
        return {
          title: 'NOTIFICATION DISPATCH',
          color: 'text-[#E05A7E] bg-pink-50 border-pink-200',
          icon: Mail,
        };
    }
  };

  const badge = getBadgeInfo();
  const BadgeIcon = badge.icon;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#2D2926]/60 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Email Simulation Window */}
      <div 
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-2xl rounded-3xl bg-white border border-[#2D2926]/10 p-5 sm:p-7 shadow-2xl text-[#2D2926] max-h-[85vh] overflow-y-auto modal-scrollbar overscroll-contain"
      >
        {/* Email Header Bar */}
        <div className="flex items-start sm:items-center justify-between border-b border-[#2D2926]/10 pb-3.5 mb-4 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center text-[#E05A7E] shrink-0 shadow-sm">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${badge.color}`}>
                  <BadgeIcon className="h-2.5 w-2.5" /> {badge.title}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-[8px] font-mono text-emerald-700 font-bold">
                  <CheckCircle2 className="h-2.5 w-2.5" /> DELIVERED
                </span>
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-[#2D2926] leading-tight mt-1">
                {email.subject}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#2D2926]/10 bg-[#FAF7F5] text-[#5E5854] hover:text-[#2D2926] transition-all cursor-pointer shrink-0 mt-1 sm:mt-0 shadow-sm"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Email Metadata */}
        <div className="rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 p-3 mb-4 space-y-1 text-xs text-[#5E5854]">
          <div className="flex justify-between flex-wrap gap-1">
            <span className="text-[#8C827A]">From:</span>
            <span className="font-mono text-[#2D2926] font-bold">concierge@noirroast.com (NOIR ROAST)</span>
          </div>
          <div className="flex justify-between flex-wrap gap-1">
            <span className="text-[#8C827A]">To:</span>
            <span className="font-mono text-[#2D2926] font-semibold">{email.recipientName} &lt;{email.to}&gt;</span>
          </div>
          <div className="flex justify-between flex-wrap gap-1">
            <span className="text-[#8C827A]">Date:</span>
            <span className="font-mono text-[#8C827A]">{new Date(email.timestamp).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* HTML Email Body Container */}
        <div className="rounded-2xl bg-[#F3ECE7] border border-[#2D2926]/10 p-5 sm:p-6 space-y-4">
          {/* Brand Watermark */}
          <div className="text-center pb-3 border-b border-[#2D2926]/10">
            <h2 className="font-display text-xl font-bold tracking-[0.25em] text-[#2D2926] uppercase">
              NOIR ROAST
            </h2>
            <span className="text-[8px] font-mono text-[#E05A7E] uppercase tracking-widest block mt-0.5 font-bold">
              CHIKMAGALUR & BENGALURU • EST. 1998
            </span>
          </div>

          <div className="space-y-3 font-sans text-xs text-[#5E5854] leading-relaxed">
            <p className="font-bold text-[#2D2926] text-sm">Hello {email.recipientName},</p>

            {/* Template Branch 1: 1-Hour Abandoned Cart */}
            {email.type === 'abandoned_cart_1h' && (
              <>
                <p>
                  We noticed you visited <strong>Noir Roast</strong> and put together a fresh coffee selection in your cart.
                </p>
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-950">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    Small-Batch Roast Reservation Held
                  </div>
                  <p>
                    Because our beans are roasted in limited micro-lots every week in Chikmagalur, popular single-origins sell out quickly. We have temporarily held your coffee bags in our roastery schedule.
                  </p>
                </div>

                {email.details.items && email.details.items.length > 0 && (
                  <div className="rounded-xl bg-white border border-[#2D2926]/10 p-3.5 space-y-2 mt-2">
                    <span className="text-[9px] font-sans uppercase text-[#E05A7E] block tracking-widest font-bold">
                      YOUR RESERVED ROAST ITEMS
                    </span>
                    {email.details.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs pb-1.5 border-b border-[#2D2926]/10 last:border-b-0 last:pb-0">
                        <div>
                          <span className="font-display font-bold text-[#2D2926] block">{it.name}</span>
                          <span className="text-[10px] text-[#8C827A]">{it.origin} • {it.grind} • Qty: {it.quantity}</span>
                        </div>
                        <span className="font-display text-[#2D2926] font-bold">{it.price}</span>
                      </div>
                    ))}
                    <div className="pt-2 flex justify-between items-center text-xs font-bold border-t border-[#2D2926]/10">
                      <span className="text-[#2D2926]">Cart Total:</span>
                      <span className="font-display text-sm text-[#2D2926] font-bold">{email.details.cartTotal || email.details.totalAmount}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 text-center">
                  <button
                    onClick={() => {
                      if (onNavigateToCart) onNavigateToCart();
                      onClose();
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2D2926] text-[#FAF7F5] font-bold text-xs hover:bg-black transition-colors shadow-md"
                  >
                    <span>Resume Order & Claim Fresh Roast</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            )}

            {/* Template Branch 2: 24-Hour Social Proof & Feedback */}
            {email.type === 'feedback_social_proof_24h' && (
              <>
                <p>
                  It's been 24 hours since you explored our roast collection. Before you decide, here is what verified coffee lovers and daily brewers say about the exact beans you selected:
                </p>

                {/* Verified Customer Feedback Card */}
                <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                      <span className="font-bold text-xs text-[#2D2926] ml-1">5.0 / 5.0</span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      VERIFIED TASTE REVIEW
                    </span>
                  </div>

                  <blockquote className="italic text-[#2D2926] text-xs font-serif leading-relaxed border-l-2 border-[#E05A7E] pl-3 py-0.5">
                    "{email.details.feedbackReview?.quote || "The Chikmagalur Peaberry dark roast with chicory produces the thickest decoction I've had outside Mylapore. Absolutely exceptional crema and aroma."}"
                  </blockquote>

                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#2D2926]/5 text-[#8C827A]">
                    <div>
                      <span className="font-bold text-[#2D2926]">{email.details.feedbackReview?.author || 'Tanmay Joshi'}</span>
                      <span className="text-[10px] block text-[#8C827A]">{email.details.feedbackReview?.location || 'Bengaluru'} • Daily Pour Over & Filter Brewer</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#E05A7E] font-bold">
                      {email.details.feedbackReview?.lot || 'Single-Origin Chikmagalur'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/70 border border-[#2D2926]/10 text-[11px] text-[#5E5854] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#2D2926]">
                    <Sparkles className="h-3.5 w-3.5 text-[#E05A7E]" />
                    Our Roaster's Freshness Guarantee:
                  </div>
                  <p>
                    Every order is roasted within 24 hours of dispatch. If you don't love your first morning cup, we'll send a different roast profile on the house.
                  </p>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => {
                      if (onNavigateToCart) onNavigateToCart();
                      onClose();
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2D2926] text-[#FAF7F5] font-bold text-xs hover:bg-black transition-colors shadow-md"
                  >
                    <span>Complete Your Order With Confidence</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            )}

            {/* Template Branch 3: 48-Hour Urgency + 10% Discount */}
            {email.type === 'discount_urgency_48h' && (
              <>
                <p>
                  Your 48-hour small-batch roast reservation hold is coming to an end.
                </p>
                <p>
                  To make sure you get to experience the rich notes of our freshly roasted beans without compromise, we've activated an exclusive <strong>10% Discount Code</strong> for you to complete your order today.
                </p>

                {/* 10% Voucher Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 via-white to-amber-50 border-2 border-rose-300 text-center space-y-2 shadow-sm">
                  <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-rose-700 font-bold bg-rose-100 px-2.5 py-0.5 rounded-full">
                    EXCLUSIVE 10% DISCOUNT VOUCHER
                  </span>

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <span className="font-mono text-2xl font-bold tracking-widest text-[#2D2926] bg-white border border-[#2D2926]/20 px-4 py-1.5 rounded-xl shadow-inner">
                      {email.details.discountCode || 'NOIRVIP10'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(email.details.discountCode || 'NOIRVIP10')}
                      className="p-2 rounded-xl bg-white border border-[#2D2926]/15 hover:bg-neutral-100 transition-colors text-xs font-semibold"
                      title="Copy coupon code"
                    >
                      {copiedCode ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
                          <Check className="h-3.5 w-3.5" /> Copied
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[#2D2926] text-[10px]">
                          <Copy className="h-3.5 w-3.5" /> Copy
                        </span>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-rose-800 font-semibold">
                    Valid for 24 hours. Batch hold releases to public inventory once expired.
                  </p>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => handleClaimDiscount(email.details.discountCode || 'NOIRVIP10')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-600/20"
                  >
                    <span>Apply 10% Off & Checkout Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            )}

            {/* Template Branch 4: Order Confirmation */}
            {email.type === 'order_confirmation' && (
              <>
                <p>
                  Your order <strong>#{email.details.orderNumber}</strong> has been logged into our roastery schedule.
                </p>
                <p>
                  Each batch is freshly roasted, sealed, and shipped from Chikmagalur directly to your address.
                </p>

                {email.details.items && (
                  <div className="rounded-xl bg-white border border-[#2D2926]/10 p-3.5 space-y-2 mt-2">
                    <span className="text-[9px] font-sans uppercase text-[#E05A7E] block tracking-widest font-bold">
                      ORDER ITEMS
                    </span>
                    {email.details.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs pb-1.5 border-b border-[#2D2926]/10 last:border-b-0 last:pb-0">
                        <div>
                          <span className="font-display font-bold text-[#2D2926] block">{it.name}</span>
                          <span className="text-[10px] text-[#E05A7E]">{it.origin} • {it.grind} • Qty: {it.quantity}</span>
                        </div>
                        <span className="font-display text-[#2D2926] font-bold">{it.price}</span>
                      </div>
                    ))}
                    <div className="pt-2 flex justify-between items-center text-xs font-bold border-t border-[#2D2926]/10">
                      <span className="text-[#2D2926]">Total Paid:</span>
                      <span className="font-display text-sm text-[#2D2926] font-bold">{email.details.totalAmount}</span>
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-white border border-[#2D2926]/10 p-2.5 text-xs flex justify-between flex-wrap gap-1">
                  <span className="text-[#8C827A]">Delivery Address:</span>
                  <span className="text-[#2D2926] font-semibold">{email.details.shippingAddress}</span>
                </div>
              </>
            )}

            {/* Template Branch 5: VIP Welcome Pass */}
            {email.type === 'vip_welcome' && (
              <>
                <p>
                  Welcome to <strong>Noir Roast Coffee</strong>. You now have priority access to our fresh seasonal roasts.
                </p>
                <div className="rounded-xl bg-white border border-[#2D2926]/10 p-3.5 text-center space-y-1">
                  <span className="text-[10px] font-sans tracking-widest text-[#E05A7E] uppercase block font-bold">
                    YOUR CUSTOMER ID NUMBER
                  </span>
                  <span className="font-mono text-lg font-bold text-[#2D2926] tracking-wider block">
                    #{email.details.membershipId}
                  </span>
                </div>
              </>
            )}

            <p className="pt-1 text-xs text-[#E05A7E] italic font-medium">
              “Crafted with care. Poured with purpose.”
            </p>
          </div>

          <div className="pt-3 border-t border-[#2D2926]/10 flex items-center justify-between text-[10px] font-mono text-[#8C827A]">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-[#E05A7E]" />
              <span>NOIR ROAST COFFEE</span>
            </div>
            <span>ROASTERY AUTOMATION SYSTEM</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-[11px] text-[#8C827A] flex items-center gap-1 font-mono">
            <ShoppingBag className="h-3 w-3 text-[#E05A7E]" />
            <span>FormSubmit AJAX Real Delivery Enabled</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#2D2926] text-white font-sans text-xs font-bold uppercase transition-all cursor-pointer shadow-sm hover:bg-[#1F1C1A]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
