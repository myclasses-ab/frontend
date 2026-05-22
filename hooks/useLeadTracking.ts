/**
 * Lead Tracking Hook
 * Tracks student search behavior and institute visits on the User entity.
 * User = Lead. One logged-in student is one lead.
 * Stores plain text names (e.g. "Mumbai", "JEE") not identifiers.
 */

import { useCallback } from 'react';
import { userApi } from '@/api';
import { useAuth } from '@/context/AuthContext';

export function useLeadTracking() {
  const { user, isAuthenticated } = useAuth();

  const trackSearch = useCallback(
    async (query: string, cityName?: string, examName?: string) => {
      if (!isAuthenticated || !user?.identifier) return;

      try {
        await userApi.trackActivity(user.identifier, {
          city: cityName || undefined,
          exam: examName || query || undefined,
        });
      } catch (err) {
        console.debug('Activity tracking failed:', err);
      }
    },
    [isAuthenticated, user?.identifier]
  );

  const trackInstituteVisit = useCallback(
    async (instituteIdentifier: string, instituteName: string) => {
      if (!isAuthenticated || !user?.identifier) return;

      try {
        await userApi.trackActivity(user.identifier, {
          instituteIdentifier,
          instituteName,
        });
      } catch (err) {
        console.debug('Activity tracking failed:', err);
      }
    },
    [isAuthenticated, user?.identifier]
  );

  const trackBrowse = useCallback(async () => {
    // No-op for browse - we only track authenticated user activity
  }, []);

  return { trackSearch, trackInstituteVisit, trackBrowse };
}
