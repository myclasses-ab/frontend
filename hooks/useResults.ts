/**
 * useResults Hook
 * Fetch and manage student results
 */

import { useState, useEffect, useCallback } from 'react';
import { resultApi } from '@/api';
import { Result, RankOrScoreType } from '@/types';

interface UseResultsOptions {
  instituteIdentifier?: string;
  examYear?: number;
  examTypeIdentifier?: string;
  rankOrScoreType?: RankOrScoreType;
  onlyFeatured?: boolean;
  onlyVerified?: boolean;
  limit?: number;
}

interface UseResultsReturn {
  results: Result[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Hook for fetching results with filters
export function useResults(options: UseResultsOptions = {}): UseResultsReturn {
  const {
    instituteIdentifier,
    examYear,
    examTypeIdentifier,
    rankOrScoreType,
    onlyFeatured,
    onlyVerified,
    limit,
  } = options;

  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResults = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let data: Result[];

      // Fetch based on primary filter
      if (instituteIdentifier && examYear) {
        data = await resultApi.findByInstituteIdentifierAndExamYear(instituteIdentifier, examYear);
      } else if (instituteIdentifier) {
        data = await resultApi.findByInstituteIdentifier(instituteIdentifier);
      } else if (examYear) {
        data = await resultApi.findByExamYear(examYear);
      } else if (examTypeIdentifier) {
        data = await resultApi.findByExamTypeIdentifier(examTypeIdentifier);
      } else if (rankOrScoreType) {
        data = await resultApi.findByRankOrScoreType(rankOrScoreType);
      } else if (onlyFeatured) {
        data = await resultApi.findByIsFeatured();
      } else if (onlyVerified) {
        data = await resultApi.findByIsVerified();
      } else {
        data = await resultApi.getAll();
      }

      // Apply additional client-side filters
      if (onlyFeatured && !instituteIdentifier) {
        data = data.filter(r => r.isFeatured);
      }
      if (onlyVerified && !instituteIdentifier) {
        data = data.filter(r => r.isVerified);
      }

      // Sort by display order, then by featured, then by exam year
      data = data.sort((a, b) => {
        // First by display order
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        // Then featured first
        if (a.isFeatured !== b.isFeatured) {
          return a.isFeatured ? -1 : 1;
        }
        // Then by exam year (descending)
        return b.examYear - a.examYear;
      });

      if (limit) {
        data = data.slice(0, limit);
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch results'));
    } finally {
      setIsLoading(false);
    }
  }, [instituteIdentifier, examYear, examTypeIdentifier, rankOrScoreType, onlyFeatured, onlyVerified, limit]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return {
    results,
    isLoading,
    error,
    refetch: fetchResults,
  };
}

// Hook for fetching a single result
export function useResult(identifier: string) {
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await resultApi.getById(identifier);
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch result'));
      } finally {
        setIsLoading(false);
      }
    };

    if (identifier) {
      fetchResult();
    }
  }, [identifier]);

  return { result, isLoading, error };
}

// Hook for fetching featured results
export function useFeaturedResults(limit?: number) {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFeaturedResults = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await resultApi.findByIsFeatured();
        setResults(limit ? data.slice(0, limit) : data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch featured results'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedResults();
  }, [limit]);

  return { results, isLoading, error };
}

// Hook for fetching results stats
export function useResultsStats(instituteIdentifier?: string) {
  const { results, isLoading, error } = useResults({ instituteIdentifier });

  const stats = {
    total: results.length,
    featured: results.filter(r => r.isFeatured).length,
    verified: results.filter(r => r.isVerified).length,
    byYear: {} as Record<number, number>,
    byExamType: {} as Record<string, number>,
    topAirRank: null as number | null,
  };

  // Calculate stats
  results.forEach(r => {
    // By year
    stats.byYear[r.examYear] = (stats.byYear[r.examYear] || 0) + 1;
    // By exam type
    stats.byExamType[r.examTypeIdentifier] = (stats.byExamType[r.examTypeIdentifier] || 0) + 1;
  });

  // Find top AIR rank
  const airRanks = results
    .filter(r => r.rankOrScoreType === RankOrScoreType.AIR_RANK)
    .map(r => parseInt(r.value))
    .filter(v => !isNaN(v));
  if (airRanks.length > 0) {
    stats.topAirRank = Math.min(...airRanks);
  }

  return { stats, isLoading, error };
}
