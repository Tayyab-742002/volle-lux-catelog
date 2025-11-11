/**
 * Stripe Configuration
 * Server-side Stripe instance for payment processing
 */

import Stripe from "stripe";

/**
 * Initialize Stripe with secret key
 * This should only be used on the server side
 * The secret key check is done lazily when stripe is first accessed
 */
function getStripeInstance(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY environment variable. Please add it to .env.local"
    );
  }

  return new Stripe(secretKey, {
    apiVersion: "2025-09-30.clover",
    typescript: true,
  });
}

// Lazy initialization - only creates Stripe instance when first accessed
let stripeInstance: Stripe | null = null;

export const stripe = new Proxy({} as Stripe, {
  get: (target, prop) => {
    if (!stripeInstance) {
      stripeInstance = getStripeInstance();
    }
    return stripeInstance[prop as keyof Stripe];
  },
});

/**
 * Get the base URL for the application
 * Used for success/cancel redirect URLs
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

/**
 * Stripe configuration constants
 */
export const STRIPE_CONFIG = {
  currency: "gbp",
  paymentMethodTypes: [
    "card",
  ] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
  successUrl: `${getBaseUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancelUrl: `${getBaseUrl()}/cart`,
};
