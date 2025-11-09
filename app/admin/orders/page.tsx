"use client";

import { useState, useEffect } from "react";
// PERFORMANCE: Dynamic import for heavy OrdersTable component
import dynamic from "next/dynamic";
import { AdminTableSkeleton } from "@/components/admin/admin-table-loader";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminOrder } from "@/services/admin/order.service";

// PERFORMANCE: Code split OrdersTable (large component with filtering/sorting)
const OrdersTable = dynamic(
  () => import("@/components/admin/orders-table").then((mod) => ({ default: mod.OrdersTable })),
  {
    loading: () => <AdminTableSkeleton />,
    ssr: false, // Client-only component with interactivity
  }
);

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/orders");

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      // Convert dates from strings to Date objects
      const ordersWithDates = data.orders.map((order: AdminOrder) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
      }));
      setOrders(ordersWithDates);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section - Fully Responsive */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
            <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
            Orders
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed sm:text-base">
            Manage and track customer orders
          </p>
        </div>

        {/* Quick Stats - Mobile: Stack, Tablet+: Row */}
        {!loading && !error && orders.length > 0 && (
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-linear-to-r from-emerald-100 to-teal-100 border border-emerald-200 px-4 py-2 shadow-sm">
              <span className="text-sm font-medium text-emerald-700">
                Total
              </span>
              <span className="text-lg font-bold tracking-tight text-emerald-700">
                {orders.length}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchOrders}
              disabled={loading}
              className="gap-2 border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                strokeWidth={2}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        )}
      </div>

      {/* Error State - Professional */}
      {error ? (
        <div className="flex items-center justify-center py-16 sm:py-20">
          <div className="text-center space-y-4 max-w-md px-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-linear-to-br from-red-100 to-orange-100 p-4 border border-red-200">
                <AlertTriangle
                  className="h-8 w-8 text-red-600"
                  strokeWidth={2}
                />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-300">
              <p className="text-lg font-semibold text-gray-900">{error}</p>
              <p className="mt-2 text-sm text-gray-600">
                Unable to load orders. Please check your connection and try
                again.
              </p>
            </div>
            <Button
              onClick={fetchOrders}
              variant="outline"
              className="mt-4 border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" strokeWidth={2} />
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        /* Orders Table */
        <div className="rounded-2xl border border-gray-300 p-4 bg-white shadow-lg overflow-hidden">
          <OrdersTable
            orders={orders}
            loading={loading}
            onRefresh={fetchOrders}
          />
        </div>
      )}
    </div>
  );
}
