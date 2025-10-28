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

      {/* Recent Orders */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent Orders</h2>
            <Link
              href="/account/orders"
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="divide-y">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-6 transition-colors hover:bg-muted/50"
            >
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-3">
                  <span className="font-semibold">{order.id}</span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.date} • {order.itemCount} items
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
      </div>
    </div>
  );
}
