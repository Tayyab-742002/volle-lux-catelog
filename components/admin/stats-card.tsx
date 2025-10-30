import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: { value: number; type: "increase" | "decrease" };
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {change && (
            <p
              className={cn(
                "mt-2 flex items-center gap-1 text-sm font-medium",
                change.type === "increase"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              <span>
                {change.type === "increase" ? "↑" : "↓"} {Math.abs(change.value)}%
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </p>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-muted p-3">
            <div className="h-5 w-5 text-muted-foreground">{icon}</div>
          </div>
        )}
      </div>
    </Card>
  );
}

