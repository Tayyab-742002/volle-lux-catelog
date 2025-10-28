"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart-store";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { getDefaultSavedAddress } from "@/services/users/user.service";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartSummary } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [defaultAddress, setDefaultAddress] = useState<any | null>(null);

  useEffect(() => {
    // Load default address for authenticated user
    (async () => {
      if (!user?.id) return;
      try {
        const addr = await getDefaultSavedAddress(user.id);
        setDefaultAddress(addr);
      } catch (e) {
        // Non-blocking
        console.error("Failed to load default address", e);
      }
    })();
  }, [user?.id]);

  useEffect(() => {
    async function createCheckoutSession() {
      if (items.length === 0) {
        router.push("/cart");
        return;
      }

      try {
        setIsLoading(true);

        // TODO: Call API to create Stripe Checkout session
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items,
            shippingAddress: defaultAddress || null,
            billingAddress: defaultAddress || null,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create checkout session");
        }

        const data = await response.json();

        // Redirect to Stripe hosted checkout page
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error("No checkout URL received");
        }
      } catch (err) {
        console.error("Checkout error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    createCheckoutSession();
  }, [items, router, defaultAddress]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-destructive">
          Checkout Error
        </h2>
        <p className="mb-8 text-muted-foreground">{error}</p>
        <button
          onClick={() => router.push("/cart")}
          className="text-primary hover:underline"
        >
          Return to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
      <h2 className="mb-2 text-2xl font-semibold">Redirecting to Checkout</h2>
      <p className="text-muted-foreground">
        Please wait while we redirect you to secure checkout...
      </p>
    </div>
  );
}
