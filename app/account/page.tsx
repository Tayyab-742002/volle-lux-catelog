// app/account/page.tsx
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
      <div className="flex items-center justify-center py-16 sm:py-20">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <ShoppingBag className="h-8 w-8 text-primary" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome to Your Account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please sign in to view your dashboard
            </p>
          </div>
          <Link href="/auth/login">
            <Button>Sign In</Button>
          </Link>
        </div>
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
    <div className="space-y-8">
      {/* Stats Grid - Fully Responsive */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<ShoppingBag className="h-5 w-5" strokeWidth={1.5} />}
          label="Total Orders"
          value={totalOrders.toString()}
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5" strokeWidth={1.5} />}
          label="Total Spent"
          value={`$${totalSpent.toFixed(2)}`}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" strokeWidth={1.5} />}
          label="Average Order"
          value={`$${averageOrder.toFixed(2)}`}
        />
        <StatCard
          icon={<Package className="h-5 w-5" strokeWidth={1.5} />}
          label="Last Order"
          value={lastOrderDate}
          small
        />
      </div>

      {/* Order Status Breakdown - Only show if there are orders */}
      {totalOrders > 0 && (
        <div className="rounded-xl border border-neutral-400 bg-card p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-semibold tracking-tight mb-6">
            Order Status
          </h3>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatusCard
              label="Processing"
              value={ordersByStatus.processing}
              color="yellow"
            />
            <StatusCard
              label="Shipped"
              value={ordersByStatus.shipped}
              color="blue"
            />
            <StatusCard
              label="Delivered"
              value={ordersByStatus.delivered}
              color="green"
            />
            <StatusCard
              label="Cancelled"
              value={ordersByStatus.cancelled}
              color="gray"
            />
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="rounded-xl border border-neutral-400  bg-card shadow-sm overflow-hidden">
        <div className="border-b border-neutral-400  p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Recent Orders
            </h2>
            {totalOrders > 0 && (
              <Link
                href="/account/orders"
                className="text-sm text-primary hover:underline"
              >
                View All
              </Link>
            )}
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex items-center justify-center py-12 sm:py-16">
            <div className="text-center space-y-4 max-w-md px-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-neutral-100  p-4">
                  <Package
                    className="h-8 w-8 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">No Orders Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start shopping to see your orders here
                </p>
              </div>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 ">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  small = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-xl border border-neutral-400  bg-card p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm text-muted-foreground">
          {label}
        </span>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      <div
        className={
          small
            ? "text-base sm:text-lg font-semibold"
            : "text-2xl sm:text-3xl font-bold tracking-tight"
        }
      >
        {value}
      </div>
    </div>
  );
}

// Status Card Component
function StatusCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "yellow" | "blue" | "green" | "gray";
}) {
  const colors = {
    yellow:
      "bg-yellow-50  text-yellow-800 ",
    blue: "bg-blue-50  text-blue-800 ",
    green:
      "bg-green-50  text-green-800 ",
    gray: "bg-neutral-50  text-neutral-600 ",
  };

  return (
    <div className={`rounded-lg p-4 ${colors[color]}`}>
      <div className="text-xs sm:text-sm font-medium mb-1">{label}</div>
      <div className="text-xl sm:text-2xl font-bold">{value}</div>
    </div>
  );
}

// Order Card Component
function OrderCard({ order }: { order: any }) {
  const statusColors: Record<string, string> = {
    delivered:
      "bg-green-100 text-green-800 ",
    shipped: "bg-blue-100 text-blue-800 ",
    processing:
      "bg-yellow-100 text-yellow-800 ",
    cancelled:
      "bg-neutral-100 text-neutral-800 ",
  };

  return (
    <div className="p-4 sm:p-6 hover:bg-neutral-50  transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap mb-1">
            <span className="font-semibold text-sm sm:text-base">
              #{order.id}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                statusColors[order.status.toLowerCase()] ||
                statusColors.processing
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            {order.date} • {order.itemCount}{" "}
            {order.itemCount === 1 ? "item" : "items"}
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2 sm:gap-1">
          <div className="text-base sm:text-lg font-semibold">
            ${order.total.toFixed(2)}
          </div>
          <Link
            href={`/account/orders/${order.fullId}`}
            className="text-xs sm:text-sm text-primary hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
