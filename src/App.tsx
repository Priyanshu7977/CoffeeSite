import React, { useState, useEffect, useRef } from 'react';
import { useLenis } from './hooks/useLenis';
import { useScrollProgress } from './hooks/useScrollProgress';
import { PageLoader } from './components/PageLoader';
import { CustomCursor } from './components/CustomCursor';
import { AtmosphericCanvas } from './components/AtmosphericCanvas';
import { Navbar } from './components/Navbar';
import { SectionIndicator } from './components/SectionIndicator';
import { LightLeak } from './components/LightLeak';
import { Hero } from './components/Hero';
import { SectionBean } from './components/SectionBean';
import { SectionRoast } from './components/SectionRoast';
import { SectionPour } from './components/SectionPour';
import { SectionCollection } from './components/SectionCollection';
import { SectionHorizontalGallery } from './components/SectionHorizontalGallery';
import { SectionBrewRitual } from './components/SectionBrewRitual';
import { SectionReserve } from './components/SectionReserve';
import { SectionManifesto } from './components/SectionManifesto';
import {
  InterludeFarmToCup,
  InterludeTakesTime,
  InterludeOriginArt,
} from './components/TypographicInterludes';
import { Footer } from './components/Footer';
import { CollectionPage } from './components/CollectionPage';
import { ReserveModal } from './components/ReserveModal';
import { ProductDetailOverlay } from './components/ProductDetailOverlay';
import { CollectionDrawer } from './components/CollectionDrawer';
import { LoginModal, type UserSession } from './components/LoginModal';
import { CheckoutModal } from './components/CheckoutModal';
import { EmailNotificationModal } from './components/EmailNotificationModal';
import type { ReserveBatch, Product, CollectionItem } from './types';
import type { AutomatedEmail } from './utils/emailService';

export const App: React.FC = () => {
  const { scrollTo } = useLenis();
  const { activeSection, progress } = useScrollProgress();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'home' | 'collection'>('home');

  // Modals & Overlay States
  const [isReserveModalOpen, setIsReserveModalOpen] = useState<boolean>(false);
  const [selectedBatch, setSelectedBatch] = useState<ReserveBatch | null>(null);

  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [isCollectionDrawerOpen, setIsCollectionDrawerOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [activeDispatchedEmail, setActiveDispatchedEmail] = useState<AutomatedEmail | null>(null);

  // User Auth & Session State
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('noir_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Collection Cart State
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([]);

  // 5-Second Cumulative Scroll Trigger for Login Popup
  const hasTriggeredScrollPopup = useRef<boolean>(false);
  const scrollTimerRef = useRef<number>(0);

  useEffect(() => {
    // If user already logged in or dismissed in this session, don't auto popup
    if (userSession?.isLoggedIn || sessionStorage.getItem('noir_login_dismissed') === 'true') {
      return;
    }

    let isScrolling = false;
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      if (hasTriggeredScrollPopup.current) return;

      if (!isScrolling) {
        isScrolling = true;
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 200);
    };

    const interval = setInterval(() => {
      if (isScrolling && !hasTriggeredScrollPopup.current) {
        scrollTimerRef.current += 1;
        if (scrollTimerRef.current >= 5) {
          hasTriggeredScrollPopup.current = true;
          sessionStorage.setItem('noir_login_dismissed', 'true');
          setIsLoginModalOpen(true);
        }
      }
    }, 1000);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [userSession]);

  const handleNavigate = (targetId: string) => {
    if (viewMode === 'collection') {
      setViewMode('home');
      setTimeout(() => {
        scrollTo(targetId, 0);
      }, 60);
    } else {
      scrollTo(targetId, 0);
    }
  };

  const handleOpenReserve = (batch?: ReserveBatch) => {
    if (batch) {
      setSelectedBatch(batch);
    } else {
      setSelectedBatch(null);
    }
    setIsReserveModalOpen(true);
  };

  const handleCloseReserve = () => {
    setIsReserveModalOpen(false);
  };

  // Product Discovery & Collection
  const handleDiscoverProduct = (product: Product) => {
    setActiveDetailProduct(product);
  };

  const handleCloseDetail = () => {
    setActiveDetailProduct(null);
  };

  const handleAddToCollection = (product: Product, grind: string) => {
    setCollectionItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.grind === grind);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.grind === grind
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          grind,
          certificateId: `NR-ARCHIVE-${Math.floor(1000 + Math.random() * 9000)}`,
        },
      ];
    });
    // Open drawer to confirm addition
    setIsCollectionDrawerOpen(true);
  };

  const handleRemoveCollectionItem = (productId: string) => {
    setCollectionItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleUpdateCollectionQuantity = (productId: string, delta: number) => {
    setCollectionItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CollectionItem => item !== null)
    );
  };

  const handleClearCollection = () => {
    setCollectionItems([]);
  };

  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    try {
      localStorage.setItem('noir_user_session', JSON.stringify(session));
    } catch {
      // Local fallback
    }
  };

  const handleEmailDispatched = (email: AutomatedEmail) => {
    setActiveDispatchedEmail(email);
  };

  const totalCollectionCount = collectionItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-[#FAF7F5] text-[#2D2926] selection:bg-[#F5DADF] selection:text-[#2D2926] overflow-x-hidden">
      {/* 1. Initial Page Loading Sequence */}
      {isLoading && <PageLoader onLoadingComplete={() => setIsLoading(false)} />}

      {/* 2. Subtle Animated Film Grain Texture Overlay */}
      <div className="film-grain" aria-hidden="true" />

      {/* 3. Atmospheric Ambient Floating Embers Canvas */}
      <AtmosphericCanvas />

      {/* 4. Luxury Custom Magnetic Cursor with Context Labels */}
      <CustomCursor />

      {/* 5. Minimal Fixed Navigation with Scroll Transformation (Only in Home Mode) */}
      {viewMode === 'home' && (
        <>
          <Navbar
            onOpenReserve={() => handleOpenReserve()}
            onOpenCollection={() => setIsCollectionDrawerOpen(true)}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onOpenCollectionPage={() => setViewMode('collection')}
            userSession={userSession}
            collectionCount={totalCollectionCount}
            onNavigate={handleNavigate}
          />

          {/* 6. Vertical Interaction Indicator Rail with Dynamic Progress Line */}
          <SectionIndicator
            activeCode={activeSection}
            progress={progress}
            onNavigate={handleNavigate}
          />
        </>
      )}

      {/* Main Experience: Either Dedicated Collection Page or Continuous Story Experience */}
      {viewMode === 'collection' ? (
        <CollectionPage
          onBackToHome={() => {
            setViewMode('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onDiscoverProduct={handleDiscoverProduct}
          onAddToCart={handleAddToCollection}
          onOpenCart={() => setIsCollectionDrawerOpen(true)}
          cartCount={totalCollectionCount}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          userSession={userSession}
        />
      ) : (
        <main className="relative w-full">
          {/* 00. Hero Viewport */}
          <div data-cursor="explore">
            <Hero onExplore={() => handleNavigate('#section-bean')} />
          </div>

          {/* 01. Pinned Bean Story with Word-by-Word Reveal */}
          <div data-cursor="view" className="relative">
            <LightLeak position="top-right" intensity="subtle" />
            <SectionBean />
          </div>

          {/* Monumental Typographic Interlude 1 */}
          <InterludeFarmToCup />

          {/* 02. Blackout Transition & Thermal Roast Emergence */}
          <div data-cursor="explore" className="relative">
            <LightLeak position="bottom-left" intensity="medium" />
            <SectionRoast />
          </div>

          {/* Monumental Typographic Interlude 2 */}
          <InterludeTakesTime />

          {/* 03. Layered 3D Typography & Espresso Extraction */}
          <div data-cursor="view" className="relative">
            <LightLeak position="top-left" intensity="subtle" />
            <SectionPour />
          </div>

          {/* 04. "THE COLLECTION" — 10 Fictional Coffees Pinned Film Sequence */}
          <div data-cursor="discover" className="relative">
            <LightLeak position="top-right" intensity="medium" />
            <SectionCollection 
              onDiscoverProduct={handleDiscoverProduct} 
              onOpenCollectionPage={() => setViewMode('collection')}
            />
          </div>

          {/* Monumental Typographic Interlude 3 */}
          <InterludeOriginArt />

          {/* 05. Pinned Horizontal Magazine Spread Camera Moment */}
          <div data-cursor="explore">
            <SectionHorizontalGallery />
          </div>

          {/* 06. "YOUR RITUAL" — 3-Method Interactive Brewing Atelier */}
          <div data-cursor="view" className="relative">
            <LightLeak position="bottom-left" intensity="subtle" />
            <SectionBrewRitual />
          </div>

          {/* 07. Private Numbered Allocations & Reserve Vault */}
          <div data-cursor="reserve">
            <SectionReserve onSelectBatch={(batch) => handleOpenReserve(batch)} />
          </div>

          {/* 08. The Noir Manifesto */}
          <SectionManifesto />
        </main>
      )}

      {/* Editorial Luxury Footer */}
      {viewMode === 'home' && (
        <Footer 
          onBackToTop={() => handleNavigate('#hero')} 
          onNavigate={(target) => {
            if (target === '#section-collection') {
              setViewMode('collection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              handleNavigate(target);
            }
          }} 
        />
      )}

      {/* Reserve Allocation Modal / Drawer */}
      <ReserveModal
        isOpen={isReserveModalOpen}
        onClose={handleCloseReserve}
        selectedBatch={selectedBatch}
      />

      {/* Full-Screen Product Detail Discovery Overlay */}
      <ProductDetailOverlay
        product={activeDetailProduct}
        onClose={handleCloseDetail}
        onAddToCollection={handleAddToCollection}
        isInCollection={Boolean(
          activeDetailProduct &&
            collectionItems.some((item) => item.product.id === activeDetailProduct.id)
        )}
      />

      {/* Personal Collection Cart Drawer */}
      <CollectionDrawer
        isOpen={isCollectionDrawerOpen}
        onClose={() => setIsCollectionDrawerOpen(false)}
        items={collectionItems}
        onRemoveItem={handleRemoveCollectionItem}
        onUpdateQuantity={handleUpdateCollectionQuantity}
        onClearCollection={handleClearCollection}
        onProceedToCheckout={() => {
          setIsCollectionDrawerOpen(false);
          setIsCheckoutModalOpen(true);
        }}
      />

      {/* Full Haute Atelier Checkout Flow Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        items={collectionItems}
        onOrderCompleted={handleClearCollection}
        onEmailDispatched={handleEmailDispatched}
      />

      {/* 5-Second Scroll Triggered VIP Login & Access Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onEmailDispatched={handleEmailDispatched}
      />

      {/* Automated Email Preview Simulator Modal */}
      <EmailNotificationModal
        email={activeDispatchedEmail}
        onClose={() => setActiveDispatchedEmail(null)}
      />
    </div>
  );
};

export default App;
