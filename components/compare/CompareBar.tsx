'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, ArrowRight, Scale } from 'lucide-react';
import { useComparison } from '@/hooks/useComparison';
import { CompareCard } from './CompareCard';

interface CompareBarProps {
  institutes: { slug: string; name: string }[];
}

export function CompareBar({ institutes }: CompareBarProps) {
  const { selectedSlugs, removeFromComparison, clearComparison } = useComparison();

  if (selectedSlugs.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] border-t border-[var(--gray-200)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Info */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 bg-[var(--primary-100)] rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <p className="font-semibold text-[var(--gray-900)]">
                  Compare Institutes
                </p>
                <p className="text-sm text-[var(--gray-500)]">
                  {selectedSlugs.length} of 3 selected
                </p>
              </div>
            </div>

            {/* Selected Items */}
            <div className="flex-1 w-full sm:w-auto overflow-x-auto">
              <div className="flex gap-2">
                {selectedSlugs.map((slug) => {
                  const institute = institutes.find((i) => i.slug === slug);
                  if (!institute) return null;
                  return (
                    <div
                      key={slug}
                      className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-[var(--gray-100)] rounded-lg text-sm"
                    >
                      <span className="font-medium text-[var(--gray-900)] max-w-[120px] truncate">
                        {institute.name}
                      </span>
                      <button
                        onClick={() => removeFromComparison(slug)}
                        className="p-1 hover:bg-[var(--gray-200)] rounded transition-colors"
                      >
                        <X className="w-3 h-3 text-[var(--gray-500)]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={clearComparison}
                className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-[var(--gray-600)] hover:text-[var(--gray-900)] hover:bg-[var(--gray-100)] rounded-xl transition-colors"
              >
                Clear
              </button>
              <Link
                href={`/compare?institutes=${selectedSlugs.join(',')}`}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--primary)] text-white font-medium rounded-xl hover:bg-[var(--primary-700)] transition-colors"
              >
                Compare
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
