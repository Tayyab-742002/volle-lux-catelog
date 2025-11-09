'use client'

import dynamic from 'next/dynamic'
import { TrendingUp, Package, BarChart3, PieChart } from 'lucide-react'
import type { AdminOrder } from '@/services/admin/order.service'
import type { DashboardStats } from '@/services/admin/admin-server.service'

// Lazy-load heavy chart components
const RevenueChart = dynamic(
  () =>
    import('../revenue-chart').then((mod) => ({
      default: mod.RevenueChart,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] rounded-xl bg-emerald-50 animate-pulse" />
    ),
  }
)

const OrdersStatusChart = dynamic(
  () =>
    import('../orders-status-chart').then((mod) => ({
      default: mod.OrdersStatusChart,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] rounded-xl bg-emerald-50 animate-pulse" />
    ),
  }
)

const TopProductsList = dynamic(
  () =>
    import('../top-products-list').then((mod) => ({
      default: mod.TopProductsList,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] rounded-xl bg-emerald-50 animate-pulse" />
    ),
  }
)

interface AnalyticsTabProps {
  orders: AdminOrder[]
  stats: DashboardStats
}

export function AnalyticsTab({ orders, stats }: AnalyticsTabProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                Analytics
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">
                Detailed insights and performance metrics
              </p>
            </div>
          </div>
        </div>

        {/* Row 1: Revenue Chart */}
        <div className="rounded-xl sm:rounded-2xl border border-gray-300 bg-white p-4 sm:p-6 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" strokeWidth={2} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Revenue Overview</h2>
          </div>
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <RevenueChart />
          </div>
        </div>

        {/* Row 2: Two Columns */}
        <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 lg:grid-cols-2">
          {/* Order Status Distribution */}
          <div className="rounded-xl sm:rounded-2xl border border-gray-300 bg-white p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" strokeWidth={2} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Order Status Distribution
              </h2>
            </div>
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <OrdersStatusChart />
            </div>
          </div>

          {/* Top Products */}
          <div className="rounded-xl sm:rounded-2xl border border-gray-300 bg-white p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" strokeWidth={2} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Top Products</h2>
            </div>
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <TopProductsList />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


