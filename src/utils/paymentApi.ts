/**
 * Frontend Payment & Order API Client
 * Interfaces with the backend endpoints (/api/payment/* and /api/orders/*)
 */

import type { CustomerOrder, CustomUpiQrConfig, PaymentMethodType } from '../types/payment';
import { CUSTOM_UPI_QR_OPTIONS } from '../types/payment';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export interface CreateOrderPayload {
  items: Array<{ productId: string; quantity: number; grind?: string }>;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    memberId?: string;
  };
  discountCode?: string;
  paymentMethod: PaymentMethodType;
  customQrId?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  orderNumber: string;
  paymentMethod: PaymentMethodType;
  amount?: number;
  currency?: string;
  razorpayOrderId?: string;
  keyId?: string;
  customQrId?: string;
  order?: CustomerOrder;
  error?: string;
}

export interface VerifySignaturePayload {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifySignatureResponse {
  success: boolean;
  message?: string;
  order?: CustomerOrder;
  error?: string;
}

export interface SubmitUtrPayload {
  orderId: string;
  utrNumber: string;
  customQrId: string;
}

export interface SubmitUtrResponse {
  success: boolean;
  message?: string;
  order?: CustomerOrder;
  error?: string;
}

export interface PaymentConfigResponse {
  keyId: string;
  currency: string;
  merchantName: string;
  customQrOptions: CustomUpiQrConfig[];
}

/**
 * Fetches gateway public key and configured QR options
 */
export async function getPaymentConfig(): Promise<PaymentConfigResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/payment/config`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend payment config fetch fallback:', err);
  }

  // Graceful fallback to client-configured public test key
  const fallbackKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TsqAJmo20ycL7d';
  return {
    keyId: fallbackKey,
    currency: 'INR',
    merchantName: 'NOIR DAKSHIN COFFEE',
    customQrOptions: CUSTOM_UPI_QR_OPTIONS,
  };
}

/**
 * Creates an authoritative pending order on the backend
 */
export async function createCheckoutOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  const res = await fetch(`${API_BASE}/api/payment/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create order on server.');
  }

  return data;
}

/**
 * Verifies Razorpay payment signature on backend
 */
export async function verifyPaymentSignatureOnServer(
  payload: VerifySignaturePayload
): Promise<VerifySignatureResponse> {
  const res = await fetch(`${API_BASE}/api/payment/verify-signature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Payment verification failed on server.');
  }

  return data;
}

/**
 * Submits customer's custom UPI reference / UTR number
 */
export async function submitCustomUpiUtr(payload: SubmitUtrPayload): Promise<SubmitUtrResponse> {
  const res = await fetch(`${API_BASE}/api/payment/submit-utr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit UTR reference.');
  }

  return data;
}

/**
 * Fetches order history for a customer
 */
export async function getCustomerOrders(emailOrMemberId: string): Promise<CustomerOrder[]> {
  try {
    const params = new URLSearchParams();
    if (emailOrMemberId.includes('@')) {
      params.set('email', emailOrMemberId);
    } else {
      params.set('memberId', emailOrMemberId);
    }

    const res = await fetch(`${API_BASE}/api/orders/my-orders?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return data.orders || [];
    }
  } catch (err) {
    console.warn('Failed to fetch customer orders from backend:', err);
  }
  return [];
}

/**
 * Admin: Fetches all orders (requires IMS Admin role)
 */
export async function getAdminOrders(role: string = 'ADMIN'): Promise<CustomerOrder[]> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/orders`, {
      headers: {
        'x-admin-role': role,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data.orders || [];
    }
  } catch (err) {
    console.warn('Failed to fetch admin orders:', err);
  }
  return [];
}

/**
 * Admin: Verifies or rejects custom UPI UTR payment
 */
export async function adminVerifyUtr(
  orderId: string,
  isApproved: boolean,
  verifiedBy: string,
  notes?: string
): Promise<CustomerOrder> {
  const res = await fetch(`${API_BASE}/api/admin/verify-utr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-role': 'ADMIN',
    },
    body: JSON.stringify({ orderId, isApproved, verifiedBy, notes }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update order verification.');
  }

  return data.order;
}
