/**
 * Server-Side Persistent Order & Transaction Registry
 * Manages orders, idempotency, UTR submissions, and payment states.
 */

import fs from 'node:fs';
import path from 'node:path';
import type { CustomerOrder } from '../types/payment';

const ORDERS_DIR = path.resolve(process.cwd(), 'data');
const ORDERS_FILE = path.join(ORDERS_DIR, 'orders.json');

// In-Memory Fast Cache & Primary Record
let ordersCache: Map<string, CustomerOrder> = new Map();

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(ORDERS_DIR)) {
      fs.mkdirSync(ORDERS_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('Orders directory creation notice:', err);
  }
}

function loadOrdersFromDisk(): void {
  try {
    ensureDataDir();
    if (fs.existsSync(ORDERS_FILE)) {
      const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
      if (raw.trim()) {
        const parsed: CustomerOrder[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          ordersCache = new Map(parsed.map((o) => [o.id, o]));
          return;
        }
      }
    }
  } catch (err) {
    console.warn('Error reading orders from disk, using in-memory store:', err);
  }
}

function persistOrdersToDisk(): void {
  try {
    ensureDataDir();
    const list = Array.from(ordersCache.values());
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to persist orders to disk (running in-memory):', err);
  }
}

// Initial load
loadOrdersFromDisk();

export class OrdersStore {
  /**
   * Creates or updates an order in the database
   */
  public static saveOrder(order: CustomerOrder): CustomerOrder {
    const updatedOrder = {
      ...order,
      updatedAt: new Date().toISOString(),
    };
    ordersCache.set(order.id, updatedOrder);
    persistOrdersToDisk();
    return updatedOrder;
  }

  /**
   * Retrieves an order by internal UUID
   */
  public static getOrderById(id: string): CustomerOrder | null {
    return ordersCache.get(id) || null;
  }

  /**
   * Retrieves an order by public Order Number (e.g. NR-2026-8942)
   */
  public static getOrderByNumber(orderNumber: string): CustomerOrder | null {
    for (const order of ordersCache.values()) {
      if (order.orderNumber === orderNumber) {
        return order;
      }
    }
    return null;
  }

  /**
   * Retrieves an order by Razorpay Order ID (e.g. order_O123456789)
   */
  public static getOrderByRazorpayOrderId(rzpOrderId: string): CustomerOrder | null {
    if (!rzpOrderId) return null;
    for (const order of ordersCache.values()) {
      if (order.razorpayOrderId === rzpOrderId) {
        return order;
      }
    }
    return null;
  }

  /**
   * Idempotently updates order payment status and gateway transaction details
   */
  public static updateOrderPayment(
    orderId: string,
    updates: {
      paymentStatus: CustomerOrder['paymentStatus'];
      razorpayPaymentId?: string;
      razorpaySignature?: string;
      utrNumber?: string;
      customQrId?: string;
      adminVerification?: CustomerOrder['adminVerification'];
      fulfillmentStatus?: CustomerOrder['fulfillmentStatus'];
    }
  ): CustomerOrder | null {
    const existing = this.getOrderById(orderId);
    if (!existing) return null;

    // Idempotency: if already captured, do not regress to pending
    if (existing.paymentStatus === 'captured' && updates.paymentStatus !== 'captured' && updates.paymentStatus !== 'refunded') {
      return existing;
    }

    const merged: CustomerOrder = {
      ...existing,
      paymentStatus: updates.paymentStatus,
      razorpayPaymentId: updates.razorpayPaymentId || existing.razorpayPaymentId,
      razorpaySignature: updates.razorpaySignature || existing.razorpaySignature,
      utrNumber: updates.utrNumber || existing.utrNumber,
      customQrId: updates.customQrId || existing.customQrId,
      adminVerification: updates.adminVerification || existing.adminVerification,
      fulfillmentStatus: updates.fulfillmentStatus || existing.fulfillmentStatus,
      updatedAt: new Date().toISOString(),
    };

    return this.saveOrder(merged);
  }

  /**
   * Retrieves all orders belonging to a customer
   * STRICT ACCESS CONTROL: Customers only see their own email or memberId orders
   */
  public static getCustomerOrders(identifier: string): CustomerOrder[] {
    if (!identifier || typeof identifier !== 'string') return [];
    const clean = identifier.trim().toLowerCase();
    const results: CustomerOrder[] = [];

    for (const order of ordersCache.values()) {
      const matchEmail = order.customerEmail.toLowerCase() === clean;
      const matchCustomer = order.customerId && order.customerId.toLowerCase() === clean;
      if (matchEmail || matchCustomer) {
        results.push(order);
      }
    }

    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Admin Only: Returns all registered orders
   */
  public static getAllOrders(): CustomerOrder[] {
    return Array.from(ordersCache.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Admin Only: Approves or rejects custom UPI UTR payment
   */
  public static verifyUtr(
    orderId: string,
    verifiedBy: string,
    isApproved: boolean,
    notes?: string
  ): CustomerOrder | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    const verificationRecord = {
      status: isApproved ? ('verified' as const) : ('rejected' as const),
      verifiedBy,
      verifiedAt: new Date().toISOString(),
      adminNotes: notes || (isApproved ? 'UTR verified against bank statement' : 'UTR rejected: Transaction not found'),
    };

    return this.updateOrderPayment(orderId, {
      paymentStatus: isApproved ? 'captured' : 'failed',
      fulfillmentStatus: isApproved ? 'roasting' : 'unfulfilled',
      adminVerification: verificationRecord,
    });
  }

  /**
   * Reset store (for testing purposes)
   */
  public static resetForTesting(): void {
    ordersCache.clear();
  }
}
