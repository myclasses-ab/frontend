'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Star,
  BadgeCheck,
  Wifi,
  BookOpen,
  MonitorPlay,
  Users,
  Shield,
  ArrowRight,
  Building2,
  Bus,
  UtensilsCrossed,
  Wind,
  FlaskConical,
  FileText,
  Zap,
  Award,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { Institute, InstituteType } from '@/types';
import { instituteBannerUrl, FALLBACK_BANNER_URL } from '@/components/helper/imageHelper';
import { SafeImg } from '@/components/helper/SafeImage';
import { useAuth } from '@/context/AuthContext';

interface InstituteHorizontalCardProps {
  institute: Institute;
  index?: number;
}

function getTypeLabel(type: InstituteType) {
  switch (type) {
    case InstituteType.OFFLINE:
      return 'Offline';
    case InstituteType.ONLINE:
      return 'Online';
    case InstituteType.HYBRID:
      return 'Hybrid';
    default:
      return type;
  }
}

function getTypeColor(type: InstituteType) {
  switch (type) {
    case InstituteType.OFFLINE:
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case InstituteType.ONLINE:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case InstituteType.HYBRID:
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

export function InstituteHorizontalCard({ institute, index = 0 }: InstituteHorizontalCardProps) {
  const { isAuthenticated } = useAuth();
  const rating = typeof institute.averageRating === 'string'
    ? parseFloat(institute.averageRating) || 0
    : institute.averageRating || 0;

  const facilityConfig = [
    { key: 'hasWifi', label: 'WiFi', icon: Wifi },
    { key: 'hasStudyMaterial', label: 'Study Material', icon: BookOpen },
    { key: 'hasLibrary', label: 'Library', icon: BookOpen },
    { key: 'hasDoubtSessions', label: 'Doubt Sessions', icon: Users },
    { key: 'hasOnlinePortal', label: 'Online Portal', icon: MonitorPlay },
    { key: 'hasDigitalBoards', label: 'Digital Boards', icon: MonitorPlay },
    { key: 'hasHostel', label: 'Hostel', icon: Building2 },
    { key: 'hasCanteen', label: 'Canteen', icon: UtensilsCrossed },
    { key: 'hasTransport', label: 'Transport', icon: Bus },
    { key: 'hasAcClassrooms', label: 'AC Classrooms', icon: Wind },
    { key: 'hasLaboratory', label: 'Laboratory', icon: FlaskConical },
    { key: 'hasStudyRoom', label: 'Study Room', icon: BookOpen },
    { key: 'hasCctv', label: 'CCTV', icon: Shield },
    { key: 'hasMockTestSeries', label: 'Mock Tests', icon: FileText },
    { key: 'hasCrashCourses', label: 'Crash Courses', icon: Zap },
    { key: 'hasScholarshipProgram', label: 'Scholarship', icon: Award },
    { key: 'hasFreeDemoClass', label: 'Free Demo', icon: Calendar },
    { key: 'hasParentTeacherMeetings', label: 'PTM', icon: Users },
    { key: 'hasPerformanceTracking', label: 'Performance Tracking', icon: TrendingUp },
  ] as const;

  const facilityMap = institute.facilities as Record<string, boolean> | undefined;
  const availableAmenities = facilityConfig.filter((f) => facilityMap?.[f.key]);
  const displayedAmenities = availableAmenities.slice(0, 4);
  const moreCount = availableAmenities.length - displayedAmenities.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white rounded-2xl border border-[var(--gray-200)] overflow-hidden hover:shadow-lg hover:border-[var(--gray-300)] transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row h-auto md:h-[280px]">
        {/* Image Section */}
        <div className="relative w-full md:w-80 lg:w-96 flex-shrink-0 h-56 md:h-full overflow-hidden bg-[var(--gray-100)]">
          <SafeImg
            src={instituteBannerUrl(institute.bannerUrl) || FALLBACK_BANNER_URL}
            fallbackSrc={FALLBACK_BANNER_URL}
            alt={institute.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {institute.isFeatured && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-[var(--accent-green)] text-white text-xs font-semibold rounded-lg flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </div>
          )}
          {institute.isVerified && (
            <div className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
              <BadgeCheck className="w-4 h-4 text-[var(--accent-green)]" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 lg:p-6 flex flex-col justify-between relative md:h-full overflow-hidden">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg lg:text-xl font-bold text-[var(--gray-900)] line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
                  {institute.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--gray-500)] line-clamp-1">
                  {institute.tagline || 'Top coaching institute'}
                </p>
              </div>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border flex-shrink-0 ${getTypeColor(institute.type)}`}>
                {getTypeLabel(institute.type)}
              </span>
            </div>

            {/* Rating & Info */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {rating > 0 ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-lg">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-semibold text-amber-700">{rating.toFixed(1)}</span>
                  <span className="text-xs text-amber-600">({institute.totalReviews || 0} Reviews)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--gray-100)] rounded-lg">
                  <Star className="w-4 h-4 text-[var(--gray-400)]" />
                  <span className="text-sm text-[var(--gray-500)]">No ratings yet</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-sm text-[var(--gray-600)]">
                <Users className="w-4 h-4 text-[var(--gray-400)]" />
                <span>{institute.totalStudentsEnrolled > 0 ? `${institute.totalStudentsEnrolled.toLocaleString()}+ students` : '0+ students'}</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {displayedAmenities.map((amenity) => {
                const Icon = amenity.icon;
                return (
                  <div
                    key={amenity.key}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--gray-50)] rounded-lg text-sm text-[var(--gray-600)]"
                  >
                    <Icon className="w-3.5 h-3.5 text-[var(--gray-400)]" />
                    {amenity.label}
                  </div>
                );
              })}
              {moreCount > 0 && (
                <span className="text-sm text-[var(--gray-400)]">+ {moreCount} more</span>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-[var(--gray-500)]">
              <Building2 className="w-4 h-4" />
              <span>{isAuthenticated ? 'Click to view full details' : 'Login required to view details'}</span>
            </div>
            <Link
              href={
                isAuthenticated
                  ? `/institutes/${institute.slug}`
                  : `/login?redirect=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/')}`
              }
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-700)] text-white font-medium rounded-xl transition-colors"
            >
              {isAuthenticated ? 'View Details' : 'Login'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function InstituteHorizontalCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-[var(--gray-200)] overflow-hidden"
    >
      <div className="flex flex-col md:flex-row h-auto md:h-[280px]">
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0 h-56 md:h-full bg-[var(--gray-100)] animate-pulse" />
        <div className="flex-1 p-5 lg:p-6 space-y-4">
          <div className="h-6 bg-[var(--gray-100)] rounded-lg w-3/4 animate-pulse" />
          <div className="h-4 bg-[var(--gray-100)] rounded-lg w-1/2 animate-pulse" />
          <div className="flex gap-3">
            <div className="h-8 bg-[var(--gray-100)] rounded-lg w-24 animate-pulse" />
            <div className="h-8 bg-[var(--gray-100)] rounded-lg w-32 animate-pulse" />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-7 bg-[var(--gray-100)] rounded-lg w-20 animate-pulse" />
            ))}
          </div>
          <div className="flex justify-end">
            <div className="h-10 bg-[var(--gray-100)] rounded-xl w-32 animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
