export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
      <div className="text-center">
        {/* Animated Loader */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-[var(--primary-100)] rounded-full" />
          <div className="absolute inset-0 border-4 border-[var(--primary)] rounded-full border-t-transparent animate-spin" />
          <div className="absolute inset-2 bg-gradient-to-br from-[var(--primary)] to-[var(--accent-purple)] rounded-full opacity-20 animate-pulse" />
        </div>

        {/* Loading Text */}
        <h2 className="text-xl font-semibold text-[var(--gray-900)] mb-2">
          Loading Exam Details
        </h2>
        <p className="text-[var(--gray-500)]">
          Please wait while we fetch the information...
        </p>
      </div>
    </div>
  );
}
