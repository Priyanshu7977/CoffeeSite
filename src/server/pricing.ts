/**
 * Authoritative Backend Pricing & Order Valuation Engine
 * CRITICAL SECURITY GUARANTEE:
 * Client-submitted prices or totals are NEVER trusted.
 * Authoritative prices are calculated exclusively from server-side product records.
 */

import { NOIR_PRODUCTS } from '../data/products';
import type { OrderItemSnapshot, OrderPricing } from '../types/payment';

// Normalized Authoritative Price Map (in INR Rupees)
export const AUTHORITATIVE_CATALOG_PRICES: Record<string, { name: string; origin: string; priceRupees: number }> = {};

NOIR_PRODUCTS.forEach((prod) => {
  const numeric = parseFloat(prod.price.replace(/[^0-9.]/g, '')) || 2400;
  AUTHORITATIVE_CATALOG_PRICES[prod.id] = {
    name: prod.name,
    origin: `${prod.num} • ${prod.origin}`,
    priceRupees: Math.round(numeric),
  };
});

// Authoritative Discount Promo Codes
export const VALID_DISCOUNT_PROMOS: Record<string, number> = {
  FIRST10: 10,    // 10% Off 1st-Time Customer Promo
  WELCOME10: 10,  // 10% Off Welcome Promo
  BANK15: 15,     // 15% Off UPI & Bank Payment Promo
  UPI15: 15,      // 15% Off UPI Payment Promo
  ROAST20: 20,    // 20% Off Connoisseur Roasts Promo
  NOIR20: 20,     // 20% Off Specialty Estate Micro-Lots
  NOIRVIP10: 10,  // 10% Off 48h Cart Urgency Promo
  NOIR10: 10,     // 10% Off Welcome Promo
  VIP10: 10,      // 10% Off Member Privilege Promo
  COFFEE20: 20,   // 20% Off Connoisseur Promo
  FIRSTROAST: 10, // 10% Off First Roast Promo
};

export interface IncomingOrderItem {
  productId: string;
  grind?: string;
  quantity: number;
}

export interface AuthoritativeValuationResult {
  isValid: boolean;
  error?: string;
  items: OrderItemSnapshot[];
  pricing: OrderPricing;
}

/**
 * Validates product IDs and calculates authoritative subtotal, discounts, and final payable amount.
 */
export function calculateAuthoritativeValuation(
  incomingItems: IncomingOrderItem[],
  discountCode?: string,
  paymentMethod?: string
): AuthoritativeValuationResult {
  if (!incomingItems || !Array.isArray(incomingItems) || incomingItems.length === 0) {
    return {
      isValid: false,
      error: 'Cannot calculate valuation for empty or missing cart items.',
      items: [],
      pricing: {
        subtotal: 0,
        discountAmount: 0,
        shippingCost: 0,
        finalTotal: 0,
        amountInPaise: 0,
        currency: 'INR',
      },
    };
  }

  const validatedItems: OrderItemSnapshot[] = [];
  let subtotal = 0;

  for (const item of incomingItems) {
    if (!item || typeof item.productId !== 'string') {
      return {
        isValid: false,
        error: 'Invalid item payload detected.',
        items: [],
        pricing: {
          subtotal: 0,
          discountAmount: 0,
          shippingCost: 0,
          finalTotal: 0,
          amountInPaise: 0,
          currency: 'INR',
        },
      };
    }

    const catalogRecord = AUTHORITATIVE_CATALOG_PRICES[item.productId];
    if (!catalogRecord) {
      return {
        isValid: false,
        error: `Unrecognized product lot ID: ${item.productId}.`,
        items: [],
        pricing: {
          subtotal: 0,
          discountAmount: 0,
          shippingCost: 0,
          finalTotal: 0,
          amountInPaise: 0,
          currency: 'INR',
        },
      };
    }

    const safeQty = Math.floor(item.quantity);
    if (!Number.isFinite(safeQty) || safeQty <= 0 || safeQty > 50) {
      return {
        isValid: false,
        error: `Invalid quantity (${item.quantity}) for product ${catalogRecord.name}. Must be between 1 and 50.`,
        items: [],
        pricing: {
          subtotal: 0,
          discountAmount: 0,
          shippingCost: 0,
          finalTotal: 0,
          amountInPaise: 0,
          currency: 'INR',
        },
      };
    }

    const unitPrice = catalogRecord.priceRupees;
    const lineTotal = unitPrice * safeQty;
    subtotal += lineTotal;

    validatedItems.push({
      productId: item.productId,
      name: catalogRecord.name,
      origin: catalogRecord.origin,
      grind: item.grind?.trim() || 'Filter Fine (Brass Davarah)',
      quantity: safeQty,
      unitPrice,
      lineTotal,
    });
  }

  // Calculate discount if valid promo code provided
  let discountAmount = 0;
  let appliedCode: string | undefined = undefined;

  if (discountCode && typeof discountCode === 'string') {
    const cleanCode = discountCode.trim().toUpperCase();
    if (Object.prototype.hasOwnProperty.call(VALID_DISCOUNT_PROMOS, cleanCode)) {
      const percent = VALID_DISCOUNT_PROMOS[cleanCode];
      discountAmount = Math.round((subtotal * percent) / 100);
      appliedCode = cleanCode;
    }
  }

  const shippingCost = 0; // Free direct single-estate express shipping across India
  const codFee = paymentMethod === 'cod' ? 100 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost + codFee);
  const amountInPaise = finalTotal * 100; // Razorpay requires integers in smallest currency unit

  return {
    isValid: true,
    items: validatedItems,
    pricing: {
      subtotal,
      discountAmount,
      discountCode: appliedCode,
      shippingCost,
      codFee,
      finalTotal,
      amountInPaise,
      currency: 'INR',
    },
  };
}
