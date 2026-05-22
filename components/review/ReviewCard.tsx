'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreHorizontal,
  CheckCircle,
  Shield,
  Calendar,
  BookOpen,
  User,
} from 'lucide-react';
import { Review } from '@/types';
import { RatingStars } from './RatingStars';
import { InstituteResponse } from './InstituteResponse';

interface ReviewCardProps {
  review: Review;
  index?: number;
  instituteResponse?: {
    responseText: string;
    respondedBy: string;
    createdAt: string;
  } | null;
  onHelpful?: (reviewId: string, helpful: boolean) => void;
  onReport?: (reviewId: string) => void;
  userVote?: 'helpful' | 'not_helpful' | null;
}

export function ReviewCard({
  review,
  index = 0,
  instituteResponse,
  onHelpful,
  onReport,
  userVote,
}: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResponse, setShowResponse] = useState(true);

  const {
    identifier,
    userIdentifier,
    courseTaken,
    standardWhenEnrolled,
    reviewTitle,
    reviewText,
    pros,
    cons,
    overallRating,
    facultyRating,
    studyMaterialRating,
    infrastructureRating,
    feeValueRating,
    wouldRecommend,
    isVerifiedStudent,
    helpfulCount,
    createdAt,
  } = review;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Get initials from user identifier (in real app, would use user name)
  const userInitials = userIdentifier ? userIdentifier.slice(0, 2).toUpperCase() : 'US';

  // Check if review text is long
  const isLongReview = reviewText.length > 200;
  const displayText = isExpanded || !isLongReview
    ? reviewText
    : reviewText.slice(0, 200) + '...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-2xl p-5 md:p-6 border border-[var(--gray-200)] shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-600)] flex items-center justify-center text-white font-semibold text-sm">
            {userInitials}
          </div>

          {/* User Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[var(--gray-900)]">Student</span>
              {isVerifiedStudent && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                  <Shield className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--gray-500)]">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </div>
          </div>
        </div>

        {/* Overall Rating */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--primary-50)] rounded-lg">
            <span className="text-lg font-bold text-[var(--primary)]">{overallRating}</span>
            <span className="text-sm text-[var(--gray-500)]">/5</span>
          </div>
          <RatingStars rating={Number(overallRating)} size="sm" />
        </div>
      </div>

      {/* Course Info */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--gray-100)] text-[var(--gray-700)] text-xs font-medium rounded-full">
          <BookOpen className="w-3 h-3" />
          {courseTaken}
        </span>
        {wouldRecommend && (
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Recommends
          </span>
        )}
      </div>

      {/* Review Title */}
      {reviewTitle && (
        <h4 className="font-semibold text-[var(--gray-900)] mb-2">{reviewTitle}</h4>
      )}

      {/* Review Text */}
      <div className="mb-4">
        <p className="text-[var(--gray-600)] text-sm leading-relaxed">{displayText}</p>
        {isLongReview && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[var(--primary)] text-sm font-medium mt-1 hover:underline"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Pros & Cons */}
      {(pros || cons) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {pros && (
            <div className="p-3 bg-green-50 rounded-lg">
              <h5 className="text-sm font-semibold text-green-800 mb-1 flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5" />
                Pros
              </h5>
              <p className="text-sm text-green-700">{pros}</p>
            </div>
          )}
          {cons && (
            <div className="p-3 bg-red-50 rounded-lg">
              <h5 className="text-sm font-semibold text-red-800 mb-1 flex items-center gap-1">
                <ThumbsDown className="w-3.5 h-3.5" />
                Cons
              </h5>
              <p className="text-sm text-red-700">{cons}</p>
            </div>
          )}
        </div>
      )}

      {/* Detailed Ratings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-[var(--gray-50)] rounded-lg">
        {Number(facultyRating) > 0 && (
          <div>
            <span className="text-xs text-[var(--gray-500)] block mb-1">Faculty</span>
            <RatingStars rating={Number(facultyRating)} size="sm" />
          </div>
        )}
        {Number(studyMaterialRating) > 0 && (
          <div>
            <span className="text-xs text-[var(--gray-500)] block mb-1">Study Material</span>
            <RatingStars rating={Number(studyMaterialRating)} size="sm" />
          </div>
        )}
        {Number(infrastructureRating) > 0 && (
          <div>
            <span className="text-xs text-[var(--gray-500)] block mb-1">Infrastructure</span>
            <RatingStars rating={Number(infrastructureRating)} size="sm" />
          </div>
        )}
        {Number(feeValueRating) > 0 && (
          <div>
            <span className="text-xs text-[var(--gray-500)] block mb-1">Value for Money</span>
            <RatingStars rating={Number(feeValueRating)} size="sm" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--gray-100)]">
        <div className="flex items-center gap-4">
          {/* Helpful Button */}
          <button
            onClick={() => onHelpful?.(identifier, true)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              userVote === 'helpful'
                ? 'text-[var(--primary)] font-medium'
                : 'text-[var(--gray-500)] hover:text-[var(--gray-700)]'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${userVote === 'helpful' ? 'fill-current' : ''}`} />
            Helpful ({helpfulCount})
          </button>

          {/* Not Helpful Button */}
          <button
            onClick={() => onHelpful?.(identifier, false)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              userVote === 'not_helpful'
                ? 'text-red-500 font-medium'
                : 'text-[var(--gray-500)] hover:text-[var(--gray-700)]'
            }`}
          >
            <ThumbsDown className={`w-4 h-4 ${userVote === 'not_helpful' ? 'fill-current' : ''}`} />
            Not Helpful
          </button>
        </div>

        {/* Report Button */}
        <button
          onClick={() => onReport?.(identifier)}
          className="flex items-center gap-1.5 text-sm text-[var(--gray-400)] hover:text-red-500 transition-colors"
        >
          <Flag className="w-4 h-4" />
          <span className="hidden sm:inline">Report</span>
        </button>
      </div>

      {/* Institute Response */}
      {instituteResponse && showResponse && (
        <InstituteResponse
          response={instituteResponse}
          onClose={() => setShowResponse(false)}
        />
      )}
    </motion.div>
  );
}
