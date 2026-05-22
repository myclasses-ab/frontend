'use client';

import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  GraduationCap,
  BookOpen,
  IndianRupee,
  Clock,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { Standard, CourseType } from '@/types';

interface CourseFiltersProps {
  filters: {
    searchQuery: string;
    standard: Standard | null;
    courseType: CourseType | null;
    minFee: number | null;
    maxFee: number | null;
    admissionOpen: boolean | null;
  };
  onSearchChange: (query: string) => void;
  onStandardChange: (standard: Standard | null) => void;
  onCourseTypeChange: (type: CourseType | null) => void;
  onFeeRangeChange: (min: number | null, max: number | null) => void;
  onAdmissionOpenChange: (open: boolean | null) => void;
  onReset: () => void;
  resultCount: number;
}

const standardOptions: { value: Standard; label: string }[] = [
  { value: Standard.STANDARD_10, label: 'Class 10' },
  { value: Standard.STANDARD_11, label: 'Class 11' },
  { value: Standard.STANDARD_12, label: 'Class 12' },
  { value: Standard.DROPPER, label: 'Dropper' },
  { value: Standard.STANDARD_11_AND_12, label: 'Class 11-12' },
];

const courseTypeOptions: { value: CourseType; label: string }[] = [
  { value: CourseType.REGULAR, label: 'Regular' },
  { value: CourseType.CRASH, label: 'Crash Course' },
  { value: CourseType.WEEKEND, label: 'Weekend' },
  { value: CourseType.ONLINE, label: 'Online' },
  { value: CourseType.HYBRID, label: 'Hybrid' },
];

const feeRanges = [
  { label: 'Under ₹50K', min: 0, max: 50000 },
  { label: '₹50K - ₹1L', min: 50000, max: 100000 },
  { label: '₹1L - ₹2L', min: 100000, max: 200000 },
  { label: 'Above ₹2L', min: 200000, max: null },
];

export function CourseFilters({
  filters,
  onSearchChange,
  onStandardChange,
  onCourseTypeChange,
  onFeeRangeChange,
  onAdmissionOpenChange,
  onReset,
  resultCount,
}: CourseFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const hasActiveFilters =
    filters.standard !== null ||
    filters.courseType !== null ||
    filters.minFee !== null ||
    filters.admissionOpen !== null;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--gray-400)]" />
        <input
          type="text"
          placeholder="Search courses by name..."
          value={filters.searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-[var(--gray-200)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-200)] focus:border-[var(--primary)] shadow-sm"
        />
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:flex items-center gap-3 flex-wrap">
        {/* Standard Filter */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--gray-200)] rounded-xl hover:border-[var(--primary-300)] transition-colors">
            <GraduationCap className="w-4 h-4 text-[var(--gray-500)]" />
            <span className="text-sm text-[var(--gray-700)]">
              {filters.standard ? standardOptions.find(s => s.value === filters.standard)?.label : 'Standard'}
            </span>
            <ChevronDown className="w-4 h-4 text-[var(--gray-400)]" />
          </button>
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[var(--gray-200)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
            <div className="p-2">
              <button
                onClick={() => onStandardChange(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  filters.standard === null ? 'bg-[var(--primary-50)] text-[var(--primary)]' : 'hover:bg-[var(--gray-50)]'
                }`}
              >
                All Standards
              </button>
              {standardOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onStandardChange(option.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.standard === option.value ? 'bg-[var(--primary-50)] text-[var(--primary)]' : 'hover:bg-[var(--gray-50)]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Type Filter */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--gray-200)] rounded-xl hover:border-[var(--primary-300)] transition-colors">
            <BookOpen className="w-4 h-4 text-[var(--gray-500)]" />
            <span className="text-sm text-[var(--gray-700)]">
              {filters.courseType ? courseTypeOptions.find(t => t.value === filters.courseType)?.label : 'Course Type'}
            </span>
            <ChevronDown className="w-4 h-4 text-[var(--gray-400)]" />
          </button>
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[var(--gray-200)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
            <div className="p-2">
              <button
                onClick={() => onCourseTypeChange(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  filters.courseType === null ? 'bg-[var(--primary-50)] text-[var(--primary)]' : 'hover:bg-[var(--gray-50)]'
                }`}
              >
                All Types
              </button>
              {courseTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onCourseTypeChange(option.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.courseType === option.value ? 'bg-[var(--primary-50)] text-[var(--primary)]' : 'hover:bg-[var(--gray-50)]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fee Range Filter */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--gray-200)] rounded-xl hover:border-[var(--primary-300)] transition-colors">
            <IndianRupee className="w-4 h-4 text-[var(--gray-500)]" />
            <span className="text-sm text-[var(--gray-700)]">
              {filters.minFee !== null 
                ? feeRanges.find(r => r.min === filters.minFee)?.label 
                : 'Fee Range'}
            </span>
            <ChevronDown className="w-4 h-4 text-[var(--gray-400)]" />
          </button>
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[var(--gray-200)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
            <div className="p-2">
              <button
                onClick={() => onFeeRangeChange(null, null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  filters.minFee === null ? 'bg-[var(--primary-50)] text-[var(--primary)]' : 'hover:bg-[var(--gray-50)]'
                }`}
              >
                All Fees
              </button>
              {feeRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => onFeeRangeChange(range.min, range.max)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.minFee === range.min ? 'bg-[var(--primary-50)] text-[var(--primary)]' : 'hover:bg-[var(--gray-50)]'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Admission Status */}
        <button
          onClick={() => onAdmissionOpenChange(filters.admissionOpen === true ? null : true)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-colors ${
            filters.admissionOpen === true
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-white border-[var(--gray-200)] hover:border-[var(--primary-300)]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm">Admission Open</span>
        </button>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-[var(--gray-500)] hover:text-[var(--primary)] transition-colors"
          >
            <X className="w-4 h-4" />
            Clear filters
          </button>
        )}

        {/* Results Count */}
        <div className="ml-auto text-sm text-[var(--gray-500)]">
          Showing <span className="font-semibold text-[var(--gray-900)]">{resultCount}</span> courses
        </div>
      </div>

      {/* Mobile Filters Toggle */}
      <div className="lg:hidden flex items-center justify-between">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--gray-200)] rounded-xl"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-[var(--primary)] rounded-full" />
          )}
        </button>
        <span className="text-sm text-[var(--gray-500)]">
          {resultCount} courses
        </span>
      </div>

      {/* Mobile Filters Panel */}
      {showMobileFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="lg:hidden p-4 bg-white rounded-xl border border-[var(--gray-200)] space-y-4"
        >
          {/* Standard */}
          <div>
            <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
              Standard
            </label>
            <select
              value={filters.standard || ''}
              onChange={(e) => onStandardChange(e.target.value as Standard || null)}
              className="w-full px-3 py-2 bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-lg text-sm"
            >
              <option value="">All Standards</option>
              {standardOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Course Type */}
          <div>
            <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
              Course Type
            </label>
            <select
              value={filters.courseType || ''}
              onChange={(e) => onCourseTypeChange(e.target.value as CourseType || null)}
              className="w-full px-3 py-2 bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-lg text-sm"
            >
              <option value="">All Types</option>
              {courseTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Fee Range */}
          <div>
            <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
              Fee Range
            </label>
            <select
              value={filters.minFee !== null ? `${filters.minFee}-${filters.maxFee}` : ''}
              onChange={(e) => {
                if (e.target.value === '') {
                  onFeeRangeChange(null, null);
                } else {
                  const [min, max] = e.target.value.split('-').map(v => v === 'null' ? null : parseInt(v));
                  onFeeRangeChange(min, max);
                }
              }}
              className="w-full px-3 py-2 bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-lg text-sm"
            >
              <option value="">All Fees</option>
              {feeRanges.map((range) => (
                <option key={range.label} value={`${range.min}-${range.max}`}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Admission Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="mobile-admission-open"
              checked={filters.admissionOpen === true}
              onChange={(e) => onAdmissionOpenChange(e.target.checked ? true : null)}
              className="w-4 h-4 rounded border-[var(--gray-300)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <label htmlFor="mobile-admission-open" className="text-sm text-[var(--gray-700)]">
              Admission Open Only
            </label>
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="w-full py-2 text-sm text-[var(--primary)] font-medium"
            >
              Clear all filters
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
