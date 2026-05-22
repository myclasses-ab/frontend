'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  CheckCircle,
  User,
  Mail,
  Phone,
  BookOpen,
  Target,
  MessageSquare,
} from 'lucide-react';
import { inquiryApi } from '@/api';
import { InquirySource, InquiryStatus } from '@/types';

interface InquiryFormProps {
  instituteIdentifier: string;
  instituteName: string;
  branchIdentifier?: string;
  courseIdentifier?: string;
  onSubmit?: () => void;
  onClose?: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  standard: string;
  targetExam: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const standards = [
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
  'Dropper',
  'Graduate',
];

const targetExams = [
  'JEE Main',
  'JEE Advanced',
  'NEET',
  'MHT-CET',
  'KVPY',
  'Olympiads',
  'Board Exams',
  'Other',
];

export function InquiryForm({
  instituteIdentifier,
  instituteName,
  branchIdentifier,
  courseIdentifier,
  onSubmit,
  onClose,
}: InquiryFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    standard: '',
    targetExam: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-+()]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await inquiryApi.create({
        instituteIdentifier,
        branchIdentifier: branchIdentifier || null,
        courseIdentifier: courseIdentifier || null,
        userIdentifier: null, // Will be set on backend if user is logged in
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        standard: formData.standard,
        targetExam: formData.targetExam,
        message: formData.message,
        source: InquirySource.LISTING_PAGE,
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
      console.error('Failed to submit inquiry:', err);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 text-center max-w-md w-full mx-4"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">
          Inquiry Submitted!
        </h3>
        <p className="text-[var(--gray-600)] mb-6">
          Thank you for your interest in {instituteName}. Our team will contact you shortly.
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent-purple)] p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Contact Institute</h3>
            <p className="text-white/80 text-sm mt-1">{instituteName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gray-400)]" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[var(--primary-100)] outline-none transition-all ${
                  errors.name
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-[var(--gray-200)] focus:border-[var(--primary)]'
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gray-400)]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[var(--primary-100)] outline-none transition-all ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-[var(--gray-200)] focus:border-[var(--primary)]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gray-400)]" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[var(--primary-100)] outline-none transition-all ${
                    errors.phone
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-[var(--gray-200)] focus:border-[var(--primary)]'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Standard & Target Exam */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                <BookOpen className="w-4 h-4 inline mr-1" />
                Current Standard
              </label>
              <select
                name="standard"
                value={formData.standard}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[var(--gray-200)] rounded-xl focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-100)] outline-none transition-all bg-white"
              >
                <option value="">Select standard</option>
                {standards.map((std) => (
                  <option key={std} value={std}>
                    {std}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                <Target className="w-4 h-4 inline mr-1" />
                Target Exam
              </label>
              <select
                name="targetExam"
                value={formData.targetExam}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[var(--gray-200)] rounded-xl focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-100)] outline-none transition-all bg-white"
              >
                <option value="">Select exam</option>
                {targetExams.map((exam) => (
                  <option key={exam} value={exam}>
                    {exam}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your requirements or questions..."
              rows={3}
              className="w-full px-4 py-2.5 border border-[var(--gray-200)] rounded-xl focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-100)] outline-none transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
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
                <>
                  <Send className="w-4 h-4" />
                  Send Inquiry
                </>
              )}
            </button>
            <p className="text-center text-xs text-[var(--gray-500)] mt-3">
              By submitting, you agree to be contacted by the institute
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
