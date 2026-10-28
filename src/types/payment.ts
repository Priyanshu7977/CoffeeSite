/**
 * Payment & Order Management Type Definitions
 * Covers Razorpay, COD, and Custom Direct UPI QR workflows.
 */

export type PaymentMethodType = 'razorpay' | 'cod' | 'custom_upi_qr';
export type PaymentSubtype = 'upi' | 'card' | 'netbanking' | 'qr' | 'standard';

export type PaymentStatus = 
  | 'pending'
  | 'captured'
  | 'failed'
  | 'cancelled'
  | 'awaiting_manual_verification'
  | 'refunded';

export type FulfillmentStatus = 
  | 'unfulfilled'
  | 'roasting'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  origin: string;
  grind: string;
  quantity: number;
  unitPrice: number; // in INR Rupees
  lineTotal: number;
}

export interface OrderPricing {
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  shippingCost: number;
  finalTotal: number; // in INR Rupees
  amountInPaise: number; // For Razorpay gateway
  currency: 'INR';
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface AdminUtrVerification {
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  adminNotes?: string;
}

export interface CustomerOrder {
  id: string; // Internal Order UUID (e.g., ord_abc123)
  orderNumber: string; // Public reference (e.g., NR-2026-8942)
  customerId?: string; // Member ID if logged in (e.g., NR-7729)
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItemSnapshot[];
  pricing: OrderPricing;
  paymentMethod: PaymentMethodType;
  paymentSubtype?: PaymentSubtype;
  paymentStatus: PaymentStatus;
  
  // Razorpay Gateway specific fields
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  // Custom Direct UPI QR specific fields
  customQrId?: string;
  utrNumber?: string;
  adminVerification?: AdminUtrVerification;

  fulfillmentStatus: FulfillmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CustomUpiQrConfig {
  id: string;
  title: string;
  accountHolder: string;
  bankName: string;
  vpa: string;
  image: string;
  badge: string;
  description: string;
  isRecommended?: boolean;
}

export const CUSTOM_UPI_QR_OPTIONS: CustomUpiQrConfig[] = [
  {
    id: 'qr-noir-roastery',
    title: 'PhonePe & All UPI (Primary)',
    accountHolder: 'PRIYANSHU BIPIN SINGH',
    bankName: 'PhonePe / Yes Bank',
    vpa: '7977641125@ybl',
    image: '/assets/qr/qr-phonepe.png',
    badge: 'Popular • All UPI Apps',
    description: 'Instant settlement via PhonePe, Google Pay, Paytm, or any UPI app to 7977641125@ybl.',
    isRecommended: true,
  },
  {
    id: 'qr-founder-kaapi',
    title: 'Paytm UPI (Verified)',
    accountHolder: 'PRIYANSHU BIPIN SINGH',
    bankName: 'Paytm Payments Bank',
    vpa: '7977641125@ptyes',
    image: '/assets/qr/qr-paytm.png',
    badge: 'Paytm Verified',
    description: 'Direct verified Paytm payment to Priyanshu Bipin Singh (7977641125@ptyes).',
  },
  {
    id: 'qr-estate-reserve',
    title: 'BHIM / Google Pay UPI',
    accountHolder: 'PRIYANSHU BIPIN SINGH',
    bankName: 'BHIM / NPCI UPI',
    vpa: '7977641125@upi',
    image: '/assets/qr/qr-bhim-upi.png',
    badge: 'Universal UPI',
    description: 'Universal UPI QR code supported across Google Pay, CRED, and all Indian banking apps.',
  },
];
