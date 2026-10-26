import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, ShieldCheck, Package } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import type { UserSession } from './LoginModal';

interface NavbarProps {
  onOpenReserve?: () => void;
  onOpenCollection: () => void;
  onOpenLogin: () => void;
  onOpenInventoryHud: () => void;
  userSession: UserSession | null;
  collectionCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReserve: _onOpenReserve,
  onOpenCollection,
  onOpenLogin,
  onOpenInventoryHud,
  userSession,
  collectionCount,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollY <= 40 || isMobileMenuOpen) {
        setIsVisible(true);
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      const diff = currentScrollY - lastScrollY;
      if (Math.abs(diff) > 8) {
        setIsVisible(diff < 0);
        lastScrollY = currentScrollY;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(handleScroll);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobileMenuOpen]);

  // Handle in-page anchors vs route navigation
  const handleNavClick = (path: string, anchor?: string) => {
    setIsMobileMenuOpen(false);
    if (anchor && location.pathname === '/') {
      const el = document.querySelector(anchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(path);
  };

  return (
    <header
      className={`fixed top-3 sm:top-5 left-0 right-0 z-[100] px-3 sm:px-6 pointer-events-none transition-all duration-500 ease-out will-change-transform pt-[max(env(safe-area-inset-top),0px)] ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'
      }`}
    >
      <div className="pointer-events-auto mx-auto max-w-5xl rounded-full border border-[#2D2926]/10 bg-white/92 px-4 sm:px-6 py-2.5 sm:py-3 shadow-[0_10px_35px_rgba(45,41,38,0.08)] backdrop-blur-xl flex items-center justify-between gap-3 sm:gap-6 text-[#2D2926]">
        {/* Brand Left */}
        <MagneticButton strength={0.3}>
          <button
            onClick={() => handleNavClick('/')}
            className="group flex items-center gap-2.5 text-left focus:outline-none cursor-pointer shrink-0"
          >
            <div className="flex items-center justify-center h-7 w-7 rounded-full bg-[#2D2926] text-white group-hover:bg-[#E05A7E] transition-all duration-300 shadow-sm">
              <span className="font-display text-xs font-bold tracking-tighter">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xs sm:text-sm tracking-[0.22em] font-bold text-[#2D2926] uppercase transition-colors group-hover:text-[#E05A7E] leading-none">
                NOIR DAKSHIN
              </span>
              <span className="text-[8px] font-mono tracking-[0.16em] text-[#8C827A] uppercase leading-tight mt-0.5 font-semibold">
                EST. 1998
              </span>
            </div>
          </button>
        </MagneticButton>

        {/* Center Multi-Page Navigation Links */}
        <nav className="hidden items-center gap-5 lg:gap-6 md:flex shrink-0">
          {[
            { label: 'COLLECTION', path: '/collection' },
            { label: 'BREW LAB', path: '/brew' },
            { label: 'ABOUT US', path: '/about' },
            { label: 'CONTACT', path: '/contact' },
          ].map((item) => (
            <MagneticButton key={item.label} strength={0.25}>
              <button
                onClick={() => handleNavClick(item.path)}
                className={`group relative font-sans text-xs tracking-[0.2em] font-semibold transition-colors py-1 cursor-pointer ${
                  location.pathname === item.path ? 'text-[#E05A7E]' : 'text-[#5E5854] hover:text-[#2D2926]'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-[#E05A7E] transition-all duration-300 ${
                    location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            </MagneticButton>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Inventory HUD Trigger */}
          <button
            onClick={onOpenInventoryHud}
            className="flex items-center gap-1 rounded-full border border-[#2D2926]/15 bg-[#FAF7F5] px-2.5 py-1.5 text-[11px] font-mono font-bold text-[#2D2926] hover:bg-neutral-100 transition-colors"
            title="Open Real-Time Inventory Control HUD"
          >
            <Package className="h-3.5 w-3.5 text-[#E05A7E]" />
            <span className="hidden xl:inline">Stock</span>
          </button>

          {/* VIP Status */}
          <MagneticButton strength={0.3}>
            <button
              onClick={() => {
                if (userSession?.isLoggedIn) {
                  navigate('/account');
                } else {
                  onOpenLogin();
                }
              }}
              className={`flex items-center gap-1.5 rounded-full border px-3 sm:px-3.5 py-1.5 text-[11px] font-sans tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer ${
                userSession?.isLoggedIn
                  ? 'border-[#E05A7E] bg-[#F5DADF] text-[#2D2926] font-bold'
                  : 'border-[#2D2926]/15 bg-[#FAF7F5] text-[#2D2926] hover:bg-[#F5DADF]/40'
              }`}
            >
              {userSession?.isLoggedIn ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2D2926]" />
                  <span className="max-w-[70px] sm:max-w-[90px] truncate font-bold">
                    {userSession.name.split(' ')[0]}
                  </span>
                </>
              ) : (
                <>
                  <User className="h-3.5 w-3.5 text-[#5E5854]" />
                  <span className="hidden sm:inline font-bold">VIP Pass</span>
                </>
              )}
            </button>
          </MagneticButton>

          {/* Cart Counter */}
          <MagneticButton strength={0.35}>
            <button
              onClick={onOpenCollection}
              className={`flex items-center gap-1.5 rounded-full border px-3 sm:px-3.5 py-1.5 text-[11px] font-sans tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer ${
                collectionCount > 0
                  ? 'border-[#2D2926]/15 bg-[#F5DADF] text-[#2D2926] font-bold shadow-sm'
                  : 'border-[#2D2926]/15 bg-[#FAF7F5] text-[#2D2926] hover:bg-[#F5DADF]/40'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#2D2926]" />
              <span>({collectionCount.toString().padStart(2, '0')})</span>
            </button>
          </MagneticButton>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2D2926]/15 bg-[#FAF7F5] text-[#2D2926] md:hidden cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-3.5 w-3.5 text-[#2D2926]" /> : <Menu className="h-3.5 w-3.5 text-[#2D2926]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="pointer-events-auto mx-auto max-w-lg mt-2 rounded-3xl bg-white/98 border border-[#2D2926]/10 p-5 shadow-2xl md:hidden animate-fadeIn backdrop-blur-xl">
          <div className="flex flex-col gap-3">
            {[
              { label: 'HOME OVERVIEW', path: '/' },
              { label: 'SPECIALTY COFFEE LOTS', path: '/collection' },
              { label: 'BREW LAB & GUIDES', path: '/brew' },
              { label: 'ABOUT OUR STARTUP', path: '/about' },
              { label: 'CONTACT & ROASTERY MAP', path: '/contact' },
              { label: 'CURATED ALLOCATION CART', path: '/cart' },
              { label: 'VIP MEMBER ACCOUNT', path: '/account' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className={`text-left font-display text-sm tracking-[0.18em] py-1 cursor-pointer border-b border-[#2D2926]/5 pb-2 font-semibold ${
                  location.pathname === item.path ? 'text-[#E05A7E]' : 'text-[#2D2926] hover:text-[#E05A7E]'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenInventoryHud();
                }}
                className="flex-1 py-2.5 rounded-xl border border-[#2D2926]/20 bg-[#FAF7F5] text-xs font-bold text-[#2D2926] flex items-center justify-center gap-1.5"
              >
                <Package className="h-3.5 w-3.5 text-[#E05A7E]" />
                <span>Live Stock HUD</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/collection');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#2D2926] text-white text-xs font-bold uppercase tracking-wider shadow-md"
              >
                Shop 10 Lots
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
