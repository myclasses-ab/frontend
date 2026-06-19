'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  MapPin,
  GraduationCap,
  Crosshair,
  Loader2,
} from 'lucide-react';
import {
  FilterSidebar,
  InstituteHorizontalCard,
  InstituteHorizontalCardSkeleton,
} from '@/components/search';
import { useInstituteSearch, SortBy, SortOrder } from '@/hooks/useInstituteSearch';
import { useLeadTracking } from '@/hooks/useLeadTracking';
import { useAuth } from '@/context/AuthContext';
import { City } from '@/types';
import { cityApi } from '@/api';
import { CITIES } from '@/components/helper/cities';
import { detectNearestCity } from '@/lib/location';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCity = searchParams.get('city') || '';
  const initialCityName = searchParams.get('cityName') || '';

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [cityQuery, setCityQuery] = useState(initialCityName);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState<string>(initialCityName);
  const [isLocating, setIsLocating] = useState(false);
  const { trackSearch } = useLeadTracking();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const hasTrackedRef = useRef(false);

  const {
    institutes,
    isLoading,
    error,
    filters,
    setFilters,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    refetch,
  } = useInstituteSearch({
    query: initialQuery,
    cityIdentifier: initialCity,
    cityName: initialCityName,
  });

  // City suggestions
  const citySuggestions =
    cityQuery.length > 0
      ? CITIES.filter((c) =>
          c.toLowerCase().includes(cityQuery.toLowerCase())
        ).slice(0, 8)
      : [];

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch city name if city identifier is present (initial load or sidebar change)
  useEffect(() => {
    const fetchCityName = async () => {
      if (filters.cityIdentifier && !filters.cityName) {
        try {
          const cities = await cityApi.getAll();
          const city = cities.find((c: City) => c.identifier === filters.cityIdentifier);
          if (city) {
            setSelectedCityName(city.name);
            setCityQuery(city.name);
          }
        } catch {
          // ignore
        }
      } else if (filters.cityName) {
        setSelectedCityName(filters.cityName);
        setCityQuery(filters.cityName);
      } else {
        setSelectedCityName('');
        setCityQuery('');
      }
    };
    fetchCityName();
  }, [filters.cityIdentifier, filters.cityName]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    setFilters((prev) => ({ ...prev, query, cityName: cityQuery.trim(), cityIdentifier: '' }));
    trackSearch(query, cityQuery.trim() || undefined, query || undefined);
  };

  // Track search activity on initial load (when user lands via URL)
  // Wait for auth to restore from localStorage before tracking
  useEffect(() => {
    if (isAuthLoading || hasTrackedRef.current) return;
    if ((initialQuery || initialCityName) && isAuthenticated) {
      hasTrackedRef.current = true;
      trackSearch(initialQuery, initialCityName || undefined, initialQuery || undefined);
    }
  }, [isAuthLoading, isAuthenticated, initialQuery, initialCityName, trackSearch]);

  const clearSearch = () => {
    setSearchInput('');
    setCityQuery('');
    setSelectedCityName('');
    setFilters((prev) => ({ ...prev, query: '', cityIdentifier: '', cityName: '' }));
  };

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split('-') as [SortBy, SortOrder];
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleNearMe = async () => {
    setIsLocating(true);
    setShowCityDropdown(false);

    const result = await detectNearestCity(CITIES);

    if (result.city) {
      setCityQuery(result.city);
      setSelectedCityName(result.city);
      setFilters((prev) => ({
        ...prev,
        cityName: result.city as string,
        cityIdentifier: '',
      }));
    }

    setIsLocating(false);
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Top Search Bar */}
      <div className="bg-white border-b border-[var(--gray-200)] relative sm:sticky sm:top-0 sm:z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Logo / Back */}
            <Link href="/" className="flex items-center gap-2 text-[var(--primary)] font-bold text-xl flex-shrink-0">
              <GraduationCap className="w-7 h-7" />
              <span className="hidden sm:inline">My Classes</span>
            </Link>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row items-stretch bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary-100)] transition-all">
                <div className="flex-1 w-full min-w-0 flex items-center gap-2 px-4 py-2.5 border-b sm:border-b-0 sm:border-r border-[var(--gray-200)] rounded-tl-xl rounded-tr-xl sm:rounded-tr-none sm:rounded-bl-xl">
                  <Search className="w-4 h-4 text-[var(--gray-400)] flex-shrink-0" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search coaching classes, courses..."
                    className="w-full bg-transparent text-sm text-[var(--gray-900)] placeholder:text-[var(--gray-400)] outline-none"
                    style={{ outline: 'none', boxShadow: 'none' }}
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput('');
                        setFilters((prev) => ({ ...prev, query: '' }));
                      }}
                      className="p-1 hover:bg-[var(--gray-100)] rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-[var(--gray-400)]" />
                    </button>
                  )}
                </div>
                <div
                  className="relative w-full sm:w-[320px] flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--gray-500)]"
                  ref={cityDropdownRef}
                >
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <input
                    type="text"
                    value={cityQuery}
                    onChange={(e) => {
                      setCityQuery(e.target.value);
                      setShowCityDropdown(true);
                    }}
                    onFocus={() => setShowCityDropdown(true)}
                    placeholder="All Cities"
                    className="w-full bg-transparent text-sm text-[var(--gray-900)] placeholder:text-[var(--gray-400)]  outline-none"
                    style={{ outline: 'none', boxShadow: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCityQuery('');
                      setSelectedCityName('');
                      setFilters((prev) => ({ ...prev, cityIdentifier: '', cityName: '' }));
                      setShowCityDropdown(false);
                    }}
                    className={`p-1 hover:bg-[var(--gray-100)] rounded-full transition-colors flex-shrink-0 ${cityQuery ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                  >
                    <X className="w-4 h-4 text-[var(--gray-400)]" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNearMe}
                    disabled={isLocating}
                    className="hidden sm:flex items-center gap-1 px-2 py-1 bg-[var(--gray-100)] hover:bg-[var(--gray-200)] disabled:opacity-60 disabled:cursor-not-allowed rounded-full text-xs font-medium text-[var(--gray-600)] transition-colors flex-shrink-0"
                  >
                    {isLocating ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Crosshair className="w-3 h-3" />
                    )}
                    {isLocating ? 'Locating...' : 'Near me'}
                  </button>

                  {/* City Suggestions Dropdown */}
                  {showCityDropdown && citySuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-[var(--gray-200)] z-[9999] max-h-45 overflow-y-auto">
                      {citySuggestions.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setCityQuery(city);
                            setSelectedCityName(city);
                            setShowCityDropdown(false);
                            setFilters((prev) => ({
                              ...prev,
                              cityName: city,
                              cityIdentifier: '',
                            }));
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--gray-50)] transition-colors text-left"
                        >
                          <MapPin className="w-4 h-4 text-[var(--gray-400)]" />
                          <span className="text-sm font-medium text-[var(--gray-900)]">{city}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 bg-[var(--accent-green)] hover:bg-[#059669] text-white text-sm font-medium transition-colors flex-shrink-0 rounded-bl-xl rounded-br-xl sm:rounded-bl-none sm:rounded-tr-xl"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            isOpen={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            resultCount={institutes.length}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white rounded-xl border border-[var(--gray-200)] px-4 py-3">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-lg text-sm font-medium text-[var(--gray-700)] hover:bg-[var(--gray-100)] transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>

                {/* Results Count */}
                <div>
                  <h1 className="text-lg font-bold text-[var(--gray-900)]">
                    {isLoading ? (
                      'Searching...'
                    ) : (
                      <>
                        {institutes.length}{' '}
                        <span className="font-normal text-[var(--gray-600)]">
                          coaching {institutes.length === 1 ? 'institute' : 'institutes'} found
                        </span>
                      </>
                    )}
                  </h1>
                  {filters.query && (
                    <p className="text-sm text-[var(--gray-500)]">
                      for &quot;{filters.query}&quot;
                      {selectedCityName ? ` in ${selectedCityName}` : ''}
                    </p>
                  )}
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--gray-600)] hidden sm:inline">Sort by:</span>
                <div className="relative">
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none pl-3 pr-10 py-2 bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-lg text-sm font-medium text-[var(--gray-700)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-100)] outline-none cursor-pointer"
                  >
                    <option value="relevance-desc">Relevance</option>
                    <option value="rating-desc">Highest Rated</option>
                    <option value="rating-asc">Lowest Rated</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="popularity-desc">Most Popular</option>
                    <option value="experience-desc">Most Experienced</option>
                  </select>
                  <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gray-400)] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-6">
                <p className="text-red-700 font-medium">Something went wrong</p>
                <p className="text-red-600 text-sm mt-1">{error.message}</p>
                <button
                  onClick={() => refetch()}
                  className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Results List */}
            <div className="space-y-4">
              {isLoading ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <InstituteHorizontalCardSkeleton key={i} index={i} />
                  ))}
                </>
              ) : institutes.length > 0 ? (
                institutes.map((institute, index) => (
                  <InstituteHorizontalCard
                    key={institute.identifier}
                    institute={institute}
                    index={index}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-[var(--gray-200)] p-12 text-center"
                >
                  <div className="w-16 h-16 bg-[var(--gray-100)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-[var(--gray-400)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">
                    No institutes found
                  </h3>
                  <p className="text-[var(--gray-600)] max-w-md mx-auto mb-6">
                    We couldn&apos;t find any coaching institutes matching your search. Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={() => {
                      setSearchInput('');
                      setCityQuery('');
                      setSelectedCityName('');
                      setFilters((prev) => ({
                        ...prev,
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
                      }));
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--primary)] text-white font-medium rounded-xl hover:bg-[var(--primary-700)] transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
          <div className="flex items-center gap-3 text-[var(--gray-600)]">
            <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
