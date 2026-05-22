'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Star,
  MapPin,
  Users,
  Award,
  CheckCircle,
  Building2,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react';
import { Institute } from '@/types';
import { instituteBannerUrl, instituteLogoUrl, FALLBACK_BANNER_URL, FALLBACK_LOGO_URL } from '../helper/imageHelper';
import { SafeImage } from '../helper/SafeImage';
import { useAuth } from '@/context/AuthContext';
import { MaskedText } from '../auth/MaskedOverlay';

interface InstituteCardProps {
  institute: Institute;
  index?: number;
}

export function InstituteCard({ institute, index = 0 }: InstituteCardProps) {
  const {
    slug,
    name,
    tagline,
    logoUrl,
    bannerUrl,
    averageRating,
    totalReviews,
    totalStudentsEnrolled,
    yearsOfExperience,
    isVerified,
    isFeatured,
    subscriptionTier,
  } = institute;
  const { isAuthenticated } = useAuth();

  const getTierBadge = () => {
    switch (subscriptionTier) {
      case 'FEATURED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full">
            <Award className="w-3 h-3" />
            Featured
          </span>
        );
      case 'PREMIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full">
            <BadgeCheck className="w-3 h-3" />
            Premium
          </span>
        );
      default:
        return null;
    }
  };

  // TODO: Replace with actual external URLs once next.config.js is configured
  // Using local placeholder images for now
  // const bannerImage = bannerUrl || '/images/institute-banner.jpg';
  // const logoImage = logoUrl || '/images/institute-logo.png';
  
  // Using local assets as placeholders
  const bannerImage = '/assests/sample_image_for_anything.png';
  const logoImage = '/assests/sample_image_for_anything.png';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--gray-200)] overflow-hidden min-h-[420px]"
    >
      {/* Banner Image */}
      <div className="relative h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 z-10" />
        <SafeImage
          src={instituteBannerUrl(bannerUrl) || FALLBACK_BANNER_URL}
          fallbackSrc={FALLBACK_BANNER_URL}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2">
          {getTierBadge()}
          {isVerified && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-green-500 text-white rounded-full">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        {/* Logo */}
        <div className="absolute -bottom-8 left-4 z-20">
          <div className="w-16 h-16 rounded-xl bg-white shadow-lg p-1 flex items-center justify-center">
            <SafeImage
              src={instituteLogoUrl(logoUrl) || FALLBACK_LOGO_URL}
              fallbackSrc={FALLBACK_LOGO_URL}
              alt={name}
              width={56}
              height={56}
              className="object-contain rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-10 px-4 pb-4 relative">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-[var(--gray-900)] line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
            {isAuthenticated ? name : <MaskedText>Institute Name Hidden</MaskedText>}
          </h3>
          {tagline && isAuthenticated && (
            <p className="text-sm text-[var(--gray-500)] line-clamp-1">{tagline}</p>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--gray-600)] line-clamp-2 mb-4">
          {isAuthenticated ? (tagline || 'Leading coaching institute with excellent track record.') : 'Login to view institute details, courses, fees, and student reviews.'}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
          {/* Rating */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-[var(--gray-900)]">
                {Number(averageRating).toFixed(1)}
              </span>
              <span className="text-[var(--gray-500)]">({totalReviews})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 blur-[4px] select-none">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-[var(--gray-900)]">4.5</span>
              <span className="text-[var(--gray-500)]">(120)</span>
            </div>
          )}

          {/* Experience */}
          {yearsOfExperience > 0 && isAuthenticated && (
            <div className="flex items-center gap-1 text-[var(--gray-600)]">
              <Building2 className="w-4 h-4 text-[var(--gray-400)]" />
              <span>{yearsOfExperience}+ years</span>
            </div>
          )}

          {/* Students */}
          {totalStudentsEnrolled > 0 && isAuthenticated && (
            <div className="flex items-center gap-1 text-[var(--gray-600)]">
              <Users className="w-4 h-4 text-[var(--gray-400)]" />
              <span>{formatNumber(totalStudentsEnrolled)} students</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          href={
            isAuthenticated
              ? `/institutes/${slug}`
              : `/login?redirect=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/')}`
          }
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[var(--primary-50)] hover:bg-[var(--primary)] text-[var(--primary)] hover:text-white rounded-xl font-medium transition-all duration-300 group/btn"
        >
          {isAuthenticated ? 'View Details' : 'Unlock'}
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

function formatNumber(num: number): string {
  if (num >= 100000) {
    return (num / 100000).toFixed(1) + 'L';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
