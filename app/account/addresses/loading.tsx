export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-neutral-400 rounded animate-pulse" />
          <div className="h-5 w-64 bg-neutral-400 rounded animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-neutral-400 rounded animate-pulse" />
      </div>

      {/* Address Grid Skeleton */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-neutral-400 bg-card p-4 sm:p-6"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1 space-y-2">
                <div className="h-6 w-32 bg-neutral-400 rounded animate-pulse" />
                <div className="h-4 w-40 bg-neutral-400 rounded animate-pulse" />
              </div>
              <div className="flex gap-1">
                <div className="h-8 w-8 bg-neutral-400 rounded animate-pulse" />
                <div className="h-8 w-8 bg-neutral-400 rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-neutral-400 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-neutral-400 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-neutral-400 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
