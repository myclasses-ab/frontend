"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  Award,
  BookOpen,
  ChevronRight,
  MapPin,
  Target,
  FileText,
  CheckCircle2,
  AlertCircle,
  Globe,
  GraduationCap,
  TrendingUp,
  Lightbulb,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  Star,
  Brain,
  Calculator,
  Atom,
  FlaskConical,
  Microscope,
  School,
} from "lucide-react";
import { ExamInfo, getRelatedExams } from "./examInfo";
import { LucideIcon } from "lucide-react";

// Icon mapping for dynamic icons
const iconMap: Record<string, LucideIcon> = {
  Atom,
  BookOpen,
  Calculator,
  Clock,
  FileText,
  Target,
  Lightbulb,
  FlaskConical,
  Microscope,
  School,
  Brain,
  Globe,
  Users,
};

// Helper function to get icon component by name
function getIconByName(iconName: string | undefined): LucideIcon {
  return iconName && iconMap[iconName] ? iconMap[iconName] : BookOpen;
}

interface ExamDetailPageProps {
  exam: ExamInfo;
}

// Animation hook
function useScrollAnimation() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  return { isVisible };
}

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
    high: "bg-yellow-100 text-yellow-700 border-yellow-200",
    "very-high": "bg-orange-100 text-orange-700 border-orange-200",
    extreme: "bg-red-100 text-red-700 border-red-200",
  };

  const labels: Record<string, string> = {
    high: "High Difficulty",
    "very-high": "Very High Difficulty",
    extreme: "Extreme Difficulty",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
        styles[difficulty] || styles.high
      }`}
    >
      <Target className="w-3 h-3" />
      {labels[difficulty] || difficulty}
    </span>
  );
}

// Section Title Component
function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-[var(--primary-50)] rounded-lg">
          <Icon className="w-5 h-5 text-[var(--primary)]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--gray-900)]">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-[var(--gray-600)] ml-11">{subtitle}</p>
      )}
    </div>
  );
}

// Hero Section
function HeroSection({ exam }: { exam: ExamInfo }) {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${exam.gradient} opacity-10`}
      />
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" />

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-white/40 to-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-white/30 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <CategoryBadge category={exam.category} />
              <DifficultyBadge difficulty={exam.difficulty} />
            </div>

            {/* Title */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--gray-900)] leading-tight">
                {exam.name}{" "}
                <span
                  className={`bg-gradient-to-r ${exam.gradient} bg-clip-text text-transparent`}
                >
                  2025
                </span>
              </h1>
              <p className="mt-2 text-lg text-[var(--gray-600)]">
                {exam.fullName}
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-[var(--gray-700)] leading-relaxed">
              {exam.description}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 py-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--gray-400)]" />
                <span className="text-sm text-[var(--gray-600)]">
                  <strong className="text-[var(--gray-900)]">
                    {exam.statistics.totalApplicants}
                  </strong>{" "}
                  Applicants
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[var(--gray-400)]" />
                <span className="text-sm text-[var(--gray-600)]">
                  <strong className="text-[var(--gray-900)]">
                    {exam.statistics.qualificationRate}
                  </strong>{" "}
                  Qualify
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[var(--gray-400)]" />
                <span className="text-sm text-[var(--gray-600)]">
                  {exam.conductingBody}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="#important-dates"
                className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${exam.gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}
              >
                <Calendar className="w-5 h-5" />
                View Important Dates
              </a>
              <a
                href="#syllabus"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--gray-700)] font-semibold rounded-xl border border-[var(--gray-200)] hover:border-[var(--primary-300)] hover:bg-[var(--primary-50)] transition-all duration-300"
              >
                <BookOpen className="w-5 h-5" />
                Check Syllabus
              </a>
            </div>
          </div>

          {/* Right Content - Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-shadow duration-300">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl w-fit mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-[var(--gray-900)]">
                {exam.statistics.totalApplicants}
              </p>
              <p className="text-sm text-[var(--gray-600)]">Annual Applicants</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-shadow duration-300 mt-8">
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl w-fit mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-[var(--gray-900)]">
                {exam.statistics.qualificationRate}
              </p>
              <p className="text-sm text-[var(--gray-600)]">Qualification Rate</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-shadow duration-300">
              <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl w-fit mb-4">
                <Star className="w-8 h-8 text-amber-600" />
              </div>
              <p className="text-3xl font-bold text-[var(--gray-900)]">
                {exam.statistics.totalSeats || "Limited"}
              </p>
              <p className="text-sm text-[var(--gray-600)]">Available Seats</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-shadow duration-300 mt-8">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl w-fit mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-[var(--gray-900)]">
                {exam.statistics.successRate}
              </p>
              <p className="text-sm text-[var(--gray-600)]">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Overview Section
function OverviewSection({ exam }: { exam: ExamInfo }) {
  const { isVisible } = useScrollAnimation();

  return (
    <section
      id="overview"
      data-animate
      className={`py-16 lg:py-24 bg-[var(--gray-50)] transition-all duration-700 ${
        isVisible("overview") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          icon={GraduationCap}
          title="About the Examination"
          subtitle="Everything you need to know about this prestigious examination"
        />

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--gray-100)] hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-bold text-[var(--gray-900)] mb-4">
              What is {exam.name}?
            </h3>
            <p className="text-[var(--gray-600)] leading-relaxed">
              {exam.overview.about}
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--gray-100)] hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-bold text-[var(--gray-900)] mb-4">
              Purpose & Scope
            </h3>
            <p className="text-[var(--gray-600)] leading-relaxed mb-4">
              {exam.overview.purpose}
            </p>
            <p className="text-[var(--gray-600)] leading-relaxed">
              {exam.overview.scope}
            </p>
          </div>

          <div className="lg:col-span-2 bg-gradient-to-r from-[var(--primary-50)] to-white p-8 rounded-2xl border border-[var(--primary-100)]">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[var(--primary)] rounded-xl shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">
                  Recognition & Prestige
                </h3>
                <p className="text-[var(--gray-600)] leading-relaxed">
                  {exam.overview.recognition}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Eligibility Section
function EligibilitySection({ exam }: { exam: ExamInfo }) {
  const { isVisible } = useScrollAnimation();

  const criteria = [
    {
      icon: BookOpen,
      title: "Educational Qualification",
      content: exam.eligibility.education,
    },
    ...(exam.eligibility.ageLimit
      ? [
          {
            icon: Clock,
            title: "Age Limit",
            content: exam.eligibility.ageLimit,
          },
        ]
      : []),
    ...(exam.eligibility.attempts
      ? [
          {
            icon: Target,
            title: "Number of Attempts",
            content: exam.eligibility.attempts,
          },
        ]
      : []),
    {
      icon: Globe,
      title: "Nationality",
      content: exam.eligibility.nationality,
    },
  ];

  return (
    <section
      id="eligibility"
      data-animate
      className={`py-16 lg:py-24 transition-all duration-700 ${
        isVisible("eligibility")
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          icon={CheckCircle2}
          title="Eligibility Criteria"
          subtitle="Make sure you meet all the requirements before applying"
        />

        <div className="grid md:grid-cols-2 gap-6">
          {criteria.map((criterion, index) => (
            <div
              key={criterion.title}
              className="bg-white p-6 rounded-xl shadow-sm border border-[var(--gray-100)] hover:shadow-md hover:border-[var(--primary-200)] transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[var(--primary-50)] rounded-lg shrink-0">
                  <criterion.icon className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--gray-900)] mb-2">
                    {criterion.title}
                  </h3>
                  <p className="text-sm text-[var(--gray-600)]">
                    {criterion.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {exam.eligibility.other && exam.eligibility.other.length > 0 && (
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">
                  Additional Requirements
                </h4>
                <ul className="space-y-2">
                  {exam.eligibility.other.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm text-amber-700 flex items-start gap-2"
                    >
                      <span className="text-amber-500 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Exam Pattern Section
function ExamPatternSection({ exam }: { exam: ExamInfo }) {
  const { isVisible } = useScrollAnimation();

  return (
    <section
      id="exam-pattern"
      data-animate
      className={`py-16 lg:py-24 bg-[var(--gray-50)] transition-all duration-700 ${
        isVisible("exam-pattern")
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          icon={FileText}
          title="Exam Pattern"
          subtitle="Understanding the examination structure and marking scheme"
        />

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl text-center border border-[var(--gray-100)]">
            <Clock className="w-6 h-6 text-[var(--primary)] mx-auto mb-2" />
            <p className="text-lg font-bold text-[var(--gray-900)]">
              {exam.examPattern.duration}
            </p>
            <p className="text-xs text-[var(--gray-500)]">Duration</p>
          </div>
          <div className="bg-white p-4 rounded-xl text-center border border-[var(--gray-100)]">
            <Target className="w-6 h-6 text-[var(--accent-green)] mx-auto mb-2" />
            <p className="text-lg font-bold text-[var(--gray-900)]">
              {exam.examPattern.totalMarks}
            </p>
            <p className="text-xs text-[var(--gray-500)]">Total Marks</p>
          </div>
          <div className="bg-white p-4 rounded-xl text-center border border-[var(--gray-100)]">
            <BookOpen className="w-6 h-6 text-[var(--accent-orange)] mx-auto mb-2" />
            <p className="text-lg font-bold text-[var(--gray-900)]">
              {exam.examPattern.totalQuestions || "Varies"}
            </p>
            <p className="text-xs text-[var(--gray-500)]">Questions</p>
          </div>
          <div className="bg-white p-4 rounded-xl text-center border border-[var(--gray-100)]">
            <Globe className="w-6 h-6 text-[var(--accent-purple)] mx-auto mb-2" />
            <p className="text-lg font-bold text-[var(--gray-900)]">
              {exam.examPattern.languages.length}+
            </p>
            <p className="text-xs text-[var(--gray-500)]">Languages</p>
          </div>
        </div>

        {/* Sections Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--gray-100)] overflow-hidden mb-8">
          <div className="p-6 border-b border-[var(--gray-100)]">
            <h3 className="text-lg font-bold text-[var(--gray-900)]">
              Section-wise Breakdown
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--gray-50)]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--gray-700)]">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[var(--gray-700)]">
                    Questions
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[var(--gray-700)]">
                    Marks
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--gray-700)]">
                    Negative Marking
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--gray-100)]">
                {exam.examPattern.sections.map((section, index) => (
                  <tr key={index} className="hover:bg-[var(--gray-50)] transition-colors">
                    <td className="px-6 py-4 font-medium text-[var(--gray-900)]">
                      {section.subject}
                    </td>
                    <td className="px-6 py-4 text-center text-[var(--gray-600)]">
                      {section.questions}
                    </td>
                    <td className="px-6 py-4 text-center text-[var(--gray-600)]">
                      {section.marks}
                    </td>
                    <td className="px-6 py-4 text-[var(--gray-600)]">
                      {section.negativeMarking}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Marking Scheme */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h4 className="font-semibold text-emerald-800">Correct Answer</h4>
            </div>
            <p className="text-emerald-700">{exam.examPattern.markingScheme.correct}</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h4 className="font-semibold text-red-800">Incorrect Answer</h4>
            </div>
            <p className="text-red-700">{exam.examPattern.markingScheme.incorrect}</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <h4 className="font-semibold text-gray-800">Unattempted</h4>
            </div>
            <p className="text-gray-700">{exam.examPattern.markingScheme.unattempted}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Syllabus Section
function SyllabusSection({ exam }: { exam: ExamInfo }) {
  const { isVisible } = useScrollAnimation();
  const [activeSubject, setActiveSubject] = useState(0);

  const iconMap: Record<string, LucideIcon> = {
    Physics: Atom,
    Chemistry: FlaskConical,
    Mathematics: Calculator,
    Biology: Microscope,
    Botany: Microscope,
    Zoology: Microscope,
  };

  return (
    <section
      id="syllabus"
      data-animate
      className={`py-16 lg:py-24 transition-all duration-700 ${
        isVisible("syllabus")
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          icon={BookOpen}
          title="Syllabus"
          subtitle="Comprehensive topic list for your preparation"
        />

        {/* Subject Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {exam.syllabus.subjects.map((subject, index) => {
            const SubjectIcon = getIconByName(subject.iconName);
            return (
              <button
                key={subject.name}
                onClick={() => setActiveSubject(index)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  activeSubject === index
                    ? `bg-gradient-to-r ${exam.gradient} text-white shadow-md`
                    : "bg-white text-[var(--gray-600)] border border-[var(--gray-200)] hover:border-[var(--primary-300)] hover:bg-[var(--primary-50)]"
                }`}
              >
                <SubjectIcon className="w-4 h-4" />
                {subject.name}
                {subject.weightage && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      activeSubject === index
                        ? "bg-white/20"
                        : "bg-[var(--gray-100)]"
                    }`}
                  >
                    {subject.weightage}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Topics Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--gray-100)] p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            {React.createElement(
              getIconByName(exam.syllabus.subjects[activeSubject].iconName),
              { className: "w-6 h-6 text-[var(--primary)]" }
            )}
            <h3 className="text-xl font-bold text-[var(--gray-900)]">
              {exam.syllabus.subjects[activeSubject].name} Topics
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exam.syllabus.subjects[activeSubject].topics.map((topic, index) => (
              <div
                key={topic}
                className="flex items-start gap-3 p-4 bg-[var(--gray-50)] rounded-xl hover:bg-[var(--primary-50)] transition-colors duration-200"
              >
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-white text-[var(--primary)] text-xs font-bold rounded-lg shadow-sm">
                  {index + 1}
                </span>
                <span className="text-sm text-[var(--gray-700)]">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Important Dates Section
function ImportantDatesSection({ exam }: { exam: ExamInfo }) {
  const { isVisible } = useScrollAnimation();

  // Check if the date is in the future
  const isUpcoming = (dateStr: string): boolean => {
    const currentYear = new Date().getFullYear();
    return dateStr.includes(String(currentYear)) || dateStr.includes(String(currentYear + 1));
  };

  return (
    <section
      id="important-dates"
      data-animate
      className={`py-16 lg:py-24 bg-[var(--gray-50)] transition-all duration-700 ${
        isVisible("important-dates")
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          icon={Calendar}
          title="Important Dates"
          subtitle="Mark your calendar with these crucial deadlines"
        />

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--primary)] to-[var(--primary-300)]" />

          <div className="space-y-8">
            {exam.importantDates.dates.map((date, index) => {
              const isEven = index % 2 === 0;
              const upcoming = isUpcoming(date.date);

              return (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } flex-row gap-4 lg:gap-8`}
                >
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-4 lg:left-1/2 w-4 h-4 rounded-full border-4 transform -translate-x-1/2 z-10 ${
                      date.isImportant
                        ? "bg-[var(--accent-orange)] border-orange-200"
                        : upcoming
                        ? "bg-[var(--primary)] border-[var(--primary-100)]"
                        : "bg-[var(--gray-300)] border-[var(--gray-100)]"
                    }`}
                  />

                  {/* Content Card */}
                  <div
                    className={`ml-12 lg:ml-0 lg:w-[calc(50%-2rem)] bg-white p-6 rounded-xl shadow-sm border ${
                      date.isImportant
                        ? "border-[var(--accent-orange)] shadow-orange-100"
                        : "border-[var(--gray-100)]"
                    } hover:shadow-md transition-shadow duration-300`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-[var(--gray-900)] mb-1">
                          {date.event}
                        </h4>
                        <p className="text-sm text-[var(--primary)] font-medium">
                          {date.date}
                        </p>
                        {date.description && (
                          <p className="text-sm text-[var(--gray-500)] mt-2">
                            {date.description}
                          </p>
                        )}
                      </div>
                      {date.isImportant && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full shrink-0">
                          Important
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden lg:block lg:w-[calc(50%-2rem)]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Preparation Tips Section
function PreparationTipsSection({ exam }: { exam: ExamInfo }) {
  const { isVisible } = useScrollAnimation();

  return (
    <section
      id="preparation-tips"
      data-animate
      className={`py-16 lg:py-24 transition-all duration-700 ${
        isVisible("preparation-tips")
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          icon={Lightbulb}
          title="Preparation Tips"
          subtitle="Expert strategies to help you excel in the examination"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exam.preparationTips.map((tip, index) => (
            <div
              key={tip.title}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-[var(--gray-100)] hover:shadow-lg hover:border-[var(--primary-200)] transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`p-3 bg-gradient-to-br ${exam.gradient} rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                {React.createElement(getIconByName(tip.iconName), { className: "w-6 h-6 text-white" })}
              </div>
              <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">
                {tip.title}
              </h3>
              <p className="text-sm text-[var(--gray-600)] leading-relaxed">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Top Colleges Section
function TopCollegesSection({ exam }: { exam: ExamInfo }) {
  const { isVisible } = useScrollAnimation();

  if (!exam.topColleges || exam.topColleges.length === 0) return null;

  return (
    <section
      id="top-colleges"
      data-animate
      className={`py-16 lg:py-24 bg-[var(--gray-50)] transition-all duration-700 ${
        isVisible("top-colleges")
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          icon={School}
          title="Top Institutes"
          subtitle={`Premier institutions accepting ${exam.name} scores`}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {exam.topColleges.map((college, index) => (
            <div
              key={college.name}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-[var(--gray-100)] hover:shadow-lg hover:border-[var(--primary-200)] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-2 bg-gradient-to-br ${exam.gradient} rounded-lg`}
                >
                  <span className="text-white font-bold">#{college.ranking}</span>
                </div>
                {college.seats && (
                  <span className="text-xs text-[var(--gray-500)]">
                    {college.seats} seats
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-[var(--gray-900)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                {college.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-[var(--gray-500)]">
                <MapPin className="w-4 h-4" />
                {college.location}
              </div>
              {college.cutoff && (
                <div className="mt-3 pt-3 border-t border-[var(--gray-100)]">
                  <span className="text-xs text-[var(--gray-500)]">Cutoff: </span>
                  <span className="text-sm font-medium text-[var(--accent-orange)]">
                    {college.cutoff}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQs Section
function FAQsSection({ exam }: { exam: ExamInfo }) {
  const { isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faqs"
      data-animate
      className={`py-16 lg:py-24 transition-all duration-700 ${
        isVisible("faqs") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          icon={HelpCircle}
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about the examination"
        />

        <div className="space-y-4">
          {exam.faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl border transition-all duration-300 ${
                openIndex === index
                  ? "border-[var(--primary-200)] shadow-md"
                  : "border-[var(--gray-100)] hover:border-[var(--gray-200)]"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-[var(--gray-900)] pr-4">
                  {faq.question}
                </span>
                <ChevronRight
                  className={`w-5 h-5 text-[var(--gray-400)] shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-90" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-6 text-[var(--gray-600)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Resources Section
function ResourcesSection({ exam }: { exam: ExamInfo }) {
  const { isVisible } = useScrollAnimation();

  return (
    <section
      id="resources"
      data-animate
      className={`py-16 lg:py-24 bg-[var(--gray-50)] transition-all duration-700 ${
        isVisible("resources")
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          icon={ExternalLink}
          title="Official Resources"
          subtitle="Important links and resources for your preparation"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Official Website */}
          <a
            href={exam.resources.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white p-6 rounded-xl shadow-sm border border-[var(--gray-100)] hover:shadow-md hover:border-[var(--primary-200)] transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[var(--primary-50)] rounded-lg group-hover:bg-[var(--primary)] transition-colors">
                <Globe className="w-5 h-5 text-[var(--primary)] group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--gray-900)] mb-1">
                  Official Website
                </h3>
                <p className="text-sm text-[var(--gray-500)] mb-3">
                  Visit the official portal for updates
                </p>
                <span className="inline-flex items-center gap-1 text-sm text-[var(--primary)] font-medium">
                  Visit Now <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </a>

          {/* Notification PDF */}
          {exam.resources.notificationPdf && (
            <a
              href={exam.resources.notificationPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white p-6 rounded-xl shadow-sm border border-[var(--gray-100)] hover:shadow-md hover:border-[var(--primary-200)] transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-500 transition-colors">
                  <FileText className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--gray-900)] mb-1">
                    Official Notification
                  </h3>
                  <p className="text-sm text-[var(--gray-500)] mb-3">
                    Download the official brochure
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium">
                    Download PDF <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </a>
          )}

          {/* Previous Papers */}
          {exam.resources.previousPapers && exam.resources.previousPapers.length > 0 && (
            <a
              href={exam.resources.previousPapers[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white p-6 rounded-xl shadow-sm border border-[var(--gray-100)] hover:shadow-md hover:border-[var(--primary-200)] transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 rounded-lg group-hover:bg-amber-500 transition-colors">
                  <BookOpen className="w-5 h-5 text-amber-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--gray-900)] mb-1">
                    Previous Year Papers
                  </h3>
                  <p className="text-sm text-[var(--gray-500)] mb-3">
                    Practice with past exam papers
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-amber-600 font-medium">
                    Access Papers <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// Related Exams Section
function RelatedExamsSection({ exam }: { exam: ExamInfo }) {
  const { isVisible } = useScrollAnimation();
  const relatedExams = getRelatedExams(exam.id, 3);

  if (relatedExams.length === 0) return null;

  return (
    <section
      id="related-exams"
      data-animate
      className={`py-16 lg:py-24 transition-all duration-700 ${
        isVisible("related-exams")
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          icon={Award}
          title="Related Examinations"
          subtitle="Explore similar examinations you might be interested in"
        />

        <div className="grid md:grid-cols-3 gap-6">
          {relatedExams.map((relatedExam) => (
            <Link
              key={relatedExam.id}
              href={`/exam/${relatedExam.slug}`}
              className="group bg-white p-6 rounded-xl shadow-sm border border-[var(--gray-100)] hover:shadow-lg hover:border-[var(--primary-200)] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 bg-gradient-to-br ${relatedExam.gradient} rounded-xl`}
                >
                  <Award className="w-6 h-6 text-white" />
                </div>
                <CategoryBadge category={relatedExam.category} />
              </div>
              <h3 className="font-bold text-[var(--gray-900)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                {relatedExam.name}
              </h3>
              <p className="text-sm text-[var(--gray-600)] line-clamp-2 mb-4">
                {relatedExam.description}
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-[var(--primary)] font-medium group-hover:gap-2 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection({ exam }: { exam: ExamInfo }) {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-r ${exam.gradient} opacity-95`}
      />
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to Crack {exam.name}?
        </h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Find the best coaching institutes and study materials to help you achieve
          your dream rank in {exam.name}.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--gray-900)] font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <School className="w-5 h-5" />
            Find Coaching Institutes
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all duration-300"
          >
            <BookOpen className="w-5 h-5" />
            Browse Courses
          </Link>
        </div>
      </div>
    </section>
  );
}

// Breadcrumb Navigation
function Breadcrumb({ exam }: { exam: ExamInfo }) {
  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link href="/" className="text-[var(--gray-500)] hover:text-[var(--primary)] transition-colors">
            Home
          </Link>
        </li>
        <ChevronRight className="w-4 h-4 text-[var(--gray-400)]" />
        <li>
          <Link href="/exam" className="text-[var(--gray-500)] hover:text-[var(--primary)] transition-colors">
            Exams
          </Link>
        </li>
        <ChevronRight className="w-4 h-4 text-[var(--gray-400)]" />
        <li className="text-[var(--primary)] font-medium">{exam.name}</li>
      </ol>
    </nav>
  );
}

// Main Exam Detail Page Component
export function ExamDetailPage({ exam }: ExamDetailPageProps) {
  return (
    <article className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <Breadcrumb exam={exam} />

      {/* Hero Section */}
      <HeroSection exam={exam} />

      {/* Overview */}
      <OverviewSection exam={exam} />

      {/* Eligibility */}
      <EligibilitySection exam={exam} />

      {/* Exam Pattern */}
      <ExamPatternSection exam={exam} />

      {/* Syllabus */}
      <SyllabusSection exam={exam} />

      {/* Important Dates */}
      <ImportantDatesSection exam={exam} />

      {/* Preparation Tips */}
      <PreparationTipsSection exam={exam} />

      {/* Top Colleges */}
      <TopCollegesSection exam={exam} />

      {/* FAQs */}
      <FAQsSection exam={exam} />

      {/* Resources */}
      <ResourcesSection exam={exam} />

      {/* Related Exams */}
      <RelatedExamsSection exam={exam} />

      {/* CTA */}
      <CTASection exam={exam} />
    </article>
  );
}

export default ExamDetailPage;
