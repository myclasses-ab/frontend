'use client';

import { motion } from 'framer-motion';
import { SearchX, Building2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface EmptyStateProps {
  type?: 'no-results' | 'no-data' | 'error';
  message?: string;
  onReset?: () => void;
  action?: ReactNode;
}

export function EmptyState({
  type = 'no-results',
  message,
  onReset,
  action,
}: EmptyStateProps) {
  const config = {
    'no-results': {
      icon: SearchX,
      title: 'No institutes found',
      description:
        message ||
        'We could not find any institutes matching your search criteria. Try adjusting your filters.',
    },
    'no-data': {
      icon: Building2,
      title: 'No data available',
      description: message || 'There is no information available at the moment.',
    },
    error: {
      icon: SearchX,
      title: 'Something went wrong',
      description:
        message ||
        'We encountered an error while fetching the data. Please try again later.',
    },
  };

  const { icon: Icon, title, description } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 bg-[var(--gray-100)] rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-[var(--gray-400)]" />
      </div>

      <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">{title}</h3>
      <p className="text-[var(--gray-600)] max-w-md mb-6">{description}</p>

      <div className="flex flex-col sm:flex-row gap-3">
        {action}
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--primary)] text-white rounded-xl font-medium hover:bg-[var(--primary-700)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Clear Filters
          </button>
        )}
        {!action && (
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-2.5 border border-[var(--gray-200)] text-[var(--gray-700)] rounded-xl font-medium hover:bg-[var(--gray-50)] transition-colors"
          >
            View All Institutes
          </Link>
        )}
      </div>
    </motion.div>
  );
}
