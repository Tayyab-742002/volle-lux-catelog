/**
 * Stripe Client Configuration
 * Client-side Stripe.js for payment elements
 */

import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

/**
 * Get Stripe.js instance
 * This is safe to call multiple times - it will return the same instance
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      throw new Error(
        "Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable. Please add it to .env.local"
      );
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
}


