import Link from "next/link";
import { Package, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

export default function AccountDashboard() {
  // Mock data - will be replaced with Supabase data later
  const stats = {
    totalOrders: 12,
    totalSpent: 2450.0,
    averageOrder: 204.17,
    lastOrderDate: "Dec 15, 2024",
  };

  const recentOrders = [
    {
      id: "ORD-001",
      date: "Dec 15, 2024",
      total: 245.5,
      status: "Delivered",
      itemCount: 25,
    },
    {
      id: "ORD-002",
      date: "Dec 10, 2024",
      total: 189.0,
      status: "Shipped",
      itemCount: 15,
    },
    {
      id: "ORD-003",
      date: "Dec 5, 2024",
      total: 320.75,
      status: "Delivered",
      itemCount: 42,
    },
  ];

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
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
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
                  href={`/account/orders/${order.id}`}
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
