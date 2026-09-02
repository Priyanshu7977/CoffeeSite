import React, { useState } from 'react';
import { ArrowUp, Compass, Star, Mail, Check } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface FooterProps {
  onBackToTop: () => void;
  onNavigate?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onBackToTop, onNavigate }) => {
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

  const reviews = [
    {
      id: 'rev-01',
      name: 'Dr. Vikramaditya Rao',
      role: 'Licensed Q-Grader & Estate Sommelier',
      lot: 'BABA BUDAN OBSIDIAN • 1,900M',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      quote: 'The high-elevation Baba Budan micro-lot is extraordinary. The smoked cardamom nuances and dark cacao finish rival the finest Geishas in the world.',
    },
    {
      id: 'rev-02',
      name: 'Ananya Deshmukh',
      role: 'Beverage Director • Mumbai Cellar',
      lot: 'MALABAR MONSOONED CASK',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      quote: 'The golden crema on the Malabar Monsooned extraction is like liquid silk. Notes of jaggery molasses without a trace of harsh acidity.',
    },
    {
      id: 'rev-03',
      name: 'Chef Rohan Mehra',
      role: 'Executive Chef • Bengaluru',
      lot: 'FILTER KAAPI CEREMONY',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      quote: 'When poured between traditional brass davarah and tumbler, the aeration produces a golden foam that elevates Indian coffee to haute cuisine.',
    },
    {
      id: 'rev-04',
      name: 'Pooja Hegde',
      role: 'Specialty Coffee Advocate • Kodagu',
      lot: 'COORG RAINFOREST PEABERRY',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      quote: 'The spherical Kodagu peaberries roast with remarkable evenness. Wild dark berries and silver oak resin in every cup.',
    },
  ];

  return (
    <footer className="relative bg-[#1F1C1A] text-[#FAF7F5] pt-16 pb-12 overflow-hidden border-t border-white/10">
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        {/* Reviews Section */}
        <div className="mb-14 text-center max-w-xl mx-auto">
          <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#E05A7E] font-bold block mb-2">
            PRAISE & CRITICAL ACCLAIM
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-white font-bold">
            Words from the <span className="italic text-[#F5DADF] font-medium">cellar.</span>
          </h2>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-3xl bg-[#2D2926] border border-white/10 p-5 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-[#F5DADF] mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#F5DADF]" />
                  ))}
                </div>
                <p className="font-serif text-xs text-[#FAF7F5]/85 leading-relaxed mb-4">
                  “{rev.quote}”
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="h-9 w-9 rounded-full object-cover border border-[#F5DADF]"
                />
                <div>
                  <h4 className="font-display text-sm font-bold text-white">
                    {rev.name}
                  </h4>
                  <span className="text-[10px] font-mono text-[#F5DADF] font-bold block truncate max-w-[150px]">
                    {rev.lot}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation & Newsletter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 pb-12 border-b border-white/10">
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
              Atelier Sitemap
            </span>
            <ul className="space-y-1.5 text-xs font-sans text-[#FAF7F5]/75">
              <li><a href="#section-collection" onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate('#section-collection'); } : undefined} className="hover:text-[#F5DADF] transition-colors">Coffee Collection</a></li>
              <li><a href="#section-bean" onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate('#section-bean'); } : undefined} className="hover:text-[#F5DADF] transition-colors">Our Origin Story</a></li>
              <li><a href="#section-roast" onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate('#section-roast'); } : undefined} className="hover:text-[#F5DADF] transition-colors">Thermal Roastery</a></li>
              <li><a href="#section-brew-ritual" onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate('#section-brew-ritual'); } : undefined} className="hover:text-[#F5DADF] transition-colors">Brewing Rituals</a></li>
              <li><a href="#section-reserve" onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate('#section-reserve'); } : undefined} className="hover:text-[#F5DADF] transition-colors">Private Vault</a></li>
            </ul>
          </div>

          {/* Col 3: Newsletter */}
          <div className="md:col-span-4 space-y-2.5">
            <span className="text-xs font-sans tracking-widest text-[#F5DADF] uppercase font-bold block mb-2">
              VIP Dispatches
            </span>
            <p className="font-sans text-xs text-[#FAF7F5]/75 leading-relaxed">
              Receive private allocations of limited micro-lots before public release.
            </p>

            <form onSubmit={handleSubscribe} className="pt-1">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-full bg-[#2D2926] border border-white/15 px-4 py-2.5 pr-24 text-xs text-white placeholder-[#FAF7F5]/40 focus:border-[#F5DADF] focus:outline-none font-sans"
                />
                <button
                  type="submit"
                  className="absolute right-1 rounded-full bg-[#F5DADF] text-[#2D2926] px-4 py-1.5 text-xs font-sans font-bold uppercase hover:bg-white transition-all cursor-pointer shadow-sm"
                >
                  Join
                </button>
              </div>
              {isSubscribed && (
                <span className="text-[11px] text-[#F5DADF] flex items-center gap-1 mt-1.5 font-bold">
                  <Check className="h-3 w-3" /> Priority invitation confirmed.
                </span>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F5]/60">
          <span>© 1998–2026 NOIR DAKSHIN MAISON. ALL RIGHTS RESERVED.</span>

          <div className="flex items-center gap-4">
            <a href="mailto:atelier@noirroast.com" className="flex items-center gap-1.5 hover:text-[#F5DADF] transition-colors">
              <Mail className="h-3.5 w-3.5 text-[#E05A7E]" />
              <span>Contact Atelier</span>
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
