/**
 * useBookmarks Hook
 * Manage user bookmarks with optimistic updates
 */

import { useState, useCallback, useEffect } from 'react';
import { bookmarkApi } from '@/api';
import { Bookmark, BookmarkEntityType } from '@/types';

// TODO: Replace with actual auth context when available
const MOCK_USER_ID = 'user-001';

interface UseBookmarksReturn {
  bookmarks: Bookmark[];
  isLoading: boolean;
  error: Error | null;
  toggleBookmark: (entityType: BookmarkEntityType, entityId: string) => Promise<void>;
  isBookmarked: (entityType: BookmarkEntityType, entityId: string) => boolean;
  refetch: () => Promise<void>;
}

export function useBookmarks(): UseBookmarksReturn {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookmarkApi.findByUserIdentifier(MOCK_USER_ID);
      setBookmarks(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch bookmarks'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const isBookmarked = useCallback(
    (entityType: BookmarkEntityType, entityId: string): boolean => {
      return bookmarks.some(
        (b) => b.entityType === entityType && b.entityIdentifier === entityId
      );
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    async (entityType: BookmarkEntityType, entityId: string) => {
      const existingBookmark = bookmarks.find(
        (b) => b.entityType === entityType && b.entityIdentifier === entityId
      );

      // Optimistic update
      if (existingBookmark) {
        setBookmarks((prev) =>
          prev.filter((b) => b.identifier !== existingBookmark.identifier)
        );
      } else {
        const optimisticBookmark: Bookmark = {
          identifier: `temp-${Date.now()}`,
          userIdentifier: MOCK_USER_ID,
          entityType,
          entityIdentifier: entityId,
          createdAt: new Date().toISOString(),
        };
        setBookmarks((prev) => [optimisticBookmark, ...prev]);
      }

      try {
        if (existingBookmark) {
          await bookmarkApi.delete(existingBookmark.identifier);
        } else {
          await bookmarkApi.create({
            userIdentifier: MOCK_USER_ID,
            entityType,
            entityIdentifier: entityId,
            createdAt: new Date().toISOString(),
          });
          // Refetch to get the real identifier
          await fetchBookmarks();
        }
      } catch (err) {
        // Revert optimistic update on error
        await fetchBookmarks();
        throw err;
      }
    },
    [bookmarks, fetchBookmarks]
  );

  return {
    bookmarks,
    isLoading,
    error,
    toggleBookmark,
    isBookmarked,
    refetch: fetchBookmarks,
  };
}
