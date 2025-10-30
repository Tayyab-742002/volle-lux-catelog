"use client";

import dynamic from "next/dynamic";
import { TrendingUp, DollarSign, Package, Users } from "lucide-react";

// Lazy-load heavy chart components with SSR disabled to reduce initial bundle size
const RevenueChart = dynamic(
  () =>
    import("@/components/admin/revenue-chart").then((mod) => ({
      default: mod.RevenueChart,
    })),
  {
    ssr: false,
    loading: () => <div className="h-[400px]" />,
  }
);

const OrdersStatusChart = dynamic(
  () =>
    import("@/components/admin/orders-status-chart").then((mod) => ({
      default: mod.OrdersStatusChart,
    })),
  {
    ssr: false,
    loading: () => <div className="h-[400px]" />,
  }
);

const TopProductsList = dynamic(
  () =>
    import("@/components/admin/top-products-list").then((mod) => ({
      default: mod.TopProductsList,
    })),
  {
    ssr: false,
    loading: () => <div className="h-[400px]" />,
  }
);

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Sales performance and business insights
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg transition-transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Total Revenue</p>
              <p className="mt-2 text-3xl font-bold">$0.00</p>
            </div>
            <DollarSign className="h-10 w-10 opacity-80" />
          </div>
        </div>

        <div className="rounded-xl border bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg transition-transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Total Orders</p>
              <p className="mt-2 text-3xl font-bold">0</p>
            </div>
            <Package className="h-10 w-10 opacity-80" />
          </div>
        </div>

        <div className="rounded-xl border bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg transition-transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Avg Order Value</p>
              <p className="mt-2 text-3xl font-bold">$0.00</p>
            </div>
            <TrendingUp className="h-10 w-10 opacity-80" />
          </div>
        </div>

        <div className="rounded-xl border bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg transition-transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Customers</p>
              <p className="mt-2 text-3xl font-bold">0</p>
            </div>
            <Users className="h-10 w-10 opacity-80" />
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Revenue Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold tracking-tight">
              Revenue & Orders Trend
            </h2>
            <RevenueChart />
          </div>
        </div>

        {/* Status Chart - Takes 1 column */}
        <div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold tracking-tight">
              Orders by Status
            </h2>
            <OrdersStatusChart />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-8 lg:grid-cols-1">
        {/* Top Products */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold tracking-tight">
            Top Products
          </h2>
          <TopProductsList limit={10} />
        </div>
      </div>
    </div>
  );
}
