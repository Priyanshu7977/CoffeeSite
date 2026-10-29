import type { CollectionItem } from '../types';
import { 
  dispatch1HourCartReminderEmail, 
  dispatch24HourSocialProofEmail, 
  dispatch48HourDiscountUrgentEmail,
  type AutomatedEmail 
} from './emailService';

export interface CartAutomationState {
  cartUpdatedAt: number;
  customerEmail: string;
  customerName: string;
  itemsCount: number;
  totalAmount: string;
  step1hSent: boolean;
  step1hSentAt?: string;
  step24hSent: boolean;
  step24hSentAt?: string;
  step48hSent: boolean;
  step48hSentAt?: string;
  isOrderCompleted: boolean;
}

const AUTOMATION_STORAGE_KEY = 'noir_cart_automation_state';

const defaultState: CartAutomationState = {
  cartUpdatedAt: 0,
  customerEmail: '',
  customerName: '',
  itemsCount: 0,
  totalAmount: '₹0',
  step1hSent: false,
  step24hSent: false,
  step48hSent: false,
  isOrderCompleted: false,
};

export const getAutomationState = (): CartAutomationState => {
  try {
    const raw = localStorage.getItem(AUTOMATION_STORAGE_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch {
    return defaultState;
  }
};

export const saveAutomationState = (state: CartAutomationState) => {
  try {
    localStorage.setItem(AUTOMATION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Local storage fallback
  }
};

/**
 * Records whenever a visitor adds to cart or updates items
 */
export const recordCartActivity = (
  items: CollectionItem[],
  totalAmount: string,
  email?: string,
  name?: string
) => {
  if (items.length === 0) {
    // If cart is empty, reset sequence
    saveAutomationState({
      ...defaultState,
      customerEmail: email || getAutomationState().customerEmail,
      customerName: name || getAutomationState().customerName,
    });
    return;
  }

  const current = getAutomationState();
  const nextEmail = email || current.customerEmail || 'patron@noirdakshin.com';
  const nextName = name || current.customerName || 'Coffee Lover';

  saveAutomationState({
    ...current,
    cartUpdatedAt: Date.now(),
    customerEmail: nextEmail,
    customerName: nextName,
    itemsCount: items.reduce((sum, it) => sum + it.quantity, 0),
    totalAmount,
    isOrderCompleted: false,
  });
};

/**
 * Triggers a specific step in the 1hr / 24hr / 48hr sequence
 */
export const triggerAutomationStep = (
  step: '1h' | '24h' | '48h',
  items: CollectionItem[],
  totalAmount: string,
  emailOverride?: string,
  nameOverride?: string
): AutomatedEmail => {
  const state = getAutomationState();
  const targetEmail = emailOverride || state.customerEmail || 'patron@noirdakshin.com';
  const targetName = nameOverride || state.customerName || 'Coffee Lover';

  let dispatched: AutomatedEmail;

  if (step === '1h') {
    dispatched = dispatch1HourCartReminderEmail(targetName, targetEmail, items, totalAmount);
    saveAutomationState({
      ...state,
      customerEmail: targetEmail,
      customerName: targetName,
      step1hSent: true,
      step1hSentAt: new Date().toISOString(),
    });
  } else if (step === '24h') {
    dispatched = dispatch24HourSocialProofEmail(targetName, targetEmail, items, totalAmount);
    saveAutomationState({
      ...state,
      customerEmail: targetEmail,
      customerName: targetName,
      step24hSent: true,
      step24hSentAt: new Date().toISOString(),
    });
  } else {
    dispatched = dispatch48HourDiscountUrgentEmail(targetName, targetEmail, items, totalAmount);
    saveAutomationState({
      ...state,
      customerEmail: targetEmail,
      customerName: targetName,
      step48hSent: true,
      step48hSentAt: new Date().toISOString(),
    });
  }

  return dispatched;
};

/**
 * Marks order completed, stopping further abandoned cart automation
 */
export const markOrderCompleted = () => {
  const state = getAutomationState();
  saveAutomationState({
    ...state,
    isOrderCompleted: true,
  });
};
