'use client';

import { motion } from 'framer-motion';

interface CourseCardSkeletonProps {
  index?: number;
}

export function CourseCardSkeleton({ index = 0 }: CourseCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative bg-white rounded-2xl shadow-sm border border-[var(--gray-200)] overflow-hidden"
    >
      {/* Header skeleton */}
      <div className="relative h-28 overflow-hidden bg-[var(--gray-100)] animate-pulse">
        {/* Badge skeletons */}
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="w-20 h-6 bg-white/50 rounded-full" />
          <div className="w-16 h-6 bg-white/50 rounded-full" />
        </div>

        {/* Icon skeleton */}
        <div className="absolute bottom-0 left-4 transform translate-y-1/2">
          <div className="w-16 h-16 rounded-xl bg-[var(--gray-200)] shadow-lg" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="pt-10 px-4 pb-4">
        {/* Title */}
        <div className="h-6 bg-[var(--gray-200)] rounded w-3/4 mb-2 animate-pulse" />
        <div className="h-4 bg-[var(--gray-100)] rounded w-1/2 mb-4 animate-pulse" />

        {/* Fee */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 bg-[var(--gray-200)] rounded w-20 animate-pulse" />
          <div className="h-5 bg-[var(--gray-100)] rounded w-16 animate-pulse" />
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[var(--gray-200)] rounded animate-pulse" />
              <div className="h-4 bg-[var(--gray-100)] rounded w-20 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="flex items-center justify-between py-3 border-t border-[var(--gray-100)] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--gray-300)] rounded-full animate-pulse" />
            <div className="h-4 bg-[var(--gray-200)] rounded w-24 animate-pulse" />
          </div>
          <div className="h-3 bg-[var(--gray-100)] rounded w-20 animate-pulse" />
        </div>

        {/* CTA */}
        <div className="h-10 bg-[var(--gray-200)] rounded-xl animate-pulse" />
      </div>
    </motion.div>
  );
}
