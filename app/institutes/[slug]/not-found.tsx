import Link from 'next/link';
import { Building2, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center py-16">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-[var(--gray-100)] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-10 h-10 text-[var(--gray-400)]" />
        </div>

        <h1 className="text-3xl font-bold text-[var(--gray-900)] mb-2">
          Institute Not Found
        </h1>
        <p className="text-[var(--gray-600)] mb-8">
          We couldn&apos;t find the institute you&apos;re looking for. It may have been
          removed or the URL might be incorrect.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-medium hover:bg-[var(--primary-700)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Institutes
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--gray-200)] text-[var(--gray-700)] rounded-xl font-medium hover:bg-[var(--gray-50)] transition-colors"
          >
            <Search className="w-4 h-4" />
            Search
          </Link>
        </div>
      </div>
    </div>
  );
}
