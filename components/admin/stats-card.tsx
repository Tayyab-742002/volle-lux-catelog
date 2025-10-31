// components/admin/stats-card.tsx
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

export function StatsCard({ title, value, icon, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-neutral-300 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between">
        {/* Content */}
        <div className="flex-1 space-y-3">
          <p className="text-sm font-medium text-muted-foreground tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>

        {/* Icon - Unified Brand Style */}
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary/20">
          {icon}
        </div>
      </div>

      {/* Subtle Hover Effect */}
      <div className="absolute inset-0 -z-10  from-primary/0 to-primary/0 transition-all duration-300 group-hover:from-primary/5 group-hover:to-primary/0" />
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-300  bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          {/* Title skeleton */}
          <div className="h-4 w-24 bg-neutral-200  rounded animate-[pulse_3s_ease-in-out_infinite]" />
          {/* Value skeleton */}
          <div className="h-9 w-32 bg-neutral-200  rounded animate-[pulse_3s_ease-in-out_infinite]" />
        </div>
        {/* Icon skeleton */}
        <div className="w-10 h-10 rounded-lg bg-neutral-200  animate-[pulse_3s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
