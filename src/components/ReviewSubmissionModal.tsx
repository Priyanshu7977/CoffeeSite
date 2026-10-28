import React, { useState } from 'react';
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
  const [role, setRole] = useState<string>('Home Barista & Coffee Connoisseur');
  const [location, setLocation] = useState<string>('Bengaluru');
  const [brewMethod, setBrewMethod] = useState<string>(BREW_METHODS_LIST[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Bittersweet Cacao', 'Golden Crema']);
  const [quote, setQuote] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

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

    if (hasMaliciousContent(name) || hasMaliciousContent(quote)) {
      setErrorMessage('Security Alert: HTML or script elements are strictly prohibited.');
      return;
    }

    if (!isValidName(name)) {
      setErrorMessage('Please enter a valid full name (alphabets only).');
      return;
    }

    if (quote.trim().length < 15) {
      setErrorMessage('Please share a genuine tasting note (minimum 15 characters).');
      return;
    }

    const newReview: CustomerReview = {
      id: `rev-custom-${Date.now()}`,
      name: sanitizeName(name),
      role: stripDangerousMarkup(role),
      location: stripDangerousMarkup(location),
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
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F5DADF', '#E05A7E', '#2D2926', '#C89658'],
      });
    } catch {
      // Ignored
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[280] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleResetAndClose}
        className="fixed inset-0 bg-[#2D2926]/75 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl rounded-3xl bg-[#FAF7F5] border border-[#2D2926]/10 p-6 sm:p-8 shadow-2xl text-[#2D2926] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-[#2D2926]/10 bg-white text-[#5E5854] hover:text-[#2D2926] transition-colors cursor-pointer shadow-sm"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#E05A7E] font-bold block">
              COMMUNITY CUPPING LEDGER
            </span>
            <h3 className="font-display font-bold text-2xl text-[#2D2926]">
              Tasting Review Certified!
            </h3>
            <p className="text-xs text-[#5E5854] max-w-sm mx-auto leading-relaxed">
              Thank you, <strong>{sanitizeName(name)}</strong>. Your sensory tasting feedback for <strong>{selectedProduct.name}</strong> has been pinned to the verified community lookbook.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-3 rounded-full bg-[#2D2926] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-all cursor-pointer shadow-md"
              >
                Return to Coffee
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E05A7E] mb-1">
                <Sparkles className="h-3.5 w-3.5 text-[#E05A7E]" />
                <span>COMMUNITY TASTING LEDGER</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-[#2D2926]">
                Review Your Roasted Micro-Lot
              </h3>
              <p className="text-xs text-[#5E5854] mt-0.5">
                Share your sensory cupping notes, bloom aroma, and brew calibration with fellow coffee patrons.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Selector */}
              <div>
                <label className="block text-[10px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                  Selected Coffee Micro-Lot:
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-sans font-bold text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                >
                  {NOIR_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.num} {p.name} ({p.origin})
                    </option>
                  ))}
                </select>
              </div>

              {/* Star Rating Picker */}
              <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#8C827A] block">
                    Cupping Score Rating
                  </span>
                  <span className="font-display font-bold text-sm text-[#2D2926]">
                    {rating} out of 5 Stars
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          className={`h-6 w-6 transition-colors ${
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

              {/* Name & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Krishnan"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#2D2926]/15 bg-white text-xs text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                    Your City / Region
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Indiranagar, Bengaluru"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#2D2926]/15 bg-white text-xs text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                  />
                </div>
              </div>

              {/* Role & Brew Gear */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                    Coffee Passion / Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Filter Kaapi Purist / Q-Grader"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#2D2926]/15 bg-white text-xs text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                    Brew Equipment Used
                  </label>
                  <select
                    value={brewMethod}
                    onChange={(e) => setBrewMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#2D2926]/15 bg-white text-xs text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                  >
                    {BREW_METHODS_LIST.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sensory Flavor Tags Chips */}
              <div>
                <label className="block text-[10px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1.5">
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
                        className={`px-2.5 py-1 rounded-full text-[11px] font-sans font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2D2926] text-white shadow-2xs font-bold'
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
                <label className="block text-[10px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                  Your Tasting Notes & Review *
                </label>
                <textarea
                  required
                  rows={3}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Describe the mouthfeel, extraction crema, sweetness, or morning brew experience..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#2D2926]/15 bg-white text-xs text-[#2D2926] placeholder-[#8C827A] focus:outline-none focus:border-[#2D2926]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#2D2926] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md cursor-pointer active:scale-95"
                >
                  <Send className="h-3.5 w-3.5 text-[#E05A7E]" />
                  <span>Submit to Community Cupping Ledger</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#8C827A] pt-1">
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
