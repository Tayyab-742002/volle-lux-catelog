import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Download, ShoppingCart, Package, Truck, MapPin } from "lucide-react";
import { getOrderById } from "@/services/orders/order.service";
import { getCurrentUserServer } from "@/services/auth/auth-server.service";
import { notFound } from "next/navigation";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";
import { SHIPPING_OPTIONS } from "@/types/shipping";

// Force fresh data on every request - no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Placeholder image for missing product images
const PLACEHOLDER_IMAGE = "/placeholder-image.png";

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;

  // Get current user
  const authResult = await getCurrentUserServer();

  if (!authResult.success || !authResult.user) {
    return (
      <div className="rounded-2xl border border-gray-300 bg-white shadow-lg p-12 text-center">
        <p className="text-gray-600">Please sign in to view order details</p>
        <Link href="/auth/login">
          <Button className="mt-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <OrderDetailContent orderId={id} userId={authResult.user.id} />
    </Suspense>
  );
}

// Order Detail Content Component
async function OrderDetailContent({
  orderId,
  userId,
}: {
  orderId: string;
  userId: string;
}) {
  // Fetch order from Supabase
  const order = await getOrderById(orderId);
  if (!order) {
    notFound();
  }

  // Verify user owns this order
  if (order.userId !== userId) {
    return (
      <div className="rounded-2xl border border-red-300 bg-white shadow-lg p-12 text-center">
        <p className="text-gray-600">
          You don&apos;t have access to this order
        </p>
        <Link href="/account?tab=orders">
          <Button className="mt-4 border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700">
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  // Format order data for display
  const displayOrder = {
    id: order.orderNumber,
    date: order.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    status: order.status,
    total: order.total,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    shippingMethod: order.shippingMethod || null,
    vatAmount: order.vatAmount || 0,
    shippingAddress: {
      name: order.shippingAddress?.fullName || "N/A",
      street: order.shippingAddress?.address || "N/A",
      city: order.shippingAddress?.city || "N/A",
      state: order.shippingAddress?.state || "N/A",
      zip: order.shippingAddress?.zipCode || "N/A",
      country: order.shippingAddress?.country || "N/A",
    },
    items: order.items.map((item, index) => ({
      id: item.id || `${index}`,
      name: item.product?.name || "Unknown Product",
      variant: item.variant?.name || "Default",
      quantity: item.quantity,
      pricePerUnit: item.pricePerUnit,
      total: item.totalPrice,
      image: item.product.image || "/placeholder-image.png",
    })),
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
            Order Details
          </h2>
          <p className="mt-2 text-gray-600">Order #{displayOrder.id}</p>
        </div>
        {/* <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
          >
            <Download className="mr-2 h-5 w-5" strokeWidth={2} />
            Download Invoice
          </Button>
          <Button
            size="lg"
            className="bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
          >
            <ShoppingCart className="mr-2 h-5 w-5" strokeWidth={2} />
            Reorder
          </Button>
        </div> */}
      </div>

      {/* Order Info Card */}
      <div className="mb-8 rounded-2xl border border-gray-300 bg-white shadow-lg p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
              <Package className="h-4 w-4" strokeWidth={2} />
              Order Date
            </div>
            <div className="font-semibold text-gray-900">
              {displayOrder.date}
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
              <Truck className="h-4 w-4" strokeWidth={2} />
              Status
            </div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                ORDER_STATUS_CONFIG[
                  displayOrder.status as keyof typeof ORDER_STATUS_CONFIG
                ]?.className || ORDER_STATUS_CONFIG.pending.className
              }`}
            >
              {ORDER_STATUS_CONFIG[
                displayOrder.status as keyof typeof ORDER_STATUS_CONFIG
              ]?.label ||
                displayOrder.status.charAt(0).toUpperCase() +
                  displayOrder.status.slice(1)}
            </span>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" strokeWidth={2} />
              Total
            </div>
            <div className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              £{displayOrder.total.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="mb-8 rounded-2xl border border-gray-300 bg-white shadow-lg p-6">
        <h3 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-3">
          <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
          Shipping Address
        </h3>
        <div className="text-gray-600">
          <p className="font-medium text-gray-900">
            {displayOrder.shippingAddress.name}
          </p>
          <p>{displayOrder.shippingAddress.street}</p>
          <p>
            {displayOrder.shippingAddress.city},{" "}
            {displayOrder.shippingAddress.state}{" "}
            {displayOrder.shippingAddress.zip}
          </p>
          <p>{displayOrder.shippingAddress.country}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-8 rounded-2xl border border-gray-300 bg-white shadow-lg">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
            Order Items
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {displayOrder.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-6 p-6 transition-colors hover:bg-emerald-50/50"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-300 bg-white">
                {item.image && item.image !== PLACEHOLDER_IMAGE ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package
                      className="h-8 w-8 text-gray-400"
                      strokeWidth={2}
                    />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="mb-1 font-semibold text-gray-900">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-600">
                  Variant: {item.variant} • Quantity: {item.quantity}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  £{item.pricePerUnit.toFixed(2)} / unit
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  £{item.total.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="rounded-2xl border border-gray-300 bg-white shadow-lg p-6">
        <h3 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-3">
          <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
          Order Summary
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="text-gray-900">
              £{displayOrder.subtotal.toFixed(2)}
            </span>
          </div>
          {displayOrder.discount > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Discount</span>
              <span className="text-emerald-600">
                -£{displayOrder.discount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>
              Shipping
              {displayOrder.shippingMethod && (
                <>
                  {" "}
                  <span className="text-xs">
                    (
                    {SHIPPING_OPTIONS.find(
                      (opt) => opt.id === displayOrder.shippingMethod
                    )?.name || displayOrder.shippingMethod}
                    )
                  </span>
                </>
              )}
            </span>
            <span className="text-gray-900">
              {displayOrder.shipping === 0
                ? "Free"
                : `£${displayOrder.shipping.toFixed(2)}`}
            </span>
          </div>
          {displayOrder.vatAmount > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>VAT (20%)</span>
              <span className="text-gray-900">
                £{displayOrder.vatAmount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="border-t border-gray-300 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Total
              </span>
              <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                £{displayOrder.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Order Detail Skeleton
function OrderDetailSkeleton() {
  return (
    <div>
      {/* Header Skeleton */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-emerald-100 rounded animate-pulse" />
          <div className="h-5 w-32 bg-emerald-100 rounded animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-11 w-40 bg-emerald-100 rounded animate-pulse" />
          <div className="h-11 w-32 bg-emerald-100 rounded animate-pulse" />
        </div>
      </div>

      {/* Order Info Card Skeleton */}
      <div className="mb-8 rounded-2xl border border-gray-300 bg-white shadow-lg p-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-emerald-100 rounded animate-pulse" />
              <div className="h-6 w-32 bg-emerald-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address Skeleton */}
      <div className="mb-8 rounded-2xl border border-gray-300 bg-white shadow-lg p-6">
        <div className="h-7 w-40 mb-4 bg-emerald-100 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 w-48 bg-emerald-100 rounded animate-pulse" />
          <div className="h-4 w-64 bg-emerald-100 rounded animate-pulse" />
          <div className="h-4 w-40 bg-emerald-100 rounded animate-pulse" />
          <div className="h-4 w-32 bg-emerald-100 rounded animate-pulse" />
        </div>
      </div>

      {/* Order Items Skeleton */}
      <div className="mb-8 rounded-2xl border border-gray-300 bg-white shadow-lg">
        <div className="border-b border-gray-200 p-6">
          <div className="h-7 w-32 bg-emerald-100 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-6 p-6">
              <div className="h-24 w-24 bg-emerald-100 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-48 bg-emerald-100 rounded animate-pulse" />
                <div className="h-4 w-64 bg-emerald-100 rounded animate-pulse" />
                <div className="h-4 w-32 bg-emerald-100 rounded animate-pulse" />
              </div>
              <div className="h-6 w-20 bg-emerald-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary Skeleton */}
      <div className="rounded-2xl border border-gray-300 bg-white shadow-lg p-6">
        <div className="h-7 w-40 mb-4 bg-emerald-100 rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-24 bg-emerald-100 rounded animate-pulse" />
              <div className="h-4 w-20 bg-emerald-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
