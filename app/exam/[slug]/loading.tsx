export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--gray-100)] to-[var(--gray-50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {/* Badges Skeleton */}
              <div className="flex gap-2">
                <div className="w-24 h-6 bg-white/50 rounded-full animate-pulse" />
                <div className="w-32 h-6 bg-white/50 rounded-full animate-pulse" />
              </div>

              {/* Title Skeleton */}
              <div className="space-y-2">
                <div className="w-3/4 h-12 bg-white/60 rounded-lg animate-pulse" />
                <div className="w-1/2 h-6 bg-white/40 rounded-lg animate-pulse" />
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2">
                <div className="w-full h-4 bg-white/40 rounded animate-pulse" />
                <div className="w-full h-4 bg-white/40 rounded animate-pulse" />
                <div className="w-2/3 h-4 bg-white/40 rounded animate-pulse" />
              </div>

              {/* Stats Skeleton */}
              <div className="flex gap-6 py-4">
                <div className="w-24 h-8 bg-white/50 rounded animate-pulse" />
                <div className="w-24 h-8 bg-white/50 rounded animate-pulse" />
                <div className="w-24 h-8 bg-white/50 rounded animate-pulse" />
              </div>
            </div>

            {/* Cards Skeleton */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white/60 p-6 rounded-2xl h-32 animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[var(--gray-50)] rounded-2xl p-8 animate-pulse"
            >
              <div className="w-48 h-8 bg-[var(--gray-200)] rounded-lg mb-6" />
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <div
                    key={j}
                    className="h-24 bg-white rounded-xl"
                    style={{ animationDelay: `${(i + j) * 100}ms` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
