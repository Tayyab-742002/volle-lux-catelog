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
    }: {
      items: CartItem[];
      shippingAddress?: any;
      billingAddress?: any;
    } = body;

    // Validate cart items
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Get user session (must be authenticated)
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to checkout" },
        { status: 401 }
      );
    }

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      items,
      userId: user.id,
      userEmail: user.email,
      shippingAddress,
      billingAddress,
    });

    // Store checkout session in Supabase for order tracking
    if (user.id) {
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
