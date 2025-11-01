/**
 * Status Badge Component
 * Reusable component for displaying order status with appropriate colors
 * Reference: ADMIN_DASHBOARD_PLAN.md
 */

import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/constants";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const variantConfig: Record<
  OrderStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "default",
  processing: "secondary",
  shipped: "outline",
  delivered: "outline",
  cancelled: "destructive",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status];
  const variant = variantConfig[status] || "default";

  return (
    <Badge variant={variant} className={config.className || className}>
      {config.label}
    </Badge>
  );
}
