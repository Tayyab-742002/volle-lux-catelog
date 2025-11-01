/**
 * Status Badge Component
 * Reusable component for displaying order status with appropriate colors
 * Reference: ADMIN_DASHBOARD_PLAN.md
 */

import { Badge } from "@/components/ui/badge";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}
const statusColor= {
  pending: "bg-gray-500 text-white",
  processing: "bg-indigo-500 text-white",
  shipped: "bg-purple-500 text-white",
  delivered: "bg-green-500 text-white",
  cancelled: "bg-red-500 text-white",
};
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
    className: statusColor.pending,
  },
  processing: {
    variant: "secondary",
    label: "Processing",
    className: statusColor.processing,
  },
  shipped: {
    variant: "outline",
    label: "Shipped",
    className: statusColor.shipped,
  },
  delivered: {
    variant: "outline",
    label: "Delivered",
    className: statusColor.delivered,
  },
  cancelled: {
    variant: "destructive",
    label: "Cancelled",
    className: statusColor.cancelled,
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant={config.variant} className={config.className || className}>
      {config.label}
    </Badge>
  );
}
