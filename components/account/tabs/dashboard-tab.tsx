import Link from 'next/link'
import { Package, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ORDER_STATUS_CONFIG } from '@/lib/constants'
import type { Order } from '@/types/cart'

interface DashboardTabProps {
  userId: string
  orders: Order[]
}

export function DashboardTab({ orders }: DashboardTabProps) {
  // Calculate stats
  const totalOrders = orders.length
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
  const averageOrder = totalOrders > 0 ? totalSpent / totalOrders : 0
  const lastOrderDate =
    orders.length > 0
      ? orders[0].createdAt.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'No orders yet'

  // Get recent orders (limit 3)
  const recentOrders = orders.slice(0, 3)

  // Order status counts (single pass)
  const ordersByStatus = orders.reduce(
    (acc, order) => {
      if (order.status in acc) {
        acc[order.status as keyof typeof acc]++
      }
      return acc
    },
    { processing: 0, shipped: 0, delivered: 0, cancelled: 0 }
  )

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
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
          value={`£${totalSpent.toFixed(2)}`}
          color="secondary"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" strokeWidth={2} />}
          label="Average Order"
          value={`£${averageOrder.toFixed(2)}`}
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

      {/* Order Status Breakdown */}
      {totalOrders > 0 && (
        <div className="rounded-2xl border border-gray-300 bg-white p-6 sm:p-8 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-6 flex items-center gap-3">
            <div className="h-1 w-8 bg-emerald-600 rounded-full" />
            Order Status
          </h3>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatusCard label="Processing" value={ordersByStatus.processing} color="processing" />
            <StatusCard label="Shipped" value={ordersByStatus.shipped} color="shipped" />
            <StatusCard label="Delivered" value={ordersByStatus.delivered} color="delivered" />
            <StatusCard label="Cancelled" value={ordersByStatus.cancelled} color="cancelled" />
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="rounded-2xl border border-gray-300 bg-white shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight sm:text-2xl flex items-center gap-3">
              <div className="h-1 w-8 bg-emerald-600 rounded-full" />
              Recent Orders
            </h2>
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex items-center justify-center py-12 sm:py-16">
            <div className="text-center space-y-4 max-w-md px-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-emerald-100 p-4 border border-emerald-200">
                  <Package className="h-8 w-8 text-emerald-600" strokeWidth={2} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-300">
                <h3 className="text-lg font-semibold text-gray-900">No Orders Yet</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Start shopping to see your orders here
                </p>
              </div>
              <Link href="/products">
                <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
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
  )
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  small = false,
  color = 'primary',
}: {
  icon: React.ReactNode
  label: string
  value: string
  small?: boolean
  color?: 'primary' | 'secondary' | 'tertiary' | 'quaternary'
}) {
  const iconColors = {
    primary: 'bg-emerald-100 text-emerald-600',
    secondary: 'bg-teal-100 text-teal-600',
    tertiary: 'bg-emerald-100 text-emerald-600',
    quaternary: 'bg-cyan-100 text-cyan-600',
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-300 bg-white p-4 sm:p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <p className="text-xs sm:text-sm font-medium text-gray-600 tracking-wide uppercase">
            {label}
          </p>
          <p
            className={
              small
                ? 'text-base sm:text-lg font-semibold text-gray-900'
                : 'text-2xl sm:text-3xl font-bold tracking-tight text-gray-900'
            }
          >
            {value}
          </p>
        </div>
        <div
          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${iconColors[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

// Status Card Component
function StatusCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color?: 'processing' | 'shipped' | 'delivered' | 'cancelled'
}) {
  const statusColors = {
    processing: 'bg-teal-100 border-teal-200',
    shipped: 'bg-emerald-100 border-emerald-200',
    delivered: 'bg-emerald-200 border-emerald-300',
    cancelled: 'bg-red-200 border-red-300',
  }

  return (
    <div
      className={`group rounded-lg border p-4 ${statusColors[color || 'processing']} transition-all duration-200 hover:shadow-md hover:scale-105`}
    >
      <div className="text-xs sm:text-sm font-medium mb-1 text-gray-600 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}

// Order Card Component
function OrderCard({ order }: { order: Order }) {
  const statusConfig = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG]
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const orderDate = order.createdAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link
      href={`/account/orders/${order.id}`}
      className="block p-4 sm:p-6 border-b border-gray-200 transition-colors hover:bg-emerald-50/50"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap mb-1">
            <span className="font-semibold text-sm sm:text-base text-gray-900">
              #{order.orderNumber}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                statusConfig?.className || ORDER_STATUS_CONFIG.processing.className
              }`}
            >
              {statusConfig?.label || order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            {orderDate} • {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2 sm:gap-1">
          <div className="text-base sm:text-lg font-semibold text-gray-900">
            £{order.total.toFixed(2)}
          </div>
          <span className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
            View Details
          </span>
        </div>
      </div>
    </Link>
  )
}


