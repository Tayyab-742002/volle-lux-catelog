/**
 * Shared Constants
 * Centralized constants used across the application
 */

import type { OrderStatus } from "@/types/cart";

// Re-export OrderStatus for convenience
export type { OrderStatus };

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { className: string; label: string }
> = {
  pending: {
    className: "bg-slate-300 text-slate-700",
    label: "Pending",
  },
  processing: {
    className: "bg-teal-300 text-teal-700",
    label: "Processing",
  },
  shipped: {
    className: "bg-emerald-400 text-emerald-700",
    label: "Shipped",
  },
  delivered: {
    className: "bg-emerald-600 text-white",
    label: "Delivered",
  },
  cancelled: {
    className: "bg-red-500 text-white",
    label: "Cancelled",
  },
};

export const DASHBOARD_COLORS: Record<
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary"
  | "senary"
  | "septenary"
  | "octonary"
  | "nonary"
  | "denary",
  string
> = {
  primary: "bg-[#EA5B6F]",
  secondary: "bg-[#FF894F]",
  tertiary: "bg-[#FFCB61]",
  quaternary: "bg-[#77BEF0]",
  quinary: "bg-indigo-400",
  senary: "bg-purple-400",
  septenary: "bg-green-400",
  octonary: "bg-red-400",
  nonary: "bg-[#000000]",
  denary: "bg-[#FFFFFF]",
};
