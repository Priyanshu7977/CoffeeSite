import type { CollectionItem } from '../types';

export interface AutomatedEmail {
  id: string;
  to: string;
  recipientName: string;
  subject: string;
  previewText: string;
  type: 'order_confirmation' | 'vip_welcome' | 'allocation_request';
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
        Allocations_Manifest: payload.itemsList || 'N/A',
        Total_Amount_Settled: payload.total || 'N/A',
        Dispatch_Address: payload.address || 'N/A',
        Maison_Message: payload.message,
        Atelier_Heritage: 'NOIR DAKSHIN ROAST MAISON • CHIKMAGALUR & BENGALURU',
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
    subject: `Order Confirmation #${orderNumber} • NOIR DAKSHIN ROAST MAISON`,
    previewText: `Your allocation of ${items.length} shade-grown Chikmagalur lot(s) is confirmed under wax seal.`,
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
    message: `Thank you for securing your allocation with NOIR DAKSHIN ROAST. Your order #${orderNumber} has been recorded in our Chikmagalur cast-iron roasting ledger. Each micro-tin is hand-stamped with our master wax seal.`,
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
    subject: `Welcome to the Noir Dakshin Vault Circle • Member #${membershipId}`,
    previewText: `Your private access credentials have been authenticated for Bengaluru & Chikmagalur cellar reserves.`,
    type: 'vip_welcome',
    timestamp: new Date().toISOString(),
    details: {
      membershipId,
      tier: 'Dakshin Vault Premier Member',
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
    message: `Welcome to the Noir Dakshin Vault Allocation Circle. Member ID: #${membershipId}. You now hold priority allocations to our limited 12kg single-ridge shade-grown Western Ghats roasts.`,
  });

  return email;
};
