'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Scale,
  Plus,
  ArrowLeft,
  AlertCircle,
  Search,
} from 'lucide-react';
import { CompareTable, CompareCard } from '@/components/compare';
import { useComparison } from '@/hooks/useComparison';
import { instituteApi, instituteFacilityApi } from '@/api';
import { Institute, InstituteFacility } from '@/types';

function CompareContent() {
  const searchParams = useSearchParams();
  const urlSlugs = searchParams.get('institutes')?.split(',').filter(Boolean) || [];
  
  const { selectedSlugs, removeFromComparison, clearComparison } = useComparison();
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [facilities, setFacilities] = useState<(InstituteFacility | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use URL slugs or store slugs, limited to 3
  const slugsToCompare = (urlSlugs.length > 0 ? urlSlugs : selectedSlugs).slice(0, 3);

  useEffect(() => {
    const fetchData = async () => {
      if (slugsToCompare.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const instituteData = await Promise.all(
          slugsToCompare.map((slug) => instituteApi.findBySlug(slug))
        );

        const validInstitutes = instituteData.filter(
          (i): i is Institute => i !== null
        );

        setInstitutes(validInstitutes);

        // Fetch facilities for each institute
        const facilityData = await Promise.all(
          validInstitutes.map((inst) =>
            instituteFacilityApi.findByInstituteIdentifier(inst.identifier).catch(() => null)
          )
        );

        setFacilities(facilityData);
      } catch (err) {
        setError('Failed to load comparison data');
        console.error('Compare error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slugsToCompare.join(',')]);

  const handleRemove = (slug: string) => {
    removeFromComparison(slug);
    setInstitutes((prev) => prev.filter((i) => i.slug !== slug));
  };

  // Empty state
  if (slugsToCompare.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 bg-[var(--primary-100)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="w-10 h-10 text-[var(--primary)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--gray-900)] mb-3">
            Compare Institutes
          </h1>
          <p className="text-[var(--gray-600)] mb-8">
            Select up to 3 institutes to compare side-by-side. Add institutes from the
            listing page to start comparing.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white font-medium rounded-xl hover:bg-[var(--primary-700)] transition-colors"
          >
            <Search className="w-4 h-4" />
            Browse Institutes
          </Link>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-[var(--gray-200)] rounded w-64 mb-8" />
            <div className="h-96 bg-[var(--gray-200)] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center py-16">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-[var(--gray-600)]">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-700)] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gray-50)] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[var(--gray-200)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-[var(--gray-100)] rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-[var(--gray-900)]">
                  Compare Institutes
                </h1>
                <p className="text-sm text-[var(--gray-500)]">
                  Side-by-side comparison of {institutes.length} institute
                  {institutes.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearComparison}
                className="px-4 py-2.5 text-sm font-medium text-[var(--gray-600)] hover:text-[var(--gray-900)] hover:bg-[var(--gray-100)] rounded-xl transition-colors"
              >
                Clear All
              </button>
              {institutes.length < 3 && (
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary-50)] text-[var(--primary)] font-medium rounded-xl hover:bg-[var(--primary-100)] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add More
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selected Institutes Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence mode="popLayout">
            {institutes.map((institute) => (
              <CompareCard
                key={institute.identifier}
                institute={institute}
                onRemove={() => handleRemove(institute.slug)}
              />
            ))}
            {/* Empty slots */}
            {institutes.length < 3 && (
              <Link
                href="/"
                className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-[var(--gray-300)] rounded-2xl hover:border-[var(--primary)] hover:bg-[var(--primary-50)] transition-all min-h-[200px]"
              >
                <div className="w-12 h-12 bg-[var(--gray-100)] rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-[var(--gray-400)]" />
                </div>
                <span className="font-medium text-[var(--gray-600)]">
                  Add Institute
                </span>
              </Link>
            )}
          </AnimatePresence>
        </div>

        {/* Comparison Table */}
        {institutes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">
              Detailed Comparison
            </h2>
            <CompareTable institutes={institutes} facilities={facilities} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
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
      <CompareContent />
    </Suspense>
  );
}
