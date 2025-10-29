/**
 * Stripe Webhook Handler
 * Handles payment events from Stripe and creates orders in Supabase
 * Reference: https://stripe.com/docs/webhooks
 */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/config";
import { createOrder } from "@/services/orders/order.service";
import type { CartItem } from "@/types/cart";

/**
 * Webhook endpoint must use raw body for signature verification
 * Disable Next.js body parsing
 */
export const runtime = "nodejs";

/**
 * Verify Stripe webhook signature
 */
async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error(
      "Missing STRIPE_WEBHOOK_SECRET environment variable. Please add it to .env.local"
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
    return event;
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    throw error;
  }
}

/**
 * Handle checkout.session.completed event
 * This is the primary event for creating orders
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log("Processing checkout.session.completed:", session.id);

  try {
    // Retrieve full session details with line items and customer details
    // Note: Using 'any' because Stripe types don't include shipping_details after expand
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fullSession: any = await stripe.checkout.sessions.retrieve(
      session.id,
      {
        expand: [
          "line_items",
          "line_items.data.price.product",
          "customer_details",
          "payment_intent",
          "total_details",
        ],
      }
    );

    // Extract metadata from session
    const userId = fullSession.metadata?.user_id;
    const userEmail =
      fullSession.customer_email ||
      fullSession.customer_details?.email ||
      fullSession.metadata?.user_email;

    // Get customer name from Stripe
    const customerName =
      fullSession.customer_details?.name ||
      fullSession.shipping_details?.name ||
      "Customer";

    // Get shipping address from Stripe (if collected by Stripe Checkout)
    let shippingAddress = null;
    if (fullSession.shipping_details?.address) {
      // Stripe collected the shipping address
      const stripeAddress = fullSession.shipping_details.address;
      shippingAddress = {
        fullName: fullSession.shipping_details.name || customerName,
        address: stripeAddress.line1 || "",
        address2: stripeAddress.line2 || "",
        city: stripeAddress.city || "",
        state: stripeAddress.state || "",
        zipCode: stripeAddress.postal_code || "",
        country: stripeAddress.country || "",
        phone: fullSession.customer_details?.phone || "",
      };
    } else if (fullSession.metadata?.shipping_address) {
      // Address was passed in metadata (from saved address)
      try {
        shippingAddress = JSON.parse(fullSession.metadata.shipping_address);
      } catch (e) {
        console.error("Failed to parse shipping address from metadata:", e);
      }
    }

    // Get billing address from Stripe
    // When billing_address_collection is enabled, Stripe stores it in customer_details.address
    let billingAddress = null;

    // Log what we have for debugging
    console.log("Stripe session billing data:", {
      hasCustomerDetails: !!fullSession.customer_details,
      hasCustomerAddress: !!fullSession.customer_details?.address,
      customerDetailsAddress: fullSession.customer_details?.address,
      hasPaymentIntent: !!fullSession.payment_intent,
    });

    if (fullSession.customer_details?.address) {
      // Stripe collected billing address - this is the main path
      const billingAddr = fullSession.customer_details.address;
      billingAddress = {
        fullName: fullSession.customer_details.name || customerName,
        address: billingAddr.line1 || "",
        address2: billingAddr.line2 || "",
        city: billingAddr.city || "",
        state: billingAddr.state || "",
        zipCode: billingAddr.postal_code || "",
        country: billingAddr.country || "",
        phone: fullSession.customer_details?.phone || "",
      };
      console.log(
        "✅ Billing address captured from Stripe customer_details:",
        billingAddress
      );
    } else if (fullSession.metadata?.billing_address) {
      // Fallback: billing address was passed in metadata (legacy)
      try {
        billingAddress = JSON.parse(fullSession.metadata.billing_address);
        console.log("✅ Billing address from metadata:", billingAddress);
      } catch (e) {
        console.error("Failed to parse billing address from metadata:", e);
      }
    } else {
      // Last resort: Use shipping address as billing address
      billingAddress = shippingAddress;
      console.log("⚠️ Using shipping as billing address (fallback)");
    }

    // Parse cart items from metadata
    let cartItems = [];
    try {
      cartItems = fullSession.metadata?.cart_items
        ? JSON.parse(fullSession.metadata.cart_items)
        : [];
    } catch (e) {
      console.error("Failed to parse cart items from metadata:", e);
    }

    // Transform line items to order items format (matching CartItem structure)
    const orderItems =
      fullSession.line_items?.data.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any, index: number) => {
          const cartItem = cartItems[index] || {};
          const quantity = item.quantity || 1;
          const pricePerUnit = item.amount_total
            ? item.amount_total / 100 / quantity
            : 0;

          // Build proper nested structure matching CartItem interface
          return {
            id: cartItem.id || item.price?.product || "",
            code: cartItem.code || "",
            product: {
              id: cartItem.id || item.price?.product || "",
              name: item.description || cartItem.name || "Product",
              image: cartItem.image || "",
            },
            variant: cartItem.variant
              ? {
                  id: cartItem.variant,
                  name: cartItem.variantName || "Standard",
                }
              : null,
            quantity,
            pricePerUnit,
            totalPrice: pricePerUnit * quantity,
          };
        }
      ) || [];

    // Calculate order totals
    const totalAmount = (fullSession.amount_total || 0) / 100; // Convert from cents

    // Extract discount if any (from Stripe discount codes)
    const discountAmount = fullSession.total_details?.amount_discount
      ? fullSession.total_details.amount_discount / 100
      : 0;

    // Extract shipping cost if any
    const shippingCost = fullSession.total_details?.amount_shipping
      ? fullSession.total_details.amount_shipping / 100
      : 0;

    // Extract tax if any
    const taxAmount = fullSession.total_details?.amount_tax
      ? fullSession.total_details.amount_tax / 100
      : 0;

    // Calculate subtotal (before tax, shipping, and discounts)
    const subtotal = totalAmount - shippingCost - taxAmount + discountAmount;

    console.log("Order calculation:", {
      totalAmount,
      subtotal,
      discount: discountAmount,
      shipping: shippingCost,
      tax: taxAmount,
      itemCount: orderItems.length,
    });

    // Create order in Supabase with full details
    // Note: orderItems structure is compatible with CartItem but TypeScript needs explicit cast
    const orderData = {
      userId: userId || undefined,
      email: userEmail || "guest@checkout.com",
      items: orderItems as unknown as CartItem[],
      shippingAddress: shippingAddress || {
        fullName: customerName,
        address: "Address will be collected",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      billingAddress: billingAddress ||
        shippingAddress || {
          fullName: customerName,
          address: "Same as shipping",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
      subtotal,
      discount: discountAmount,
      shipping: shippingCost,
      tax: taxAmount,
      total: totalAmount,
      status: "processing" as const,
      stripeSessionId: fullSession.id,
      paymentIntentId: fullSession.payment_intent as string,
    };

    console.log("Creating order with data:", {
      userId: orderData.userId,
      email: orderData.email,
      itemCount: orderData.items.length,
      total: orderData.total,
      shipping: orderData.shipping,
      discount: orderData.discount,
      hasShippingAddress: !!shippingAddress,
      hasBillingAddress: !!billingAddress,
      shippingAddressDetails: shippingAddress,
      billingAddressDetails: billingAddress,
    });

    const orderId = await createOrder(orderData);

    console.log("Order created successfully:", orderId);

    // Clear the cart after successful order creation
    try {
      const { createClient: createServerClient } = await import(
        "@supabase/supabase-js"
      );

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

      const supabase = createServerClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      // Delete cart by user_id or session_id
      if (userId) {
        console.log("Deleting cart for user:", userId);
        const { error: deleteError } = await supabase
          .from("carts")
          .delete()
          .eq("user_id", userId);

        if (deleteError) {
          console.error("⚠️ Failed to delete user cart:", deleteError);
        } else {
          console.log("✅ Cart deleted successfully for user");
        }
      }
    } catch (cartError) {
      // Log error but don't fail the order
      console.error("⚠️ Error deleting cart:", cartError);
      console.log("Order created successfully, but cart deletion failed");
    }

    // Send order confirmation email
    try {
      // Import dynamically to avoid issues if Resend is not configured
      const { sendOrderConfirmationEmail } = await import(
        "@/services/emails/email.service"
      );
      const { getOrderById } = await import("@/services/orders/order.service");

      // Fetch the complete order details
      const order = await getOrderById(orderId);

      if (order && userEmail) {
        const emailResult = await sendOrderConfirmationEmail(order, userEmail);

        if (emailResult.success) {
          console.log(
            `✅ Order confirmation email sent to ${userEmail} (Message ID: ${emailResult.messageId})`
          );
        } else {
          console.error(
            `⚠️ Failed to send order confirmation email: ${emailResult.error}`
          );
        }
      } else {
        console.warn("⚠️ Skipping email: Missing order or email address");
      }
    } catch (emailError) {
      // Log email error but don't fail the order
      console.error("⚠️ Error sending confirmation email:", emailError);
      console.log("Order created successfully, but email failed to send");
    }

    return { orderId };
  } catch (error) {
    console.error("Error handling checkout.session.completed:", error);
    throw error;
  }
}

/**
 * Handle payment_intent.succeeded event
 * Backup event for payment confirmation
 */
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  console.log("Payment succeeded:", paymentIntent.id);
  // Most order creation is handled in checkout.session.completed
  // This can be used for additional processing or logging
}

/**
 * Handle payment_intent.payment_failed event
 * Log failed payments for debugging
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.error("Payment failed:", {
    id: paymentIntent.id,
    last_payment_error: paymentIntent.last_payment_error,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
  });

  // TODO: Optionally notify admin or customer of failed payment
}

/**
 * POST handler for Stripe webhooks
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = await verifyWebhookSignature(body, signature);
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
