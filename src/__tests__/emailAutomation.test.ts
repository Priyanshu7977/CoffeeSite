import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getAutomationState, 
  recordCartActivity, 
  triggerAutomationStep, 
  markOrderCompleted 
} from '../utils/emailAutomationSystem';
import { getDispatchedEmails } from '../utils/emailService';
import { NOIR_PRODUCTS } from '../data/products';
import type { CollectionItem } from '../types';

// Mock localStorage for node test runner
const storageMap = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, val: string) => storageMap.set(key, String(val)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
};
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

const mockItem: CollectionItem = {
  product: NOIR_PRODUCTS[0],
  quantity: 2,
  grind: 'Traditional South Indian Filter (80:20)',
  certificateId: 'NR-TEST-001',
};

describe('1HR, 24HR, 48HR Roastery Email Automation System', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('records cart additions and updates automation state', () => {
    recordCartActivity([mockItem], '₹1,900', 'brewer@example.com', 'Dev Brewer');
    const state = getAutomationState();

    expect(state.itemsCount).toBe(2);
    expect(state.totalAmount).toBe('₹1,900');
    expect(state.customerEmail).toBe('brewer@example.com');
    expect(state.customerName).toBe('Dev Brewer');
    expect(state.isOrderCompleted).toBe(false);
  });

  it('correctly resets state when cart becomes empty', () => {
    recordCartActivity([mockItem], '₹1,900', 'brewer@example.com', 'Dev Brewer');
    expect(getAutomationState().itemsCount).toBe(2);

    recordCartActivity([], '₹0');
    expect(getAutomationState().itemsCount).toBe(0);
  });

  it('triggers 1-hour cart hold sequence email with reserved batch', () => {
    const email = triggerAutomationStep('1h', [mockItem], '₹1,900', 'brewer@example.com', 'Dev Brewer');

    expect(email.type).toBe('abandoned_cart_1h');
    expect(email.subject).toContain('fresh coffee');
    expect(email.to).toBe('brewer@example.com');
    expect(email.details.items?.length).toBe(1);

    const state = getAutomationState();
    expect(state.step1hSent).toBe(true);
    expect(state.step1hSentAt).toBeDefined();

    const storedEmails = getDispatchedEmails();
    expect(storedEmails.some((e) => e.type === 'abandoned_cart_1h')).toBe(true);
  });

  it('triggers 24-hour review and feedback email with verified ratings', () => {
    const email = triggerAutomationStep('24h', [mockItem], '₹1,900', 'brewer@example.com', 'Dev Brewer');

    expect(email.type).toBe('feedback_social_proof_24h');
    expect(email.subject).toContain('say');
    expect(email.details.feedbackReview?.rating).toBe(5);

    const state = getAutomationState();
    expect(state.step24hSent).toBe(true);
    expect(state.step24hSentAt).toBeDefined();
  });

  it('triggers 48-hour urgency email with 10% discount code NOIRVIP10', () => {
    const email = triggerAutomationStep('48h', [mockItem], '₹1,900', 'brewer@example.com', 'Dev Brewer');

    expect(email.type).toBe('discount_urgency_48h');
    expect(email.subject).toContain('10%');
    expect(email.details.discountCode).toBe('NOIRVIP10');
    expect(email.details.discountPercent).toBe(10);

    const state = getAutomationState();
    expect(state.step48hSent).toBe(true);
    expect(state.step48hSentAt).toBeDefined();
  });

  it('marks order completed to stop sequence once user checks out', () => {
    recordCartActivity([mockItem], '₹1,900');
    expect(getAutomationState().isOrderCompleted).toBe(false);

    markOrderCompleted();
    expect(getAutomationState().isOrderCompleted).toBe(true);
  });
});
