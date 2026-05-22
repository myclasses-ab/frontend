'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { Result } from '@/types';
import { FALLBACK_PERSON_URL } from '../helper/imageHelper';
import { SafeImage } from '../helper/SafeImage';

interface TestimonialSectionProps {
  results: Result[];
  examTypeNames?: Record<string, string>;
}

export function TestimonialSection({ results, examTypeNames = {} }: TestimonialSectionProps) {
  // Only show results with testimonials
  const testimonials = results
    .filter(r => r.testimonialQuote && r.testimonialQuote.trim().length > 0)
    .slice(0, 3);

  if (testimonials.length === 0) return null;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        <Quote className="w-5 h-5 text-[var(--primary)]" />
        <h3 className="text-lg font-semibold text-[var(--gray-900)]">Student Testimonials</h3>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.identifier}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative bg-white rounded-2xl p-5 border border-[var(--gray-200)] shadow-sm hover:shadow-md transition-all"
          >
            {/* Quote Icon */}
            <div className="absolute -top-3 -left-2 w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center shadow-md">
              <Quote className="w-4 h-4 text-white" />
            </div>

            {/* Testimonial Text */}
            <p className="text-[var(--gray-600)] text-sm leading-relaxed mb-4 italic line-clamp-4">
              &ldquo;{testimonial.testimonialQuote}&rdquo;
            </p>

            {/* Student Info */}
            <div className="flex items-center gap-3 pt-4 border-t border-[var(--gray-100)]">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[var(--gray-100)]">
                <SafeImage
                  src={testimonial.studentPhotoUrl || FALLBACK_PERSON_URL}
                  fallbackSrc={FALLBACK_PERSON_URL}
                  alt={testimonial.studentName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-[var(--gray-900)] text-sm truncate">
                  {testimonial.studentName}
                </h4>
                <p className="text-xs text-[var(--gray-500)] truncate">
                  {testimonial.collegeAdmitted || examTypeNames[testimonial.examTypeIdentifier] || 'Student'}
                </p>
              </div>
              {testimonial.isVerified && (
                <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Rank Badge */}
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                <Star className="w-3 h-3" />
                {testimonial.value}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
