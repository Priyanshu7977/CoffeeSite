import React, { useState } from 'react';
import { X, Shield, Lock, Sparkles, CheckCircle2, ArrowRight, CreditCard, Award, Mail, ShieldAlert } from 'lucide-react';
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

  // Customer state
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [country, setCountry] = useState<string>('United States');

  // Payment state
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvc, setCardCvc] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'vault' | 'applepay'>('card');

  // Completed order tracking
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string>('');
  const [latestEmail, setLatestEmail] = useState<AutomatedEmail | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  // Calculate pricing
  const subtotalNumeric = items.reduce((sum, item) => {
    const raw = parseFloat(item.product.price.replace(/[^0-9.]/g, '')) || 45;
    return sum + raw * item.quantity;
  }, 0);

  const shippingCost = subtotalNumeric >= 75 ? 0 : 15;
  const totalNumeric = subtotalNumeric + shippingCost;
  const formattedTotal = `$${totalNumeric.toFixed(2)}`;
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw)) {
      setErrorMessage('Security Alert: Scripts, iframes, and HTML markup are strictly prohibited.');
    } else {
      setErrorMessage('');
    }
    const sanitized = sanitizeName(raw);
    setFullName(sanitized);
    if (raw !== sanitized && !hasMaliciousContent(raw)) {
      setErrorMessage('Name field strictly accepts alphabetic characters only (no numbers).');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw)) {
      setErrorMessage('Security Alert: Scripts, iframes, and HTML markup are strictly prohibited.');
    } else {
      setErrorMessage('');
    }
    const sanitized = sanitizePhone(raw);
    setPhone(sanitized);
    if (raw !== sanitized && !hasMaliciousContent(raw)) {
      setErrorMessage('Phone field strictly accepts numeric digits only (no alphabetic characters).');
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw)) {
      setErrorMessage('Security Alert: Scripts, iframes, and HTML markup are strictly blocked.');
    } else {
      setErrorMessage('');
    }
    setAddress(sanitizeAddress(raw));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw)) {
      setErrorMessage('Security Alert: Scripts, iframes, and HTML markup are strictly blocked.');
    } else {
      setErrorMessage('');
    }
    const sanitized = sanitizeCity(raw);
    setCity(sanitized);
    if (raw !== sanitized && !hasMaliciousContent(raw)) {
      setErrorMessage('City field accepts alphabetic characters only (no numbers).');
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw)) {
      setErrorMessage('Security Alert: Scripts, iframes, and HTML markup are strictly blocked.');
    } else {
      setErrorMessage('');
    }
    const sanitized = sanitizeCountry(raw);
    setCountry(sanitized);
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw)) {
      setErrorMessage('Security Alert: Scripts, iframes, and HTML markup are strictly blocked.');
    } else {
      setErrorMessage('');
    }
    setPostalCode(sanitizePostalCode(raw));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      setCardExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    } else {
      setCardExpiry(digits);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvc(digits);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isValidName(fullName)) {
      setErrorMessage('Please enter a valid full name (alphabets only).');
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address for dispatch automation.');
      return;
    }
    if (!isValidPhone(phone)) {
      setErrorMessage('Please enter a valid phone number (numeric digits only).');
      return;
    }
    if (!address.trim() || !city.trim() || !postalCode.trim() || !country.trim()) {
      setErrorMessage('Please fill in complete street address, city, and postal code.');
      return;
    }

    setStep('payment');
  };

  const handleExecuteSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (cleanCard.length < 15) {
        setErrorMessage('Please enter a valid 15 or 16-digit card number.');
        return;
      }
      if (cardExpiry.length < 5) {
        setErrorMessage('Please enter a valid expiration MM/YY.');
        return;
      }
      if (cardCvc.length < 3) {
        setErrorMessage('Please enter a valid 3 or 4-digit CVC security code.');
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
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#c89658', '#e5b877', '#f4eee6', '#8b5a2b'],
        });
      } catch {
        // Confetti fallback
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#070605]/85 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog Box */}
      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-[#0e0b08] border border-[#c89658]/40 p-5 sm:p-8 shadow-[0_25px_90px_rgba(0,0,0,0.95)] text-[#f4eee6] max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#241c15] pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#c89658] shadow-[0_0_8px_#c89658]" />
            <h3 className="font-display text-sm tracking-[0.25em] font-bold text-[#f4eee6] uppercase">
              HAUTE ATELIER CHECKOUT
            </h3>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2b221a] bg-[#14100c] text-[#8c827a] hover:border-[#c89658] hover:text-[#f4eee6] transition-all cursor-pointer"
            aria-label="Close Checkout"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step Progression Tabs */}
        {step !== 'confirmed' && (
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div
              className={`rounded-2xl p-2.5 border text-xs font-sans font-semibold flex items-center gap-2 ${
                step === 'details'
                  ? 'bg-[#18120d] border-[#c89658] text-[#e5b877]'
                  : 'bg-[#120e0b] border-[#261f19] text-[#8c827a]'
              }`}
            >
              <span className="h-5 w-5 rounded-full bg-[#c89658]/20 flex items-center justify-center text-[10px] font-mono text-[#c89658]">1</span>
              <span>Atelier Shipping</span>
            </div>

            <div
              className={`rounded-2xl p-2.5 border text-xs font-sans font-semibold flex items-center gap-2 ${
                step === 'payment' || step === 'processing'
                  ? 'bg-[#18120d] border-[#c89658] text-[#e5b877]'
                  : 'bg-[#120e0b] border-[#261f19] text-[#8c827a]'
              }`}
            >
              <span className="h-5 w-5 rounded-full bg-[#c89658]/20 flex items-center justify-center text-[10px] font-mono text-[#c89658]">2</span>
              <span>Vault Settlement</span>
            </div>
          </div>
        )}

        {/* Error Notification / Security Warning */}
        {errorMessage && (
          <div className="mb-4 rounded-xl bg-amber-950/40 border border-amber-500/40 p-3 flex items-center gap-2 text-xs text-amber-200">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ================= STEP 1: SHIPPING & CONTACT DETAILS ================= */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left: Sanitized & Validated Input fields */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-sans tracking-widest text-[#c89658] uppercase mb-1 font-semibold">
                    Full Name (Alphabets Only)
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={handleNameChange}
                    placeholder="Henri de Noir"
                    className="w-full rounded-xl bg-[#140f0c] border border-[#2b2118] px-3.5 py-2 text-xs text-[#f4eee6] placeholder-[#5c5044] focus:border-[#c89658] focus:shadow-[0_0_15px_rgba(200,150,88,0.25)] focus:outline-none font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-sans tracking-widest text-[#c89658] uppercase mb-1 font-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="collector@atelier.com"
                      className="w-full rounded-xl bg-[#140f0c] border border-[#2b2118] px-3.5 py-2 text-xs text-[#f4eee6] placeholder-[#5c5044] focus:border-[#c89658] focus:outline-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans tracking-widest text-[#c89658] uppercase mb-1 font-semibold">
                      Phone (Numbers Only)
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="+1 (555) 019-2834"
                      className="w-full rounded-xl bg-[#140f0c] border border-[#2b2118] px-3.5 py-2 text-xs text-[#f4eee6] placeholder-[#5c5044] focus:border-[#c89658] focus:outline-none font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-sans tracking-widest text-[#c89658] uppercase mb-1 font-semibold">
                    Atelier Street Address (Sanitized)
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={handleAddressChange}
                    placeholder="442 Madison Ave, Suite 12B"
                    className="w-full rounded-xl bg-[#140f0c] border border-[#2b2118] px-3.5 py-2 text-xs text-[#f4eee6] placeholder-[#5c5044] focus:border-[#c89658] focus:outline-none font-sans"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-sans tracking-widest text-[#c89658] uppercase mb-1 font-semibold">
                      City (Letters)
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={handleCityChange}
                      placeholder="Kyoto"
                      className="w-full rounded-xl bg-[#140f0c] border border-[#2b2118] px-3 py-2 text-xs text-[#f4eee6] placeholder-[#5c5044] focus:border-[#c89658] focus:outline-none font-sans"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-sans tracking-widest text-[#c89658] uppercase mb-1 font-semibold">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={handlePostalCodeChange}
                      placeholder="10022"
                      className="w-full rounded-xl bg-[#140f0c] border border-[#2b2118] px-3 py-2 text-xs text-[#f4eee6] placeholder-[#5c5044] focus:border-[#c89658] focus:outline-none font-sans"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-sans tracking-widest text-[#c89658] uppercase mb-1 font-semibold">
                      Country (Letters)
                    </label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={handleCountryChange}
                      placeholder="USA"
                      className="w-full rounded-xl bg-[#140f0c] border border-[#2b2118] px-3 py-2 text-xs text-[#f4eee6] placeholder-[#5c5044] focus:border-[#c89658] focus:outline-none font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Order Summary Preview */}
              <div className="rounded-2xl bg-[#120e0b] border border-[#261f18] p-4 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#c89658] uppercase block font-bold mb-2">
                    ALLOCATION SUMMARY ({totalItemCount} TINS)
                  </span>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {items.map((it) => (
                      <div key={`${it.product.id}-${it.grind}`} className="flex justify-between items-center text-xs pb-1.5 border-b border-[#211a14] last:border-b-0">
                        <div>
                          <span className="font-serif font-bold text-[#f4eee6] block truncate max-w-[140px]">{it.product.name}</span>
                          <span className="text-[10px] text-[#8c827a]">{it.grind} • Qty: {it.quantity}</span>
                        </div>
                        <span className="font-mono font-bold text-[#e5b877]">{it.product.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#261f18] space-y-1 text-xs">
                  <div className="flex justify-between text-[#8c827a]">
                    <span>Subtotal:</span>
                    <span className="font-mono text-[#f4eee6]">${subtotalNumeric.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#8c827a]">
                    <span>White-Glove Courier:</span>
                    <span className="font-mono text-[#e5b877]">{shippingCost === 0 ? 'COMPLIMENTARY' : '$15.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#f4eee6] pt-1 border-t border-[#261f18]">
                    <span>Total Settlement:</span>
                    <span className="font-mono text-base text-[#e5b877]">{formattedTotal}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-[#c89658] to-[#e5b877] text-[#070605] font-sans text-xs font-bold tracking-[0.2em] uppercase hover:shadow-[0_0_25px_rgba(200,150,88,0.45)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue to Settlement</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 2: PAYMENT & SETTLEMENT ================= */}
        {step === 'payment' && (
          <form onSubmit={handleExecuteSettlement} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`rounded-2xl p-3.5 border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-[#18120d] border-[#c89658] shadow-[0_0_15px_rgba(200,150,88,0.2)]'
                    : 'bg-[#120e0b] border-[#261f19] text-[#8c827a]'
                }`}
              >
                <CreditCard className="h-5 w-5 text-[#c89658] mb-1.5" />
                <span className="font-mono text-xs font-bold text-[#f4eee6]">Credit Card</span>
                <span className="text-[10px] text-[#8c827a]">Encrypted Vault</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('applepay')}
                className={`rounded-2xl p-3.5 border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  paymentMethod === 'applepay'
                    ? 'bg-[#18120d] border-[#c89658] shadow-[0_0_15px_rgba(200,150,88,0.2)]'
                    : 'bg-[#120e0b] border-[#261f19] text-[#8c827a]'
                }`}
              >
                <Sparkles className="h-5 w-5 text-[#e5b877] mb-1.5" />
                <span className="font-mono text-xs font-bold text-[#f4eee6]">Apple Pay</span>
                <span className="text-[10px] text-[#8c827a]">Biometric Token</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('vault')}
                className={`rounded-2xl p-3.5 border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  paymentMethod === 'vault'
                    ? 'bg-[#18120d] border-[#c89658] shadow-[0_0_15px_rgba(200,150,88,0.2)]'
                    : 'bg-[#120e0b] border-[#261f19] text-[#8c827a]'
                }`}
              >
                <Shield className="h-5 w-5 text-[#c89658] mb-1.5" />
                <span className="font-mono text-xs font-bold text-[#f4eee6]">Vault Direct</span>
                <span className="text-[10px] text-[#8c827a]">Member Allocation</span>
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="rounded-2xl bg-[#120e0b] border border-[#2b2118] p-4 space-y-3.5">
                <div>
                  <label className="block text-[10px] font-sans tracking-widest text-[#c89658] uppercase mb-1 font-semibold">
                    Card Number (16-Digits)
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4532 8849 2049 8894"
                    className="w-full rounded-xl bg-[#18120d] border border-[#33281e] px-3.5 py-2 text-xs text-[#f4eee6] placeholder-[#5c5044] focus:border-[#c89658] focus:outline-none font-mono tracking-wider"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-sans tracking-widest text-[#c89658] uppercase mb-1 font-semibold">
                      Expiration (MM/YY)
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="08/28"
                      className="w-full rounded-xl bg-[#18120d] border border-[#33281e] px-3.5 py-2 text-xs text-[#f4eee6] placeholder-[#5c5044] focus:border-[#c89658] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans tracking-widest text-[#c89658] uppercase mb-1 font-semibold">
                      Security Code (CVC)
                    </label>
                    <input
                      type="password"
                      required
                      value={cardCvc}
                      onChange={handleCvcChange}
                      placeholder="894"
                      className="w-full rounded-xl bg-[#18120d] border border-[#33281e] px-3.5 py-2 text-xs text-[#f4eee6] placeholder-[#5c5044] focus:border-[#c89658] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-xs text-[#8c827a] hover:text-[#f4eee6] transition-colors cursor-pointer"
              >
                ← Back to Shipping
              </button>

              <button
                type="submit"
                className="px-7 py-3 rounded-full bg-gradient-to-r from-[#c89658] to-[#e5b877] text-[#070605] font-sans text-xs font-bold tracking-[0.2em] uppercase hover:shadow-[0_0_25px_rgba(200,150,88,0.45)] transition-all cursor-pointer flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                <span>Authorize {formattedTotal}</span>
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 3: PROCESSING STATE ANIMATION ================= */}
        {step === 'processing' && (
          <div className="py-14 flex flex-col items-center justify-center text-center space-y-3">
            <div className="h-16 w-16 rounded-full border border-[#c89658] bg-[#140f0c] flex items-center justify-center shadow-[0_0_30px_rgba(200,150,88,0.3)] animate-pulse">
              <Award className="h-8 w-8 text-[#c89658] animate-spin-slow" />
            </div>
            <h4 className="font-serif text-2xl sm:text-3xl text-[#f4eee6]">
              Allocating Batch Lots...
            </h4>
            <p className="font-sans text-xs text-[#a89d93] max-w-sm leading-relaxed">
              Applying hand-stamped master roaster wax seal and preparing automated dispatch notification.
            </p>
          </div>
        )}

        {/* ================= STEP 4: ORDER CONFIRMED & EMAIL DISPATCH ================= */}
        {step === 'confirmed' && (
          <div className="py-6 text-center space-y-5">
            <div className="h-14 w-14 mx-auto rounded-full bg-[#18120d] border border-[#c89658] flex items-center justify-center text-[#c89658] shadow-[0_0_25px_rgba(200,150,88,0.35)]">
              <CheckCircle2 className="h-7 w-7 text-[#e5b877]" />
            </div>

            <div>
              <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#c89658] block mb-1">
                HAUTE ALLOCATION SECURED
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#f4eee6]">
                Order Confirmed.
              </h3>
              <p className="font-sans text-xs text-[#a89d93] mt-1 max-w-md mx-auto leading-relaxed">
                Your private lot has been reserved under invoice <strong>#{confirmedOrderNumber}</strong>. An automated confirmation dispatch has been transmitted to your email.
              </p>
            </div>

            {/* Email Dispatch Automation Card */}
            {latestEmail && (
              <div className="rounded-2xl bg-[#120e0b] border border-[#c89658]/40 p-3.5 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#c89658]" />
                    <span className="font-mono text-xs font-bold text-[#e5b877]">
                      AUTOMATED EMAIL DISPATCHED
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    STATUS: DELIVERED
                  </span>
                </div>
                <p className="text-xs text-[#cfc5ba]">
                  Sent to: <strong className="text-[#f4eee6]">{latestEmail.to}</strong>
                </p>
                <p className="text-[11px] text-[#8c827a] truncate">
                  Subject: {latestEmail.subject}
                </p>
              </div>
            )}

            <button
              onClick={onClose}
              className="px-7 py-3 rounded-full bg-[#c89658] text-[#070605] font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#e5b877] transition-all cursor-pointer shadow-[0_0_20px_rgba(200,150,88,0.35)]"
            >
              Close & Return to Atelier
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
