"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Home } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { OrderSummary } from "@/components/cart/order-summary";
import { useEffect } from "react";

export default function CheckoutSuccessPage() {
  const { getCartSummary, clearCart } = useCartStore();
  const summary = getCartSummary();

  // Clear cart after successful checkout
  useEffect(() => {
    // TODO: Clear cart only after verifying payment success
    // For now, clear immediately
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="mx-auto max-w-2xl">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2
              className="h-12 w-12 text-primary"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Thank You Message */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Thank You for Your Order!
          </h1>
          <p className="text-lg text-muted-foreground">
            Your order has been successfully placed
          </p>
        </div>

        {/* Order Summary */}
        <div className="mb-8 rounded-lg border bg-card p-6">
          <h2 className="mb-6 text-xl font-semibold">Order Details</h2>
          <OrderSummary summary={summary} showTitle={false} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="flex-1">
            <Link href="/orders">
              <Package className="mr-2 h-5 w-5" strokeWidth={1.5} />
              Track Order
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1">
            <Link href="/products">
              <Home className="mr-2 h-5 w-5" strokeWidth={1.5} />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 rounded-lg border bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            You will receive an order confirmation email shortly with all the
            details and tracking information.
          </p>
        </div>
      </div>
    </div>
  );
}
