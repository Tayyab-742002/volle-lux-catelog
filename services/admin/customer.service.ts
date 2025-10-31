/**
 * Admin Customer Service
 * Handles customer data operations for admin
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
 * Customer with aggregated data
 */
export interface AdminCustomer {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  company: string | null;
  avatarUrl: string | null;
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date | null;
}

/**
 * Filter options for customer queries
 */
export interface CustomerFilters {
  search?: string; // Search by email, name, phone
  limit?: number;
  offset?: number;
  sortBy?: "created_at" | "email" | "total_spent";
  sortOrder?: "asc" | "desc";
}

/**
 * Response type for customer list queries
 */
export interface CustomerListResponse {
  customers: AdminCustomer[];
  total: number;
  count: number;
}

/**
 * Get all customers with filters and order stats
 */
export async function getAllCustomers(
  filters: CustomerFilters = {}
): Promise<CustomerListResponse> {
  try {
    const supabase = createServiceRoleClient();

    // Build query
    let query = supabase
      .from("users")
      .select("*", { count: "exact" });

    // Apply search filter
    if (filters.search) {
      query = query.or(
        `email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
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
      console.error("Error fetching customers:", error);
      throw new Error(`Failed to fetch customers: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return {
        customers: [],
        total: count || 0,
        count: 0,
      };
    }

    // For each customer, get their order statistics
    const customersData = (data as any[]) || [];
    const customersWithStats: AdminCustomer[] = await Promise.all(
      customersData.map(async (user) => {
        // Get customer's order stats
        const { data: orders } = await supabase
          .from("orders")
          .select("total_amount, created_at")
          .eq("user_id", user.id);

        const ordersData = (orders as any[]) || [];
        const totalOrders = ordersData.length;
        const totalSpent = ordersData.reduce(
          (sum, order) => sum + parseFloat(order.total_amount || 0),
          0
        );

        // Find last order date
        const orderDates = ordersData
          .map((order) => new Date(order.created_at))
          .sort((a, b) => b.getTime() - a.getTime());
        const lastOrderDate = orderDates.length > 0 ? orderDates[0] : null;

        return {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          phone: user.phone,
          company: user.company,
          avatarUrl: user.avatar_url,
          role: user.role,
          createdAt: new Date(user.created_at),
          updatedAt: new Date(user.updated_at),
          totalOrders,
          totalSpent,
          lastOrderDate,
        };
      })
    );

    return {
      customers: customersWithStats,
      total: count || 0,
      count: customersWithStats.length,
    };
  } catch (error) {
    console.error("Failed to fetch all customers:", error);
    throw error;
  }
}

/**
 * Get single customer by ID with full details
 */
export async function getCustomerById(customerId: string): Promise<AdminCustomer | null> {
  try {
    const supabase = createServiceRoleClient();

    // Get user
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", customerId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        console.log("Customer not found:", customerId);
        return null;
      }
      console.error("Error fetching customer:", error);
      throw new Error(`Failed to fetch customer: ${error.message}`);
    }

    if (!user) {
      return null;
    }

    // Get customer's order stats
    const { data: orders } = await supabase
      .from("orders")
      .select("total_amount, created_at")
      .eq("user_id", user.id);

    const ordersData = (orders as any[]) || [];
    const totalOrders = ordersData.length;
    const totalSpent = ordersData.reduce(
      (sum, order) => sum + parseFloat(order.total_amount || 0),
      0
    );

    const orderDates = ordersData
      .map((order) => new Date(order.created_at))
      .sort((a, b) => b.getTime() - a.getTime());
    const lastOrderDate = orderDates.length > 0 ? orderDates[0] : null;

    const customer: AdminCustomer = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      phone: user.phone,
      company: user.company,
      avatarUrl: user.avatar_url,
      role: user.role,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
      totalOrders,
      totalSpent,
      lastOrderDate,
    };

    return customer;
  } catch (error) {
    console.error("Failed to fetch customer by ID:", error);
    throw error;
  }
}

