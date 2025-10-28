"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Package,
  Home,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuth } from "@/components/auth/auth-provider";
import { useEffect, useState } from "react";
import type { Order } from "@/types/cart";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCartStore();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartCleared, setCartCleared] = useState(false);

  // Verify payment and fetch order
  useEffect(() => {
    async function verifyAndFetchOrder() {
      if (!sessionId) {
        setError("No session ID provided");
        setLoading(false);
        return;
      }

      try {
        // Verify payment status via server API
        const verifyResponse = await fetch(`/api/verify-payment/${sessionId}`);

        if (!verifyResponse.ok) {
          throw new Error("Failed to verify payment");
        }

        const { paid } = await verifyResponse.json();

        if (!paid) {
          setError("Payment not completed");
          setLoading(false);
          return;
        }

        // Fetch order from Supabase using session ID
        const orderResponse = await fetch(
          `/api/orders/by-session/${sessionId}`
        );

        if (!orderResponse.ok) {
          throw new Error("Order not found");
        }

        const orderData = await orderResponse.json();
        setOrder(orderData);

        // Clear cart after confirming payment success (only once)
        if (!cartCleared) {
          console.log("Clearing cart after successful order...");
          await clearCart(user?.id);
          setCartCleared(true);
          console.log("Cart cleared successfully");
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        setError(
          err instanceof Error ? err.message : "Failed to verify payment"
        );
      } finally {
        setLoading(false);
      }
    }

    verifyAndFetchOrder();
  }, [sessionId, clearCart, user?.id, cartCleared]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
        <h2 className="mb-2 text-2xl font-semibold">Verifying Payment</h2>
        <p className="text-muted-foreground">
          Please wait while we confirm your order...
        </p>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <h1 className="mb-4 text-3xl font-bold">
            Payment Verification Failed
          </h1>
          <p className="mb-8 text-muted-foreground">
            {error ||
              "We couldn't verify your payment. Please contact support."}
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/account/orders">View Orders</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success state with order details
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="mx-auto max-w-3xl">
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
          <p className="mb-2 text-lg text-muted-foreground">
            Your order has been successfully placed
          </p>
          <p className="text-sm text-muted-foreground">
            Order ID: <span className="font-mono font-medium">{order.id}</span>
          </p>
        </div>

        {/* Order Details */}
        <div className="mb-8 rounded-lg border bg-card p-6">
          <h2 className="mb-6 text-xl font-semibold">Order Details</h2>

          {/* Order Items */}
          <div className="mb-6 space-y-4">
            {order.items.map((item, index) => {
              // Safely access nested properties with fallbacks
              const productName = item.product?.name || "Product";
              const variantName = item.variant?.name || null;
              const quantity = item.quantity || 1;
              const pricePerUnit = item.pricePerUnit || 0;

              return (
                <div
                  key={item.id || index}
                  className="flex justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium">{productName}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {quantity}
                    </p>
                    {variantName && (
                      <p className="text-sm text-muted-foreground">
                        Variant: {variantName}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(pricePerUnit * quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${pricePerUnit.toFixed(2)} each
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="mb-8 rounded-lg border bg-card p-6">
            <h3 className="mb-4 font-semibold">Shipping Address</h3>
            <div className="text-sm text-muted-foreground">
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="flex-1">
            <Link href={`/account/orders/${order.id}`}>
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

        {/* Email Confirmation Notice */}
        <div className="mt-8 rounded-lg border bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            A confirmation email will be sent shortly with all the details and
            tracking information.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <h2 className="mb-2 text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">
            Please wait while we load your order details...
          </p>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
