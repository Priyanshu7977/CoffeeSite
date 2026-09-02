import React, { useState } from 'react';
import { X, Sparkles, Package, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sanitizeName, isValidEmail, isValidName } from '../utils/validation';
import type { ReserveBatch } from '../types';

interface ReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBatch: ReserveBatch | null;
}

export const ReserveModal: React.FC<ReserveModalProps> = ({
  isOpen,
  onClose,
  selectedBatch,
}) => {
  const [grind, setGrind] = useState<'whole' | 'espresso' | 'filter' | 'coarse'>('whole');
  const [quantity, setQuantity] = useState<number>(1);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [certificateId, setCertificateId] = useState<string>('');

  if (!isOpen) return null;

  const defaultBatch: ReserveBatch = selectedBatch || {
    id: 'batch-01',
    name: 'OBSIDIAN GEISHA 2,400M',
    vintage: '2026 Reserve Allocation',
    origin: 'Ethiopia / Gesha Village',
    region: 'Bench Maji',
    altitude: '2,400m ASL',
    varietal: 'Wild 1931 Gesha',
    process: '96h Anaerobic Natural',
    notes: ['Bergamot', '85% Cacao', 'Jasmine', 'Black Fig'],
    allocationLeft: 14,
    totalAllocations: 85,
    roastLevel: 'Omniroast',
    price: '$48.00',
    badge: 'Strictly Limited',
    description: 'Ultra-rare micro-lot from the high volcanic soils of Gesha Village.',
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const sanitized = sanitizeName(raw);
    setFullName(sanitized);
    if (raw !== sanitized) {
      setErrorMessage('Name field accepts alphabetic letters only (no numbers).');
    } else {
      setErrorMessage('');
    }
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isValidName(fullName)) {
      setErrorMessage('Please enter a valid name (alphabets only).');
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const cert = `NR-${Math.floor(1000 + Math.random() * 9000)}-${defaultBatch.id.toUpperCase()}`;
    setCertificateId(cert);
    setIsSubmitted(true);

    // Trigger celebratory gold confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c89658', '#e5b877', '#f4eee6', '#8b5a2b'],
      });
    } catch {
      // Confetti fallback
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-[#070605]/85 backdrop-blur-xl transition-opacity duration-300"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-xl rounded-3xl bg-[#0f0c09] border border-[#c89658]/40 p-6 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-[#f4eee6]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 flex h-9 w-9 items-center justify-center rounded-full border border-[#2b221a] bg-[#14100c] text-[#8c827a] hover:border-[#c89658] hover:text-[#f4eee6] transition-all cursor-pointer"
          aria-label="Close Allocation Modal"
        >
          <X className="h-4 w-4" />
        </button>

        {isSubmitted ? (
          /* Confirmation State */
          <div className="flex flex-col items-center text-center py-6">
            <div className="h-16 w-16 rounded-full bg-[#c89658]/20 border border-[#c89658] flex items-center justify-center text-[#c89658] mb-6 shadow-[0_0_30px_rgba(200,150,88,0.3)]">
              <Sparkles className="h-8 w-8 text-[#c89658] animate-spin-slow" />
            </div>

            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#c89658] mb-2">
              Allocation Secured
            </span>

            <h3 className="font-serif text-3xl sm:text-4xl text-[#f4eee6] font-normal mb-3">
              Certificate Granted.
            </h3>

            <p className="font-sans text-xs sm:text-sm text-[#b0a59b] max-w-md font-light mb-8">
              Your allocation for <strong>{quantity}x {defaultBatch.name}</strong> has been registered directly to the Master Roaster's queue.
            </p>

            {/* Official Certificate Card */}
            <div className="w-full rounded-2xl bg-[#080605] border border-[#c89658]/30 p-6 text-left mb-8 space-y-3">
              <div className="flex justify-between items-center border-b border-[#221c17] pb-3">
                <span className="text-[10px] font-sans tracking-[0.2em] text-[#8c827a] uppercase">
                  Official Allocation Certificate
                </span>
                <span className="font-mono text-xs font-bold text-[#e5b877]">
                  {certificateId}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#8c827a] block text-[10px] uppercase">Recipient</span>
                  <span className="text-[#f4eee6] font-medium">{fullName}</span>
                </div>
                <div>
                  <span className="text-[#8c827a] block text-[10px] uppercase">Grind Spec</span>
                  <span className="text-[#e5b877] capitalize">{grind}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-8 py-3.5 rounded-xl bg-[#c89658] text-[#070605] font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#e5b877] transition-all cursor-pointer shadow-[0_0_20px_rgba(200,150,88,0.3)]"
            >
              Return to Roastery
            </button>
          </div>
        ) : (
          /* Reservation Form */
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-[10px] font-sans tracking-[0.3em] uppercase text-[#c89658] mb-1">
                <Package className="h-3.5 w-3.5" />
                <span>Reserve Allocation Request</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#f4eee6]">
                {defaultBatch.name}
              </h3>
              <span className="text-xs text-[#8c827a] font-sans">
                {defaultBatch.origin} • {defaultBatch.altitude} • {defaultBatch.price}
              </span>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-xl bg-amber-950/40 border border-amber-500/40 p-3 flex items-center gap-2 text-xs text-amber-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleOrder} className="space-y-6">
              {/* Grind Selector */}
              <div>
                <label className="text-[11px] font-sans tracking-[0.2em] uppercase text-[#8c827a] block mb-2">
                  Grind Specification
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'whole', label: 'Whole Bean' },
                    { id: 'espresso', label: 'Espresso' },
                    { id: 'filter', label: 'Chemex' },
                    { id: 'coarse', label: 'French Press' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setGrind(item.id as 'whole' | 'espresso' | 'filter' | 'coarse')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-sans tracking-wider border transition-all cursor-pointer ${
                        grind === item.id
                          ? 'bg-[#c89658] border-[#c89658] text-[#070605] font-bold shadow-md'
                          : 'bg-[#14100c] border-[#221c17] text-[#a89d93] hover:border-[#c89658]/40'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="text-[11px] font-sans tracking-[0.2em] uppercase text-[#8c827a] block mb-2">
                  Numbered Tin Quantity (250g each)
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-xl border border-[#261f19] bg-[#14100c]">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-[#8c827a] hover:text-[#f4eee6] font-mono cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-mono text-sm font-bold text-[#f4eee6]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(4, quantity + 1))}
                      className="px-4 py-2 text-[#8c827a] hover:text-[#f4eee6] font-mono cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-[#8c827a] font-sans">
                    Limit: 4 tins per allocation
                  </span>
                </div>
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-sans tracking-[0.2em] uppercase text-[#8c827a] block mb-1.5">
                    Your Name (Alphabets Only)
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={handleNameChange}
                    placeholder="Henri de Noir"
                    className="w-full rounded-xl bg-[#14100c] border border-[#261f19] px-4 py-2.5 text-xs text-[#f4eee6] placeholder-[#4f463e] focus:border-[#c89658] focus:outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-sans tracking-[0.2em] uppercase text-[#8c827a] block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="collector@noirroast.com"
                    className="w-full rounded-xl bg-[#14100c] border border-[#261f19] px-4 py-2.5 text-xs text-[#f4eee6] placeholder-[#4f463e] focus:border-[#c89658] focus:outline-none font-sans"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#c89658] text-[#070605] font-sans text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#e5b877] hover:shadow-[0_0_25px_rgba(200,150,88,0.4)] cursor-pointer"
              >
                Confirm Allocation Request
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
