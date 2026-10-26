import { describe, it, expect, beforeEach } from 'vitest';
import { inventorySystem } from '../utils/inventorySystem';
import { NOIR_PRODUCTS } from '../data/products';
import { dispatchOrderConfirmationEmail } from '../utils/emailService';
import type { CollectionItem } from '../types';

describe('Order & Inventory Lifecycle — Integration Test Suite', () => {
  beforeEach(() => {
    inventorySystem._internalResetForTests();
  });

  it('Executes complete purchase lifecycle with zero stock error guarantee', () => {
    const lot1 = NOIR_PRODUCTS.find((p) => p.id === 'prod-01')!; // Stock: 14
    const lot2 = NOIR_PRODUCTS.find((p) => p.id === 'prod-07')!; // Stock: 2 (Nilgiri Geisha)

    // 1. Check stock availability before adding to cart
    const check1 = inventorySystem.checkAvailability(lot1.id, 0, 2);
    expect(check1.available).toBe(true);

    const check2 = inventorySystem.checkAvailability(lot2.id, 0, 2);
    expect(check2.available).toBe(true);

    // 2. Assemble Cart
    const cart: CollectionItem[] = [
      {
        product: lot1,
        quantity: 2,
        grind: 'Whole Bean',
        certificateId: 'NR-TEST-001',
      },
      {
        product: lot2,
        quantity: 2, // Takes all remaining stock of Nilgiri Geisha
        grind: 'Pour Over / V60',
        certificateId: 'NR-TEST-002',
      },
    ];

    // 3. Verify user cannot exceed stock in cart
    const overLimitCheck = inventorySystem.checkAvailability(lot2.id, 2, 1);
    expect(overLimitCheck.available).toBe(false);
    expect(overLimitCheck.maxAddable).toBe(0);

    // 4. Simulate Checkout & Atomic Inventory Commit
    const commitResult = inventorySystem.commitOrder(
      cart.map((item) => ({ productId: item.product.id, quantity: item.quantity }))
    );

    expect(commitResult.success).toBe(true);

    // 5. Verify Post-Purchase Inventory Statuses
    expect(inventorySystem.getStock('prod-01')).toBe(12); // 14 - 2 = 12
    expect(inventorySystem.getStock('prod-07')).toBe(0);  // 2 - 2 = 0
    expect(inventorySystem.getStockStatus('prod-07')).toBe('OUT_OF_STOCK');

    // 6. Next buyer tries to purchase prod-07 -> MUST FAIL cleanly
    const nextBuyerCheck = inventorySystem.checkAvailability('prod-07', 0, 1);
    expect(nextBuyerCheck.available).toBe(false);
    expect(nextBuyerCheck.status).toBe('OUT_OF_STOCK');

    const nextBuyerCommit = inventorySystem.commitOrder([{ productId: 'prod-07', quantity: 1 }]);
    expect(nextBuyerCommit.success).toBe(false);
    expect(nextBuyerCommit.error).toContain('Insufficient stock');

    // 7. Verify Automated Certificate & Dispatch Email generation
    const email = dispatchOrderConfirmationEmail(
      'NR-2026-TEST-7788',
      'Arjun Sommelier',
      'arjun@western-ghats.com',
      cart,
      '₹10,400',
      '42 Rosewood Estate, Chikmagalur, 577101, India'
    );

    expect(email.to).toBe('arjun@western-ghats.com');
    expect(email.recipientName).toBe('Arjun Sommelier');
    expect(email.subject).toContain('NR-2026-TEST-7788');
    expect(email.details.items?.map((i) => i.name)).toContain('BABA BUDAN OBSIDIAN');
    expect(email.details.items?.map((i) => i.name)).toContain('NILGIRI BLUE MOUNTAIN GEISHA');
  });
});
