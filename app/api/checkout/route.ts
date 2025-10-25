import { NextRequest, NextResponse } from "next/server";
import { CartItem } from "@/types/cart";

/**
 * Create Stripe Checkout Session
 * TODO: Integrate with Stripe SDK
 * TODO: Handle authentication (guest vs authenticated users)
 * TODO: Store checkout session in Supabase
 * TODO: Handle webhook events
 */

export async function POST(request: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // TODO: Initialize Stripe SDK
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    // TODO: Convert cart items to Stripe line items
    // const lineItems = items.map((item) => ({
    //   price_data: {
    //     currency: "usd",
    //     product_data: {
    //       name: item.product.name,
    //       images: [item.product.image],
    //     },
    //     unit_amount: Math.round(item.pricePerUnit * 100), // Convert to cents
    //   },
    //   quantity: item.quantity,
    // }));

    // TODO: Create Stripe Checkout Session
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    //   line_items: lineItems,
    //   mode: "payment",
    //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    //   metadata: {
    //     // Store additional order metadata
    //   },
    // });

    // TODO: Store checkout session in Supabase
    // await storeCheckoutSession(session.id, items);

    // For now, return mock response
    return NextResponse.json({
      sessionId: "mock_session_id",
      url: "/checkout/success",
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
