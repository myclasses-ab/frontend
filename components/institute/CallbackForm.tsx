'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, CheckCircle, X, Calendar } from 'lucide-react';
import { inquiryApi } from '@/api';
import { InquirySource, InquiryStatus } from '@/types';

interface CallbackFormProps {
  instituteIdentifier: string;
  instituteName?: string;
  onSubmit?: () => void;
  onClose?: () => void;
  variant?: 'inline' | 'modal';
}

export function CallbackForm({
  instituteIdentifier,
  instituteName,
  onSubmit,
  onClose,
  variant = 'inline',
}: CallbackFormProps) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (value: string): boolean => {
    return /^[\d\s\-+()]{10,}$/.test(value.replace(/\s/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }

    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      await inquiryApi.create({
        instituteIdentifier,
        branchIdentifier: null,
        courseIdentifier: null,
        userIdentifier: null,
        name: name || 'Callback Request',
        email: '',
        phone: phone,
        standard: '',
        targetExam: '',
        message: 'Request for callback',
        source: InquirySource.CALLBACK_REQUEST,
        status: InquiryStatus.NEW,
        assignedTo: '',
        instituteNotes: '',
        utmSource: '',
        utmMedium: '',
        utmCampaign: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setIsSuccess(true);
      onSubmit?.();
    } catch (err) {
      console.error('Failed to submit callback request:', err);
      setError('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'modal' && isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 text-center max-w-sm w-full mx-4"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">
          Request Submitted!
        </h3>
        <p className="text-[var(--gray-600)] mb-6">
          We&apos;ll call you back shortly.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-[var(--primary)] text-white font-medium rounded-xl hover:bg-[var(--primary-700)] transition-colors"
        >
          Close
        </button>
      </motion.div>
    );
  }

  if (variant === 'modal') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent-purple)] p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <h3 className="text-lg font-bold">Request Callback</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {instituteName && (
            <p className="text-white/80 text-sm mt-1">{instituteName}</p>
          )}
        </div>

        {/* Form */}
        <div className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 border border-[var(--gray-200)] rounded-xl focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-100)] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gray-400)]" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your phone number"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[var(--primary-100)] outline-none transition-all ${
                    error
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-[var(--gray-200)] focus:border-[var(--primary)]'
                  }`}
                />
              </div>
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[var(--primary)] text-white font-medium rounded-xl hover:bg-[var(--primary-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Request Callback'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  // Inline variant
  return (
    <AnimatePresence mode="wait">
      {isSuccess ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex flex-col items-center gap-2 py-6 text-center"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <p className="font-medium text-[var(--gray-900)]">Request Submitted!</p>
          <p className="text-sm text-[var(--gray-500)]">
            We will call you back soon
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="space-y-3"
        >
          <div>
            <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">
              Your Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError('');
              }}
              placeholder="Enter your phone number"
              className={`w-full px-4 py-2.5 border rounded-xl focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-100)] outline-none transition-all ${
                error ? 'border-red-300' : 'border-[var(--gray-200)]'
              }`}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-[var(--gray-200)] text-[var(--gray-600)] rounded-xl font-medium hover:bg-[var(--gray-50)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 bg-[var(--primary)] text-white rounded-xl font-medium hover:bg-[var(--primary-700)] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? '...' : 'Submit'}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
