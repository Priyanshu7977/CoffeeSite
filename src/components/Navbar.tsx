import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, ShoppingBag, User, ShieldCheck } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import type { UserSession } from './LoginModal';

interface NavbarProps {
  onOpenReserve: () => void;
  onOpenCollection: () => void;
  onOpenLogin: () => void;
  userSession: UserSession | null;
  collectionCount: number;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReserve,
  onOpenCollection,
  onOpenLogin,
  userSession,
  collectionCount,
  onNavigate,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

      // Always show at the top of the page
      if (currentScrollY <= 40) {
        setIsVisible(true);
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      // Always keep visible if mobile menu is opened
      if (isMobileMenuOpen) {
        setIsVisible(true);
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      const diff = currentScrollY - lastScrollY;
      if (Math.abs(diff) > 6) {
        if (diff > 0) {
          // Scrolling Down -> Hide Header
          setIsVisible(false);
        } else {
          // Scrolling Up -> Show Header
          setIsVisible(true);
        }
        lastScrollY = currentScrollY;
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScrollDirection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'ORIGIN', target: '#section-bean' },
    { label: 'ROASTS', target: '#section-roast' },
    { label: 'POUR', target: '#section-pour' },
    { label: 'COLLECTION', target: '#section-collection' },
    { label: 'KAAPI RITUAL', target: '#section-brew-ritual' },
    { label: 'ABOUT', target: '#section-manifesto' },
  ];

  return (
    <header
      className={`fixed top-3 sm:top-5 left-0 right-0 z-[100] px-3 sm:px-6 pointer-events-none transition-all duration-500 ease-out will-change-transform ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-24 opacity-0'
      }`}
    >
      {/* Floating Circular Capsule Island */}
      <div className="pointer-events-auto mx-auto max-w-6xl rounded-full bg-[#090705]/92 border border-[#c89658]/35 px-4 sm:px-7 py-2.5 sm:py-3 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex items-center justify-between">
        {/* Brand Left with Magnetic Physics */}
        <MagneticButton strength={0.3}>
          <button
            onClick={() => onNavigate('#hero')}
            className="group flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none cursor-pointer"
          >
            <span className="h-2 w-2 rounded-full bg-[#c89658] shadow-[0_0_12px_#c89658] transition-transform group-hover:scale-125" />
            <div className="flex flex-col">
              <span className="font-display text-xs sm:text-sm tracking-[0.24em] font-bold text-[#f4eee6] transition-colors group-hover:text-[#c89658]">
                NOIR DAKSHIN
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.3em] text-[#8c827a] font-sans uppercase">
                Atelier 1998 • Bengaluru
              </span>
            </div>
          </button>
        </MagneticButton>

        {/* Center Navigation Links */}
        <nav className="hidden items-center gap-5 lg:gap-7 md:flex">
          {navLinks.map((item) => (
            <MagneticButton key={item.label} strength={0.25}>
              <button
                onClick={() => onNavigate(item.target)}
                className="group relative font-sans text-[11px] tracking-[0.22em] text-[#a89d93] transition-colors hover:text-[#f4eee6] focus:outline-none cursor-pointer py-1"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#c89658] transition-all duration-300 group-hover:w-full shadow-[0_0_6px_#c89658]" />
              </button>
            </MagneticButton>
          ))}
        </nav>

        {/* Right Actions: VIP Auth, Collection Counter & Reserve Vault */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* VIP Member Login / Status Button */}
          <MagneticButton strength={0.3}>
            <button
              onClick={onOpenLogin}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] sm:text-[11px] font-sans tracking-[0.16em] uppercase transition-all duration-300 cursor-pointer ${
                userSession?.isLoggedIn
                  ? 'border-[#c89658] bg-[#1a140f] text-[#e5b877] shadow-[0_0_15px_rgba(200,150,88,0.25)] font-semibold'
                  : 'border-[#332b24] bg-[#14100c]/80 text-[#a89d93] hover:border-[#c89658]/60 hover:text-[#f4eee6]'
              }`}
            >
              {userSession?.isLoggedIn ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-[#c89658]" />
                  <span className="max-w-[80px] sm:max-w-[110px] truncate">{userSession.name.split(' ')[0]} (VIP)</span>
                </>
              ) : (
                <>
                  <User className="h-3.5 w-3.5 text-[#c89658]" />
                  <span className="hidden sm:inline">VIP Access</span>
                </>
              )}
            </button>
          </MagneticButton>

          {/* Collection Cart Counter Button */}
          <MagneticButton strength={0.35}>
            <button
              onClick={onOpenCollection}
              className={`flex items-center gap-2 rounded-full border px-3 sm:px-3.5 py-1.5 text-[11px] font-sans tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer ${
                collectionCount > 0
                  ? 'border-[#c89658] bg-[#c89658]/20 text-[#f4eee6] shadow-[0_0_15px_rgba(200,150,88,0.3)] font-bold'
                  : 'border-[#332b24] bg-[#14100c]/80 text-[#8c827a] hover:border-[#c89658]/50 hover:text-[#f4eee6]'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#c89658]" />
              <span>
                CART ({collectionCount.toString().padStart(2, '0')})
              </span>
            </button>
          </MagneticButton>

          {/* Reserve Vault CTA */}
          <MagneticButton strength={0.35}>
            <button
              onClick={onOpenReserve}
              className="hidden lg:flex relative overflow-hidden rounded-full border border-[#c89658] bg-gradient-to-r from-[#c89658] to-[#e5b877] px-4 py-1.5 text-[11px] font-sans font-bold tracking-[0.2em] text-[#070605] uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(200,150,88,0.5)] focus:outline-none cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-[#070605]" />
                <span>The Vault</span>
              </span>
            </button>
          </MagneticButton>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#332b24] bg-[#14100c] text-[#f4eee6] md:hidden cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4 text-[#c89658]" /> : <Menu className="h-4 w-4 text-[#c89658]" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="pointer-events-auto mx-auto max-w-5xl mt-2 rounded-3xl bg-[#090705]/98 border border-[#c89658]/30 p-6 backdrop-blur-2xl md:hidden shadow-2xl animate-fadeIn">
          <div className="flex flex-col gap-4">
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#8c827a]">Atelier Navigation</span>
            {navLinks.map((item, idx) => (
              <button
                key={item.label}
                onClick={() => {
                  onNavigate(item.target);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-between border-b border-[#221c17] pb-2 text-left font-display text-lg tracking-[0.18em] text-[#f4eee6] hover:text-[#c89658] cursor-pointer"
              >
                <span>{item.label}</span>
                <span className="font-mono text-xs text-[#8c827a]">0{idx + 1}</span>
              </button>
            ))}

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenLogin();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 rounded-full border border-[#332b24] bg-[#14100c] py-2.5 text-xs font-bold tracking-[0.2em] uppercase text-[#e5b877] cursor-pointer"
              >
                <User className="h-3.5 w-3.5" />
                <span>{userSession?.isLoggedIn ? 'VIP Account' : 'VIP Member Access'}</span>
              </button>

              <button
                onClick={() => {
                  onOpenReserve();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 rounded-full border border-[#c89658] bg-[#c89658] py-2.5 text-xs font-bold tracking-[0.2em] uppercase text-[#070605] cursor-pointer shadow-md"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Reserve Vault Allocation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
