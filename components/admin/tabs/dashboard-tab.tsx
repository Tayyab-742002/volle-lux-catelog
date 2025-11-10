import Link from 'next/link'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  Leaf,
} from 'lucide-react'
import { StatsCard } from '../stats-card'
import type { DashboardStats } from '@/services/admin/admin-server.service'
import type { AdminOrder } from '@/services/admin/order.service'

interface DashboardTabProps {
  stats: DashboardStats
  orders: AdminOrder[]
}

export function DashboardTab({ stats }: DashboardTabProps) {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg">
                <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">
                  Overview of your store performance
                </p>
              </div>
            </div>
            <div className="flex sm:hidden items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-lg border border-emerald-200 self-start">
              <Leaf className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2} />
              <span className="text-xs font-semibold text-emerald-800">
                Eco Store
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-lg border border-emerald-200">
              <Leaf className="h-4 w-4 text-emerald-600" strokeWidth={2} />
              <span className="text-sm font-semibold text-emerald-800">
                Eco Store
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8 md:mb-10">
          <StatsCard
            title="Today's Revenue"
            value={`£${stats.todayRevenue.toLocaleString('en-GB', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            icon={<DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />}
            color="primary"
          />
          <StatsCard
            title="Total Orders"
            value={stats.total.toLocaleString()}
            icon={<ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />}
            color="secondary"
          />
          <StatsCard
            title="Average Order Value"
            value={`£${stats.averageOrderValue.toFixed(2)}`}
            icon={<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />}
            color="tertiary"
          />
          <StatsCard
            title="Total Customers"
            value={stats.totalCustomers?.toLocaleString() || '—'}
            icon={<Users className="h-4 w-4 sm:h-5 sm:w-5" />}
            color="quaternary"
          />
        </div>

        {/* Order Status Overview */}
        <div className="rounded-xl sm:rounded-2xl border border-gray-300 bg-white p-4 sm:p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" strokeWidth={2} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
              <div className="h-1 w-6 sm:w-8 bg-emerald-600 rounded-full" />
              <span className="text-base sm:text-xl">Order Status Overview</span>
            </h2>
          </div>
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <OrderStatusCard
              value={stats.pending}
              label="Pending"
              color="bg-teal-100 border-teal-200"
              iconColor="text-teal-600"
            />
            <OrderStatusCard
              value={stats.processing}
              label="Processing"
              color="bg-teal-200 border-teal-300"
              iconColor="text-teal-600"
            />
            <OrderStatusCard
              value={stats.shipped}
              label="Shipped"
              color="bg-emerald-100 border-emerald-200"
              iconColor="text-emerald-600"
            />
            <OrderStatusCard
              value={stats.delivered}
              label="Delivered"
              color="bg-emerald-200 border-emerald-300"
              iconColor="text-emerald-600"
            />
            <OrderStatusCard
              value={stats.cancelled}
              label="Cancelled"
              color="bg-red-200 border-red-300"
              iconColor="text-red-600"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Order Status Card Component
function OrderStatusCard({
  value,
  label,
  color,
  iconColor,
}: {
  value: number
  label: string
  color: string
  iconColor: string
}) {
  return (
    <div
      className={`group rounded-lg sm:rounded-xl border ${color} p-3 sm:p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}
    >
      <div className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
        <Package className={`h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 ${iconColor}`} strokeWidth={2} />
      </div>
      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">
        {value.toLocaleString()}
      </div>
      <div className="text-xs sm:text-sm font-medium text-gray-700">{label}</div>
    </div>
  )
}


