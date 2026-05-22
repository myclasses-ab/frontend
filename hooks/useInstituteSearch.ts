/**
 * useInstituteSearch Hook
 * Server-side institute search with filters
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { instituteApi } from '@/api';
import { Institute, InstituteType, SubscriptionTier } from '@/types';

export interface InstituteSearchFilters {
  query: string;
  cityIdentifier: string;
  cityName: string;
  minFee: number | null;
  maxFee: number | null;
  minRating: number;
  type: InstituteType | null;
  subscriptionTier: SubscriptionTier | null;
  isVerified: boolean | null;
  isFeatured: boolean | null;
  hasHostel: boolean | null;
}

export type SortBy = 'relevance' | 'rating' | 'name' | 'popularity' | 'experience';
export type SortOrder = 'asc' | 'desc';

interface UseInstituteSearchReturn {
  institutes: Institute[];
  isLoading: boolean;
  error: Error | null;
  filters: InstituteSearchFilters;
  setFilters: (filters: InstituteSearchFilters | ((prev: InstituteSearchFilters) => InstituteSearchFilters)) => void;
  sortBy: SortBy;
  sortOrder: SortOrder;
  setSortBy: (sort: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;
  refetch: () => Promise<void>;
}

const defaultFilters: InstituteSearchFilters = {
  query: '',
  cityIdentifier: '',
  cityName: '',
  minFee: null,
  maxFee: null,
  minRating: 0,
  type: null,
  subscriptionTier: null,
  isVerified: null,
  isFeatured: null,
  hasHostel: null,
};

export function useInstituteSearch(
  initialFilters?: Partial<InstituteSearchFilters>
): UseInstituteSearchReturn {
  const [filters, setFiltersState] = useState<InstituteSearchFilters>({
    ...defaultFilters,
    ...initialFilters,
  });
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('relevance');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchData = useCallback(async () => {
    const currentFilters = filtersRef.current;

    // Only search if there's a query or city or explicit filter action
    // Actually, let's always search to show results
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, unknown> = {
        sortBy,
        sortOrder,
      };

      if (currentFilters.query?.trim()) {
        params.query = currentFilters.query.trim();
      }
      if (currentFilters.cityIdentifier) {
        params.cityIdentifier = currentFilters.cityIdentifier;
      }
      if (currentFilters.cityName) {
        params.cityName = currentFilters.cityName;
      }
      if (currentFilters.minFee !== null) {
        params.minFee = currentFilters.minFee;
      }
      if (currentFilters.maxFee !== null) {
        params.maxFee = currentFilters.maxFee;
      }
      if (currentFilters.minRating > 0) {
        params.minRating = currentFilters.minRating;
      }
      if (currentFilters.type) {
        params.type = currentFilters.type;
      }
      if (currentFilters.subscriptionTier) {
        params.subscriptionTier = currentFilters.subscriptionTier;
      }
      if (currentFilters.isVerified !== null) {
        params.isVerified = currentFilters.isVerified;
      }
      if (currentFilters.isFeatured !== null) {
        params.isFeatured = currentFilters.isFeatured;
      }
      if (currentFilters.hasHostel !== null) {
        params.hasHostel = currentFilters.hasHostel;
      }

      const data = await instituteApi.search(params);
      setInstitutes(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search institutes'));
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, sortOrder]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchData, filters, sortBy, sortOrder]);

  const setFilters = useCallback(
    (updater: InstituteSearchFilters | ((prev: InstituteSearchFilters) => InstituteSearchFilters)) => {
      setFiltersState((prev) => (typeof updater === 'function' ? updater(prev) : updater));
    },
    []
  );

  return {
    institutes,
    isLoading,
    error,
    filters,
    setFilters,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    refetch: fetchData,
  };
}
