"use client";
import dynamic from "next/dynamic";
import { TrendingUp, Package, BarChart3, PieChart } from "lucide-react";

// Lazy-load heavy chart components with SSR disabled
const RevenueChart = dynamic(
  () =>
    import("@/components/admin/revenue-chart").then((mod) => ({
      default: mod.RevenueChart,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] rounded-xl bg-linear-to-br from-emerald-50 to-teal-50 animate-pulse" />
    ),
  }
);

const OrdersStatusChart = dynamic(
  () =>
    import("@/components/admin/orders-status-chart").then((mod) => ({
      default: mod.OrdersStatusChart,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] rounded-xl bg-linear-to-br from-emerald-50 to-teal-50 animate-pulse" />
    ),
  }
);

const TopProductsList = dynamic(
  () =>
    import("@/components/admin/top-products-list").then((mod) => ({
      default: mod.TopProductsList,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] rounded-xl bg-linear-to-br from-emerald-50 to-teal-50 animate-pulse" />
    ),
  }
);

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 p-6 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Sales performance and business insights
              </p>
            </div>
          </div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-300 bg-white p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  <TrendingUp
                    className="h-5 w-5 text-emerald-600"
                    strokeWidth={2}
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                  Revenue & Orders Trend
                </h2>
              </div>
              <RevenueChart />
            </div>
          </div>

          {/* Status Chart - Takes 1 column */}
          <div>
            <div className="rounded-2xl border border-gray-300 bg-white p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-linear-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
                  <PieChart className="h-5 w-5 text-teal-600" strokeWidth={2} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="h-1 w-8 bg-linear-to-r from-teal-600 to-cyan-600 rounded-full"></div>
                  Orders by Status
                </h2>
              </div>
              <OrdersStatusChart />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-1">
          {/* Top Products */}
          <div className="rounded-2xl border border-gray-300 bg-white p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-linear-to-br from-cyan-100 to-emerald-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-cyan-600" strokeWidth={2} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-cyan-600 to-emerald-600 rounded-full"></div>
                Top Performing Products
              </h2>
            </div>
            <TopProductsList limit={10} />
          </div>
        </div>

        {/* Info Badge */}
        <div className="p-4 bg-linear-to-r from-emerald-100 to-teal-100 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Data refreshes automatically every hour to ensure accurate insights
          </div>
        </div>
      </div>
    </div>
  );
}
