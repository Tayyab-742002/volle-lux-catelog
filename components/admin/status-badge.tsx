/**
 * Status Badge Component
 * Reusable component for displaying order status with appropriate colors
 * Reference: ADMIN_DASHBOARD_PLAN.md
 */

import type { OrderStatus } from "@/lib/constants";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        config?.className || className || ORDER_STATUS_CONFIG.processing.className
      }`}
    >
      {config?.label || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
