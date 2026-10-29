import type { CollectionItem } from '../types';

export interface AutomatedEmail {
  id: string;
  to: string;
  recipientName: string;
  subject: string;
  previewText: string;
  type: 
    | 'order_confirmation' 
    | 'vip_welcome' 
    | 'allocation_request' 
    | 'abandoned_cart_1h' 
    | 'feedback_social_proof_24h' 
    | 'discount_urgency_48h';
  timestamp: string;
  details: {
    orderNumber?: string;
    totalAmount?: string;
    items?: Array<{
      name: string;
      origin: string;
      grind: string;
      quantity: number;
      price: string;
    }>;
    shippingAddress?: string;
    membershipId?: string;
    tier?: string;
    discountCode?: string;
    discountPercent?: number;
    feedbackReview?: {
      quote: string;
      author: string;
      role: string;
      location: string;
      lot: string;
      rating: number;
    };
    cartTotal?: string;
    cartItemCount?: number;
    expiresIn?: string;
    ctaUrl?: string;
  };
}

const STORAGE_KEY = 'noir_automated_emails';

/**
 * Retrieves all dispatched emails from local storage
 */
export const getDispatchedEmails = (): AutomatedEmail[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Sends a real live email via FormSubmit AJAX endpoint directly to recipient's email address
 */
const sendLiveEmailDispatch = async (payload: {
  toEmail: string;
  subject: string;
  recipientName: string;
  message: string;
  orderNumber?: string;
  total?: string;
  itemsList?: string;
  address?: string;
}) => {
  try {
    const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(payload.toEmail)}`;
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: payload.subject,
        _template: 'table',
        _captcha: 'false',
        Recipient_Name: payload.recipientName,
        Order_Invoice_No: payload.orderNumber || 'N/A',
        Order_Items: payload.itemsList || 'N/A',
        Total_Amount_Settled: payload.total || 'N/A',
        Dispatch_Address: payload.address || 'N/A',
        Roastery_Message: payload.message,
        Roastery_Heritage: 'NOIR ROAST COFFEE ROASTERS • CHIKMAGALUR & BENGALURU',
      }),
    });
  } catch (err) {
    console.warn('Direct live email dispatch attempt:', err);
  }
};

/**
 * Dispatches an automated Order Confirmation email
 */
export const dispatchOrderConfirmationEmail = (
  orderNumber: string,
  recipientName: string,
  recipientEmail: string,
  items: CollectionItem[],
  totalAmount: string,
  shippingAddress: string
): AutomatedEmail => {
  const itemsText = items
    .map((item) => `${item.product.name} (${item.grind}) x${item.quantity} [${item.product.price}]`)
    .join(', ');

  const email: AutomatedEmail = {
    id: `EMAIL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    to: recipientEmail,
    recipientName,
    subject: `Order Confirmation #${orderNumber} • NOIR ROAST COFFEE`,
    previewText: `Your order of ${items.length} fresh-roasted coffee item(s) is confirmed.`,
    type: 'order_confirmation',
    timestamp: new Date().toISOString(),
    details: {
      orderNumber,
      totalAmount,
      items: items.map((item) => ({
        name: item.product.name,
        origin: `${item.product.num} • ${item.product.origin}`,
        grind: item.grind,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shippingAddress,
    },
  };

  // 1. Store in local storage history
  try {
    const existing = getDispatchedEmails();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([email, ...existing]));
  } catch {
    // Local storage fallback
  }

  // 2. Trigger real live email transmission to recipient's actual Gmail address
  sendLiveEmailDispatch({
    toEmail: recipientEmail,
    subject: email.subject,
    recipientName,
    orderNumber,
    total: totalAmount,
    itemsList: itemsText,
    address: shippingAddress,
    message: `Thank you for your order with NOIR ROAST COFFEE. Your order #${orderNumber} has been received and scheduled for fresh roasting and shipment from Chikmagalur.`,
  });

  return email;
};

/**
 * Dispatches an automated VIP Membership Welcome email
 */
export const dispatchVIPWelcomeEmail = (
  recipientName: string,
  recipientEmail: string,
  membershipId: string,
  phone: string
): AutomatedEmail => {
  const email: AutomatedEmail = {
    id: `EMAIL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    to: recipientEmail,
    recipientName,
    subject: `Welcome to Noir Roast Coffee • Customer #${membershipId}`,
    previewText: `Your customer account has been created for fresh roasts and exclusive orders.`,
    type: 'vip_welcome',
    timestamp: new Date().toISOString(),
    details: {
      membershipId,
      tier: 'Registered Customer',
      shippingAddress: `Phone: ${phone}`,
    },
  };

  try {
    const existing = getDispatchedEmails();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([email, ...existing]));
  } catch {
    // Local storage fallback
  }

  // Send real live VIP welcome email
  sendLiveEmailDispatch({
    toEmail: recipientEmail,
    subject: email.subject,
    recipientName,
    message: `Welcome to Noir Roast Coffee. Customer ID: #${membershipId}. You now have priority access to our fresh seasonal roasts.`,
  });

  return email;
};

/**
 * 1-Hour Automation: Abandoned Cart & Batch Reservation Reminder
 * Triggered 1 hour after adding coffee to cart
 */
export const dispatch1HourCartReminderEmail = (
  recipientName: string,
  recipientEmail: string,
  items: CollectionItem[],
  totalAmount: string
): AutomatedEmail => {
  const itemsText = items
    .map((item) => `${item.product.name} (${item.grind}) x${item.quantity}`)
    .join(', ');

  const email: AutomatedEmail = {
    id: `EMAIL-1HR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    to: recipientEmail,
    recipientName,
    subject: `You left fresh coffee in your cart • Noir Roast Coffee`,
    previewText: `Your shade-grown Western Ghats harvest beans are currently reserved in your bag.`,
    type: 'abandoned_cart_1h',
    timestamp: new Date().toISOString(),
    details: {
      totalAmount,
      cartTotal: totalAmount,
      cartItemCount: items.reduce((sum, it) => sum + it.quantity, 0),
      items: items.map((item) => ({
        name: item.product.name,
        origin: `${item.product.num} • ${item.product.origin}`,
        grind: item.grind,
        quantity: item.quantity,
        price: item.product.price,
      })),
      ctaUrl: '/cart',
    },
  };

  try {
    const existing = getDispatchedEmails();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([email, ...existing]));
  } catch {
    // Local storage fallback
  }

  sendLiveEmailDispatch({
    toEmail: recipientEmail,
    subject: email.subject,
    recipientName,
    total: totalAmount,
    itemsList: itemsText,
    message: `We noticed you added our fresh-roasted single-estate coffees to your cart but haven't completed your order. Because we roast in limited small batches every morning in cast-iron drums, green bean stocks are strictly capped. We've temporarily held your beans. Click below to resume your order before stocks run low.`,
  });

  return email;
};

/**
 * 24-Hour Automation: Customer Feedback & Verified Reviews
 * Triggered 24 hours after adding to cart
 */
export const dispatch24HourSocialProofEmail = (
  recipientName: string,
  recipientEmail: string,
  items: CollectionItem[],
  totalAmount: string
): AutomatedEmail => {
  const firstItem = items[0]?.product.name || 'Single-Estate Coffee';
  const email: AutomatedEmail = {
    id: `EMAIL-24HR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    to: recipientEmail,
    recipientName,
    subject: `What coffee lovers say about ${firstItem} • Noir Roast`,
    previewText: `Read verified customer feedback from Q-Graders and home baristas across India.`,
    type: 'feedback_social_proof_24h',
    timestamp: new Date().toISOString(),
    details: {
      totalAmount,
      cartTotal: totalAmount,
      items: items.map((item) => ({
        name: item.product.name,
        origin: `${item.product.num} • ${item.product.origin}`,
        grind: item.grind,
        quantity: item.quantity,
        price: item.product.price,
      })),
      feedbackReview: {
        quote:
          'Extracted at 93°C, it reveals delicate jasmine florals followed by a lingering Mysore cocoa finish. World-class bean craft rivaling international specialty lots.',
        author: 'Tanmay Joshi',
        role: 'National AeroPress Finalist',
        location: 'Pune, Maharashtra',
        lot: firstItem,
        rating: 5,
      },
      ctaUrl: '/cart',
    },
  };

  try {
    const existing = getDispatchedEmails();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([email, ...existing]));
  } catch {
    // Local storage fallback
  }

  sendLiveEmailDispatch({
    toEmail: recipientEmail,
    subject: email.subject,
    recipientName,
    total: totalAmount,
    message: `Still deciding on your coffee selection? Our shade-grown Western Ghats harvest is rated 4.98/5 by over 1,200 coffee lovers. Read unfiltered verified reviews and secure your freshly roasted batch today.`,
  });

  return email;
};

/**
 * 48-Hour Automation: Exclusive 10% Discount & Urgency
 * Triggered 48 hours after cart inactivity
 */
export const dispatch48HourDiscountUrgentEmail = (
  recipientName: string,
  recipientEmail: string,
  items: CollectionItem[],
  totalAmount: string
): AutomatedEmail => {
  const email: AutomatedEmail = {
    id: `EMAIL-48HR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    to: recipientEmail,
    recipientName,
    subject: `Enjoy 10% Off your coffee order with code NOIRVIP10 • Expires in 24h`,
    previewText: `Use code NOIRVIP10 to take 10% off your fresh roasted coffee order before your batch reservation expires.`,
    type: 'discount_urgency_48h',
    timestamp: new Date().toISOString(),
    details: {
      totalAmount,
      cartTotal: totalAmount,
      discountCode: 'NOIRVIP10',
      discountPercent: 10,
      expiresIn: '24 Hours',
      items: items.map((item) => ({
        name: item.product.name,
        origin: `${item.product.num} • ${item.product.origin}`,
        grind: item.grind,
        quantity: item.quantity,
        price: item.product.price,
      })),
      ctaUrl: '/cart',
    },
  };

  try {
    const existing = getDispatchedEmails();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([email, ...existing]));
  } catch {
    // Local storage fallback
  }

  sendLiveEmailDispatch({
    toEmail: recipientEmail,
    subject: email.subject,
    recipientName,
    total: totalAmount,
    message: `We'd love for you to taste our obsessive roast. Here is an exclusive 10% discount code: NOIRVIP10 for your pending order. This coupon and your batch hold will expire in 24 hours.`,
  });

  return email;
};
