'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Check } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { BookmarkEntityType } from '@/types';

interface BookmarkButtonProps {
  entityType: BookmarkEntityType;
  entityIdentifier: string;
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
}

export function BookmarkButton({
  entityType,
  entityIdentifier,
  variant = 'default',
  className = '',
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark, isLoading } = useBookmarks();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const bookmarked = isBookmarked(entityType, entityIdentifier);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    try {
      await toggleBookmark(entityType, entityIdentifier);
      setToastMessage(bookmarked ? 'Removed from saved' : 'Saved successfully');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      setToastMessage('Failed to update bookmark');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const baseClasses =
    'relative flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2';

  const variantClasses = {
    default:
      'gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-[var(--gray-200)] hover:border-[var(--primary)] hover:bg-[var(--primary-50)]',
    compact:
      'gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--gray-200)] hover:border-[var(--primary)] hover:bg-[var(--primary-50)]',
    'icon-only':
      'w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg border border-[var(--gray-100)]',
  };

  const stateClasses = bookmarked
    ? 'text-red-500 border-red-200 bg-red-50'
    : 'text-[var(--gray-600)] hover:text-[var(--primary)]';

  return (
    <>
      <motion.button
        onClick={handleClick}
        disabled={isLoading}
        whileTap={{ scale: 0.95 }}
        className={`${baseClasses} ${variantClasses[variant]} ${stateClasses} ${className}`}
        aria-label={bookmarked ? 'Remove from saved' : 'Save for later'}
        aria-pressed={bookmarked}
      >
        <motion.div
          initial={false}
          animate={bookmarked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={`${
              variant === 'icon-only' ? 'w-5 h-5' : variant === 'compact' ? 'w-3.5 h-3.5' : 'w-4 h-4'
            } ${bookmarked ? 'fill-current' : ''}`}
          />
        </motion.div>
        {variant !== 'icon-only' && (
          <span>{bookmarked ? 'Saved' : 'Save'}</span>
        )}
      </motion.button>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 10, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 flex items-center gap-2 px-4 py-2.5 bg-[var(--gray-900)] text-white text-sm font-medium rounded-full shadow-lg"
          >
            <Check className="w-4 h-4 text-green-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
