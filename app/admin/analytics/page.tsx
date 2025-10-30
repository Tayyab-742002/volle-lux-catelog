"use client";

import { RevenueChart } from "@/components/admin/revenue-chart";
import { OrdersStatusChart } from "@/components/admin/orders-status-chart";
import { TopProductsList } from "@/components/admin/top-products-list";

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="mt-2 text-muted-foreground">
          Sales performance and insights
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Revenue Chart - Full Width on Mobile */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-6 text-xl font-semibold">Revenue & Orders</h2>
            <RevenueChart />
          </div>
        </div>

        {/* Orders by Status */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-6 text-xl font-semibold">Orders by Status</h2>
          <OrdersStatusChart />
        </div>

        {/* Top Products */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-6 text-xl font-semibold">Top Products</h2>
          <TopProductsList limit={10} />
        </div>
      </div>
    </div>
  );
}

