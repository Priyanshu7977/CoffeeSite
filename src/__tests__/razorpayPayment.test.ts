import { describe, it, expect, beforeEach } from 'vitest';
import crypto from 'node:crypto';
import { calculateAuthoritativeValuation } from '../server/pricing';
import { OrdersStore } from '../server/ordersStore';
import {
  verifyPaymentSignature,
  verifyWebhookSignature,
} from '../server/razorpayClient';
import type { CustomerOrder } from '../types/payment';

describe('Razorpay & Multi-Method Payment Integration Test Suite', () => {
  const TEST_KEY_SECRET = 'nktIhdNtA54KhUMF4OgASCYe';
  const TEST_WEBHOOK_SECRET = 'noir_whsec_test_2026';

  beforeEach(() => {
    process.env.RAZORPAY_KEY_ID = 'rzp_test_TsqAJmo20ycL7d';
    process.env.RAZORPAY_KEY_SECRET = TEST_KEY_SECRET;
    process.env.RAZORPAY_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;
    OrdersStore.resetForTesting();
  });

  // 1. Authoritative Pricing & Anti-Tampering Engine
  it('1. CALCULATES authoritative price snapshots and prevents client price tampering', () => {
    // prod-01 = ₹2,800, prod-02 = ₹2,400
    const valuation = calculateAuthoritativeValuation([
      { productId: 'prod-01', quantity: 2 },
      { productId: 'prod-02', quantity: 1 },
    ]);

    expect(valuation.isValid).toBe(true);
    // Subtotal: 2 * 2800 + 1 * 2400 = 5600 + 2400 = 8000
    expect(valuation.pricing.subtotal).toBe(8000);
    expect(valuation.pricing.finalTotal).toBe(8000);
    expect(valuation.pricing.amountInPaise).toBe(800000);
    expect(valuation.pricing.currency).toBe('INR');

    // 10% Discount Promo Code test
    const discounted = calculateAuthoritativeValuation(
      [
        { productId: 'prod-01', quantity: 1 }, // 2800
      ],
      'NOIRVIP10'
    );
    expect(discounted.isValid).toBe(true);
    expect(discounted.pricing.discountAmount).toBe(280); // 10% of 2800
    expect(discounted.pricing.finalTotal).toBe(2520);
    expect(discounted.pricing.amountInPaise).toBe(252000);
  });

  it('2. REJECTS invalid products, empty carts, and negative quantities', () => {
    const emptyValuation = calculateAuthoritativeValuation([]);
    expect(emptyValuation.isValid).toBe(false);

    const invalidProd = calculateAuthoritativeValuation([
      { productId: 'unknown-fake-bean', quantity: 1 },
    ]);
    expect(invalidProd.isValid).toBe(false);

    const negativeQty = calculateAuthoritativeValuation([
      { productId: 'prod-01', quantity: -3 },
    ]);
    expect(negativeQty.isValid).toBe(false);
  });

  // 2. Cryptographic Signature Verification
  it('3. VERIFIES authentic Razorpay payment signatures using HMAC-SHA256', () => {
    const orderId = 'order_DAKSHIN_12345';
    const paymentId = 'pay_MEMBER_98765';

    // Generate authentic signature
    const payload = `${orderId}|${paymentId}`;
    const validSignature = crypto
      .createHmac('sha256', TEST_KEY_SECRET)
      .update(payload)
      .digest('hex');

    const isValid = verifyPaymentSignature(orderId, paymentId, validSignature);
    expect(isValid).toBe(true);
  });

  it('4. BLOCKS tampered or forged Razorpay signatures', () => {
    const orderId = 'order_DAKSHIN_12345';
    const paymentId = 'pay_MEMBER_98765';
    const forgedSignature = 'forged_fake_signature_abc123';

    const isValid = verifyPaymentSignature(orderId, paymentId, forgedSignature);
    expect(isValid).toBe(false);

    // Mismatched order ID
    const validSignature = crypto
      .createHmac('sha256', TEST_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const mismatchedCheck = verifyPaymentSignature('order_DIFFERENT', paymentId, validSignature);
    expect(mismatchedCheck).toBe(false);
  });

  // 3. Webhook Signature Verification & Idempotency
  it('5. VERIFIES official Razorpay Webhook signatures using raw request body', () => {
    const webhookRawPayload = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: { entity: { id: 'pay_live_001', order_id: 'order_rzp_001', amount: 280000 } },
      },
    });

    const authenticWebhookSignature = crypto
      .createHmac('sha256', TEST_WEBHOOK_SECRET)
      .update(webhookRawPayload)
      .digest('hex');

    const isValid = verifyWebhookSignature(webhookRawPayload, authenticWebhookSignature);
    expect(isValid).toBe(true);

    const invalidCheck = verifyWebhookSignature(webhookRawPayload, 'tampered_webhook_sig');
    expect(invalidCheck).toBe(false);
  });

  // 4. Order Persistence & Customer Access Control
  it('6. ENFORCES strict customer data isolation (customers view only their own orders)', () => {
    const order1: CustomerOrder = {
      id: 'ord_01',
      orderNumber: 'NR-2026-1001',
      customerId: 'MEMBER-ARJUN',
      customerName: 'Arjun Rao',
      customerEmail: 'arjun@bengaluru.in',
      customerPhone: '+91 98765-11111',
      shippingAddress: {
        fullName: 'Arjun Rao',
        email: 'arjun@bengaluru.in',
        phone: '+91 98765-11111',
        address: '100ft Road',
        city: 'Bengaluru',
        postalCode: '560038',
        country: 'India',
      },
      items: [
        {
          productId: 'prod-01',
          name: 'BABA BUDAN OBSIDIAN',
          origin: 'Chikmagalur',
          grind: 'Filter Fine',
          quantity: 1,
          unitPrice: 2800,
          lineTotal: 2800,
        },
      ],
      pricing: {
        subtotal: 2800,
        discountAmount: 0,
        shippingCost: 0,
        finalTotal: 2800,
        amountInPaise: 280000,
        currency: 'INR',
      },
      paymentMethod: 'razorpay',
      paymentStatus: 'captured',
      razorpayOrderId: 'order_rzp_01',
      razorpayPaymentId: 'pay_rzp_01',
      fulfillmentStatus: 'roasting',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const order2: CustomerOrder = {
      ...order1,
      id: 'ord_02',
      orderNumber: 'NR-2026-1002',
      customerId: 'MEMBER-PRIYA',
      customerName: 'Priya Sharma',
      customerEmail: 'priya@mumbai.in',
    };

    OrdersStore.saveOrder(order1);
    OrdersStore.saveOrder(order2);

    // Arjun only gets his own orders
    const arjunOrders = OrdersStore.getCustomerOrders('arjun@bengaluru.in');
    expect(arjunOrders.length).toBe(1);
    expect(arjunOrders[0].orderNumber).toBe('NR-2026-1001');

    // Priya only gets her own orders
    const priyaOrders = OrdersStore.getCustomerOrders('priya@mumbai.in');
    expect(priyaOrders.length).toBe(1);
    expect(priyaOrders[0].orderNumber).toBe('NR-2026-1002');

    // Admin sees all
    const all = OrdersStore.getAllOrders();
    expect(all.length).toBe(2);
  });

  // 5. Cash on Delivery (COD) Workflow
  it('7. PROCESSES Cash on Delivery (COD) orders with pending status', () => {
    const codOrder: CustomerOrder = {
      id: 'ord_cod_01',
      orderNumber: 'NR-2026-COD-99',
      customerName: 'Vikram Patel',
      customerEmail: 'vikram@ahmedabad.in',
      customerPhone: '+91 99887-66554',
      shippingAddress: {
        fullName: 'Vikram Patel',
        email: 'vikram@ahmedabad.in',
        phone: '+91 99887-66554',
        address: 'CG Road',
        city: 'Ahmedabad',
        postalCode: '380009',
        country: 'India',
      },
      items: [
        {
          productId: 'prod-02',
          name: 'MALABAR MONSOONED SHORE',
          origin: 'Malabar Coast',
          grind: 'Whole Roasted Bean',
          quantity: 2,
          unitPrice: 2400,
          lineTotal: 4800,
        },
      ],
      pricing: {
        subtotal: 4800,
        discountAmount: 0,
        shippingCost: 0,
        finalTotal: 4800,
        amountInPaise: 480000,
        currency: 'INR',
      },
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      fulfillmentStatus: 'unfulfilled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    OrdersStore.saveOrder(codOrder);

    const saved = OrdersStore.getOrderById('ord_cod_01');
    expect(saved).not.toBeNull();
    expect(saved?.paymentMethod).toBe('cod');
    expect(saved?.paymentStatus).toBe('pending');
    expect(saved?.pricing.finalTotal).toBe(4800);
  });

  // 6. Custom Direct UPI QR & Admin UTR Verification Workflow
  it('8. HANDLES Custom Direct UPI QR submission and admin verification workflow', () => {
    const upiOrder: CustomerOrder = {
      id: 'ord_upi_01',
      orderNumber: 'NR-2026-UPI-77',
      customerName: 'Deepak Joshi',
      customerEmail: 'deepak@pune.in',
      customerPhone: '+91 91234-56789',
      shippingAddress: {
        fullName: 'Deepak Joshi',
        email: 'deepak@pune.in',
        phone: '+91 91234-56789',
        address: 'Kalyani Nagar',
        city: 'Pune',
        postalCode: '411006',
        country: 'India',
      },
      items: [
        {
          productId: 'prod-03',
          name: 'ARAKU VALLEY TRIBAL HONEY',
          origin: 'Araku Valley',
          grind: 'Pour Over',
          quantity: 1,
          unitPrice: 2600,
          lineTotal: 2600,
        },
      ],
      pricing: {
        subtotal: 2600,
        discountAmount: 0,
        shippingCost: 0,
        finalTotal: 2600,
        amountInPaise: 260000,
        currency: 'INR',
      },
      paymentMethod: 'custom_upi_qr',
      paymentStatus: 'awaiting_manual_verification',
      customQrId: 'qr-noir-roastery',
      fulfillmentStatus: 'unfulfilled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    OrdersStore.saveOrder(upiOrder);

    // Customer submits 12-digit UTR
    OrdersStore.updateOrderPayment('ord_upi_01', {
      paymentStatus: 'awaiting_manual_verification',
      utrNumber: '402918273645',
      customQrId: 'qr-noir-roastery',
    });

    const pending = OrdersStore.getOrderById('ord_upi_01');
    expect(pending?.paymentStatus).toBe('awaiting_manual_verification');
    expect(pending?.utrNumber).toBe('402918273645');

    // Admin verifies UTR against bank statement
    const verified = OrdersStore.verifyUtr('ord_upi_01', 'Master Roaster Admin', true, 'Bank statement matched');
    expect(verified?.paymentStatus).toBe('captured');
    expect(verified?.fulfillmentStatus).toBe('roasting');
    expect(verified?.adminVerification?.status).toBe('verified');
  });

  // 7. Idempotency Guard
  it('9. GUARDS against duplicate payment transitions (idempotent)', () => {
    const order: CustomerOrder = {
      id: 'ord_idempotent_01',
      orderNumber: 'NR-2026-IDEM-01',
      customerName: 'Sanjay Dutt',
      customerEmail: 'sanjay@delhi.in',
      customerPhone: '+91 98111-22233',
      shippingAddress: {
        fullName: 'Sanjay Dutt',
        email: 'sanjay@delhi.in',
        phone: '+91 98111-22233',
        address: 'Connaught Place',
        city: 'New Delhi',
        postalCode: '110001',
        country: 'India',
      },
      items: [
        {
          productId: 'prod-01',
          name: 'BABA BUDAN OBSIDIAN',
          origin: 'Chikmagalur',
          grind: 'Espresso',
          quantity: 1,
          unitPrice: 2800,
          lineTotal: 2800,
        },
      ],
      pricing: {
        subtotal: 2800,
        discountAmount: 0,
        shippingCost: 0,
        finalTotal: 2800,
        amountInPaise: 280000,
        currency: 'INR',
      },
      paymentMethod: 'razorpay',
      paymentStatus: 'captured',
      razorpayOrderId: 'order_test_dup',
      razorpayPaymentId: 'pay_test_dup',
      fulfillmentStatus: 'roasting',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    OrdersStore.saveOrder(order);

    // Attempt to regress captured order to pending via late duplicate webhook event
    const attempt = OrdersStore.updateOrderPayment('ord_idempotent_01', {
      paymentStatus: 'pending',
    });

    // Must remain captured
    expect(attempt?.paymentStatus).toBe('captured');
  });
});
