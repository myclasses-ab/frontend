'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Calendar,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { Institute } from '@/types';

interface ContactCardProps {
  institute: Institute;
}

export function ContactCard({ institute }: ContactCardProps) {
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [phone, setPhone] = useState('');

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit callback request
    setCallbackSubmitted(true);
    setTimeout(() => {
      setCallbackSubmitted(false);
      setShowCallbackForm(false);
      setPhone('');
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-[var(--gray-200)] overflow-hidden sticky top-24"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent-purple)] p-6 text-white">
        <h3 className="text-lg font-bold mb-1">Get in Touch</h3>
        <p className="text-white/80 text-sm">
          Connect with {institute.name} for admissions
        </p>
      </div>

      <div className="p-6 space-y-4">
        {/* Contact Options */}
        <div className="space-y-3">
          {institute.phonePrimary && (
            <a
              href={`tel:${institute.phonePrimary}`}
              className="flex items-center gap-3 p-3 bg-[var(--gray-50)] hover:bg-[var(--primary-50)] rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--gray-500)]">Call Now</p>
                <p className="font-medium text-[var(--gray-900)] group-hover:text-[var(--primary)] transition-colors">
                  {institute.phonePrimary}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--gray-400)]" />
            </a>
          )}

          {institute.whatsappNumber && (
            <a
              href={`https://wa.me/${institute.whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-[var(--gray-50)] hover:bg-green-50 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--gray-500)]">WhatsApp</p>
                <p className="font-medium text-[var(--gray-900)] group-hover:text-green-600 transition-colors">
                  {institute.whatsappNumber}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--gray-400)]" />
            </a>
          )}

          {institute.email && (
            <a
              href={`mailto:${institute.email}`}
              className="flex items-center gap-3 p-3 bg-[var(--gray-50)] hover:bg-[var(--primary-50)] rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--gray-500)]">Email</p>
                <p className="font-medium text-[var(--gray-900)] group-hover:text-[var(--primary)] transition-colors truncate">
                  {institute.email}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--gray-400)]" />
            </a>
          )}

          {institute.websiteUrl && (
            <a
              href={institute.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-[var(--gray-50)] hover:bg-[var(--primary-50)] rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 bg-[var(--accent-purple)] rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--gray-500)]">Website</p>
                <p className="font-medium text-[var(--gray-900)] group-hover:text-[var(--primary)] transition-colors truncate">
                  Visit Website
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--gray-400)]" />
            </a>
          )}
        </div>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--gray-200)]" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-xs text-[var(--gray-500)]">
              OR
            </span>
          </div>
        </div>

        {/* Request Callback */}
        {!showCallbackForm ? (
          <button
            onClick={() => setShowCallbackForm(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[var(--primary)] hover:bg-[var(--primary-700)] text-white rounded-xl font-medium transition-colors"
          >
            <Calendar className="w-5 h-5" />
            Request a Callback
          </button>
        ) : callbackSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleCallbackSubmit}
            className="space-y-3"
          >
            <div>
              <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                Your Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                className="w-full px-4 py-2.5 border border-[var(--gray-200)] rounded-xl focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-100)] outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCallbackForm(false)}
                className="flex-1 py-2.5 px-4 border border-[var(--gray-200)] text-[var(--gray-600)] rounded-xl font-medium hover:bg-[var(--gray-50)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-[var(--primary)] text-white rounded-xl font-medium hover:bg-[var(--primary-700)] transition-colors"
              >
                Submit
              </button>
            </div>
          </motion.form>
        )}

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 pt-2 text-xs text-[var(--gray-500)]">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Your information is secure with us</span>
        </div>
      </div>
    </motion.div>
  );
}
