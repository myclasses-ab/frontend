'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Trophy,
  GraduationCap,
  Quote,
  Award,
  Medal,
  Star,
  TrendingUp,
  Target,
} from 'lucide-react';
import { Result, RankOrScoreType } from '@/types';

interface ResultCardProps {
  result: Result;
  index?: number;
  variant?: 'default' | 'compact' | 'featured';
  examTypeName?: string;
}

export function ResultCard({ result, index = 0, variant = 'default', examTypeName }: ResultCardProps) {
  const {
    studentName,
    studentPhotoUrl,
    rankOrScoreType,
    value,
    collegeAdmitted,
    testimonialQuote,
    examYear,
    isVerified,
    isFeatured,
  } = result;

  // Get rank label and color
  const getRankInfo = (type: RankOrScoreType) => {
    switch (type) {
      case RankOrScoreType.AIR_RANK:
        return { label: 'AIR', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: Trophy };
      case RankOrScoreType.STATE_RANK:
        return { label: 'State Rank', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Medal };
      case RankOrScoreType.PERCENTILE:
        return { label: 'Percentile', color: 'text-green-600', bgColor: 'bg-green-100', icon: TrendingUp };
      case RankOrScoreType.MARKS:
        return { label: 'Score', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: Target };
      case RankOrScoreType.SELECTION:
        return { label: 'Selected', color: 'text-emerald-600', bgColor: 'bg-emerald-100', icon: Award };
      default:
        return { label: 'Rank', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Star };
    }
  };

  const rankInfo = getRankInfo(rankOrScoreType);
  const RankIcon = rankInfo.icon;

  // Featured variant - for highlighted toppers
  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="relative bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-2xl border border-amber-200 overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-medium rounded-full shadow-lg">
              <Star className="w-4 h-4 fill-current" />
              Topper
            </span>
          </div>
        )}

        <div className="p-6 lg:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Student Photo */}
            <div className="relative flex-shrink-0">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-amber-200 overflow-hidden bg-white shadow-lg">
                <Image
                  src={studentPhotoUrl || '/assests/sample_image_for_anything.png'}
                  alt={studentName}
                  fill
                  className="object-cover"
                />
              </div>
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-[var(--gray-900)] mb-1">
                {studentName}
              </h3>
              
              {/* Rank Display */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 ${rankInfo.bgColor} rounded-full`}>
                  <RankIcon className={`w-5 h-5 ${rankInfo.color}`} />
                  <span className={`font-bold ${rankInfo.color}`}>
                    {rankInfo.label} {value}
                  </span>
                </div>
                {examTypeName && (
                  <span className="text-sm text-[var(--gray-500)]">
                    {examTypeName} {examYear}
                  </span>
                )}
              </div>

              {/* College Admitted */}
              {collegeAdmitted && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-[var(--gray-700)] mb-4">
                  <GraduationCap className="w-5 h-5 text-[var(--primary)]" />
                  <span className="font-medium">Admitted to {collegeAdmitted}</span>
                </div>
              )}

              {/* Testimonial */}
              {testimonialQuote && (
                <div className="relative mt-4 p-4 bg-white/70 rounded-xl border border-amber-100">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-amber-300" />
                  <p className="text-[var(--gray-600)] italic text-sm leading-relaxed">
                    &ldquo;{testimonialQuote}&rdquo;
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[var(--gray-200)] hover:border-[var(--primary-300)] hover:shadow-sm transition-all duration-200"
      >
        {/* Rank Badge */}
        <div className={`flex-shrink-0 w-14 h-14 ${rankInfo.bgColor} rounded-xl flex flex-col items-center justify-center`}>
          <RankIcon className={`w-5 h-5 ${rankInfo.color}`} />
          <span className={`text-xs font-bold ${rankInfo.color}`}>{value}</span>
        </div>

        {/* Student Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-[var(--gray-900)] truncate">{studentName}</h4>
            {isVerified && (
              <span className="inline-flex items-center px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                ✓
              </span>
            )}
          </div>
          {collegeAdmitted && (
            <p className="text-sm text-[var(--gray-600)] truncate">{collegeAdmitted}</p>
          )}
          <div className="flex items-center gap-2 mt-1 text-xs text-[var(--gray-500)]">
            <span>{examTypeName || 'Exam'} {examYear}</span>
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
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--gray-200)] overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Student Photo */}
          <div className="relative flex-shrink-0">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[var(--gray-100)] border-2 border-[var(--gray-200)] group-hover:border-[var(--primary-300)] transition-colors">
              <Image
                src={studentPhotoUrl || '/assests/sample_image_for_anything.png'}
                alt={studentName}
                fill
                className="object-cover"
              />
            </div>
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold text-[var(--gray-900)] group-hover:text-[var(--primary)] transition-colors truncate">
                {studentName}
              </h4>
              {isFeatured && (
                <span className="flex-shrink-0 inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                  <Star className="w-3 h-3" />
                  Featured
                </span>
              )}
            </div>

            {/* Rank Badge */}
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${rankInfo.bgColor} ${rankInfo.color} text-sm font-semibold rounded-lg`}>
                <RankIcon className="w-4 h-4" />
                {rankInfo.label} {value}
              </span>
              {examTypeName && (
                <span className="text-xs text-[var(--gray-500)]">{examTypeName}</span>
              )}
            </div>

            {/* College */}
            {collegeAdmitted && (
              <div className="flex items-center gap-1.5 mt-2 text-sm text-[var(--gray-600)]">
                <GraduationCap className="w-4 h-4 text-[var(--primary)]" />
                <span className="truncate">{collegeAdmitted}</span>
              </div>
            )}

            {/* Testimonial */}
            {testimonialQuote && (
              <div className="mt-3 p-3 bg-[var(--gray-50)] rounded-lg">
                <p className="text-sm text-[var(--gray-600)] italic line-clamp-2">
                  &ldquo;{testimonialQuote}&rdquo;
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 text-xs text-[var(--gray-500)]">
              <span>{examYear}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
