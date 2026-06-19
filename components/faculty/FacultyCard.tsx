'use client';

import { motion } from 'framer-motion';
import {
  Star,
  GraduationCap,
  Clock,
} from 'lucide-react';
import { Faculty } from '@/types';
import { facultyImageUrl, FALLBACK_FACULTY_URL } from '../helper/imageHelper';
import { SafeImage } from '../helper/SafeImage';

interface FacultyCardProps {
  faculty: Faculty;
  index?: number;
  variant?: 'default' | 'compact' | 'featured';
}

export function FacultyCard({ faculty, index = 0, variant = 'default' }: FacultyCardProps) {
  const {
    name,
    photoUrl,
    designation,
    qualification,
    experienceYears,
    studentRating,
  } = faculty;

  const rating = Number(studentRating) || 0;

  // Compact variant for lists
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[var(--gray-200)] hover:border-[var(--primary-300)] hover:shadow-sm transition-all duration-200"
      >
        {/* Avatar */}
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[var(--gray-100)] flex-shrink-0">
          <SafeImage
            src={facultyImageUrl(photoUrl) || FALLBACK_FACULTY_URL}
            fallbackSrc={FALLBACK_FACULTY_URL}
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-[var(--gray-900)] truncate">{name}</h4>
          </div>
          <p className="text-sm text-[var(--primary)]">{designation}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-[var(--gray-500)]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {experienceYears}+ years
            </span>
            {rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Featured variant for highlighted faculty
  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="relative bg-white rounded-2xl border border-[var(--gray-200)] overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left: Photo */}
          <div className="relative h-64 md:h-full min-h-[300px] bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)]">
            <SafeImage
              src={facultyImageUrl(photoUrl) || FALLBACK_FACULTY_URL}
              fallbackSrc={FALLBACK_FACULTY_URL}
              alt={name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Right: Info */}
          <div className="p-6 lg:p-8">
            <h3 className="text-2xl font-bold text-[var(--gray-900)] mb-1">{name}</h3>
            <p className="text-lg text-[var(--primary)] mb-4">{designation}</p>

            {/* Rating */}
            {rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-[var(--gray-300)]'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-[var(--gray-900)]">{rating.toFixed(1)}</span>
                <span className="text-sm text-[var(--gray-500)]">student rating</span>
              </div>
            )}

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--gray-50)] rounded-lg">
                <Clock className="w-5 h-5 text-[var(--primary)]" />
                <span className="font-medium text-[var(--gray-900)]">{experienceYears}+ years</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--gray-50)] rounded-lg">
                <GraduationCap className="w-5 h-5 text-[var(--primary)]" />
                <span className="font-medium text-[var(--gray-900)]">{qualification}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--gray-200)] overflow-hidden"
    >
      {/* Header with gradient */}
      <div className="relative h-24 bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)]">
        {/* Avatar */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="relative w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
            <SafeImage
              src={facultyImageUrl(photoUrl) || FALLBACK_FACULTY_URL}
              fallbackSrc={FALLBACK_FACULTY_URL}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-12 pb-5 px-5 text-center">
        <h3 className="text-lg font-bold text-[var(--gray-900)] group-hover:text-[var(--primary)] transition-colors">
          {name}
        </h3>
        <p className="text-sm text-[var(--primary)] mb-2">{designation}</p>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-[var(--gray-300)]'
                }`}
              />
            ))}
            <span className="ml-1 text-sm font-medium text-[var(--gray-600)]">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Qualification */}
        <p className="text-sm text-[var(--gray-500)] mb-3">{qualification}</p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 text-sm text-[var(--gray-600)]">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-[var(--gray-400)]" />
            {experienceYears}+ years
          </span>
        </div>
      </div>
    </motion.div>
  );
}
