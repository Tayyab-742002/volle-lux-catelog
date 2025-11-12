"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Package,
  Home,
  Loader2,
  AlertCircle,
  Download,
} from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuth } from "@/components/auth/auth-provider";
import { useEffect, useState } from "react";
import type { Order } from "@/types/cart";
import { SHIPPING_OPTIONS } from "@/types/shipping";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCartStore();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartCleared, setCartCleared] = useState(false);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);

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
        // Verify payment status via server API
        const verifyResponse = await fetch(`/api/verify-payment/${sessionId}`);

        if (!verifyResponse.ok) {
          const errorText = await verifyResponse.text();
          console.error("Payment verification failed:", errorText);
          throw new Error(`Failed to verify payment: ${verifyResponse.status}`);
        }

        const verifyData = await verifyResponse.json();

        if (!verifyData.paid) {
          console.error("❌ Payment not completed:", verifyData.paymentStatus);
          setError(
            `Payment not completed. Status: ${verifyData.paymentStatus}`
          );
          setLoading(false);
          return;
        }

        // Fetch order from Supabase with retry logic (webhook might still be processing)
        let orderData = null;
        let lastError = null;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            const orderResponse = await fetch(
              `/api/orders/by-session/${sessionId}`
            );

            if (orderResponse.ok) {
              orderData = await orderResponse.json();
              break; // Success! Exit retry loop
            } else if (orderResponse.status === 404) {
              // Order not created yet, retry

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

            if (attempt < MAX_RETRIES) {
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

        setOrder(orderData);
        setLoading(false); // Set loading to false immediately after setting order

        // Clear cart after confirming payment success (only once)
        // Note: Cart should already be cleared by webhook, this is a failsafe
        if (!cartCleared) {
          try {
            await clearCart(user?.id);
            setCartCleared(true);
          } catch (cartError) {
            // Don't fail if cart clearing fails (it may already be cleared by webhook)
            setCartCleared(true); // Mark as cleared to prevent retries
          }
        }

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

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] min-h-screen flex items-center justify-center py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="relative w-24 h-24  rounded-full flex items-center justify-center">
                  <Loader2
                    className="w-12 h-12 text-emerald-600 animate-spin"
                    strokeWidth={2}
                  />
                </div>
              </div>
            </div>
            <h2 className="mb-4 text-3xl sm:text-4xl font-bold text-gray-900">
              Verifying Payment
            </h2>
            <p className="text-lg text-gray-600">
              Please wait while we confirm your order...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state - only show error if there's an explicit error OR (not loading AND no order)
  if (error || (!loading && !order)) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] min-h-screen flex items-center justify-center py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="relative w-24 h-24 bg-linear-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center border-4 border-red-200">
                  <AlertCircle
                    className="w-12 h-12 text-red-600"
                    strokeWidth={2}
                  />
                </div>
              </div>
            </div>
            <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
              Payment Verification
              <span className="block bg-linear-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mt-2">
                Failed
              </span>
            </h1>
            <div className="mb-8 bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <p className="text-lg text-gray-600 md:text-xl">
                {error ||
                  "We couldn't verify your payment. Please contact support."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="inline-flex items-center gap-2 px-8 py-6 text-base font-semibold bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:from-emerald-700 hover:to-teal-700"
              >
                <Link href="/account/orders">View Orders</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="inline-flex items-center gap-2 px-8 py-6 text-base font-semibold border-2 border-emerald-300 text-emerald-700 bg-white rounded-xl hover:bg-emerald-50 hover:border-emerald-600 transition-all duration-300 hover:scale-105"
              >
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle receipt download
  const handleDownloadReceipt = async () => {
    if (!order) return;

    try {
      setDownloadingReceipt(true);

      const response = await fetch(`/api/receipt/${order.id}`);

      if (!response.ok) {
        throw new Error("Failed to download receipt");
      }

      // Get PDF blob
      const blob = await response.blob();

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `receipt-${order.orderNumber}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading receipt:", err);
      setError("Failed to download receipt. Please try again.");
    } finally {
      setDownloadingReceipt(false);
    }
  };

  // At this point, we know order exists (checked in render conditions above)
  const orderData = order!;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          {/* Thank You Message */}
          <div className="mb-12 text-center">
            <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900">
              Thank You for Your
              <span className="block bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">
                Order!
              </span>
            </h1>
            <p className="mb-4 text-lg text-gray-600 md:text-xl">
              Your order has been successfully placed
            </p>
            <div className="inline-block rounded-full bg-linear-to-r from-emerald-100 to-teal-100 px-4 py-2 border border-emerald-200">
              <p className="text-sm font-medium text-emerald-700">
                Order ID: <span className="font-mono">{orderData.id}</span>
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="mb-8 bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
            <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
              Order Details
            </h2>

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
                    className="flex justify-between border-b border-gray-200 pb-4 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {productName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {quantity}
                      </p>
                      {variantName && (
                        <p className="text-sm text-gray-600">
                          Variant: {variantName}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        £{(pricePerUnit * quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        £{pricePerUnit.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-300 pt-6 mt-6 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="text-gray-900">
                  £{orderData.subtotal.toFixed(2)}
                </span>
              </div>
              {orderData.discount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span className="text-emerald-600">
                    -£{orderData.discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>
                  Shipping
                  {orderData.shippingMethod && (
                    <>
                      {" "}
                      <span className="text-xs">
                        ({SHIPPING_OPTIONS.find(opt => opt.id === orderData.shippingMethod)?.name || orderData.shippingMethod})
                      </span>
                    </>
                  )}
                </span>
                <span className="text-gray-900">
                  {orderData.shipping === 0 ? 'Free' : `£${orderData.shipping.toFixed(2)}`}
                </span>
              </div>
              {orderData.vatAmount && orderData.vatAmount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>VAT (20%)</span>
                  <span className="text-gray-900">
                    £{orderData.vatAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    £{orderData.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {orderData.shippingAddress && (
            <div className="mb-8 bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h3 className="mb-6 text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Shipping Address
              </h3>
              <div className="space-y-2 text-base text-gray-600">
                <p className="font-medium text-gray-900">
                  {orderData.shippingAddress.fullName}
                </p>
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
            <Button
              onClick={handleDownloadReceipt}
              disabled={downloadingReceipt}
              size="lg"
              className="flex-1 inline-flex items-center gap-2 px-8 py-6 text-base font-semibold border-2 border-emerald-300 text-emerald-700 bg-white rounded-xl hover:bg-emerald-50 hover:border-emerald-600 transition-all duration-300 hover:scale-105"
            >
              {downloadingReceipt ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" strokeWidth={2} />
                  Download Receipt
                </>
              )}
            </Button>
            <Button
              asChild
              size="lg"
              className="flex-1 inline-flex items-center gap-2 px-8 py-6 text-base font-semibold bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:from-emerald-700 hover:to-teal-700"
            >
              <Link href={`/account/orders/${orderData.id}`}>
                <Package className="h-5 w-5" strokeWidth={2} />
                Track Order
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="flex-1 inline-flex items-center gap-2 px-8 py-6 text-base font-semibold border-2 border-gray-300 text-gray-700 bg-white rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105"
            >
              <Link href="/products">
                <Home className="h-5 w-5" strokeWidth={2} />
                Continue Shopping
              </Link>
            </Button>
          </div>

          {/* Email Confirmation Notice */}
          <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300 text-center">
            <p className="text-base text-gray-600 md:text-lg">
              A confirmation email will be sent shortly with all the details and
              tracking information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen overflow-hidden">
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] min-h-screen flex items-center justify-center py-16 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="relative w-24 h-24  rounded-full flex items-center justify-center border-4 border-emerald-200">
                    <Loader2
                      className="w-12 h-12 text-emerald-600 animate-spin"
                      strokeWidth={2}
                    />
                  </div>
                </div>
              </div>
              <h2 className="mb-4 text-3xl sm:text-4xl font-bold text-gray-900">
                Loading...
              </h2>
              <p className="text-lg text-gray-600">
                Please wait while we load your order details...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
