/**
 * useSearch Hook
 * Global search across institutes, courses, and faculty
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { instituteApi, instituteCourseApi, facultyApi } from '@/api';
import { Institute, InstituteCourse, Faculty } from '@/types';

export type SearchTab = 'all' | 'institutes' | 'courses' | 'faculty';

export interface SearchFilters {
  cities: string[];
  examTypes: string[];
  minRating: number;
  maxFees: number | null;
  hasHostel: boolean | null;
  isVerified: boolean | null;
}

export interface SearchResults {
  institutes: Institute[];
  courses: InstituteCourse[];
  faculty: Faculty[];
  totalCount: number;
}

interface UseSearchReturn {
  results: SearchResults;
  isLoading: boolean;
  error: Error | null;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  activeTab: SearchTab;
  setActiveTab: (tab: SearchTab) => void;
  sortBy: 'relevance' | 'rating' | 'fees' | 'experience';
  sortOrder: 'asc' | 'desc';
  setSortBy: (sort: 'relevance' | 'rating' | 'fees' | 'experience') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  refetch: () => Promise<void>;
}

const defaultFilters: SearchFilters = {
  cities: [],
  examTypes: [],
  minRating: 0,
  maxFees: null,
  hasHostel: null,
  isVerified: null,
};

export function useSearch(query: string): UseSearchReturn {
  const [allInstitutes, setAllInstitutes] = useState<Institute[]>([]);
  const [allCourses, setAllCourses] = useState<InstituteCourse[]>([]);
  const [allFaculty, setAllFaculty] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'fees' | 'experience'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [institutes, courses, faculty] = await Promise.all([
        instituteApi.getAll(),
        instituteCourseApi.getAll(),
        facultyApi.getAll(),
      ]);
      setAllInstitutes(institutes);
      setAllCourses(courses);
      setAllFaculty(faculty);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch search data'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredResults = useMemo(() => {
    const lowerQuery = query.toLowerCase().trim();

    // Filter institutes
    let institutes = allInstitutes.filter((institute) => {
      if (!lowerQuery) return true;
      const searchableText = `${institute.name} ${institute.tagline} ${institute.description}`.toLowerCase();
      return searchableText.includes(lowerQuery);
    });

    // Apply institute filters
    if (filters.cities.length > 0) {
      // Note: Institutes don't have city directly, we'd need to filter by branches
      // For now, skip city filter for institutes
    }
    if (filters.minRating > 0) {
      institutes = institutes.filter((i) => Number(i.averageRating) >= filters.minRating);
    }
    if (filters.isVerified !== null) {
      institutes = institutes.filter((i) => i.isVerified === filters.isVerified);
    }

    // Filter courses
    let courses = allCourses.filter((course) => {
      if (!lowerQuery) return true;
      const searchableText = `${course.customName || ''}`.toLowerCase();
      return searchableText.includes(lowerQuery);
    });

    // Apply course filters
    if (filters.maxFees !== null) {
      courses = courses.filter((c) => Number(c.feeMax) <= filters.maxFees!);
    }

    // Filter faculty
    let faculty = allFaculty.filter((f) => {
      if (!lowerQuery) return true;
      const searchableText = `${f.name} ${f.qualification}`.toLowerCase();
      return searchableText.includes(lowerQuery);
    });

    // Sort institutes
    institutes = [...institutes].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'rating':
          comparison = Number(b.averageRating) - Number(a.averageRating);
          break;
        case 'experience':
          comparison = b.yearsOfExperience - a.yearsOfExperience;
          break;
        case 'fees':
          // Would need courses to determine fees
          comparison = 0;
          break;
        case 'relevance':
        default:
          // Default sort by featured/verified first, then rating
          if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
          if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1;
          comparison = Number(b.averageRating) - Number(a.averageRating);
          break;
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });

    return {
      institutes,
      courses,
      faculty,
      totalCount: institutes.length + courses.length + faculty.length,
    };
  }, [allInstitutes, allCourses, allFaculty, query, filters, sortBy, sortOrder]);

  return {
    results: filteredResults,
    isLoading,
    error,
    filters,
    setFilters,
    activeTab,
    setActiveTab,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    refetch: fetchData,
  };
}
