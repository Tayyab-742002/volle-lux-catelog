/**
 * Get Order by Stripe Session ID
 * Fetches order details after successful payment
 */

import { NextRequest, NextResponse } from "next/server";
import { getOrderByStripeSessionId } from "@/services/orders/order.service";

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

    // Fetch order using service role client (bypasses RLS)
    const order = await getOrderByStripeSessionId(sessionId);

    if (!order) {
      console.error("Order not found for session:", sessionId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error in order lookup:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
