'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { InstituteCard } from './InstituteCard';
import { InstituteCardSkeleton } from './InstituteCardSkeleton';
import { instituteApi } from '@/api';
import { Institute } from '@/types';

interface SimilarInstitutesProps {
  instituteIdentifier: string;
  maxItems?: number;
}

export function SimilarInstitutes({
  instituteIdentifier,
  maxItems = 4,
}: SimilarInstitutesProps) {
  const [similarInstitutes, setSimilarInstitutes] = useState<Institute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      setIsLoading(true);
      try {
        // For now, fetch all institutes and filter client-side
        // In a real app, you'd have a dedicated API endpoint for similar institutes
        const allInstitutes = await instituteApi.getAll();
        
        // Filter out current institute and limit results
        const filtered = allInstitutes
          .filter((i) => i.identifier !== instituteIdentifier)
          .slice(0, maxItems);
        
        setSimilarInstitutes(filtered);
      } catch (err) {
        console.error('Failed to fetch similar institutes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilar();
  }, [instituteIdentifier, maxItems]);

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-[var(--accent-orange)]" />
          <h2 className="text-xl font-bold text-[var(--gray-900)]">
            Similar Institutes
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <InstituteCardSkeleton key={i} index={i} />
          ))}
        </div>
      </div>
    );
  }

  if (similarInstitutes.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-[var(--accent-orange)]" />
        <h2 className="text-xl font-bold text-[var(--gray-900)]">
          You May Also Like
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {similarInstitutes.map((institute, index) => (
          <InstituteCard
            key={institute.identifier}
            institute={institute}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
