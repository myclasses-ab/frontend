'use client';

import { motion } from 'framer-motion';
import {
  Star,
  Users,
  Calendar,
  CheckCircle,
  Award,
  BadgeCheck,
  Share2,
  Bookmark,
} from 'lucide-react';
import { Institute } from '@/types';
import { useState } from 'react';
import { instituteBannerUrl, instituteLogoUrl, FALLBACK_BANNER_URL, FALLBACK_LOGO_URL } from '../helper/imageHelper';
import { SafeImage } from '../helper/SafeImage';

interface InstituteHeroProps {
  institute: Institute;
}

export function InstituteHero({ institute }: InstituteHeroProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const {
    name,
    tagline,
    logoUrl,
    bannerUrl,
    averageRating,
    totalReviews,
    totalStudentsEnrolled,
    yearsOfExperience,
    foundedYear, 
    isVerified,
    isFeatured,
    subscriptionTier,
  } = institute;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    } catch {
      // Fallback
    }
  };

  const getTierBadge = () => {
    switch (subscriptionTier) {
      case 'FEATURED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full shadow-lg">
            <Award className="w-4 h-4" />
            Featured
          </span>
        );
      default:
        return null;
    }
  };


  return (
    <div className="relative">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 lg:h-80">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80 z-10" />
        <SafeImage
          src={instituteBannerUrl(bannerUrl) || FALLBACK_BANNER_URL}
          fallbackSrc={FALLBACK_BANNER_URL}
          alt={name}
          fill
          className="object-cover"
          priority
          unoptimized={!!bannerUrl}
        />

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2.5 backdrop-blur-md rounded-full transition-colors ${
              isBookmarked
                ? 'bg-amber-500 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            aria-label="Bookmark"
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Share Toast */}
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-16 right-4 z-30 px-4 py-2 bg-green-500 text-white text-sm rounded-lg shadow-lg"
          >
            Link copied to clipboard!
          </motion.div>
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg w-fit">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl bg-white shadow-xl p-2 flex items-center justify-center mx-auto sm:mx-0">
                  <SafeImage
                    src={instituteLogoUrl(logoUrl) || FALLBACK_LOGO_URL}
                    fallbackSrc={FALLBACK_LOGO_URL}
                    alt={name}
                    width={96}
                    height={96}
                    className="object-contain rounded-xl"
                    unoptimized={!!logoUrl}
                  />
                </div>
              </motion.div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {getTierBadge()}
                    {isVerified && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium bg-green-500 text-white rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </span>
                    )}
                    {isFeatured && subscriptionTier !== 'FEATURED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium bg-amber-500 text-white rounded-full">
                        <Award className="w-4 h-4" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                    {name}
                  </h1>

                  {/* Tagline */}
                  {tagline && (
                    <p className="text-base sm:text-lg text-white/90 font-medium">
                      {tagline}
                    </p>
                  )}

                  {/* Rating & Quick Stats */}
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    {/* Rating */}
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-white">{Number(averageRating).toFixed(1)}</span>
                      <span className="text-white/70 text-sm">({totalReviews} reviews)</span>
                    </div>

                    {/* Experience */}
                    <div className="flex items-center gap-1.5 text-white/80 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{yearsOfExperience}+ years of excellence</span>
                    </div>

                    {/* Students */}
                    <div className="flex items-center gap-1.5 text-white/80 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{formatNumber(totalStudentsEnrolled)}+ students</span>
                    </div>

                    {/* Founded */}
                    {foundedYear > 0 && (
                      <div className="flex items-center gap-1.5 text-white/80 text-sm">
                        <span>Since {foundedYear}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatNumber(num: number | null | undefined): string {
  if (num == null) {
    return '0';
  }
  if (num >= 100000) {
    return (num / 100000).toFixed(1) + 'L';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
