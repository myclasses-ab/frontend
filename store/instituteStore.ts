/**
 * Institute Store
 * Zustand store for institute filtering and state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Institute, InstituteType, SubscriptionTier } from '@/types';

export type SortOption = 'rating' | 'popularity' | 'experience' | 'name' | 'fees';

export interface InstituteFilters {
  searchQuery: string;
  cities: string[];
  examTypes: string[];
  instituteTypes: InstituteType[];
  subscriptionTiers: SubscriptionTier[];
  minRating: number;
  maxFees: number | null;
  hasHostel: boolean | null;
  isVerified: boolean | null;
  isFeatured: boolean | null;
}

interface InstituteStore {
  // Filters
  filters: InstituteFilters;
  setSearchQuery: (query: string) => void;
  toggleCity: (city: string) => void;
  toggleExamType: (examType: string) => void;
  toggleInstituteType: (type: InstituteType) => void;
  toggleSubscriptionTier: (tier: SubscriptionTier) => void;
  setMinRating: (rating: number) => void;
  setMaxFees: (fees: number | null) => void;
  setHasHostel: (hasHostel: boolean | null) => void;
  setIsVerified: (isVerified: boolean | null) => void;
  setIsFeatured: (isFeatured: boolean | null) => void;
  resetFilters: () => void;

  // Sorting
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
  setSortBy: (sort: SortOption) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;

  // Cache
  cachedInstitutes: Institute[];
  setCachedInstitutes: (institutes: Institute[]) => void;
  getCachedInstitute: (slug: string) => Institute | undefined;

  // Recently viewed
  recentlyViewed: string[];
  addToRecentlyViewed: (slug: string) => void;

  // Comparison
  comparisonSlugs: string[];
  addToComparison: (slug: string) => boolean;
  removeFromComparison: (slug: string) => void;
  isInComparison: (slug: string) => boolean;
  clearComparison: () => void;
}

const defaultFilters: InstituteFilters = {
  searchQuery: '',
  cities: [],
  examTypes: [],
  instituteTypes: [],
  subscriptionTiers: [],
  minRating: 0,
  maxFees: null,
  hasHostel: null,
  isVerified: null,
  isFeatured: null,
};

export const useInstituteStore = create<InstituteStore>()(
  persist(
    (set, get) => ({
      // Filters
      filters: { ...defaultFilters },
      setSearchQuery: (query) =>
        set((state) => ({
          filters: { ...state.filters, searchQuery: query },
        })),
      toggleCity: (city) =>
        set((state) => ({
          filters: {
            ...state.filters,
            cities: state.filters.cities.includes(city)
              ? state.filters.cities.filter((c) => c !== city)
              : [...state.filters.cities, city],
          },
        })),
      toggleExamType: (examType) =>
        set((state) => ({
          filters: {
            ...state.filters,
            examTypes: state.filters.examTypes.includes(examType)
              ? state.filters.examTypes.filter((e) => e !== examType)
              : [...state.filters.examTypes, examType],
          },
        })),
      toggleInstituteType: (type) =>
        set((state) => ({
          filters: {
            ...state.filters,
            instituteTypes: state.filters.instituteTypes.includes(type)
              ? state.filters.instituteTypes.filter((t) => t !== type)
              : [...state.filters.instituteTypes, type],
          },
        })),
      toggleSubscriptionTier: (tier) =>
        set((state) => ({
          filters: {
            ...state.filters,
            subscriptionTiers: state.filters.subscriptionTiers.includes(tier)
              ? state.filters.subscriptionTiers.filter((t) => t !== tier)
              : [...state.filters.subscriptionTiers, tier],
          },
        })),
      setMinRating: (rating) =>
        set((state) => ({
          filters: { ...state.filters, minRating: rating },
        })),
      setMaxFees: (fees) =>
        set((state) => ({
          filters: { ...state.filters, maxFees: fees },
        })),
      setHasHostel: (hasHostel) =>
        set((state) => ({
          filters: { ...state.filters, hasHostel },
        })),
      setIsVerified: (isVerified) =>
        set((state) => ({
          filters: { ...state.filters, isVerified },
        })),
      setIsFeatured: (isFeatured) =>
        set((state) => ({
          filters: { ...state.filters, isFeatured },
        })),
      resetFilters: () => set({ filters: { ...defaultFilters } }),

      // Sorting
      sortBy: 'rating',
      sortOrder: 'desc',
      setSortBy: (sort) => set({ sortBy: sort }),
      setSortOrder: (order) => set({ sortOrder: order }),

      // Cache
      cachedInstitutes: [],
      setCachedInstitutes: (institutes) => set({ cachedInstitutes: institutes }),
      getCachedInstitute: (slug) =>
        get().cachedInstitutes.find((i) => i.slug === slug),

      // Recently viewed
      recentlyViewed: [],
      addToRecentlyViewed: (slug) =>
        set((state) => ({
          recentlyViewed: [
            slug,
            ...state.recentlyViewed.filter((s) => s !== slug),
          ].slice(0, 10),
        })),

      // Comparison
      comparisonSlugs: [],
      addToComparison: (slug) => {
        const state = get();
        if (state.comparisonSlugs.includes(slug)) return true;
        if (state.comparisonSlugs.length >= 3) return false;
        set({ comparisonSlugs: [...state.comparisonSlugs, slug] });
        return true;
      },
      removeFromComparison: (slug) =>
        set((state) => ({
          comparisonSlugs: state.comparisonSlugs.filter((s) => s !== slug),
        })),
      isInComparison: (slug) => get().comparisonSlugs.includes(slug),
      clearComparison: () => set({ comparisonSlugs: [] }),
    }),
    {
      name: 'institute-store',
      partialize: (state) => ({
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        recentlyViewed: state.recentlyViewed,
        comparisonSlugs: state.comparisonSlugs,
      }),
    }
  )
);
