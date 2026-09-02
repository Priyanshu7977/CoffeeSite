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
  const email: AutomatedEmail = {
    id: `EMAIL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    to: recipientEmail,
    recipientName,
    subject: `Order Confirmation #${orderNumber} • NOIR ROAST MAISON DE HAUTE TORRÉFACTION`,
    previewText: `Your allocation of ${items.length} micro-batch lot(s) is being prepared under wax seal.`,
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

  try {
    const existing = getDispatchedEmails();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([email, ...existing]));
  } catch {
    // Local storage fallback
  }

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
    subject: `Welcome to the Noir Vault Allocation Circle • Member #${membershipId}`,
    previewText: `Your private access credentials have been authenticated for Kyoto & Zurich cellar reserves.`,
    type: 'vip_welcome',
    timestamp: new Date().toISOString(),
    details: {
      membershipId,
      tier: 'Vault Premier Member',
      shippingAddress: `Phone: ${phone}`,
    },
  };

  try {
    const existing = getDispatchedEmails();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([email, ...existing]));
  } catch {
    // Local storage fallback
  }

  return email;
};
