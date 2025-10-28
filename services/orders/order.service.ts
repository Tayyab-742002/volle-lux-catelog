/**
 * Order Service
 * Handles order management with Supabase
 * Reference: Architecture.md Section 4.3
 */

import { createClient } from "@/lib/supabase/client";
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
  total: number;
  status: Order["status"];
  stripeSessionId?: string;
  paymentIntentId?: string;
}): Promise<string> {
  try {
    // Use service role client to bypass RLS policies
    const supabase = createServiceRoleClient();

    console.log("Creating order in Supabase:", {
      userId: orderData.userId,
      email: orderData.email,
      itemCount: orderData.items.length,
      total: orderData.total,
    });

    // Extract customer info from addresses
    const customerName =
      (orderData.shippingAddress as any)?.fullName ||
      (orderData.billingAddress as any)?.fullName ||
      "Customer";
    const customerPhone =
      (orderData.shippingAddress as any)?.phone ||
      (orderData.billingAddress as any)?.phone ||
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
        tax: 0, // Will be calculated by Stripe if enabled
        total_amount: orderData.total,
        currency: "USD",
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

    console.log("Order created successfully with ID:", data.id);
    return data.id;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
}

/**
 * Get order by ID
 * Fetches order from Supabase with proper RLS
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const supabase = createClient() as any;

    console.log("Fetching order by ID:", orderId);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116") {
        console.log("Order not found");
        return null;
      }
      console.error("Error fetching order:", error);
      throw error;
    }

    if (!data) {
      return null;
    }

    // Convert Supabase data to Order type
    const order: Order = {
      id: data.id,
      orderNumber: data.id.substring(0, 8).toUpperCase(), // Create readable order number
      userId: data.user_id,
      items: data.items || [],
      shippingAddress: data.shipping_address,
      billingAddress: data.billing_address,
      subtotal:
        (data.total_amount as number) -
        ((data.shipping_address as any)?.shipping || 0),
      discount: 0, // Would need to be stored separately
      shipping: (data.shipping_address as any)?.shipping || 0,
      total: data.total_amount as number,
      status: data.status,
      createdAt: new Date(data.created_at),
      paymentIntentId: data.stripe_payment_intent_id,
    };

    console.log("Order fetched successfully");
    return order;
  } catch (error) {
    console.error("Failed to fetch order:", error);
    throw error;
  }
}

/**
 * Get user orders
 * Fetches all orders for a user with proper RLS
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const supabase = createClient() as any;

    console.log("Fetching orders for user:", userId);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }

    if (!data) {
      return [];
    }

    // Convert Supabase data to Order array
    const orders: Order[] = data.map((orderData: any) => ({
      id: orderData.id,
      orderNumber: orderData.id.substring(0, 8).toUpperCase(),
      userId: orderData.user_id,
      items: orderData.items || [],
      shippingAddress: orderData.shipping_address,
      billingAddress: orderData.billing_address,
      subtotal:
        (orderData.total_amount as number) -
        ((orderData.shipping_address as any)?.shipping || 0),
      discount: 0,
      shipping: (orderData.shipping_address as any)?.shipping || 0,
      total: orderData.total_amount as number,
      status: orderData.status,
      createdAt: new Date(orderData.created_at),
      paymentIntentId: orderData.stripe_payment_intent_id,
    }));

    console.log(`Fetched ${orders.length} orders for user`);
    return orders;
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    throw error;
  }
}

/**
 * Update order status
 * Updates order status in Supabase
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<void> {
  try {
    const supabase = createClient() as any;

    console.log("Updating order status:", { orderId, status });

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

    console.log("Order status updated successfully");
  } catch (error) {
    console.error("Failed to update order status:", error);
    throw error;
  }
}

/**
 * Get order status
 * Returns the current status of an order
 */
export async function getOrderStatus(orderId: string): Promise<string | null> {
  try {
    const supabase = createClient() as any;

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

    console.log("Fetching order by Stripe session ID:", sessionId);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116") {
        console.log("Order not found for session:", sessionId);
        return null;
      }
      console.error("Error fetching order:", error);
      throw error;
    }

    if (!data) {
      return null;
    }

    // Convert Supabase data to Order type
    const order: Order = {
      id: data.id,
      orderNumber: data.id.substring(0, 8).toUpperCase(),
      userId: data.user_id,
      items: data.items || [],
      shippingAddress: data.shipping_address,
      billingAddress: data.billing_address,
      subtotal:
        (data.total_amount as number) -
        ((data.shipping_address as any)?.shipping || 0),
      discount: 0,
      shipping: (data.shipping_address as any)?.shipping || 0,
      total: data.total_amount as number,
      status: data.status,
      createdAt: new Date(data.created_at),
      paymentIntentId: data.stripe_payment_intent_id,
    };

    console.log("Order fetched successfully");
    return order;
  } catch (error) {
    console.error("Failed to fetch order by session ID:", error);
    throw error;
  }
}
