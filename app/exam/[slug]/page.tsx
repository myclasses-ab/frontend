import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExamBySlug, examSlugs, ExamInfo } from "@/components/exam/examInfo";
import { ExamDetailPage } from "@/components/exam/ExamDetailPage";

// Generate static params for all exam slugs
export function generateStaticParams() {
  return examSlugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exam = getExamBySlug(slug);

  if (!exam) {
    return {
      title: "Exam Not Found",
      description: "The requested exam information could not be found.",
    };
  }

  return {
    title: `${exam.name} 2025 - Complete Guide | Syllabus, Pattern, Dates`,
    description: exam.metaDescription,
    keywords: exam.metaKeywords,
    authors: [{ name: "My Classes" }],
    openGraph: {
      title: `${exam.fullName} - Complete Preparation Guide`,
      description: exam.description,
      type: "article",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${exam.name} 2025 - Complete Guide`,
      description: exam.description,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `/exam/${slug}`,
    },
  };
}

// Main page component
export default async function ExamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exam = getExamBySlug(slug);

  if (!exam) {
    notFound();
  }

  return <ExamDetailPage exam={exam} />;
}
