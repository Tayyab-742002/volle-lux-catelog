/**
 * Stripe Checkout Service
 * Handles Stripe checkout session creation and management
 */

import Stripe from "stripe";
import { stripe, STRIPE_CONFIG } from "@/lib/stripe/config";
import { CartItem } from "@/types/cart";

/**
 * Convert cart items to Stripe line items
 */
function convertCartItemsToLineItems(
  items: CartItem[]
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return items.map((item) => ({
    price_data: {
      currency: STRIPE_CONFIG.currency,
      product_data: {
        name: item.product.name,
        description: item.variant
          ? `${item.product.name} - ${item.variant.name}`
          : item.product.name,
        images: item.product.image ? [item.product.image] : undefined,
        metadata: {
          product_id: item.product.id,
          product_code: item.product.product_code,
          variant_id: item.variant?.id || "",
          variant_sku: item.variant?.sku || "",
        },
      },
      unit_amount: Math.round(item.pricePerUnit * 100), // Convert dollars to cents
    },
    quantity: item.quantity,
  }));
}

/**
 * Calculate total amount from cart items
 */
function calculateTotalAmount(items: CartItem[]): number {
  return items.reduce((total, item) => {
    return total + item.pricePerUnit * item.quantity;
  }, 0);
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(params: {
  items: CartItem[];
  userId?: string;
  userEmail?: string;
  shippingAddress?: any;
  billingAddress?: any;
}): Promise<{ sessionId: string; url: string }> {
  try {
    const { items, userId, userEmail, shippingAddress, billingAddress } =
      params;

    // Validate items
    if (!items || items.length === 0) {
      throw new Error("Cart is empty");
    }

    // Convert cart items to Stripe line items
    const lineItems = convertCartItemsToLineItems(items);

    // Calculate total for metadata
    const totalAmount = calculateTotalAmount(items);

    // Prepare session metadata
    const metadata: Record<string, string> = {
      total_amount: totalAmount.toFixed(2),
      item_count: items.length.toString(),
    };

    if (userId) {
      metadata.user_id = userId;
    }

    if (userEmail) {
      metadata.user_email = userEmail;
    }

    if (shippingAddress) {
      metadata.shipping_address = JSON.stringify(shippingAddress);
    }

    if (billingAddress) {
      metadata.billing_address = JSON.stringify(billingAddress);
    }

    // Store cart items in metadata (Stripe allows up to 500 characters per value)
    // For larger carts, we'll store the summary
    metadata.cart_items = JSON.stringify(
      items.map((item) => ({
        id: item.product.id,
        code: item.product.product_code,
        name: item.product.name,
        variant: item.variant?.sku || null,
        quantity: item.quantity,
        price: item.pricePerUnit,
      }))
    ).substring(0, 500); // Stripe metadata limit

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: STRIPE_CONFIG.paymentMethodTypes,
      line_items: lineItems,
      mode: "payment",
      success_url: STRIPE_CONFIG.successUrl,
      cancel_url: STRIPE_CONFIG.cancelUrl,
      customer_email: userEmail || undefined,
      metadata,
      // Enable shipping address collection if needed
      shipping_address_collection: shippingAddress
        ? undefined
        : {
            allowed_countries: ["US", "CA", "GB", "AU"], // Add your supported countries
          },
      // Allow promotion codes
      allow_promotion_codes: true,
      // Payment intent data for additional context
      payment_intent_data: {
        metadata,
      },
      // Automatic tax calculation (optional, requires Stripe Tax setup)
      // automatic_tax: { enabled: true },
    });

    if (!session.id || !session.url) {
      throw new Error("Failed to create checkout session");
    }

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

/**
 * Retrieve checkout session by ID
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    });

    return session;
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    throw error;
  }
}

/**
 * Verify checkout session payment status
 */
export async function verifyPaymentStatus(sessionId: string): Promise<{
  paid: boolean;
  paymentStatus: string;
  session: Stripe.Checkout.Session;
}> {
  try {
    const session = await getCheckoutSession(sessionId);

    return {
      paid: session.payment_status === "paid",
      paymentStatus: session.payment_status,
      session,
    };
  } catch (error) {
    console.error("Error verifying payment status:", error);
    throw error;
  }
}


