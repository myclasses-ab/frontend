'use client';

import { motion } from 'framer-motion';
import { Star, Users, ThumbsUp, Shield, TrendingUp } from 'lucide-react';
import { Review } from '@/types';
import { RatingStars, RatingBreakdown } from './RatingStars';

interface ReviewStatsProps {
  reviews: Review[];
}

export function ReviewStats({ reviews }: ReviewStatsProps) {
  if (!reviews.length) return null;

  const totalReviews = reviews.length;

  // Calculate average ratings
  const averageOverall = reviews.reduce((sum, r) => sum + Number(r.overallRating), 0) / totalReviews;
  const averageFaculty = reviews.reduce((sum, r) => sum + (Number(r.facultyRating) || 0), 0) / totalReviews;
  const averageStudyMaterial = reviews.reduce((sum, r) => sum + (Number(r.studyMaterialRating) || 0), 0) / totalReviews;
  const averageInfrastructure = reviews.reduce((sum, r) => sum + (Number(r.infrastructureRating) || 0), 0) / totalReviews;
  const averageFeeValue = reviews.reduce((sum, r) => sum + (Number(r.feeValueRating) || 0), 0) / totalReviews;

  // Count ratings by stars
  const ratingCounts: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const rating = Math.floor(Number(r.overallRating));
    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating]++;
    }
  });

  // Other stats
  const verifiedStudents = reviews.filter(r => r.isVerifiedStudent).length;
  const wouldRecommend = reviews.filter(r => r.wouldRecommend).length;
  const totalHelpful = reviews.reduce((sum, r) => sum + r.helpfulCount, 0);

  // Category ratings for display
  const categoryRatings = [
    { label: 'Faculty', rating: averageFaculty, icon: Users },
    { label: 'Study Material', rating: averageStudyMaterial, icon: TrendingUp },
    { label: 'Infrastructure', rating: averageInfrastructure, icon: Users },
    { label: 'Value for Money', rating: averageFeeValue, icon: ThumbsUp },
  ].filter(c => c.rating > 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-[var(--gray-200)] shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Overall Rating */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="text-center md:text-left">
            <div className="flex items-baseline gap-2 justify-center md:justify-start">
              <span className="text-5xl font-bold text-[var(--gray-900)]">
                {averageOverall.toFixed(1)}
              </span>
              <span className="text-xl text-[var(--gray-500)]">/5</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
              <RatingStars rating={averageOverall} size="md" />
            </div>
            <p className="text-sm text-[var(--gray-500)] mt-2">
              Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Category Ratings */}
          {categoryRatings.length > 0 && (
            <div className="w-full grid grid-cols-2 gap-3 mt-2">
              {categoryRatings.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.label} className="flex items-center gap-2 p-2 bg-[var(--gray-50)] rounded-lg">
                    <Icon className="w-4 h-4 text-[var(--primary)]" />
                    <div>
                      <div className="text-xs text-[var(--gray-500)]">{category.label}</div>
                      <div className="text-sm font-semibold text-[var(--gray-900)]">
                        {category.rating.toFixed(1)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Rating Breakdown */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--gray-700)] mb-3">Rating Breakdown</h4>
          <RatingBreakdown ratings={ratingCounts} totalReviews={totalReviews} />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[var(--gray-100)]">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-[var(--primary)] mb-1">
            <Shield className="w-4 h-4" />
            <span className="text-xl font-bold">{verifiedStudents}</span>
          </div>
          <p className="text-xs text-[var(--gray-500)]">Verified Students</p>
        </div>
        <div className="text-center border-x border-[var(--gray-100)]">
          <div className="flex items-center justify-center gap-1.5 text-green-600 mb-1">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-xl font-bold">{wouldRecommend}</span>
          </div>
          <p className="text-xs text-[var(--gray-500)]">Would Recommend</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-amber-500 mb-1">
            <Star className="w-4 h-4" />
            <span className="text-xl font-bold">{totalHelpful}</span>
          </div>
          <p className="text-xs text-[var(--gray-500)]">Helpful Votes</p>
        </div>
      </div>

      {/* Recommendation Rate */}
      {wouldRecommend > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-50 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800">
              Recommendation Rate
            </span>
            <span className="text-lg font-bold text-green-700">
              {Math.round((wouldRecommend / totalReviews) * 100)}%
            </span>
          </div>
          <div className="mt-2 h-2 bg-green-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(wouldRecommend / totalReviews) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-full bg-green-500 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
