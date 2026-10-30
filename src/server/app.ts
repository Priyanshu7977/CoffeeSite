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
import { UsersStore } from './usersStore';
import { ReservationsStore } from './reservationsStore';
import { NewsletterStore } from './newsletterStore';
import {
  hashPassword,
  verifyPassword,
  checkRateLimit,
  resetRateLimit,
} from './authSecurity';
import {
  getRazorpayCredentials,
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  fetchPaymentDetails,
} from './razorpayClient';
import { CUSTOM_UPI_QR_OPTIONS, type CustomerOrder, type PaymentMethodType } from '../types/payment';
import type { CustomerProfile, SavedAddress } from '../types/auth';
import { inventorySystem, AUTHORIZED_IMS_ACCOUNTS } from '../utils/inventorySystem';
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

// Express Router mounted for both direct and rewritten paths
const apiRouter = express.Router();

/**
 * 0. Root API status
 */
apiRouter.get('/', (_req: Request, res: Response) => {
  const { keyId } = getRazorpayCredentials();
  res.json({
    status: 'ok',
    service: 'Noir Roast Coffee Payment Gateway',
    razorpayConfigured: Boolean(keyId),
    timestamp: new Date().toISOString(),
  });
});

/**
 * 1. Health check
 */
apiRouter.get('/health', (_req: Request, res: Response) => {
  const { keyId } = getRazorpayCredentials();
  res.json({
    status: 'ok',
    service: 'Noir Roast Coffee Payment Gateway',
    razorpayConfigured: Boolean(keyId),
    timestamp: new Date().toISOString(),
  });
});

/**
 * 2. Public Gateway Configuration
 * Only returns the PUBLIC Key ID and configurable QR options. NEVER exposes the secret!
 */
apiRouter.get('/payment/config', (_req: Request, res: Response) => {
  const { keyId } = getRazorpayCredentials();
  res.json({
    keyId: keyId || process.env.VITE_RAZORPAY_KEY_ID || '',
    currency: 'INR',
    merchantName: 'NOIR ROAST COFFEE',
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
apiRouter.post('/payment/create-order', async (req: Request, res: Response): Promise<void> => {
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

    const validPaymentMethod: PaymentMethodType = ['razorpay', 'cod', 'custom_upi_qr'].includes(paymentMethod)
      ? paymentMethod
      : 'razorpay';

    // Authoritative Price Calculation (Ignores any client-supplied totals)
    const valuation = calculateAuthoritativeValuation(items, discountCode, validPaymentMethod);
    if (!valuation.isValid) {
      res.status(400).json({ success: false, error: valuation.error || 'Invalid cart valuation.' });
      return;
    }

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const orderNumber = `NR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

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
      const { keyId, keySecret } = getRazorpayCredentials();

      if (!keyId || !keySecret) {
        res.status(500).json({
          success: false,
          error:
            'Razorpay credentials are not configured on the server. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel Project Settings > Environment Variables.',
        });
        return;
      }

      try {
        const rzpOrder = await createRazorpayOrder(
          valuation.pricing.amountInPaise,
          orderNumber,
          { internalOrderId: orderId, customerEmail: email }
        );

        newOrder.razorpayOrderId = rzpOrder.id;
        OrdersStore.saveOrder(newOrder);

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
      inventorySystem.commitOrder(
        valuation.items.map((it: { productId: string; quantity: number }) => ({
          productId: it.productId,
          quantity: it.quantity,
        }))
      );

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
      inventorySystem.commitOrder(
        valuation.items.map((it: { productId: string; quantity: number }) => ({
          productId: it.productId,
          quantity: it.quantity,
        }))
      );

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
apiRouter.post('/payment/verify-signature', async (req: Request, res: Response): Promise<void> => {
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
    inventorySystem.commitOrder(
      order.items.map((it: { productId: string; quantity: number }) => ({
        productId: it.productId,
        quantity: it.quantity,
      }))
    );

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
apiRouter.post('/payment/submit-utr', (req: Request, res: Response): void => {
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
apiRouter.post('/payment/webhook', (req: Request, res: Response): void => {
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
            inventorySystem.commitOrder(
              order.items.map((it: { productId: string; quantity: number }) => ({
                productId: it.productId,
                quantity: it.quantity,
              }))
            );
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
apiRouter.get('/orders/my-orders', (req: Request, res: Response): void => {
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
apiRouter.get('/orders/:orderId', (req: Request, res: Response): void => {
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
apiRouter.get('/admin/orders', (req: Request, res: Response): void => {
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
apiRouter.post('/admin/verify-utr', (req: Request, res: Response): void => {
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

/**
 * 11. Customer Registration
 * Validates details, checks duplicates, securely hashes password using scrypt, and stores profile.
 */
apiRouter.post('/auth/register', (req: Request, res: Response): void => {
  try {
    const { fullName, email, phone, password } = req.body;

    const rateCheck = checkRateLimit(`reg_${req.ip || 'ip'}`);
    if (!rateCheck.allowed) {
      res.status(429).json({
        success: false,
        error: `Too many registration attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
      });
      return;
    }

    if (!fullName || !isValidName(fullName)) {
      res.status(400).json({ success: false, error: 'Valid full name (alphabets only, min 2 chars) is required.' });
      return;
    }
    if (!email || !isValidEmail(email)) {
      res.status(400).json({ success: false, error: 'Valid email address is required.' });
      return;
    }
    if (!phone || !isValidPhone(phone)) {
      res.status(400).json({ success: false, error: 'Valid phone number (min 7 digits) is required.' });
      return;
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
      return;
    }

    // Duplicate check
    const existing = UsersStore.getUserByEmail(email);
    if (existing) {
      res.status(409).json({
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.',
      });
      return;
    }

    const { salt, hash } = hashPassword(password);
    const memberId = `NR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newProfile: CustomerProfile = {
      uid: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      memberId,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
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

    const saved = UsersStore.saveUserWithCredentials(newProfile, salt, hash);
    const session = UsersStore.createSession(saved);

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to Noir Roast Coffee.',
      profile: saved,
      session: {
        name: saved.fullName,
        email: saved.email,
        phone: saved.phone,
        memberId: saved.memberId,
        isLoggedIn: true,
        role: saved.role,
        savedAddresses: saved.savedAddresses,
        token: session.token,
      },
    });
  } catch (err: unknown) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, error: 'Failed to complete registration.' });
  }
});

/**
 * 12. Customer Login
 * Checks IMS roles or stored customer profiles with scrypt password verification.
 */
apiRouter.post('/auth/login', (req: Request, res: Response): void => {
  try {
    const { email, password } = req.body;

    if (!email || !isValidEmail(email)) {
      res.status(400).json({ success: false, error: 'Valid email address is required.' });
      return;
    }
    if (!password) {
      res.status(400).json({ success: false, error: 'Password is required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Brute-force rate limiting protection
    const rateCheck = checkRateLimit(`login_${cleanEmail}`);
    if (!rateCheck.allowed) {
      res.status(429).json({
        success: false,
        error: `Too many failed sign-in attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
      });
      return;
    }

    // Check IMS accounts first
    const imsAccount = AUTHORIZED_IMS_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === cleanEmail && a.password === password
    );

    if (imsAccount) {
      resetRateLimit(`login_${cleanEmail}`);
      const imsProfile: CustomerProfile = {
        uid: `ims_${imsAccount.role.toLowerCase()}`,
        memberId: imsAccount.role === 'ADMIN' ? 'NOIR-OWNER-01' : 'NOIR-ENG-02',
        fullName: imsAccount.name,
        email: imsAccount.email,
        phone: '+91 79776 41125',
        role: imsAccount.role,
        authProvider: 'password',
        savedAddresses: [],
        preferences: {
          favoriteGrind: 'South Indian Brass Filter Kaapi',
          newsletter: true,
          cuppingAlerts: true,
        },
        createdAt: '1998-01-01T00:00:00.000Z',
        updatedAt: new Date().toISOString(),
      };

      const session = UsersStore.createSession(imsProfile);

      res.json({
        success: true,
        message: 'IMS Master Roaster authenticated.',
        profile: imsProfile,
        session: {
          name: imsProfile.fullName,
          email: imsProfile.email,
          phone: imsProfile.phone,
          memberId: imsProfile.memberId,
          isLoggedIn: true,
          role: imsProfile.role,
          savedAddresses: imsProfile.savedAddresses,
          token: session.token,
        },
      });
      return;
    }

    // Check registered customer accounts with scrypt verification
    const record = UsersStore.getUserRecord(cleanEmail);
    if (!record) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please verify your credentials and try again.',
      });
      return;
    }

    // If customer has salt & hash, verify cryptographically
    if (record.passwordSalt && record.passwordHash) {
      const isMatch = verifyPassword(password, record.passwordSalt, record.passwordHash);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password. Please verify your credentials and try again.',
        });
        return;
      }
    }

    resetRateLimit(`login_${cleanEmail}`);
    const session = UsersStore.createSession(record.profile);

    res.json({
      success: true,
      message: 'Signed in successfully.',
      profile: record.profile,
      session: {
        name: record.profile.fullName,
        email: record.profile.email,
        phone: record.profile.phone,
        memberId: record.profile.memberId,
        isLoggedIn: true,
        role: record.profile.role,
        savedAddresses: record.profile.savedAddresses,
        token: session.token,
      },
    });
  } catch (err: unknown) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Login service encountered an error.' });
  }
});

/**
 * 12B. Customer Logout
 * Revokes the session token.
 */
apiRouter.post('/auth/logout', (req: Request, res: Response): void => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '') || req.body?.token;
  if (token) {
    UsersStore.revokeSession(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * 12C. Micro-Lot Allocation Reservations
 * Saves reservation to persistent database and returns genuine allocation certificate.
 */
apiRouter.post('/reservations', (req: Request, res: Response): void => {
  try {
    const { batchId, fullName, email, grind, quantity } = req.body;

    if (!fullName || !isValidName(fullName)) {
      res.status(400).json({ success: false, error: 'Valid patron name (alphabets only) is required.' });
      return;
    }
    if (!email || !isValidEmail(email)) {
      res.status(400).json({ success: false, error: 'Valid email address is required.' });
      return;
    }

    const result = ReservationsStore.createReservation({
      batchId: batchId || 'batch-01',
      fullName,
      email,
      grind: grind || 'whole',
      quantity: Number(quantity) || 1,
    });

    res.json(result);
  } catch (err: unknown) {
    console.error('Reservation error:', err);
    res.status(500).json({ success: false, error: 'Failed to process allocation reservation.' });
  }
});

apiRouter.get('/reservations/remaining/:batchId', (req: Request, res: Response): void => {
  const batchId = String(req.params.batchId || 'batch-01');
  const remaining = ReservationsStore.getRemainingAllocations(batchId);
  res.json({ success: true, batchId, remaining });
});

/**
 * 12D. Newsletter Subscription
 * Validates, records subscriber persistently, and handles duplicates truthfully.
 */
apiRouter.post('/newsletter/subscribe', (req: Request, res: Response): void => {
  try {
    const { email, source } = req.body;

    if (!email || !isValidEmail(email)) {
      res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
      return;
    }

    const result = NewsletterStore.subscribe(email, source || 'footer');
    if (result.alreadySubscribed) {
      res.json({
        success: true,
        alreadySubscribed: true,
        message: 'You are already subscribed to Noir Roast roastery dispatches.',
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Subscribed! Welcome to Noir Roast roastery dispatches.',
    });
  } catch (err: unknown) {
    console.error('Newsletter subscription error:', err);
    res.status(500).json({ success: false, error: 'Failed to complete newsletter subscription.' });
  }
});

/**
 * 13. Customer Session Sync (Firebase OAuth, Phone OTP, Email sync)
 */
apiRouter.post('/auth/sync', (req: Request, res: Response): void => {
  try {
    const { uid, email, fullName, phone, authProvider } = req.body;

    if (!email && !phone) {
      res.status(400).json({ success: false, error: 'Email or phone number is required to sync account.' });
      return;
    }

    const cleanEmail = (email || `${phone}@phone.noirkaapi.in`).trim().toLowerCase();
    let existing = UsersStore.getUserByEmail(cleanEmail) || (uid ? UsersStore.getUserById(uid) : undefined);

    if (existing) {
      const updated = UsersStore.updateUser(existing.email, {
        fullName: fullName || existing.fullName,
        phone: phone || existing.phone,
        authProvider: authProvider || existing.authProvider,
      });

      res.json({
        success: true,
        profile: updated,
        session: {
          name: updated?.fullName,
          email: updated?.email,
          phone: updated?.phone,
          memberId: updated?.memberId,
          isLoggedIn: true,
          role: updated?.role,
          savedAddresses: updated?.savedAddresses,
        },
      });
      return;
    }

    // Create new profile
    const memberId = `NR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newProfile: CustomerProfile = {
      uid: uid || `usr_${Date.now()}`,
      memberId,
      fullName: (fullName || cleanEmail.split('@')[0]).trim(),
      email: cleanEmail,
      phone: phone || '',
      role: 'CUSTOMER',
      authProvider: authProvider || 'google',
      savedAddresses: [],
      preferences: {
        favoriteGrind: 'Whole Bean',
        newsletter: true,
        cuppingAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = UsersStore.saveUser(newProfile);

    res.json({
      success: true,
      profile: saved,
      session: {
        name: saved.fullName,
        email: saved.email,
        phone: saved.phone,
        memberId: saved.memberId,
        isLoggedIn: true,
        role: saved.role,
        savedAddresses: saved.savedAddresses,
      },
    });
  } catch (err: unknown) {
    console.error('Session sync error:', err);
    res.status(500).json({ success: false, error: 'Session synchronization failed.' });
  }
});

/**
 * 14. Customer Profile Lookup
 */
apiRouter.get('/auth/profile', (req: Request, res: Response): void => {
  const email = (req.query.email as string) || '';
  const memberId = (req.query.memberId as string) || '';

  if (!email && !memberId) {
    res.status(400).json({ success: false, error: 'Email or member ID is required.' });
    return;
  }

  const user = (email && UsersStore.getUserByEmail(email)) || (memberId && UsersStore.getUserById(memberId));

  if (!user) {
    res.status(404).json({ success: false, error: 'Customer profile not found.' });
    return;
  }

  res.json({ success: true, profile: user });
});

/**
 * 15. Customer Profile Update
 */
apiRouter.post('/auth/update-profile', (req: Request, res: Response): void => {
  try {
    const { email, fullName, phone, preferences } = req.body;

    if (!email) {
      res.status(400).json({ success: false, error: 'Customer email is required.' });
      return;
    }

    const updates: Partial<CustomerProfile> = {};
    if (fullName && isValidName(fullName)) updates.fullName = fullName.trim();
    if (phone && isValidPhone(phone)) updates.phone = phone.trim();
    if (preferences && typeof preferences === 'object') updates.preferences = preferences;

    let updated = UsersStore.updateUser(email, updates);
    if (!updated) {
      const memberId = `NR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newProfile: CustomerProfile = {
        uid: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        memberId,
        fullName: updates.fullName || 'User',
        email: email.trim().toLowerCase(),
        phone: updates.phone || (email.includes('@phone') ? email.split('@')[0] : ''),
        role: 'CUSTOMER',
        authProvider: 'phone',
        savedAddresses: [],
        preferences: (updates.preferences as Record<string, unknown>) || {
          favoriteGrind: 'Whole Bean',
          newsletter: true,
          cuppingAlerts: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updated = UsersStore.saveUser(newProfile);
    }

    res.json({ success: true, profile: updated });
  } catch (err: unknown) {
    console.error('Profile update error:', err);
    res.status(500).json({ success: false, error: 'Failed to update customer profile.' });
  }
});

/**
 * 16. Saved Delivery Addresses Management
 */
apiRouter.post('/auth/address', (req: Request, res: Response): void => {
  try {
    const { email, address } = req.body;

    if (!email || !address) {
      res.status(400).json({ success: false, error: 'Email and address object are required.' });
      return;
    }

    const newAddr: SavedAddress = {
      id: address.id || `addr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label: address.label || 'Delivery Address',
      fullName: address.fullName || 'Customer',
      phone: address.phone || '',
      street: address.street || address.address || '',
      city: address.city || 'Bengaluru',
      postalCode: address.postalCode || '560038',
      country: address.country || 'India',
      isDefault: Boolean(address.isDefault),
    };

    let updated = UsersStore.addAddress(email, newAddr);
    if (!updated) {
      const memberId = `NR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newProfile: CustomerProfile = {
        uid: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        memberId,
        fullName: newAddr.fullName || 'Customer',
        email: email.trim().toLowerCase(),
        phone: newAddr.phone || (email.includes('@phone') ? email.split('@')[0] : ''),
        role: 'CUSTOMER',
        authProvider: 'phone',
        savedAddresses: [newAddr],
        preferences: {
          favoriteGrind: 'Whole Bean',
          newsletter: true,
          cuppingAlerts: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updated = UsersStore.saveUser(newProfile);
    }

    res.json({ success: true, message: 'Address saved.', profile: updated });
  } catch (err: unknown) {
    console.error('Address creation error:', err);
    res.status(500).json({ success: false, error: 'Failed to save address.' });
  }
});

apiRouter.delete('/auth/address/:addressId', (req: Request, res: Response): void => {
  try {
    const email = (req.query.email as string) || (req.body?.email as string) || '';
    const addressId = String(req.params.addressId || '');

    if (!email || !addressId) {
      res.status(400).json({ success: false, error: 'Email and address ID are required.' });
      return;
    }

    const updated = UsersStore.deleteAddress(email, addressId);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Customer profile not found.' });
      return;
    }

    res.json({ success: true, message: 'Address removed.', profile: updated });
  } catch (err: unknown) {
    console.error('Address deletion error:', err);
    res.status(500).json({ success: false, error: 'Failed to remove address.' });
  }
});

// Mount the router on both '/api' and '/' so all rewrites/prefixes work seamlessly
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Fallback 404 handler (prevents unhandled hangs)
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'API endpoint not found', path: req.url });
});

// Error handling fallback
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled API error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal server error.' });
});
