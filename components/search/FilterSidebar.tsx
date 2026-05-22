'use client';

import { useState, useEffect, useMemo } from 'react';
import * as Slider from '@radix-ui/react-slider';
import {
  X,
  SlidersHorizontal,
  Star,
  Building2,
  BadgeCheck,
  Crown,
  Home,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { InstituteType, SubscriptionTier } from '@/types';
import { City } from '@/types';
import { cityApi } from '@/api';
import { InstituteSearchFilters } from '@/hooks/useInstituteSearch';

interface FilterSidebarProps {
  filters: InstituteSearchFilters;
  onFilterChange: (filters: InstituteSearchFilters) => void;
  isOpen: boolean;
  onClose: () => void;
  resultCount: number;
}

const PRICE_PRESETS = [
  { label: 'Under ₹10k', min: 0, max: 10000 },
  { label: '₹10k - ₹50k', min: 10000, max: 50000 },
  { label: '₹50k - ₹1L', min: 50000, max: 100000 },
  { label: 'Above ₹1L', min: 100000, max: 500000 },
];

const INSTITUTE_TYPES = [
  { value: InstituteType.OFFLINE, label: 'Offline', icon: Building2 },
  { value: InstituteType.ONLINE, label: 'Online', icon: Building2 },
  { value: InstituteType.HYBRID, label: 'Hybrid', icon: Building2 },
];

const RATING_OPTIONS = [
  { value: 4.5, label: '4.5 & above' },
  { value: 4.0, label: '4.0 & above' },
  { value: 3.5, label: '3.5 & above' },
  { value: 3.0, label: '3.0 & above' },
];

const SUBSCRIPTION_TIERS = [
  { value: SubscriptionTier.FEATURED, label: 'Featured', icon: Crown },
  { value: SubscriptionTier.PREMIUM, label: 'Premium', icon: Crown },
  { value: SubscriptionTier.BASIC, label: 'Basic', icon: Crown },
];

export function FilterSidebar({ filters, onFilterChange, isOpen, onClose, resultCount }: FilterSidebarProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [showAllCities, setShowAllCities] = useState(false);

  // Local slider state: decoupled from parent during drag to avoid re-render interrupts
  const [localPriceRange, setLocalPriceRange] = useState<number[]>([
    filters.minFee ?? 0,
    filters.maxFee ?? 500000,
  ]);

  // Sync local state when filters change externally (e.g. presets, clear, URL)
  useEffect(() => {
    setLocalPriceRange([filters.minFee ?? 0, filters.maxFee ?? 500000]);
  }, [filters.minFee, filters.maxFee]);

  const priceRange = useMemo(
    () => [filters.minFee ?? 0, filters.maxFee ?? 500000],
    [filters.minFee, filters.maxFee]
  );

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await cityApi.getAll();
        setCities((data ?? []).slice(0, 20));
      } catch {
        setCities([]);
      }
    };
    fetchCities();
  }, []);

  const updateFilter = <K extends keyof InstituteSearchFilters>(
    key: K,
    value: InstituteSearchFilters[K]
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handlePriceChange = (values: number[]) => {
    // Update local state only during drag — parent is NOT notified
    setLocalPriceRange(values);
  };

  const handlePriceCommit = (values: number[]) => {
    // Notify parent only when user releases the thumb
    onFilterChange({
      ...filters,
      minFee: values[0] > 0 ? values[0] : null,
      maxFee: values[1] < 500000 ? values[1] : null,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      query: filters.query,
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
    });
  };

  const hasActiveFilters =
    filters.cityIdentifier ||
    filters.minFee !== null ||
    filters.maxFee !== null ||
    filters.minRating > 0 ||
    filters.type ||
    filters.subscriptionTier ||
    filters.isVerified ||
    filters.isFeatured ||
    filters.hasHostel;

  const displayedCities = showAllCities ? cities : cities.slice(0, 6);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-24 left-0 h-full lg:h-fit w-80 lg:w-72 bg-white lg:bg-transparent z-50 lg:z-auto overflow-y-auto lg:overflow-visible transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 lg:p-0 lg:pr-4 min-h-full lg:min-h-0">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[var(--gray-700)]" />
              <h2 className="text-lg font-bold text-[var(--gray-900)]">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--gray-100)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[var(--gray-600)]" />
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--gray-900)]">Filters</h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-700)] transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Popular Cities */}
            <div className="bg-white rounded-2xl border border-[var(--gray-200)] p-4">
              <h3 className="text-sm font-semibold text-[var(--gray-900)] mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--gray-500)]" />
                Popular Cities
              </h3>
              <div className="flex flex-wrap gap-2">
                {displayedCities.map((city) => (
                  <button
                    key={city.identifier}
                    onClick={() =>
                      onFilterChange({
                        ...filters,
                        cityIdentifier: filters.cityIdentifier === city.identifier ? '' : city.identifier,
                        cityName: '',
                      })
                    }
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      filters.cityIdentifier === city.identifier
                        ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                        : 'bg-white text-[var(--gray-700)] border-[var(--gray-200)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                    }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
              {cities.length > 6 && (
                <button
                  onClick={() => setShowAllCities(!showAllCities)}
                  className="mt-2 text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-700)] transition-colors flex items-center gap-1"
                >
                  {showAllCities ? (
                    <>
                      <ChevronUp className="w-4 h-4" /> Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" /> View More
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-2xl border border-[var(--gray-200)] p-4">
              <h3 className="text-sm font-semibold text-[var(--gray-900)] mb-3">Price Range (Fee)</h3>

              {/* Slider */}
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5 mb-4"
                value={localPriceRange}
                max={500000}
                step={1000}
                onValueChange={handlePriceChange}
                onValueCommit={handlePriceCommit}
              >
                <Slider.Track className="bg-[var(--gray-200)] relative grow rounded-full h-[6px]">
                  <Slider.Range className="absolute bg-[var(--primary)] rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb
                  className="block w-5 h-5 bg-white border-2 border-[var(--primary)] rounded-full shadow-md hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
                  aria-label="Minimum price"
                />
                <Slider.Thumb
                  className="block w-5 h-5 bg-white border-2 border-[var(--primary)] rounded-full shadow-md hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
                  aria-label="Maximum price"
                />
              </Slider.Root>

              <div className="flex items-center justify-between text-sm text-[var(--gray-600)] mb-3">
                <span>₹{localPriceRange[0].toLocaleString()}</span>
                <span>₹{localPriceRange[1].toLocaleString()}</span>
              </div>

              {/* Presets */}
              <div className="space-y-1.5">
                {PRICE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePriceCommit([preset.min, preset.max])}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      priceRange[0] === preset.min && priceRange[1] === preset.max
                        ? 'bg-[var(--primary-50)] text-[var(--primary)] font-medium'
                        : 'text-[var(--gray-600)] hover:bg-[var(--gray-50)]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="bg-white rounded-2xl border border-[var(--gray-200)] p-4">
              <h3 className="text-sm font-semibold text-[var(--gray-900)] mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                Rating
              </h3>
              <div className="space-y-1.5">
                {RATING_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      updateFilter(
                        'minRating',
                        filters.minRating === option.value ? 0 : option.value
                      )
                    }
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                      filters.minRating === option.value
                        ? 'bg-[var(--primary-50)] text-[var(--primary)] font-medium'
                        : 'text-[var(--gray-600)] hover:bg-[var(--gray-50)]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        filters.minRating === option.value
                          ? 'bg-[var(--primary)] border-[var(--primary)]'
                          : 'border-[var(--gray-300)]'
                      }`}
                    >
                      {filters.minRating === option.value && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Institute Type */}
            <div className="bg-white rounded-2xl border border-[var(--gray-200)] p-4">
              <h3 className="text-sm font-semibold text-[var(--gray-900)] mb-3">Institute Type</h3>
              <div className="space-y-1.5">
                {INSTITUTE_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() =>
                      updateFilter('type', filters.type === type.value ? null : type.value)
                    }
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                      filters.type === type.value
                        ? 'bg-[var(--primary-50)] text-[var(--primary)] font-medium'
                        : 'text-[var(--gray-600)] hover:bg-[var(--gray-50)]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        filters.type === type.value
                          ? 'bg-[var(--primary)] border-[var(--primary)]'
                          : 'border-[var(--gray-300)]'
                      }`}
                    >
                      {filters.type === type.value && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subscription Tier */}
            <div className="bg-white rounded-2xl border border-[var(--gray-200)] p-4">
              <h3 className="text-sm font-semibold text-[var(--gray-900)] mb-3">Subscription</h3>
              <div className="space-y-1.5">
                {SUBSCRIPTION_TIERS.map((tier) => (
                  <button
                    key={tier.value}
                    onClick={() =>
                      updateFilter(
                        'subscriptionTier',
                        filters.subscriptionTier === tier.value ? null : tier.value
                      )
                    }
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                      filters.subscriptionTier === tier.value
                        ? 'bg-[var(--primary-50)] text-[var(--primary)] font-medium'
                        : 'text-[var(--gray-600)] hover:bg-[var(--gray-50)]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        filters.subscriptionTier === tier.value
                          ? 'bg-[var(--primary)] border-[var(--primary)]'
                          : 'border-[var(--gray-300)]'
                      }`}
                    >
                      {filters.subscriptionTier === tier.value && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* More Filters */}
            <div className="bg-white rounded-2xl border border-[var(--gray-200)] p-4">
              <h3 className="text-sm font-semibold text-[var(--gray-900)] mb-3">More Filters</h3>
              <div className="space-y-2">
                <button
                  onClick={() =>
                    updateFilter('isVerified', filters.isVerified === true ? null : true)
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                    filters.isVerified === true
                      ? 'bg-[var(--primary-50)] text-[var(--primary)] font-medium'
                      : 'text-[var(--gray-600)] hover:bg-[var(--gray-50)]'
                  }`}
                >
                  <BadgeCheck className="w-4 h-4" />
                  Verified Institutes
                </button>
                <button
                  onClick={() =>
                    updateFilter('isFeatured', filters.isFeatured === true ? null : true)
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                    filters.isFeatured === true
                      ? 'bg-[var(--primary-50)] text-[var(--primary)] font-medium'
                      : 'text-[var(--gray-600)] hover:bg-[var(--gray-50)]'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  Featured Only
                </button>
                <button
                  onClick={() =>
                    updateFilter('hasHostel', filters.hasHostel === true ? null : true)
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                    filters.hasHostel === true
                      ? 'bg-[var(--primary-50)] text-[var(--primary)] font-medium'
                      : 'text-[var(--gray-600)] hover:bg-[var(--gray-50)]'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Hostel Available
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Result Count & Clear */}
          <div className="lg:hidden mt-6 pt-6 border-t border-[var(--gray-200)]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--gray-600)]">
                <span className="font-semibold text-[var(--gray-900)]">{resultCount}</span> results
              </span>
              <div className="flex gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm font-medium text-[var(--primary)] border border-[var(--primary)] rounded-xl"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-sm font-medium text-white bg-[var(--primary)] rounded-xl"
                >
                  Show Results
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
