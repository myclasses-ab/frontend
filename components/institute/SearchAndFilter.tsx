'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  Building2,
  BadgeCheck,
  Sparkles,
} from 'lucide-react';
import { useInstituteStore, SortOption } from '@/store/instituteStore';
import { useDebounce } from '@/hooks/useDebounce';
import { InstituteType, SubscriptionTier } from '@/types';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popularity', label: 'Most Reviewed' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'name', label: 'Name (A-Z)' },
];

const instituteTypes: { value: InstituteType; label: string }[] = [
  { value: InstituteType.OFFLINE, label: 'Offline' },
  { value: InstituteType.ONLINE, label: 'Online' },
  { value: InstituteType.HYBRID, label: 'Hybrid' },
];

const subscriptionTiers: { value: SubscriptionTier; label: string }[] = [
  { value: SubscriptionTier.FEATURED, label: 'Featured' },
  { value: SubscriptionTier.PREMIUM, label: 'Premium' },
  { value: SubscriptionTier.BASIC, label: 'Basic' },
];

export function SearchAndFilter() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const {
    filters,
    setSearchQuery,
    toggleInstituteType,
    toggleSubscriptionTier,
    setMinRating,
    setIsVerified,
    setIsFeatured,
    resetFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = useInstituteStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setSearchQuery(value);
  };

  const hasActiveFilters =
    filters.instituteTypes.length > 0 ||
    filters.subscriptionTiers.length > 0 ||
    filters.minRating > 0 ||
    filters.isVerified !== null ||
    filters.isFeatured !== null;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gray-400)]" />
          <input
            type="text"
            placeholder="Search institutes by name..."
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[var(--gray-200)] rounded-xl focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-100)] transition-all outline-none"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('');
                setSearchQuery('');
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--gray-100)] rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-[var(--gray-400)]" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-[var(--gray-200)] rounded-xl hover:border-[var(--primary)] transition-colors min-w-[180px]"
          >
            <span className="text-[var(--gray-600)]">Sort by:</span>
            <span className="font-medium text-[var(--gray-900)]">
              {sortOptions.find((o) => o.value === sortBy)?.label}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-[var(--gray-400)] transition-transform ${
                isSortOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {isSortOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-[var(--gray-200)] z-50"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsSortOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-[var(--gray-50)] transition-colors first:rounded-t-xl last:rounded-b-xl ${
                      sortBy === option.value
                        ? 'bg-[var(--primary-50)] text-[var(--primary)] font-medium'
                        : 'text-[var(--gray-700)]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
                <div className="border-t border-[var(--gray-200)] px-4 py-2">
                  <span className="text-xs text-[var(--gray-500)]">Order:</span>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => setSortOrder('desc')}
                      className={`px-3 py-1 text-sm rounded-lg ${
                        sortOrder === 'desc'
                          ? 'bg-[var(--primary)] text-white'
                          : 'bg-[var(--gray-100)] text-[var(--gray-600)]'
                      }`}
                    >
                      Descending
                    </button>
                    <button
                      onClick={() => setSortOrder('asc')}
                      className={`px-3 py-1 text-sm rounded-lg ${
                        sortOrder === 'asc'
                          ? 'bg-[var(--primary)] text-white'
                          : 'bg-[var(--gray-100)] text-[var(--gray-600)]'
                      }`}
                    >
                      Ascending
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors sm:w-auto w-full ${
            hasActiveFilters
              ? 'bg-[var(--primary)] text-white'
              : 'bg-white border border-[var(--gray-200)] text-[var(--gray-700)] hover:border-[var(--primary)]'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-sm">
              {filters.instituteTypes.length +
                filters.subscriptionTiers.length +
                (filters.minRating > 0 ? 1 : 0) +
                (filters.isVerified !== null ? 1 : 0) +
                (filters.isFeatured !== null ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-[var(--gray-200)] p-6 space-y-6">
              {/* Institute Type */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--gray-900)] mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[var(--primary)]" />
                  Institute Type
                </h4>
                <div className="flex flex-wrap gap-2">
                  {instituteTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => toggleInstituteType(type.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.instituteTypes.includes(type.value)
                          ? 'bg-[var(--primary)] text-white'
                          : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subscription Tier */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--gray-900)] mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--accent-purple)]" />
                  Subscription Tier
                </h4>
                <div className="flex flex-wrap gap-2">
                  {subscriptionTiers.map((tier) => (
                    <button
                      key={tier.value}
                      onClick={() => toggleSubscriptionTier(tier.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.subscriptionTiers.includes(tier.value)
                          ? 'bg-[var(--accent-purple)] text-white'
                          : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--gray-900)] mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  Minimum Rating
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() =>
                        setMinRating(filters.minRating === rating ? 0 : rating)
                      }
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.minRating === rating
                          ? 'bg-amber-400 text-white'
                          : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          filters.minRating === rating ? 'fill-current' : ''
                        }`}
                      />
                      {rating}+ Stars
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified & Featured */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--gray-900)] mb-3 flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-green-500" />
                  Verification
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      setIsVerified(filters.isVerified === true ? null : true)
                    }
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.isVerified === true
                        ? 'bg-green-500 text-white'
                        : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'
                    }`}
                  >
                    <BadgeCheck className="w-4 h-4" />
                    Verified Only
                  </button>
                  <button
                    onClick={() =>
                      setIsFeatured(filters.isFeatured === true ? null : true)
                    }
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.isFeatured === true
                        ? 'bg-amber-500 text-white'
                        : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Featured Only
                  </button>
                </div>
              </div>

              {/* Reset Button */}
              {hasActiveFilters && (
                <div className="pt-4 border-t border-[var(--gray-200)]">
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-2 text-[var(--gray-500)] hover:text-[var(--gray-700)] transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
