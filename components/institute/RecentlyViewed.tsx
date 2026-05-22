'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useInstituteStore } from '@/store/instituteStore';
import { instituteApi } from '@/api';
import { Institute } from '@/types';

interface RecentlyViewedProps {
  maxItems?: number;
  className?: string;
}

export function RecentlyViewed({ maxItems = 4, className = '' }: RecentlyViewedProps) {
  const { recentlyViewed, addToRecentlyViewed } = useInstituteStore();
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const fetchInstitutes = async () => {
      if (recentlyViewed.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const slugs = recentlyViewed.slice(0, maxItems);
        const instituteData = await Promise.all(
          slugs.map((slug) => instituteApi.findBySlug(slug))
        );
        const validInstitutes = instituteData.filter(
          (i): i is Institute => i !== null
        );
        setInstitutes(validInstitutes);
      } catch (err) {
        console.error('Failed to fetch recently viewed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstitutes();
  }, [recentlyViewed, maxItems]);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('recently-viewed-scroll');
    if (!container) return;
    
    const scrollAmount = 280;
    const newPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount;
    
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollLeft);
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[var(--primary)]" />
          <h2 className="text-lg font-bold text-[var(--gray-900)]">Recently Viewed</h2>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-64 h-24 bg-[var(--gray-200)] rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (institutes.length === 0) {
    return null;
  }

  const logoImage = '/assests/sample_image_for_anything.png';

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[var(--primary)]" />
          <h2 className="text-lg font-bold text-[var(--gray-900)]">
            Recently Viewed
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 hover:bg-[var(--gray-100)] rounded-lg transition-colors disabled:opacity-30"
            disabled={scrollPosition <= 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 hover:bg-[var(--gray-100)] rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        id="recently-viewed-scroll"
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2 -mx-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {institutes.map((institute, index) => (
          <motion.div
            key={institute.identifier}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-64"
          >
            <Link
              href={`/institutes/${institute.slug}`}
              className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[var(--gray-200)] hover:border-[var(--primary)] hover:shadow-md transition-all group"
            >
              <div className="w-14 h-14 rounded-lg bg-[var(--gray-100)] flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image
                  src={logoImage}
                  alt={institute.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--gray-900)] text-sm line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
                  {institute.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Eye className="w-3 h-3 text-[var(--gray-400)]" />
                  <span className="text-xs text-[var(--gray-500)]">Viewed recently</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
