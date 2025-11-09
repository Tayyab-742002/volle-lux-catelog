import { OrdersTable } from '../orders-table'
import type { Order } from '@/types/cart'

interface OrdersTabProps {
  orders: Order[]
}

export function OrdersTab({ orders }: OrdersTabProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="h-1 w-8 bg-emerald-600 rounded-full" />
          Order History
        </h2>
        <p className="mt-2 text-gray-600">View and track all your past orders</p>
      </div>

      <div className="rounded-2xl border border-gray-300 bg-white shadow-lg overflow-hidden">
        <OrdersTable orders={orders} />
      </div>
    </div>
  )
}


