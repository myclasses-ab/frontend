'use client';

import { motion } from 'framer-motion';

interface InstituteCardSkeletonProps {
  index?: number;
}

export function InstituteCardSkeleton({ index = 0 }: InstituteCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-sm border border-[var(--gray-200)] overflow-hidden"
    >
      {/* Banner Skeleton */}
      <div className="h-32 bg-[var(--gray-200)] animate-pulse" />

      {/* Content Skeleton */}
      <div className="px-4 pb-4">
        {/* Logo placeholder */}
        <div className="relative -top-8 mb-[-20px]">
          <div className="w-16 h-16 rounded-xl bg-[var(--gray-300)] animate-pulse" />
        </div>

        {/* Title */}
        <div className="mt-8 mb-2 h-5 bg-[var(--gray-200)] rounded animate-pulse w-3/4" />
        
        {/* Tagline */}
        <div className="mb-4 h-4 bg-[var(--gray-200)] rounded animate-pulse w-1/2" />

        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-[var(--gray-200)] rounded animate-pulse" />
          <div className="h-3 bg-[var(--gray-200)] rounded animate-pulse w-4/5" />
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-4">
          <div className="h-4 w-16 bg-[var(--gray-200)] rounded animate-pulse" />
          <div className="h-4 w-16 bg-[var(--gray-200)] rounded animate-pulse" />
          <div className="h-4 w-16 bg-[var(--gray-200)] rounded animate-pulse" />
        </div>

        {/* CTA */}
        <div className="h-10 bg-[var(--gray-200)] rounded-xl animate-pulse" />
      </div>
    </motion.div>
  );
}
