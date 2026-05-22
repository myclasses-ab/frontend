'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye } from 'lucide-react';
import Link from 'next/link';

interface MaskedOverlayProps {
  className?: string;
  message?: string;
  subMessage?: string;
  redirectUrl?: string;
}

export function MaskedOverlay({
  className = '',
  message = 'Login to View Details',
  subMessage = 'Enter your mobile number to unlock institute details, fees, faculty info, and more.',
  redirectUrl,
}: MaskedOverlayProps) {
  const href = redirectUrl || '/login?redirect=' + encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '/');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl ${className}`}
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-xl rounded-2xl" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent rounded-2xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--accent-purple)] rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-4"
        >
          <Lock className="w-7 h-7 text-white" />
        </motion.div>

        <motion.h3
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-bold text-[var(--gray-900)] mb-2"
        >
          {message}
        </motion.h3>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-[var(--gray-600)] mb-6 leading-relaxed"
        >
          {subMessage}
        </motion.p>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href={href}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-700)] text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
            Login
          </Link>
        </motion.div>


      </div>
    </motion.div>
  );
}

export function MaskedText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block blur-[6px] select-none pointer-events-none ${className}`}>
      {children}
    </span>
  );
}
