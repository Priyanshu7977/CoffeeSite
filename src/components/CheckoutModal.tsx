import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle2, ArrowRight, CreditCard, Award, Mail, ShieldAlert, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';
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
  hasMaliciousContent,
  stripDangerousMarkup,
} from '../utils/validation';
import { dispatchOrderConfirmationEmail, type AutomatedEmail } from '../utils/emailService';
import type { CollectionItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CollectionItem[];
  onOrderCompleted: () => void;
  onEmailDispatched: (email: AutomatedEmail) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderCompleted,
  onEmailDispatched,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'confirmed'>('details');

  // Customer state (clean empty strings without pre-fill)
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [country, setCountry] = useState<string>('');

  // Payment state
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvc, setCardCvc] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');

  // Completed order tracking
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string>('');
  const [latestEmail, setLatestEmail] = useState<AutomatedEmail | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Reset inputs when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setFullName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCity('');
      setPostalCode('');
      setCountry('');
      setCardNumber('');
      setCardExpiry('');
      setCardCvc('');
      setUpiId('');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate pricing in INR (₹)
  const subtotalNumeric = items.reduce((sum, item) => {
    const raw = parseFloat(item.product.price.replace(/[^0-9.]/g, '')) || 950;
    return sum + raw * item.quantity;
  }, 0);

  const shippingCost = 0; // Free direct estate shipping
  const totalNumeric = subtotalNumeric + shippingCost;
  const formattedTotal = `₹${totalNumeric.toLocaleString('en-IN')}`;
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw)) {
      setErrorMessage('Security Alert: Script tags and iframes are strictly prohibited.');
      return;
    }
    if (/[0-9]/.test(raw)) {
      setErrorMessage('Full Name accepts alphabetic letters only (no numbers allowed).');
    } else if (/[^A-Za-z\s]/.test(raw)) {
      setErrorMessage('Full Name accepts alphabetic letters only (no symbols allowed).');
    } else {
      setErrorMessage('');
    }
    setFullName(sanitizeName(raw));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw)) {
      setErrorMessage('Security Alert: HTML or script tags are not allowed.');
      return;
    }
    setErrorMessage('');
    setEmail(stripDangerousMarkup(raw).trim());
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw)) {
      setErrorMessage('Security Alert: HTML or script tags are not allowed.');
      return;
    }
    setErrorMessage('');
    setPhone(sanitizePhone(raw));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw)) {
      setErrorMessage('Security Alert: HTML or script tags are not allowed.');
      return;
    }
    setErrorMessage('');
    setAddress(sanitizeAddress(raw));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw)) {
      setErrorMessage('Security Alert: HTML or script tags are not allowed.');
      return;
    }
    setErrorMessage('');
    setCity(sanitizeCity(raw));
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw)) {
      setErrorMessage('Security Alert: HTML or script tags are not allowed.');
      return;
    }
    setErrorMessage('');
    setPostalCode(sanitizePostalCode(raw));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw)) {
      setErrorMessage('Security Alert: HTML or script tags are not allowed.');
      return;
    }
    setErrorMessage('');
    setCountry(sanitizeCountry(raw));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setCardExpiry(val);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 4));
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isValidName(fullName)) {
      setErrorMessage('Please enter a valid recipient name (alphabets only).');
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!isValidPhone(phone)) {
      setErrorMessage('Please enter a valid phone number.');
      return;
    }
    if (!address.trim() || address.trim().length < 5) {
      setErrorMessage('Please provide a complete delivery address.');
      return;
    }

    setStep('payment');
  };

  const handleExecuteSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (paymentMethod === 'card') {
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 15) {
        setErrorMessage('Please enter a valid 16-digit card number.');
        return;
      }
      if (cardExpiry.length < 5) {
        setErrorMessage('Please enter expiration in MM/YY format.');
        return;
      }
      if (cardCvc.length < 3) {
        setErrorMessage('Please enter a valid security code.');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        setErrorMessage('Please enter a valid UPI ID (e.g., name@okhdfcbank).');
        return;
      }
    }

    setStep('processing');

    setTimeout(() => {
      const orderNum = `NR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedOrderNumber(orderNum);

      const fullShipping = `${address}, ${city}, ${postalCode}, ${country}`;
      const dispatched = dispatchOrderConfirmationEmail(
        orderNum,
        fullName,
        email,
        items,
        formattedTotal,
        fullShipping
      );

      setLatestEmail(dispatched);
      onEmailDispatched(dispatched);
      setStep('confirmed');
      onOrderCompleted();

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#F5DADF', '#E05A7E', '#2D2926', '#FFFFFF'],
        });
      } catch {
        // Ignored
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#2D2926]/60 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-white border border-[#2D2926]/10 p-6 sm:p-8 shadow-2xl text-[#2D2926] max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#2D2926]/10 pb-4 mb-5">
          <h3 className="font-display text-sm tracking-[0.2em] font-bold text-[#2D2926] uppercase">
            HAUTE CHECKOUT
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2D2926]/10 bg-[#FAF7F5] text-[#5E5854] hover:text-[#2D2926] transition-all cursor-pointer shadow-sm"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step Tabs */}
        {step !== 'confirmed' && (
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div
              className={`rounded-2xl p-2.5 border text-xs font-sans font-bold flex items-center gap-2 ${
                step === 'details'
                  ? 'bg-[#F5DADF] border-[#2D2926]/20 text-[#2D2926] shadow-sm'
                  : 'bg-[#FAF7F5] border-[#2D2926]/10 text-[#8C827A]'
              }`}
            >
              <span className="h-5 w-5 rounded-full bg-white flex items-center justify-center text-[10px] font-mono font-bold">1</span>
              <span>Delivery Details</span>
            </div>

            <div
              className={`rounded-2xl p-2.5 border text-xs font-sans font-bold flex items-center gap-2 ${
                step === 'payment' || step === 'processing'
                  ? 'bg-[#F5DADF] border-[#2D2926]/20 text-[#2D2926] shadow-sm'
                  : 'bg-[#FAF7F5] border-[#2D2926]/10 text-[#8C827A]'
              }`}
            >
              <span className="h-5 w-5 rounded-full bg-white flex items-center justify-center text-[10px] font-mono font-bold">2</span>
              <span>Settlement</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 flex items-center gap-2 text-xs text-rose-700">
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: DELIVERY DETAILS */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} autoComplete="off" className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-sans text-[#8C827A] uppercase tracking-wider mb-1 font-bold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    name="noir_checkout_fullname"
                    value={fullName}
                    onChange={handleNameChange}
                    placeholder="Devendra Roy"
                    className="w-full rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 px-3.5 py-2 text-xs text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-sans text-[#8C827A] uppercase tracking-wider mb-1 font-bold">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      autoComplete="off"
                      name="noir_checkout_email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="devendra@example.com"
                      className="w-full rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 px-3.5 py-2 text-xs text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans text-[#8C827A] uppercase tracking-wider mb-1 font-bold">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      autoComplete="off"
                      name="noir_checkout_phone"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 px-3.5 py-2 text-xs text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans text-[#8C827A] uppercase tracking-wider mb-1 font-bold">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    name="noir_checkout_address"
                    value={address}
                    onChange={handleAddressChange}
                    placeholder="42 Lavelle Road, Indiranagar"
                    className="w-full rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 px-3.5 py-2 text-xs text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none font-sans"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-sans text-[#8C827A] uppercase tracking-wider mb-1 font-bold">City</label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      name="noir_checkout_city"
                      value={city}
                      onChange={handleCityChange}
                      placeholder="Bengaluru"
                      className="w-full rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 px-2.5 py-2 text-xs text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans text-[#8C827A] uppercase tracking-wider mb-1 font-bold">Postal Code</label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      name="noir_checkout_postal"
                      value={postalCode}
                      onChange={handlePostalCodeChange}
                      placeholder="560001"
                      className="w-full rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 px-2.5 py-2 text-xs text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans text-[#8C827A] uppercase tracking-wider mb-1 font-bold">Country</label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      name="noir_checkout_country"
                      value={country}
                      onChange={handleCountryChange}
                      placeholder="India"
                      className="w-full rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 px-2.5 py-2 text-xs text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Order Summary Preview */}
              <div className="rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 p-4 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-xs font-sans tracking-widest text-[#8C827A] uppercase block font-bold mb-2">
                    Order Summary ({totalItemCount} items)
                  </span>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {items.map((it) => (
                      <div key={`${it.product.id}-${it.grind}`} className="flex justify-between items-center text-xs pb-1.5 border-b border-[#2D2926]/10 last:border-b-0">
                        <div>
                          <span className="font-display text-[#2D2926] block font-bold truncate max-w-[140px]">{it.product.name}</span>
                          <span className="text-[10px] text-[#E05A7E] font-medium">{it.grind} • Qty: {it.quantity}</span>
                        </div>
                        <span className="font-display font-bold text-[#2D2926]">{it.product.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#2D2926]/10 space-y-1 text-xs">
                  <div className="flex justify-between text-[#5E5854]">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-[#2D2926]">₹{subtotalNumeric.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#5E5854]">
                    <span>Estate Dispatch:</span>
                    <span className="text-[#E05A7E] font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-[#2D2926] pt-1 border-t border-[#2D2926]/10">
                    <span>Total:</span>
                    <span className="font-display text-base text-[#2D2926] font-bold">{formattedTotal}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#2D2926] text-white font-sans text-xs font-bold tracking-[0.2em] uppercase transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:bg-[#1F1C1A] hover:scale-105"
              >
                <span>Continue to Settlement</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: PAYMENT */}
        {step === 'payment' && (
          <form onSubmit={handleExecuteSettlement} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`rounded-2xl p-4 border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'bg-[#F5DADF] border-[#2D2926]/20 text-[#2D2926] shadow-sm'
                    : 'bg-[#FAF7F5] border-[#2D2926]/10 text-[#5E5854]'
                }`}
              >
                <Smartphone className="h-5 w-5 mb-1.5 text-[#E05A7E]" />
                <span className="font-sans text-xs font-bold">UPI Payment</span>
                <span className="text-[10px] text-[#5E5854]">GPay / PhonePe / Paytm</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`rounded-2xl p-4 border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-[#F5DADF] border-[#2D2926]/20 text-[#2D2926] shadow-sm'
                    : 'bg-[#FAF7F5] border-[#2D2926]/10 text-[#5E5854]'
                }`}
              >
                <CreditCard className="h-5 w-5 mb-1.5 text-[#E05A7E]" />
                <span className="font-sans text-xs font-bold">Debit / Credit Card</span>
                <span className="text-[10px] text-[#5E5854]">Instant & Encrypted</span>
              </button>
            </div>

            {paymentMethod === 'upi' && (
              <div className="rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 p-4 space-y-2">
                <label className="block text-xs font-sans text-[#8C827A] uppercase tracking-wider mb-1 font-bold">
                  UPI ID (VPA)
                </label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@okhdfcbank"
                  className="w-full rounded-xl bg-white border border-[#2D2926]/15 px-3.5 py-2 text-xs text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none font-mono"
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 p-4 space-y-3">
                <div>
                  <label className="block text-xs font-sans text-[#8C827A] uppercase tracking-wider mb-1 font-bold">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4532 8849 2049 8894"
                    className="w-full rounded-xl bg-white border border-[#2D2926]/15 px-3.5 py-2 text-xs text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none font-mono tracking-wider"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans text-[#8C827A] uppercase tracking-wider mb-1 font-bold">Expiration</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full rounded-xl bg-white border border-[#2D2926]/15 px-3.5 py-2 text-xs text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans text-[#8C827A] uppercase tracking-wider mb-1 font-bold">CVC</label>
                    <input
                      type="password"
                      required
                      value={cardCvc}
                      onChange={handleCvcChange}
                      placeholder="•••"
                      className="w-full rounded-xl bg-white border border-[#2D2926]/15 px-3.5 py-2 text-xs text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-xs text-[#5E5854] hover:text-[#2D2926] transition-colors cursor-pointer font-medium"
              >
                ← Back
              </button>

              <button
                type="submit"
                className="px-7 py-3 rounded-full bg-[#2D2926] text-white font-sans text-xs font-bold tracking-[0.2em] uppercase transition-all cursor-pointer flex items-center gap-2 shadow-md hover:bg-[#1F1C1A] hover:scale-105"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Pay {formattedTotal}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: PROCESSING */}
        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="h-14 w-14 rounded-full border border-[#2D2926]/20 bg-[#FAF7F5] flex items-center justify-center shadow-sm animate-pulse">
              <Award className="h-7 w-7 text-[#E05A7E] animate-spin-slow" />
            </div>
            <h4 className="font-display text-2xl text-[#2D2926] font-bold">
              Authorizing Settlement...
            </h4>
            <p className="font-sans text-xs text-[#5E5854] max-w-sm">
              Registering your single-estate lot in our Chikmagalur ledger.
            </p>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMED */}
        {step === 'confirmed' && (
          <div className="py-6 text-center space-y-4">
            <div className="h-12 w-12 mx-auto rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center text-[#E05A7E] shadow-sm">
              <CheckCircle2 className="h-6 w-6 text-[#E05A7E]" />
            </div>

            <div>
              <h3 className="font-display text-2xl sm:text-3xl text-[#2D2926] font-bold">
                Order Confirmed!
              </h3>
              <p className="font-sans text-xs text-[#5E5854] mt-1 max-w-md mx-auto">
                Invoice <strong>#{confirmedOrderNumber}</strong>. A confirmation email has been dispatched to {email}.
              </p>
            </div>

            {latestEmail && (
              <div className="rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 p-3.5 text-left space-y-1.5 text-xs text-[#5E5854]">
                <div className="flex items-center gap-1.5 text-[#2D2926] font-bold">
                  <Mail className="h-3.5 w-3.5 text-[#E05A7E]" />
                  <span>Confirmation Dispatched</span>
                </div>
                <p>Sent to: <strong className="text-[#2D2926]">{latestEmail.to}</strong></p>
              </div>
            )}

            <button
              onClick={onClose}
              className="px-7 py-3 rounded-full bg-[#2D2926] text-white font-sans text-xs font-bold tracking-[0.2em] uppercase transition-all cursor-pointer shadow-md hover:bg-[#1F1C1A]"
            >
              Continue Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
