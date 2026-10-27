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
    title: 'Roastery Primary Current Account',
    accountHolder: 'NOIR DAKSHIN ROASTERS PVT LTD',
    bankName: 'HDFC Bank',
    vpa: 'noirroast@hdfcbank',
    image: '/assets/qr/qr-noir-roastery.svg',
    badge: 'Official Roastery Account',
    description: 'Instant settlement to our primary Indiranagar roastery current account.',
    isRecommended: true,
  },
  {
    id: 'qr-founder-kaapi',
    title: 'Founder Direct Kaapi Account',
    accountHolder: 'PRIYANSHU BIPIN SINGH',
    bankName: 'ICICI Bank',
    vpa: 'priyanshu.noir@icici',
    image: '/assets/qr/qr-founder-kaapi.svg',
    badge: 'Founder Direct',
    description: 'Direct student founder account for single-estate allocations and lab tests.',
  },
  {
    id: 'qr-estate-reserve',
    title: 'Western Ghats Producer Collective',
    accountHolder: 'WESTERN GHATS COFFEE PRODUCER CO',
    bankName: 'State Bank of India',
    vpa: 'estatereserve@sbi',
    image: '/assets/qr/qr-estate-reserve.svg',
    badge: 'Direct Planter Trade',
    description: 'Direct grower collective account supporting Baba Budan & Coorg family estates.',
  },
];
