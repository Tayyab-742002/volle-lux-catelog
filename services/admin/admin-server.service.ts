/**
 * Admin Service - Server-Side Only
 * Direct database queries for admin dashboard
 * Uses service role client to bypass RLS for admin operations
 */

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { AdminOrder } from "./order.service";
import type { AdminCustomer } from "./customer.service";
import {
  getAllB2BRequests,
  getPendingB2BRequestsCount,
} from "@/services/b2b/b2b-request.service";
import type { AdminB2BRequest } from "@/types/b2b-request";

/**
 * Dashboard Stats Interface
 */
export interface DashboardStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  todayRevenue: number;
  averageOrderValue: number;
  totalCustomers: number;
}

/**
 * Get dashboard stats (Server-side only)
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createServiceRoleClient();

  try {
    // Get all orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("status, total_amount, created_at");

    if (ordersError) {
      console.error("Error fetching orders for stats:", ordersError);
      return getDefaultStats();
    }

    // Get total customers
    const { count: customerCount, error: customersError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "customer");

    if (customersError) {
      console.error("Error fetching customer count:", customersError);
    }

    // Calculate stats - Type assertion for Supabase query result
    const allOrders = (orders || []) as Array<{
      status: string;
      total_amount: string;
      created_at: string;
    }>;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
      total: allOrders.length,
      pending: allOrders.filter((o) => o.status === "pending").length,
      processing: allOrders.filter((o) => o.status === "processing").length,
      shipped: allOrders.filter((o) => o.status === "shipped").length,
      delivered: allOrders.filter((o) => o.status === "delivered").length,
      cancelled: allOrders.filter((o) => o.status === "cancelled").length,
      todayRevenue: allOrders
        .filter((o) => new Date(o.created_at) >= today)
        .reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0),
      averageOrderValue:
        allOrders.length > 0
          ? allOrders.reduce(
              (sum, o) => sum + (parseFloat(o.total_amount) || 0),
              0
            ) / allOrders.length
          : 0,
      totalCustomers: customerCount || 0,
    };

    return stats;
  } catch (error) {
    console.error("Error calculating dashboard stats:", error);
    return getDefaultStats();
  }
}

function getDefaultStats(): DashboardStats {
  return {
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    todayRevenue: 0,
    averageOrderValue: 0,
    totalCustomers: 0,
  };
}

/**
 * Get all orders (Server-side only)
 */
export async function getAllOrders(): Promise<AdminOrder[]> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      users (
        id,
        email,
        full_name
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((order: any) => ({
    id: order.id,
    orderNumber: order.order_number,
    userId: order.user_id,
    customerName: order.users?.full_name || "Guest",
    email: order.users?.email || "",
    total: parseFloat(order.total_amount || "0") || 0,
    subtotal: parseFloat(order.subtotal || "0") || 0,
    discount: parseFloat(order.discount || "0") || 0,
    shipping: parseFloat(order.shipping || "0") || 0,
    status: order.status,
    createdAt: new Date(order.created_at),
    updatedAt: new Date(order.updated_at),
    items: order.items || [],
    itemCount: (order.items || []).reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sum: number, item: any) => sum + (item.quantity || 0),
      0
    ),
    shippingAddress: order.shipping_address,
    billingAddress: order.billing_address,
  })) as AdminOrder[];
}

/**
 * Get all customers (Server-side only)
 */
export async function getAllCustomers(): Promise<AdminCustomer[]> {
  const supabase = createServiceRoleClient();

  // Get all customers
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("*")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  if (usersError) {
    console.error("Error fetching customers:", usersError);
    return [];
  }

  if (!users || users.length === 0) {
    return [];
  }

  // Type definitions
  type UserData = {
    id: string;
    email: string;
    full_name: string;
    phone: string | null;
    company: string | null;
    avatar_url: string | null;
    role: string;
    created_at: string;
    updated_at: string;
  };

  type OrderData = {
    user_id: string;
    total_amount: string;
    created_at: string;
    status: string;
  };

  // Get all customer IDs
  const customerIds = (users as UserData[]).map((u) => u.id);

  // Get all orders for these customers (single query)
  const { data: allOrders, error: ordersError } = await supabase
    .from("orders")
    .select("user_id, total_amount, created_at, status")
    .in("user_id", customerIds);

  if (ordersError) {
    console.error("Error fetching orders for customers:", ordersError);
  }

  // Group orders by user
  const ordersByUser = new Map<string, OrderData[]>();

  if (allOrders) {
    (allOrders as OrderData[]).forEach((order) => {
      if (!ordersByUser.has(order.user_id)) {
        ordersByUser.set(order.user_id, []);
      }
      ordersByUser.get(order.user_id)!.push(order);
    });
  }

  // Map customers with their order data
  return (users as UserData[]).map((user) => {
    const userOrders = ordersByUser.get(user.id) || [];
    const totalSpent = userOrders.reduce(
      (sum, o) => sum + (parseFloat(o.total_amount) || 0),
      0
    );
    const lastOrder = userOrders.length > 0 ? userOrders[0] : null;

    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name || "",
      phone: user.phone || null,
      company: user.company || null,
      avatarUrl: user.avatar_url || null,
      role: user.role as "customer" | "admin",
      totalOrders: userOrders.length,
      totalSpent,
      lastOrderDate: lastOrder ? new Date(lastOrder.created_at) : null,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    };
  });
}

/**
 * Get all B2B requests (Server-side only)
 * Re-export from b2b-request service for admin dashboard
 */
export async function getAdminB2BRequests(): Promise<AdminB2BRequest[]> {
  return getAllB2BRequests();
}

/**
 * Get pending B2B requests count (Server-side only)
 * Re-export from b2b-request service for admin dashboard
 */
export async function getAdminPendingB2BRequestsCount(): Promise<number> {
  return getPendingB2BRequestsCount();
}
