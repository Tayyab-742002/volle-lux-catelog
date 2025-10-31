"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreVertical,
  Package,
  DollarSign,
  Calendar,
  User,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
} from "lucide-react";
import type { AdminOrder } from "@/services/admin/order.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "./status-badge";
import { ExportButton } from "./export-button";

interface OrdersTableProps {
  orders: AdminOrder[];
  loading?: boolean;
  onRefresh?: () => void;
}

export function OrdersTable({ orders, loading, onRefresh }: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.email.toLowerCase().includes(searchLower) ||
          order.customerName?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter((order) => {
      if (statusFilter === "all") return true;
      return order.status === statusFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case "total":
          comparison = a.total - b.total;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          return 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  if (loading) {
    return <OrdersTableSkeleton />;
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 sm:py-16">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-neutral-100  p-4">
              <Package
                className="h-8 w-8 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              No orders found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Orders will appear here once customers start placing orders
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Filters - Fully Responsive */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full border border-neutral-400 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <ExportButton
              filters={
                statusFilter !== "all" ? { status: statusFilter } : undefined
              }
            />
          </div>
        </div>
      </div>

      {/* Mobile Card View (< 768px) */}
      <div className="md:hidden">
        {filteredOrders.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No orders match your filters
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 ">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

      {/* Desktop Table (≥ 768px) */}
      <div className="hidden md:block px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border border-neutral-400 ">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Order #
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => {
                      if (sortBy === "date") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("date");
                        setSortOrder("desc");
                      }
                    }}
                  >
                    Date
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => {
                      if (sortBy === "total") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("total");
                        setSortOrder("desc");
                      }
                    }}
                  >
                    Total
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => {
                      if (sortBy === "status") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("status");
                        setSortOrder("asc");
                      }
                    }}
                  >
                    Status
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 ">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      No orders match your filters
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 sm:px-6 pb-4 text-sm text-muted-foreground">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>
    </div>
  );
}

// Mobile Card Component
function OrderCard({ order }: { order: AdminOrder }) {
  return (
    <Link
      href={`/admin/orders/${order.id}`}
      className="block p-4 hover:bg-neutral-50 border border-neutral-400 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-sm">#{order.orderNumber}</h3>
            <StatusBadge status={order.status} />
          </div>
          {order.customerName && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3 w-3 shrink-0" />
              <span className="truncate">{order.customerName}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-1.5">
            <Package className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Items</p>
            <p className="text-sm font-semibold">{order.items?.length || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-1.5">
            <DollarSign className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-sm font-semibold truncate">
              ${order.total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-neutral-200  text-xs text-muted-foreground">
        <Calendar className="h-3 w-3 shrink-0" />
        <span>{formatDate(order.createdAt)}</span>
      </div>
    </Link>
  );
}

// Desktop Table Row Component
function OrderRow({ order }: { order: AdminOrder }) {
  return (
    <tr className="hover:bg-neutral-50 border border-neutral-400  transition-colors">
      <td className="py-3 px-4">
        <Link
          href={`/admin/orders/${order.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          #{order.orderNumber}
        </Link>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-muted-foreground">
          {formatDate(order.createdAt)}
        </p>
      </td>
      <td className="py-3 px-4">
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">
            {order.customerName || "Guest"}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {order.email}
          </p>
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
      </td>
      <td className="py-3 px-4">
        <StatusBadge status={order.status} />
      </td>
      <td className="py-3 px-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/orders/${order.id}`}
                className="flex items-center"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

// Loading Skeleton
function OrdersTableSkeleton() {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Filters Skeleton */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="h-10 flex-1 bg-neutral-400  rounded-lg animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-[140px] bg-neutral-400  rounded-lg animate-pulse" />
            <div className="h-10 w-[100px] bg-neutral-400  rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Mobile Skeleton */}
      <div className="md:hidden divide-y divide-neutral-200 ">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 bg-neutral-400  rounded animate-pulse" />
                  <div className="h-5 w-20 bg-neutral-400  rounded-full animate-pulse" />
                </div>
                <div className="h-3 w-32 bg-neutral-400  rounded animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-12 bg-neutral-400  rounded animate-pulse" />
              <div className="h-12 bg-neutral-400  rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden md:block px-4 sm:px-6 pb-4 sm:pb-6">
        <table className="w-full">
          <thead className="border border-neutral-400 ">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">
                Order #
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">
                Date
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">
                Customer
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">
                Total
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">
                Status
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-400 ">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td className="py-3 px-4">
                  <div className="h-4 w-24 bg-neutral-400  rounded animate-pulse" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-24 bg-neutral-400  rounded animate-pulse" />
                </td>
                <td className="py-3 px-4">
                      <div className="h-4 w-32 bg-neutral-400  rounded animate-pulse" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-16 bg-neutral-400  rounded animate-pulse" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-5 w-20 bg-neutral-400  rounded-full animate-pulse" />
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="h-8 w-8 bg-neutral-400  rounded animate-pulse ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper function
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
