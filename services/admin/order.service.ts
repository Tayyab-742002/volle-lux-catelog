/**
 * Admin Order Service
 * Handles admin operations for orders management
 * Reference: ADMIN_DASHBOARD_PLAN.md
 */

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Order } from "@/types/cart";

/**
 * Create service role Supabase client for admin operations
 * Bypasses RLS policies to allow full admin access
 */
function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check your .env.local file."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Filter options for order queries
 */
export interface OrderFilters {
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  startDate?: string;
  endDate?: string;
  search?: string; // Search by order number, email, or customer name
  limit?: number;
  offset?: number;
  sortBy?: "created_at" | "total_amount" | "status";
  sortOrder?: "asc" | "desc";
}

/**
 * Extended order type for admin with additional fields
 */
export interface AdminOrder extends Order {
  email: string;
  customerName?: string;
  customerPhone?: string;
  trackingNumber?: string;
  notes?: string;
  updatedAt: Date;
}

/**
 * Response type for order list queries
 */
export interface OrderListResponse {
  orders: AdminOrder[];
  total: number;
  count: number;
}

/**
 * Get all orders with filters
 * Returns paginated list of orders for admin dashboard
 */
export async function getAllOrders(
  filters: OrderFilters = {}
): Promise<OrderListResponse> {
  try {
    const supabase = createServiceRoleClient();

    // Build query
    let query = supabase.from("orders").select("*", { count: "exact" });

    // Apply filters
    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.startDate) {
      query = query.gte("created_at", filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte("created_at", filters.endDate);
    }

    if (filters.search) {
      query = query.or(
        `orderNumber.ilike.%${filters.search}%,email.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%`
      );
    }

    // Apply sorting
    const sortBy = filters.sortBy || "created_at";
    const sortOrder = filters.sortOrder || "desc";
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Apply pagination
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching orders:", error);
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return {
        orders: [],
        total: count || 0,
        count: 0,
      };
    }

    // Convert to AdminOrder array (using any for Supabase data type)
    const orders: AdminOrder[] = (data as any[]).map((orderData: any) => ({
      id: orderData.id,
      orderNumber: orderData.id.substring(0, 8).toUpperCase(),
      userId: orderData.user_id,
      email: orderData.email,
      items: orderData.items || [],
      shippingAddress: orderData.shipping_address || {},
      billingAddress: orderData.billing_address || {},
      subtotal: parseFloat(orderData.subtotal || orderData.total_amount || 0),
      discount: parseFloat(orderData.discount || 0),
      shipping: parseFloat(orderData.shipping || 0),
      total: parseFloat(orderData.total_amount || 0),
      status: orderData.status || "pending",
      createdAt: new Date(orderData.created_at),
      updatedAt: new Date(orderData.updated_at),
      paymentIntentId: orderData.stripe_payment_intent_id,
      customerName: orderData.customer_name || null,
      customerPhone: orderData.customer_phone || null,
      trackingNumber: orderData.tracking_number || null,
      notes: orderData.notes || null,
    }));

    return {
      orders,
      total: count || 0,
      count: orders.length,
    };
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    throw error;
  }
}

/**
 * Get single order by ID for admin
 * Returns full order details including all admin fields
 */
export async function getOrderById(
  orderId: string
): Promise<AdminOrder | null> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching order:", error);
      throw new Error(`Failed to fetch order: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    // Convert to AdminOrder (using any for Supabase data type)
    const orderData = data as any;
    const order: AdminOrder = {
      id: orderData.id,
      orderNumber: orderData.id.substring(0, 8).toUpperCase(),
      userId: orderData.user_id,
      email: orderData.email,
      items: orderData.items || [],
      shippingAddress: orderData.shipping_address || {},
      billingAddress: orderData.billing_address || {},
      subtotal: parseFloat(orderData.subtotal || orderData.total_amount || 0),
      discount: parseFloat(orderData.discount || 0),
      shipping: parseFloat(orderData.shipping || 0),
      total: parseFloat(orderData.total_amount || 0),
      status: orderData.status || "pending",
      createdAt: new Date(orderData.created_at),
      updatedAt: new Date(orderData.updated_at),
      paymentIntentId: orderData.stripe_payment_intent_id,
      customerName: orderData.customer_name || null,
      customerPhone: orderData.customer_phone || null,
      trackingNumber: orderData.tracking_number || null,
      notes: orderData.notes || null,
    };

    return order;
  } catch (error) {
    console.error("Failed to fetch order by ID:", error);
    throw error;
  }
}

/**
 * Update order status
 * Allows admins to update order status and add tracking info
 */
export async function updateOrderStatus(
  orderId: string,
  updates: {
    status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    trackingNumber?: string;
    notes?: string;
  }
): Promise<void> {
  try {
    const supabase = createServiceRoleClient();

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.status) {
      updateData.status = updates.status;

      // Set timestamp fields based on status
      if (updates.status === "shipped") {
        updateData.shipped_at = new Date().toISOString();
      } else if (updates.status === "delivered") {
        updateData.delivered_at = new Date().toISOString();
      } else if (updates.status === "cancelled") {
        updateData.cancelled_at = new Date().toISOString();
      }
    }

    if (updates.trackingNumber) {
      updateData.tracking_number = updates.trackingNumber;
    }

    if (updates.notes !== undefined) {
      updateData.notes = updates.notes;
    }

    const { error } = await supabase
      .from("orders")
      .update(updateData as any)
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order:", error);
      throw new Error(`Failed to update order: ${error.message}`);
    }
  } catch (error) {
    console.error("Failed to update order status:", error);
    throw error;
  }
}

/**
 * Get order statistics for dashboard
 * Returns summary metrics for orders
 */
export async function getOrderStats(): Promise<{
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  todayRevenue: number;
  averageOrderValue: number;
}> {
  try {
    const supabase = createServiceRoleClient();

    // Get total count by status
    const { data: statusCounts, error: statusError } = await supabase
      .from("orders")
      .select("status, total_amount, created_at");

    if (statusError) {
      console.error("Error fetching order stats:", statusError);
      throw new Error(`Failed to fetch order stats: ${statusError.message}`);
    }

    // Type assertion for statusCounts
    const counts = (statusCounts || []) as any[];

    // Calculate statistics
    const total = counts.length || 0;
    const pending = counts.filter((o) => o.status === "pending").length || 0;
    const processing =
      counts.filter((o) => o.status === "processing").length || 0;
    const shipped = counts.filter((o) => o.status === "shipped").length || 0;
    const delivered =
      counts.filter((o) => o.status === "delivered").length || 0;
    const cancelled =
      counts.filter((o) => o.status === "cancelled").length || 0;

    // Calculate today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = counts.filter((order) => {
      const orderDate = new Date(order.created_at);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const todayRevenue = todayOrders.reduce(
      (sum, order) => sum + parseFloat(order.total_amount || 0),
      0
    );

    // Calculate average order value
    const totalRevenue =
      counts.reduce(
        (sum, order) => sum + parseFloat(order.total_amount || 0),
        0
      ) || 0;
    const averageOrderValue = total > 0 ? totalRevenue / total : 0;

    return {
      total,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      todayRevenue,
      averageOrderValue,
    };
  } catch (error) {
    console.error("Failed to fetch order stats:", error);
    throw error;
  }
}
