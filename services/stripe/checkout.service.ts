/**
 * Stripe Checkout Service
 * Handles Stripe checkout session creation and management
 */

import Stripe from "stripe";
import { stripe, STRIPE_CONFIG } from "@/lib/stripe/config";
import { BillingAddress, CartItem, ShippingAddress } from "@/types/cart";

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
        // Make product name unique per variant to prevent Stripe from merging line items
        name: item.variant
          ? `${item.product.name} - ${item.variant.name} (${item.variant.sku})`
          : item.product.name,
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
  shippingAddress?: ShippingAddress;
  billingAddress?: BillingAddress;
  shippingMethodId?: string;
  shippingCost?: number;
  vatAmount?: number;
  subtotal?: number;
  total?: number;
}): Promise<{ sessionId: string; url: string }> {
  try {
    const {
      items,
      userId,
      userEmail,
      shippingAddress,
      billingAddress,
      shippingMethodId,
      shippingCost,
      vatAmount,
      subtotal,
      total,
    } = params;

    // Validate items
    if (!items || items.length === 0) {
      throw new Error("Cart is empty");
    }

    // Convert cart items to Stripe line items
    const lineItems = convertCartItemsToLineItems(items);

    // ALWAYS add shipping as a line item (even if free) to show on checkout
    if (shippingMethodId) {
      const shippingAmount = shippingCost || 0;
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: shippingAmount > 0 ? `Shipping - ${shippingMethodId}` : `Free Shipping - ${shippingMethodId}`,
            description: shippingAmount > 0 
              ? `Delivery: ${shippingMethodId}` 
              : `Free delivery: ${shippingMethodId}`,
          },
          unit_amount: Math.round(shippingAmount * 100), // Convert to pence (0 for free)
        },
        quantity: 1,
      });
    }

    // Add VAT as a line item if provided
    if (vatAmount && vatAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: "VAT (20%)",
            description: "Value Added Tax",
          },
          unit_amount: Math.round(vatAmount * 100), // Convert to pence
        },
        quantity: 1,
      });
    }

    // Calculate total for metadata
    const totalAmount = total || calculateTotalAmount(items);

    // Prepare session metadata
    const metadata: Record<string, string> = {
      total_amount: totalAmount.toFixed(2),
      item_count: items.length.toString(),
      subtotal: (subtotal || calculateTotalAmount(items)).toFixed(2),
      shipping_cost: (shippingCost || 0).toFixed(2),
      vat_amount: (vatAmount || 0).toFixed(2),
    };

    if (userId) {
      metadata.user_id = userId;
    }

    if (userEmail) {
      metadata.user_email = userEmail;
    }

    if (shippingMethodId) {
      metadata.shipping_method = shippingMethodId;
    }

    if (shippingAddress) {
      metadata.shipping_address = JSON.stringify(shippingAddress);
    }

    if (billingAddress) {
      metadata.billing_address = JSON.stringify(billingAddress);
    }

    // Store cart items in metadata (Stripe allows up to 500 characters per value)
    // Safely truncate JSON array to fit within limit
    const cartItemsData = items.map((item) => ({
      id: item.product.id,
      code: item.product.product_code,
      name: item.product.name,
      image: item.product.image,
      variantId: item.variant?.id || null,
      variantName: item.variant?.name || null,
      variantSku: item.variant?.sku || null,
      variantPriceAdjustment: item.variant?.price_adjustment || null,
      quantity: item.quantity,
      price: item.pricePerUnit,
    }));

    // Try to fit all items, progressively reduce if needed
    let cartItemsJson = JSON.stringify(cartItemsData);
    if (cartItemsJson.length > 500) {
      // If too long, try removing less critical fields
      const minimalCartItemsData = items.map((item) => ({
        id: item.product.id,
        code: item.product.product_code,
        variantId: item.variant?.id || null,
        variantSku: item.variant?.sku || null,
        quantity: item.quantity,
      }));
      cartItemsJson = JSON.stringify(minimalCartItemsData);

      // If still too long, truncate array length
      if (cartItemsJson.length > 500) {
        const truncatedItems = [...minimalCartItemsData];
        while (
          JSON.stringify(truncatedItems).length > 500 &&
          truncatedItems.length > 0
        ) {
          truncatedItems.pop();
        }
        cartItemsJson = JSON.stringify(truncatedItems);
      }
    }

    metadata.cart_items = cartItemsJson;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: STRIPE_CONFIG.paymentMethodTypes,
      line_items: lineItems,
      mode: "payment",
      success_url: STRIPE_CONFIG.successUrl,
      cancel_url: STRIPE_CONFIG.cancelUrl,
      customer_email: userEmail || undefined,
      metadata,
      // Enable shipping address collection if not provided
      shipping_address_collection: shippingAddress
        ? undefined
        : {
            allowed_countries: ["GB", "US", "CA", "AU"], // UK first, then other countries
          },
      // IMPORTANT: Enable billing address collection on Stripe checkout
      billing_address_collection: "required",
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
