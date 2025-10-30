/**
 * Status Badge Component
 * Reusable component for displaying order status with appropriate colors
 * Reference: ADMIN_DASHBOARD_PLAN.md
 */

import { Badge } from "@/components/ui/badge";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<
  OrderStatus,
  {
    variant: "default" | "secondary" | "outline" | "destructive";
    label: string;
    className?: string;
  }
> = {
  pending: {
    variant: "default",
    label: "Pending",
  },
  processing: {
    variant: "secondary",
    label: "Processing",
  },
  shipped: {
    variant: "outline",
    label: "Shipped",
  },
  delivered: {
    variant: "outline",
    label: "Delivered",
    className: "text-green-600",
  },
  cancelled: {
    variant: "destructive",
    label: "Cancelled",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge
      variant={config.variant}
      className={config.className || className}
    >
      {config.label}
    </Badge>
  );
}

