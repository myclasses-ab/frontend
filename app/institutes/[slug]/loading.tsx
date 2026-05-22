export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Banner Skeleton */}
      <div className="h-64 lg:h-80 bg-[var(--gray-300)] animate-pulse" />

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Logo Skeleton */}
          <div className="w-24 h-24 lg:w-28 lg:h-28 bg-[var(--gray-300)] rounded-2xl animate-pulse" />

          {/* Info Skeleton */}
          <div className="flex-1 space-y-3 pt-4">
            <div className="h-8 bg-[var(--gray-300)] rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-[var(--gray-300)] rounded w-1/4 animate-pulse" />
            <div className="flex gap-3 mt-4">
              <div className="h-6 w-24 bg-[var(--gray-300)] rounded-full animate-pulse" />
              <div className="h-6 w-24 bg-[var(--gray-300)] rounded-full animate-pulse" />
              <div className="h-6 w-24 bg-[var(--gray-300)] rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Skeleton */}
      <div className="mt-8 border-b border-[var(--gray-200)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 bg-[var(--gray-200)] rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-[var(--gray-200)] rounded-2xl animate-pulse" />
            <div className="h-48 bg-[var(--gray-200)] rounded-2xl animate-pulse" />
          </div>
          <div className="lg:col-span-1">
            <div className="h-96 bg-[var(--gray-200)] rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
