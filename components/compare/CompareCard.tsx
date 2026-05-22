'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  CheckCircle,
  X,
  MapPin,
  Users,
  Building2,
  Check,
} from 'lucide-react';
import { Institute } from '@/types';

interface CompareCardProps {
  institute: Institute;
  isSelected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  showCheckbox?: boolean;
  compact?: boolean;
}

export function CompareCard({
  institute,
  isSelected = false,
  onSelect,
  onRemove,
  showCheckbox = false,
  compact = false,
}: CompareCardProps) {
  const logoImage = '/assests/sample_image_for_anything.png';

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative bg-white rounded-xl border-2 transition-all ${
          isSelected
            ? 'border-[var(--primary)] shadow-lg shadow-[var(--primary-100)]'
            : 'border-[var(--gray-200)] hover:border-[var(--gray-300)]'
        }`}
      >
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--gray-100)] hover:bg-red-100 text-[var(--gray-500)] hover:text-red-500 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        <div className="p-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[var(--gray-100)] flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image
                src={logoImage}
                alt={institute.name}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-[var(--gray-900)] text-sm truncate">
                {institute.name}
              </h4>
              <div className="flex items-center gap-2 text-xs text-[var(--gray-500)]">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{Number(institute.averageRating).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {showCheckbox && (
          <button
            onClick={onSelect}
            className={`absolute top-3 left-3 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              isSelected
                ? 'bg-[var(--primary)] border-[var(--primary)]'
                : 'bg-white border-[var(--gray-300)]'
            }`}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-white rounded-2xl border-2 overflow-hidden transition-all ${
        isSelected
          ? 'border-[var(--primary)] shadow-lg shadow-[var(--primary-100)]'
          : 'border-[var(--gray-200)] hover:border-[var(--gray-300)]'
      }`}
    >
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 p-1.5 bg-[var(--gray-100)] hover:bg-red-100 text-[var(--gray-500)] hover:text-red-500 rounded-lg transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Header */}
      <div className="p-4 border-b border-[var(--gray-100)]">
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 rounded-xl bg-[var(--gray-100)] flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image
              src={logoImage}
              alt={institute.name}
              width={56}
              height={56}
              className="object-contain"
            />
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <h3 className="font-bold text-[var(--gray-900)] line-clamp-1">
              {institute.name}
            </h3>
            {institute.tagline && (
              <p className="text-sm text-[var(--gray-500)] line-clamp-1">
                {institute.tagline}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {institute.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs text-[var(--gray-600)]">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {Number(institute.averageRating).toFixed(1)} ({institute.totalReviews})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 space-y-3">
        {institute.yearsOfExperience > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 text-[var(--gray-400)]" />
            <span className="text-[var(--gray-600)]">
              {institute.yearsOfExperience}+ years experience
            </span>
          </div>
        )}
        {institute.totalStudentsEnrolled > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-[var(--gray-400)]" />
            <span className="text-[var(--gray-600)]">
              {institute.totalStudentsEnrolled.toLocaleString()}+ students
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-[var(--gray-400)]" />
          <span className="text-[var(--gray-600)]">{institute.type}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 pt-0">
        <Link
          href={`/institutes/${institute.slug}`}
          className="block w-full py-2.5 text-center bg-[var(--primary-50)] hover:bg-[var(--primary)] text-[var(--primary)] hover:text-white rounded-xl font-medium transition-colors"
        >
          View Details
        </Link>
      </div>

      {showCheckbox && (
        <button
          onClick={onSelect}
          className={`absolute top-3 left-3 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
            isSelected
              ? 'bg-[var(--primary)] border-[var(--primary)]'
              : 'bg-white border-[var(--gray-300)]'
          }`}
        >
          {isSelected && <Check className="w-4 h-4 text-white" />}
        </button>
      )}
    </motion.div>
  );
}
