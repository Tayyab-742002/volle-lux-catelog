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

  // Verify payment and fetch order with retry logic
  useEffect(() => {
    // Add timeout to prevent infinite loading (30 seconds max)
    const timeoutId = setTimeout(() => {
      console.error("⏰ Payment verification timeout - forcing error state");
      setError(
        "Payment verification timed out. Please contact support if your payment was processed."
      );
      setLoading(false);
    }, 30000); // 30 seconds timeout

    async function verifyAndFetchOrder() {
      console.log("🔍 Starting payment verification...");
      console.log("Session ID:", sessionId);
      console.log("User:", user?.id);
      console.log("Cart cleared:", cartCleared);

      if (!sessionId) {
        console.error("❌ No session ID provided in URL");
        setError(
          "No session ID provided. Please return from a valid Stripe checkout."
        );
        setLoading(false);
        clearTimeout(timeoutId); // Clear timeout on early exit
        return;
      }

      const MAX_RETRIES = 10; // Try up to 10 times
      const RETRY_DELAY = 1500; // Wait 1.5 seconds between retries

      try {
        console.log("🔍 Step 1: Verifying payment status...");
        // Verify payment status via server API
        const verifyResponse = await fetch(`/api/verify-payment/${sessionId}`);
        console.log(
          "Payment verification response status:",
          verifyResponse.status
        );

        if (!verifyResponse.ok) {
          const errorText = await verifyResponse.text();
          console.error("Payment verification failed:", errorText);
          throw new Error(`Failed to verify payment: ${verifyResponse.status}`);
        }

        const verifyData = await verifyResponse.json();
        console.log("Payment verification data:", verifyData);

        if (!verifyData.paid) {
          console.error("❌ Payment not completed:", verifyData.paymentStatus);
          setError(
            `Payment not completed. Status: ${verifyData.paymentStatus}`
          );
          setLoading(false);
          return;
        }

        console.log("✅ Payment verified successfully");
        console.log("🔍 Step 2: Fetching order from database...");

        // Fetch order from Supabase with retry logic (webhook might still be processing)
        let orderData = null;
        let lastError = null;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            console.log(
              `🔍 Fetching order (attempt ${attempt}/${MAX_RETRIES})...`
            );

            const orderResponse = await fetch(
              `/api/orders/by-session/${sessionId}`
            );

            console.log(`Order fetch response status: ${orderResponse.status}`);

            if (orderResponse.ok) {
              orderData = await orderResponse.json();
              console.log("✅ Order fetched successfully:", {
                orderId: orderData.id,
                itemCount: orderData.items?.length,
                total: orderData.total,
              });
              break; // Success! Exit retry loop
            } else if (orderResponse.status === 404) {
              // Order not created yet, retry
              console.log(
                `⏳ Order not found yet (webhook still processing), retrying in ${RETRY_DELAY}ms...`
              );
              lastError = new Error("Order is still being created by webhook");

              if (attempt < MAX_RETRIES) {
                // Wait before retrying
                await new Promise((resolve) =>
                  setTimeout(resolve, RETRY_DELAY)
                );
              }
            } else {
              // Other error, throw immediately
              const errorText = await orderResponse.text();
              console.error(
                `Order fetch error ${orderResponse.status}:`,
                errorText
              );
              throw new Error(
                `Failed to fetch order: ${orderResponse.status} - ${errorText}`
              );
            }
          } catch (fetchError) {
            lastError = fetchError;
            console.error(`❌ Attempt ${attempt} failed:`, fetchError);

            if (attempt < MAX_RETRIES) {
              console.log(`⏳ Waiting ${RETRY_DELAY}ms before retry...`);
              // Wait before retrying
              await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            }
          }
        }

        // Check if we got the order
        if (!orderData) {
          console.error("❌ Failed to fetch order after all retries");
          console.error("Last error:", lastError);
          throw (
            lastError ||
            new Error(
              "Order not found after multiple attempts. The webhook may have failed. Please check your email for confirmation or contact support."
            )
          );
        }

        console.log("✅ Setting order data in state");

        // CRITICAL: Set order and loading state together to prevent race conditions
        console.log("🔍 Setting order data and loading state atomically");
        setOrder(orderData);
        setLoading(false); // Set loading to false immediately after setting order

        console.log("✅ Order state updated, loading set to false");

        // Clear cart after confirming payment success (only once)
        // Note: Cart should already be cleared by webhook, this is a failsafe
        if (!cartCleared) {
          try {
            console.log("🔍 Step 3: Clearing cart...");
            await clearCart(user?.id);
            setCartCleared(true);
            console.log("✅ Cart cleared successfully");
          } catch (cartError) {
            // Don't fail if cart clearing fails (it may already be cleared by webhook)
            console.log(
              "⚠️ Cart clearing skipped or already cleared:",
              cartError
            );
            setCartCleared(true); // Mark as cleared to prevent retries
          }
        }

        console.log(
          "🎉 Payment verification and order fetch completed successfully!"
        );

        // Clear timeout on success
        clearTimeout(timeoutId);
      } catch (err) {
        console.error("❌ Error in payment verification process:", err);
        setError(
          err instanceof Error ? err.message : "Failed to verify payment"
        );

        // Clear timeout on error
        clearTimeout(timeoutId);
      } finally {
        console.log("🔍 Setting loading to false (FINALLY BLOCK)");
        setLoading(false);
      }
    }

    verifyAndFetchOrder();

    // Cleanup timeout on component unmount
    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]); // Only depend on sessionId - prevents infinite loops

  // Loading state
  console.log(
    "🔍 RENDER: loading =",
    loading,
    "error =",
    error,
    "order =",
    !!order
  );
  if (loading) {
    console.log("🔍 RENDER: Showing loading screen");
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
        <h2 className="mb-2 text-2xl font-semibold">Verifying Payment</h2>
        <p className="text-muted-foreground">
          Please wait while we confirm your orderData...
        </p>
      </div>
    );
  }

  // Error state - only show error if there's an explicit error OR (not loading AND no order)
  if (error || (!loading && !order)) {
    console.log(
      "🔍 RENDER: Showing error screen, error:",
      error,
      "order:",
      !!order,
      "loading:",
      loading
    );
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
  console.log("🔍 RENDER: Showing success screen with order:", order?.id);

  // At this point, we know order exists (checked in render conditions above)
  const orderData = order!;

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
            Order ID:{" "}
            <span className="font-mono font-medium">{orderData.id}</span>
          </p>
        </div>

        {/* Order Details */}
        <div className="mb-8 rounded-lg border bg-card p-6">
          <h2 className="mb-6 text-xl font-semibold">Order Details</h2>

          {/* Order Items */}
          <div className="mb-6 space-y-4">
            {orderData.items.map((item, index) => {
              // Safely access nested properties with fallbacks
              const productName = item.product?.name || "Product";
              const variantName = item.variant?.name || null;
              const quantity = item.quantity || 1;
              const pricePerUnit = item.pricePerUnit || 0;
              // Create unique key: use item.id if exists, otherwise use index with product name
              const uniqueKey = item.id 
                ? `${item.id}-${index}` 
                : `${productName}-${index}`;

              return (
                <div
                  key={uniqueKey}
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
              <span>${orderData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {orderData.shippingAddress && (
          <div className="mb-8 rounded-lg border bg-card p-6">
            <h3 className="mb-4 font-semibold">Shipping Address</h3>
            <div className="text-sm text-muted-foreground">
              <p>{orderData.shippingAddress.fullName}</p>
              <p>{orderData.shippingAddress.address}</p>
              <p>
                {orderData.shippingAddress.city},{" "}
                {orderData.shippingAddress.state}{" "}
                {orderData.shippingAddress.zipCode}
              </p>
              <p>{orderData.shippingAddress.country}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="flex-1">
            <Link href={`/account/orders/${orderData.id}`}>
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
