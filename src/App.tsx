import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import { PageLoader } from './components/PageLoader';
import { CustomCursor } from './components/CustomCursor';
import { AtmosphericCanvas } from './components/AtmosphericCanvas';
import { Navbar } from './components/Navbar';
import { LightLeak } from './components/LightLeak';
import { Hero } from './components/Hero';
import { SectionBean } from './components/SectionBean';
import { SectionRoast } from './components/SectionRoast';
import { SectionPour } from './components/SectionPour';
import { SectionCollection } from './components/SectionCollection';
import { SectionHorizontalGallery } from './components/SectionHorizontalGallery';
import { SectionBrewRitual } from './components/SectionBrewRitual';
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
import { InventoryHudModal } from './components/InventoryHudModal';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { EstateAtlasPage } from './pages/EstateAtlasPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactPage } from './pages/ContactPage';
import { CartPage } from './pages/CartPage';
import { AccountPage } from './pages/AccountPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useAuth } from './context/AuthContext';
import { NOIR_PRODUCTS } from './data/products';
import { inventorySystem } from './utils/inventorySystem';
import { recordCartActivity } from './utils/emailAutomationSystem';
import type { ReserveBatch, Product, CollectionItem } from './types';
import type { AutomatedEmail } from './utils/emailService';

// Scroll to top automatically on route transitions
const ScrollToTopOnRoute = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  const { scrollTo } = useLenis();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals & Overlay States
  const [isReserveModalOpen, setIsReserveModalOpen] = useState<boolean>(false);
  const [selectedBatch, setSelectedBatch] = useState<ReserveBatch | null>(null);

  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [isCollectionDrawerOpen, setIsCollectionDrawerOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isInventoryHudOpen, setIsInventoryHudOpen] = useState<boolean>(false);
  const [activeDispatchedEmail, setActiveDispatchedEmail] = useState<AutomatedEmail | null>(null);

  // User Auth & Session from global AuthContext
  const { userSession } = useAuth();

  // Collection Cart State with LocalStorage Persistence
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>(() => {
    try {
      const saved = localStorage.getItem('noir_collection_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('noir_collection_cart_v1', JSON.stringify(collectionItems));
    } catch (e) {
      console.warn('Cart persistence failed', e);
    }
    const subtotal = collectionItems.reduce((sum, item) => {
      const priceNum = parseFloat(item.product.price.replace(/[^0-9.]/g, '')) || 0;
      return sum + priceNum * item.quantity;
    }, 0);
    recordCartActivity(
      collectionItems,
      `₹${subtotal.toLocaleString('en-IN')}`,
      userSession?.email,
      userSession?.name
    );
  }, [collectionItems, userSession]);

  // 5-Second Cumulative Scroll Trigger for VIP Pass Prompt (only on Home page)
  const hasTriggeredScrollPopup = useRef<boolean>(false);
  const scrollTimerRef = useRef<number>(0);

  useEffect(() => {
    if (userSession?.isLoggedIn || sessionStorage.getItem('noir_login_dismissed') === 'true') {
      return;
    }

    let isScrolling = false;
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      if (hasTriggeredScrollPopup.current || location.pathname !== '/') return;

      if (!isScrolling) {
        isScrolling = true;
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 200);
    };

    const interval = setInterval(() => {
      if (isScrolling && !hasTriggeredScrollPopup.current && location.pathname === '/') {
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
  }, [userSession, location.pathname]);

  const handleNavigate = (targetId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        scrollTo(targetId, 0);
      }, 80);
    } else {
      scrollTo(targetId, 0);
    }
  };

  const handleOpenReserve = (batch?: ReserveBatch) => {
    setSelectedBatch(batch || null);
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

  const handleAddToCollection = (product: Product, grind: string = 'Whole Bean', quantity: number = 1) => {
    // Inventory Bounds Validation
    const available = inventorySystem.getStock(product.id);
    const existing = collectionItems.find((item) => item.product.id === product.id && item.grind === grind);
    const currentQty = existing ? existing.quantity : 0;

    if (currentQty + quantity > available) {
      alert(`Inventory Notice: Only ${available} units of "${product.name}" are currently available.`);
      return;
    }

    setCollectionItems((prev) => {
      const match = prev.find((item) => item.product.id === product.id && item.grind === grind);
      if (match) {
        return prev.map((item) =>
          item.product.id === product.id && item.grind === grind
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity,
          grind,
          certificateId: `NR-ARCHIVE-${Math.floor(1000 + Math.random() * 9000)}`,
        },
      ];
    });
    setIsCollectionDrawerOpen(true);
  };

  const handleRemoveCollectionItem = (productId: string) => {
    setCollectionItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleUpdateCollectionQuantity = (productId: string, delta: number) => {
    const available = inventorySystem.getStock(productId);

    setCollectionItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > available) {
              alert(`Inventory Alert: Max available stock is ${available} units.`);
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CollectionItem => item !== null)
    );
  };

  const handleClearCollection = () => {
    setCollectionItems([]);
    try {
      localStorage.removeItem('noir_collection_cart_v1');
    } catch {
      // Ignored
    }
  };

  const handleLoginSuccess = (_session: UserSession) => {
    // AuthContext already manages user session persistence
  };


  const handleReorderOrderItems = (
    orderItems: Array<{ productId: string; grind?: string; quantity: number }>
  ) => {
    orderItems.forEach((it) => {
      const existingProduct = NOIR_PRODUCTS.find((p) => p.id === it.productId);
      if (existingProduct) {
        handleAddToCollection(existingProduct, it.grind || 'Whole Bean', it.quantity || 1);
      }
    });
    setIsCollectionDrawerOpen(true);
  };

  const handleEmailDispatched = (email: AutomatedEmail) => {
    setActiveDispatchedEmail(email);
  };

  const totalCollectionCount = collectionItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-[#FAF7F5] text-[#2D2926] selection:bg-[#F5DADF] selection:text-[#2D2926] overflow-x-hidden">
      <ScrollToTopOnRoute />

      {/* 1. Initial Page Loading Sequence */}
      {isLoading && <PageLoader onLoadingComplete={() => setIsLoading(false)} />}

      {/* 2. Subtle Animated Film Grain Texture Overlay */}
      <div className="film-grain" aria-hidden="true" />

      {/* 3. Atmospheric Ambient Floating Embers Canvas */}
      <AtmosphericCanvas />

      {/* 4. Luxury Custom Magnetic Cursor (Hidden on touch devices) */}
      <CustomCursor />

      {/* 5. Minimal Fixed Navigation with Route Awareness */}
      <Navbar
        onOpenReserve={() => handleOpenReserve()}
        onOpenCollection={() => setIsCollectionDrawerOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenInventoryHud={() => setIsInventoryHudOpen(true)}
        userSession={userSession}
        collectionCount={totalCollectionCount}
      />

      {/* Multi-Page Routes */}
      <Routes>
        {/* Home Page: Continuous Storyline Experience */}
        <Route
          path="/"
          element={
            <main className="relative w-full overflow-hidden">
              {/* 00. Hero Viewport */}
              <div data-cursor="explore">
                <Hero onExplore={() => handleNavigate('#section-bean')} />
              </div>

              {/* 01. Pinned Bean Story */}
              <div data-cursor="view" className="relative">
                <LightLeak position="top-right" intensity="subtle" />
                <SectionBean />
              </div>

              {/* Typographic Interlude 1 */}
              <InterludeFarmToCup />

              {/* 02. Thermal Roast */}
              <div data-cursor="explore" className="relative">
                <LightLeak position="bottom-left" intensity="medium" />
                <SectionRoast />
              </div>

              {/* Typographic Interlude 2 */}
              <InterludeTakesTime />

              {/* 03. Layered Extraction Pour */}
              <div data-cursor="view" className="relative">
                <LightLeak position="top-left" intensity="subtle" />
                <SectionPour />
              </div>

              {/* 04. Collection Showcase Preview */}
              <div data-cursor="discover" className="relative">
                <LightLeak position="top-right" intensity="medium" />
                <SectionCollection
                  onDiscoverProduct={handleDiscoverProduct}
                  onOpenCollectionPage={() => navigate('/collection')}
                />
              </div>

              {/* Typographic Interlude 3 */}
              <InterludeOriginArt />

              {/* 05. Gallery */}
              <div data-cursor="explore">
                <SectionHorizontalGallery />
              </div>

              {/* 06. South Indian Kaapi Ritual */}
              <div data-cursor="view" className="relative">
                <LightLeak position="bottom-left" intensity="subtle" />
                <SectionBrewRitual />
              </div>

              {/* 07. The Noir Manifesto */}
              <SectionManifesto />

              {/* Footer */}
              <Footer
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </main>
          }
        />

        {/* Dedicated Collection Page */}
        <Route
          path="/collection"
          element={
            <div>
              <CollectionPage
                onBackToHome={() => navigate('/')}
                onDiscoverProduct={handleDiscoverProduct}
                onAddToCart={handleAddToCollection}
                onOpenCart={() => setIsCollectionDrawerOpen(true)}
                cartCount={totalCollectionCount}
                onOpenLogin={() => setIsLoginModalOpen(true)}
                userSession={userSession}
              />
              <Footer
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </div>
          }
        />

        {/* Dedicated Product Detail Page */}
        <Route
          path="/product/:id"
          element={
            <div>
              <ProductDetailPage
                onAddToCart={handleAddToCollection}
                onOpenCart={() => setIsCollectionDrawerOpen(true)}
                cartCount={totalCollectionCount}
                cartItems={collectionItems}
              />
              <Footer
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </div>
          }
        />

        {/* Dedicated South Indian Estate & Terroir Atlas Page */}
        <Route
          path="/atlas"
          element={
            <div className="pt-20">
              <EstateAtlasPage
                onDiscoverProduct={handleDiscoverProduct}
                onAddToCart={handleAddToCollection}
              />
              <Footer
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </div>
          }
        />
        <Route
          path="/estate-atlas"
          element={
            <div className="pt-20">
              <EstateAtlasPage
                onDiscoverProduct={handleDiscoverProduct}
                onAddToCart={handleAddToCollection}
              />
              <Footer
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </div>
          }
        />
        <Route
          path="/terroir"
          element={
            <div className="pt-20">
              <EstateAtlasPage
                onDiscoverProduct={handleDiscoverProduct}
                onAddToCart={handleAddToCollection}
              />
              <Footer
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </div>
          }
        />
        <Route
          path="/heritage"
          element={
            <div className="pt-20">
              <EstateAtlasPage
                onDiscoverProduct={handleDiscoverProduct}
                onAddToCart={handleAddToCollection}
              />
              <Footer
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </div>
          }
        />
        <Route
          path="/story"
          element={
            <div className="pt-20">
              <EstateAtlasPage
                onDiscoverProduct={handleDiscoverProduct}
                onAddToCart={handleAddToCollection}
              />
              <Footer
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </div>
          }
        />
        <Route
          path="/craft"
          element={
            <div className="pt-20">
              <EstateAtlasPage
                onDiscoverProduct={handleDiscoverProduct}
                onAddToCart={handleAddToCollection}
              />
              <Footer
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </div>
          }
        />
        <Route
          path="/brew"
          element={
            <div>
              <EstateAtlasPage
                onDiscoverProduct={handleDiscoverProduct}
                onAddToCart={handleAddToCollection}
              />
              <Footer
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </div>
          }
        />
        <Route
          path="/brewing"
          element={
            <div>
              <EstateAtlasPage
                onDiscoverProduct={handleDiscoverProduct}
                onAddToCart={handleAddToCollection}
              />
              <Footer
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </div>
          }
        />
        <Route
          path="/reserve"
          element={
            <div>
              <EstateAtlasPage
                onDiscoverProduct={handleDiscoverProduct}
                onAddToCart={handleAddToCollection}
              />
              <Footer
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </div>
          }
        />

        {/* Dedicated About Us (College Student Startup) Page */}
        <Route
          path="/about"
          element={
            <div>
              <AboutUsPage />
              <Footer
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </div>
          }
        />

        {/* Dedicated Contact Page (Interactive Map & Direct Owner Desk) */}
        <Route
          path="/contact"
          element={
            <div>
              <ContactPage />
              <Footer
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </div>
          }
        />
        <Route
          path="/manifesto"
          element={
            <div>
              <ContactPage />
              <Footer
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </div>
          }
        />

        {/* Dedicated Cart & Order Review Page */}
        <Route
          path="/cart"
          element={
            <div>
              <CartPage
                items={collectionItems}
                onUpdateQuantity={handleUpdateCollectionQuantity}
                onRemoveItem={handleRemoveCollectionItem}
                onClearCart={handleClearCollection}
                onOpenCheckout={() => setIsCheckoutModalOpen(true)}
                onEmailDispatched={handleEmailDispatched}
                userEmail={userSession?.email}
                userName={userSession?.name}
              />
              <Footer
                showReviews={false}
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </div>
          }
        />

        {/* Dedicated Login Page - Viewport-optimized standalone auth experience */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* Dedicated Signup Page */}
        <Route
          path="/signup"
          element={
            <div>
              <SignupPage />
              <Footer
                showReviews={false}
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </div>
          }
        />

        {/* Dedicated VIP Account Hub */}
        <Route
          path="/account"
          element={
            <div>
              <AccountPage
                onOpenLogin={() => setIsLoginModalOpen(true)}
                onOpenInventoryHud={() => setIsInventoryHudOpen(true)}
                onReorderItems={handleReorderOrderItems}
              />
              <Footer
                showReviews={false}
                onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onNavigate={handleNavigate}
              />
            </div>
          }
        />

        {/* Branded 404 Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global Interactive Modals */}
      {/* 1. Slide-out Collection Cart Drawer */}
      <CollectionDrawer
        isOpen={isCollectionDrawerOpen}
        onClose={() => setIsCollectionDrawerOpen(false)}
        items={collectionItems}
        onUpdateQuantity={handleUpdateCollectionQuantity}
        onRemoveItem={handleRemoveCollectionItem}
        onClearCollection={handleClearCollection}
        onProceedToCheckout={() => {
          setIsCollectionDrawerOpen(false);
          setIsCheckoutModalOpen(true);
        }}
      />

      {/* 2. Interactive Product Quick Detail Overlay */}
      <ProductDetailOverlay
        product={activeDetailProduct}
        onClose={handleCloseDetail}
        onAddToCollection={handleAddToCollection}
        isInCollection={collectionItems.some((i) => i.product.id === activeDetailProduct?.id)}
      />

      {/* 3. Private Vintage Reserve Modal */}
      <ReserveModal
        isOpen={isReserveModalOpen}
        onClose={handleCloseReserve}
        selectedBatch={selectedBatch}
      />

      {/* 4. Full Checkout Flow Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        items={collectionItems}
        userSession={userSession}
        onOrderCompleted={handleClearCollection}
        onEmailDispatched={handleEmailDispatched}
      />

      {/* 5. VIP Login & Access Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onEmailDispatched={handleEmailDispatched}
      />

      {/* 6. Real-Time Inventory Control HUD */}
      <InventoryHudModal
        isOpen={isInventoryHudOpen}
        onClose={() => setIsInventoryHudOpen(false)}
      />

      {/* 7. Automated Email Preview Simulator Modal */}
      <EmailNotificationModal
        email={activeDispatchedEmail}
        onClose={() => setActiveDispatchedEmail(null)}
        onNavigateToCart={() => navigate('/cart')}
      />
    </div>
  );
};

export default App;
