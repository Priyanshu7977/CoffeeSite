import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Compass, Mail, Check } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { ReviewsRollingSection } from './ReviewsRollingSection';

interface FooterProps {
  onBackToTop: () => void;
  onNavigate?: (sectionId: string) => void;
  showReviews?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onBackToTop,
  onNavigate: _onNavigate,
  showReviews = true,
}) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

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
    <footer className={`relative bg-[#1F1C1A] text-[#FAF7F5] pb-12 overflow-hidden border-t border-white/10 ${
      showReviews ? 'pt-4' : 'pt-10'
    }`}>
      {/* 1. ROLLING EFFECT REVIEWS WITH CARD FLIP & 3D ROTATION (Showcase Only) */}
      {showReviews && <ReviewsRollingSection />}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-12 pt-8">

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

          {/* Col 2: Navigation & Track Order */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-xs font-sans tracking-widest text-[#F5DADF] uppercase font-bold block mb-2">
              Quick Links & Tracking
            </span>
            <ul className="space-y-1.5 text-xs font-sans text-[#FAF7F5]/75">
              <li><Link to="/collection" className="hover:text-[#F5DADF] transition-colors">Coffee Collection</Link></li>
              <li><Link to="/track" className="text-[#F5DADF] font-bold hover:underline flex items-center gap-1.5"><span>Live Order Tracking</span><span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded">NEW</span></Link></li>
              <li><Link to="/atlas" className="hover:text-[#F5DADF] transition-colors">Coffee & Origin Guide</Link></li>
              <li><Link to="/about" className="hover:text-[#F5DADF] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#F5DADF] transition-colors">Contact & Roastery Map</Link></li>
              <li className="pt-2 text-[11px] text-[#FAF7F5]/50 flex flex-wrap gap-x-2 gap-y-1">
                <Link to="/shipping" className="hover:text-[#F5DADF] underline">Shipping</Link>
                <span>•</span>
                <Link to="/refund" className="hover:text-[#F5DADF] underline">Returns</Link>
                <span>•</span>
                <Link to="/terms" className="hover:text-[#F5DADF] underline">Terms</Link>
                <span>•</span>
                <Link to="/privacy" className="hover:text-[#F5DADF] underline">Privacy</Link>
              </li>
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
                  placeholder="Enter your email address"
                  className="w-full rounded-full bg-[#2D2926] border border-white/15 px-4 py-2.5 pr-24 text-xs text-white placeholder-[#FAF7F5]/40 focus:border-[#F5DADF] focus:outline-none font-sans"
                />
                <button
                  type="submit"
                  className="absolute right-1 rounded-full bg-[#F5DADF] text-[#2D2926] px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-sans font-bold uppercase hover:bg-white transition-all cursor-pointer shadow-sm"
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs text-[#FAF7F5]/60 text-center sm:text-left">
          <span>© 1998–2026 NOIR DAKSHIN COFFEE. ALL RIGHTS RESERVED.</span>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4">
            <a href="mailto:priyanshubipin2006@gmail.com" className="flex items-center gap-1.5 hover:text-[#F5DADF] transition-colors break-all">
              <Mail className="h-3.5 w-3.5 text-[#E05A7E] shrink-0" />
              <span>priyanshubipin2006@gmail.com • +91 79776 41125</span>
            </a>

            <MagneticButton strength={0.3}>
              <button
                onClick={onBackToTop}
                aria-label="Back to top"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#2D2926] hover:border-[#F5DADF] text-[#F5DADF] transition-colors cursor-pointer shrink-0"
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
