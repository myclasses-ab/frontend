'use client';

import { motion } from 'framer-motion';
import { Building2, X, CheckCircle, Calendar } from 'lucide-react';

interface InstituteResponseProps {
  response: {
    responseText: string;
    respondedBy: string;
    createdAt: string;
  };
  onClose?: () => void;
}

export function InstituteResponse({ response, onClose }: InstituteResponseProps) {
  const { responseText, respondedBy, createdAt } = response;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 pt-4 border-t border-[var(--gray-100)]"
    >
      <div className="relative bg-[var(--primary-50)] rounded-xl p-4">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-[var(--gray-400)] hover:text-[var(--gray-600)] transition-colors"
            aria-label="Hide response"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[var(--gray-900)] text-sm">Institute Response</span>
              <CheckCircle className="w-3.5 h-3.5 text-[var(--primary)]" />
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--gray-500)]">
              <span>{respondedBy}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Response Text */}
        <p className="text-sm text-[var(--gray-700)] leading-relaxed pl-10">
          {responseText}
        </p>
      </div>
    </motion.div>
  );
}
