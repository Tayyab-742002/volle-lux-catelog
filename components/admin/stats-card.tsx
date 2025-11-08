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
        "group relative overflow-hidden rounded-2xl border border-gray-300 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
        DASHBOARD_COLORS[color],
        className
      )}
    >
      <div className="flex items-start justify-between">
        {/* Content */}
        <div className="flex-1 space-y-3">
          <p className="text-xs sm:text-sm font-medium text-gray-600 tracking-wide uppercase">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>

        {/* Icon - Unified Brand Style */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-emerald-100 to-teal-100 text-emerald-600 transition-all duration-200 group-hover:from-emerald-200 group-hover:to-teal-200">
          {icon}
        </div>
      </div>

      {/* Subtle Hover Effect */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-emerald-50/50 to-teal-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white p-6 shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          {/* Title skeleton */}
          <div className="h-4 w-24 bg-emerald-100 rounded animate-pulse" />
          {/* Value skeleton */}
          <div className="h-9 w-32 bg-emerald-100 rounded animate-pulse" />
        </div>
        {/* Icon skeleton */}
        <div className="w-12 h-12 rounded-xl bg-emerald-100 animate-pulse" />
      </div>
    </div>
  );
}
