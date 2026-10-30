import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  QrCode,
  Truck,
  RotateCcw,
  AlertCircle,
  Copy,
  Clock,
  Sparkles,
  Printer,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InvoiceModal } from './InvoiceModal';
import { OrderTrackingModal } from './OrderTrackingModal';
import { stopGlobalLenis, startGlobalLenis } from '../hooks/useLenis';
import {
  sanitizeName,
  sanitizePhone,
  sanitizeAddress,
  sanitizeCity,
  sanitizeCountry,
  sanitizePostalCode,
  isValidEmail,
  isValidName,
  isValidPhone,
  stripDangerousMarkup,
} from '../utils/validation';
import { dispatchOrderConfirmationEmail, type AutomatedEmail } from '../utils/emailService';
import { markOrderCompleted } from '../utils/emailAutomationSystem';
import type { CollectionItem } from '../types';
import type { UserSession } from './LoginModal';
import {
  createCheckoutOrder,
  verifyPaymentSignatureOnServer,
  submitCustomUpiUtr,
  getPaymentConfig,
} from '../utils/paymentApi';
import { openRazorpayCheckout } from '../utils/razorpayLoader';
import {
  CUSTOM_UPI_QR_OPTIONS,
  type CustomUpiQrConfig,
  type CustomerOrder,
  type PaymentMethodType,
} from '../types/payment';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CollectionItem[];
  userSession?: UserSession | null;
  onOrderCompleted: () => void;
  onEmailDispatched: (email: AutomatedEmail) => void;
}

type CheckoutStep = 'details' | 'payment' | 'custom_qr_utr' | 'processing' | 'confirmed';

export const AVAILABLE_COUPONS = [
  { code: 'FIRST10', label: 'FIRST10 — 10% Off 1st-Time Customer', discount: 10, desc: '10% off your initial roast order' },
  { code: 'BANK15', label: 'BANK15 — 15% Off UPI & Bank Payment', discount: 15, desc: '15% instant savings on UPI & Netbanking' },
  { code: 'ROAST20', label: 'ROAST20 — 20% Off Connoisseur Roasts', discount: 20, desc: '20% off on specialty single-estate lots' },
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  userSession,
  onOrderCompleted,
  onEmailDispatched,
}) => {
  const [step, setStep] = useState<CheckoutStep>('details');

  // Customer shipping details - all initialized blank for fresh real user input
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [country, setCountry] = useState<string>('India');

  // Promo Code
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);

  // Payment Selection
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('razorpay');
  const [selectedQrId, setSelectedQrId] = useState<string>('qr-noir-roastery');
  const [customQrConfigs, setCustomQrConfigs] = useState<CustomUpiQrConfig[]>(CUSTOM_UPI_QR_OPTIONS);
  const [utrNumber, setUtrNumber] = useState<string>('');

  // Status & Confirmation tracking
  const [confirmedOrder, setConfirmedOrder] = useState<CustomerOrder | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedVpa, setCopiedVpa] = useState<boolean>(false);

  // Global Scroll Lock & Lenis conflict resolution when modal is active
  useEffect(() => {
    if (isOpen) {
      stopGlobalLenis();
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        startGlobalLenis();
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [isOpen]);

  // Initialize and prefill from user session safely without synthetic data leakage
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setErrorMessage('');
      setIsProcessing(false);
      setConfirmedOrder(null);
      setUtrNumber('');

      if (userSession && userSession.isLoggedIn) {
        // 1. Full Name: Only prefill if genuine alphabetic text (NO digits, NO phone numbers, NO generic placeholders)
        const rawName = (userSession.name || '').trim();
        const hasDigits = /\d/.test(rawName);
        const isPhoneFormat = /^[+0-9\s()-]+$/.test(rawName);
        const isPlaceholder = ['user', 'patron', 'customer', 'guest', 'member', 'admin', 'noir kaapi member'].includes(rawName.toLowerCase());
        
        if (rawName && !hasDigits && !isPhoneFormat && !isPlaceholder && rawName.length >= 2) {
          setFullName(sanitizeName(rawName));
        } else {
          setFullName('');
        }

        // 2. Email: Only prefill genuine customer emails (NOT internal synthetic phone emails)
        const rawEmail = (userSession.email || '').trim();
        const isSyntheticEmail =
          rawEmail.includes('@phone.') ||
          rawEmail.includes('@phone.noirkaapi.in') ||
          rawEmail.includes('@phone.noircafe.in');

        if (rawEmail && !isSyntheticEmail && isValidEmail(rawEmail)) {
          setEmail(rawEmail);
        } else {
          setEmail('');
        }

        // 3. Phone: Prefill clean phone if user signed in via phone or has phone recorded
        const rawPhone = (userSession.phone || (isPhoneFormat ? rawName : '')).trim();
        if (rawPhone) {
          setPhone(sanitizePhone(rawPhone));
        } else {
          setPhone('');
        }

        // 4. Saved Address: Only prefill genuine customer addresses, ignoring HQ / demo addresses
        const defaultAddr =
          userSession.savedAddresses?.find((a) => a.isDefault && a.id !== 'addr_hq') ||
          userSession.savedAddresses?.find((a) => a.id !== 'addr_hq');

        if (defaultAddr && defaultAddr.street && defaultAddr.street !== '100ft Road, Indiranagar') {
          setAddress(defaultAddr.street || '');
          setCity(defaultAddr.city || '');
          setPostalCode(defaultAddr.postalCode || '');
          if (defaultAddr.country) setCountry(defaultAddr.country);
        } else {
          setAddress('');
          setCity('');
          setPostalCode('');
          setCountry('India');
        }
      } else {
        setFullName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setCity('');
        setPostalCode('');
        setCountry('India');
      }

      // Fetch dynamic gateway configuration
      getPaymentConfig().then((cfg) => {
        if (cfg.customQrOptions && cfg.customQrOptions.length > 0) {
          setCustomQrConfigs(cfg.customQrOptions);
        }
      });
    }
  }, [isOpen, userSession]);

  if (!isOpen) return null;

  // Authoritative item pricing calculation in UI
  const subtotalNumeric = items.reduce((sum, item) => {
    const raw = item.unitPriceNum !== undefined
      ? item.unitPriceNum
      : (parseFloat(item.product.price.replace(/[^0-9.]/g, '')) || 2400);
    return sum + raw * item.quantity;
  }, 0);

  const discountAmount = appliedPromo ? Math.round((subtotalNumeric * promoDiscount) / 100) : 0;
  const shippingCost = 0; // Free express direct estate shipping
  const codFee = selectedMethod === 'cod' ? 100 : 0;
  const totalNumeric = Math.max(0, subtotalNumeric - discountAmount + shippingCost + codFee);
  const formattedTotal = `₹${totalNumeric.toLocaleString('en-IN')}`;
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const activeQr = customQrConfigs.find((q) => q.id === selectedQrId) || customQrConfigs[0];

  const applySpecificPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return;

    const found = AVAILABLE_COUPONS.find((c) => c.code === clean);
    if (found) {
      setAppliedPromo(found.code);
      setPromoDiscount(found.discount);
      setPromoCode(found.code);
      setErrorMessage('');
      return;
    }

    if (clean === 'NOIRVIP10' || clean === 'NOIR10' || clean === 'VIP10') {
      setAppliedPromo(clean);
      setPromoDiscount(10);
      setPromoCode(clean);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid promo code. Select from dropdown or use FIRST10, BANK15, ROAST20.');
    }
  };

  const handleApplyPromo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    applySpecificPromo(promoCode);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoCode('');
  };

  const handleCopyVpa = (vpa: string) => {
    navigator.clipboard.writeText(vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  // Step 1: Validate Customer Details and proceed to payment selection
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!items || items.length === 0 || totalItemCount <= 0) {
      setErrorMessage('Your cart is empty. Please add coffee before proceeding to checkout.');
      return;
    }

    if (!isValidName(fullName)) {
      setErrorMessage('Please enter a valid recipient name (alphabets only).');
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!isValidPhone(phone)) {
      setErrorMessage('Please enter a valid phone number (minimum 7 digits).');
      return;
    }
    if (!address.trim() || address.trim().length < 5) {
      setErrorMessage('Please provide a complete delivery street address.');
      return;
    }

    setStep('payment');
  };

  // Step 2A: Process Order based on selected payment method
  const handleInitiatePayment = async () => {
    setErrorMessage('');
    setIsProcessing(true);

    try {
      const payload = {
        items: items.map((it) => ({
          productId: it.product.id,
          quantity: it.quantity,
          grind: it.grind,
        })),
        customer: {
          fullName,
          email,
          phone,
          address,
          city,
          postalCode,
          country,
          memberId: userSession?.memberId,
        },
        discountCode: appliedPromo || undefined,
        paymentMethod: selectedMethod,
        customQrId: selectedMethod === 'custom_upi_qr' ? selectedQrId : undefined,
      };

      // 1. Create authoritative order on the server
      const orderRes = await createCheckoutOrder(payload);

      if (!orderRes.success) {
        throw new Error(orderRes.error || 'Failed to create order.');
      }

      // 2. Handle Razorpay Gateway Flow
      if (selectedMethod === 'razorpay') {
        if (!orderRes.razorpayOrderId) {
          throw new Error('Razorpay order initialization failed on server.');
        }

        const gatewayKey = orderRes.keyId || (import.meta.env.VITE_RAZORPAY_KEY_ID as string) || '';

        await openRazorpayCheckout({
          key: gatewayKey,
          amount: orderRes.amount || totalNumeric * 100,
          currency: orderRes.currency || 'INR',
          name: 'NOIR ROAST COFFEE',
          description: `Order #${orderRes.orderNumber} • Fresh Roasted Micro-Lots`,
          image: '/favicon.svg',
          order_id: orderRes.razorpayOrderId,
          prefill: {
            name: fullName,
            email,
            contact: phone.replace(/[^0-9]/g, ''),
          },
          notes: {
            orderNumber: orderRes.orderNumber,
            internalOrderId: orderRes.orderId,
          },
          theme: {
            color: '#2D2926',
            backdrop_color: 'rgba(45, 41, 38, 0.75)',
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              setErrorMessage(
                'Payment was closed. Your coffee items remain safe in your cart so you can retry whenever you are ready.'
              );
            },
          },
          handler: async (response) => {
            setStep('processing');
            try {
              // 3. Cryptographic signature verification on backend
              const verifyRes = await verifyPaymentSignatureOnServer({
                orderId: orderRes.orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (!verifyRes.success || !verifyRes.order) {
                throw new Error(verifyRes.error || 'Cryptographic signature verification failed.');
              }

              // Payment authoritatively confirmed
              finishOrderSuccess(verifyRes.order);
            } catch (verErr: unknown) {
              const msg = verErr instanceof Error ? verErr.message : 'Payment verification error.';
              setErrorMessage(msg);
              setStep('payment');
              setIsProcessing(false);
            }
          },
        });
        setIsProcessing(false);
        return;
      }

      // 3. Handle Cash on Delivery (COD) Flow
      if (selectedMethod === 'cod') {
        if (orderRes.order) {
          finishOrderSuccess(orderRes.order);
        } else {
          throw new Error('Order creation error for COD.');
        }
        return;
      }

      // 4. Handle Custom UPI QR Flow -> Move to QR & UTR submission screen
      if (selectedMethod === 'custom_upi_qr') {
        if (orderRes.order) {
          setConfirmedOrder(orderRes.order);
          setStep('custom_qr_utr');
          setIsProcessing(false);
        }
        return;
      }
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      const msg = err instanceof Error ? err.message : 'An error occurred during checkout.';
      setErrorMessage(msg);
      setIsProcessing(false);
      setStep('payment');
    }
  };

  // Step 2B: Customer submits UTR Reference for Custom QR order
  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedOrder) return;

    const cleanUtr = utrNumber.replace(/[^A-Za-z0-9]/g, '').trim();
    if (cleanUtr.length < 6 || cleanUtr.length > 25) {
      setErrorMessage('Please enter a valid 6 to 22-digit UPI UTR or Reference Number.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const res = await submitCustomUpiUtr({
        orderId: confirmedOrder.id,
        utrNumber: cleanUtr,
        customQrId: selectedQrId,
      });

      if (!res.success || !res.order) {
        throw new Error(res.error || 'Failed to submit UTR reference.');
      }

      finishOrderSuccess(res.order);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting UTR.';
      setErrorMessage(msg);
      setIsProcessing(false);
    }
  };

  // Common completion handler when payment is confirmed or submitted
  const finishOrderSuccess = (order: CustomerOrder) => {
    setConfirmedOrder(order);
    setStep('confirmed');
    setIsProcessing(false);

    // Dispatch notification email
    const fullShipping = `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`;
    const emailDispatch = dispatchOrderConfirmationEmail(
      order.orderNumber,
      order.customerName,
      order.customerEmail,
      items,
      `₹${order.pricing.finalTotal.toLocaleString('en-IN')}`,
      fullShipping
    );
    onEmailDispatched(emailDispatch);

    // Stop abandoned cart automation
    markOrderCompleted();

    // Clear cart
    onOrderCompleted();

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#F5DADF', '#E05A7E', '#2D2926', '#C89658', '#FFFFFF'],
      });
    } catch {
      // Ignored
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[260] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden overscroll-none"
    >
      {/* Backdrop */}
      <div
        onClick={() => {
          if (step !== 'processing') onClose();
        }}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="fixed inset-0 bg-[#2D2926]/75 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Main Dialog Modal */}
      <div
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-4xl max-h-[94vh] sm:max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl bg-[#FAF7F5] border border-[#2D2926]/15 shadow-2xl text-[#2D2926] overflow-hidden overscroll-contain"
      >
        {/* Fixed Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-[#2D2926]/10 px-4 py-3 sm:px-6 sm:py-3.5 bg-[#FAF7F5] z-10">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-[#2D2926] text-white flex items-center justify-center font-display font-bold text-xs sm:text-sm shrink-0">
              ND
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-[#2D2926]">
                  {step === 'confirmed'
                    ? 'Order Confirmed'
                    : step === 'custom_qr_utr'
                    ? 'Scan UPI QR & Enter UTR'
                    : step === 'payment'
                    ? 'Select Payment Method'
                    : 'Customer & Delivery Details'}
                </h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-white border border-[#2D2926]/10 text-[9px] font-mono font-bold text-[#8C827A] uppercase">
                  SSL Encrypted
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#8C827A] font-sans">
                {step === 'confirmed'
                  ? 'Your single-estate micro-lot reservation is officially recorded.'
                  : `Authoritative checkout for ${totalItemCount} bag${totalItemCount > 1 ? 's' : ''} • Express Roastery Dispatch`}
              </p>
            </div>
          </div>

          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer text-[#8C827A] hover:text-[#2D2926]"
              aria-label="Close checkout"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Scrollable Modal Content */}
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto px-4 py-3.5 sm:px-6 sm:py-4 modal-scrollbar overscroll-contain"
        >
          {/* Global Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 sm:p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* STEP 1: CUSTOMER & DELIVERY DETAILS */}
          {step === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
              <form id="checkout-details-form" onSubmit={handleProceedToPayment} className="lg:col-span-7 space-y-3">
                <div className="space-y-2.5">
                  {userSession?.isLoggedIn && (
                    <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 mb-1">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <div>
                          <span className="font-semibold block text-xs">
                            {userSession.email?.includes('@phone.noirkaapi.in') || userSession.email?.includes('@phone.noircafe.in') ? (
                              <>Logged in via Mobile: <strong className="font-mono">{userSession.phone || 'Verified'}</strong></>
                            ) : (
                              <>Logged in as <strong>{userSession.name}</strong> ({userSession.email})</>
                            )}
                          </span>
                          <span className="text-[10px] text-emerald-700/80 font-mono">
                            VIP Roaster Member ID: {userSession.memberId}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full shrink-0">
                        VIP Roaster
                      </span>
                    </div>
                  )}

                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#E05A7E] font-bold block">
                    1. Recipient & Contact Information
                  </span>

                  <div>
                    <label className="text-xs font-semibold text-[#5E5854] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      inputMode="text"
                      pattern="[A-Za-z\s]+"
                      value={fullName}
                      onChange={(e) => setFullName(sanitizeName(e.target.value, true))}
                      onKeyDown={(e) => {
                        if (/^[0-9]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={() => setFullName((prev) => prev.trim())}
                      placeholder=""
                      className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-sans text-[#2D2926] focus:outline-none focus:border-[#2D2926] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-semibold text-[#5E5854] block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(stripDangerousMarkup(e.target.value).trim())}
                        placeholder=""
                        className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-sans text-[#2D2926] focus:outline-none focus:border-[#2D2926] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#5E5854] block mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(sanitizePhone(e.target.value))}
                        placeholder=""
                        className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-sans text-[#2D2926] focus:outline-none focus:border-[#2D2926] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2.5 border-t border-[#2D2926]/10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#E05A7E] font-bold block">
                    2. Shipping Address
                  </span>

                  <div>
                    <label className="text-xs font-semibold text-[#5E5854] block mb-1">
                      Street Address & Flat No. *
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="street-address"
                      value={address}
                      onChange={(e) => setAddress(sanitizeAddress(e.target.value))}
                      placeholder=""
                      className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-sans text-[#2D2926] focus:outline-none focus:border-[#2D2926] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-xs font-semibold text-[#5E5854] block mb-1">City *</label>
                      <input
                        type="text"
                        required
                        autoComplete="address-level2"
                        value={city}
                        onChange={(e) => setCity(sanitizeCity(e.target.value))}
                        placeholder=""
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-sans text-[#2D2926] focus:outline-none focus:border-[#2D2926] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#5E5854] block mb-1">PIN Code *</label>
                      <input
                        type="text"
                        required
                        autoComplete="postal-code"
                        maxLength={6}
                        value={postalCode}
                        onChange={(e) => setPostalCode(sanitizePostalCode(e.target.value))}
                        placeholder=""
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-sans text-[#2D2926] focus:outline-none focus:border-[#2D2926] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#5E5854] block mb-1">Country *</label>
                      <input
                        type="text"
                        required
                        autoComplete="country-name"
                        value={country}
                        onChange={(e) => setCountry(sanitizeCountry(e.target.value))}
                        placeholder=""
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-sans text-[#2D2926] focus:outline-none focus:border-[#2D2926] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Discount Coupon Code Section */}
                <div className="pt-2 border-t border-[#2D2926]/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#E05A7E] font-bold block">
                      Discount Coupon Code
                    </span>
                    <span className="text-[10px] font-mono text-[#8C827A]">
                      Select code or type below
                    </span>
                  </div>

                  {/* Coupon Dropdown Selector */}
                  <select
                    value={appliedPromo || ''}
                    onChange={(e) => {
                      const code = e.target.value;
                      if (!code) {
                        handleRemovePromo();
                      } else {
                        applySpecificPromo(code);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-sans font-medium text-[#2D2926] focus:outline-none focus:border-[#2D2926] cursor-pointer"
                  >
                    <option value="">-- Choose a Coupon Code --</option>
                    {AVAILABLE_COUPONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>

                  {/* Manual Code Input Bar */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Or enter coupon code (e.g. FIRST10)"
                      disabled={Boolean(appliedPromo)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-mono font-bold text-[#2D2926] uppercase placeholder:font-sans placeholder:normal-case placeholder:font-normal placeholder:text-[#8C827A] focus:outline-none focus:border-[#2D2926]"
                    />
                    {appliedPromo ? (
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="px-3.5 py-2 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold hover:bg-rose-200 transition-colors cursor-pointer shrink-0"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-4 py-2 rounded-xl bg-[#2D2926] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer shrink-0"
                      >
                        Apply
                      </button>
                    )}
                  </div>

                  {appliedPromo && (
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-800 font-bold flex items-center justify-between gap-1">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Coupon {appliedPromo} applied: {promoDiscount}% savings on your order!</span>
                      </span>
                      <span className="text-emerald-700 font-bold shrink-0">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                {/* Hidden form submit trigger for keyboard Enter */}
                <button type="submit" className="hidden" aria-hidden="true" />
              </form>

              {/* Right Summary Panel */}
              <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-3xl border border-[#2D2926]/10 p-4 sm:p-5 shadow-xs space-y-3 lg:sticky lg:top-0">
                <div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#2D2926]/10 mb-2.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] font-bold">
                      Order Summary ({totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'})
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Direct Dispatch
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[160px] sm:max-h-[200px] overflow-y-auto modal-scrollbar pr-1">
                    {items.map((it) => (
                      <div
                        key={`${it.product.id}-${it.grind}-${it.isSubscription ? it.subscriptionFrequency : 'one'}`}
                        className="flex gap-2.5 items-center text-xs pb-2.5 border-b border-[#2D2926]/5 last:border-b-0"
                      >
                        {it.product.image && (
                          <img
                            src={it.product.image}
                            alt={it.product.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shrink-0 border border-[#2D2926]/10 bg-[#FAF7F5]"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-bold text-xs sm:text-sm text-[#2D2926] truncate">{it.product.name}</h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] sm:text-[10px] text-[#E05A7E] font-mono font-semibold">{it.grind}</span>
                            <span className="text-[9px] sm:text-[10px] text-[#8C827A] font-mono">• Qty: {it.quantity}</span>
                          </div>
                          {it.isSubscription && (
                            <span className="inline-block mt-0.5 text-[8.5px] font-mono bg-[#E05A7E] text-white px-1.5 py-0.2 rounded font-bold">
                              Roaster's Club ({it.subscriptionFrequency}) • -10%
                            </span>
                          )}
                        </div>
                        <div className="font-mono font-bold text-xs sm:text-sm text-[#2D2926] shrink-0 text-right pl-2">
                          {it.unitPriceNum ? `₹${(it.unitPriceNum * it.quantity).toLocaleString('en-IN')}` : it.product.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs bg-[#FAF7F5] rounded-xl p-3 sm:p-3.5 border border-[#2D2926]/10">
                  <div className="flex justify-between items-center text-[#5E5854]">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold text-[#2D2926]">₹{subtotalNumeric.toLocaleString('en-IN')}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between items-center text-emerald-700 font-semibold">
                      <span>Discount ({appliedPromo})</span>
                      <span className="font-mono font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-[#5E5854]">
                    <span>Express Shipping</span>
                    <span className="font-mono font-bold text-emerald-700">FREE</span>
                  </div>
                  {selectedMethod === 'cod' && (
                    <div className="flex justify-between items-center text-[#C89658] font-semibold">
                      <span>Cash on Delivery Handling</span>
                      <span className="font-mono font-bold">+₹100</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-2 border-t border-[#2D2926]/15 text-sm font-bold text-[#2D2926]">
                    <span>Total Payable</span>
                    <span className="font-mono text-lg sm:text-xl text-[#2D2926] font-bold">{formattedTotal}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-[#8C827A] pt-0.5 text-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>NITROGEN-SEALED • 100% FRESHNESS GUARANTEED</span>
                </div>
              </div>
            </div>
          )}

        {/* STEP 2: PAYMENT METHOD SELECTION */}
        {step === 'payment' && (
          <div className="space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#2D2926]/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E05A7E] font-bold block">
                  Step 2 of 2: Payment Gateway
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-[#2D2926]">
                  Select Payment Method
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-xs font-sans font-semibold text-[#5E5854] hover:text-[#2D2926] flex items-center gap-1.5 cursor-pointer py-1 px-3 rounded-full bg-white border border-[#2D2926]/15 hover:border-[#2D2926]/40 transition-all shadow-2xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Edit Address</span>
              </button>
            </div>

            {/* Payment Method Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Method 1: Razorpay Fast UPI & Cards */}
              <div
                onClick={() => setSelectedMethod('razorpay')}
                className={`p-3 sm:p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                  selectedMethod === 'razorpay'
                    ? 'border-[#2D2926] bg-[#2D2926] text-white shadow-lg'
                    : 'border-[#2D2926]/15 bg-white text-[#2D2926] hover:border-[#2D2926]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[8.5px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                        selectedMethod === 'razorpay'
                          ? 'bg-[#E05A7E] text-white'
                          : 'bg-[#FAF7F5] text-[#2D2926] border border-[#2D2926]/10'
                      }`}
                    >
                      RECOMMENDED
                    </span>
                    <ShieldCheck
                      className={`h-4 w-4 ${
                        selectedMethod === 'razorpay' ? 'text-emerald-400' : 'text-[#8C827A]'
                      }`}
                    />
                  </div>

                  <h4 className="font-display font-bold text-sm sm:text-base mb-0.5">Razorpay UPI & Cards</h4>
                  <p
                    className={`text-[11px] leading-snug mb-2 ${
                      selectedMethod === 'razorpay' ? 'text-white/80' : 'text-[#5E5854]'
                    }`}
                  >
                    Google Pay, PhonePe, Paytm, Cards & Netbanking.
                  </p>
                </div>

                <div
                  className={`pt-2 border-t text-[9.5px] font-mono flex items-center justify-between ${
                    selectedMethod === 'razorpay' ? 'border-white/15 text-white/70' : 'border-[#2D2926]/10 text-[#8C827A]'
                  }`}
                >
                  <span>Instant Verification</span>
                  <span className="font-bold">✓ 256-Bit SSL</span>
                </div>
              </div>

              {/* Method 2: Custom Direct UPI QR */}
              <div
                onClick={() => setSelectedMethod('custom_upi_qr')}
                className={`p-3 sm:p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                  selectedMethod === 'custom_upi_qr'
                    ? 'border-[#C89658] bg-[#2D2926] text-white shadow-lg ring-1 ring-[#C89658]'
                    : 'border-[#2D2926]/15 bg-white text-[#2D2926] hover:border-[#C89658]/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[8.5px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                        selectedMethod === 'custom_upi_qr'
                          ? 'bg-[#C89658] text-[#2D2926]'
                          : 'bg-[#FAF7F5] text-[#C89658] border border-[#C89658]/30'
                      }`}
                    >
                      DIRECT ROASTERY QR
                    </span>
                    <QrCode
                      className={`h-4 w-4 ${
                        selectedMethod === 'custom_upi_qr' ? 'text-[#C89658]' : 'text-[#8C827A]'
                      }`}
                    />
                  </div>

                  <h4 className="font-display font-bold text-sm sm:text-base mb-0.5">Direct Bank UPI QR</h4>
                  <p
                    className={`text-[11px] leading-snug mb-2 ${
                      selectedMethod === 'custom_upi_qr' ? 'text-white/80' : 'text-[#5E5854]'
                    }`}
                  >
                    Scan Roastery Current Account QR & submit 12-digit UTR.
                  </p>
                </div>

                <div
                  className={`pt-2 border-t text-[9.5px] font-mono flex items-center justify-between ${
                    selectedMethod === 'custom_upi_qr' ? 'border-white/15 text-white/70' : 'border-[#2D2926]/10 text-[#8C827A]'
                  }`}
                >
                  <span>3 Verified Accounts</span>
                  <span className="text-[#C89658] font-bold">Manual Review</span>
                </div>
              </div>

              {/* Method 3: Cash on Delivery (COD) */}
              <div
                onClick={() => setSelectedMethod('cod')}
                className={`p-3 sm:p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                  selectedMethod === 'cod'
                    ? 'border-[#2D2926] bg-[#2D2926] text-white shadow-lg'
                    : 'border-[#2D2926]/15 bg-white text-[#2D2926] hover:border-[#2D2926]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[8.5px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                        selectedMethod === 'cod'
                          ? 'bg-emerald-400 text-[#2D2926]'
                          : 'bg-[#FAF7F5] text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      PAY ON DELIVERY
                    </span>
                    <Truck
                      className={`h-4 w-4 ${
                        selectedMethod === 'cod' ? 'text-emerald-400' : 'text-[#8C827A]'
                      }`}
                    />
                  </div>

                  <h4 className="font-display font-bold text-sm sm:text-base mb-0.5">Cash on Delivery</h4>
                  <p
                    className={`text-[11px] leading-snug mb-2 ${
                      selectedMethod === 'cod' ? 'text-white/80' : 'text-[#5E5854]'
                    }`}
                  >
                    Pay via Cash or UPI at your doorstep upon arrival.
                  </p>
                </div>

                <div
                  className={`pt-2 border-t text-[9.5px] font-mono flex items-center justify-between ${
                    selectedMethod === 'cod' ? 'border-white/15 text-white/70' : 'border-[#2D2926]/10 text-[#8C827A]'
                  }`}
                >
                  <span className="font-bold">+₹100 Handling Charge</span>
                  <span className="text-emerald-400 font-bold">Doorstep OTP</span>
                </div>
              </div>
            </div>

            {/* Custom UPI QR Selector (If custom_upi_qr selected) */}
            {selectedMethod === 'custom_upi_qr' && (
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-[#C89658]/40 shadow-xs space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#C89658] font-bold block">
                    Select Roastery UPI Account:
                  </span>
                  <span className="text-[10px] font-mono text-[#8C827A]">Tap to choose preferred UPI app</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {customQrConfigs.map((qr) => {
                    const isSelected = selectedQrId === qr.id;
                    return (
                      <button
                        key={qr.id}
                        type="button"
                        onClick={() => setSelectedQrId(qr.id)}
                        className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-[#2D2926] bg-[#FAF7F5] shadow-xs ring-2 ring-[#2D2926]'
                            : 'border-[#2D2926]/15 bg-white hover:border-[#2D2926]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9.5px] font-mono font-bold text-[#E05A7E] uppercase tracking-wider">{qr.bankName}</span>
                          {qr.isRecommended ? (
                            <span className="text-[8px] font-mono bg-[#E05A7E] text-white px-1.5 py-0.2 rounded-full font-bold">
                              POPULAR
                            </span>
                          ) : isSelected ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#2D2926]" />
                          ) : null}
                        </div>
                        <div className="font-display font-bold text-xs text-[#2D2926] leading-tight mb-0.5">{qr.title}</div>
                        <div className="text-[10px] font-mono text-[#8C827A] truncate font-medium bg-[#FAF7F5] px-1.5 py-0.5 rounded border border-[#2D2926]/5">{qr.vpa}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Total and Action Button Bar */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-[#2D2926]/10 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="text-center sm:text-left">
                <span className="text-[9.5px] font-mono uppercase tracking-widest text-[#8C827A] block font-bold">Final Payable Amount:</span>
                <div className="font-mono text-xl sm:text-2xl font-bold text-[#2D2926] leading-tight">{formattedTotal}</div>
                <span className="text-[10.5px] font-mono text-emerald-700 font-semibold">✓ Free Express Direct Estate Shipping</span>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleInitiatePayment}
                className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-full bg-[#2D2926] text-white font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RotateCcw className="h-4 w-4 animate-spin" />
                    <span>Communicating with Gateway...</span>
                  </>
                ) : selectedMethod === 'razorpay' ? (
                  <>
                    <Lock className="h-4 w-4 text-emerald-400" />
                    <span>Pay {formattedTotal} with Razorpay</span>
                  </>
                ) : selectedMethod === 'custom_upi_qr' ? (
                  <>
                    <QrCode className="h-4 w-4 text-[#C89658]" />
                    <span>Proceed to Scan QR & Enter UTR</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4 text-emerald-400" />
                    <span>Confirm Cash on Delivery Order • {formattedTotal}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CUSTOM DIRECT UPI QR DISPLAY & UTR SUBMISSION */}
        {step === 'custom_qr_utr' && confirmedOrder && (
          <div className="space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#2D2926]/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E05A7E] font-bold block">
                  ORDER #{confirmedOrder.orderNumber}
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-[#2D2926]">
                  Scan UPI QR Code & Enter 12-Digit UTR
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="text-xs font-sans font-semibold text-[#5E5854] hover:text-[#2D2926] flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-full bg-white border border-[#2D2926]/15 hover:border-[#2D2926]/40 transition-all shadow-2xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Change Payment Method</span>
              </button>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-[#2D2926]/10 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
              {/* QR Image Display */}
              <div className="md:col-span-5 flex flex-col items-center text-center">
                <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border border-[#2D2926]/15 p-1.5 shadow-inner mb-2 flex items-center justify-center ${activeQr.image.includes('paytm') ? 'bg-white' : 'bg-[#0E0E0E]'}`}>
                  <img
                    src={activeQr.image}
                    alt={activeQr.title}
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <span className="text-xs font-mono font-bold text-[#2D2926]">{activeQr.bankName} • {activeQr.title}</span>
                <span className="text-[10.5px] font-mono text-[#8C827A] mt-0.5">{activeQr.accountHolder}</span>
                <div className="mt-1 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 text-xs font-mono text-[#5E5854]">
                  <span>{activeQr.vpa}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyVpa(activeQr.vpa)}
                    className="p-1 hover:text-[#2D2926] cursor-pointer"
                    title="Copy UPI ID"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
                {copiedVpa && <span className="text-[10px] text-emerald-700 font-bold mt-0.5">UPI ID Copied!</span>}
              </div>

              {/* UTR Submission Form */}
              <div className="md:col-span-7 space-y-3">
                <div>
                  <div className="text-xs text-[#5E5854]">Transfer Exact Amount:</div>
                  <div className="font-mono text-2xl font-bold text-[#2D2926] leading-tight mb-1">
                    {formattedTotal}
                  </div>
                  <p className="text-[11px] text-[#5E5854] leading-snug">
                    1. Open Google Pay, PhonePe, Paytm, or BHIM.
                    <br />
                    2. Scan QR or transfer to: <strong>{activeQr.vpa}</strong> ({activeQr.accountHolder}).
                    <br />
                    3. After payment, enter your 12-digit UPI Reference / UTR Number below.
                  </p>
                </div>

                <form onSubmit={handleSubmitUtr} className="space-y-2.5 pt-2 border-t border-[#2D2926]/10">
                  <div>
                    <label className="text-xs font-semibold text-[#2D2926] block mb-1">
                      UPI Reference / UTR Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value.replace(/[^A-Za-z0-9]/g, '').trim())}
                      placeholder=""
                      className="w-full px-3.5 py-2 rounded-xl border border-[#2D2926]/15 bg-[#FAF7F5] text-xs font-mono font-bold text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                    />
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[10.5px] leading-snug flex items-start gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                    <span>
                      <strong>Manual Verification:</strong> Orders paid via direct static QR are marked <em>Awaiting Manual Verification</em>. Our roastery verifies the UTR against our bank statement before dispatch.
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep('payment')}
                      className="order-2 sm:order-1 px-4 py-2.5 rounded-full border border-[#2D2926]/20 bg-white text-[#5E5854] hover:text-[#2D2926] hover:bg-[#FAF7F5] font-display font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Change Payment Method</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="order-1 sm:order-2 flex-1 py-2.5 sm:py-3 rounded-full bg-[#2D2926] text-white font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <RotateCcw className="h-4 w-4 animate-spin" />
                          <span>Submitting UTR Reference...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span>Submit UTR for Verification</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* PROCESSING SPINNER */}
        {step === 'processing' && (
          <div className="py-16 text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-[#FAF7F5] border border-[#2D2926]/15 flex items-center justify-center text-[#2D2926]">
              <RotateCcw className="h-8 w-8 animate-spin text-[#E05A7E]" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#2D2926]">
              Cryptographically Verifying Payment...
            </h3>
            <p className="text-xs text-[#8C827A] max-w-md mx-auto">
              Please wait while our backend verifies your Razorpay signature with 256-bit HMAC-SHA256 authentication.
            </p>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMED */}
        {step === 'confirmed' && confirmedOrder && (
          <div className="space-y-6">
            <div className="text-center space-y-2 py-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#E05A7E] font-bold block">
                ORDER RESERVATION COMPLETED
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#2D2926]">
                Thank You, {confirmedOrder.customerName}!
              </h3>
              <p className="text-xs sm:text-sm text-[#5E5854] max-w-lg mx-auto">
                Your order <strong>#{confirmedOrder.orderNumber}</strong> has been registered with our Indiranagar roastery lab.
              </p>
            </div>

            {/* Status & Payment Method Details */}
            <div className="p-6 rounded-3xl bg-white border border-[#2D2926]/10 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2D2926]/10">
                <div>
                  <span className="text-[10px] font-mono text-[#8C827A] uppercase">Order Number</span>
                  <div className="font-mono text-base font-bold text-[#2D2926]">{confirmedOrder.orderNumber}</div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-[#8C827A] uppercase">Payment Status</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {confirmedOrder.paymentStatus === 'captured' ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        PAID & VERIFIED (₹{confirmedOrder.pricing.finalTotal.toLocaleString('en-IN')})
                      </span>
                    ) : confirmedOrder.paymentStatus === 'awaiting_manual_verification' ? (
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-mono font-bold flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        AWAITING MANUAL UTR RECONCILIATION
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-mono font-bold flex items-center gap-1">
                        <Truck className="h-3.5 w-3.5" />
                        CASH ON DELIVERY (PENDING UPON ARRIVAL)
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-[#8C827A] uppercase">Fulfillment</span>
                  <div className="font-mono text-xs font-bold text-[#2D2926] uppercase">
                    {confirmedOrder.fulfillmentStatus === 'roasting' ? '🔥 Fresh Roasting in Progress' : '📦 Queued for Roastery Pack'}
                  </div>
                </div>
              </div>

              {/* Items & Shipping Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] font-bold block mb-2">
                    Roasted Items
                  </span>
                  <div className="space-y-2 text-xs">
                    {confirmedOrder.items.map((it) => (
                      <div key={`${it.productId}-${it.grind}`} className="flex justify-between pb-1.5 border-b border-[#2D2926]/5">
                        <div>
                          <span className="font-bold text-[#2D2926]">{it.name}</span>
                          <span className="text-[11px] text-[#8C827A] block font-mono">{it.grind} • Qty {it.quantity}</span>
                        </div>
                        <span className="font-mono font-bold text-[#2D2926]">₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] font-bold block mb-2">
                    Delivery Address & Tracking
                  </span>
                  <div className="text-xs text-[#5E5854] space-y-1">
                    <p className="font-bold text-[#2D2926]">{confirmedOrder.customerName}</p>
                    <p>{confirmedOrder.shippingAddress.address}</p>
                    <p>{confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.postalCode}, {confirmedOrder.shippingAddress.country}</p>
                    <p className="font-mono pt-1 text-[#2D2926]">Contact: {confirmedOrder.customerPhone}</p>
                    {confirmedOrder.utrNumber && (
                      <p className="font-mono pt-1 text-[#E05A7E] font-bold">Submitted UTR: {confirmedOrder.utrNumber}</p>
                    )}
                    {confirmedOrder.razorpayPaymentId && (
                      <p className="font-mono pt-1 text-emerald-700 font-bold">Razorpay ID: {confirmedOrder.razorpayPaymentId}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Tax Invoice & Live Order Tracking */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsInvoiceOpen(true)}
                className="py-3.5 px-4 rounded-2xl bg-white border border-[#2D2926]/20 text-[#2D2926] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#FAF7F5] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Printer className="h-4 w-4 text-[#E05A7E]" />
                <span>Print Official Tax Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTrackingOpen(true)}
                className="py-3.5 px-4 rounded-2xl bg-[#E05A7E] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#c94567] transition-all cursor-pointer shadow-md active:scale-95"
              >
                <Truck className="h-4 w-4" />
                <span>Track Roastery Dispatch</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-full bg-[#2D2926] text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-black transition-all shadow-sm cursor-pointer"
            >
              Close & Return to Boutique
            </button>
          </div>
        )}
        </div>

        {/* Pinned Bottom Action Bar for Step 1: Guarantees "Continue to Payment Selection" is 100% visible at all times without scrolling */}
        {step === 'details' && (
          <div className="shrink-0 border-t border-[#2D2926]/10 px-4 py-2.5 sm:px-6 sm:py-3 bg-white/95 backdrop-blur-md flex items-center justify-between gap-3 sm:gap-4 z-20 shadow-xs">
            <div className="flex flex-col">
              <span className="text-[9.5px] font-mono text-[#8C827A] uppercase tracking-wider font-bold">Total Payable</span>
              <span className="font-mono font-bold text-base sm:text-lg text-[#2D2926] leading-tight">{formattedTotal}</span>
            </div>
            <button
              type="submit"
              form="checkout-details-form"
              className="flex-1 sm:flex-initial px-6 py-2.5 sm:py-3 rounded-full bg-[#2D2926] text-[#FAF7F5] font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md cursor-pointer active:scale-[0.99]"
            >
              <span>Continue to Payment Selection</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Official Tax Invoice Print Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={confirmedOrder}
      />

      {/* Live Roastery Dispatch Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        order={confirmedOrder}
        onOpenInvoice={() => {
          setIsTrackingOpen(false);
          setIsInvoiceOpen(true);
        }}
      />
    </div>
  );
};
