import Link from "next/link";
import { Package, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";
import { getCurrentUserServer } from "@/services/auth/auth-server.service";
import { getUserOrders } from "@/services/orders/order.service";
import { Button } from "@/components/ui/button";

export default async function AccountDashboard() {
  // Get current user
  const authResult = await getCurrentUserServer();

  // If not authenticated, show sign-in prompt
  if (!authResult.success || !authResult.user) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <h2 className="mb-4 text-2xl font-semibold">Welcome to Your Account</h2>
        <p className="mb-6 text-muted-foreground">
          Please sign in to view your dashboard
        </p>
        <Link href="/auth/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  // Fetch real orders from Supabase
  const orders = await getUserOrders(authResult.user.id);

  // Calculate real stats from orders
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;
  const lastOrderDate =
    orders.length > 0
      ? orders[0].createdAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "No orders yet";

  const stats = {
    totalOrders,
    totalSpent,
    averageOrder,
    lastOrderDate,
  };

  // Get recent orders (last 3)
  const recentOrders = orders.slice(0, 3).map((order) => ({
    id: order.orderNumber,
    fullId: order.id,
    date: order.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    total: order.total,
    status: order.status,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
  }));

  // Calculate order status breakdown
  const ordersByStatus = {
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div>
      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Orders</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ShoppingBag className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
          </div>
          <div className="text-3xl font-bold">{stats.totalOrders}</div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Spent</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
          </div>
          <div className="text-3xl font-bold">
            ${stats.totalSpent.toFixed(2)}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Average Order</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
          </div>
          <div className="text-3xl font-bold">
            ${stats.averageOrder.toFixed(2)}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Order</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
          </div>
          <div className="text-lg font-semibold">{stats.lastOrderDate}</div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      {totalOrders > 0 && (
        <div className="mb-8 rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Order Status</h3>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <div>
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  Processing
                </div>
                <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {ordersByStatus.processing}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  Shipped
                </div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {ordersByStatus.shipped}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <div>
                <div className="text-sm text-green-800 dark:text-green-200">
                  Delivered
                </div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {ordersByStatus.delivered}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Cancelled
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {ordersByStatus.cancelled}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent Orders</h2>
            {totalOrders > 0 && (
              <Link
                href="/account/orders"
                className="text-sm text-primary hover:underline"
              >
                View All Orders
              </Link>
            )}
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No Orders Yet</h3>
            <p className="mb-6 text-muted-foreground">
              Start shopping to see your orders here
            </p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-6 transition-colors hover:bg-muted/50"
              >
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-3">
                    <span className="font-semibold">#{order.id}</span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.date} • {order.itemCount}{" "}
                    {order.itemCount === 1 ? "item" : "items"}
                  </div>
                </div>
                <div className="ml-6 text-right">
                  <div className="text-lg font-semibold">
                    ${order.total.toFixed(2)}
                  </div>
                  <Link
                    href={`/account/orders/${order.fullId}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
