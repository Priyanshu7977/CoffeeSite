import { describe, it, expect, beforeEach } from 'vitest';
import { 
  inventorySystem, 
  authenticateIMS, 
  type IMSUserSession 
} from '../utils/inventorySystem';

describe('Inventory Management System — Unit, RBAC Security & Chaos Invariants', () => {
  let adminSession: IMSUserSession;
  let engineerSession: IMSUserSession;

  beforeEach(() => {
    inventorySystem._internalResetForTests();

    const adminAuth = authenticateIMS('admin@noirdakshin.com', 'Noir@Admin2026');
    adminSession = adminAuth.session!;

    const engAuth = authenticateIMS('ims.engineer@noirdakshin.com', 'Noir@Engine2026');
    engineerSession = engAuth.session!;
  });

  it('1. Initializes with correct micro-lot stock allocations', () => {
    expect(inventorySystem.getStock('prod-01')).toBe(14); // Baba Budan
    expect(inventorySystem.getStock('prod-05')).toBe(3);  // Low stock lot
    expect(inventorySystem.getStock('prod-10')).toBe(10); // Wayanad Robusta
  });

  it('2. Evaluates stock statuses accurately with OUT_OF_STOCK terminology', () => {
    expect(inventorySystem.getStockStatus('prod-01')).toBe('IN_STOCK');
    expect(inventorySystem.getStockStatus('prod-05')).toBe('LOW_STOCK');
    inventorySystem.setStockDirect('prod-10', 0, adminSession);
    expect(inventorySystem.getStockStatus('prod-10')).toBe('OUT_OF_STOCK');
  });

  it('3. Rejects user addition when lot is OUT_OF_STOCK and displays clean message', () => {
    inventorySystem.setStockDirect('prod-10', 0, adminSession);
    const check = inventorySystem.checkAvailability('prod-10', 0, 1);
    expect(check.available).toBe(false);
    expect(check.status).toBe('OUT_OF_STOCK');
    expect(check.maxAddable).toBe(0);
    expect(check.message).toBe('This micro-lot is currently out of stock.');
    // Reset back to initial
    inventorySystem.resetAllToDefault(adminSession);
  });

  it('4. Prevents overselling when requested quantity exceeds available stock', () => {
    // Current stock of prod-05 is 3
    const check1 = inventorySystem.checkAvailability('prod-05', 0, 4);
    expect(check1.available).toBe(false);
    expect(check1.maxAddable).toBe(3);
    expect(check1.message).toContain('Only 3 additional units');

    // Cart already holds 2 units, requesting 2 more (total 4 > 3)
    const check2 = inventorySystem.checkAvailability('prod-05', 2, 2);
    expect(check2.available).toBe(false);
    expect(check2.maxAddable).toBe(1);

    // Cart already holds all 3 units
    const check3 = inventorySystem.checkAvailability('prod-05', 3, 1);
    expect(check3.available).toBe(false);
    expect(check3.maxAddable).toBe(0);
  });

  it('5. Atomically commits orders and decrements stock on checkout', () => {
    const initial = inventorySystem.getStock('prod-02');
    const result = inventorySystem.commitOrder([{ productId: 'prod-02', quantity: 3 }]);
    expect(result.success).toBe(true);
    expect(inventorySystem.getStock('prod-02')).toBe(initial - 3);
  });

  it('6. ATOMIC TRANSACTION GUARD: Aborts without partial deductions if any single item exceeds stock', () => {
    const prod1Initial = inventorySystem.getStock('prod-01'); // 14
    const prod5Initial = inventorySystem.getStock('prod-05'); // 3

    // Request 2 of prod-01 (valid) and 10 of prod-05 (INVALID, only 3 exist)
    const result = inventorySystem.commitOrder([
      { productId: 'prod-01', quantity: 2 },
      { productId: 'prod-05', quantity: 10 },
    ]);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Insufficient stock');

    // Ensure prod-01 was NOT deducted (atomic rollback guarantee)
    expect(inventorySystem.getStock('prod-01')).toBe(prod1Initial);
    expect(inventorySystem.getStock('prod-05')).toBe(prod5Initial);
  });

  it('7. SECURITY & ACCESS CONTROL: Denies regular customer from modifying or restocking inventory', () => {
    // Regular customer session (or null)
    const unauthorizedSession = null;

    // Direct stock update must throw Access Denied
    expect(() => {
      inventorySystem.setStockDirect('prod-01', 99, unauthorizedSession);
    }).toThrow(/Access Denied/i);

    // Restock call must throw Access Denied
    expect(() => {
      inventorySystem.restock('prod-01', 10, unauthorizedSession);
    }).toThrow(/Access Denied/i);

    // Factory reset without admin session must throw Access Denied
    expect(() => {
      inventorySystem.resetAllToDefault(unauthorizedSession);
    }).toThrow(/Access Denied/i);

    // Ensure stock remained unchanged
    expect(inventorySystem.getStock('prod-01')).toBe(14);
  });

  it('8. SECURITY & ACCESS CONTROL: Verifies Admin and IMS Engineer authentication credentials', () => {
    // Invalid credentials fail
    const invalidAuth = authenticateIMS('customer@gmail.com', 'wrongpassword');
    expect(invalidAuth.success).toBe(false);
    expect(invalidAuth.error).toContain('Access Denied');

    // Valid Admin credentials succeed
    const adminAuth = authenticateIMS('admin@noirdakshin.com', 'Noir@Admin2026');
    expect(adminAuth.success).toBe(true);
    expect(adminAuth.session?.role).toBe('ADMIN');

    // Valid IMS Engineer credentials succeed
    const engAuth = authenticateIMS('ims.engineer@noirdakshin.com', 'Noir@Engine2026');
    expect(engAuth.success).toBe(true);
    expect(engAuth.session?.role).toBe('IMS_ENGINEER');
  });

  it('9. AUTHORIZED UPDATES: Admin and IMS Engineer can adjust and restock inventory', () => {
    // Admin sets prod-10 to 0 first to test restocking from zero
    inventorySystem.setStockDirect('prod-10', 0, adminSession);
    // Engineer restocks prod-10 by +6
    const updatedStock = inventorySystem.restock('prod-10', 6, engineerSession);
    expect(updatedStock).toBe(6);
    expect(inventorySystem.getStock('prod-10')).toBe(6);
    expect(inventorySystem.getStockStatus('prod-10')).toBe('IN_STOCK');

    // Admin sets prod-01 directly to 20
    const setStock = inventorySystem.setStockDirect('prod-01', 20, adminSession);
    expect(setStock).toBe(20);
    expect(inventorySystem.getStock('prod-01')).toBe(20);

    // Admin resets inventory
    inventorySystem.resetAllToDefault(adminSession);
    expect(inventorySystem.getStock('prod-01')).toBe(14);
    expect(inventorySystem.getStock('prod-10')).toBe(10);
  });

  it('10. Chaos Invariant: Stock can NEVER fall below zero even when set by operator', () => {
    inventorySystem.setStockDirect('prod-03', -50, adminSession);
    expect(inventorySystem.getStock('prod-03')).toBe(0);
    expect(inventorySystem.getStockStatus('prod-03')).toBe('OUT_OF_STOCK');
  });
});
