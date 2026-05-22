'use client';

import { motion } from 'framer-motion';
import {
  Building2,
  BookOpen,
  GraduationCap,
  Search,
  AlertCircle,
} from 'lucide-react';
import { InstituteCard, InstituteCardSkeleton } from '@/components/institute';
import { CourseCard } from '@/components/course';
import { FacultyCard } from '@/components/faculty';
import { SearchResults as SearchResultsType, SearchTab } from '@/hooks/useSearch';
import { Institute, InstituteCourse, Faculty } from '@/types';

interface SearchResultsProps {
  query: string;
  results: SearchResultsType;
  activeTab: SearchTab;
  isLoading: boolean;
  onTabChange: (tab: SearchTab) => void;
}

const tabs = [
  { key: 'all', label: 'All', icon: Search },
  { key: 'institutes', label: 'Institutes', icon: Building2 },
  { key: 'courses', label: 'Courses', icon: BookOpen },
  { key: 'faculty', label: 'Faculty', icon: GraduationCap },
] as const;

export function SearchResults({
  query,
  results,
  activeTab,
  isLoading,
  onTabChange,
}: SearchResultsProps) {
  const { institutes, courses, faculty, totalCount } = results;

  const renderEmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-12 text-center"
    >
      <div className="w-20 h-20 bg-[var(--gray-100)] rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-10 h-10 text-[var(--gray-400)]" />
      </div>
      <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">
        No results found
      </h3>
      <p className="text-[var(--gray-600)] max-w-md mx-auto">
        We couldn&apos;t find anything matching &quot;{query}&quot;. Try adjusting your search
        terms or filters.
      </p>
    </motion.div>
  );

  const renderLoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <InstituteCardSkeleton key={i} index={i} />
      ))}
    </div>
  );

  const renderInstitutes = (items: Institute[], showEmpty: boolean) => {
    if (items.length === 0) {
      if (!showEmpty) return null;
      return (
        <div className="bg-white rounded-xl p-8 text-center border border-dashed border-[var(--gray-300)]">
          <Building2 className="w-8 h-8 text-[var(--gray-400)] mx-auto mb-2" />
          <p className="text-[var(--gray-600)]">No institutes found</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((institute, index) => (
          <InstituteCard key={institute.identifier} institute={institute} index={index} />
        ))}
      </div>
    );
  };

  const renderCourses = (items: InstituteCourse[], showEmpty: boolean) => {
    if (items.length === 0) {
      if (!showEmpty) return null;
      return (
        <div className="bg-white rounded-xl p-8 text-center border border-dashed border-[var(--gray-300)]">
          <BookOpen className="w-8 h-8 text-[var(--gray-400)] mx-auto mb-2" />
          <p className="text-[var(--gray-600)]">No courses found</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((course, index) => (
          <CourseCard key={course.identifier} course={course} index={index} />
        ))}
      </div>
    );
  };

  const renderFaculty = (items: Faculty[], showEmpty: boolean) => {
    if (items.length === 0) {
      if (!showEmpty) return null;
      return (
        <div className="bg-white rounded-xl p-8 text-center border border-dashed border-[var(--gray-300)]">
          <GraduationCap className="w-8 h-8 text-[var(--gray-400)] mx-auto mb-2" />
          <p className="text-[var(--gray-600)]">No faculty found</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((f, index) => (
          <FacultyCard key={f.identifier} faculty={f} index={index} />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-[var(--gray-200)] rounded-lg w-64 animate-pulse" />
        {renderLoadingState()}
      </div>
    );
  }

  if (totalCount === 0 && query) {
    return renderEmptyState();
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const count =
            tab.key === 'all'
              ? totalCount
              : tab.key === 'institutes'
              ? institutes.length
              : tab.key === 'courses'
              ? courses.length
              : faculty.length;

          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key as SearchTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-white text-[var(--gray-600)] hover:bg-[var(--gray-100)] border border-[var(--gray-200)]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.key
                    ? 'bg-white/20'
                    : 'bg-[var(--gray-100)]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="space-y-8">
        {(activeTab === 'all' || activeTab === 'institutes') &&
          institutes.length > 0 && (
            <section>
              {activeTab === 'all' && (
                <h2 className="text-lg font-bold text-[var(--gray-900)] mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[var(--primary)]" />
                  Institutes
                  <span className="text-sm font-normal text-[var(--gray-500)]">
                    ({institutes.length})
                  </span>
                </h2>
              )}
              {renderInstitutes(institutes, activeTab === 'institutes')}
            </section>
          )}

        {(activeTab === 'all' || activeTab === 'courses') &&
          courses.length > 0 && (
            <section>
              {activeTab === 'all' && (
                <h2 className="text-lg font-bold text-[var(--gray-900)] mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[var(--accent-purple)]" />
                  Courses
                  <span className="text-sm font-normal text-[var(--gray-500)]">
                    ({courses.length})
                  </span>
                </h2>
              )}
              {renderCourses(courses, activeTab === 'courses')}
            </section>
          )}

        {(activeTab === 'all' || activeTab === 'faculty') &&
          faculty.length > 0 && (
            <section>
              {activeTab === 'all' && (
                <h2 className="text-lg font-bold text-[var(--gray-900)] mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[var(--accent-orange)]" />
                  Faculty
                  <span className="text-sm font-normal text-[var(--gray-500)]">
                    ({faculty.length})
                  </span>
                </h2>
              )}
              {renderFaculty(faculty, activeTab === 'faculty')}
            </section>
          )}
      </div>

      {/* No Results for Tab */}
      {activeTab !== 'all' &&
        totalCount > 0 &&
        ((activeTab === 'institutes' && institutes.length === 0) ||
          (activeTab === 'courses' && courses.length === 0) ||
          (activeTab === 'faculty' && faculty.length === 0)) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-8 text-center"
          >
            <AlertCircle className="w-12 h-12 text-[var(--gray-400)] mx-auto mb-3" />
            <p className="text-[var(--gray-600)]">
              No {activeTab} found for &quot;{query}&quot;
            </p>
          </motion.div>
        )}
    </div>
  );
}
