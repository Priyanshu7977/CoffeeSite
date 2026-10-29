import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, generateSessionToken, checkRateLimit } from '../server/authSecurity';
import { ReservationsStore } from '../server/reservationsStore';
import { NewsletterStore } from '../server/newsletterStore';
import { calculateAuthoritativeValuation } from '../server/pricing';
import { NOIR_PRODUCTS } from '../data/products';
import type { CollectionItem } from '../types';

describe('Production Readiness & Security Test Suite', () => {
  // =========================================================================
  // 1. CART LINE ITEM ISOLATION & MULTI-GRIND LOGIC
  // =========================================================================
  describe('Cart Architecture & Variant Line Item Isolation', () => {
    function generateLineItemId(productId: string, grind: string, isSubscription?: boolean, frequency?: number): string {
      const mode = isSubscription ? 'sub' : 'onetime';
      const freq = frequency || 0;
      return `${productId}::${grind || 'default'}::${mode}::${freq}`;
    }

    it('generates distinct line item IDs for different grind variants of the same product', () => {
      const wholeBeanId = generateLineItemId('prod-01', 'Whole Bean');
      const filterKaapiId = generateLineItemId('prod-01', 'Filter Kaapi');
      const frenchPressId = generateLineItemId('prod-01', 'French Press');

      expect(wholeBeanId).not.toBe(filterKaapiId);
      expect(filterKaapiId).not.toBe(frenchPressId);
      expect(wholeBeanId).toBe('prod-01::Whole Bean::onetime::0');
      expect(filterKaapiId).toBe('prod-01::Filter Kaapi::onetime::0');
    });

    it('manages cart line items independently without variant collisions', () => {
      const product = NOIR_PRODUCTS[0];
      const cart: CollectionItem[] = [
        {
          id: generateLineItemId(product.id, 'Whole Bean'),
          product,
          quantity: 2,
          grind: 'Whole Bean',
          isSubscription: false,
        },
        {
          id: generateLineItemId(product.id, 'Filter Kaapi'),
          product,
          quantity: 1,
          grind: 'Filter Kaapi',
          isSubscription: false,
        },
      ];

      expect(cart.length).toBe(2);

      // Updating quantity of Whole Bean variant
      const targetId = generateLineItemId(product.id, 'Whole Bean');
      const updatedCart = cart.map((it) => (it.id === targetId ? { ...it, quantity: it.quantity + 1 } : it));

      const updatedWholeBean = updatedCart.find((it) => it.grind === 'Whole Bean');
      const unchangedFilterKaapi = updatedCart.find((it) => it.grind === 'Filter Kaapi');

      expect(updatedWholeBean?.quantity).toBe(3);
      expect(unchangedFilterKaapi?.quantity).toBe(1);

      // Removing only Whole Bean variant
      const filteredCart = updatedCart.filter((it) => it.id !== targetId);
      expect(filteredCart.length).toBe(1);
      expect(filteredCart[0].grind).toBe('Filter Kaapi');
      expect(filteredCart[0].quantity).toBe(1);
    });

    it('prevents zero and negative quantities in cart updates', () => {
      const product = NOIR_PRODUCTS[0];
      const lineId = generateLineItemId(product.id, 'Whole Bean');
      const cart: CollectionItem[] = [
        {
          id: lineId,
          product,
          quantity: 1,
          grind: 'Whole Bean',
        },
      ];

      const applyQuantity = (id: string, delta: number, current: CollectionItem[]) => {
        return current
          .map((item) => {
            if (item.id === id) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CollectionItem[];
      };

      // Decreasing quantity by 1 removes the item instead of setting quantity to 0
      const afterDecrease = applyQuantity(lineId, -1, cart);
      expect(afterDecrease.length).toBe(0);
    });
  });

  // =========================================================================
  // 2. REAL AUTHENTICATION & SCRYPT CRYPTOGRAPHY
  // =========================================================================
  describe('Cryptographic Authentication & Password Security', () => {
    it('generates salted scrypt password hashes and verifies accurately', () => {
      const password = 'SuperSecret@Coffee2026';
      const record = hashPassword(password);

      expect(record.salt).toBeDefined();
      expect(record.hash).toBeDefined();
      expect(record.salt.length).toBe(32); // 16 bytes hex
      expect(record.hash.length).toBe(128); // 64 bytes hex
      expect(record.hash).not.toBe(password);

      // Positive verification
      const isValid = verifyPassword(password, record.salt, record.hash);
      expect(isValid).toBe(true);

      // Negative verification (wrong password)
      const isInvalid = verifyPassword('WrongPassword123', record.salt, record.hash);
      expect(isInvalid).toBe(false);

      // Negative verification (empty password)
      const isEmpty = verifyPassword('', record.salt, record.hash);
      expect(isEmpty).toBe(false);
    });

    it('hashes identical passwords with distinct salts producing different hashes', () => {
      const password = 'IdenticalPassword123!';
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);

      expect(hash1.salt).not.toBe(hash2.salt);
      expect(hash1.hash).not.toBe(hash2.hash);
      expect(verifyPassword(password, hash1.salt, hash1.hash)).toBe(true);
      expect(verifyPassword(password, hash2.salt, hash2.hash)).toBe(true);
    });

    it('generates high-entropy 256-bit cryptographically secure session tokens', () => {
      const token1 = generateSessionToken();
      const token2 = generateSessionToken();

      expect(token1).toHaveLength(64);
      expect(token2).toHaveLength(64);
      expect(token1).not.toBe(token2);
      expect(/^[0-9a-f]{64}$/.test(token1)).toBe(true);
    });

    it('enforces rate limiting against brute force login attacks', () => {
      const testIp = `test-ip-${Date.now()}`;
      const limit = 5;
      const windowMs = 5000;

      // First 5 attempts within window should pass
      for (let i = 0; i < limit; i++) {
        const rateCheck = checkRateLimit(testIp, limit, windowMs);
        expect(rateCheck.allowed).toBe(true);
      }

      // 6th attempt should be blocked
      const blockedAttempt = checkRateLimit(testIp, limit, windowMs);
      expect(blockedAttempt.allowed).toBe(false);
      expect(blockedAttempt.remainingAttempts).toBe(0);
    });
  });

  // =========================================================================
  // 3. PERSISTENT RESERVATIONS & ALLOCATION INTEGRITY
  // =========================================================================
  describe('Micro-Lot Allocations & Reservations System', () => {
    it('creates truthful reservation requests with valid certificates', () => {
      const result = ReservationsStore.createReservation({
        batchId: 'batch-01',
        fullName: 'Priyanshu Singh',
        email: `collector-${Date.now()}@example.com`,
        quantity: 2,
        grind: 'Whole Bean',
      });

      expect(result.success).toBe(true);
      expect(result.reservation).toBeDefined();
      expect(result.reservation.certificateId).toMatch(/^NR-RES-2026-BATCH01-\d{4}$/);
      expect(result.reservation.batchId).toBe('batch-01');
      expect(result.reservation.quantity).toBe(2);
      expect(['confirmed', 'waitlist']).toContain(result.reservation.status);

      // Verify retrieval from store
      const retrieved = ReservationsStore.getReservationById(result.reservation.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(result.reservation.id);
    });

    it('accurately calculates remaining allocations', () => {
      const remaining = ReservationsStore.getRemainingAllocations('batch-01');
      expect(typeof remaining).toBe('number');
      expect(remaining).toBeGreaterThanOrEqual(0);
      expect(remaining).toBeLessThanOrEqual(85);
    });
  });

  // =========================================================================
  // 4. NEWSLETTER & SUBSCRIBER PERSISTENCE
  // =========================================================================
  describe('Newsletter & Subscriber Persistence', () => {
    it('persists valid email subscribers and prevents duplicates', () => {
      const uniqueEmail = `subscriber-${Date.now()}@noirroast.com`;

      const firstSub = NewsletterStore.subscribe(uniqueEmail, 'footer_form');
      expect(firstSub.success).toBe(true);
      expect(firstSub.alreadySubscribed).toBe(false);
      expect(NewsletterStore.isSubscribed(uniqueEmail)).toBe(true);

      // Duplicate attempt should return alreadySubscribed: true without crashing
      const dupSub = NewsletterStore.subscribe(uniqueEmail.toUpperCase(), 'cart_modal');
      expect(dupSub.success).toBe(true);
      expect(dupSub.alreadySubscribed).toBe(true);
    });
  });

  // =========================================================================
  // 5. SERVER-SIDE PRICING & INTEGER MINOR UNIT CALCULATION
  // =========================================================================
  describe('Authoritative Pricing Engine (Integer Minor Units)', () => {
    it('calculates prices using integer minor units (paise) preventing floating point drift', () => {
      // prod-01: ₹2,800, prod-02: ₹2,400
      const valuation = calculateAuthoritativeValuation([
        { productId: 'prod-01', quantity: 2 }, // ₹2,800 x 2 = ₹5,600
        { productId: 'prod-02', quantity: 1 }, // ₹2,400 x 1 = ₹2,400
      ]);

      expect(valuation.isValid).toBe(true);
      expect(valuation.items.length).toBe(2);
      expect(valuation.pricing.subtotal).toBe(8000);
      expect(valuation.pricing.amountInPaise).toBe(800000);
      expect(Number.isInteger(valuation.pricing.amountInPaise)).toBe(true);
    });

    it('applies promo codes authoritatively on the server and recalculates discount accurately', () => {
      // prod-01: ₹2,800
      const valuation = calculateAuthoritativeValuation(
        [{ productId: 'prod-01', quantity: 1 }],
        'COFFEE20' // 20% discount => ₹560 discount
      );

      expect(valuation.isValid).toBe(true);
      expect(valuation.pricing.discountCode).toBe('COFFEE20');
      expect(valuation.pricing.discountAmount).toBe(560);
      expect(valuation.pricing.finalTotal).toBe(2240);
      expect(valuation.pricing.amountInPaise).toBe(224000);
    });

    it('rejects invalid or expired discount codes safely', () => {
      const valuation = calculateAuthoritativeValuation(
        [{ productId: 'prod-01', quantity: 1 }],
        'INVALID_CODE_999'
      );

      expect(valuation.isValid).toBe(true);
      expect(valuation.pricing.discountCode).toBeUndefined();
      expect(valuation.pricing.discountAmount).toBe(0);
      expect(valuation.pricing.finalTotal).toBe(2800);
    });

    it('safely rejects empty or malformed item payloads', () => {
      const emptyValuation = calculateAuthoritativeValuation([]);
      expect(emptyValuation.isValid).toBe(false);
      expect(emptyValuation.pricing.finalTotal).toBe(0);

      const invalidProduct = calculateAuthoritativeValuation([{ productId: 'unknown-id-xyz', quantity: 1 }]);
      expect(invalidProduct.isValid).toBe(false);
    });
  });
});
