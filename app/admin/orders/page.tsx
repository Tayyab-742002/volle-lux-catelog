"use client";

import { useState, useEffect } from "react";
import { OrdersTable } from "@/components/admin/orders-table";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminOrder } from "@/services/admin/order.service";

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
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Orders
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed sm:text-base">
            Manage and track customer orders
          </p>
        </div>

        {/* Quick Stats - Mobile: Stack, Tablet+: Row */}
        {!loading && !error && orders.length > 0 && (
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-primary/30 px-4 py-2 shadow-sm">
              <span className="text-sm font-medium ">Total</span>
              <span className="text-lg font-bold tracking-tight text-primary">
                {orders.length}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchOrders}
              disabled={loading}
              className="gap-2 border "
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
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
              <div className="rounded-full bg-neutral-100  p-4">
                <AlertTriangle
                  className="h-8 w-8 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{error}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Unable to load orders. Please check your connection and try
                again.
              </p>
            </div>
            <Button onClick={fetchOrders} variant="outline" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        /* Orders Table */
        <div className="rounded-xl border  p-4  bg-card shadow-sm overflow-hidden">
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
