// app/account/page.tsx
import Link from "next/link";
import { Suspense } from "react";
import { Package, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";
import { getCurrentUserServer } from "@/services/auth/auth-server.service";
import { getUserOrders } from "@/services/orders/order.service";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";

// Force fresh data on every request - no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AccountDashboard() {
  // Get current user
  const authResult = await getCurrentUserServer();

  // If not authenticated, show sign-in prompt
  if (!authResult.success || !authResult.user) {
    return (
      <div className="flex items-center justify-center py-16 sm:py-20">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-linear-to-br from-emerald-100 to-teal-100 p-4 border border-emerald-200">
              <ShoppingBag
                className="h-8 w-8 text-emerald-600"
                strokeWidth={2}
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-300">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Welcome to Your Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to view your dashboard
            </p>
          </div>
          <Link href="/auth/login">
            <Button className="bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent userId={authResult.user.id} />
    </Suspense>
  );
}

// Dashboard Content Component with parallel fetching
async function DashboardContent({ userId }: { userId: string }) {
  // Fetch orders from Supabase
  const orders = await getUserOrders(userId);

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
          icon={<ShoppingBag className="h-5 w-5" strokeWidth={2} />}
          label="Total Orders"
          value={totalOrders.toString()}
          color="primary"
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5" strokeWidth={2} />}
          label="Total Spent"
          value={`$${totalSpent.toFixed(2)}`}
          color="secondary"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" strokeWidth={2} />}
          label="Average Order"
          value={`$${averageOrder.toFixed(2)}`}
          color="tertiary"
        />
        <StatCard
          icon={<Package className="h-5 w-5" strokeWidth={2} />}
          label="Last Order"
          value={lastOrderDate}
          small
          color="quaternary"
        />
      </div>

      {/* Order Status Breakdown - Only show if there are orders */}
      {totalOrders > 0 && (
        <div className="rounded-2xl border border-gray-300 bg-white p-6 sm:p-8 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-6 flex items-center gap-3">
            <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
            Order Status
          </h3>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatusCard
              label="Processing"
              value={ordersByStatus.processing}
              color="processing"
            />
            <StatusCard
              label="Shipped"
              value={ordersByStatus.shipped}
              color="shipped"
            />
            <StatusCard
              label="Delivered"
              value={ordersByStatus.delivered}
              color="delivered"
            />
            <StatusCard
              label="Cancelled"
              value={ordersByStatus.cancelled}
              color="cancelled"
            />
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="rounded-2xl border border-gray-300 bg-white shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight sm:text-2xl flex items-center gap-3">
              <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
              Recent Orders
            </h2>
            {totalOrders > 0 && (
              <Link
                href="/account/orders"
                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
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
                <div className="rounded-full bg-linear-to-br from-emerald-100 to-teal-100 p-4 border border-emerald-200">
                  <Package
                    className="h-8 w-8 text-emerald-600"
                    strokeWidth={2}
                  />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-300">
                <h3 className="text-lg font-semibold text-gray-900">
                  No Orders Yet
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Start shopping to see your orders here
                </p>
              </div>
              <Link href="/products">
                <Button className="bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Dashboard Skeleton Loader
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-300 bg-white p-4 sm:p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 w-24 bg-emerald-300 rounded-lg animate-pulse" />
              <div className="h-10 w-10 bg-emerald-300 rounded-lg animate-pulse" />
            </div>
            <div className="h-9 w-32 bg-emerald-300 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>

      {/* Orders Skeleton */}
      <div className="rounded-2xl border border-gray-300 bg-white shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <div className="h-7 w-32 bg-emerald-300 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-emerald-300 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-emerald-300 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <div className="h-5 w-20 bg-emerald-300 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-emerald-300 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
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
  color = "primary",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  small?: boolean;
  color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "quaternary"
    | "quinary"
    | "senary"
    | "septenary"
    | "octonary"
    | "nonary"
    | "denary";
}) {
  // Map colors to emerald/teal theme
  const iconColors = {
    primary: "bg-linear-to-br from-emerald-200 to-teal-200 text-emerald-600",
    secondary: "bg-linear-to-br from-teal-200 to-cyan-200 text-teal-600",
    tertiary: "bg-linear-to-br from-emerald-200 to-teal-200 text-emerald-600",
    quaternary: "bg-linear-to-br from-cyan-200 to-teal-200 text-cyan-600",
    quinary: "bg-linear-to-br from-emerald-200 to-teal-200 text-emerald-600",
    senary: "bg-linear-to-br from-teal-200 to-cyan-200 text-teal-600",
    septenary: "bg-linear-to-br from-emerald-200 to-teal-200 text-emerald-600",
    octonary: "bg-linear-to-br from-red-200 to-orange-200 text-red-600",
    nonary: "bg-linear-to-br from-emerald-200 to-teal-200 text-emerald-600",
    denary: "bg-linear-to-br from-emerald-200 to-teal-200 text-emerald-600",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-300 bg-white p-4 sm:p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <div className="flex items-start justify-between">
        {/* Content */}
        <div className="flex-1 space-y-3">
          <p className="text-xs sm:text-sm font-medium text-gray-600 tracking-wide uppercase">
            {label}
          </p>
          <p
            className={
              small
                ? "text-base sm:text-lg font-semibold text-gray-900"
                : "text-2xl sm:text-3xl font-bold tracking-tight text-gray-900"
            }
          >
            {value}
          </p>
        </div>

        {/* Icon - Unified Brand Style */}
        <div
          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${iconColors[color]}`}
        >
          {icon}
        </div>
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
  color?: "processing" | "shipped" | "delivered" | "cancelled";
}) {
  const statusColors = {
    processing: "bg-linear-to-br from-teal-200 to-cyan-200 border-teal-200",
    shipped:
      "bg-linear-to-br from-emerald-200 to-emerald-200 border-emerald-200",
    delivered:
      "bg-linear-to-br from-emerald-400 to-emerald-400 border-emerald-400",
    cancelled: "bg-linear-to-br from-red-400 to-red-400 border-red-400",
  };

  return (
    <div
      className={`group rounded-lg border p-4 ${statusColors[color || "processing"]} transition-all duration-200 hover:shadow-md hover:scale-105`}
    >
      <div className="text-xs sm:text-sm font-medium mb-1 text-gray-600 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

// Order Card Component
interface OrderCardProps {
  order: {
    id: string;
    fullId: string;
    date: string;
    total: number;
    status: string;
    itemCount: number;
  };
}

function OrderCard({ order }: OrderCardProps) {
  const statusConfig =
    ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG];

  return (
    <Link
      href={`/account/orders/${order.fullId}`}
      className="block p-4 sm:p-6 border-b border-gray-200 transition-colors hover:bg-emerald-50/50"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap mb-1">
            <span className="font-semibold text-sm sm:text-base text-gray-900">
              #{order.id}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                statusConfig?.className ||
                ORDER_STATUS_CONFIG.processing.className
              }`}
            >
              {statusConfig?.label ||
                order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            {order.date} • {order.itemCount}{" "}
            {order.itemCount === 1 ? "item" : "items"}
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2 sm:gap-1">
          <div className="text-base sm:text-lg font-semibold text-gray-900">
            ${order.total.toFixed(2)}
          </div>
          <span className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
