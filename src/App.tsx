import React, { useState } from 'react';
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
import { ReserveModal } from './components/ReserveModal';
import { ProductDetailOverlay } from './components/ProductDetailOverlay';
import { CollectionDrawer } from './components/CollectionDrawer';
import type { ReserveBatch, Product, CollectionItem } from './types';

export const App: React.FC = () => {
  const { scrollTo } = useLenis();
  const { activeSection, progress } = useScrollProgress();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals & Overlay States
  const [isReserveModalOpen, setIsReserveModalOpen] = useState<boolean>(false);
  const [selectedBatch, setSelectedBatch] = useState<ReserveBatch | null>(null);

  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [isCollectionDrawerOpen, setIsCollectionDrawerOpen] = useState<boolean>(false);

  // Collection Cart State
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([]);

  const handleNavigate = (targetId: string) => {
    scrollTo(targetId, 0);
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

  const totalCollectionCount = collectionItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-[#070605] text-[#f4eee6] selection:bg-[#c89658] selection:text-[#070605] overflow-x-hidden">
      {/* 1. Initial Page Loading Sequence */}
      {isLoading && <PageLoader onLoadingComplete={() => setIsLoading(false)} />}

      {/* 2. Subtle Animated Film Grain Texture Overlay */}
      <div className="film-grain" aria-hidden="true" />

      {/* 3. Atmospheric Ambient Floating Embers Canvas */}
      <AtmosphericCanvas />

      {/* 4. Luxury Custom Magnetic Cursor with Context Labels */}
      <CustomCursor />

      {/* 5. Minimal Fixed Navigation with Scroll Transformation */}
      <Navbar
        onOpenReserve={() => handleOpenReserve()}
        onOpenCollection={() => setIsCollectionDrawerOpen(true)}
        collectionCount={totalCollectionCount}
        onNavigate={handleNavigate}
      />

      {/* 6. Vertical Interaction Indicator Rail with Dynamic Progress Line */}
      <SectionIndicator
        activeCode={activeSection}
        progress={progress}
        onNavigate={handleNavigate}
      />

      {/* Main Continuous Film Experience */}
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

        {/* 04. "THE COLLECTION" — 5 Fictional Coffees Pinned Film Sequence */}
        <div data-cursor="discover" className="relative">
          <LightLeak position="top-right" intensity="medium" />
          <SectionCollection onDiscoverProduct={handleDiscoverProduct} />
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

      {/* Editorial Luxury Footer */}
      <Footer onBackToTop={() => handleNavigate('#hero')} onNavigate={handleNavigate} />

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

      {/* Personal Collection Drawer */}
      <CollectionDrawer
        isOpen={isCollectionDrawerOpen}
        onClose={() => setIsCollectionDrawerOpen(false)}
        items={collectionItems}
        onRemoveItem={handleRemoveCollectionItem}
        onUpdateQuantity={handleUpdateCollectionQuantity}
        onClearCollection={handleClearCollection}
      />
    </div>
  );
};

export default App;
