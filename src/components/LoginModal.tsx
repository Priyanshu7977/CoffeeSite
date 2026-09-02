import React, { useState } from 'react';
import { X, Lock, Sparkles, Shield, User, Mail, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { sanitizeName, sanitizePhone, isValidEmail, isValidName, isValidPhone } from '../utils/validation';
import { dispatchVIPWelcomeEmail, type AutomatedEmail } from '../utils/emailService';

export interface UserSession {
  name: string;
  email: string;
  phone: string;
  memberId: string;
  isLoggedIn: boolean;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserSession) => void;
  onEmailDispatched: (email: AutomatedEmail) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onEmailDispatched,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const sanitized = sanitizeName(raw);
    setFullName(sanitized);
    if (raw !== sanitized) {
      setErrorMessage('Name field strictly accepts alphabetic characters only (no numbers).');
    } else {
      setErrorMessage('');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const sanitized = sanitizePhone(raw);
    setPhone(sanitized);
    if (raw !== sanitized) {
      setErrorMessage('Phone field strictly accepts numeric digits only (no alphabets).');
    } else {
      setErrorMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isRegisterMode) {
      if (!isValidName(fullName)) {
        setErrorMessage('Please provide a valid name containing only alphabets (min 2 letters).');
        return;
      }
      if (!isValidEmail(email)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (!isValidPhone(phone)) {
        setErrorMessage('Please enter a valid phone number (numeric digits only).');
        return;
      }
      if (password.length < 4) {
        setErrorMessage('Password or PIN must be at least 4 characters.');
        return;
      }

      setIsProcessing(true);
      setTimeout(() => {
        const memberId = `NR-VAULT-${Math.floor(1000 + Math.random() * 9000)}`;
        const userSession: UserSession = {
          name: fullName,
          email,
          phone,
          memberId,
          isLoggedIn: true,
        };

        // Dispatch automated VIP welcome email
        const dispatched = dispatchVIPWelcomeEmail(fullName, email, memberId, phone);
        onEmailDispatched(dispatched);
        onLoginSuccess(userSession);
        setIsProcessing(false);
        onClose();
      }, 900);
    } else {
      // Login mode
      if (!isValidEmail(email)) {
        setErrorMessage('Please enter a valid registered email address.');
        return;
      }
      if (password.length < 4) {
        setErrorMessage('Please enter your valid password or PIN.');
        return;
      }

      setIsProcessing(true);
      setTimeout(() => {
        const derivedName = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Henri Member';
        const userSession: UserSession = {
          name: derivedName.toUpperCase(),
          email,
          phone: '+1 (555) 019-2834',
          memberId: 'NR-VAULT-7729',
          isLoggedIn: true,
        };
        onLoginSuccess(userSession);
        setIsProcessing(false);
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#070605]/85 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-[#0e0b08] border border-[#c89658]/40 p-6 sm:p-9 shadow-[0_25px_90px_rgba(0,0,0,0.95)] text-[#f4eee6]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-[#2b221a] bg-[#14100c] text-[#8c827a] hover:border-[#c89658] hover:text-[#f4eee6] transition-all cursor-pointer"
          aria-label="Close Login Modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Eyebrow & Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#18120d] border border-[#c89658]/35 mb-3 shadow-[0_0_15px_rgba(200,150,88,0.2)]">
            <Sparkles className="h-3 w-3 text-[#c89658]" />
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#e5b877] font-semibold">
              MAISON NOIR PRIVATE VAULT
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-[#f4eee6] font-light">
            {isRegisterMode ? 'Request Vault Membership' : 'VIP Allocation Sign In'}
          </h3>
          <p className="font-sans text-xs text-[#a89d93] mt-1 max-w-xs mx-auto">
            {isRegisterMode
              ? 'Join our private registry to reserve numbered 12kg single-ridge roasts.'
              : 'Authenticate your cellar access for Kyoto & Zurich reserve allocations.'}
          </p>
        </div>

        {/* Mode Toggle Switch */}
        <div className="flex rounded-2xl bg-[#140f0c] p-1 border border-[#241c15] mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-sans font-semibold tracking-wider transition-all cursor-pointer ${
              !isRegisterMode
                ? 'bg-[#c89658] text-[#070605] shadow-[0_0_12px_rgba(200,150,88,0.3)]'
                : 'text-[#8c827a] hover:text-[#f4eee6]'
            }`}
          >
            VIP Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-sans font-semibold tracking-wider transition-all cursor-pointer ${
              isRegisterMode
                ? 'bg-[#c89658] text-[#070605] shadow-[0_0_12px_rgba(200,150,88,0.3)]'
                : 'text-[#8c827a] hover:text-[#f4eee6]'
            }`}
          >
            New Allocation Access
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 rounded-xl bg-amber-950/40 border border-amber-500/40 p-3 flex items-center gap-2 text-xs text-amber-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-[10px] font-sans tracking-widest text-[#c89658] uppercase mb-1.5 font-semibold">
                Full Name (Alphabets Only)
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-[#8c827a]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={handleNameChange}
                  placeholder="e.g. Henri de Noir"
                  className="w-full rounded-xl bg-[#140f0c] border border-[#2e2319] pl-10 pr-4 py-3 text-xs text-[#f4eee6] placeholder-[#5c5044] focus:border-[#c89658] focus:shadow-[0_0_15px_rgba(200,150,88,0.25)] focus:outline-none font-sans"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-sans tracking-widest text-[#c89658] uppercase mb-1.5 font-semibold">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-[#8c827a]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collector@atelier.com"
                className="w-full rounded-xl bg-[#140f0c] border border-[#2e2319] pl-10 pr-4 py-3 text-xs text-[#f4eee6] placeholder-[#5c5044] focus:border-[#c89658] focus:shadow-[0_0_15px_rgba(200,150,88,0.25)] focus:outline-none font-sans"
              />
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-[10px] font-sans tracking-widest text-[#c89658] uppercase mb-1.5 font-semibold">
                Phone Number (Numbers Only)
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3.5 h-4 w-4 text-[#8c827a]" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="e.g. +1 555 019 2834"
                  className="w-full rounded-xl bg-[#140f0c] border border-[#2e2319] pl-10 pr-4 py-3 text-xs text-[#f4eee6] placeholder-[#5c5044] focus:border-[#c89658] focus:shadow-[0_0_15px_rgba(200,150,88,0.25)] focus:outline-none font-sans"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-sans tracking-widest text-[#c89658] uppercase mb-1.5 font-semibold">
              {isRegisterMode ? 'Create Vault Password / PIN' : 'Vault Passcode / PIN'}
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-[#8c827a]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-[#140f0c] border border-[#2e2319] pl-10 pr-4 py-3 text-xs text-[#f4eee6] placeholder-[#5c5044] focus:border-[#c89658] focus:shadow-[0_0_15px_rgba(200,150,88,0.25)] focus:outline-none font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c89658] to-[#e5b877] text-[#070605] font-sans text-xs font-bold tracking-[0.2em] uppercase hover:shadow-[0_0_25px_rgba(200,150,88,0.45)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="animate-pulse">Authenticating Vault Key...</span>
            ) : (
              <>
                <span>{isRegisterMode ? 'Complete Vault Registration' : 'Enter Private Cellar'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Trust Footnote */}
        <div className="mt-6 pt-4 border-t border-[#221c17] flex items-center justify-between text-[10px] font-mono text-[#8c827a]">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-[#c89658]" />
            <span>256-Bit Vault Protocol</span>
          </div>
          <span>Kyoto Atelier No. 04</span>
        </div>
      </div>
    </div>
  );
};
