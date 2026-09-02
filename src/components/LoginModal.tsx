import React, { useState, useEffect } from 'react';
import { X, Lock, Sparkles, User, Mail, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { sanitizeName, sanitizePhone, isValidEmail, isValidName, isValidPhone, hasMaliciousContent, stripDangerousMarkup } from '../utils/validation';
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

  // Always reset fields when modal opens to prevent unwanted browser pre-fill
  useEffect(() => {
    if (isOpen) {
      setFullName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setErrorMessage('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
      setErrorMessage('Security Alert: HTML or script tags are not allowed in email.');
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
    const sanitized = sanitizePhone(raw);
    setPhone(sanitized);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw)) {
      setErrorMessage('Security Alert: HTML or script tags are not allowed.');
      return;
    }
    setErrorMessage('');
    setPassword(stripDangerousMarkup(raw));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Strict Malicious Input Check
    if (hasMaliciousContent(fullName) || hasMaliciousContent(email) || hasMaliciousContent(phone) || hasMaliciousContent(password)) {
      setErrorMessage('Security Alert: Script tags, iframes, and HTML markup are strictly prohibited.');
      return;
    }

    if (isRegisterMode) {
      if (!isValidName(fullName)) {
        setErrorMessage('Please provide a valid name (alphabets only, min 2 characters).');
        return;
      }
      if (!isValidEmail(email)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (!isValidPhone(phone)) {
        setErrorMessage('Please enter a valid phone number (min 7 digits).');
        return;
      }
      if (password.length < 4) {
        setErrorMessage('Password must be at least 4 characters.');
        return;
      }

      setIsProcessing(true);
      setTimeout(() => {
        const memberId = `NR-${Math.floor(1000 + Math.random() * 9000)}`;
        const userSession: UserSession = {
          name: fullName,
          email,
          phone,
          memberId,
          isLoggedIn: true,
        };

        const dispatched = dispatchVIPWelcomeEmail(fullName, email, memberId, phone);
        onEmailDispatched(dispatched);
        onLoginSuccess(userSession);
        setIsProcessing(false);
        onClose();
      }, 700);
    } else {
      if (!isValidEmail(email)) {
        setErrorMessage('Please enter a valid registered email address.');
        return;
      }
      if (password.length < 4) {
        setErrorMessage('Please enter your password.');
        return;
      }

      setIsProcessing(true);
      setTimeout(() => {
        const derivedName = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'MEMBER';
        const userSession: UserSession = {
          name: derivedName.toUpperCase(),
          email,
          phone: '+91 98765 43210',
          memberId: 'NR-7729',
          isLoggedIn: true,
        };
        onLoginSuccess(userSession);
        setIsProcessing(false);
        onClose();
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#2D2926]/60 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white border border-[#2D2926]/10 p-6 sm:p-8 shadow-2xl text-[#2D2926]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-[#2D2926]/10 bg-[#FAF7F5] text-[#5E5854] hover:text-[#2D2926] transition-all cursor-pointer shadow-sm"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Eyebrow & Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 mb-2 shadow-sm">
            <Sparkles className="h-3 w-3 text-[#E05A7E]" />
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#2D2926] font-bold">
              VIP CELLAR ACCESS
            </span>
          </div>

          <h3 className="font-display text-2xl text-[#2D2926] font-bold">
            {isRegisterMode ? 'Maison Registration' : 'Atelier Sign In'}
          </h3>
          <p className="font-sans text-xs text-[#5E5854] mt-1 max-w-xs mx-auto">
            {isRegisterMode
              ? 'Join our private cellar for priority allocation of limited micro-lots.'
              : 'Sign in to access your reserve allocations and order ledger.'}
          </p>
        </div>

        {/* Mode Toggle Switch */}
        <div className="flex rounded-2xl bg-[#FAF7F5] p-1 border border-[#2D2926]/10 mb-5">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-sans font-bold tracking-wider transition-all cursor-pointer ${
              !isRegisterMode
                ? 'bg-[#F5DADF] text-[#2D2926] shadow-sm'
                : 'text-[#5E5854] hover:text-[#2D2926]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-sans font-bold tracking-wider transition-all cursor-pointer ${
              isRegisterMode
                ? 'bg-[#F5DADF] text-[#2D2926] shadow-sm'
                : 'text-[#5E5854] hover:text-[#2D2926]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3.5">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-sans text-[#8C827A] uppercase tracking-wider mb-1 font-bold">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-[#E05A7E]" />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  name="noir_reg_fullname"
                  value={fullName}
                  onChange={handleNameChange}
                  placeholder="Devendra Roy"
                  className="w-full rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 pl-10 pr-4 py-2.5 text-xs text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none font-sans"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-sans text-[#8C827A] uppercase tracking-wider mb-1 font-bold">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-[#E05A7E]" />
              <input
                type="email"
                required
                autoComplete="off"
                name="noir_login_email_field"
                value={email}
                onChange={handleEmailChange}
                placeholder="devendra@example.com"
                className="w-full rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 pl-10 pr-4 py-2.5 text-xs text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none font-sans"
              />
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-xs font-sans text-[#8C827A] uppercase tracking-wider mb-1 font-bold">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3.5 h-4 w-4 text-[#E05A7E]" />
                <input
                  type="tel"
                  required
                  autoComplete="off"
                  name="noir_reg_phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 pl-10 pr-4 py-2.5 text-xs text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none font-sans"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-sans text-[#8C827A] uppercase tracking-wider mb-1 font-bold">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-[#E05A7E]" />
              <input
                type="password"
                required
                autoComplete="new-password"
                name="noir_login_secret_entry"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className="w-full rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 pl-10 pr-4 py-2.5 text-xs text-[#2D2926] placeholder-[#8C827A] focus:border-[#2D2926] focus:outline-none font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 rounded-full bg-[#2D2926] text-white font-sans text-xs font-bold tracking-[0.2em] uppercase transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-md hover:bg-[#1F1C1A] hover:scale-105 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <span>{isRegisterMode ? 'Create VIP Membership' : 'Enter Cellar'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
