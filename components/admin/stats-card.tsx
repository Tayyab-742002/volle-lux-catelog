// components/admin/stats-card.tsx
import { cn } from "@/lib/utils";
import { DASHBOARD_COLORS } from "@/lib/constants";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
  color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "quaternary"
    | "quinary"
    | "senary"
    | "septenary"
    | "octonary"
    | "nonary"
    | "denary";
}

export function StatsCard({
  title,
  value,
  icon,
  className,
  color = "primary",
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl sm:rounded-2xl border border-gray-300 bg-white p-4 sm:p-5 md:p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
        DASHBOARD_COLORS[color],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Content */}
        <div className="flex-1 space-y-2 sm:space-y-3">
          <p className="text-xs font-medium text-gray-600 tracking-wide uppercase">
            {title}
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>

        {/* Icon - Simplified Style */}
        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-emerald-100 text-emerald-600 transition-all duration-200 group-hover:bg-emerald-200">
          {icon}
        </div>
      </div>

      {/* Subtle Hover Effect */}
      <div className="absolute inset-0 -z-10 bg-emerald-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-gray-300 bg-white p-4 sm:p-5 md:p-6 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2 sm:space-y-3">
          {/* Title skeleton */}
          <div className="h-3 sm:h-4 w-20 sm:w-24 bg-emerald-100 rounded animate-pulse" />
          {/* Value skeleton */}
          <div className="h-7 sm:h-8 md:h-9 w-24 sm:w-28 md:w-32 bg-emerald-100 rounded animate-pulse" />
        </div>
        {/* Icon skeleton */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-emerald-100 animate-pulse" />
      </div>
    </div>
  );
}
