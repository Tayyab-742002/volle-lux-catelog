import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Download, ShoppingCart, Package, Truck, MapPin } from "lucide-react";
import { getOrderById } from "@/services/orders/order.service";
import { getCurrentUserServer } from "@/services/auth/auth-server.service";
import { notFound } from "next/navigation";

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
      <div className="rounded-lg border border-neutral-400 bg-card p-12 text-center">
        <p className="text-muted-foreground">
          Please sign in to view order details
        </p>
        <Link href="/auth/login">
          <Button className="mt-4">Sign In</Button>
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
      <div className="rounded-lg border border-neutral-500 bg-card p-12 text-center">
        <p className="text-muted-foreground">
          You don&apos;t have access to this order
        </p>
        <Link href="/account/orders">
          <Button className="mt-4">Back to Orders</Button>
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
      image: item.product?.image || "/placeholder-image.png",
    })),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500 text-green-800";
      case "Shipped":
        return "bg-purple-500 text-white";
      case "Processing":
        return "bg-indigo-500 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold">Order Details</h2>
          <p className="mt-2 text-muted-foreground">Order #{displayOrder.id}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <Download className="mr-2 h-5 w-5" />
            Download Invoice
          </Button>
          <Button size="lg">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Reorder
          </Button>
        </div>
      </div>

      {/* Order Info Card */}
      <div className="mb-8 rounded-lg  border border-neutral-400 bg-card p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              Order Date
            </div>
            <div className="font-semibold">{displayOrder.date}</div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              Status
            </div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(displayOrder.status)}`}
            >
              {displayOrder.status}
            </span>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Total
            </div>
            <div className="text-2xl font-bold">
              ${displayOrder.total.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="mb-8 rounded-lg border border-neutral-400 bg-card p-6">
        <h3 className="mb-4 text-xl font-semibold">Shipping Address</h3>
        <div className="text-muted-foreground">
          <p className="font-medium text-foreground">
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
      <div className="mb-8 rounded-lg border border-neutral-400 bg-card">
        <div className="border-b p-6">
          <h3 className="text-xl font-semibold">Order Items</h3>
        </div>
        <div className="divide-y">
          {displayOrder.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-6 p-6 transition-colors hover:bg-muted/30"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted">
                {item.image && item.image !== PLACEHOLDER_IMAGE ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="mb-1 font-semibold">{item.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Variant: {item.variant} • Quantity: {item.quantity}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  ${item.pricePerUnit.toFixed(2)} / unit
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">
                  ${item.total.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="rounded-lg border border-neutral-400 bg-card p-6">
        <h3 className="mb-4 text-xl font-semibold">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>${displayOrder.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Discount</span>
            <span className="text-green-600">
              -${displayOrder.discount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>${displayOrder.shipping.toFixed(2)}</span>
          </div>
          <div className="border-t border-primary pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-primary">Total</span>
              <span className="text-primary">${displayOrder.total.toFixed(2)}</span>
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
          <div className="h-9 w-48 bg-neutral-400 rounded animate-pulse" />
          <div className="h-5 w-32 bg-neutral-400 rounded animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-11 w-40 bg-neutral-400 rounded animate-pulse" />
          <div className="h-11 w-32 bg-neutral-400 rounded animate-pulse" />
        </div>
      </div>

      {/* Order Info Card Skeleton */}
      <div className="mb-8 rounded-lg border border-neutral-400 bg-card p-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-neutral-400 rounded animate-pulse" />
              <div className="h-6 w-32 bg-neutral-400 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address Skeleton */}
      <div className="mb-8 rounded-lg border border-neutral-400 bg-card p-6">
        <div className="h-7 w-40 mb-4 bg-neutral-400 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 w-48 bg-neutral-400 rounded animate-pulse" />
          <div className="h-4 w-64 bg-neutral-400 rounded animate-pulse" />
          <div className="h-4 w-40 bg-neutral-400 rounded animate-pulse" />
          <div className="h-4 w-32 bg-neutral-400 rounded animate-pulse" />
        </div>
      </div>

      {/* Order Items Skeleton */}
      <div className="mb-8 rounded-lg border border-neutral-400 bg-card">
        <div className="border-b p-6">
          <div className="h-7 w-32 bg-neutral-400 rounded animate-pulse" />
        </div>
        <div className="divide-y">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-6 p-6">
              <div className="h-24 w-24 bg-neutral-400 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-48 bg-neutral-400 rounded animate-pulse" />
                <div className="h-4 w-64 bg-neutral-400 rounded animate-pulse" />
                <div className="h-4 w-32 bg-neutral-400 rounded animate-pulse" />
              </div>
              <div className="h-6 w-20 bg-neutral-400 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary Skeleton */}
      <div className="rounded-lg border border-neutral-400 bg-card p-6">
        <div className="h-7 w-40 mb-4 bg-neutral-400 rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-24 bg-neutral-400 rounded animate-pulse" />
              <div className="h-4 w-20 bg-neutral-400 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
