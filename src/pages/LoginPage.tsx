/**
 * Premium Coffee-Themed Member Login Page
 * Supports Email/Password with Show/Hide, Real Google OAuth, Phone SMS OTP, and Forgot Password.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Coffee,
  KeyRound,
  X,
  ArrowLeft,
  Sparkles,
  Award,
  PackageCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, hasMaliciousContent, sanitizeDigitsOnly } from '../utils/validation';
import type { ConfirmationResult } from 'firebase/auth';
import { formatFirebaseError } from '../services/firebase';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userSession,
    loginWithEmail,
    loginWithGoogle,
    sendPhoneOtp,
    verifyPhoneOtp,
    sendPasswordReset,
  } = useAuth();

  // Get return redirect url if customer was redirected from checkout/cart
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/account';

  // State
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(0);

  // Status feedback
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Forgot password modal
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<string>('');
  const [resetError, setResetError] = useState<string>('');

  // If already logged in, redirect to destination
  useEffect(() => {
    if (userSession?.isLoggedIn) {
      navigate(redirectPath, { replace: true });
    }
  }, [userSession, navigate, redirectPath]);

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Input Change Handlers with Strict XSS / Script / Iframe Blocking & Numbers-Only Phone
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw) || /[<>]/.test(raw)) {
      setErrorMessage('Security Alert: Script tags, iframes, and HTML markup (< >) are strictly prohibited.');
    } else {
      setErrorMessage('');
    }
    setEmail(raw.replace(/[<>]/g, '').trim());
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw) || /[<>]/.test(raw)) {
      setErrorMessage('Security Alert: Script tags, iframes, and HTML markup (< >) are strictly prohibited.');
    } else {
      setErrorMessage('');
    }
    setPassword(raw.replace(/[<>]/g, ''));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw) || /[<>]/.test(raw)) {
      setErrorMessage('Security Alert: Script tags, iframes, and HTML markup (< >) are strictly prohibited.');
    } else {
      setErrorMessage('');
    }
    // Strictly numbers only, max 10 digits
    const digitsOnly = sanitizeDigitsOnly(raw);
    setPhone(digitsOnly);
  };

  const handleResetEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (hasMaliciousContent(raw) || /[<>]/.test(raw)) {
      setResetError('Security Alert: Script tags, iframes, and HTML markup (< >) are strictly prohibited.');
    } else {
      setResetError('');
    }
    setResetEmail(raw.replace(/[<>]/g, '').trim());
  };

  // 1. Handle Email/Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (hasMaliciousContent(email) || hasMaliciousContent(password) || /[<>]/.test(email) || /[<>]/.test(password)) {
      setErrorMessage('Security Alert: Script tags, iframes, and HTML markup (< >) are strictly prohibited.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid registered email address.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      setSuccessMessage('Welcome back. Restoring your coffee preferences...');
      setTimeout(() => {
        navigate(redirectPath);
      }, 500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Handle Google OAuth Login
  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      await loginWithGoogle();
      setSuccessMessage('Google authentication verified. Entering cellar...');
      setTimeout(() => {
        navigate(redirectPath);
      }, 500);
    } catch (err: unknown) {
      setErrorMessage(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Send Phone SMS OTP
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (hasMaliciousContent(phone) || /[<>]/.test(phone)) {
      setErrorMessage('Security Alert: Script tags, iframes, and HTML markup (< >) are strictly prohibited.');
      return;
    }

    const cleanPhone = sanitizeDigitsOnly(phone);
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number (numbers only).');
      return;
    }

    setIsLoading(true);
    try {
      const confirmation = await sendPhoneOtp(cleanPhone, 'recaptcha-container');
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setResendTimer(60);
      setSuccessMessage(`One-time security code sent to +91 ${cleanPhone.slice(-10)}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send SMS verification code.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Handle Verify Phone OTP
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!confirmationResult) {
      setErrorMessage('Please request an SMS verification code first.');
      return;
    }
    if (otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code sent to your phone.');
      return;
    }

    setIsLoading(true);
    try {
      await verifyPhoneOtp(confirmationResult, otpCode.trim());
      setSuccessMessage('Phone verified successfully. Loading your profile...');
      setTimeout(() => {
        navigate(redirectPath);
      }, 500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid verification code. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Handle Forgot Password Reset
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (hasMaliciousContent(resetEmail) || /[<>]/.test(resetEmail)) {
      setResetError('Security Alert: Script tags, iframes, and HTML markup (< >) are strictly prohibited.');
      return;
    }

    if (!isValidEmail(resetEmail)) {
      setResetError('Please enter a valid registered email address.');
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordReset(resetEmail.trim());
      setResetSuccess(
        'Password reset instructions have been dispatched to your email. Please check your inbox and spam folder.'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to send reset email. Please verify the address.';
      setResetError(msg);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center">
      {/* Decorative Warm Ambient Accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#C89658]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#F5DADF]/50 rounded-full blur-3xl pointer-events-none" />

      {/* Recaptcha Container for Firebase Phone Verification */}
      <div id="recaptcha-container" />

      <div className="relative z-10 w-full max-w-5xl mx-auto my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Atmospheric Brand & Cellar Membership Showcase (Visible on Desktop) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6 pr-4">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#8C827A] hover:text-[#2D2926] uppercase transition-colors w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Return to Boutique</span>
            </Link>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#2D2926]/10 bg-[#F5DADF]/60 text-xs font-mono font-bold tracking-widest text-[#2D2926] uppercase w-fit shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E05A7E]" />
              <span>PRIVATE ROASTER'S CELLAR ACCESS</span>
            </div>

            <div>
              <h1 className="font-display text-3xl sm:text-4xl text-[#2D2926] font-bold tracking-tight leading-[1.15]">
                Single-Estate Micro-Lots. <br />
                <span className="italic text-[#E05A7E]">Curated for Connoisseurs.</span>
              </h1>
              <p className="font-serif text-sm sm:text-base text-[#5E5854] leading-relaxed mt-3 max-w-lg">
                Enter your private member cellar. Manage your numbered nitrogen-flushed tins, monitor fermentation batch dispatch, and schedule harvest releases directly from the Western Ghats.
              </p>
            </div>

            {/* Member Privileges Micro-Cards */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/70 border border-[#2D2926]/10 shadow-2xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2D2926] text-white">
                  <Coffee className="w-4 h-4 text-[#C89658]" />
                </div>
                <div>
                  <h4 className="text-xs font-sans font-bold text-[#2D2926]">Exclusive Lot Allocation</h4>
                  <p className="text-[11px] font-sans text-[#5E5854] leading-normal">
                    Priority access to all 12 single-estate harvest micro-lots before public release.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/70 border border-[#2D2926]/10 shadow-2xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2D2926] text-white">
                  <Award className="w-4 h-4 text-[#E05A7E]" />
                </div>
                <div>
                  <h4 className="text-xs font-sans font-bold text-[#2D2926]">Calibrated Roast Profiles</h4>
                  <p className="text-[11px] font-sans text-[#5E5854] leading-normal">
                    Master roaster cupping radar parameters tailored to Davarah, Espresso & Pour-Over.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/70 border border-[#2D2926]/10 shadow-2xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2D2926] text-white">
                  <PackageCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-xs font-sans font-bold text-[#2D2926]">Live Order Telemetry</h4>
                  <p className="text-[11px] font-sans text-[#5E5854] leading-normal">
                    Real-time status tracking from roastery degas resting to doorstep delivery.
                  </p>
                </div>
              </div>
            </div>

            {/* Patron Quote */}
            <div className="border-t border-[#2D2926]/10 pt-4 text-xs font-mono text-[#8C827A]">
              <span className="text-[#2D2926] font-semibold">“The elevation profiling and cupping radar notes match what we taste in Bangalore's finest pour-overs.”</span>
              <p className="text-[10px] text-[#8C827A] mt-1">— Verified Member • Batch 2026-NR</p>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="lg:hidden text-center mb-6">
              <Link
                to="/"
                className="group inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#8C827A] hover:text-[#2D2926] uppercase transition-colors mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Return to Boutique</span>
              </Link>
              <h1 className="font-display text-2xl font-bold tracking-tight text-[#2D2926]">
                Welcome to the Cellar
              </h1>
              <p className="text-xs text-[#5E5854] mt-1 font-sans">
                Sign in to access your single-estate allocations and order tracking.
              </p>
            </div>

            {/* Card */}
            <div className="rounded-3xl bg-white border border-[#2D2926]/10 p-6 sm:p-8 shadow-[0_15px_45px_rgba(45,41,38,0.06)] backdrop-blur-sm">
              <div className="hidden lg:block mb-6">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-[#8C827A]">
                  Patron Authentication
                </span>
                <h2 className="font-display text-2xl font-bold text-[#2D2926] mt-0.5">
                  Sign In to Cellar
                </h2>
                <p className="text-xs text-[#5E5854] mt-0.5 font-sans">
                  Enter your credentials or choose instant one-click login.
                </p>
              </div>
          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google OAuth One-Click Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-2xl border border-[#2D2926]/15 bg-white py-3 px-4 text-xs font-semibold tracking-wide text-[#2D2926] hover:bg-[#FAF7F5] transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-50"
          >
            {/* Google SVG Icon */}
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

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2D2926]/10" />
            </div>
            <span className="relative bg-white px-3 text-[10px] font-mono tracking-[0.2em] text-[#8C827A] uppercase">
              Or Choose Sign In Method
            </span>
          </div>

          {/* Method Selector Tabs */}
          <div className="flex rounded-2xl bg-[#FAF7F5] p-1 mb-5 border border-[#2D2926]/5">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setErrorMessage('');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                authMethod === 'email'
                  ? 'bg-white text-[#2D2926] shadow-xs'
                  : 'text-[#8C827A] hover:text-[#2D2926]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email & Password</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('phone');
                setErrorMessage('');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                authMethod === 'phone'
                  ? 'bg-white text-[#2D2926] shadow-xs'
                  : 'text-[#8C827A] hover:text-[#2D2926]'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile SMS OTP</span>
            </button>
          </div>

          {/* Method A: Email & Password Form */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1.5">
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

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-mono font-bold tracking-wider text-[#5E5854] uppercase">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setIsForgotPasswordOpen(true);
                    }}
                    className="text-[11px] font-sans font-semibold text-[#C89658] hover:text-[#2D2926] transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-[#2D2926] transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#2D2926] py-3 px-4 text-xs font-bold tracking-widest uppercase text-white hover:bg-[#C89658] transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span className="inline-block animate-pulse">Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Method B: Phone SMS OTP Form */}
          {authMethod === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1.5">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-semibold text-[#5E5854] pr-2 border-r border-[#2D2926]/15">
                        <Phone className="w-3.5 h-3.5 text-[#C89658]" />
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                        placeholder="98765 43210"
                        className="w-full rounded-2xl border border-[#2D2926]/15 bg-[#FAF7F5] py-2.5 pl-22 pr-3.5 text-xs text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                    <p className="text-[10px] text-[#8C827A] mt-1 font-sans">
                      We will dispatch a secure 6-digit one-time code via SMS.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#2D2926] py-3 px-4 text-xs font-bold tracking-widest uppercase text-white hover:bg-[#C89658] transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="inline-block animate-pulse">Dispatching SMS...</span>
                    ) : (
                      <>
                        <span>Send Verification Code</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1.5">
                      Enter 6-Digit SMS Code
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                        required
                        placeholder="123456"
                        className="w-full rounded-2xl border border-[#2D2926]/15 bg-[#FAF7F5] py-2.5 pl-10 pr-3.5 text-center font-mono tracking-widest text-sm text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length !== 6}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#2D2926] py-3 px-4 text-xs font-bold tracking-widest uppercase text-white hover:bg-[#C89658] transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="inline-block animate-pulse">Verifying Code...</span>
                    ) : (
                      <>
                        <span>Verify & Continue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[#8C827A] hover:text-[#2D2926] transition-colors cursor-pointer"
                    >
                      Change Number
                    </button>
                    <button
                      type="button"
                      disabled={resendTimer > 0}
                      onClick={handleSendPhoneOtp}
                      className="text-[#C89658] hover:text-[#2D2926] disabled:text-[#8C827A] transition-colors cursor-pointer font-semibold"
                    >
                      {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-8 pt-5 border-t border-[#2D2926]/10 text-center">
            <p className="text-xs text-[#5E5854]">
              New to Noir Dakshin?{' '}
              <Link
                to={`/signup${location.search}`}
                className="font-bold text-[#C89658] hover:text-[#2D2926] underline transition-colors"
              >
                Create Account & Unlock Privileges
              </Link>
            </p>
          </div>
          </div>

          {/* Security Assurance Badge */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[#8C827A] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit TLS Cryptographic Security • Est. 1998</span>
          </div>
        </div>

      </div>
    </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2926]/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-white border border-[#2D2926]/10 p-6 shadow-2xl text-[#2D2926]">
            <button
              onClick={() => {
                setIsForgotPasswordOpen(false);
                setResetSuccess('');
                setResetError('');
              }}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[#FAF7F5] flex items-center justify-center text-[#5E5854] hover:text-[#2D2926] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-full bg-[#FAF7F5] flex items-center justify-center text-[#C89658]">
                <KeyRound className="w-4 h-4" />
              </div>
              <h3 className="font-display text-lg font-bold">Reset Password</h3>
            </div>

            <p className="text-xs text-[#5E5854] mb-4">
              Enter the email address registered with your account. We will send you a secure link to reset your password.
            </p>

            {resetError && (
              <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-800">
                {resetError}
              </div>
            )}

            {resetSuccess && (
              <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800">
                {resetSuccess}
              </div>
            )}

            {!resetSuccess && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={handleResetEmailChange}
                  required
                  placeholder="your.email@noirkaapi.in"
                  className="w-full rounded-xl border border-[#2D2926]/15 bg-[#FAF7F5] p-2.5 text-xs text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full rounded-xl bg-[#2D2926] py-2.5 text-xs font-bold text-white hover:bg-[#C89658] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {resetLoading ? 'Sending Reset Link...' : 'Send Password Reset Email'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
