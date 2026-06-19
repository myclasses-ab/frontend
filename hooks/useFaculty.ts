/**
 * useFaculty Hook
 * Fetch and manage faculty members
 */

import { useState, useEffect, useCallback } from 'react';
import { facultyApi } from '@/api';
import { Faculty } from '@/types';

interface UseFacultyOptions {
  instituteIdentifier?: string;
  limit?: number;
  minExperience?: number;
}

interface UseFacultyReturn {
  faculty: Faculty[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Hook for fetching faculty members
export function useFaculty(options: UseFacultyOptions = {}): UseFacultyReturn {
  const { instituteIdentifier, limit, minExperience } = options;
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFaculty = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let data: Faculty[];

      if (instituteIdentifier) {
        data = await facultyApi.findByInstituteIdentifier(instituteIdentifier);
      } else if (minExperience) {
        data = await facultyApi.findByExperienceYearsGreaterThan(minExperience);
      } else {
        data = await facultyApi.getAll();
      }

      // Sort by display order and rating
      data = data
        .sort((a, b) => {
          // First by display order
          if (a.displayOrder !== b.displayOrder) {
            return a.displayOrder - b.displayOrder;
          }
          // Then by rating
          return Number(b.studentRating) - Number(a.studentRating);
        });

      if (limit) {
        data = data.slice(0, limit);
      }

      setFaculty(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch faculty'));
    } finally {
      setIsLoading(false);
    }
  }, [instituteIdentifier, limit, minExperience]);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  return {
    faculty,
    isLoading,
    error,
    refetch: fetchFaculty,
  };
}

// Hook for fetching a single faculty member
export function useFacultyMember(identifier: string) {
  const [facultyMember, setFacultyMember] = useState<Faculty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFacultyMember = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await facultyApi.getById(identifier);
        setFacultyMember(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch faculty member'));
      } finally {
        setIsLoading(false);
      }
    };

    if (identifier) {
      fetchFacultyMember();
    }
  }, [identifier]);

  return { facultyMember, isLoading, error };
}


