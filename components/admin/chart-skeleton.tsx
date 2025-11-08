/**
 * Professional Skeleton Loaders for Charts
 * Provides smooth loading states to improve perceived performance
 */

export function ChartSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-24 rounded-xl bg-linear-to-br from-emerald-300 to-teal-300 animate-pulse" />
        <div className="h-24 rounded-xl bg-linear-to-br from-emerald-300 to-teal-300 animate-pulse" />
      </div>

      {/* Time Range Buttons */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-10 w-20 bg-emerald-100 rounded-lg animate-pulse"
          />
        ))}
      </div>

      {/* Chart Area */}
      <div className="h-[400px] rounded-xl bg-linear-to-br from-emerald-300 to-teal-300 border border-gray-300">
        {/* Simulate chart lines */}
        <div className="p-6 h-full flex items-end gap-2">
          {[45, 60, 30, 70, 50, 85, 40, 65, 55, 75, 35, 60].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-linear-to-t from-emerald-200 to-emerald-300 rounded-t-lg animate-pulse"
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
      <div className="w-64 h-64 rounded-full bg-linear-to-br from-emerald-300 to-teal-300 border border-gray-300" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-lg">
      <div className="space-y-4 animate-pulse">
        {/* Title */}
        <div className="h-6 w-32 rounded-lg bg-emerald-300" />
        {/* Content */}
        <div className="h-24 rounded-lg bg-emerald-300" />
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-300 bg-white p-8 shadow-lg animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-4">
          <div className="h-4 w-24 rounded-lg bg-emerald-300" />
          <div className="h-10 w-32 rounded-lg bg-emerald-300" />
        </div>
        <div className="h-12 w-12 rounded-xl bg-emerald-300" />
      </div>
    </div>
  );
}
