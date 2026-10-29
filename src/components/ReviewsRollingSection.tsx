import React, { useState, useRef } from 'react';
import { 
  Star, 
  ShieldCheck, 
  RotateCw, 
  Quote, 
  Coffee, 
  MapPin,
  PenLine
} from 'lucide-react';
import { ReviewSubmissionModal } from './ReviewSubmissionModal';

export interface CustomerReview {
  id: string;
  name: string;
  role: string;
  location: string;
  lot: string;
  rating: number;
  avatar: string;
  quote: string;
  category: 'all' | 'kaapi' | 'pourover' | 'aeropress' | 'monsooned' | 'single-estate';
  elevation: string;
  process: string;
  notes: string[];
  brewMethod: string;
  roastBatch: string;
  productId?: string;
  productName?: string;
}


export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-01',
    name: 'Dr. Vikramaditya Rao',
    role: 'Licensed Q-Grader & Sommelier',
    location: 'Bengaluru',
    lot: 'BABA BUDAN OBSIDIAN • 1,900M',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    quote: 'The high-elevation Baba Budan micro-lot is extraordinary. The smoked cardamom nuances and dark cacao finish rival the finest Geishas in the world.',
    category: 'single-estate',
    elevation: '1,900m ASL • Baba Budangiri',
    process: '96h Anaerobic Natural',
    notes: ['Smoked Cardamom', '88% Dark Cacao', 'Jasmine Blossom'],
    brewMethod: 'Fellow Stagg Dripper @ 92°C (1:15 ratio)',
    roastBatch: 'Roast Batch #BB-1900',
  },
  {
    id: 'rev-02',
    name: 'Ananya Deshmukh',
    role: 'Beverage Director',
    location: 'Mumbai',
    lot: 'MALABAR MONSOONED CASK',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    quote: 'The golden crema on the Malabar Monsooned extraction is like liquid silk. Notes of jaggery molasses without a trace of harsh acidity.',
    category: 'monsooned',
    elevation: '1,100m ASL • Malabar Coast',
    process: '16-Week Maritime Sea Wind Curing',
    notes: ['Jaggery Molasses', 'Molten Chocolate', 'Toasted Oak'],
    brewMethod: 'Bottomless Portafilter Espresso (18g in → 36g out)',
    roastBatch: 'Roast Batch #MM-402',
  },
  {
    id: 'rev-03',
    name: 'Chef Rohan Mehra',
    role: 'Executive Chef • Bengaluru Bistro',
    location: 'Bengaluru',
    lot: 'FILTER KAAPI CEREMONY',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    quote: 'When poured between traditional brass davarah and tumbler, the aeration produces a golden foam that elevates Indian coffee to haute cuisine.',
    category: 'kaapi',
    elevation: '1,400m ASL • Chikmagalur',
    process: 'Cast-Iron Convection Drum Roast',
    notes: ['Caramelised Jaggery', 'Golden Crema', 'Cacao Nibs'],
    brewMethod: 'Traditional Brass Davarah & Tumbler Aeration',
    roastBatch: 'Roast Batch #FK-1998',
  },
  {
    id: 'rev-04',
    name: 'Pooja Hegde',
    role: 'Specialty Coffee Advocate',
    location: 'Kodagu (Coorg)',
    lot: 'COORG RAINFOREST PEABERRY',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    quote: 'The spherical Kodagu peaberries roast with remarkable evenness. Wild dark berries and silver oak resin in every single cup.',
    category: 'single-estate',
    elevation: '1,350m ASL • Kodagu Rainforest',
    process: 'Canopy Shade-Grown Natural',
    notes: ['Wild Dark Berries', 'Silver Oak Resin', 'Brown Butter'],
    brewMethod: 'French Press (4-minute full immersion steep)',
    roastBatch: 'Roast Batch #PB-88',
  },
  {
    id: 'rev-05',
    name: 'Aditya Verma',
    role: 'Senior Architect & Home Barista',
    location: 'Indiranagar, BLR',
    lot: 'DAKSHIN RESERVE 1998',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    quote: 'Hands down the most authentic South Indian roast I have ever tasted. Thick viscous first decoction that cuts right through hot steamed milk.',
    category: 'kaapi',
    elevation: '1,600m ASL • Western Ghats Ridge',
    process: 'Slow Drum Roast Arabica Selection',
    notes: ['Nutmeg', 'Bittersweet 88% Cocoa', 'Caramelized Sugar'],
    brewMethod: 'Stainless Indian Gravity Filter Decoction',
    roastBatch: 'Roast Batch #DR-1998',
  },
  {
    id: 'rev-06',
    name: 'Meera Swaminathan',
    role: 'Classical Musician & Kaapi Purist',
    location: 'Mylapore, Chennai',
    lot: '80:20 MADRAS TRADITIONAL',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    quote: 'Reminds me of dawn in Mylapore. The aroma of freshly roasted beans fills the entire house. Pure nostalgia with world-class roastery polish.',
    category: 'kaapi',
    elevation: '1,450m ASL • Shevaroy Ridge',
    process: '80:20 Specialty Arabica & Chicory',
    notes: ['Toasted Hazelnut', 'Roasted Chicory', 'Dark Molasses'],
    brewMethod: 'Mylapore First Decoction with Steamed Milk',
    roastBatch: 'Roast Batch #MT-8020',
  },
  {
    id: 'rev-07',
    name: 'Karan Singhania',
    role: 'Founder • Specialty Roastery Lab',
    location: 'New Delhi',
    lot: 'ARAKU VALLEY TRIBAL HONEY',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    quote: 'The red loam sweetness of the Araku honey process is staggering. Notes of wild orange blossom and buttery toasted cashew on the cupping table.',
    category: 'pourover',
    elevation: '1,200m ASL • Araku Valley',
    process: 'Pulped Red Honey Fermentation',
    notes: ['Wild Orange Blossom', 'Toasted Cashew', 'Honey Butter'],
    brewMethod: 'Origami Dripper @ 91°C with Kalita Wave Filter',
    roastBatch: 'Roast Batch #AV-701',
  },
  {
    id: 'rev-08',
    name: 'Shreya Nambiar',
    role: 'Culinary Journalist & Author',
    location: 'Kochi',
    lot: 'MALABAR MONSOONED SHORE',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    quote: 'Zero sourness, maximum velvety mouthfeel. The 16-week maritime wind curing really transforms the bean into molten dark chocolate.',
    category: 'monsooned',
    elevation: '1,150m ASL • Arabian Sea Shore',
    process: 'Coastal Monsoon Wind Curing',
    notes: ['Velvety Dark Chocolate', 'Bourbon Vanilla', 'Pipe Tobacco'],
    brewMethod: 'Bialetti Moka Pot (slow extraction)',
    roastBatch: 'Roast Batch #MS-16W',
  },
  {
    id: 'rev-09',
    name: 'Prof. Arishta Sen',
    role: 'Biochemist & Sensory Judge',
    location: 'Bengaluru',
    lot: 'CHIKMAGALUR ELEPHANT MONSOONED',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    quote: 'The 22° Brix cherry harvest standard produces an extraordinarily clean sucrose curve. A benchmark Indian specialty lot.',
    category: 'pourover',
    elevation: '1,500m ASL • Chikmagalur',
    process: 'Graded AA 22° Brix Cherry Harvest',
    notes: ['Bourbon Vanilla Bean', 'Raw Cane Sugar', 'Sweet Almond'],
    brewMethod: 'Hario V60 Ceramic @ 92°C (1:16 ratio)',
    roastBatch: 'Roast Batch #EM-22B',
  },
  {
    id: 'rev-10',
    name: 'Devraj Patel',
    role: 'Artisan Cafe Owner',
    location: 'Ahmedabad',
    lot: 'KODAGU WILD SPICE CINNAMON',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    quote: 'You can actually taste the intercropped wild cinnamon and green pepper terroir. Our cafe patrons order this lot by the carton.',
    category: 'single-estate',
    elevation: '1,380m ASL • Coorg Buffer Zone',
    process: 'Intercropped Cinnamon Terroir Natural',
    notes: ['Ceylon Cinnamon', 'Black Pepper', 'Ripe Dark Plum'],
    brewMethod: 'Inverted AeroPress Method (2 min steep)',
    roastBatch: 'Roast Batch #WC-104',
  },
  {
    id: 'rev-11',
    name: 'Nandita Krishnan',
    role: 'Filter Coffee Historian',
    location: 'Mysuru',
    lot: 'SPECIAL A ROYALE 85:15',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    quote: 'The balance between 85% high-grown peaberry and 15% roasted chicory produces the richest golden crema I have seen in decades.',
    category: 'kaapi',
    elevation: '1,480m ASL • Biligirirangana Hills',
    process: 'Double-Sorted High-Grown Peaberry',
    notes: ['Malted Barley', 'Honeyed Chicory', 'Creamy Fudge'],
    brewMethod: 'Heavy Brass Indian Filter Decoction',
    roastBatch: 'Roast Batch #SA-8515',
  },
  {
    id: 'rev-12',
    name: 'Tanmay Joshi',
    role: 'National AeroPress Finalist',
    location: 'Pune',
    lot: 'MULLAYANAGIRI CLOUD MIST',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    quote: 'Extracted at 93°C, it reveals delicate jasmine florals followed by a lingering Mysore cocoa finish. World-class bean craft.',
    category: 'aeropress',
    elevation: '1,930m ASL • Mullayanagiri Peak',
    process: 'Cloud Mist Washed Cold Ferment',
    notes: ['Jasmine Florals', 'Mysore Cocoa', 'Meyer Lemon'],
    brewMethod: 'Competition AeroPress @ 93°C (1:14 ratio)',
    roastBatch: 'Roast Batch #MM-1930',
  },
];

// Alternating Celestia lookbook organic tilt angles
const CARD_TILTS = [
  '-rotate-1.5',
  'rotate-1',
  '-rotate-2',
  'rotate-1.5',
  '-rotate-1',
  'rotate-2',
];

interface ReviewCardProps {
  review: CustomerReview;
  index: number;
  isFlipped: boolean;
  onToggleFlip: (id: string) => void;
}

/**
 * 3D Flippable, Rotating Review Card with interactive sheen & perspective
 * Inspired by Celestia's 3D card tilt and luxury community lookbook
 */
const FlipReviewCard: React.FC<ReviewCardProps> = ({
  review,
  index,
  isFlipped,
  onToggleFlip,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [sheen, setSheen] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [tilt, setTilt] = useState<{ tiltX: number; tiltY: number }>({
    tiltX: 0,
    tiltY: 0,
  });

  const tiltClass = CARD_TILTS[index % CARD_TILTS.length];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -5;
    const tiltY = ((x - centerX) / centerX) * 5;

    setTilt({ tiltX, tiltY });
    setSheen({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.18,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ tiltX: 0, tiltY: 0 });
    setSheen((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group w-[280px] min-[380px]:w-[320px] sm:w-[360px] h-[330px] sm:h-[340px] shrink-0 transition-transform duration-500 ease-out perspective-1200 cursor-pointer select-none ${tiltClass} hover:rotate-0 hover:scale-[1.03] hover:z-20`}
      onClick={() => onToggleFlip(review.id)}
      role="button"
      tabIndex={0}
      aria-label={`Customer review by ${review.name}. Click to flip card.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggleFlip(review.id);
        }
      }}
    >
      <div
        className={`flip-card-inner preserve-3d h-full w-full rounded-3xl transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          isFlipped ? 'is-flipped' : ''
        }`}
        style={
          !isFlipped
            ? {
                transform: `rotateX(${tilt.tiltX.toFixed(2)}deg) rotateY(${tilt.tiltY.toFixed(2)}deg)`,
              }
            : undefined
        }
      >
        {/* Dynamic Sheen Light Glare (Celestia os-inspired) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-3xl pointer-events-none z-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 200px at ${sheen.x}% ${sheen.y}%, rgba(245, 218, 223, ${sheen.opacity}) 0%, transparent 80%)`,
          }}
        />

        {/* ================= FRONT FACE ================= */}
        <div className="flip-card-front backface-hidden rounded-3xl bg-[#2D2926] border border-white/10 p-5 sm:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 bg-[#E05A7E]/15 rounded-full blur-2xl" />

          <div>
            {/* Top Bar: Stars + Verified Badge */}
            <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
              <div className="flex items-center gap-1 text-[#C89658]">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#C89658] text-[#C89658]" />
                ))}
              </div>

              <div className="flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[9px] font-mono font-bold text-[#F5DADF]">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span>VERIFIED</span>
              </div>
            </div>

            {/* Quote Body */}
            <div className="relative mb-3 z-10">
              <Quote className="h-4 w-4 text-[#E05A7E] opacity-50 mb-1" />
              <p className="font-serif text-xs sm:text-[13px] text-[#FAF7F5] leading-relaxed line-clamp-4 pl-2.5 border-l-2 border-[#E05A7E]">
                "{review.quote}"
              </p>
            </div>
          </div>

          {/* Bottom Info: Reviewer Profile */}
          <div className="relative z-10 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="h-10 w-10 rounded-full object-cover border-2 border-[#F5DADF] shadow-sm shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <h4 className="font-display text-xs font-bold text-white truncate flex items-center gap-1">
                    <span>{review.name}</span>
                  </h4>
                  <span className="text-[10px] text-[#FAF7F5]/70 block truncate">
                    {review.role}
                  </span>
                  <span className="text-[9px] font-mono text-[#E05A7E] flex items-center gap-0.5">
                    <MapPin className="h-2.5 w-2.5" />
                    <span>{review.location}</span>
                  </span>
                </div>
              </div>

              {/* Reviewed Coffee Tag */}
              <div className="text-right shrink-0 max-w-[120px]">
                <span className="text-[8px] font-mono uppercase tracking-wider text-[#8C827A] block">
                  COFFEE
                </span>
                <span className="text-[10px] font-mono font-bold text-[#F5DADF] truncate block">
                  {review.lot.split('•')[0].trim()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BACK FACE ================= */}
        <div className="flip-card-back backface-hidden rounded-3xl bg-[#1A1817] border border-[#E05A7E]/30 p-5 sm:p-6 flex flex-col justify-between shadow-2xl text-left relative overflow-hidden">
          {/* Subtle Ambient Back Glow */}
          <div className="pointer-events-none absolute -bottom-10 -left-10 w-36 h-36 bg-[#E05A7E]/20 rounded-full blur-2xl" />

          <div>
            {/* Back Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
              <div className="flex items-center gap-1.5">
                <Coffee className="h-3.5 w-3.5 text-[#E05A7E]" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#F5DADF] font-bold">
                  ROAST & EXTRACTION LOG
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFlip(review.id);
                }}
                className="flex items-center gap-1 text-[10px] font-mono text-[#FAF7F5]/70 hover:text-white transition-colors"
              >
                <span>Flip</span>
                <RotateCw className="h-3 w-3 text-[#E05A7E]" />
              </button>
            </div>

            {/* Lot Name */}
            <h4 className="font-display text-sm font-bold text-white mb-2 line-clamp-1">
              {review.lot}
            </h4>

            {/* Extraction Specs */}
            <div className="space-y-2 text-[11px] font-sans">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#8C827A]">Elevation:</span>
                <span className="font-mono text-white font-semibold">{review.elevation}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#8C827A]">Processing:</span>
                <span className="text-white font-medium truncate max-w-[170px]">{review.process}</span>
              </div>
              <div className="py-1 border-b border-white/5">
                <span className="text-[#8C827A] block mb-1">Tasting Notes:</span>
                <div className="flex flex-wrap gap-1">
                  {review.notes.map((n, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-mono text-[#F5DADF] border border-white/10"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#8C827A]">Recommended Brew:</span>
                <span className="text-[#E05A7E] font-medium text-[10px] truncate max-w-[160px] text-right">
                  {review.brewMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Back Footer */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#FAF7F5]/60">
            <span className="text-emerald-400 font-semibold">{review.roastBatch}</span>
            <span className="text-[#F5DADF] font-bold">✓ 100% Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReviewsRollingSection: React.FC = () => {
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [customReviews, setCustomReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem('noir_custom_reviews_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const trackRef = useRef<HTMLDivElement>(null);

  // Combine custom patron reviews with curate reviews
  const allReviews = [...customReviews, ...CUSTOMER_REVIEWS];
  // Duplicate for seamless infinite rolling marquee
  const rollingReviews = [...allReviews, ...allReviews];

  const handleToggleFlip = (id: string) => {
    setFlippedCardId((prev) => (prev === id ? null : id));
  };

  const handleReviewSubmitted = (newReview: CustomerReview) => {
    setCustomReviews((prev) => [newReview, ...prev]);
  };

  return (
    <section className="relative w-full py-12 overflow-hidden border-b border-white/10">
      {/* Background Soft Lighting Gradients */}
      <div className="pointer-events-none absolute top-1/2 -left-20 w-80 h-80 bg-[#E05A7E]/10 rounded-full blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 right-10 w-96 h-96 bg-[#C89658]/10 rounded-full blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-12 mb-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6 text-center sm:text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold text-[#F5DADF] uppercase tracking-wider mb-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE CUSTOMER REVIEWS • {allReviews.length} VERIFIED EXPERIENCES</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              What Our <span className="italic text-[#F5DADF] font-medium">Customers Say.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF7F5]/70 mt-1 max-w-lg">
              Unfiltered feedback from certified Q-Graders, cafe baristas, and filter kaapi devotees across India.
            </p>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#E05A7E] hover:bg-[#c9496b] text-white text-xs font-mono font-bold tracking-wider uppercase shadow-md transition-all cursor-pointer self-center sm:self-auto active:scale-95 shrink-0"
          >
            <PenLine className="h-3.5 w-3.5" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* CONTINUOUS ROLLING MARQUEE TRACK (Infinite Rolling Effect) */}
      <div
        className="relative w-full overflow-hidden hover-pause"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left and Right Fade Gradients for Luxury Lookbook feel */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#1F1C1A] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#1F1C1A] to-transparent z-10" />

        {/* Rolling Inner Track */}
        <div
          ref={trackRef}
          className={`flex gap-6 py-6 px-4 animate-marquee-left ${
            isPaused ? '[animation-play-state:paused]' : ''
          }`}
          style={{
            animationDuration: `${Math.max(28, rollingReviews.length * 3.5)}s`,
          }}
        >
          {rollingReviews.map((review, idx) => (
            <FlipReviewCard
              key={`${review.id}-${idx}`}
              review={review}
              index={idx}
              isFlipped={flippedCardId === review.id}
              onToggleFlip={handleToggleFlip}
            />
          ))}
        </div>
      </div>

      {/* Review Submission Modal */}
      <ReviewSubmissionModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </section>
  );
};
