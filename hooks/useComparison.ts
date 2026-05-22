/**
 * useComparison Hook
 * Manage institute comparison state
 */

import { useCallback } from 'react';
import { useInstituteStore } from '@/store/instituteStore';

interface UseComparisonReturn {
  selectedSlugs: string[];
  addToComparison: (slug: string) => boolean;
  removeFromComparison: (slug: string) => void;
  isInComparison: (slug: string) => boolean;
  clearComparison: () => void;
  canAddMore: boolean;
}

export function useComparison(): UseComparisonReturn {
  const {
    comparisonSlugs,
    addToComparison: addToStore,
    removeFromComparison: removeFromStore,
    isInComparison: checkInComparison,
    clearComparison: clearStore,
  } = useInstituteStore();

  const addToComparison = useCallback(
    (slug: string): boolean => {
      return addToStore(slug);
    },
    [addToStore]
  );

  const removeFromComparison = useCallback(
    (slug: string) => {
      removeFromStore(slug);
    },
    [removeFromStore]
  );

  const isInComparison = useCallback(
    (slug: string): boolean => {
      return checkInComparison(slug);
    },
    [checkInComparison]
  );

  const clearComparison = useCallback(() => {
    clearStore();
  }, [clearStore]);

  return {
    selectedSlugs: comparisonSlugs,
    addToComparison,
    removeFromComparison,
    isInComparison,
    clearComparison,
    canAddMore: comparisonSlugs.length < 3,
  };
}
