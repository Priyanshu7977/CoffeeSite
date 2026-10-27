/**
 * Express Application & REST API Router for Noir Dakshin Coffee
 * Handles Razorpay checkout orders, cryptographic signature verification,
 * webhooks, custom UPI QR UTR submissions, and order management.
 */

import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { calculateAuthoritativeValuation } from './pricing';
import { OrdersStore } from './ordersStore';
import {
  getRazorpayCredentials,
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  fetchPaymentDetails,
} from './razorpayClient';
import { CUSTOM_UPI_QR_OPTIONS, type CustomerOrder, type PaymentMethodType } from '../types/payment';
import { inventorySystem } from '../utils/inventorySystem';
import {
  isValidName,
  isValidEmail,
  isValidPhone,
  sanitizeAddress,
  sanitizeCity,
  sanitizePostalCode,
  sanitizeCountry,
} from '../utils/validation';

// Load environment variables
dotenv.config();

export const app = express();

// Middlewares
app.use(cors());

// Capture raw body for webhook HMAC validation
app.use(
  express.json({
    verify: (req: Request, _res: Response, buf: Buffer) => {
      (req as unknown as { rawBody: Buffer }).rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: true }));

/**
 * 1. Health check
 */
app.get('/api/health', (_req: Request, res: Response) => {
  const { keyId } = getRazorpayCredentials();
  res.json({
    status: 'ok',
    service: 'Noir Dakshin Coffee Payment Gateway',
    razorpayConfigured: Boolean(keyId),
    timestamp: new Date().toISOString(),
  });
});

/**
 * 2. Public Gateway Configuration
 * Only returns the PUBLIC Key ID and configurable QR options. NEVER exposes the secret!
 */
app.get('/api/payment/config', (_req: Request, res: Response) => {
  const { keyId } = getRazorpayCredentials();
  res.json({
    keyId,
    currency: 'INR',
    merchantName: 'NOIR DAKSHIN COFFEE',
    customQrOptions: CUSTOM_UPI_QR_OPTIONS,
  });
});

/**
 * 3. Create Checkout Order
 * - Authoritatively validates products & prices
 * - Creates pending database order
 * - If Razorpay: Creates order via Razorpay API
 * - If COD: Marks pending
 * - If Custom UPI QR: Marks awaiting_manual_verification
 */
app.post('/api/payment/create-order', async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, customer, discountCode, paymentMethod, customQrId } = req.body;

    // Security validation of customer fields
    if (!customer || typeof customer !== 'object') {
      res.status(400).json({ success: false, error: 'Customer details are required.' });
      return;
    }

    const fullName = customer.fullName?.trim() || '';
    const email = customer.email?.trim() || '';
    const phone = customer.phone?.trim() || '';
    const address = customer.address?.trim() || '';
    const city = customer.city?.trim() || 'Bengaluru';
    const postalCode = customer.postalCode?.trim() || '560038';
    const country = customer.country?.trim() || 'India';

    if (!isValidName(fullName)) {
      res.status(400).json({ success: false, error: 'Valid customer name is required (alphabets only).' });
      return;
    }
    if (!isValidEmail(email)) {
      res.status(400).json({ success: false, error: 'Valid customer email is required.' });
      return;
    }
    if (!isValidPhone(phone)) {
      res.status(400).json({ success: false, error: 'Valid phone number is required (min 7 digits).' });
      return;
    }
    if (address.length < 5) {
      res.status(400).json({ success: false, error: 'Complete delivery address is required.' });
      return;
    }

    // Authoritative Price Calculation (Ignores any client-supplied totals)
    const valuation = calculateAuthoritativeValuation(items, discountCode);
    if (!valuation.isValid) {
      res.status(400).json({ success: false, error: valuation.error || 'Invalid cart valuation.' });
      return;
    }

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const orderNumber = `NR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const validPaymentMethod: PaymentMethodType = ['razorpay', 'cod', 'custom_upi_qr'].includes(paymentMethod)
      ? paymentMethod
      : 'razorpay';

    const newOrder: CustomerOrder = {
      id: orderId,
      orderNumber,
      customerId: customer.memberId || undefined,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: {
        fullName,
        email,
        phone,
        address: sanitizeAddress(address),
        city: sanitizeCity(city),
        postalCode: sanitizePostalCode(postalCode),
        country: sanitizeCountry(country),
      },
      items: valuation.items,
      pricing: valuation.pricing,
      paymentMethod: validPaymentMethod,
      paymentStatus: validPaymentMethod === 'custom_upi_qr' ? 'awaiting_manual_verification' : 'pending',
      customQrId: validPaymentMethod === 'custom_upi_qr' ? customQrId : undefined,
      fulfillmentStatus: 'unfulfilled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 3A. Razorpay Flow
    if (validPaymentMethod === 'razorpay') {
      try {
        const rzpOrder = await createRazorpayOrder(
          valuation.pricing.amountInPaise,
          orderNumber,
          { internalOrderId: orderId, customerEmail: email }
        );

        newOrder.razorpayOrderId = rzpOrder.id;
        OrdersStore.saveOrder(newOrder);

        const { keyId } = getRazorpayCredentials();

        res.json({
          success: true,
          orderId,
          orderNumber,
          paymentMethod: 'razorpay',
          amount: valuation.pricing.amountInPaise,
          currency: 'INR',
          razorpayOrderId: rzpOrder.id,
          keyId,
          order: newOrder,
        });
        return;
      } catch (err: unknown) {
        console.error('Razorpay order creation error:', err);
        const errMsg = err instanceof Error ? err.message : 'Failed to communicate with Razorpay gateway.';
        res.status(502).json({
          success: false,
          error: `Razorpay Gateway Error: ${errMsg}`,
        });
        return;
      }
    }

    // 3B. Cash on Delivery Flow
    if (validPaymentMethod === 'cod') {
      newOrder.paymentStatus = 'pending';
      newOrder.fulfillmentStatus = 'unfulfilled';
      OrdersStore.saveOrder(newOrder);

      // Deduct stock for approved COD order
      inventorySystem.commitOrder(valuation.items.map((it: { productId: string; quantity: number }) => ({ productId: it.productId, quantity: it.quantity })));

      res.json({
        success: true,
        orderId,
        orderNumber,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        order: newOrder,
      });
      return;
    }

    // 3C. Custom UPI QR Flow
    if (validPaymentMethod === 'custom_upi_qr') {
      newOrder.paymentStatus = 'awaiting_manual_verification';
      newOrder.customQrId = customQrId || 'qr-noir-roastery';
      newOrder.adminVerification = {
        status: 'pending',
      };
      OrdersStore.saveOrder(newOrder);

      // Reserve stock while awaiting verification
      inventorySystem.commitOrder(valuation.items.map((it: { productId: string; quantity: number }) => ({ productId: it.productId, quantity: it.quantity })));

      res.json({
        success: true,
        orderId,
        orderNumber,
        paymentMethod: 'custom_upi_qr',
        paymentStatus: 'awaiting_manual_verification',
        customQrId: newOrder.customQrId,
        order: newOrder,
      });
      return;
    }
  } catch (error: unknown) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: 'Internal server error creating order.' });
  }
});

/**
 * 4. Verify Razorpay Payment Signature
 * - Verifies cryptographic HMAC-SHA256 signature
 * - Verifies with Razorpay API that payment is captured and amount matches
 * - Updates order to 'captured'
 * - Deducts inventory
 */
app.post('/api/payment/verify-signature', async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({
        success: false,
        error: 'Missing required Razorpay verification parameters.',
      });
      return;
    }

    // 1. Check order in database
    const order = OrdersStore.getOrderById(orderId);
    if (!order) {
      res.status(404).json({ success: false, error: 'Order not found in database.' });
      return;
    }

    // Verify order ID association matches
    if (order.razorpayOrderId !== razorpay_order_id) {
      res.status(403).json({
        success: false,
        error: 'Security Mismatch: Provided Razorpay order ID does not match server record.',
      });
      return;
    }

    // 2. Cryptographic signature check
    const isSignatureValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isSignatureValid) {
      res.status(400).json({
        success: false,
        error: 'Cryptographic Verification Failed: Invalid payment signature.',
      });
      return;
    }

    // 3. Authoritative check with Razorpay API
    let paymentDetails;
    try {
      paymentDetails = await fetchPaymentDetails(razorpay_payment_id);
    } catch (err) {
      console.warn('Could not fetch payment from Razorpay API, proceeding with signature check:', err);
    }

    if (paymentDetails) {
      // Validate payment amount (in paise)
      const expectedPaise = order.pricing.amountInPaise;
      const actualPaise = Number(paymentDetails.amount);

      if (actualPaise < expectedPaise) {
        res.status(400).json({
          success: false,
          error: `Payment amount mismatch: Expected ₹${order.pricing.finalTotal}, got ₹${actualPaise / 100}.`,
        });
        return;
      }

      // Check payment status
      if (paymentDetails.status !== 'captured' && paymentDetails.status !== 'authorized') {
        res.status(400).json({
          success: false,
          error: `Payment is not in captured status (Current status: ${paymentDetails.status}).`,
        });
        return;
      }
    }

    // 4. Update order payment status
    const updated = OrdersStore.updateOrderPayment(orderId, {
      paymentStatus: 'captured',
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      fulfillmentStatus: 'roasting',
    });

    // 5. Decrement inventory
    inventorySystem.commitOrder(order.items.map((it: { productId: string; quantity: number }) => ({ productId: it.productId, quantity: it.quantity })));

    res.json({
      success: true,
      message: 'Payment verified successfully.',
      order: updated,
    });
  } catch (error: unknown) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, error: 'Internal server error verifying signature.' });
  }
});

/**
 * 5. Submit Custom Direct UPI UTR Reference
 * Does NOT mark order paid immediately; marks as awaiting_manual_verification
 */
app.post('/api/payment/submit-utr', (req: Request, res: Response): void => {
  try {
    const { orderId, utrNumber, customQrId } = req.body;

    if (!orderId || typeof orderId !== 'string') {
      res.status(400).json({ success: false, error: 'Order ID is required.' });
      return;
    }

    if (!utrNumber || typeof utrNumber !== 'string') {
      res.status(400).json({ success: false, error: '12-digit UPI UTR or Reference Number is required.' });
      return;
    }

    const cleanUtr = utrNumber.replace(/[^A-Za-z0-9]/g, '').trim();
    if (cleanUtr.length < 6 || cleanUtr.length > 25) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid UPI Reference / UTR Number (6-22 characters).',
      });
      return;
    }

    const order = OrdersStore.getOrderById(orderId);
    if (!order) {
      res.status(404).json({ success: false, error: 'Order not found.' });
      return;
    }

    const updated = OrdersStore.updateOrderPayment(orderId, {
      paymentStatus: 'awaiting_manual_verification',
      utrNumber: cleanUtr,
      customQrId: customQrId || order.customQrId || 'qr-noir-roastery',
      adminVerification: {
        status: 'pending',
        adminNotes: 'Customer submitted UTR reference. Awaiting bank statement reconciliation.',
      },
    });

    res.json({
      success: true,
      message: 'UTR reference recorded. Order is awaiting manual verification by roastery finance.',
      order: updated,
    });
  } catch (error) {
    console.error('Error submitting UTR:', error);
    res.status(500).json({ success: false, error: 'Failed to record UTR reference.' });
  }
});

/**
 * 6. Razorpay Webhook Receiver
 * - Validates webhook signature using raw body
 * - Idempotently updates order when payment is captured
 */
app.post('/api/payment/webhook', (req: Request, res: Response): void => {
  try {
    const signature = (req.headers['x-razorpay-signature'] as string) || '';
    const rawBody = (req as unknown as { rawBody?: Buffer }).rawBody;

    if (!rawBody || !signature) {
      res.status(400).json({ status: 'error', error: 'Missing raw body or webhook signature.' });
      return;
    }

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn('Razorpay Webhook signature verification failed.');
      res.status(400).json({ status: 'error', error: 'Invalid webhook signature.' });
      return;
    }

    const event = req.body;
    const eventType = event.event;

    // Handle payment.captured or order.paid
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentPayload = event.payload?.payment?.entity;
      const orderPayload = event.payload?.order?.entity;
      const rzpOrderId = paymentPayload?.order_id || orderPayload?.id;
      const rzpPaymentId = paymentPayload?.id;

      if (rzpOrderId) {
        const order = OrdersStore.getOrderByRazorpayOrderId(rzpOrderId);
        if (order) {
          // Idempotent: only update if not already captured
          if (order.paymentStatus !== 'captured') {
            OrdersStore.updateOrderPayment(order.id, {
              paymentStatus: 'captured',
              razorpayPaymentId: rzpPaymentId,
              fulfillmentStatus: 'roasting',
            });
            // Commit stock
            inventorySystem.commitOrder(order.items.map((it: { productId: string; quantity: number }) => ({ productId: it.productId, quantity: it.quantity })));
          }
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentPayload = event.payload?.payment?.entity;
      const rzpOrderId = paymentPayload?.order_id;
      if (rzpOrderId) {
        const order = OrdersStore.getOrderByRazorpayOrderId(rzpOrderId);
        if (order && order.paymentStatus !== 'captured') {
          OrdersStore.updateOrderPayment(order.id, {
            paymentStatus: 'failed',
          });
        }
      }
    }

    // Acknowledge receipt to Razorpay
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ status: 'error', error: 'Webhook processing failed.' });
  }
});

/**
 * 7. Customer Orders History
 * Only returns orders matching the customer's email or member ID
 */
app.get('/api/orders/my-orders', (req: Request, res: Response): void => {
  const email = (req.query.email as string) || '';
  const memberId = (req.query.memberId as string) || '';

  if (!email && !memberId) {
    res.status(400).json({ success: false, error: 'Customer identifier (email or memberId) is required.' });
    return;
  }

  const orders = OrdersStore.getCustomerOrders(email || memberId);
  res.json({ success: true, count: orders.length, orders });
});

/**
 * 8. Single Order Lookup
 */
app.get('/api/orders/:orderId', (req: Request, res: Response): void => {
  const orderId = String(req.params.orderId || '');
  const order = OrdersStore.getOrderById(orderId) || OrdersStore.getOrderByNumber(orderId);

  if (!order) {
    res.status(404).json({ success: false, error: 'Order not found.' });
    return;
  }

  res.json({ success: true, order });
});

/**
 * 9. Admin: View All Orders (Protected by IMS Role)
 */
app.get('/api/admin/orders', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization || '';
  const roleHeader = (req.headers['x-admin-role'] as string) || '';

  if (!authHeader && roleHeader !== 'ADMIN' && roleHeader !== 'IMS_ENGINEER') {
    res.status(403).json({ success: false, error: 'Access denied: Admin role required.' });
    return;
  }

  const orders = OrdersStore.getAllOrders();
  res.json({ success: true, count: orders.length, orders });
});

/**
 * 10. Admin: Verify UTR Reference
 */
app.post('/api/admin/verify-utr', (req: Request, res: Response): void => {
  const { orderId, isApproved, verifiedBy, notes } = req.body;

  if (!orderId) {
    res.status(400).json({ success: false, error: 'Order ID is required.' });
    return;
  }

  const updated = OrdersStore.verifyUtr(
    orderId,
    verifiedBy || 'Admin Roaster',
    Boolean(isApproved),
    notes
  );

  if (!updated) {
    res.status(404).json({ success: false, error: 'Order not found.' });
    return;
  }

  res.json({ success: true, message: 'Order verification updated.', order: updated });
});

// Error handling fallback
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled API error:', err);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});
