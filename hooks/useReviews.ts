/**
 * useReviews Hook
 * Fetch and manage reviews
 */

import { useState, useEffect, useCallback } from 'react';
import { reviewApi, reviewVoteApi, instituteResponseApi } from '@/api';
import { Review, ReviewStatus, Standard, VoteType } from '@/types';

interface UseReviewsOptions {
  instituteIdentifier?: string;
  userIdentifier?: string;
  status?: ReviewStatus;
  standard?: Standard;
  onlyVerified?: boolean;
  onlyRecommended?: boolean;
  minRating?: number;
  limit?: number;
}

interface UseReviewsReturn {
  reviews: Review[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Hook for fetching reviews with filters
export function useReviews(options: UseReviewsOptions = {}): UseReviewsReturn {
  const {
    instituteIdentifier,
    userIdentifier,
    status,
    standard,
    onlyVerified,
    onlyRecommended,
    minRating,
    limit,
  } = options;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let data: Review[];

      // Fetch based on primary filter
      if (instituteIdentifier && status) {
        data = await reviewApi.findByInstituteIdentifierAndStatus(instituteIdentifier, status);
      } else if (instituteIdentifier) {
        data = await reviewApi.findByInstituteIdentifier(instituteIdentifier);
      } else if (userIdentifier) {
        data = await reviewApi.findByUserIdentifier(userIdentifier);
      } else if (status) {
        data = await reviewApi.findByStatus(status);
      } else if (standard) {
        data = await reviewApi.findByStandardWhenEnrolled(standard);
      } else if (onlyRecommended) {
        data = await reviewApi.findByWouldRecommend();
      } else if (onlyVerified) {
        data = await reviewApi.findByIsVerifiedStudent();
      } else {
        data = await reviewApi.getAll();
      }

      // Apply additional client-side filters
      if (onlyVerified && !instituteIdentifier) {
        data = data.filter(r => r.isVerifiedStudent);
      }
      if (onlyRecommended && !instituteIdentifier) {
        data = data.filter(r => r.wouldRecommend);
      }
      if (minRating) {
        data = data.filter(r => Number(r.overallRating) >= minRating);
      }

      // Sort by helpful count and date
      data = data.sort((a, b) => {
        // First by helpful count
        if (a.helpfulCount !== b.helpfulCount) {
          return b.helpfulCount - a.helpfulCount;
        }
        // Then by date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      if (limit) {
        data = data.slice(0, limit);
      }

      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch reviews'));
    } finally {
      setIsLoading(false);
    }
  }, [instituteIdentifier, userIdentifier, status, standard, onlyVerified, onlyRecommended, minRating, limit]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    isLoading,
    error,
    refetch: fetchReviews,
  };
}

// Hook for fetching a single review
export function useReview(identifier: string) {
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await reviewApi.getById(identifier);
        setReview(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch review'));
      } finally {
        setIsLoading(false);
      }
    };

    if (identifier) {
      fetchReview();
    }
  }, [identifier]);

  return { review, isLoading, error };
}

// Hook for fetching institute responses for reviews
export function useInstituteResponses(instituteIdentifier: string) {
  const [responses, setResponses] = useState<Map<string, { responseText: string; respondedBy: string; createdAt: string }>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setIsLoading(true);
        const data = await instituteResponseApi.findByInstituteIdentifier(instituteIdentifier);
        const responseMap = new Map();
        data.forEach(response => {
          responseMap.set(response.reviewIdentifier, {
            responseText: response.responseText,
            respondedBy: response.respondedBy,
            createdAt: response.createdAt,
          });
        });
        setResponses(responseMap);
      } catch (err) {
        console.error('Failed to fetch institute responses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (instituteIdentifier) {
      fetchResponses();
    }
  }, [instituteIdentifier]);

  return { responses, isLoading };
}

// Hook for voting on reviews
export function useReviewVote() {
  const [isVoting, setIsVoting] = useState(false);

  const vote = async (
    reviewIdentifier: string,
    userIdentifier: string,
    voteType: VoteType
  ) => {
    try {
      setIsVoting(true);
      await reviewVoteApi.create({
        reviewIdentifier,
        userIdentifier,
        vote: voteType,
        createdAt: new Date().toISOString(),
      });
      return true;
    } catch (err) {
      console.error('Failed to vote:', err);
      return false;
    } finally {
      setIsVoting(false);
    }
  };

  return { vote, isVoting };
}

// Hook for fetching review stats
export function useReviewStats(instituteIdentifier?: string) {
  const { reviews, isLoading, error } = useReviews({ instituteIdentifier });

  const stats = {
    total: reviews.length,
    averageRating: 0,
    verified: reviews.filter(r => r.isVerifiedStudent).length,
    wouldRecommend: reviews.filter(r => r.wouldRecommend).length,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
    categoryAverages: {
      faculty: 0,
      studyMaterial: 0,
      infrastructure: 0,
      feeValue: 0,
      onlineSupport: 0,
      resultAchievement: 0,
    },
  };

  if (reviews.length > 0) {
    // Average rating
    stats.averageRating = reviews.reduce((sum, r) => sum + Number(r.overallRating), 0) / reviews.length;

    // Rating distribution
    reviews.forEach(r => {
      const rating = Math.floor(Number(r.overallRating));
      if (rating >= 1 && rating <= 5) {
        stats.ratingDistribution[rating]++;
      }
    });

    // Category averages
    const categories = ['facultyRating', 'studyMaterialRating', 'infrastructureRating', 'feeValueRating', 'onlineSupportRating', 'resultAchievementRating'] as const;
    const categoryKeys = ['faculty', 'studyMaterial', 'infrastructure', 'feeValue', 'onlineSupport', 'resultAchievement'] as const;
    
    categories.forEach((cat, idx) => {
      const validRatings = reviews.filter(r => Number(r[cat]) > 0);
      if (validRatings.length > 0) {
        stats.categoryAverages[categoryKeys[idx]] = validRatings.reduce((sum, r) => sum + Number(r[cat]), 0) / validRatings.length;
      }
    });
  }

  return { stats, isLoading, error };
}
