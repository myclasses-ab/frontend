import Link from "next/link";
import { ArrowLeft, Search, BookOpen } from "lucide-react";
import { allExams } from "@/components/exam/examInfo";

export default function ExamNotFound() {
  return (
    <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-[var(--primary-100)] to-[var(--primary-50)] rounded-full flex items-center justify-center mx-auto">
            <Search className="w-16 h-16 text-[var(--primary)]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--gray-900)] mb-4">
          Exam Not Found
        </h1>

        {/* Description */}
        <p className="text-lg text-[var(--gray-600)] mb-8 max-w-lg mx-auto">
          Sorry, we couldn&apos;t find the exam you&apos;re looking for. It might have
          been moved or doesn&apos;t exist.
        </p>

        {/* Suggested Exams */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--gray-100)] p-6 mb-8">
          <h2 className="text-lg font-semibold text-[var(--gray-900)] mb-4">
            Available Exams
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {allExams.map((exam) => (
              <Link
                key={exam.id}
                href={`/exam/${exam.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--gray-50)] hover:bg-[var(--primary-50)] text-[var(--gray-700)] hover:text-[var(--primary)] rounded-lg transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                {exam.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/exam"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-700)] text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Browse All Exams
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--gray-700)] font-semibold rounded-xl border border-[var(--gray-200)] hover:border-[var(--primary-300)] hover:bg-[var(--primary-50)] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
