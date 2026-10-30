/**
 * Server-Side Persistent Order & Transaction Registry
 * Manages orders, idempotency, UTR submissions, and payment states.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { CustomerOrder } from '../types/payment';

function getOrdersFilePath(): string {
  try {
    const localDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return path.join(localDir, 'orders.json');
  } catch {
    const tmpDir = path.join(os.tmpdir(), 'noir-dakshin-orders');
    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
    } catch {
      // Ignored
    }
    return path.join(tmpDir, 'orders.json');
  }
}

// In-Memory Fast Cache & Primary Record
let ordersCache: Map<string, CustomerOrder> = new Map();

function loadOrdersFromDisk(): void {
  try {
    const filePath = getOrdersFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      if (raw.trim()) {
        const parsed: CustomerOrder[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          ordersCache = new Map(parsed.map((o) => [o.id, o]));
          return;
        }
      }
    }
  } catch (err) {
    console.warn('Orders storage read notice (in-memory active):', err);
  }
}

function persistOrdersToDisk(): void {
  try {
    const filePath = getOrdersFilePath();
    const list = Array.from(ordersCache.values());
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Orders persistence notice (in-memory active):', err);
  }
}

// Initial safe load
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
   * STRICT ACCESS CONTROL: Customers only see their own email, memberId, or phone orders
   */
  public static getCustomerOrders(identifier: string, phoneQuery?: string): CustomerOrder[] {
    const clean = identifier ? identifier.trim().toLowerCase() : '';
    const cleanPhone = phoneQuery ? phoneQuery.replace(/[^0-9]/g, '') : '';
    if (!clean && !cleanPhone) return [];
    const results: CustomerOrder[] = [];

    for (const order of ordersCache.values()) {
      const matchEmail = clean && order.customerEmail.toLowerCase() === clean;
      const matchCustomer = clean && order.customerId && order.customerId.toLowerCase() === clean;
      const orderPhone = order.customerPhone ? order.customerPhone.replace(/[^0-9]/g, '') : '';
      const matchPhone = cleanPhone && orderPhone && (
        orderPhone.endsWith(cleanPhone.slice(-10)) ||
        cleanPhone.endsWith(orderPhone.slice(-10))
      );

      if (matchEmail || matchCustomer || matchPhone) {
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
