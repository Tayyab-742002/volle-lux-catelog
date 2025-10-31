/**
 * Admin Analytics Service
 * Handles analytics and reporting operations for admin
 */

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

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
 * Revenue data point
 */
export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

/**
 * Top product data
 */
export interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

/**
 * Time range option
 */
export type TimeRange = "7d" | "30d" | "90d" | "all";

/**
 * Get revenue analytics for specified time range
 */
export async function getRevenueAnalytics(
  timeRange: TimeRange = "30d"
): Promise<RevenueDataPoint[]> {
  try {
    const supabase = createServiceRoleClient();

    // Calculate date range
    const now = new Date();
    const startDate = new Date(now);
    
    switch (timeRange) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(startDate.getDate() - 90);
        break;
      case "all":
        startDate.setFullYear(2020); // Set to a year before we started
        break;
    }

    // Fetch orders in date range
    let query = supabase
      .from("orders")
      .select("created_at, total_amount")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching revenue analytics:", error);
      throw new Error(`Failed to fetch revenue analytics: ${error.message}`);
    }

    const ordersData = (data as any[]) || [];

    // Group by date and calculate revenue/orders per day
    const revenueMap = new Map<string, { revenue: number; orders: number }>();

    ordersData.forEach((order) => {
      const date = new Date(order.created_at);
      const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
      
      const existing = revenueMap.get(dateKey) || { revenue: 0, orders: 0 };
      revenueMap.set(dateKey, {
        revenue: existing.revenue + parseFloat(order.total_amount || 0),
        orders: existing.orders + 1,
      });
    });

    // Convert to array and format for chart
    const revenueData: RevenueDataPoint[] = Array.from(revenueMap.entries())
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return revenueData;
  } catch (error) {
    console.error("Failed to get revenue analytics:", error);
    throw error;
  }
}

/**
 * Get top selling products
 */
export async function getTopProducts(limit: number = 10): Promise<TopProduct[]> {
  try {
    const supabase = createServiceRoleClient();

    // Fetch all orders
    const { data, error } = await supabase
      .from("orders")
      .select("items");

    if (error) {
      console.error("Error fetching top products:", error);
      throw new Error(`Failed to fetch top products: ${error.message}`);
    }

    const ordersData = (data as any[]) || [];

    // Aggregate product sales
    const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();

    ordersData.forEach((order) => {
      const items = order.items || [];
      items.forEach((item: any) => {
        const productName = item.product?.name || "Unknown Product";
        const quantity = item.quantity || 0;
        const price = parseFloat(item.pricePerUnit || 0);
        const revenue = quantity * price;

        const existing = productMap.get(productName) || {
          name: productName,
          quantity: 0,
          revenue: 0,
        };

        productMap.set(productName, {
          name: productName,
          quantity: existing.quantity + quantity,
          revenue: existing.revenue + revenue,
        });
      });
    });

    // Convert to array, sort by revenue, and limit
    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);

    return topProducts;
  } catch (error) {
    console.error("Failed to get top products:", error);
    throw error;
  }
}

/**
 * Get orders by status for pie chart
 */
export async function getOrdersByStatus(): Promise<
  { status: string; count: number; percentage: number }[]
> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("orders")
      .select("status");

    if (error) {
      console.error("Error fetching orders by status:", error);
      throw new Error(`Failed to fetch orders by status: ${error.message}`);
    }

    const ordersData = (data as any[]) || [];
    const total = ordersData.length;

    // Count by status
    const statusCounts = new Map<string, number>();
    ordersData.forEach((order) => {
      const status = order.status || "pending";
      const existing = statusCounts.get(status) || 0;
      statusCounts.set(status, existing + 1);
    });

    // Convert to array with percentages
    const statusData = Array.from(statusCounts.entries()).map(
      ([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      })
    );

    return statusData;
  } catch (error) {
    console.error("Failed to get orders by status:", error);
    throw error;
  }
}

/**
 * Get customer acquisition data
 */
export async function getCustomerAcquisition(
  timeRange: TimeRange = "30d"
): Promise<{ date: string; customers: number }[]> {
  try {
    const supabase = createServiceRoleClient();

    // Calculate date range
    const now = new Date();
    const startDate = new Date(now);
    
    switch (timeRange) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(startDate.getDate() - 90);
        break;
      case "all":
        startDate.setFullYear(2020);
        break;
    }

    const { data, error } = await supabase
      .from("users")
      .select("created_at")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching customer acquisition:", error);
      throw new Error(`Failed to fetch customer acquisition: ${error.message}`);
    }

    const usersData = (data as any[]) || [];

    // Group by date
    const acquisitionMap = new Map<string, number>();

    usersData.forEach((user) => {
      const date = new Date(user.created_at);
      const dateKey = date.toISOString().split("T")[0];
      const existing = acquisitionMap.get(dateKey) || 0;
      acquisitionMap.set(dateKey, existing + 1);
    });

    // Convert to array
    const acquisitionData = Array.from(acquisitionMap.entries())
      .map(([date, customers]) => ({ date, customers }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return acquisitionData;
  } catch (error) {
    console.error("Failed to get customer acquisition:", error);
    throw error;
  }
}

