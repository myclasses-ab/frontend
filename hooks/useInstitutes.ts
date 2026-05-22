/**
 * useInstitutes Hook
 * Fetch and filter institutes
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { instituteApi } from '@/api';
import { Institute } from '@/types';
import { useInstituteStore, SortOption } from '@/store/instituteStore';

interface UseInstitutesOptions {
  featured?: boolean;
  verified?: boolean;
  limit?: number;
}

interface UseInstitutesReturn {
  institutes: Institute[];
  filteredInstitutes: Institute[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useInstitutes(options: UseInstitutesOptions = {}): UseInstitutesReturn {
  const { featured, verified, limit } = options;
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { filters, sortBy, sortOrder, setCachedInstitutes } = useInstituteStore();

  const fetchInstitutes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let data: Institute[];
      if (featured) {
        data = await instituteApi.findFeatured();
      } else if (verified) {
        data = await instituteApi.findVerified();
      } else {
        data = await instituteApi.getAll();
      }

      if (limit) {
        data = data.slice(0, limit);
      }

      setInstitutes(data);
      setCachedInstitutes(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch institutes'));
    } finally {
      setIsLoading(false);
    }
  }, [featured, verified, limit, setCachedInstitutes]);

  useEffect(() => {
    fetchInstitutes();
  }, [fetchInstitutes]);

  const filteredInstitutes = useMemo(() => {
    let result = [...institutes];

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (institute) =>
          institute.name.toLowerCase().includes(query) ||
          institute.description?.toLowerCase().includes(query) ||
          institute.tagline?.toLowerCase().includes(query)
      );
    }

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter(
        (institute) => Number(institute.averageRating) >= filters.minRating
      );
    }

    // Verified filter
    if (filters.isVerified !== null) {
      result = result.filter((institute) => institute.isVerified === filters.isVerified);
    }

    // Featured filter
    if (filters.isFeatured !== null) {
      result = result.filter((institute) => institute.isFeatured === filters.isFeatured);
    }

    // Institute type filter
    if (filters.instituteTypes.length > 0) {
      result = result.filter((institute) =>
        filters.instituteTypes.includes(institute.type)
      );
    }

    // Subscription tier filter
    if (filters.subscriptionTiers.length > 0) {
      result = result.filter((institute) =>
        filters.subscriptionTiers.includes(institute.subscriptionTier)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'rating':
          comparison = Number(b.averageRating) - Number(a.averageRating);
          break;
        case 'popularity':
          comparison = b.totalReviews - a.totalReviews;
          break;
        case 'experience':
          comparison = b.yearsOfExperience - a.yearsOfExperience;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });

    return result;
  }, [institutes, filters, sortBy, sortOrder]);

  return {
    institutes,
    filteredInstitutes,
    isLoading,
    error,
    refetch: fetchInstitutes,
  };
}

export function useInstitute(slug: string) {
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { getCachedInstitute, addToRecentlyViewed } = useInstituteStore();

  useEffect(() => {
    const fetchInstitute = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check cache first
        const cached = getCachedInstitute(slug);
        if (cached) {
          setInstitute(cached);
          setIsLoading(false);
          addToRecentlyViewed(slug);
          return;
        }

        const data = await instituteApi.findBySlug(slug);
        if (data) {
          setInstitute(data);
          addToRecentlyViewed(slug);
        } else {
          setError(new Error('Institute not found'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch institute'));
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchInstitute();
    }
  }, [slug, getCachedInstitute, addToRecentlyViewed]);

  return { institute, isLoading, error };
}
