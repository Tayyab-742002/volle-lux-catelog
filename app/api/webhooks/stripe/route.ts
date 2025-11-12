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
  try {
    // Retrieve full session details with line items and customer details
    // Note: Using 'any' because Stripe types don't include shipping_details after expand
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fullSession: any = await stripe.checkout.sessions.retrieve(
      session.id,
      {
        expand: [
          "line_items",
          "line_items.data.price",
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
    } else if (fullSession.metadata?.billing_address) {
      // Fallback: billing address was passed in metadata (legacy)
      try {
        billingAddress = JSON.parse(fullSession.metadata.billing_address);
      } catch (e) {
        console.error("Failed to parse billing address from metadata:", e);
      }
    } else {
      // Last resort: Use shipping address as billing address
      billingAddress = shippingAddress;
    }

    // Parse cart items from metadata
    let cartItems = [];
    try {
      cartItems = fullSession.metadata?.cart_items
        ? JSON.parse(fullSession.metadata.cart_items)
        : [];
    } catch (e) {
      console.error("Failed to parse cart items from metadata:", e);
      console.error(
        "Metadata cart_items value:",
        fullSession.metadata?.cart_items
      );
      // Continue without cart items - we'll use Stripe line item data instead
      cartItems = [];
    }

    // Transform line items to order items format (matching CartItem structure)
    // Match by price/product instead of index to handle Stripe merging
    const orderItems =
      fullSession.line_items?.data.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) => {
          const quantity = item.quantity || 1;
          const pricePerUnit = item.amount_total
            ? item.amount_total / 100 / quantity
            : 0;

          // Try to match cart item by variant SKU from description (format: "Product Name - Variant (SKU)")
          // Or try by product ID from line item metadata
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let cartItem: any = null;

          // Extract SKU from description if it follows the pattern
          const skuMatch = item.description?.match(/\(([^)]+)\)/);
          const extractedSku = skuMatch ? skuMatch[1] : null;

          if (extractedSku) {
            cartItem =
              cartItems.find(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (ci: any) => ci.variantSku === extractedSku
              ) || null;
          }

          // If not found by SKU, try to match by product ID from line item
          if (!cartItem && item.price?.metadata?.product_id) {
            cartItem =
              cartItems.find(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (ci: any) => ci.id === item.price.metadata.product_id
              ) || null;
          }

          // Last resort: If we still can't match, use the first unmatched cart item
          // This handles edge cases where Stripe merged items or metadata is incomplete
          if (!cartItem && cartItems.length > 0) {
            console.warn(
              "⚠️ Could not match line item to cart item, using first available"
            );
            cartItem = cartItems[0];
          }

          // Build proper nested structure matching CartItem interface
          const productId =
            cartItem?.id ||
            item.price?.metadata?.product_id ||
            item.price?.product_data?.metadata?.product_id ||
            null;

          if (!productId) {
            console.error("❌ Missing product ID for line item:", item);
            throw new Error("Cannot create order item without product ID");
          }

          const productCode =
            cartItem?.code ||
            item.price?.metadata?.product_code ||
            item.price?.product_data?.metadata?.product_code ||
            "";

          // Only create variant if we have valid variant data
          const hasVariant =
            cartItem &&
            cartItem.variantId &&
            cartItem.variantId !== "" &&
            cartItem.variantName &&
            cartItem.variantName !== "";

          // Extract slug from metadata or derive from product name
          const productSlug =
            cartItem?.product?.slug ||
            item.price?.metadata?.product_slug ||
            item.price?.product_data?.metadata?.product_slug ||
            (item.description || cartItem?.name || "Product")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");

          // Get product image with fallback
          const productImage =
            cartItem?.image ||
            cartItem?.product?.image ||
            item.price?.product_data?.images?.[0] ||
            "/placeholder-image.png";

          return {
            id: productId,
            code: productCode,
            product: {
              id: productId,
              product_code: productCode,
              name:
                item.description ||
                cartItem?.name ||
                cartItem?.product?.name ||
                "Product",
              slug: productSlug,
              image: productImage,
            },
            variant:
              hasVariant && cartItem
                ? {
                    id: cartItem.variantId || "",
                    name: cartItem.variantName || "Standard",
                    sku: cartItem.variantSku || "",
                    price_adjustment: cartItem.variantPriceAdjustment || 0,
                  }
                : null,
            quantity,
            pricePerUnit,
            totalPrice: pricePerUnit * quantity,
          };
        }
      ) || [];

    // Validate order items before creating order
    if (orderItems.length === 0) {
      console.error("❌ No order items to create order");
      throw new Error("Cannot create order with no items");
    }

    // Check for any invalid items
    const invalidItems = orderItems.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => !item.id || item.id === "unknown"
    );
    if (invalidItems.length > 0) {
      console.warn(
        `⚠️ Found ${invalidItems.length} items with invalid IDs:`,
        invalidItems
      );
    }

    // Calculate order totals
    const totalAmount = (fullSession.amount_total || 0) / 100; // Convert from cents

    // Extract discount if any (from Stripe discount codes)
    const discountAmount = fullSession.total_details?.amount_discount
      ? fullSession.total_details.amount_discount / 100
      : 0;

    // Extract shipping information from metadata (more reliable than Stripe total_details)
    const shippingMethodId = fullSession.metadata?.shipping_method || null;
    const shippingCost = fullSession.metadata?.shipping_cost
      ? parseFloat(fullSession.metadata.shipping_cost)
      : fullSession.total_details?.amount_shipping
        ? fullSession.total_details.amount_shipping / 100
        : 0;

    // Extract VAT from metadata
    const vatAmount = fullSession.metadata?.vat_amount
      ? parseFloat(fullSession.metadata.vat_amount)
      : 0;

    // Extract tax if any (different from VAT - Stripe automatic tax)
    const taxAmount = fullSession.total_details?.amount_tax
      ? fullSession.total_details.amount_tax / 100
      : 0;

    // Extract subtotal from metadata (more accurate than calculation)
    const subtotal = fullSession.metadata?.subtotal
      ? parseFloat(fullSession.metadata.subtotal)
      : totalAmount - shippingCost - taxAmount - vatAmount + discountAmount;

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
      shippingMethod: shippingMethodId || undefined, // Added
      shippingCost: shippingCost, // Added (explicit)
      vatAmount: vatAmount, // Added
      vatRate: 0.2, // Added (20% UK VAT)
      tax: taxAmount,
      total: totalAmount,
      status: "processing" as const,
      stripeSessionId: fullSession.id,
      paymentIntentId: fullSession.payment_intent as string,
    };

    let orderId: string;
    try {
      orderId = await createOrder(orderData);
    } catch (orderError) {
      console.error("❌ Failed to create order:", orderError);
      if (orderError instanceof Error) {
        console.error("Error message:", orderError.message);
        console.error("Error stack:", orderError.stack);
      }
      throw orderError;
    }

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
        const { error: deleteError } = await supabase
          .from("carts")
          .delete()
          .eq("user_id", userId);

        if (deleteError) {
          console.error("⚠️ Failed to delete user cart:", deleteError);
        } else {
        }
      }
    } catch (cartError) {
      // Log error but don't fail the order
      console.error("⚠️ Error deleting cart:", cartError);
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
    }

    // Return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
