import { OrdersTable } from '../orders-table'
import type { AdminOrder } from '@/services/admin/order.service'

interface OrdersTabProps {
  orders: AdminOrder[]
}

export function OrdersTab({ orders }: OrdersTabProps) {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="h-1 w-8 bg-emerald-600 rounded-full" />
          Orders Management
        </h2>
        <p className="mt-2 text-gray-600">Manage and track all customer orders</p>
      </div>

      <div className="rounded-2xl border border-gray-300 bg-white shadow-lg overflow-hidden">
        <OrdersTable orders={orders} loading={false} />
      </div>
    </div>
  )
}


