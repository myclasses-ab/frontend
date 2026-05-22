'use client';

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck, Sparkles, ChevronLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { sendOtp, verifyOtp, isAuthenticated } = useAuth();

  const [step, setStep] = useState<'phone' | 'name' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirect);
    }
  }, [isAuthenticated, redirect, router]);

  // Countdown timer
  useEffect(() => {
    if (step !== 'otp' || canResend) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, canResend]);

  const handleSendOtp = useCallback(async () => {
    setError('');
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setIsLoading(true);
    try {
      const { isRegistered } = await sendOtp(phone);
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      if (isRegistered) {
        setStep('otp');
        setTimeout(() => otpRefs.current[0]?.focus(), 300);
      } else {
        setStep('name');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [phone, sendOtp]);

  const handleVerifyOtp = useCallback(async () => {
    setError('');
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      return;
    }
    setIsLoading(true);
    try {
      await verifyOtp(phone, otpValue, fullName || undefined);
      router.replace(redirect);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [phone, otp, fullName, verifyOtp, redirect, router]);

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
      if (newOtp.every((d) => d !== '')) {
        setTimeout(() => handleVerifyOtp(), 100);
      }
    },
    [otp, handleVerifyOtp]
  );

  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handleOtpPaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
      const newOtp = [...otp];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtp(newOtp);
      const focusIndex = Math.min(pasted.length, 5);
      otpRefs.current[focusIndex]?.focus();
      if (pasted.length === 6) {
        setTimeout(() => handleVerifyOtp(), 100);
      }
    },
    [otp, handleVerifyOtp]
  );

  const handleResend = useCallback(async () => {
    setError('');
    setIsLoading(true);
    try {
      await sendOtp(phone);
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  }, [phone, sendOtp]);

  const handleNameSubmit = useCallback(() => {
    if (!fullName || fullName.trim().length < 2) {
      setError('Please enter your full name');
      return;
    }
    setError('');
    setStep('otp');
    setTimeout(() => otpRefs.current[0]?.focus(), 300);
  }, [fullName]);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[var(--primary)] via-[var(--primary-700)] to-[var(--accent-purple)] items-center justify-center p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        {/* Image Container */}
        <div className="relative z-10 w-full max-w-xl">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl">
            <img
              src="https://myclassesimages.s3.ap-south-1.amazonaws.com/Our/student-login.png"
              alt="My Classes"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </div>

          {/* Bottom Text */}
          <div className="mt-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">
              Find Your Perfect Institute
            </h2>
            <p className="text-white/80 text-lg max-w-md mx-auto">
              Discover top coaching institutes, compare courses, and start your learning journey today.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-[var(--primary-50)] via-white to-[var(--accent-orange)]/5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-gray-900/10 border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent-purple)] px-8 py-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <ShieldCheck className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-white">Welcome to My Classes</h1>
              <p className="text-white/80 text-sm mt-1">Find your perfect coaching institute</p>
            </div>

            {/* Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {step === 'phone' && (
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[var(--gray-700)] mb-2">
                        Mobile Number
                      </label>
                      <div className="flex items-center bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl focus-within:border-[var(--primary)] focus-within:ring-4 focus-within:ring-[var(--primary-50)] transition-all">
                        <div className="px-4 py-3 text-[var(--gray-600)] font-medium text-sm">
                          +91
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="Enter 10-digit number"
                          className="flex-1 px-4 py-3 bg-transparent text-[var(--gray-900)] placeholder:text-[var(--gray-400)] outline-none border-none text-sm"
                          maxLength={10}
                          style={{ outline: 'none', boxShadow: 'none' }}
                        />
                        <div className="pr-4">
                          <Phone className="w-4 h-4 text-[var(--gray-400)]" />
                        </div>
                      </div>
                    </div>

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mb-4"
                      >
                        {error}
                      </motion.p>
                    )}

                    <button
                      onClick={handleSendOtp}
                      disabled={isLoading || phone.length < 10}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--primary)] hover:bg-[var(--primary-700)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Get OTP
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="mt-6 flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                      <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <p className="text-xs text-amber-700">
                        <span className="font-semibold">Demo Mode:</span> Use any 10-digit number. OTP is always <span className="font-bold">123456</span>.
                      </p>
                    </div>
                  </motion.div>
                )}

                {step === 'name' && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={() => setStep('phone')}
                      className="flex items-center gap-1 text-sm text-[var(--gray-500)] hover:text-[var(--primary)] mb-4 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>

                    <p className="text-sm text-[var(--gray-600)] mb-1">
                      Looks like you are new here
                    </p>
                    <p className="text-sm font-semibold text-[var(--gray-900)] mb-6">
                      +91 {phone}
                    </p>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[var(--gray-700)] mb-2">
                        Your Name
                      </label>
                      <div className="flex items-center bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl focus-within:border-[var(--primary)] focus-within:ring-4 focus-within:ring-[var(--primary-50)] transition-all">
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          className="flex-1 px-4 py-3 bg-transparent text-[var(--gray-900)] placeholder:text-[var(--gray-400)] outline-none border-none text-sm"
                          style={{ outline: 'none', boxShadow: 'none' }}
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mb-4"
                      >
                        {error}
                      </motion.p>
                    )}

                    <button
                      onClick={handleNameSubmit}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--primary)] hover:bg-[var(--primary-700)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {step === 'otp' && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={() => setStep(fullName ? 'name' : 'phone')}
                      className="flex items-center gap-1 text-sm text-[var(--gray-500)] hover:text-[var(--primary)] mb-4 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>

                    <p className="text-sm text-[var(--gray-600)] mb-1">
                      Enter the 6-digit code sent to
                    </p>
                    <p className="text-sm font-semibold text-[var(--gray-900)] mb-6">
                      +91 {phone}
                    </p>

                    <div className="flex items-center justify-center gap-2 mb-6">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => { otpRefs.current[index] = el; }}
                          type="text"
                          inputMode="numeric"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={handleOtpPaste}
                          className="w-11 h-12 text-center text-lg font-bold text-[var(--gray-900)] bg-[var(--gray-50)] border-2 border-[var(--gray-200)] rounded-xl focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-50)] outline-none transition-all"
                          style={{ outline: 'none', boxShadow: 'none' }}
                          maxLength={1}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleVerifyOtp}
                      disabled={isLoading || otp.some((d) => !d)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--primary)] hover:bg-[var(--primary-700)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Verify & Login
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="mt-6 text-center">
                      {canResend ? (
                        <button
                          onClick={handleResend}
                          className="inline-flex items-center gap-1 text-sm text-[var(--primary)] hover:text-[var(--primary-700)] font-medium transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Resend OTP
                        </button>
                      ) : (
                        <p className="text-sm text-[var(--gray-500)]">
                          Resend OTP in <span className="font-semibold text-[var(--gray-700)]">{countdown}s</span>
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-[var(--gray-500)] mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[var(--primary-50)] via-white to-[var(--accent-orange)]/5 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
