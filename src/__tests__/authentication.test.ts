import { describe, it, expect, beforeEach } from 'vitest';
import { UsersStore } from '../server/usersStore';
import { OrdersStore } from '../server/ordersStore';
import { isValidEmail, isValidName, isValidPhone } from '../utils/validation';
import type { CustomerProfile, SavedAddress } from '../types/auth';

describe('Customer Authentication & Profile Management System', () => {
  beforeEach(() => {
    // Clear test user
    const testEmail = 'patron.test@noirkaapi.in';
    const existing = UsersStore.getUserByEmail(testEmail);
    if (existing) {
      // In-memory test state
    }
  });

  describe('Field Validation Security', () => {
    it('validates alphabetic customer names and rejects numeric/symbols', () => {
      expect(isValidName('Kavita Iyer')).toBe(true);
      expect(isValidName('A')).toBe(false); // Too short
      expect(isValidName('Kavita123')).toBe(false); // Numbers
      expect(isValidName('Kavita<script>')).toBe(false); // Script tags
    });

    it('strictly validates email syntax', () => {
      expect(isValidEmail('patron@noirkaapi.in')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@nodomain.com')).toBe(false);
      expect(isValidEmail('spaces in@email.com')).toBe(false);
    });

    it('validates phone numbers with minimum 7 digits', () => {
      expect(isValidPhone('9876543210')).toBe(true);
      expect(isValidPhone('+91 98765 43210')).toBe(true);
      expect(isValidPhone('123')).toBe(false);
    });
  });

  describe('User Registration & Duplicate Prevention', () => {
    const testUser: CustomerProfile = {
      uid: 'usr_unit_test_01',
      memberId: 'NR-2026-9901',
      fullName: 'Ananya Sharma',
      email: 'ananya.sharma@noirkaapi.in',
      phone: '9876543210',
      role: 'CUSTOMER',
      authProvider: 'password',
      savedAddresses: [],
      preferences: {
        favoriteGrind: 'Whole Bean',
        newsletter: true,
        cuppingAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    it('successfully registers and saves a new customer profile', () => {
      const saved = UsersStore.saveUser(testUser);
      expect(saved.email).toBe('ananya.sharma@noirkaapi.in');
      expect(saved.memberId).toMatch(/^NR-2026-\d{4}$/);

      const retrieved = UsersStore.getUserByEmail('ananya.sharma@noirkaapi.in');
      expect(retrieved).toBeDefined();
      expect(retrieved?.fullName).toBe('Ananya Sharma');
    });

    it('retrieves user by memberId or email case-insensitively', () => {
      UsersStore.saveUser(testUser);

      const byEmailUpper = UsersStore.getUserByEmail('ANANYA.SHARMA@NOIRKAAPI.IN');
      expect(byEmailUpper).toBeDefined();
      expect(byEmailUpper?.memberId).toBe('NR-2026-9901');

      const byId = UsersStore.getUserById('NR-2026-9901');
      expect(byId).toBeDefined();
      expect(byId?.email).toBe('ananya.sharma@noirkaapi.in');
    });
  });

  describe('Delivery Address Management', () => {
    const testEmail = 'ananya.sharma@noirkaapi.in';

    it('adds a delivery address and automatically marks first address as default', () => {
      const addr1: SavedAddress = {
        id: 'addr_home_1',
        label: 'Home',
        fullName: 'Ananya Sharma',
        phone: '9876543210',
        street: '12th Main, Indiranagar',
        city: 'Bengaluru',
        postalCode: '560038',
        country: 'India',
        isDefault: false,
      };

      const updated = UsersStore.addAddress(testEmail, addr1);
      expect(updated?.savedAddresses.length).toBe(1);
      expect(updated?.savedAddresses[0].isDefault).toBe(true); // First address becomes default
    });

    it('sets a new address as default and clears previous default flag', () => {
      const addr2: SavedAddress = {
        id: 'addr_office_2',
        label: 'Studio',
        fullName: 'Ananya Sharma',
        phone: '9876543210',
        street: 'MG Road',
        city: 'Bengaluru',
        postalCode: '560001',
        country: 'India',
        isDefault: true,
      };

      const updated = UsersStore.addAddress(testEmail, addr2);
      expect(updated?.savedAddresses.length).toBe(2);

      const studioAddr = updated?.savedAddresses.find((a) => a.id === 'addr_office_2');
      const homeAddr = updated?.savedAddresses.find((a) => a.id === 'addr_home_1');

      expect(studioAddr?.isDefault).toBe(true);
      expect(homeAddr?.isDefault).toBe(false);
    });

    it('removes an address safely', () => {
      const updated = UsersStore.deleteAddress(testEmail, 'addr_home_1');
      expect(updated?.savedAddresses.length).toBe(1);
      expect(updated?.savedAddresses[0].id).toBe('addr_office_2');
      expect(updated?.savedAddresses[0].isDefault).toBe(true);
    });
  });

  describe('Customer Data Protection & Order Isolation', () => {
    it('only returns orders belonging to the authenticated customer', () => {
      // Create test order for customer A
      const orderA = {
        id: 'ord_test_customer_a',
        orderNumber: 'NR-2026-1111',
        customerName: 'Customer A',
        customerEmail: 'customer.a@noirkaapi.in',
        customerPhone: '9876543210',
        shippingAddress: {
          fullName: 'Customer A',
          email: 'customer.a@noirkaapi.in',
          phone: '9876543210',
          address: 'Street A',
          city: 'Bengaluru',
          postalCode: '560001',
          country: 'India',
        },
        items: [],
        pricing: {
          subtotal: 2400,
          discountAmount: 0,
          shippingCost: 0,
          finalTotal: 2400,
          amountInPaise: 240000,
          currency: 'INR' as const,
        },
        paymentMethod: 'cod' as const,
        paymentStatus: 'pending' as const,
        fulfillmentStatus: 'unfulfilled' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      OrdersStore.saveOrder(orderA);

      // Customer A should see their order
      const ordersA = OrdersStore.getCustomerOrders('customer.a@noirkaapi.in');
      expect(ordersA.some((o) => o.id === 'ord_test_customer_a')).toBe(true);

      // Customer B must NOT see Customer A's order
      const ordersB = OrdersStore.getCustomerOrders('customer.b@noirkaapi.in');
      expect(ordersB.some((o) => o.id === 'ord_test_customer_a')).toBe(false);
    });
  });
});
