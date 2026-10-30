import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Send 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { isValidName, sanitizeName, hasMaliciousContent, stripDangerousMarkup } from '../utils/validation';
import { NOIR_PRODUCTS } from '../data/products';
import { stopGlobalLenis, startGlobalLenis } from '../hooks/useLenis';
import type { CustomerReview } from './ReviewsRollingSection';

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProductId?: string;
  onReviewSubmitted?: (review: CustomerReview) => void;
}

const POPULAR_FLAVOR_TAGS = [
  'Floral Jasmine',
  'Smoked Cardamom',
  'Bittersweet Cacao',
  'Golden Crema',
  'Molasses & Oak',
  'Wild Berries',
  'Raw Jaggery',
  'Velvety Body',
  'Citrus Brightness',
  'Zero Bitterness',
];

const BREW_METHODS_LIST = [
  'Traditional South Indian Brass Davarah',
  'V60 Conical Pour-Over',
  '9-Bar Commercial Espresso',
  'AeroPress Inverted Steep',
  'French Press Immersion',
  'Cold Brew Slow Drip',
];

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  isOpen,
  onClose,
  defaultProductId,
  onReviewSubmitted,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    defaultProductId || NOIR_PRODUCTS[0].id
  );
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [brewMethod, setBrewMethod] = useState<string>(BREW_METHODS_LIST[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [quote, setQuote] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Background Scroll Locking & Global Lenis Disabling when modal is active
  useEffect(() => {
    if (isOpen) {
      stopGlobalLenis();
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Reset fields on modal open
      setErrorMessage('');
      setIsSuccess(false);

      return () => {
        startGlobalLenis();
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [isOpen]);

  // Update selected product when defaultProductId changes
  useEffect(() => {
    if (defaultProductId) {
      setSelectedProductId(defaultProductId);
    }
  }, [defaultProductId]);

  if (!isOpen) return null;

  const selectedProduct =
    NOIR_PRODUCTS.find((p) => p.id === selectedProductId) || NOIR_PRODUCTS[0];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length >= 4) return;
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (hasMaliciousContent(name) || hasMaliciousContent(quote) || (role && hasMaliciousContent(role))) {
      setErrorMessage('Security Alert: HTML or script elements are strictly prohibited.');
      return;
    }

    if (!isValidName(name)) {
      setErrorMessage('Please enter your full name (alphabetic letters only).');
      return;
    }

    if (quote.trim().length < 10) {
      setErrorMessage('Please share a brief tasting note (minimum 10 characters).');
      return;
    }

    const newReview: CustomerReview = {
      id: `rev-custom-${Date.now()}`,
      name: sanitizeName(name),
      role: role.trim() ? stripDangerousMarkup(role.trim()) : 'Coffee Enthusiast',
      location: location.trim() ? stripDangerousMarkup(location.trim()) : 'India',
      lot: `${selectedProduct.name} • ${selectedProduct.altitude}`,
      rating,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      quote: stripDangerousMarkup(quote.trim()),
      category: 'single-estate',
      elevation: `${selectedProduct.altitude} • ${selectedProduct.region}`,
      process: selectedProduct.process,
      notes: selectedTags.length > 0 ? selectedTags : selectedProduct.notes,
      brewMethod,
      roastBatch: `Verified Member Roast • Lot #${selectedProduct.num}`,
    };

    // Save to localStorage
    try {
      const existing = localStorage.getItem('noir_custom_reviews_v1');
      const list: CustomerReview[] = existing ? JSON.parse(existing) : [];
      list.unshift(newReview);
      localStorage.setItem('noir_custom_reviews_v1', JSON.stringify(list));
    } catch {
      // Ignored
    }

    if (onReviewSubmitted) {
      onReviewSubmitted(newReview);
    }

    setIsSuccess(true);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F5DADF', '#E05A7E', '#2D2926', '#C89658'],
      });
    } catch {
      // Ignored
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setName('');
    setRole('');
    setLocation('');
    setSelectedTags([]);
    setQuote('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[280] flex items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain">
      {/* Backdrop */}
      <div
        onClick={handleResetAndClose}
        className="fixed inset-0 bg-[#2D2926]/75 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-[#FAF7F5] border border-[#2D2926]/10 p-5 sm:p-6 shadow-2xl text-[#2D2926] max-h-[92vh] overflow-y-auto modal-scrollbar overscroll-contain">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#2D2926]/10 bg-white text-[#5E5854] hover:text-[#2D2926] transition-colors cursor-pointer shadow-sm"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="h-14 w-14 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E05A7E] font-bold block">
              COMMUNITY CUPPING LEDGER
            </span>
            <h3 className="font-display font-bold text-xl text-[#2D2926]">
              Tasting Review Certified!
            </h3>
            <p className="text-xs text-[#5E5854] max-w-sm mx-auto leading-relaxed">
              Thank you, <strong>{sanitizeName(name)}</strong>. Your sensory tasting feedback for <strong>{selectedProduct.name}</strong> has been added to our community cupping ledger.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-full bg-[#2D2926] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-all cursor-pointer shadow-md"
              >
                Return to Coffee
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2D2926]/10 mb-3.5 pr-8">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#E05A7E] mb-0.5">
                  <Sparkles className="h-3 w-3 text-[#E05A7E]" />
                  <span>COMMUNITY TASTING LEDGER</span>
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-[#2D2926]">
                  Review Your Roasted Micro-Lot
                </h3>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Product Selector & Star Rating Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-white p-3 rounded-2xl border border-[#2D2926]/10">
                <div className="sm:col-span-7">
                  <label className="block text-[9.5px] font-mono font-bold tracking-wider text-[#8C827A] uppercase mb-1">
                    Selected Coffee Micro-Lot:
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#2D2926]/15 bg-[#FAF7F5] text-xs font-sans font-bold text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                  >
                    {NOIR_PRODUCTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        #{p.num} {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-5 flex flex-col sm:items-end">
                  <span className="text-[9.5px] font-mono font-bold uppercase text-[#8C827A] mb-1">
                    Rating: {rating} / 5 Stars
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-0.5 hover:scale-120 transition-transform cursor-pointer"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={`h-5 w-5 transition-colors ${
                              isFilled
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-neutral-300 fill-transparent'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Name & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[9.5px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(sanitizeName(e.target.value, true))}
                    placeholder=""
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl border border-[#2D2926]/15 bg-white text-xs text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                    Your City / Region
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(stripDangerousMarkup(e.target.value))}
                    placeholder=""
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl border border-[#2D2926]/15 bg-white text-xs text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                  />
                </div>
              </div>

              {/* Brew Gear & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[9.5px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                    Brew Equipment Used
                  </label>
                  <select
                    value={brewMethod}
                    onChange={(e) => setBrewMethod(e.target.value)}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl border border-[#2D2926]/15 bg-white text-xs text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                  >
                    {BREW_METHODS_LIST.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9.5px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                    Coffee Passion / Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(stripDangerousMarkup(e.target.value))}
                    placeholder=""
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl border border-[#2D2926]/15 bg-white text-xs text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                  />
                </div>
              </div>

              {/* Sensory Flavor Tags Chips */}
              <div>
                <label className="block text-[9.5px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1.5">
                  Select Prominent Flavor Notes (Choose up to 4):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_FLAVOR_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1 rounded-full text-[10.5px] font-sans font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2D2926] text-white shadow-2xs font-bold ring-1 ring-[#2D2926]'
                            : 'bg-white border border-[#2D2926]/15 text-[#5E5854] hover:bg-[#FAF7F5]'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-[9.5px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                  Your Tasting Notes & Review *
                </label>
                <textarea
                  required
                  rows={2}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder=""
                  className="w-full px-3.5 py-2 rounded-xl border border-[#2D2926]/15 bg-white text-xs text-[#2D2926] placeholder-[#8C827A] focus:outline-none focus:border-[#2D2926]"
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#2D2926] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md cursor-pointer active:scale-95"
                >
                  <Send className="h-3.5 w-3.5 text-[#E05A7E]" />
                  <span>Submit to Community Cupping Ledger</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[9.5px] font-mono text-[#8C827A] pt-0.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Verified Buyer Review • Moderated for Authenticity</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSubmissionModal;
