/**
 * Razorpay Official SDK Client & Cryptographic Signature Verifier
 * Server-Side Only: Reads secrets exclusively from environment variables.
 */

import crypto from 'node:crypto';
import Razorpay from 'razorpay';

export function getRazorpayCredentials(): { keyId: string; keySecret: string; webhookSecret: string } {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

  return { keyId, keySecret, webhookSecret };
}

let razorpayInstance: InstanceType<typeof Razorpay> | null = null;

export function getRazorpayClient(): InstanceType<typeof Razorpay> {
  const { keyId, keySecret } = getRazorpayCredentials();

  if (!keyId || !keySecret) {
    throw new Error('Razorpay initialization error: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured on the server.');
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayInstance;
}

/**
 * Creates a server-side order with Razorpay
 */
export async function createRazorpayOrder(
  amountInPaise: number,
  receipt: string,
  notes: Record<string, string> = {}
): Promise<{ id: string; amount: number; currency: string; receipt: string; status: string }> {
  const client = getRazorpayClient();

  const options = {
    amount: Math.round(amountInPaise),
    currency: 'INR',
    receipt: receipt.substring(0, 40),
    payment_capture: 1, // Auto-capture payments
    notes,
  };

  const order = await client.orders.create(options);
  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
    receipt: order.receipt || receipt,
    status: order.status,
  };
}

/**
 * Verifies standard checkout payment signature:
 * HMAC_SHA256(order_id + "|" + payment_id, secret) == signature
 */
export function verifyPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }

  const { keySecret } = getRazorpayCredentials();
  if (!keySecret) return false;

  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(payload)
    .digest('hex');

  // Constant-time buffer equality check prevents timing attacks
  const expectedBuf = Buffer.from(expectedSignature, 'utf-8');
  const actualBuf = Buffer.from(razorpaySignature, 'utf-8');

  if (expectedBuf.length !== actualBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

/**
 * Verifies Razorpay Webhook signature using raw request body
 */
export function verifyWebhookSignature(
  rawBody: string | Buffer,
  signature: string,
  secretOverride?: string
): boolean {
  if (!rawBody || !signature) return false;

  const { webhookSecret } = getRazorpayCredentials();
  const secret = secretOverride || webhookSecret;
  if (!secret) return false;

  try {
    const rawString = Buffer.isBuffer(rawBody) ? rawBody.toString('utf-8') : rawBody;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawString)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf-8');
    const actualBuf = Buffer.from(signature, 'utf-8');

    if (expectedBuf.length !== actualBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, actualBuf);
  } catch {
    return false;
  }
}

/**
 * Fetches authorized/captured payment details from Razorpay to verify status & amount
 */
export async function fetchPaymentDetails(paymentId: string) {
  const client = getRazorpayClient();
  return client.payments.fetch(paymentId);
}
