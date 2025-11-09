import { CartItem, Order } from "@/types/cart";
import { createClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Cart Service
 * Handles cart persistence and order management with Supabase
 * Reference: Architecture.md Section 4.3
 */

/**
 * Save cart to Supabase
 * Persists cart to Supabase database with proper RLS policies
 */
export async function saveCartToSupabase(
  cartItems: CartItem[],
  userId?: string,
  sessionId?: string
): Promise<void> {
  try {
    const supabase = createClient() as SupabaseClient;

    // Prepare cart data
    const cartData = {
      items: cartItems,
      updated_at: new Date().toISOString(),
    };

    if (userId) {
      // Authenticated user cart - verify session first

      const {
        data: { user: authUser },
        error: sessionError,
      } = await supabase.auth.getUser();

      if (sessionError || !authUser) {
        console.error("Session verification failed:", sessionError?.message);
        throw new Error(`Authentication required: ${sessionError?.message}`);
      }

      if (authUser.id !== userId) {
        console.error("User ID mismatch:", {
          authUserId: authUser.id,
          providedUserId: userId,
        });
        throw new Error("User ID mismatch - authentication error");
      }

      // Authenticated user cart - check if cart exists

      const { data: existingCart, error: checkError } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking for existing cart:", checkError);
        throw checkError;
      }

      if (existingCart) {
        // If no items, delete cart row instead of storing empty array
        if (cartItems.length === 0) {
          const { error } = await supabase
            .from("carts")
            .delete()
            .eq("user_id", userId);

          if (error) {
            throw error;
          }

          return;
        }
        // Update existing cart

        const { error } = await supabase
          .from("carts")
          .update({
            items: cartData.items,
            updated_at: cartData.updated_at,
          } as Record<string, unknown>)
          .eq("user_id", userId);

        if (error) {
          console.error("Error updating authenticated cart:", error);
          throw error;
        }
      } else {
        // If no items, nothing to persist
        if (cartItems.length === 0) {
          return;
        }
        // Insert new car
        const { error } = await supabase.from("carts").insert({
          user_id: userId,
          session_id: null,
          items: cartData.items,
          updated_at: cartData.updated_at,
        } as Record<string, unknown>);

        if (error) {
          console.error("Error creating authenticated cart:", error);
          throw error;
        }
      }
    } else if (sessionId) {
      // Guest cart - check if cart exists
      const { data: existingCart, error: checkError } = await supabase
        .from("carts")
        .select("id")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking for existing guest cart:", checkError);
        throw checkError;
      }

      if (existingCart) {
        // If no items, delete cart row instead of storing empty array
        if (cartItems.length === 0) {
          const { error } = await supabase
            .from("carts")
            .delete()
            .eq("session_id", sessionId);

          if (error) {
            console.error("Error deleting guest cart:", error);
            throw error;
          }
          return;
        }
        // Update existing guest cart
        const { error } = await supabase
          .from("carts")
          .update({
            items: cartData.items,
            updated_at: cartData.updated_at,
          } as Record<string, unknown>)
          .eq("session_id", sessionId);

        if (error) {
          console.error("Error updating guest cart:", error);
          throw error;
        }
      } else {
        // If no items, nothing to persist
        if (cartItems.length === 0) {
          return;
        }
        // Insert new guest cart
        const { error } = await supabase.from("carts").insert({
          user_id: null,
          session_id: sessionId,
          items: cartData.items,
          updated_at: cartData.updated_at,
        } as Record<string, unknown>);

        if (error) {
          console.error("Error creating guest cart:", error);
          throw error;
        }
      }
    } else {
      throw new Error("Either userId or sessionId must be provided");
    }
  } catch (error) {
    console.error("Failed to save cart to Supabase:", error);
    throw error;
  }
}

/**
 * Load cart from Supabase
 * Fetches cart from Supabase database
 */
export async function loadCartFromSupabase(
  userId?: string,
  sessionId?: string
): Promise<CartItem[]> {
  try {
    const supabase = createClient() as SupabaseClient;

    if (userId) {
      // Load authenticated user cart - verify session first
      const {
        data: { user: authUser },
        error: sessionError,
      } = await supabase.auth.getUser();

      if (sessionError || !authUser) {
        console.error(
          "Session verification failed for loadCart:",
          sessionError?.message
        );
        throw new Error(`Authentication required: ${sessionError?.message}`);
      }

      if (authUser.id !== userId) {
        console.error("User ID mismatch for loadCart:", {
          authUserId: authUser.id,
          providedUserId: userId,
        });
        throw new Error("User ID mismatch - authentication error");
      }

      const { data, error } = await supabase
        .from("carts")
        .select("items")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.error("Error loading authenticated cart:", error);
        throw error;
      }

      return data?.items || [];
    } else if (sessionId) {
      // Load guest cart
      const { data, error } = await supabase
        .from("carts")
        .select("items")
        .eq("session_id", sessionId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.error("Error loading guest cart:", error);
        throw error;
      }

      return data?.items || [];
    } else {
      throw new Error("Either userId or sessionId must be provided");
    }
  } catch (error) {
    console.error("Failed to load cart from Supabase:", error);
    throw error;
  }
}

/**
 * Store order in Supabase
 * Saves order details to Supabase orders table
 */
export async function storeOrder(order: Order): Promise<void> {
  try {
    const supabase = createClient() as SupabaseClient;

    const { error } = await supabase.from("orders").insert({
      user_id: order.userId || null,
      email: order.shippingAddress.fullName, // Using fullName as email placeholder
      status: order.status,
      total_amount: order.total,
      currency: "USD",
      stripe_session_id: order.paymentIntentId || null,
      shipping_address: order.shippingAddress,
      billing_address: order.billingAddress,
      items: order.items,
      created_at: order.createdAt.toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error storing order:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to store order:", error);
    throw error;
  }
}

/**
 * Get order by ID
 * Fetches order from Supabase with proper RLS
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const supabase = createClient() as SupabaseClient;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Order not found
      }
      console.error("Error fetching order:", error);
      throw error;
    }

    // Convert Supabase data to Order type
    const order: Order = {
      id: data.id,
      orderNumber: data.id, // Using UUID as order number
      userId: data.user_id,
      items: data.items,
      shippingAddress: data.shipping_address,
      billingAddress: data.billing_address,
      subtotal: data.total_amount - (data.shipping || 0), // Approximate subtotal
      discount: 0, // Would need to calculate from items
      shipping: data.shipping || 0,
      total: data.total_amount,
      status: data.status,
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
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const supabase = createClient() as SupabaseClient;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }

    // Convert Supabase data to Order array
    const orders: Order[] = data.map((orderData: any) => ({
      id: orderData.id,
      orderNumber: orderData.id,
      userId: orderData.user_id,
      items: orderData.items,
      shippingAddress: orderData.shipping_address,
      billingAddress: orderData.billing_address,
      subtotal: orderData.total_amount - (orderData.shipping || 0),
      discount: 0,
      shipping: orderData.shipping || 0,
      total: orderData.total_amount,
      status: orderData.status,
      createdAt: new Date(orderData.created_at),
      paymentIntentId: orderData.stripe_payment_intent_id,
    }));

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
    const supabase = createClient() as SupabaseClient;

    const { error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
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
 * Merge guest cart with user cart
 * Merges guest cart items into user cart on login
 */
export async function mergeGuestCartWithUserCart(
  guestSessionId: string,
  userId: string
): Promise<void> {
  try {
    const supabase = createClient() as SupabaseClient;

    // Get guest cart
    const { data: guestCart, error: guestError } = await supabase
      .from("carts")
      .select("items")
      .eq("session_id", guestSessionId)
      .single();

    if (guestError && guestError.code !== "PGRST116") {
      console.error("Error fetching guest cart:", guestError);
      throw guestError;
    }

    if (!guestCart?.items || guestCart.items.length === 0) {
      return; // No guest cart to merge
    }

    // Get user cart
    const { data: userCart, error: userError } = await supabase
      .from("carts")
      .select("items")
      .eq("user_id", userId)
      .single();

    if (userError && userError.code !== "PGRST116") {
      console.error("Error fetching user cart:", userError);
      throw userError;
    }

    const userItems = userCart?.items || [];
    const guestItems = guestCart.items;

    // Merge items (combine quantities for same products/variants)
    const mergedItems = [...userItems];

    for (const guestItem of guestItems) {
      const existingIndex = mergedItems.findIndex(
        (item) =>
          item.product.id === guestItem.product.id &&
          item.variant?.id === guestItem.variant?.id
      );

      if (existingIndex >= 0) {
        // Combine quantities
        mergedItems[existingIndex].quantity += guestItem.quantity;
        mergedItems[existingIndex].totalPrice += guestItem.totalPrice;
      } else {
        // Add new item
        mergedItems.push(guestItem);
      }
    }

    // Update user cart with merged items
    const { error: updateError } = await supabase.from("carts").upsert(
      {
        user_id: userId,
        session_id: null,
        items: mergedItems,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

    if (updateError) {
      console.error("Error updating user cart:", updateError);
      throw updateError;
    }

    // Delete guest cart
    const { error: deleteError } = await supabase
      .from("carts")
      .delete()
      .eq("session_id", guestSessionId);

    if (deleteError) {
      console.error("Error deleting guest cart:", deleteError);
      // Don't throw here as the merge was successful
    }
  } catch (error) {
    console.error("Failed to merge guest cart with user cart:", error);
    throw error;
  }
}
