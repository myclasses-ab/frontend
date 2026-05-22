import { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  ArrowRight,
  Target,
  Users,
  BookOpen,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { allExams } from "@/components/exam/examInfo";

export const metadata: Metadata = {
  title: "Competitive Exams 2025 | JEE, NEET, MHT-CET, KVPY, Olympiads",
  description:
    "Complete guide to India's top competitive exams - JEE Main & Advanced, NEET, MHT-CET, KVPY, and Olympiads. Get exam dates, syllabus, eligibility, pattern, and preparation tips.",
  keywords: [
    "Competitive Exams 2025",
    "JEE Main",
    "NEET UG",
    "MHT-CET",
    "KVPY",
    "Olympiads",
    "Engineering Entrance",
    "Medical Entrance",
    "Exam Preparation",
  ],
  openGraph: {
    title: "Competitive Exams 2025 - Complete Preparation Guide",
    description:
      "Your one-stop destination for JEE, NEET, MHT-CET, KVPY, and Olympiad preparation. Find exam dates, syllabus, and best coaching institutes.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Competitive Exams 2025 - Complete Guide",
    description: "JEE, NEET, MHT-CET, KVPY, and Olympiads preparation guide",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/exam",
  },
};

// Category Badge Component
function CategoryBadge({ category }: { category: string }) {
  const styles: Record<string, string> = {
    engineering: "bg-blue-100 text-blue-700 border-blue-200",
    medical: "bg-emerald-100 text-emerald-700 border-emerald-200",
    state: "bg-orange-100 text-orange-700 border-orange-200",
    scholarship: "bg-violet-100 text-violet-700 border-violet-200",
    olympiad: "bg-amber-100 text-amber-700 border-amber-200",
  };

  const labels: Record<string, string> = {
    engineering: "Engineering",
    medical: "Medical",
    state: "State Level",
    scholarship: "Scholarship",
    olympiad: "Olympiad",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
        styles[category] || styles.engineering
      }`}
    >
      {labels[category] || category}
    </span>
  );
}

// Difficulty Badge Component
function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const styles: Record<string, string> = {
    high: "bg-yellow-100 text-yellow-700",
    "very-high": "bg-orange-100 text-orange-700",
    extreme: "bg-red-100 text-red-700",
  };

  const labels: Record<string, string> = {
    high: "High",
    "very-high": "Very High",
    extreme: "Extreme",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
        styles[difficulty] || styles.high
      }`}
    >
      {labels[difficulty] || difficulty}
    </span>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--primary-50)] via-white to-[var(--gray-50)]">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--primary-100)] rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--accent-orange)] rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--accent-purple)] rounded-full blur-3xl opacity-10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-[var(--gray-100)] mb-8">
            <Award className="w-4 h-4 text-[var(--accent-orange)]" />
            <span className="text-sm font-medium text-[var(--gray-700)]">
              Your Gateway to Success
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--gray-900)] mb-6 leading-tight">
            Master Your{" "}
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent-purple)] bg-clip-text text-transparent">
              Competitive Exams
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-[var(--gray-600)] mb-8 max-w-2xl mx-auto leading-relaxed">
            Comprehensive preparation guides for India&apos;s top competitive exams.
            Get complete information about JEE, NEET, MHT-CET, KVPY, and Olympiads.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 py-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--gray-900)]">5+</p>
              <p className="text-sm text-[var(--gray-500)]">Top Exams</p>
            </div>
            <div className="w-px h-12 bg-[var(--gray-200)] hidden sm:block" />
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--gray-900)]">30L+</p>
              <p className="text-sm text-[var(--gray-500)]">Annual Applicants</p>
            </div>
            <div className="w-px h-12 bg-[var(--gray-200)] hidden sm:block" />
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--gray-900)]">1000+</p>
              <p className="text-sm text-[var(--gray-500)]">Top Colleges</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Exam Card Component
function ExamCard({ exam }: { exam: (typeof allExams)[0] }) {
  return (
    <Link
      href={`/exam/${exam.slug}`}
      className="group block bg-white rounded-2xl shadow-sm border border-[var(--gray-100)] overflow-hidden hover:shadow-xl hover:border-[var(--primary-200)] transition-all duration-300"
    >
      {/* Header with Gradient */}
      <div
        className={`h-32 bg-gradient-to-br ${exam.gradient} relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
        <div className="absolute top-4 right-4">
          <CategoryBadge category={exam.category} />
        </div>
        <div className="absolute bottom-4 left-6">
          <h3 className="text-2xl font-bold text-white">{exam.name}</h3>
          <p className="text-white/80 text-sm">{exam.fullName}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-[var(--gray-600)] text-sm mb-4 line-clamp-2">
          {exam.description}
        </p>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--gray-400)]" />
            <span className="text-xs text-[var(--gray-600)]">
              {exam.statistics.totalApplicants}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[var(--gray-400)]" />
            <span className="text-xs text-[var(--gray-600)]">
              {exam.statistics.qualificationRate}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--gray-400)]" />
            <span className="text-xs text-[var(--gray-600)]">
              {exam.importantDates.examDate}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--gray-400)]" />
            <span className="text-xs text-[var(--gray-600)]">
              {exam.syllabus.subjects.length} Subjects
            </span>
          </div>
        </div>

        {/* Difficulty */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--gray-100)]">
          <DifficultyBadge difficulty={exam.difficulty} />
          <span className="inline-flex items-center gap-1 text-sm text-[var(--primary)] font-medium group-hover:gap-2 transition-all">
            View Details <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// Featured Section
function FeaturedSection() {
  const featuredExams = allExams.slice(0, 2);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--gray-900)]">
              Featured Exams
            </h2>
            <p className="text-[var(--gray-500)] mt-1">
              Most popular competitive examinations
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {featuredExams.map((exam) => (
            <Link
              key={exam.id}
              href={`/exam/${exam.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--gray-900)] to-[var(--gray-800)] p-8 lg:p-10 hover:shadow-2xl transition-all duration-300"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" />

              {/* Decorative Circle */}
              <div
                className={`absolute -right-20 -top-20 w-60 h-60 bg-gradient-to-br ${exam.gradient} rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity`}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-full mb-3">
                      <Award className="w-3 h-3" />
                      {exam.category === "engineering"
                        ? "Engineering"
                        : exam.category === "medical"
                        ? "Medical"
                        : exam.category}
                    </span>
                    <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                      {exam.name}
                    </h3>
                    <p className="text-white/70">{exam.fullName}</p>
                  </div>
                </div>

                <p className="text-white/60 text-sm mb-6 line-clamp-2 max-w-md">
                  {exam.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-white/50" />
                    <span className="text-sm text-white/70">
                      {exam.statistics.totalApplicants} Applicants
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/50" />
                    <span className="text-sm text-white/70">
                      Exam: {exam.importantDates.examDate}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
                  Start Preparation
                  <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// All Exams Grid
function AllExamsSection() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--gray-50)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--gray-900)] mb-3">
            All Competitive Exams
          </h2>
          <p className="text-[var(--gray-600)] max-w-2xl mx-auto">
            Explore detailed information about various competitive examinations
            and choose the right path for your career.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Quick Links Section
function QuickLinksSection() {
  const quickLinks = [
    {
      title: "Coaching Institutes",
      description: "Find the best coaching centers for your exam preparation",
      href: "/institutes",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Study Material",
      description: "Access recommended books, notes, and resources",
      href: "/resources",
      icon: Target,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Exam Calendar",
      description: "Never miss an important date with our exam calendar",
      href: "/calendar",
      icon: Calendar,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--gray-900)] mb-8 text-center">
          Quick Access
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="group p-6 rounded-2xl bg-[var(--gray-50)] hover:bg-white border border-transparent hover:border-[var(--gray-100)] hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`inline-flex p-3 bg-gradient-to-br ${link.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}
              >
                <link.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">
                {link.title}
              </h3>
              <p className="text-sm text-[var(--gray-600)] mb-4">
                {link.description}
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-[var(--primary)] font-medium group-hover:gap-2 transition-all">
                Explore <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-purple)]" />
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Not Sure Which Exam to Choose?
        </h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Get personalized guidance from our experts to choose the right exam
          and preparation strategy for your goals.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--primary)] font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Get Free Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all duration-300"
          >
            Browse Institutes
          </Link>
        </div>
      </div>
    </section>
  );
}

// Breadcrumb Navigation
function Breadcrumb() {
  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            href="/"
            className="text-[var(--gray-500)] hover:text-[var(--primary)] transition-colors"
          >
            Home
          </Link>
        </li>
        <ChevronRight className="w-4 h-4 text-[var(--gray-400)]" />
        <li className="text-[var(--primary)] font-medium">Exams</li>
      </ol>
    </nav>
  );
}

// Main Page Component
export default function ExamsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Hero */}
      <HeroSection />

      {/* Featured Exams */}
      <FeaturedSection />

      {/* All Exams */}
      <AllExamsSection />

      {/* Quick Links */}
      <QuickLinksSection />

      {/* CTA */}
      <CTASection />
    </main>
  );
}
