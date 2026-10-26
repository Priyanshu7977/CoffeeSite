import React, { useState, useEffect } from 'react';
import { X, Sparkles, Package, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sanitizeName, isValidEmail, isValidName, hasMaliciousContent, stripDangerousMarkup } from '../utils/validation';
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

  // Reset inputs whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setFullName('');
      setEmail('');
      setErrorMessage('');
      setIsSubmitted(false);
      setQuantity(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const defaultBatch: ReserveBatch = selectedBatch || {
    id: 'batch-01',
    name: 'BABA BUDAN OBSIDIAN',
    vintage: '2026 Monsoon Harvest',
    origin: 'Chikmagalur, Karnataka',
    region: 'Mullayanagiri Hills',
    altitude: '1,900m ASL',
    varietal: 'Wild Arabica',
    process: '96h Anaerobic Natural',
    notes: ['Cardamom', 'Dark Cacao', 'Jasmine'],
    allocationLeft: 14,
    totalAllocations: 85,
    roastLevel: 'Omniroast',
    price: '₹2,800',
    badge: '14 Tins Remaining',
    description: 'Single-estate sacred Baba Budan micro-lot with 96h anaerobic natural fermentation.',
  };

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
    const sanitized = sanitizeName(raw);
    setFullName(sanitized);
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

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F5DADF', '#E05A7E', '#2D2926', '#FFFFFF'],
      });
    } catch {
      // Ignored
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
        className="fixed inset-0 bg-[#2D2926]/60 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white border border-[#2D2926]/10 p-6 sm:p-9 shadow-2xl text-[#2D2926]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full border border-[#2D2926]/10 bg-[#FAF7F5] text-[#5E5854] hover:text-[#2D2926] transition-all cursor-pointer shadow-sm"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {isSubmitted ? (
          /* Confirmation State */
          <div className="flex flex-col items-center text-center py-6">
            <div className="h-14 w-14 rounded-full bg-[#FAF7F5] border border-[#2D2926]/15 flex items-center justify-center text-[#E05A7E] mb-4 shadow-sm">
              <Sparkles className="h-7 w-7 text-[#E05A7E]" />
            </div>

            <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#E05A7E] mb-1 font-bold">
              ALLOCATION CONFIRMED
            </span>

            <h3 className="font-display text-2xl sm:text-3xl text-[#2D2926] font-bold mb-2">
              Certificate Granted.
            </h3>

            <p className="font-sans text-xs sm:text-sm text-[#5E5854] max-w-sm font-normal mb-6">
              Your reservation for <strong>{quantity}x {defaultBatch.name}</strong> has been registered in our Chikmagalur cast-iron roasting ledger.
            </p>

            <div className="w-full rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 p-5 text-left mb-6 space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-[#2D2926]/10 pb-2">
                <span className="text-[#8C827A] uppercase font-bold text-[10px]">Certificate ID</span>
                <span className="font-mono font-bold text-[#2D2926]">{certificateId}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[#8C827A] block text-[10px] uppercase font-bold">Recipient</span>
                  <span className="text-[#2D2926] font-semibold">{fullName}</span>
                </div>
                <div>
                  <span className="text-[#8C827A] block text-[10px] uppercase font-bold">Grind</span>
                  <span className="text-[#E05A7E] capitalize font-bold">{grind}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-7 py-3 rounded-full bg-[#2D2926] text-white font-sans text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-md hover:bg-[#1F1C1A] cursor-pointer"
            >
              Return to Roastery
            </button>
          </div>
        ) : (
          /* Reservation Form */
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-1.5 text-xs font-sans tracking-[0.25em] uppercase text-[#E05A7E] mb-1 font-bold">
                <Package className="h-3.5 w-3.5 text-[#E05A7E]" />
                <span>PRIVATE ALLOCATION REQUEST</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-[#2D2926] font-bold">
                {defaultBatch.name}
              </h3>
              <span className="text-xs text-[#5E5854] font-sans">
                {defaultBatch.origin} • <strong className="text-[#E05A7E] font-bold">{defaultBatch.price}</strong>
              </span>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleOrder} autoComplete="off" className="space-y-5">
              {/* Grind Selector */}
              <div>
                <label className="text-xs font-sans tracking-wider uppercase text-[#8C827A] block mb-2 font-bold">
                  Grind Preference
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'whole', label: 'Whole Bean' },
                    { id: 'espresso', label: 'Espresso' },
                    { id: 'filter', label: 'Filter Kaapi' },
                    { id: 'coarse', label: 'Pour Over' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setGrind(item.id as 'whole' | 'espresso' | 'filter' | 'coarse')}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-sans font-bold tracking-wider transition-all cursor-pointer ${
                        grind === item.id
                          ? 'border-[#2D2926] bg-[#F5DADF] text-[#2D2926] shadow-sm'
                          : 'border-[#2D2926]/15 bg-[#FAF7F5] text-[#5E5854] hover:text-[#2D2926]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-xs font-sans tracking-wider uppercase text-[#8C827A] block mb-1 font-bold">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center rounded-xl border border-[#2D2926]/15 bg-[#FAF7F5] p-0.5">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-[#5E5854] hover:text-[#2D2926] font-mono font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 font-mono text-xs font-bold text-[#2D2926]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(4, quantity + 1))}
                      className="px-3 py-1.5 text-[#5E5854] hover:text-[#2D2926] font-mono font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-[#5E5854]">Limit: 4 tins per collector</span>
                </div>
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-sans tracking-wider uppercase text-[#8C827A] block mb-1 font-bold">
                    Collector Name
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    name="noir_reserve_name"
                    value={fullName}
                    onChange={handleNameChange}
                    placeholder="Devendra Roy"
                    className="w-full rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 px-3.5 py-2 text-xs text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-sans tracking-wider uppercase text-[#8C827A] block mb-1 font-bold">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    name="noir_reserve_email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="collector@noirroast.com"
                    className="w-full rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 px-3.5 py-2 text-xs text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none font-sans"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#2D2926] text-white font-sans text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-md hover:bg-[#1F1C1A] hover:scale-105 cursor-pointer"
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
