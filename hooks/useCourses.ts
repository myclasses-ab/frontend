/**
 * useCourses Hook
 * Fetch and manage courses with filtering
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { instituteCourseApi, instituteApi } from '@/api';
import { InstituteCourse, Institute } from '@/types';

// Types for enriched course data
export interface EnrichedInstituteCourse extends InstituteCourse {
  institute?: Institute;
}

export interface CourseFilters {
  searchQuery: string;
  minFee: number | null;
  maxFee: number | null;
  admissionOpen: boolean | null;
}

interface UseCoursesOptions {
  instituteIdentifier?: string;
  limit?: number;
}

interface UseCoursesReturn {
  instituteCourses: EnrichedInstituteCourse[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Default filters
export const defaultCourseFilters: CourseFilters = {
  searchQuery: '',
  minFee: null,
  maxFee: null,
  admissionOpen: null,
};

// Hook for fetching all courses across all institutes
export function useCourses(options: UseCoursesOptions = {}): UseCoursesReturn {
  const { limit } = options;
  const [instituteCourses, setInstituteCourses] = useState<EnrichedInstituteCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all institute courses across all institutes, along with institutes
      const [allInstituteCourses, allInstitutes] = await Promise.all([
        instituteCourseApi.getAll(),
        instituteApi.getAll(),
      ]);

      // Enrich institute courses with institute info
      const enrichedCourses = allInstituteCourses.map((ic) => {
        const institute = allInstitutes.find(i => i.identifier === ic.instituteIdentifier);
        return {
          ...ic,
          institute,
        };
      });
      
      setInstituteCourses(limit ? enrichedCourses.slice(0, limit) : enrichedCourses);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch courses'));
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    instituteCourses,
    isLoading,
    error,
    refetch: fetchCourses,
  };
}

// Hook for fetching courses by institute
export function useInstituteCourses(instituteIdentifier: string) {
  const [instituteCourses, setInstituteCourses] = useState<EnrichedInstituteCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInstituteCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const instituteCoursesData = await instituteCourseApi.findByInstituteIdentifier(instituteIdentifier);
      setInstituteCourses(instituteCoursesData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch institute courses'));
    } finally {
      setIsLoading(false);
    }
  }, [instituteIdentifier]);

  useEffect(() => {
    if (instituteIdentifier) {
      fetchInstituteCourses();
    }
  }, [instituteIdentifier, fetchInstituteCourses]);

  return { instituteCourses, isLoading, error, refetch: fetchInstituteCourses };
}

// Hook for filtering courses
export function useCourseFilters(courses: EnrichedInstituteCourse[]) {
  const [filters, setFilters] = useState<CourseFilters>(defaultCourseFilters);

  const filteredCourses = useMemo(() => {
    return courses.filter((ic) => {
      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const customName = ic.customName?.toLowerCase() || '';
        if (!customName.includes(query)) {
          return false;
        }
      }

      // Fee range filter
      const fee = Number(ic.fee) || 0;
      if (filters.minFee !== null && fee < filters.minFee) {
        return false;
      }
      if (filters.maxFee !== null && fee > filters.maxFee) {
        return false;
      }

      // Admission open filter
      if (filters.admissionOpen !== null && ic.admissionOpen !== filters.admissionOpen) {
        return false;
      }

      return true;
    });
  }, [courses, filters]);

  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const setFeeRange = useCallback((min: number | null, max: number | null) => {
    setFilters(prev => ({ ...prev, minFee: min, maxFee: max }));
  }, []);

  const setAdmissionOpen = useCallback((open: boolean | null) => {
    setFilters(prev => ({ ...prev, admissionOpen: open }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultCourseFilters);
  }, []);

  return {
    filters,
    filteredCourses,
    setSearchQuery,
    setFeeRange,
    setAdmissionOpen,
    resetFilters,
  };
}
