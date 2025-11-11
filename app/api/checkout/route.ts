import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/services/stripe/checkout.service";
import { CartItem } from "@/types/cart";

/**
 * Create Stripe Checkout Session
 * Handles both authenticated and guest checkouts
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      shippingAddress,
      billingAddress,
      shippingMethodId,
      shippingCost,
      vatAmount,
      subtotal,
      total,
      email, // Guest email for checkout
    }: {
      items: CartItem[];
      shippingAddress?: any;
      billingAddress?: any;
      shippingMethodId?: string;
      shippingCost?: number;
      vatAmount?: number;
      subtotal?: number;
      total?: number;
      email?: string; // Optional email for guest checkout
    } = body;

    // Validate cart items
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Get user session (optional - supports both authenticated and guest checkout)
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // For guest checkout: require email
    // For authenticated checkout: use user email
    const checkoutEmail = user?.email || email;
    
    if (!checkoutEmail) {
      return NextResponse.json(
        { error: "Email is required for checkout" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      items,
      userId: user?.id, // Optional for guest checkout
      userEmail: checkoutEmail, // Use guest email or user email
      shippingAddress,
      billingAddress,
      shippingMethodId,
      shippingCost,
      vatAmount,
      subtotal,
      total,
    });

    // Store checkout session in Supabase for order tracking (authenticated users only)
    if (user?.id) {
      // Store session metadata for tracking
      // This helps track abandoned carts and pending checkouts
      const { error: upsertError } = await supabase.from("carts").upsert(
        {
          user_id: user.id,
          items: items as any, // Cart items stored as JSONB
          updated_at: new Date().toISOString(),
        } as any,
        {
          onConflict: "user_id", // Update existing cart for this user
          ignoreDuplicates: false, // Don't ignore, update instead
        }
      );

      if (upsertError) {
        console.error("Error storing checkout session:", upsertError);
        // Non-blocking - continue with checkout even if cart update fails
      }
    }

    // Return session ID and URL for redirect
    return NextResponse.json({
      sessionId: session.sessionId,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);

    // Provide user-friendly error message
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to create checkout session";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
