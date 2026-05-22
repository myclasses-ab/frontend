'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Send,
  CheckCircle,
  User,
  BookOpen,
  Calendar,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { RatingStars } from './RatingStars';
import { Standard } from '@/types';

interface ReviewFormProps {
  instituteIdentifier: string;
  instituteName: string;
  onSubmit?: (review: ReviewFormData) => void;
  onClose: () => void;
}

export interface ReviewFormData {
  instituteIdentifier: string;
  courseTaken: string;
  standardWhenEnrolled: Standard;
  reviewTitle: string;
  reviewText: string;
  pros: string;
  cons: string;
  overallRating: number;
  facultyRating: number;
  studyMaterialRating: number;
  infrastructureRating: number;
  feeValueRating: number;
  wouldRecommend: boolean;
}

export function ReviewForm({ instituteIdentifier, instituteName, onSubmit, onClose }: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    instituteIdentifier,
    courseTaken: '',
    standardWhenEnrolled: Standard.STANDARD_12,
    reviewTitle: '',
    reviewText: '',
    pros: '',
    cons: '',
    overallRating: 0,
    facultyRating: 0,
    studyMaterialRating: 0,
    infrastructureRating: 0,
    feeValueRating: 0,
    wouldRecommend: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ReviewFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ReviewFormData, string>> = {};

    if (formData.overallRating === 0) {
      newErrors.overallRating = 'Please provide an overall rating';
    }
    if (!formData.courseTaken.trim()) {
      newErrors.courseTaken = 'Please enter the course you took';
    }
    if (!formData.reviewText.trim() || formData.reviewText.length < 50) {
      newErrors.reviewText = 'Review must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSubmit?.(formData);
      setIsSuccess(true);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = <K extends keyof ReviewFormData>(
    field: K,
    value: ReviewFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">Review Submitted!</h3>
        <p className="text-[var(--gray-600)] mb-6">
          Thank you for sharing your experience. Your review will be published after moderation.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-[var(--primary)] text-white font-medium rounded-lg hover:bg-[var(--primary-600)] transition-colors"
        >
          Close
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[var(--gray-200)] shadow-lg max-w-2xl max-h-[90vh] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--gray-100)]">
        <div>
          <h3 className="text-lg font-bold text-[var(--gray-900)]">Write a Review</h3>
          <p className="text-sm text-[var(--gray-500)]">{instituteName}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-[var(--gray-400)] hover:text-[var(--gray-600)] hover:bg-[var(--gray-100)] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
        {/* Overall Rating */}
        <div className="mb-6 text-center p-4 bg-[var(--gray-50)] rounded-xl">
          <label className="block text-sm font-medium text-[var(--gray-700)] mb-3">
            How would you rate your overall experience?
          </label>
          <div className="flex items-center justify-center gap-2">
            <RatingStars
              rating={formData.overallRating}
              size="lg"
              interactive
              onRate={(rating) => updateField('overallRating', rating)}
            />
          </div>
          {formData.overallRating > 0 && (
            <p className="mt-2 text-sm font-medium text-[var(--primary)]">
              {formData.overallRating === 5 && 'Excellent!'}
              {formData.overallRating === 4 && 'Very Good'}
              {formData.overallRating === 3 && 'Good'}
              {formData.overallRating === 2 && 'Fair'}
              {formData.overallRating === 1 && 'Poor'}
            </p>
          )}
          {errors.overallRating && (
            <p className="mt-1 text-sm text-red-500">{errors.overallRating}</p>
          )}
        </div>

        {/* Course Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Course Taken *
            </label>
            <input
              type="text"
              value={formData.courseTaken}
              onChange={(e) => updateField('courseTaken', e.target.value)}
              placeholder="e.g., JEE Advanced Coaching"
              className="w-full px-3 py-2 border border-[var(--gray-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
            {errors.courseTaken && (
              <p className="mt-1 text-sm text-red-500">{errors.courseTaken}</p>
            )}
          </div>

        </div>

        {/* Standard */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
            <User className="w-4 h-4 inline mr-1" />
            Standard When Enrolled
          </label>
          <select
            value={formData.standardWhenEnrolled}
            onChange={(e) => updateField('standardWhenEnrolled', e.target.value as Standard)}
            className="w-full px-3 py-2 border border-[var(--gray-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          >
            <option value={Standard.STANDARD_10}>Class 10</option>
            <option value={Standard.STANDARD_11}>Class 11</option>
            <option value={Standard.STANDARD_12}>Class 12</option>
            <option value={Standard.DROPPER}>Dropper</option>
            <option value={Standard.STANDARD_11_AND_12}>Class 11 & 12</option>
            <option value={Standard.GRADUATE}>Graduate</option>
            <option value={Standard.OTHER}>Other</option>
          </select>
        </div>

        {/* Review Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
            Review Title
          </label>
          <input
            type="text"
            value={formData.reviewTitle}
            onChange={(e) => updateField('reviewTitle', e.target.value)}
            placeholder="Summarize your experience in a few words"
            className="w-full px-3 py-2 border border-[var(--gray-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>

        {/* Review Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
            Your Review *
          </label>
          <textarea
            value={formData.reviewText}
            onChange={(e) => updateField('reviewText', e.target.value)}
            placeholder="Share details about your experience, faculty, study material, infrastructure, etc. (minimum 50 characters)"
            rows={4}
            className="w-full px-3 py-2 border border-[var(--gray-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
          />
          <div className="flex items-center justify-between mt-1">
            {errors.reviewText ? (
              <p className="text-sm text-red-500">{errors.reviewText}</p>
            ) : (
              <span></span>
            )}
            <span className={`text-xs ${formData.reviewText.length < 50 ? 'text-[var(--gray-400)]' : 'text-green-600'}`}>
              {formData.reviewText.length} characters
            </span>
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1.5">
              <ThumbsUp className="w-4 h-4 inline mr-1" />
              Pros
            </label>
            <textarea
              value={formData.pros}
              onChange={(e) => updateField('pros', e.target.value)}
              placeholder="What did you like?"
              rows={2}
              className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-red-700 mb-1.5">
              <ThumbsDown className="w-4 h-4 inline mr-1" />
              Cons
            </label>
            <textarea
              value={formData.cons}
              onChange={(e) => updateField('cons', e.target.value)}
              placeholder="What could be improved?"
              rows={2}
              className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Detailed Ratings */}
        <div className="mb-6 p-4 bg-[var(--gray-50)] rounded-xl">
          <label className="block text-sm font-medium text-[var(--gray-700)] mb-3">
            Rate Specific Aspects (Optional)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { field: 'facultyRating', label: 'Faculty' },
              { field: 'studyMaterialRating', label: 'Study Material' },
              { field: 'infrastructureRating', label: 'Infrastructure' },
              { field: 'feeValueRating', label: 'Value for Money' },
            ].map(({ field, label }) => (
              <div key={field} className="flex items-center justify-between">
                <span className="text-sm text-[var(--gray-600)]">{label}</span>
                <RatingStars
                  rating={formData[field as keyof ReviewFormData] as number}
                  size="sm"
                  interactive
                  onRate={(rating) => updateField(field as keyof ReviewFormData, rating)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Would Recommend */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
            Would you recommend this institute to others?
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => updateField('wouldRecommend', true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                formData.wouldRecommend
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'border-[var(--gray-200)] text-[var(--gray-600)] hover:bg-[var(--gray-50)]'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              Yes
            </button>
            <button
              type="button"
              onClick={() => updateField('wouldRecommend', false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                !formData.wouldRecommend
                  ? 'bg-red-50 border-red-500 text-red-700'
                  : 'border-[var(--gray-200)] text-[var(--gray-600)] hover:bg-[var(--gray-50)]'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              No
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary)] text-white font-medium rounded-lg hover:bg-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Review
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
