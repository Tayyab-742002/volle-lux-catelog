/**
 * Order Service
 * Handles order management with Supabase
 * Reference: Architecture.md Section 4.3
 */

import { createClient as createServerClient } from "@supabase/supabase-js";
import { Order, CartItem } from "@/types/cart";

/**
 * Create service role Supabase client (bypasses RLS)
 * Used for webhook handlers and admin operations
 */
function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing Supabase environment variables (URL or SERVICE_ROLE_KEY)"
    );
  }

  return createServerClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Create an order in Supabase
 * Saves order details to Supabase orders table
 * Uses service role client to bypass RLS policies (for webhook use)
 */
export async function createOrder(orderData: {
  userId?: string;
  email: string;
  items: CartItem[] | Record<string, unknown>[];
  shippingAddress: Record<string, unknown>;
  billingAddress: Record<string, unknown>;
  subtotal: number;
  discount: number;
  shipping: number;
  shippingMethod?: string;
  shippingCost?: number;
  vatAmount?: number;
  vatRate?: number;
  tax?: number;
  total: number;
  status: Order["status"];
  stripeSessionId?: string;
  paymentIntentId?: string;
}): Promise<string> {
  try {
    // Use service role client to bypass RLS policies
    const supabase = createServiceRoleClient();

    // Extract customer info from addresses
    const customerName =
      (orderData.shippingAddress as Record<string, unknown>)?.fullName ||
      (orderData.billingAddress as Record<string, unknown>)?.fullName ||
      "Customer";
    const customerPhone =
      (orderData.shippingAddress as Record<string, unknown>)?.phone ||
      (orderData.billingAddress as Record<string, unknown>)?.phone ||
      null;

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: orderData.userId || null,
        email: orderData.email,
        status: orderData.status,
        subtotal: orderData.subtotal,
        discount: orderData.discount,
        shipping: orderData.shipping,
        shipping_method: orderData.shippingMethod || null,
        shipping_cost: orderData.shippingCost || orderData.shipping || 0,
        vat_amount: orderData.vatAmount || 0,
        vat_rate: orderData.vatRate || 0.2,
        tax: orderData.tax || 0, // Tax amount from Stripe if enabled
        total_amount: orderData.total,
        currency: "GBP",
        stripe_session_id: orderData.stripeSessionId || null,
        stripe_payment_intent_id: orderData.paymentIntentId || null,
        shipping_address: orderData.shippingAddress,
        billing_address: orderData.billingAddress,
        items: orderData.items,
        customer_name: customerName,
        customer_phone: customerPhone,
        payment_method: "card", // Stripe payment
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any)
      .select("id")
      .single();

    if (error) {
      console.error("Error creating order:", error);
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
}

/**
 * Get order by ID
 * Fetches order from Supabase
 * Uses service role client for server-side access (webhooks, admin)
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    // Use service role client to bypass RLS (works in webhook context)
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching order:", error);
      throw error;
    }

    if (!data) {
      return null;
    }

    // Convert Supabase data to Order type using new schema fields
    const order: Order = {
      id: data.id,
      orderNumber: data.id.substring(0, 8).toUpperCase(), // Create readable order number
      userId: data.user_id,
      items: data.items || [],
      shippingAddress: data.shipping_address || {},
      billingAddress: data.billing_address || {},
      subtotal: parseFloat(data.subtotal || data.total_amount || 0),
      discount: parseFloat(data.discount || 0),
      shipping: parseFloat(data.shipping || data.shipping_cost || 0),
      shippingMethod: data.shipping_method || null,
      vatAmount: parseFloat(data.vat_amount || 0),
      total: parseFloat(data.total_amount || 0),
      status: data.status || "pending",
      createdAt: new Date(data.created_at),
      paymentIntentId: data.stripe_payment_intent_id,
    };

    return order;
  } catch (error) {
    console.error("Failed to fetch order:", error);
    throw error;
  }
}

/**
 * Get user orders
 * Fetches all orders for a user with proper RLS
 * Uses service role client for server-side access
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    // Use service role client for server-side access
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Convert Supabase data to Order array using new schema fields
    const orders: Order[] = data.map((orderData: any) => ({
      id: orderData.id,
      orderNumber: orderData.id.substring(0, 8).toUpperCase(),
      userId: orderData.user_id,
      items: orderData.items || [],
      shippingAddress: orderData.shipping_address || {},
      billingAddress: orderData.billing_address || {},
      subtotal: parseFloat(orderData.subtotal || orderData.total_amount || 0),
      discount: parseFloat(orderData.discount || 0),
      shipping: parseFloat(orderData.shipping || orderData.shipping_cost || 0),
      shippingMethod: orderData.shipping_method || null,
      vatAmount: parseFloat(orderData.vat_amount || 0),
      total: parseFloat(orderData.total_amount || 0),
      status: orderData.status || "pending",
      createdAt: new Date(orderData.created_at),
      paymentIntentId: orderData.stripe_payment_intent_id,
    }));

    return orders;
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    // Return empty array instead of throwing to prevent dashboard from breaking
    return [];
  }
}

/**
 * Update order status
 * Updates order status in Supabase
 * Uses service role client for server-side access
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<void> {
  try {
    // Use service role client for admin operations
    const supabase = createServiceRoleClient();

    const { error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      } as any)
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to update order status:", error);
    throw error;
  }
}

/**
 * Get order status
 * Returns the current status of an order
 * Uses service role client for server-side access
 */
export async function getOrderStatus(orderId: string): Promise<string | null> {
  try {
    // Use service role client for reliable access
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching order status:", error);
      return null;
    }

    return data?.status || null;
  } catch (error) {
    console.error("Failed to fetch order status:", error);
    return null;
  }
}

/**
 * Get order by Stripe session ID (uses service role for webhook access)
 * Fetches order from Supabase using Stripe checkout session ID
 */
export async function getOrderByStripeSessionId(
  sessionId: string
): Promise<Order | null> {
  try {
    // Use service role client to bypass RLS policies
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching order:", error);
      throw error;
    }

    if (!data) {
      return null;
    }

    // Convert Supabase data to Order type using new schema fields
    const order: Order = {
      id: data.id,
      orderNumber: data.id.substring(0, 8).toUpperCase(),
      userId: data.user_id,
      items: data.items || [],
      shippingAddress: data.shipping_address || {},
      billingAddress: data.billing_address || {},
      subtotal: parseFloat(data.subtotal || data.total_amount || 0),
      discount: parseFloat(data.discount || 0),
      shipping: parseFloat(data.shipping || data.shipping_cost || 0),
      shippingMethod: data.shipping_method || null,
      vatAmount: parseFloat(data.vat_amount || 0),
      total: parseFloat(data.total_amount || 0),
      status: data.status || "pending",
      createdAt: new Date(data.created_at),
      paymentIntentId: data.stripe_payment_intent_id,
    };

    return order;
  } catch (error) {
    console.error("Failed to fetch order by session ID:", error);
    throw error;
  }
}
