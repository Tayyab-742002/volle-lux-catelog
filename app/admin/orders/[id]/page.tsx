"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Download,
  Package,
  Truck,
  MapPin,
  CreditCard,
  ArrowLeft,
  Save,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/admin/status-badge";
import type { AdminOrder } from "@/services/admin/order.service";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  
  // Form state
  const [status, setStatus] = useState<string>("pending");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders?id=${orderId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Order not found");
        } else if (response.status === 403) {
          setError("You don't have permission to view this order");
        } else {
          setError("Failed to load order");
        }
        return;
      }
      
      const orderData = await response.json();
      // Convert dates from strings to Date objects
      const orderWithDates = {
        ...orderData,
        createdAt: new Date(orderData.createdAt),
        updatedAt: new Date(orderData.updatedAt),
      };
      setOrder(orderWithDates);
      setStatus(orderWithDates.status);
      setTrackingNumber(orderWithDates.trackingNumber || "");
      setNotes(orderWithDates.notes || "");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order");
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status: status !== order?.status ? status : undefined,
          trackingNumber: trackingNumber || undefined,
          notes: notes || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      // Refresh order data
      await fetchOrder();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setUpdating(false);
    }
  };


  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">
          Loading order details...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-12 text-center">
        <p className="text-lg font-medium text-destructive">
          {error || "Order not found"}
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/admin/orders">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasChanges =
    status !== order.status ||
    trackingNumber !== (order.trackingNumber || "") ||
    notes !== (order.notes || "");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="mt-2 text-muted-foreground">
              Order #{order.orderNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {order.paymentIntentId && (
            <Button variant="outline" size="lg">
              <ExternalLink className="mr-2 h-5 w-5" />
              View Stripe Payment
            </Button>
          )}
          <Button variant="outline" size="lg">
            <Download className="mr-2 h-5 w-5" />
            Download Invoice
          </Button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Info */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-6 text-xl font-semibold">Order Information</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  Order Date
                </div>
                <div className="font-semibold">{formatDate(order.createdAt)}</div>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  Status
                </div>
                <div><StatusBadge status={order.status} /></div>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Total
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(order.total)}
                </div>
              </div>
            </div>
          </div>

          {/* Status Update Section */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-6 text-xl font-semibold">Update Order Status</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="status">Order Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tracking">Tracking Number</Label>
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="notes">Admin Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this order..."
                  className="mt-2"
                  rows={4}
                />
              </div>

              <Button
                onClick={handleUpdateStatus}
                disabled={!hasChanges || updating}
                size="lg"
                className="w-full"
              >
                {updating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-6 text-xl font-semibold">Shipping Address</h3>
            <div className="text-muted-foreground">
              <p className="font-medium text-foreground">
                {order.shippingAddress?.fullName || "N/A"}
              </p>
              <p>{order.shippingAddress?.address || ""}</p>
              {order.shippingAddress?.address2 && <p>{order.shippingAddress.address2}</p>}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                {order.shippingAddress?.zipCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
              {order.shippingAddress?.phone && <p>Phone: {order.shippingAddress.phone}</p>}
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-lg border bg-card">
            <div className="border-b p-6">
              <h3 className="text-xl font-semibold">Order Items</h3>
            </div>
            <div className="divide-y">
              {order.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-6 p-6 transition-colors hover:bg-muted/30"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
                    <Image
                      src={item.product?.image || "/placeholder-image.jpg"}
                      alt={item.product?.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1 font-semibold">
                      {item.product?.name || "Product"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Variant: {item.variant?.name || "Default"} • Quantity:{" "}
                      {item.quantity}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {formatCurrency(item.pricePerUnit)} / unit
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Customer Info */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-6 text-xl font-semibold">Customer</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="mt-1 font-medium">
                  {order.customerName || "Guest"}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="mt-1">{order.email}</div>
              </div>
              {order.customerPhone && (
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="mt-1">{order.customerPhone}</div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-6 text-xl font-semibold">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Discount</span>
                <span className="text-green-600">
                  -{formatCurrency(order.discount)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{formatCurrency(order.shipping)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Info */}
          {order.trackingNumber && (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-xl font-semibold">Tracking</h3>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Tracking Number
                  </div>
                  <div className="mt-1 font-medium font-mono">
                    {order.trackingNumber}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

