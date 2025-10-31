/**
 * Professional Skeleton Loaders for Charts
 * Provides smooth loading states to improve perceived performance
 */

export function ChartSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-24 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 animate-pulse" />
        <div className="h-24 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 animate-pulse" />
      </div>

      {/* Time Range Buttons */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-10 w-20 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse"
          />
        ))}
      </div>

      {/* Chart Area */}
      <div className="h-[400px] rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
        {/* Simulate chart lines */}
        <div className="p-6 h-full flex items-end gap-2">
          {[45, 60, 30, 70, 50, 85, 40, 65, 55, 75, 35, 60].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-neutral-300 to-neutral-200 rounded-t-lg dark:from-neutral-700 dark:to-neutral-800 animate-pulse"
              style={{
                height: `${height}%`,
                animationDelay: `${i * 50}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function DoughnutSkeleton() {
  return (
    <div className="h-[400px] flex items-center justify-center animate-pulse">
      <div className="w-64 h-64 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
      <div className="space-y-4 animate-pulse">
        {/* Title */}
        <div className="h-6 w-32 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        {/* Content */}
        <div className="h-24 rounded-lg bg-neutral-100 dark:bg-neutral-900" />
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-4">
          <div className="h-4 w-24 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-10 w-32 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="h-12 w-12 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  );
}
