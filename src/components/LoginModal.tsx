import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, User, Mail, Phone, ArrowRight, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';
import {
  sanitizeName,
  sanitizePhone,
  isValidEmail,
  isValidName,
  isValidPhone,
  hasMaliciousContent,
  stripDangerousMarkup,
} from '../utils/validation';
import type { AutomatedEmail } from '../utils/emailService';
import type { UserSession } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { formatFirebaseError } from '../services/firebase';

export type { UserSession };

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
  onEmailDispatched: _onEmailDispatched,
}) => {
  const navigate = useNavigate();
  const { loginWithEmail, registerWithEmail, loginWithGoogle, userSession } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setFullName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setShowPassword(false);
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
    setErrorMessage('');
    setFullName(sanitizeName(raw));
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
    setPhone(sanitizePhone(raw));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

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
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }

      setIsProcessing(true);
      try {
        await registerWithEmail(fullName, email, phone, password);
        if (userSession) onLoginSuccess(userSession);
        onClose();
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Registration failed.');
      } finally {
        setIsProcessing(false);
      }
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
      try {
        await loginWithEmail(email, password);
        if (userSession) onLoginSuccess(userSession);
        onClose();
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Invalid credentials.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    try {
      await loginWithGoogle();
      if (userSession) onLoginSuccess(userSession);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(formatFirebaseError(err));
    } finally {
      setIsProcessing(false);
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
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-[#2D2926]/10 bg-[#FAF7F5] text-[#5E5854] hover:text-[#2D2926] transition-all cursor-pointer shadow-xs"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 text-[#2D2926]">
            {isRegisterMode ? <Sparkles className="h-5 w-5 text-[#C89658]" /> : <Lock className="h-5 w-5 text-[#C89658]" />}
          </div>
          <h3 className="font-display text-xl font-bold tracking-tight text-[#2D2926]">
            {isRegisterMode ? 'Become a Coffee Member' : 'Sign In to Your Cellar'}
          </h3>
          <p className="mt-1 text-xs text-[#5E5854] font-sans">
            {isRegisterMode
              ? 'Receive single-origin allocations and 10% privilege discount.'
              : 'Access your order history and saved delivery destinations.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google OAuth Quick Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-3 rounded-2xl border border-[#2D2926]/15 bg-white py-2.5 px-4 text-xs font-semibold tracking-wide text-[#2D2926] hover:bg-[#FAF7F5] transition-all duration-200 shadow-2xs cursor-pointer disabled:opacity-50 mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2D2926]/10" />
          </div>
          <span className="relative bg-white px-2.5 text-[9px] font-mono tracking-[0.2em] text-[#8C827A] uppercase">
            Or with Email
          </span>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegisterMode && (
            <div>
              <label className="block text-[11px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={handleNameChange}
                  required
                  placeholder="Kavita Iyer"
                  className="w-full rounded-2xl border border-[#2D2926]/15 bg-[#FAF7F5] py-2.5 pl-10 pr-3.5 text-xs text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                placeholder="patron@noirkaapi.in"
                className="w-full rounded-2xl border border-[#2D2926]/15 bg-[#FAF7F5] py-2.5 pl-10 pr-3.5 text-xs text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-[11px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  placeholder="98765 43210"
                  className="w-full rounded-2xl border border-[#2D2926]/15 bg-[#FAF7F5] py-2.5 pl-10 pr-3.5 text-xs text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-mono font-bold tracking-wider text-[#5E5854] uppercase">
                Password
              </label>
              {!isRegisterMode && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/login');
                  }}
                  className="text-[10px] font-sans font-semibold text-[#C89658] hover:text-[#2D2926] cursor-pointer"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                required
                placeholder="••••••••"
                className="w-full rounded-2xl border border-[#2D2926]/15 bg-[#FAF7F5] py-2.5 pl-10 pr-10 text-xs text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-[#2D2926] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#2D2926] py-3 px-4 text-xs font-bold tracking-widest uppercase text-white hover:bg-[#C89658] transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50 mt-2"
          >
            {isProcessing ? (
              <span className="inline-block animate-pulse">Authenticating...</span>
            ) : (
              <>
                <span>{isRegisterMode ? 'Create Coffee Account' : 'Sign In to Cellar'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Mode Switch & Page Link */}
        <div className="mt-5 pt-4 border-t border-[#2D2926]/10 text-center space-y-1.5">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setErrorMessage('');
            }}
            className="text-xs text-[#5E5854] hover:text-[#2D2926] cursor-pointer"
          >
            {isRegisterMode ? (
              <>
                Already an established member? <span className="font-bold text-[#C89658]">Sign In</span>
              </>
            ) : (
              <>
                New to Noir Dakshin? <span className="font-bold text-[#C89658]">Become a Member</span>
              </>
            )}
          </button>

          <div>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(isRegisterMode ? '/signup' : '/login');
              }}
              className="text-[11px] font-mono text-[#8C827A] hover:text-[#2D2926] underline cursor-pointer"
            >
              Open dedicated {isRegisterMode ? 'Registration' : 'Login'} page ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
