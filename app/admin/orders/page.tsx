"use client";

import { useState, useEffect } from "react";
import { OrdersTable } from "@/components/admin/orders-table";
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
      const response = await fetch("/api/admin/orders");
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      
      const data = await response.json();
      // Convert dates from strings to Date objects
      const ordersWithDates = data.orders.map((order: any) => ({
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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="mt-2 text-muted-foreground">
          Manage and track customer orders
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-12 text-center">
          <p className="text-lg font-medium text-destructive">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please try refreshing the page
          </p>
        </div>
      ) : (
        <OrdersTable orders={orders} loading={loading} onRefresh={fetchOrders} />
      )}
    </div>
  );
}

