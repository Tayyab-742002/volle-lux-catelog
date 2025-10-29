/**
 * Verify Payment Status API
 * Server-side payment verification to avoid exposing Stripe secret key
 */

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Return payment status
    return NextResponse.json({
      paid: session.payment_status === "paid",
      paymentStatus: session.payment_status,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
