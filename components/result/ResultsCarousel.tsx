'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Quote,
  GraduationCap,
  Star,
} from 'lucide-react';
import { Result, RankOrScoreType } from '@/types';

interface ResultsCarouselProps {
  results: Result[];
  examTypeNames?: Record<string, string>;
}

export function ResultsCarousel({ results, examTypeNames = {} }: ResultsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Filter featured results or take top results
  const featuredResults = results.filter(r => r.isFeatured).length > 0
    ? results.filter(r => r.isFeatured)
    : results.slice(0, 5);

  const totalSlides = featuredResults.length;

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-play
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentIndex]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (totalSlides === 0) return null;

  const currentResult = featuredResults[currentIndex];
  const examTypeName = examTypeNames[currentResult.examTypeIdentifier] || 'Exam';

  const getRankLabel = (type: RankOrScoreType) => {
    switch (type) {
      case RankOrScoreType.AIR_RANK:
        return 'AIR';
      case RankOrScoreType.STATE_RANK:
        return 'State Rank';
      case RankOrScoreType.PERCENTILE:
        return 'Percentile';
      case RankOrScoreType.MARKS:
        return 'Score';
      case RankOrScoreType.SELECTION:
        return 'Selected';
      default:
        return 'Rank';
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div
      className="relative bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-2xl border border-amber-200 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-amber-700 shadow-sm">
          <Trophy className="w-4 h-4" />
          Featured Toppers
        </span>
      </div>

      {/* Counter */}
      <div className="absolute top-4 right-4 z-10">
        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-[var(--gray-600)] shadow-sm">
          {currentIndex + 1} / {totalSlides}
        </span>
      </div>

      {/* Main Content */}
      <div className="relative h-[400px] md:h-[350px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute inset-0 p-6 md:p-8"
          >
            <div className="h-full flex flex-col md:flex-row items-center gap-6 md:gap-8">
              {/* Student Photo */}
              <div className="relative flex-shrink-0">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-amber-200 overflow-hidden bg-white shadow-lg">
                  <Image
                    src={currentResult.studentPhotoUrl || '/assests/sample_image_for_anything.png'}
                    alt={currentResult.studentName}
                    fill
                    className="object-cover"
                  />
                </div>
                {currentResult.isVerified && (
                  <div className="absolute -bottom-1 -right-1 md:bottom-1 md:right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {currentResult.isFeatured && (
                  <div className="absolute -top-1 -left-1 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    <Star className="w-4 h-4 text-white fill-current" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--gray-900)] mb-2">
                  {currentResult.studentName}
                </h3>

                {/* Rank Badge */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-lg font-bold rounded-full">
                    <Trophy className="w-5 h-5" />
                    {getRankLabel(currentResult.rankOrScoreType)} {currentResult.value}
                  </span>
                  <span className="text-sm text-[var(--gray-500)]">
                    {examTypeName} {currentResult.examYear}
                  </span>
                </div>

                {/* College */}
                {currentResult.collegeAdmitted && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-[var(--gray-700)] mb-4">
                    <GraduationCap className="w-5 h-5 text-[var(--primary)]" />
                    <span className="font-medium">Admitted to {currentResult.collegeAdmitted}</span>
                  </div>
                )}

                {/* Testimonial */}
                {currentResult.testimonialQuote && (
                  <div className="relative mt-4 p-4 bg-white/80 rounded-xl border border-amber-100 max-w-xl">
                    <Quote className="absolute -top-2 -left-2 w-6 h-6 text-amber-300" />
                    <p className="text-[var(--gray-600)] italic text-sm md:text-base leading-relaxed">
                      &ldquo;{currentResult.testimonialQuote}&rdquo;
                    </p>
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-[var(--gray-600)] hover:text-[var(--primary)] hover:shadow-lg transition-all z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-[var(--gray-600)] hover:text-[var(--primary)] hover:shadow-lg transition-all z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {featuredResults.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-6 bg-amber-500'
                  : 'bg-amber-300 hover:bg-amber-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
