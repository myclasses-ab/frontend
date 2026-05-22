'use client';

import { motion } from 'framer-motion';
import { Users, Search, Filter, Award, GraduationCap, Clock } from 'lucide-react';
import { Faculty } from '@/types';
import { FacultyCard } from './FacultyCard';
import { useState, useMemo } from 'react';

interface FacultyGridProps {
  faculty: Faculty[];
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  showStats?: boolean;
  featuredFirst?: boolean;
}

export function FacultyGrid({
  faculty,
  isLoading = false,
  title = 'Our Faculty',
  subtitle = 'Learn from the best educators in the industry',
  showFilters = true,
  showStats = true,
  featuredFirst = true,
}: FacultyGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBackground, setFilterBackground] = useState<'all' | 'iit' | 'nit'>('all');
  const [filterExperience, setFilterExperience] = useState<'all' | '5+' | '10+' | '15+'>('all');

  // Filter and sort faculty
  const filteredFaculty = useMemo(() => {
    let result = [...faculty];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.specialization?.toLowerCase().includes(query) ||
          f.designation.toLowerCase().includes(query)
      );
    }

    // Background filter
    if (filterBackground !== 'all') {
      if (filterBackground === 'iit') {
        result = result.filter((f) => f.iitIimBackground);
      } else if (filterBackground === 'nit') {
        result = result.filter((f) => f.nitBackground);
      }
    }

    // Experience filter
    if (filterExperience !== 'all') {
      const minYears = parseInt(filterExperience);
      result = result.filter((f) => f.experienceYears >= minYears);
    }

    // Sort: Featured first (IIT/IIM/NIT), then by rating
    if (featuredFirst) {
      result.sort((a, b) => {
        const aFeatured = a.iitIimBackground || a.nitBackground;
        const bFeatured = b.iitIimBackground || b.nitBackground;
        if (aFeatured && !bFeatured) return -1;
        if (!aFeatured && bFeatured) return 1;
        return Number(b.studentRating) - Number(a.studentRating);
      });
    }

    return result;
  }, [faculty, searchQuery, filterBackground, filterExperience, featuredFirst]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = faculty.length;
    const iitCount = faculty.filter((f) => f.iitIimBackground).length;
    const nitCount = faculty.filter((f) => f.nitBackground).length;
    const avgExperience = total > 0 
      ? Math.round(faculty.reduce((sum, f) => sum + f.experienceYears, 0) / total)
      : 0;

    return { total, iitCount, nitCount, avgExperience };
  }, [faculty]);

  // Get featured faculty
  const featuredFaculty = useMemo(() => {
    return filteredFaculty.filter((f) => f.iitIimBackground || f.nitBackground).slice(0, 2);
  }, [filteredFaculty]);

  const regularFaculty = useMemo(() => {
    return filteredFaculty.filter((f) => !f.iitIimBackground && !f.nitBackground);
  }, [filteredFaculty]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-8 bg-[var(--gray-200)] rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <FacultyCardSkeleton key={i} index={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-[var(--gray-900)] mb-2"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[var(--gray-600)]"
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Stats */}
      {showStats && stats.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="p-4 bg-white rounded-xl border border-[var(--gray-200)] text-center">
            <Users className="w-6 h-6 text-[var(--primary)] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[var(--gray-900)]">{stats.total}</p>
            <p className="text-sm text-[var(--gray-500)]">Total Faculty</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[var(--gray-200)] text-center">
            <Award className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[var(--gray-900)]">{stats.iitCount}</p>
            <p className="text-sm text-[var(--gray-500)]">IIT/IIM Alumni</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[var(--gray-200)] text-center">
            <GraduationCap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[var(--gray-900)]">{stats.nitCount}</p>
            <p className="text-sm text-[var(--gray-500)]">NIT Alumni</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[var(--gray-200)] text-center">
            <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[var(--gray-900)]">{stats.avgExperience}+</p>
            <p className="text-sm text-[var(--gray-500)]">Avg Experience</p>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-white rounded-xl border border-[var(--gray-200)]"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--gray-400)]" />
              <input
                type="text"
                placeholder="Search faculty by name or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-200)] focus:border-[var(--primary)]"
              />
            </div>

            {/* Background Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[var(--gray-400)]" />
              <select
                value={filterBackground}
                onChange={(e) => setFilterBackground(e.target.value as any)}
                className="px-3 py-2 bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-200)] focus:border-[var(--primary)]"
              >
                <option value="all">All Backgrounds</option>
                <option value="iit">IIT/IIM Alumni</option>
                <option value="nit">NIT Alumni</option>
              </select>
            </div>

            {/* Experience Filter */}
            <select
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value as any)}
              className="px-3 py-2 bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-200)] focus:border-[var(--primary)]"
            >
              <option value="all">All Experience</option>
              <option value="5+">5+ years</option>
              <option value="10+">10+ years</option>
              <option value="15+">15+ years</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Featured Faculty Section */}
      {featuredFaculty.length > 0 && filterBackground !== 'all' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-[var(--gray-900)] flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Featured Faculty
          </h3>
          <div className="grid gap-6">
            {featuredFaculty.map((f, i) => (
              <FacultyCard key={f.identifier} faculty={f} index={i} variant="featured" />
            ))}
          </div>
        </motion.div>
      )}

      {/* Regular Faculty Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filterBackground === 'all' ? (
          // Show all faculty when no background filter
          filteredFaculty.map((f, i) => (
            <FacultyCard key={f.identifier} faculty={f} index={i} />
          ))
        ) : (
          // Show only non-featured when filter is applied
          regularFaculty.map((f, i) => (
            <FacultyCard key={f.identifier} faculty={f} index={i} />
          ))
        )}
      </motion.div>

      {/* Empty State */}
      {filteredFaculty.length === 0 && (
        <div className="text-center py-12 bg-[var(--gray-50)] rounded-2xl">
          <Users className="w-12 h-12 text-[var(--gray-300)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[var(--gray-700)] mb-2">No faculty found</h3>
          <p className="text-[var(--gray-500)]">Try adjusting your filters to see more results</p>
        </div>
      )}
    </div>
  );
}

// Skeleton for faculty card
function FacultyCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative bg-white rounded-2xl shadow-sm border border-[var(--gray-200)] overflow-hidden"
    >
      {/* Header skeleton */}
      <div className="relative h-24 bg-[var(--gray-100)] animate-pulse">
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="w-20 h-20 rounded-full border-4 border-white bg-[var(--gray-200)]" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="pt-12 pb-5 px-5 text-center">
        <div className="h-6 bg-[var(--gray-200)] rounded w-3/4 mx-auto mb-2 animate-pulse" />
        <div className="h-4 bg-[var(--gray-100)] rounded w-1/2 mx-auto mb-3 animate-pulse" />
        <div className="flex justify-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-[var(--gray-200)] rounded animate-pulse" />
          ))}
        </div>
        <div className="h-4 bg-[var(--gray-100)] rounded w-2/3 mx-auto mb-2 animate-pulse" />
        <div className="flex justify-center gap-4 mt-4">
          <div className="h-4 bg-[var(--gray-200)] rounded w-20 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}
