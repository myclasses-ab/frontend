'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  Users,
  BookOpen,
  GraduationCap,
  ChevronRight,
  Award,
  Sparkles,
  Monitor,
  Video,
  FileText,
  Calendar,
} from 'lucide-react';
import { EnrichedInstituteCourse } from '@/hooks/useCourses';

interface CourseCardProps {
  course: EnrichedInstituteCourse;
  index?: number;
  showInstitute?: boolean;
}

export function CourseCard({ course, index = 0, showInstitute = false }: CourseCardProps) {
  const {
    customName,
    feeMin,
    feeMax,
    feeDescription,
    durationMonths,
    scholarshipAvailable,
    scholarshipDetails,
    studyMaterialIncluded,
    testSeriesIncluded,
    onlineClassesAvailable,
    recordedLecturesAvailable,
    admissionOpen,
    institute,
  } = course;

  const displayName = customName || 'Course';

  // Format fee display
  const formatFee = (fee: number | string) => {
    const numFee = Number(fee);
    if (numFee >= 100000) {
      return `₹${(numFee / 100000).toFixed(1)}L`;
    }
    if (numFee >= 1000) {
      return `₹${(numFee / 1000).toFixed(0)}K`;
    }
    return `₹${numFee}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--gray-200)] overflow-hidden"
    >
      {/* Header with gradient */}
      <div className="relative h-28 overflow-hidden bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)]">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2 justify-between">
          <div className="flex flex-wrap gap-2">
            {/* Badges can be added here when course type/standard fields are added to InstituteCourse */}
          </div>
          
          {scholarshipAvailable && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full">
              <Sparkles className="w-3 h-3" />
              Scholarship
            </span>
          )}
        </div>

        {/* Course Icon */}
        <div className="absolute bottom-0 left-4 transform translate-y-1/2">
          <div className="w-16 h-16 rounded-xl bg-white shadow-lg p-1 flex items-center justify-center">
            <div className="w-full h-full rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-600)] flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-10 px-4 pb-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-[var(--gray-900)] line-clamp-1 group-hover:text-[var(--primary)] transition-colors mb-1">
          {displayName}
        </h3>

        {/* Institute Name */}
        {showInstitute && institute && (
          <p className="text-sm text-[var(--primary)] font-medium mb-2">
            {institute.name}
          </p>
        )}

        {/* Description */}
        {feeDescription && (
          <p className="text-sm text-[var(--gray-500)] line-clamp-1 mb-3">
            {feeDescription}
          </p>
        )}

        {/* Fee Display */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-bold text-[var(--gray-900)]">
            {formatFee(feeMin)}
          </span>
          {Number(feeMax) > Number(feeMin) && (
            <>
              <span className="text-[var(--gray-400)]">-</span>
              <span className="text-lg font-semibold text-[var(--gray-700)]">
                {formatFee(feeMax)}
              </span>
            </>
          )}
          <span className="text-xs text-[var(--gray-500)] ml-1">/year</span>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-[var(--gray-600)]">
            <Clock className="w-4 h-4 text-[var(--gray-400)]" />
            <span>{durationMonths} months</span>
          </div>
          
          {studyMaterialIncluded && (
            <div className="flex items-center gap-1.5 text-sm text-[var(--gray-600)]">
              <FileText className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-[var(--primary)]">Study Material</span>
            </div>
          )}

          {testSeriesIncluded && (
            <div className="flex items-center gap-1.5 text-sm text-[var(--gray-600)]">
              <Award className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-[var(--primary)]">Test Series</span>
            </div>
          )}

          {onlineClassesAvailable && (
            <div className="flex items-center gap-1.5 text-sm text-[var(--gray-600)]">
              <Monitor className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-[var(--primary)]">Live Classes</span>
            </div>
          )}

          {recordedLecturesAvailable && (
            <div className="flex items-center gap-1.5 text-sm text-[var(--gray-600)]">
              <Video className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-[var(--primary)]">Recorded</span>
            </div>
          )}
        </div>

        {/* Admission Status */}
        <div className="flex items-center justify-between py-3 border-t border-[var(--gray-100)] mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${admissionOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${admissionOpen ? 'text-green-600' : 'text-red-600'}`}>
              {admissionOpen ? 'Admissions Open' : 'Admissions Closed'}
            </span>
          </div>
          
        </div>

        {/* Scholarship Info */}
        {scholarshipAvailable && scholarshipDetails && (
          <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">Scholarship Available</span>
            </div>
            <p className="text-xs text-amber-700 line-clamp-2">{scholarshipDetails}</p>
          </div>
        )}

        {/* CTA */}
        <button
          disabled={!admissionOpen}
          className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-medium transition-all duration-300 group/btn ${
            admissionOpen
              ? 'bg-[var(--primary-50)] hover:bg-[var(--primary)] text-[var(--primary)] hover:text-white'
              : 'bg-[var(--gray-100)] text-[var(--gray-400)] cursor-not-allowed'
          }`}
        >
          {admissionOpen ? (
            <>
              Enroll Now
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </>
          ) : (
            'Coming Soon'
          )}
        </button>
      </div>
    </motion.div>
  );
}
