import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Lock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Truck,
  RotateCcw,
  AlertCircle,
  Copy,
  Clock,
  Sparkles,
  User,
  Printer,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InvoiceModal } from './InvoiceModal';
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

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  userSession,
  onOrderCompleted,
  onEmailDispatched,
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckoutStep>('details');

  // Customer shipping details
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('Bengaluru');
  const [postalCode, setPostalCode] = useState<string>('560038');
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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedVpa, setCopiedVpa] = useState<boolean>(false);

  // Initialize and prefill from user session if available
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setErrorMessage('');
      setIsProcessing(false);
      setConfirmedOrder(null);
      setUtrNumber('');

      if (userSession && userSession.isLoggedIn) {
        setFullName(userSession.name || '');
        setEmail(userSession.email || '');
        setPhone(userSession.phone || '');
        const defaultAddr =
          userSession.savedAddresses?.find((a) => a.isDefault) || userSession.savedAddresses?.[0];
        if (defaultAddr) {
          setAddress(defaultAddr.street || '');
          setCity(defaultAddr.city || 'Bengaluru');
          setPostalCode(defaultAddr.postalCode || '560038');
          setCountry(defaultAddr.country || 'India');
        }
      } else {
        setFullName('');
        setEmail('');
        setPhone('');
        setAddress('');
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
  const totalNumeric = Math.max(0, subtotalNumeric - discountAmount + shippingCost);
  const formattedTotal = `₹${totalNumeric.toLocaleString('en-IN')}`;
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const activeQr = customQrConfigs.find((q) => q.id === selectedQrId) || customQrConfigs[0];

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (!clean) return;

    if (clean === 'NOIRVIP10' || clean === 'NOIR10' || clean === 'VIP10') {
      setAppliedPromo(clean);
      setPromoDiscount(10);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid promo code. Use NOIRVIP10 for 10% off.');
    }
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

        const gatewayKey = orderRes.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TsqAJmo20ycL7d';

        await openRazorpayCheckout({
          key: gatewayKey,
          amount: orderRes.amount || totalNumeric * 100,
          currency: orderRes.currency || 'INR',
          name: 'NOIR DAKSHIN COFFEE',
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
    <div className="fixed inset-0 z-[260] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => {
          if (step !== 'processing') onClose();
        }}
        className="fixed inset-0 bg-[#2D2926]/70 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Main Dialog Modal */}
      <div className="relative z-10 w-full max-w-4xl rounded-3xl bg-[#FAF7F5] border border-[#2D2926]/10 p-6 sm:p-8 shadow-2xl text-[#2D2926] max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#2D2926]/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#2D2926] text-white flex items-center justify-center font-display font-bold">
              ND
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg sm:text-xl text-[#2D2926]">
                  {step === 'confirmed'
                    ? 'Order Confirmed'
                    : step === 'custom_qr_utr'
                    ? 'Scan UPI QR & Enter UTR'
                    : step === 'payment'
                    ? 'Select Payment Method'
                    : 'Customer & Delivery Details'}
                </h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-white border border-[#2D2926]/10 text-[10px] font-mono font-bold text-[#8C827A] uppercase">
                  SSL Encrypted
                </span>
              </div>
              <p className="text-xs text-[#8C827A] font-sans">
                {step === 'confirmed'
                  ? 'Your single-estate micro-lot reservation is officially recorded.'
                  : `Authoritative checkout for ${totalItemCount} bag${totalItemCount > 1 ? 's' : ''} • Express Roastery Dispatch`}
              </p>
            </div>
          </div>

          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer text-[#8C827A] hover:text-[#2D2926]"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* STEP 1: CUSTOMER & DELIVERY DETAILS */}
        {step === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form onSubmit={handleProceedToPayment} className="lg:col-span-7 space-y-4">
              <div className="space-y-3">
                {userSession?.isLoggedIn ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Logged in as <strong>{userSession.name}</strong> ({userSession.email})
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      {userSession.memberId}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 text-xs text-[#5E5854] mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#C89658] shrink-0" />
                      <span>Already a coffee member?</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate('/login?redirect=/cart');
                      }}
                      className="font-bold text-[#C89658] hover:text-[#2D2926] underline cursor-pointer"
                    >
                      Sign In to load saved details ↗
                    </button>
                  </div>
                )}

                <span className="text-[11px] font-mono uppercase tracking-widest text-[#E05A7E] font-bold block">
                  1. Recipient & Contact Information
                </span>

                <div>
                  <label className="text-xs font-semibold text-[#5E5854] block mb-1">
                    Full Name (Alphabetic letters only) *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(sanitizeName(e.target.value))}
                    placeholder="e.g. Priyanshu Singh"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-sans text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#5E5854] block mb-1">
                      Email Address (For Invoices & Tracking) *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(stripDangerousMarkup(e.target.value).trim())}
                      placeholder="priyanshu@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-sans text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#5E5854] block mb-1">
                      Phone Number (For Delivery OTP) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(sanitizePhone(e.target.value))}
                      placeholder="+91 98765-43210"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-sans text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#2D2926]/10">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#E05A7E] font-bold block">
                  2. Shipping Address
                </span>

                <div>
                  <label className="text-xs font-semibold text-[#5E5854] block mb-1">
                    Street Address & House / Flat No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(sanitizeAddress(e.target.value))}
                    placeholder="12th Main, 100ft Road, Indiranagar"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-sans text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#5E5854] block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(sanitizeCity(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-sans text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#5E5854] block mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(sanitizePostalCode(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-sans text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#5E5854] block mb-1">Country</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(sanitizeCountry(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-sans text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                    />
                  </div>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Promo Code (e.g. NOIRVIP10)"
                    disabled={Boolean(appliedPromo)}
                    className="flex-1 px-4 py-2 rounded-xl border border-[#2D2926]/15 bg-white text-xs font-mono font-bold text-[#2D2926] uppercase focus:outline-none"
                  />
                  {appliedPromo ? (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="px-4 py-2 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold hover:bg-rose-200 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 rounded-xl bg-[#2D2926] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {appliedPromo && (
                  <div className="mt-1.5 text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Promo code {appliedPromo} applied: 10% discount on entire coffee order!</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3.5 rounded-full bg-[#2D2926] text-[#FAF7F5] font-display font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md cursor-pointer"
              >
                <span>Continue to Payment Selection</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Right Summary Panel */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#2D2926]/10 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] font-bold block mb-3">
                  Order Summary ({totalItemCount} Items)
                </span>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {items.map((it) => (
                    <div key={`${it.product.id}-${it.grind}-${it.isSubscription ? it.subscriptionFrequency : 'one'}`} className="flex justify-between items-start text-xs pb-2 border-b border-[#2D2926]/5">
                      <div>
                        <div className="font-bold text-[#2D2926]">{it.product.name}</div>
                        <div className="text-[11px] text-[#8C827A] font-mono">{it.grind}</div>
                        {it.isSubscription && (
                          <span className="text-[9px] font-mono bg-[#E05A7E] text-white px-1.5 py-0.2 rounded font-bold">
                            Roaster's Club ({it.subscriptionFrequency}) • -10%
                          </span>
                        )}
                        <div className="text-[11px] text-[#5E5854]">Qty: {it.quantity}</div>
                      </div>
                      <div className="font-mono font-bold text-[#2D2926]">
                        {it.unitPriceNum ? `₹${it.unitPriceNum.toLocaleString('en-IN')}` : it.product.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#2D2926]/10 space-y-2 text-xs">
                <div className="flex justify-between text-[#5E5854]">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-[#2D2926]">₹{subtotalNumeric.toLocaleString('en-IN')}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount (10% Off):</span>
                    <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#5E5854]">
                  <span>Shipping:</span>
                  <span className="font-mono font-bold text-emerald-700">FREE (Direct Estate)</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-[#2D2926]/10 text-sm font-bold text-[#2D2926]">
                  <span>Total Payable:</span>
                  <span className="font-mono text-xl text-[#2D2926]">{formattedTotal}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT METHOD SELECTION */}
        {step === 'payment' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-[#E05A7E] font-bold">
                Select Your Preferred Payment Gateway
              </span>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-xs font-sans text-[#8C827A] hover:text-[#2D2926] underline cursor-pointer"
              >
                ← Edit Customer Details
              </button>
            </div>

            {/* Payment Method Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Method 1: Razorpay Fast UPI & Cards */}
              <div
                onClick={() => setSelectedMethod('razorpay')}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                  selectedMethod === 'razorpay'
                    ? 'border-[#2D2926] bg-[#2D2926] text-white shadow-xl'
                    : 'border-[#2D2926]/15 bg-white text-[#2D2926] hover:border-[#2D2926]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        selectedMethod === 'razorpay'
                          ? 'bg-[#E05A7E] text-white'
                          : 'bg-[#FAF7F5] text-[#2D2926] border border-[#2D2926]/10'
                      }`}
                    >
                      RECOMMENDED
                    </span>
                    <ShieldCheck
                      className={`h-5 w-5 ${
                        selectedMethod === 'razorpay' ? 'text-emerald-400' : 'text-[#8C827A]'
                      }`}
                    />
                  </div>

                  <h3 className="font-display font-bold text-lg mb-1">Razorpay UPI & Cards</h3>
                  <p
                    className={`text-xs leading-relaxed mb-4 ${
                      selectedMethod === 'razorpay' ? 'text-white/80' : 'text-[#5E5854]'
                    }`}
                  >
                    Google Pay, PhonePe, Paytm, BHIM, UPI QR, Visa, Mastercard, RuPay & Netbanking.
                  </p>
                </div>

                <div
                  className={`pt-3 border-t text-[11px] font-mono flex items-center justify-between ${
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
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                  selectedMethod === 'custom_upi_qr'
                    ? 'border-[#C89658] bg-[#2D2926] text-white shadow-xl'
                    : 'border-[#2D2926]/15 bg-white text-[#2D2926] hover:border-[#C89658]/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        selectedMethod === 'custom_upi_qr'
                          ? 'bg-[#C89658] text-[#2D2926]'
                          : 'bg-[#FAF7F5] text-[#C89658] border border-[#C89658]/30'
                      }`}
                    >
                      DIRECT ROASTERY QR
                    </span>
                    <QrCode
                      className={`h-5 w-5 ${
                        selectedMethod === 'custom_upi_qr' ? 'text-[#C89658]' : 'text-[#8C827A]'
                      }`}
                    />
                  </div>

                  <h3 className="font-display font-bold text-lg mb-1">Direct Bank UPI QR</h3>
                  <p
                    className={`text-xs leading-relaxed mb-4 ${
                      selectedMethod === 'custom_upi_qr' ? 'text-white/80' : 'text-[#5E5854]'
                    }`}
                  >
                    Scan our Roastery Current Account QR and submit your 12-digit UTR transaction reference number.
                  </p>
                </div>

                <div
                  className={`pt-3 border-t text-[11px] font-mono flex items-center justify-between ${
                    selectedMethod === 'custom_upi_qr' ? 'border-white/15 text-white/70' : 'border-[#2D2926]/10 text-[#8C827A]'
                  }`}
                >
                  <span>3 Selectable Accounts</span>
                  <span className="text-[#C89658] font-bold">Manual Review</span>
                </div>
              </div>

              {/* Method 3: Cash on Delivery (COD) */}
              <div
                onClick={() => setSelectedMethod('cod')}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                  selectedMethod === 'cod'
                    ? 'border-[#2D2926] bg-[#2D2926] text-white shadow-xl'
                    : 'border-[#2D2926]/15 bg-white text-[#2D2926] hover:border-[#2D2926]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        selectedMethod === 'cod'
                          ? 'bg-emerald-400 text-[#2D2926]'
                          : 'bg-[#FAF7F5] text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      PAY ON DELIVERY
                    </span>
                    <Truck
                      className={`h-5 w-5 ${
                        selectedMethod === 'cod' ? 'text-emerald-400' : 'text-[#8C827A]'
                      }`}
                    />
                  </div>

                  <h3 className="font-display font-bold text-lg mb-1">Cash on Delivery</h3>
                  <p
                    className={`text-xs leading-relaxed mb-4 ${
                      selectedMethod === 'cod' ? 'text-white/80' : 'text-[#5E5854]'
                    }`}
                  >
                    Pay with Cash or UPI upon coffee bean delivery at your doorstep. Zero advance payment required.
                  </p>
                </div>

                <div
                  className={`pt-3 border-t text-[11px] font-mono flex items-center justify-between ${
                    selectedMethod === 'cod' ? 'border-white/15 text-white/70' : 'border-[#2D2926]/10 text-[#8C827A]'
                  }`}
                >
                  <span>Zero Advance Fee</span>
                  <span className="text-emerald-400 font-bold">Unpaid/Pending</span>
                </div>
              </div>
            </div>

            {/* Custom UPI QR Selector (If custom_upi_qr selected) */}
            {selectedMethod === 'custom_upi_qr' && (
              <div className="p-5 rounded-3xl bg-white border border-[#C89658]/40 shadow-sm space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#C89658] font-bold block">
                  Select Roastery UPI Account:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {customQrConfigs.map((qr) => (
                    <button
                      key={qr.id}
                      type="button"
                      onClick={() => setSelectedQrId(qr.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedQrId === qr.id
                          ? 'border-[#2D2926] bg-[#FAF7F5] ring-2 ring-[#2D2926]'
                          : 'border-[#2D2926]/15 bg-white hover:border-[#2D2926]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold text-[#E05A7E] uppercase">{qr.bankName}</span>
                        {qr.isRecommended && (
                          <span className="text-[9px] font-mono bg-[#E05A7E] text-white px-1.5 py-0.5 rounded-full font-bold">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <div className="font-display font-bold text-xs text-[#2D2926] leading-tight mb-1">{qr.title}</div>
                      <div className="text-[10px] font-mono text-[#8C827A] truncate">{qr.vpa}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Total and Action Button */}
            <div className="p-6 rounded-3xl bg-white border border-[#2D2926]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#8C827A] font-sans block">Final Payable Amount:</span>
                <div className="font-mono text-2xl font-bold text-[#2D2926]">{formattedTotal}</div>
                <span className="text-[11px] font-mono text-emerald-700">✓ Free Express Direct Estate Shipping</span>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleInitiatePayment}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#2D2926] text-white font-display font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RotateCcw className="h-4 w-4 animate-spin" />
                    <span>Communicating with Gateway...</span>
                  </>
                ) : selectedMethod === 'razorpay' ? (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Pay {formattedTotal} with Razorpay</span>
                  </>
                ) : selectedMethod === 'custom_upi_qr' ? (
                  <>
                    <QrCode className="h-4 w-4" />
                    <span>Proceed to Scan QR & Enter UTR</span>
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4" />
                    <span>Confirm Cash on Delivery Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CUSTOM DIRECT UPI QR DISPLAY & UTR SUBMISSION */}
        {step === 'custom_qr_utr' && confirmedOrder && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-[#2D2926]/10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* QR Image Display */}
              <div className="md:col-span-5 flex flex-col items-center text-center">
                <div className={`w-56 h-56 rounded-3xl overflow-hidden border-2 border-[#2D2926]/15 p-2 shadow-inner mb-3 flex items-center justify-center ${activeQr.image.includes('paytm') ? 'bg-white' : 'bg-[#0E0E0E]'}`}>
                  <img
                    src={activeQr.image}
                    alt={activeQr.title}
                    className="w-full h-full object-contain rounded-2xl"
                  />
                </div>
                <span className="text-xs font-mono font-bold text-[#2D2926]">{activeQr.bankName} • {activeQr.title}</span>
                <span className="text-[11px] font-mono text-[#8C827A] mt-0.5">{activeQr.accountHolder}</span>
                <div className="mt-1.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 text-xs font-mono text-[#5E5854]">
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
                {copiedVpa && <span className="text-[10px] text-emerald-700 font-bold mt-1">UPI ID Copied!</span>}
              </div>

              {/* UTR Submission Form */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#E05A7E] font-bold block mb-1">
                    ORDER #{confirmedOrder.orderNumber}
                  </span>
                  <h3 className="font-display font-bold text-xl text-[#2D2926]">
                    Transfer Exact Amount: {formattedTotal}
                  </h3>
                  <p className="text-xs text-[#5E5854] mt-1 leading-relaxed">
                    1. Open Google Pay, PhonePe, Paytm, or your UPI app.
                    <br />
                    2. Scan the QR code or transfer to UPI ID: <strong>{activeQr.vpa}</strong> ({activeQr.accountHolder}).
                    <br />
                    3. After payment, enter your 12-digit UPI Reference / UTR Number below.
                  </p>
                </div>

                <form onSubmit={handleSubmitUtr} className="space-y-3 pt-2 border-t border-[#2D2926]/10">
                  <div>
                    <label className="text-xs font-semibold text-[#2D2926] block mb-1">
                      UPI Reference / UTR Number (12 Digits) *
                    </label>
                    <input
                      type="text"
                      required
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value.replace(/[^A-Za-z0-9]/g, '').trim())}
                      placeholder="e.g. 402918273645"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#2D2926]/15 bg-[#FAF7F5] text-xs font-mono font-bold text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                    <span>
                      <strong>Manual Verification Notice:</strong> Orders paid via direct static QR are saved as <em>Awaiting Manual Verification</em>. Our roastery finance desk verifies the UTR against our bank statement before dispatch.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-full bg-[#2D2926] text-white font-display font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <RotateCcw className="h-4 w-4 animate-spin" />
                        <span>Submitting UTR Reference...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>Submit UTR for Roastery Verification</span>
                      </>
                    )}
                  </button>
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
                onClick={() => {
                  onClose();
                  navigate(`/track?order=${confirmedOrder.orderNumber}`);
                }}
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

      {/* Official Tax Invoice Print Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={confirmedOrder}
      />
    </div>
  );
};
