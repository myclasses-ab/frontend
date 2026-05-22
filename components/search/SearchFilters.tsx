'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  SlidersHorizontal,
  MapPin,
  Star,
  Building2,
  IndianRupee,
  CheckCircle,
  ChevronDown,
} from 'lucide-react';
import { SearchFilters as SearchFiltersType } from '@/hooks/useSearch';
import { cityApi, examTypeApi } from '@/api';
import { City, ExamType } from '@/types';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFilterChange: (filters: SearchFiltersType) => void;
  isOpen: boolean;
  onClose: () => void;
  resultCount: number;
}

export function SearchFilters({
  filters,
  onFilterChange,
  isOpen,
  onClose,
  resultCount,
}: SearchFiltersProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(['rating', 'cities']);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesData, examTypesData] = await Promise.all([
          cityApi.getAll(),
          examTypeApi.getAll(),
        ]);
        setCities(citiesData);
        setExamTypes(examTypesData);
      } catch (err) {
        console.error('Failed to fetch filter data:', err);
      }
    };
    fetchData();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const updateFilter = <K extends keyof SearchFiltersType>(
    key: K,
    value: SearchFiltersType[K]
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleCity = (cityName: string) => {
    const newCities = filters.cities.includes(cityName)
      ? filters.cities.filter((c) => c !== cityName)
      : [...filters.cities, cityName];
    updateFilter('cities', newCities);
  };

  const toggleExamType = (examType: string) => {
    const newExamTypes = filters.examTypes.includes(examType)
      ? filters.examTypes.filter((e) => e !== examType)
      : [...filters.examTypes, examType];
    updateFilter('examTypes', newExamTypes);
  };

  const clearAllFilters = () => {
    onFilterChange({
      cities: [],
      examTypes: [],
      minRating: 0,
      maxFees: null,
      hasHostel: null,
      isVerified: null,
    });
  };

  const hasActiveFilters =
    filters.cities.length > 0 ||
    filters.examTypes.length > 0 ||
    filters.minRating > 0 ||
    filters.maxFees !== null ||
    filters.hasHostel !== null ||
    filters.isVerified !== null;

  const activeFilterCount =
    filters.cities.length +
    filters.examTypes.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.maxFees !== null ? 1 : 0) +
    (filters.hasHostel !== null ? 1 : 0) +
    (filters.isVerified !== null ? 1 : 0);

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between lg:hidden">
        <h3 className="text-lg font-bold text-[var(--gray-900)]">Filters</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-[var(--gray-100)] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Active Filters Count */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--gray-600)]">
            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
          </span>
          <button
            onClick={clearAllFilters}
            className="text-sm text-[var(--primary)] hover:underline font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Rating Filter */}
      <div className="border-b border-[var(--gray-100)] pb-4">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between mb-3"
        >
          <div className="flex items-center gap-2 text-[var(--gray-900)] font-medium">
            <Star className="w-4 h-4 text-amber-400" />
            Minimum Rating
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[var(--gray-400)] transition-transform ${
              expandedSections.includes('rating') ? 'rotate-180' : ''
            }`}
          />
        </button>
        <AnimatePresence>
          {expandedSections.includes('rating') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              {[4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() =>
                    updateFilter('minRating', filters.minRating === rating ? 0 : rating)
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    filters.minRating === rating
                      ? 'bg-[var(--primary-50)] text-[var(--primary)]'
                      : 'hover:bg-[var(--gray-50)]'
                  }`}
                >
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-[var(--gray-300)]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">& Up</span>
                  {filters.minRating === rating && (
                    <CheckCircle className="w-4 h-4 ml-auto" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cities Filter */}
      {cities.length > 0 && (
        <div className="border-b border-[var(--gray-100)] pb-4">
          <button
            onClick={() => toggleSection('cities')}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2 text-[var(--gray-900)] font-medium">
              <MapPin className="w-4 h-4 text-[var(--primary)]" />
              Cities
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[var(--gray-400)] transition-transform ${
                expandedSections.includes('cities') ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {expandedSections.includes('cities') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1 max-h-48 overflow-y-auto"
              >
                {cities.map((city) => (
                  <button
                    key={city.identifier}
                    onClick={() => toggleCity(city.name)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left ${
                      filters.cities.includes(city.name)
                        ? 'bg-[var(--primary-50)] text-[var(--primary)]'
                        : 'hover:bg-[var(--gray-50)]'
                    }`}
                  >
                    <span className="text-sm">{city.name}</span>
                    {filters.cities.includes(city.name) && (
                      <CheckCircle className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Exam Types Filter */}
      {examTypes.length > 0 && (
        <div className="border-b border-[var(--gray-100)] pb-4">
          <button
            onClick={() => toggleSection('exams')}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2 text-[var(--gray-900)] font-medium">
              <Building2 className="w-4 h-4 text-[var(--accent-purple)]" />
              Exam Types
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[var(--gray-400)] transition-transform ${
                expandedSections.includes('exams') ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {expandedSections.includes('exams') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1 max-h-48 overflow-y-auto"
              >
                {examTypes.map((exam) => (
                  <button
                    key={exam.identifier}
                    onClick={() => toggleExamType(exam.name)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left ${
                      filters.examTypes.includes(exam.name)
                        ? 'bg-[var(--primary-50)] text-[var(--primary)]'
                        : 'hover:bg-[var(--gray-50)]'
                    }`}
                  >
                    <span className="text-sm">{exam.name}</span>
                    {filters.examTypes.includes(exam.name) && (
                      <CheckCircle className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Max Fees Filter */}
      <div className="border-b border-[var(--gray-100)] pb-4">
        <button
          onClick={() => toggleSection('fees')}
          className="w-full flex items-center justify-between mb-3"
        >
          <div className="flex items-center gap-2 text-[var(--gray-900)] font-medium">
            <IndianRupee className="w-4 h-4 text-green-500" />
            Maximum Fees
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[var(--gray-400)] transition-transform ${
              expandedSections.includes('fees') ? 'rotate-180' : ''
            }`}
          />
        </button>
        <AnimatePresence>
          {expandedSections.includes('fees') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              {[50000, 100000, 200000, 500000].map((fee) => (
                <button
                  key={fee}
                  onClick={() =>
                    updateFilter('maxFees', filters.maxFees === fee ? null : fee)
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    filters.maxFees === fee
                      ? 'bg-[var(--primary-50)] text-[var(--primary)]'
                      : 'hover:bg-[var(--gray-50)]'
                  }`}
                >
                  <span className="text-sm">Under ₹{fee.toLocaleString()}</span>
                  {filters.maxFees === fee && (
                    <CheckCircle className="w-4 h-4 ml-auto" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Other Filters */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--gray-50)] cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={filters.isVerified === true}
            onChange={(e) =>
              updateFilter('isVerified', e.target.checked ? true : null)
            }
            className="w-5 h-5 rounded border-[var(--gray-300)] text-[var(--primary)] focus:ring-[var(--primary)]"
          />
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Verified Institutes Only</span>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--gray-50)] cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={filters.hasHostel === true}
            onChange={(e) =>
              updateFilter('hasHostel', e.target.checked ? true : null)
            }
            className="w-5 h-5 rounded border-[var(--gray-300)] text-[var(--primary)] focus:ring-[var(--primary)]"
          />
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[var(--accent-purple)]" />
            <span className="text-sm font-medium">Hostel Available</span>
          </div>
        </label>
      </div>

      {/* Mobile Apply Button */}
      <div className="lg:hidden pt-4 border-t border-[var(--gray-100)]">
        <button
          onClick={onClose}
          className="w-full py-3 bg-[var(--primary)] text-white font-medium rounded-xl hover:bg-[var(--primary-700)] transition-colors"
        >
          Show {resultCount} Results
        </button>
      </div>
    </div>
  );

  // Desktop sidebar
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-white rounded-2xl p-5 shadow-sm border border-[var(--gray-200)]">
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="font-bold text-[var(--gray-900)]">Filters</h3>
          </div>
          {filterContent}
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-80 max-w-full bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-5">{filterContent}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
