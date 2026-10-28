/**
 * Premium Coffee-Themed Member Registration Page
 * Captures Full Name, Email, Mobile Phone, Password, and Confirm Password with Live Validation.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, isValidName, isValidPhone, sanitizeName, sanitizePhone } from '../utils/validation';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userSession, registerWithEmail, loginWithGoogle } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/account';

  // Form State
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(true);

  // Status feedback
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Redirect if already logged in
  useEffect(() => {
    if (userSession?.isLoggedIn) {
      navigate(redirectPath, { replace: true });
    }
  }, [userSession, navigate, redirectPath]);

  // Password strength score (0-4)
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordScore = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isValidName(fullName)) {
      setErrorMessage('Please enter your full name (alphabets only, min 2 characters).');
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!isValidPhone(phone)) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your entries.');
      return;
    }
    if (!acceptedTerms) {
      setErrorMessage('Please accept the member privilege terms to continue.');
      return;
    }

    setIsLoading(true);
    try {
      await registerWithEmail(
        fullName.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        password
      );

      setSuccessMessage('Membership created! Dispatched your VIP Welcome Pass with 10% privilege discount.');
      setTimeout(() => {
        navigate(redirectPath);
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please check your details.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      await loginWithGoogle();
      setSuccessMessage('Google account connected. Setting up your coffee profile...');
      setTimeout(() => {
        navigate(redirectPath);
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-up failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] pt-20 sm:pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden flex items-center justify-center">
      {/* Decorative Warm Ambient Gradients */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#C89658]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#E05A7E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2D2926]/10 bg-white/80 shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C89658]" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-[#5E5854]">
              Artisan Coffee Membership
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#2D2926]">
            Create Your Coffee Account
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5854] mt-1 font-sans">
            Join the Noir Dakshin collective for priority micro-lot allocations & express delivery.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white border border-[#2D2926]/10 p-6 sm:p-8 shadow-[0_15px_45px_rgba(45,41,38,0.06)] backdrop-blur-sm">
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

          {/* Quick Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-2xl border border-[#2D2926]/15 bg-white py-3 px-4 text-xs font-semibold tracking-wide text-[#2D2926] hover:bg-[#FAF7F5] transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-50 mb-5"
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
            <span>Register in 1-Click with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2D2926]/10" />
            </div>
            <span className="relative bg-white px-3 text-[10px] font-mono tracking-[0.2em] text-[#8C827A] uppercase">
              Or Enter Registration Details
            </span>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(sanitizeName(e.target.value))}
                  required
                  placeholder="Kavita Iyer"
                  className="w-full rounded-2xl border border-[#2D2926]/15 bg-[#FAF7F5] py-2.5 pl-10 pr-3.5 text-xs text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email and Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    required
                    placeholder="kavita@domain.in"
                    className="w-full rounded-2xl border border-[#2D2926]/15 bg-[#FAF7F5] py-2.5 pl-10 pr-3.5 text-xs text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(sanitizePhone(e.target.value))}
                    required
                    placeholder="98765 43210"
                    className="w-full rounded-2xl border border-[#2D2926]/15 bg-[#FAF7F5] py-2.5 pl-10 pr-3.5 text-xs text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Password and Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Min 6 chars"
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

              <div>
                <label className="block text-[11px] font-mono font-bold tracking-wider text-[#5E5854] uppercase mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter password"
                    className="w-full rounded-2xl border border-[#2D2926]/15 bg-[#FAF7F5] py-2.5 pl-10 pr-10 text-xs text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-[#2D2926] cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8C827A]">
                  <span>Security Strength:</span>
                  <span className="font-bold">
                    {passwordScore <= 1 ? 'Basic' : passwordScore <= 3 ? 'Good' : 'Strong'}
                  </span>
                </div>
                <div className="flex gap-1.5 h-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        step <= passwordScore
                          ? passwordScore <= 1
                            ? 'bg-amber-400'
                            : passwordScore <= 3
                            ? 'bg-blue-400'
                            : 'bg-emerald-500'
                          : 'bg-[#2D2926]/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Privilege Consent - Mobile iOS/Android Touch-Optimized Custom Checkbox */}
            <div
              onClick={() => setAcceptedTerms(!acceptedTerms)}
              className="flex items-start gap-3 pt-2 cursor-pointer select-none group min-h-[44px]"
            >
              <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                    acceptedTerms
                      ? 'bg-[#2D2926] border-[#2D2926] text-white shadow-xs'
                      : 'bg-[#FAF7F5] border-[#2D2926]/25 group-hover:border-[#2D2926]'
                  }`}
                >
                  {acceptedTerms && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
              <label htmlFor="terms" className="text-xs text-[#5E5854] cursor-pointer leading-snug">
                I agree to the roastery terms and wish to receive single-origin cupping releases and direct farmer updates.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#2D2926] py-3 px-4 text-xs font-bold tracking-widest uppercase text-white hover:bg-[#C89658] transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50 mt-3"
            >
              {isLoading ? (
                <span className="inline-block animate-pulse">Establishing Membership...</span>
              ) : (
                <>
                  <span>Create Account & Unlock Privileges</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-5 border-t border-[#2D2926]/10 text-center">
            <p className="text-xs text-[#5E5854]">
              Already an established member?{' '}
              <Link
                to={`/login${location.search}`}
                className="font-bold text-[#C89658] hover:text-[#2D2926] underline transition-colors"
              >
                Sign In to Your Cellar
              </Link>
            </p>
          </div>
        </div>

        {/* Security Assurance Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#8C827A] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Account Store • Zero Third-Party Advertising</span>
        </div>
      </div>
    </div>
  );
};
