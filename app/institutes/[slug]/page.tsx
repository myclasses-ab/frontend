'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  InstituteHero,
  TabNavigation,
  TabType,
  InstituteFacilities,
  InstituteBranches,
  EmptyState,
  SimilarInstitutes,
  InquiryForm,
} from '@/components/institute';
import { useInstitute } from '@/hooks/useInstitutes';
import { useInstituteCourses } from '@/hooks/useCourses';
import { useFaculty } from '@/hooks/useFaculty';
import { useResults } from '@/hooks/useResults';
import { useReviews, useInstituteResponses } from '@/hooks/useReviews';
import { Branch, InstituteFacility, AwardAndRecognition, Faq, InquirySource, InquiryStatus } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useLeadTracking } from '@/hooks/useLeadTracking';
import { MaskedOverlay } from '@/components/auth/MaskedOverlay';
import { 
  branchApi, 
  instituteFacilityApi, 
  awardAndRecognitionApi, 
  faqApi,
  examTypeApi,
  inquiryApi 
} from '@/api';
import {
  Award,
  Building2,
  CheckCircle,
  BookOpen,
  ChevronRight,
  Sparkles,
  Trophy,
  MessageSquare,
  HelpCircle,
  Filter,
  PenSquare,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import {
  CourseCardSkeleton,
  CourseCurriculum,
} from '@/components/course';
import { FacultyGrid } from '@/components/faculty';
import {
  ResultCard,
  ResultsStats,
  ResultsCarousel,
} from '@/components/result';
import {
  ReviewCard,
  ReviewStats,
  ReviewForm,
  TestimonialSection,
  type ReviewFormData,
} from '@/components/review';

// Overview Tab Component
function OverviewTab({ institute, facility, branches }: { 
  institute: any; 
  facility: InstituteFacility | null;
  branches: Branch[];
}) {
  return (
    <div className="space-y-8">
      {/* About */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[var(--gray-200)]"
      >
        <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[var(--primary)]" />
          About Institute
        </h2>
        <div className="prose prose-slate max-w-none">
          <p className="text-[var(--gray-600)] leading-relaxed whitespace-pre-line">
            {institute.description || 'No description available.'}
          </p>
        </div>
      </motion.section>

      {/* Facilities */}
      <section>
        <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[var(--primary)]" />
          Facilities & Amenities
        </h2>
        <InstituteFacilities facility={facility} />
      </section>

      {/* Branches */}
      <section>
        <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[var(--primary)]" />
          Branch Locations
        </h2>
        <InstituteBranches branches={branches} />
      </section>
    </div>
  );
}

// Courses Tab Component
function CoursesTab({ instituteIdentifier, instituteName }: { instituteIdentifier: string; instituteName: string }) {
  const { instituteCourses, isLoading, error } = useInstituteCourses(instituteIdentifier);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-[var(--gray-200)] rounded w-48 mb-2 animate-pulse" />
            <div className="h-4 bg-[var(--gray-100)] rounded w-64 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CourseCardSkeleton key={i} index={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        type="error"
        message="Failed to load courses. Please try again."
      />
    );
  }

  if (instituteCourses.length === 0) {
    return (
      <EmptyState
        type="no-results"
        message="No courses available at this institute yet."
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--gray-900)] flex items-center gap-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--primary)]" />
            Our Courses
          </h2>
          <p className="text-[var(--gray-600)] mt-1">
            {instituteCourses.length} courses available
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs sm:text-sm font-medium">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {instituteCourses.filter(c => c.admissionOpen).length} Admissions Open
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {instituteCourses.map((course, index) => (
          <CourseCardSimple 
            key={course.identifier} 
            course={course} 
            index={index}
            instituteName={instituteName}
            instituteIdentifier={instituteIdentifier}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Simple Course Card Component
function CourseCardSimple({ 
  course, 
  index,
  instituteName,
  instituteIdentifier,
}: { 
  course: any; 
  index: number;
  instituteName: string;
  instituteIdentifier: string;
}) {
  const displayName = course.customName || 'Course';
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isBooking, setIsBooking] = useState(false);

  const handleBookDemo = async () => {
    if (!isAuthenticated || !user) {
      router.push(`/login?redirect=/institutes/${params.slug}`);
      return;
    }

    setIsBooking(true);
    try {
      await inquiryApi.create({
        instituteIdentifier,
        courseIdentifier: course.courseIdentifier || course.identifier || null,
        branchIdentifier: null,
        userIdentifier: user.identifier,
        name: user.fullName || '',
        phone: user.phone || '',
        email: user.email || '',
        standard: '',
        targetExam: '',
        message: `Book a demo request for ${displayName}`,
        source: InquirySource.BOOK_DEMO,
        status: InquiryStatus.NEW,
        assignedTo: null,
        instituteNotes: null,
        utmSource: '',
        utmMedium: '',
        utmCampaign: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      alert('Demo request sent! The institute will contact you soon.');
    } catch (err) {
      console.error('Failed to book demo:', err);
      alert('Failed to send demo request. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[var(--gray-200)] hover:shadow-md transition-shadow flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-[var(--gray-900)] leading-tight">
            {displayName}
          </h3>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {course.admissionOpen && (
              <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full font-medium">
                Open
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content - grows to fill space */}
      <div className="flex-1 mb-4">
        {/* Features from CourseCurriculum */}
        <CourseCurriculum
          features={{
            studyMaterialIncluded: course.studyMaterialIncluded,
            testSeriesIncluded: course.testSeriesIncluded,
            recordedLecturesAvailable: course.recordedLecturesAvailable,
          }}
        />

        {/* Fee Section */}
        <div className="mt-4 pt-4 border-t border-[var(--gray-100)] space-y-3">
        {/* Fee Amount */}
        <div className="flex items-baseline gap-2">
          {course.fee ? (
            <>
              <span className="text-xl sm:text-2xl font-bold text-[var(--gray-900)]">
                ₹{Number(course.fee).toLocaleString()}
              </span>
              {course.durationMonths && (
                <span className="text-xs text-[var(--gray-400)] ml-1">
                  / {course.durationMonths} months
                </span>
              )}
            </>
          ) : (
            <span className="text-lg font-medium text-[var(--gray-500)]">Contact for fee details</span>
          )}
        </div>

        {/* Scholarship */}
        {course.scholarshipAvailable && (
          <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Scholarship Available</p>
              {course.scholarshipDetails && (
                <p className="text-xs text-amber-700 mt-0.5">{course.scholarshipDetails}</p>
              )}
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Book a Demo Button - always at bottom */}
      <button
        onClick={handleBookDemo}
        disabled={isBooking}
        className="w-full mt-auto py-2.5 bg-[var(--primary)] text-white font-medium rounded-xl hover:bg-[var(--primary-600)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isBooking ? 'Sending...' : 'Book a Demo'}
      </button>
    </motion.div>
  );
}

// Faculty Tab Component
function FacultyTab({ instituteIdentifier }: { instituteIdentifier: string }) {
  const { faculty, isLoading, error } = useFaculty({ instituteIdentifier });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-8 bg-[var(--gray-200)] rounded w-48 mb-2 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-[var(--gray-200)] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        type="error"
        message="Failed to load faculty information. Please try again."
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <FacultyGrid
        faculty={faculty}
        title="Meet Our Expert Faculty"
        subtitle="Learn from experienced educators and industry experts dedicated to your success"
        showStats={true}
        showFilters={true}
        featuredFirst={true}
      />
    </motion.div>
  );
}

// Results Tab Component
function ResultsTab({ instituteIdentifier }: { instituteIdentifier: string }) {
  const { results, isLoading, error } = useResults({ instituteIdentifier });
  const [examTypeNames, setExamTypeNames] = useState<Record<string, string>>({});
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  // Fetch exam type names
  useEffect(() => {
    const fetchExamTypes = async () => {
      try {
        const examTypes = await examTypeApi.getAll();
        const names: Record<string, string> = {};
        examTypes.forEach(et => {
          names[et.identifier] = et.name;
        });
        setExamTypeNames(names);
      } catch (err) {
        console.error('Failed to fetch exam types:', err);
      }
    };
    fetchExamTypes();
  }, []);

  // Get unique years for filter
  const years = [...new Set(results.map(r => r.examYear))].sort((a, b) => b - a);

  // Filter results by year
  const filteredResults = selectedYear === 'all' 
    ? results 
    : results.filter(r => r.examYear === selectedYear);

  // Featured results for carousel
  const featuredResults = results.filter(r => r.isFeatured);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-64 bg-[var(--gray-200)] rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-[var(--gray-200)] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        type="error"
        message="Failed to load results. Please try again."
      />
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState
        type="no-results"
        message="No results available for this institute yet."
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--gray-900)] flex items-center gap-2">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--primary)]" />
            Results & Achievements
          </h2>
          <p className="text-[var(--gray-600)] mt-1">
            Celebrating our students&apos; outstanding achievements
          </p>
        </div>
      </div>

      {/* Featured Toppers Carousel */}
      {featuredResults.length > 0 && (
        <ResultsCarousel results={featuredResults} examTypeNames={examTypeNames} />
      )}

      {/* Stats */}
      <ResultsStats results={results} />

      {/* Year Filter */}
      {years.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-[var(--gray-500)]" />
          <span className="text-sm text-[var(--gray-600)]">Filter by year:</span>
          <button
            onClick={() => setSelectedYear('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              selectedYear === 'all'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'
            }`}
          >
            All Years
          </button>
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                selectedYear === year
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResults.map((result, index) => (
          <ResultCard
            key={result.identifier}
            result={result}
            index={index}
            examTypeName={examTypeNames[result.examTypeIdentifier]}
          />
        ))}
      </div>

      {/* Testimonials */}
      <TestimonialSection results={filteredResults} examTypeNames={examTypeNames} />
    </motion.div>
  );
}

// Reviews Tab Component
function ReviewsTab({ instituteIdentifier, instituteName }: { instituteIdentifier: string; instituteName: string }) {
  const { reviews, isLoading, error, refetch } = useReviews({ instituteIdentifier });
  const { responses } = useInstituteResponses(instituteIdentifier);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'verified' | 'positive' | 'critical'>('all');

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    switch (filter) {
      case 'verified':
        return review.isVerifiedStudent;
      case 'positive':
        return Number(review.overallRating) >= 4;
      case 'critical':
        return Number(review.overallRating) <= 2;
      default:
        return true;
    }
  });

  // Handle review submission
  const handleSubmitReview = async (formData: ReviewFormData) => {
    try {
      // In a real app, you would submit to your API here
      console.log('Submitting review:', formData);
      // After successful submission, refetch reviews
      await refetch();
      setShowReviewForm(false);
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  // Handle helpful vote
  const handleHelpful = async (reviewId: string, helpful: boolean) => {
    try {
      // In a real app, you would submit the vote to your API
      console.log('Voting on review:', reviewId, helpful);
      await refetch();
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-48 bg-[var(--gray-200)] rounded-2xl animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-[var(--gray-200)] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        type="error"
        message="Failed to load reviews. Please try again."
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--gray-900)] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--primary)]" />
            Student Reviews
          </h2>
          <p className="text-[var(--gray-600)] mt-1">
            Read what our students have to say about their experience
          </p>
        </div>
        <button
          onClick={() => setShowReviewForm(true)}
          className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[var(--primary)] text-white font-medium rounded-lg hover:bg-[var(--primary-600)] transition-colors text-sm sm:text-base"
        >
          <PenSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Write a Review
        </button>
      </div>

      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={() => setShowReviewForm(false)}
          >
            <div onClick={e => e.stopPropagation()}>
              <ReviewForm
                instituteIdentifier={instituteIdentifier}
                instituteName={instituteName}
                onSubmit={handleSubmitReview}
                onClose={() => setShowReviewForm(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {reviews.length === 0 ? (
        <EmptyState
          type="no-results"
          message="No reviews yet. Be the first to share your experience!"
          action={
            <button
              onClick={() => setShowReviewForm(true)}
              className="mt-4 px-6 py-2.5 bg-[var(--primary)] text-white font-medium rounded-lg hover:bg-[var(--primary-600)] transition-colors"
            >
              Write a Review
            </button>
          }
        />
      ) : (
        <>
          {/* Stats */}
          <ReviewStats reviews={reviews} />

          {/* Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-[var(--gray-500)]" />
            <span className="text-sm text-[var(--gray-600)]">Filter:</span>
            {[
              { key: 'all', label: 'All Reviews' },
              { key: 'verified', label: 'Verified Students' },
              { key: 'positive', label: 'Positive (4+)' },
              { key: 'critical', label: 'Critical (1-2)' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as typeof filter)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  filter === key
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.map((review, index) => (
              <ReviewCard
                key={review.identifier}
                review={review}
                index={index}
                instituteResponse={responses.get(review.identifier) || null}
                onHelpful={handleHelpful}
              />
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-8">
              <p className="text-[var(--gray-500)]">No reviews match the selected filter.</p>
              <button
                onClick={() => setFilter('all')}
                className="mt-2 text-[var(--primary)] hover:underline"
              >
                Show all reviews
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

// FAQs Tab Component
function FaqsTab({ faqs }: { faqs: Faq[] }) {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  if (faqs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[var(--gray-200)]"
      >
        <div className="w-16 h-16 bg-[var(--primary-100)] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8 text-[var(--primary)]" />
        </div>
        <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">No FAQs Available</h3>
        <p className="text-[var(--gray-600)] max-w-md mx-auto">
          Frequently asked questions will be added soon. Contact the institute directly for any queries.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5 text-[var(--primary)]" />
        <h2 className="text-xl font-bold text-[var(--gray-900)]">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.identifier}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-[var(--gray-200)] overflow-hidden"
          >
            <button
              onClick={() => setOpenFaq(openFaq === faq.identifier ? null : faq.identifier)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--gray-50)] transition-colors"
            >
              <span className="font-medium text-[var(--gray-900)] pr-4">{faq.question}</span>
              <ChevronRight
                className={`w-5 h-5 text-[var(--gray-400)] flex-shrink-0 transition-transform ${
                  openFaq === faq.identifier ? 'rotate-90' : ''
                }`}
              />
            </button>
            {openFaq === faq.identifier && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-[var(--gray-100)]"
              >
                <p className="p-4 text-[var(--gray-600)] leading-relaxed">{faq.answer}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function InstituteDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  
  const { institute, isLoading, error } = useInstitute(slug);
  const { isAuthenticated } = useAuth();
  const { trackInstituteVisit } = useLeadTracking();
  
  const [branches, setBranches] = useState<Branch[]>([]);
  const [facility, setFacility] = useState<InstituteFacility | null>(null);
  const [awards, setAwards] = useState<AwardAndRecognition[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);

  // Track institute visit
  useEffect(() => {
    if (institute) {
      trackInstituteVisit(institute.identifier, institute.name);
    }
  }, [institute, trackInstituteVisit]);

  // Fetch related data when institute loads
  useEffect(() => {
    if (!institute) return;

    const fetchRelatedData = async () => {
      try {
        const [branchesData, facilityData, awardsData, faqsData] = await Promise.all([
          branchApi.findByInstituteIdentifier(institute.identifier).catch(() => []),
          instituteFacilityApi.findByInstituteIdentifier(institute.identifier).catch(() => null),
          awardAndRecognitionApi.findByInstituteIdentifier(institute.identifier).catch(() => []),
          faqApi.findByInstituteIdentifier(institute.identifier).catch(() => []),
        ]);

        setBranches(branchesData);
        setFacility(facilityData);
        setAwards(awardsData);
        setFaqs(faqsData);
      } catch (err) {
        console.error('Error fetching related data:', err);
      }
    };

    fetchRelatedData();
  }, [institute]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)]">
        <div className="h-56 sm:h-64 lg:h-80 bg-[var(--gray-300)] animate-pulse" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-6 items-start sm:items-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-[var(--gray-300)] rounded-xl sm:rounded-2xl animate-pulse mx-0" />
            <div className="flex-1 space-y-3 pt-0 sm:pt-4 text-center sm:text-left">
              <div className="h-7 sm:h-8 bg-[var(--gray-300)] rounded w-2/3 sm:w-1/3 animate-pulse mx-auto sm:mx-0" />
              <div className="h-4 bg-[var(--gray-300)] rounded w-1/2 sm:w-1/4 animate-pulse mx-auto sm:mx-0" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !institute) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center py-16">
        <EmptyState
          type="error"
          message={error?.message || 'Institute not found'}
        />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab institute={institute} facility={facility} branches={branches} />;
      case 'courses':
        return (
          <CoursesTab 
            instituteIdentifier={institute.identifier} 
            instituteName={institute.name}
          />
        );
      case 'faculty':
        return <FacultyTab instituteIdentifier={institute.identifier} />;
      case 'results':
        return <ResultsTab instituteIdentifier={institute.identifier} />;
      case 'reviews':
        return (
          <ReviewsTab 
            instituteIdentifier={institute.identifier}
            instituteName={institute.name}
          />
        );
      case 'faqs':
        return <FaqsTab faqs={faqs} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Hero */}
      <InstituteHero institute={institute} />

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!isAuthenticated && (
          <div className="relative mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-[var(--gray-900)]">Institute Details Locked</h3>
                <p className="text-sm text-[var(--gray-600)] mt-1">
                  Login with your mobile number to unlock full details including courses, fees, faculty, results, and reviews.
                </p>
              </div>
              <Link
                href={`/login?redirect=/institutes/${slug}`}
                className="px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-700)] text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all whitespace-nowrap"
              >
                Login
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Main Content */}
          <div className="lg:col-span-2 relative">
            {!isAuthenticated && (
              <div className="absolute inset-0 z-10">
                <MaskedOverlay
                  message="Details Locked"
                  subMessage="Login to view courses, fees, faculty, results, and student reviews."
                  redirectUrl={`/login?redirect=/institutes/${slug}`}
                />
              </div>
            )}
            <div className={!isAuthenticated ? 'blur-[3px] select-none pointer-events-none' : ''}>
              {renderTabContent()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Awards */}
              {awards.length > 0 && isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[var(--gray-200)]"
                >
                  <h3 className="text-lg font-bold text-[var(--gray-900)] mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[var(--accent-orange)]" />
                    Awards & Recognition
                  </h3>
                  <div className="space-y-3">
                    {awards.map((award) => (
                      <div
                        key={award.identifier}
                        className="flex items-start gap-3 p-3 bg-[var(--gray-50)] rounded-xl"
                      >
                        <div className="w-8 h-8 bg-[var(--accent-orange)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-4 h-4 text-[var(--accent-orange)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[var(--gray-900)] text-sm">
                            {award.title}
                          </p>
                          <p className="text-xs text-[var(--gray-500)]">
                            {award.issuingBody}, {award.year}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Contact Card */}
              {/* <ContactCard institute={institute} /> */}

            </div>
          </div>
        </div>

        {/* Similar Institutes */}
        <SimilarInstitutes instituteIdentifier={institute.identifier} />
      </div>

      {/* Inquiry Form Modal */}
      <AnimatePresence>
        {showInquiryForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={() => setShowInquiryForm(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <InquiryForm
                instituteIdentifier={institute.identifier}
                instituteName={institute.name}
                onClose={() => setShowInquiryForm(false)}
                onSubmit={() => setShowInquiryForm(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
