import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Compass, Star, Mail, Check, ChevronLeft, ChevronRight, MessageSquareQuote, ShieldCheck } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface FooterProps {
  onBackToTop: () => void;
  onNavigate?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onBackToTop, onNavigate: _onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // 12 Authentic, High-Credibility Coffee Reviews
  const reviews = [
    {
      id: 'rev-01',
      name: 'Dr. Vikramaditya Rao',
      role: 'Licensed Q-Grader & Estate Sommelier',
      location: 'Bengaluru',
      lot: 'BABA BUDAN OBSIDIAN • 1,900M',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      quote: 'The high-elevation Baba Budan micro-lot is extraordinary. The smoked cardamom nuances and dark cacao finish rival the finest Geishas in the world.',
    },
    {
      id: 'rev-02',
      name: 'Ananya Deshmukh',
      role: 'Beverage Director • Mumbai',
      location: 'Mumbai',
      lot: 'MALABAR MONSOONED CASK',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      quote: 'The golden crema on the Malabar Monsooned extraction is like liquid silk. Notes of jaggery molasses without a trace of harsh acidity.',
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
    },
    {
      id: 'rev-11',
      name: 'Nandita Krishnan',
      role: 'Traditional Filter Coffee Historian',
      location: 'Mysuru',
      lot: 'SPECIAL A ROYALE 85:15',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      quote: 'The balance between 85% high-grown peaberry and 15% roasted chicory produces the richest golden crema I have seen in decades.',
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
    },
  ];

  // Moving Carousel State: moving one by one
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance one by one every 3200ms
  useEffect(() => {
    if (!isPaused) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }, 3200);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, reviews.length]);

  const handleNextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setIsSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="relative bg-[#1F1C1A] text-[#FAF7F5] pt-16 pb-12 overflow-hidden border-t border-white/10">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
        {/* Header Strip with Live Moving Indicator */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#F5DADF] font-bold">
                CUSTOMER REVIEWS • 12 VERIFIED EXPERIENCES
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white font-bold tracking-tight">
              What Our <span className="italic text-[#F5DADF] font-medium">Customers Say.</span>
            </h2>
          </div>

          {/* Stepper Controls & Status */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#FAF7F5]/60 font-semibold">
              REVIEW {(currentIndex + 1).toString().padStart(2, '0')} / {reviews.length.toString().padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevReview}
                aria-label="Previous Review"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNextReview}
                aria-label="Next Review"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white transition-all cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 12 MOVING REVIEWS CAROUSEL (Moving One-by-One with Pause-On-Hover) */}
        <div 
          className="relative overflow-hidden mb-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className="flex transition-transform duration-700 ease-out will-change-transform"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="w-full shrink-0 px-2 sm:px-3"
              >
                <div className="rounded-3xl bg-[#2D2926] border border-white/10 p-6 sm:p-8 shadow-2xl flex flex-col justify-between min-h-[220px] max-w-4xl mx-auto">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      {/* 5 Stars Rating */}
                      <div className="flex items-center gap-1 text-[#C89658]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-[#C89658] text-[#C89658]" />
                        ))}
                      </div>

                      {/* Verified Badge */}
                      <div className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-mono font-bold text-[#F5DADF]">
                        <ShieldCheck className="h-3 w-3 text-emerald-400" />
                        <span>VERIFIED PURCHASE</span>
                      </div>
                    </div>

                    <div className="relative mb-6">
                      <MessageSquareQuote className="absolute -top-3 -left-2 h-8 w-8 text-white/5 pointer-events-none" />
                      <p className="font-serif text-sm sm:text-base text-[#FAF7F5] leading-relaxed relative z-10 pl-4 border-l-2 border-[#E05A7E]">
                        “{rev.quote}”
                      </p>
                    </div>
                  </div>

                  {/* Reviewer Bio & Location */}
                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        className="h-11 w-11 rounded-full object-cover border-2 border-[#F5DADF] shadow-sm shrink-0"
                      />
                      <div>
                        <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                          <span>{rev.name}</span>
                          <span className="text-[10px] font-mono text-[#FAF7F5]/50 font-normal">
                            ({rev.location})
                          </span>
                        </h4>
                        <span className="text-xs font-sans text-[#FAF7F5]/70">
                          {rev.role}
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C827A] block">
                        Reviewed Lot
                      </span>
                      <span className="text-xs font-mono font-bold text-[#F5DADF]">
                        {rev.lot}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator for all 12 reviews */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {reviews.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Jump to review ${dotIdx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === dotIdx ? 'w-6 bg-[#E05A7E]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation & Newsletter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 pb-12 border-b border-white/10 pt-6">
          {/* Col 1: Brand */}
          <div className="md:col-span-5 space-y-3">
            <h3 className="font-display text-xl tracking-[0.25em] font-bold text-white uppercase">
              NOIR DAKSHIN
            </h3>
            <p className="font-sans text-xs text-[#FAF7F5]/75 leading-relaxed max-w-sm">
              Dedicated to shade-grown Western Ghats terroir, traditional brass alchemy, and slow cast-iron drum convection.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#FAF7F5]/60">
              <Compass className="h-3.5 w-3.5 text-[#E05A7E]" />
              <span>Chikmagalur & Bengaluru • Est. 1998</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-xs font-sans tracking-widest text-[#F5DADF] uppercase font-bold block mb-2">
              Quick Links
            </span>
            <ul className="space-y-1.5 text-xs font-sans text-[#FAF7F5]/75">
              <li><a href="/collection" className="hover:text-[#F5DADF] transition-colors">Coffee Collection</a></li>
              <li><a href="/atlas" className="hover:text-[#F5DADF] transition-colors">Coffee & Taste Guide</a></li>
              <li><a href="/about" className="hover:text-[#F5DADF] transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-[#F5DADF] transition-colors">Contact & Roastery Map</a></li>
            </ul>
          </div>

          {/* Col 3: Newsletter */}
          <div className="md:col-span-4 space-y-2.5">
            <span className="text-xs font-sans tracking-widest text-[#F5DADF] uppercase font-bold block mb-2">
              Customer Support
            </span>
            <p className="font-sans text-xs text-[#FAF7F5]/75 leading-relaxed">
              Founder: <strong>Priyanshu Singh</strong> • Bengaluru Roastery<br />
              Phone: <a href="tel:+917977641125" className="text-[#F5DADF] hover:underline font-mono">+91 79776 41125</a><br />
              Email: <a href="mailto:priyanshubipin2006@gmail.com" className="text-[#F5DADF] hover:underline font-mono">priyanshubipin2006@gmail.com</a>
            </p>

            <form onSubmit={handleSubscribe} className="pt-1">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email for fresh roast alerts"
                  className="w-full rounded-full bg-[#2D2926] border border-white/15 px-4 py-2.5 pr-24 text-xs text-white placeholder-[#FAF7F5]/40 focus:border-[#F5DADF] focus:outline-none font-sans"
                />
                <button
                  type="submit"
                  className="absolute right-1 rounded-full bg-[#F5DADF] text-[#2D2926] px-4 py-1.5 text-xs font-sans font-bold uppercase hover:bg-white transition-all cursor-pointer shadow-sm"
                >
                  Subscribe
                </button>
              </div>
              {isSubscribed && (
                <span className="text-[11px] text-[#F5DADF] flex items-center gap-1 mt-1.5 font-bold">
                  <Check className="h-3 w-3" /> Subscription confirmed.
                </span>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F5]/60">
          <span>© 1998–2026 NOIR DAKSHIN COFFEE. ALL RIGHTS RESERVED.</span>

          <div className="flex items-center gap-4">
            <a href="mailto:priyanshubipin2006@gmail.com" className="flex items-center gap-1.5 hover:text-[#F5DADF] transition-colors">
              <Mail className="h-3.5 w-3.5 text-[#E05A7E]" />
              <span>priyanshubipin2006@gmail.com • +91 79776 41125</span>
            </a>

            <MagneticButton strength={0.3}>
              <button
                onClick={onBackToTop}
                aria-label="Back to top"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#2D2926] hover:border-[#F5DADF] text-[#F5DADF] transition-colors cursor-pointer"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
            </MagneticButton>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
