'use client';

import { motion } from 'framer-motion';
import {
  Phone,
  Calendar,
  MessageCircle,
  ChevronRight,
  Sparkles,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { inquiryApi } from '@/api';
import { Inquiry, InquirySource, InquiryStatus } from '@/types';

interface AdmissionCTAProps {
  instituteName?: string;
  instituteIdentifier?: string;
  courseName?: string;
  courseIdentifier?: string;
  variant?: 'default' | 'compact' | 'sticky';
}

export function AdmissionCTA({
  instituteName,
  instituteIdentifier,
  courseName,
  courseIdentifier,
  variant = 'default',
}: AdmissionCTAProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const inquiryData: Omit<Inquiry, 'identifier'> = {
        instituteIdentifier: instituteIdentifier || '',
        source: InquirySource.COURSE_PAGE,
        userIdentifier: '', // Will be set if user is logged in
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message || `Interested in ${courseName || 'admission'}`,
        branchIdentifier: null,
        courseIdentifier: courseIdentifier || null,
        standard: '',
        targetExam: '',
        status: InquiryStatus.NEW,
        assignedTo: '',
        instituteNotes: '',
        utmSource: '',
        utmMedium: '',
        utmCampaign: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await inquiryApi.create(inquiryData);

      setSubmitted(true);
      setTimeout(() => {
        setShowForm(false);
        setSubmitted(false);
        setFormData({ name: '', phone: '', email: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compact variant for inline use
  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-700)] text-white font-medium rounded-xl transition-all duration-300"
        >
          <Calendar className="w-4 h-4" />
          Book Free Demo
          <ChevronRight className="w-4 h-4" />
        </button>
        <a
          href={`tel:+919876543210`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[var(--gray-200)] hover:border-[var(--primary-300)] text-[var(--gray-700)] font-medium rounded-xl transition-all duration-300"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </a>
      </div>
    );
  }

  // Sticky variant for bottom of page
  if (variant === 'sticky') {
    return (
      <>
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--gray-200)] shadow-lg z-40 lg:hidden"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--gray-900)] truncate">
                {courseName || 'Course'}
              </p>
              <p className="text-xs text-[var(--gray-500)]">Get admission details</p>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:+919876543210`}
                className="p-3 bg-[var(--gray-100)] text-[var(--gray-700)] rounded-xl"
              >
                <Phone className="w-5 h-5" />
              </a>
              <button
                onClick={() => setShowForm(true)}
                className="px-5 py-3 bg-[var(--primary)] text-white font-medium rounded-xl"
              >
                Enquire Now
              </button>
            </div>
          </div>
        </motion.div>

        {/* Modal Form */}
        {showForm && (
          <InquiryFormModal
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            submitted={submitted}
            onClose={() => setShowForm(false)}
            onSubmit={handleSubmit}
            instituteName={instituteName}
            courseName={courseName}
          />
        )}
      </>
    );
  }

  // Default variant
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[var(--primary)] via-[var(--primary-700)] to-[var(--accent-purple)] rounded-2xl p-6 text-white overflow-hidden relative"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--accent-orange)]/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />

        <div className="relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Limited Seats Available</span>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold mb-2">
            Ready to Start Your Journey?
          </h3>
          <p className="text-white/80 mb-6">
            Get free counseling and admission assistance for {courseName || 'this course'}.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap gap-3 mb-6">
            {['Free Demo Class', 'Career Counseling', 'Fee Structure'].map((benefit) => (
              <span
                key={benefit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                {benefit}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-[var(--primary)] font-semibold rounded-xl hover:bg-white/90 transition-all duration-300"
            >
              <Calendar className="w-5 h-5" />
              Book Free Demo
              <ChevronRight className="w-4 h-4" />
            </button>
            <a
              href={`tel:+919876543210`}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </div>
        </div>
      </motion.div>

      {/* Modal Form */}
      {showForm && (
        <InquiryFormModal
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          submitted={submitted}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
          instituteName={instituteName}
          courseName={courseName}
        />
      )}
    </>
  );
}

// Inquiry Form Modal Component
interface InquiryFormModalProps {
  formData: {
    name: string;
    phone: string;
    email: string;
    message: string;
  };
  setFormData: (data: any) => void;
  isSubmitting: boolean;
  submitted: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  instituteName?: string;
  courseName?: string;
}

function InquiryFormModal({
  formData,
  setFormData,
  isSubmitting,
  submitted,
  onClose,
  onSubmit,
  instituteName,
  courseName,
}: InquiryFormModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-700)] text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold mb-1">Request Information</h3>
          <p className="text-white/80 text-sm">
            {courseName ? `About ${courseName}` : 'About admission'}
            {instituteName && ` at ${instituteName}`}
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-[var(--gray-900)] mb-2">Thank You!</h4>
              <p className="text-[var(--gray-600)]">
                We have received your request. Our team will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-200)] focus:border-[var(--primary)]"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-200)] focus:border-[var(--primary)]"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-200)] focus:border-[var(--primary)]"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-200)] focus:border-[var(--primary)] resize-none"
                  placeholder="Any specific questions?"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary-700)] text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    Submit Request
                  </>
                )}
              </button>

              <p className="text-xs text-center text-[var(--gray-500)]">
                By submitting, you agree to our terms and privacy policy
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
