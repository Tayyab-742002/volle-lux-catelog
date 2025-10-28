import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { getUserOrders } from "@/services/orders/order.service";
import { getCurrentUserServer } from "@/services/auth/auth-server.service";

export default async function OrderHistoryPage() {
  // Get current user
  const authResult = await getCurrentUserServer();

  // If not authenticated, show empty state
  if (!authResult.success || !authResult.user) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Order History</h2>
          <p className="mt-2 text-muted-foreground">
            View and track all your past orders
          </p>
        </div>
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            Please sign in to view your orders
          </p>
          <Link href="/auth/login">
            <Button className="mt-4">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch orders from Supabase
  const orders = await getUserOrders(authResult.user.id);

  // Format orders for display
  const formattedOrders = orders.map((order) => ({
    id: order.orderNumber,
    date: order.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    total: order.total,
    status: order.status,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    fullOrder: order, // Keep reference to full order for linking
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Order History</h2>
        <p className="mt-2 text-muted-foreground">
          View and track all your past orders
        </p>
      </div>

      {formattedOrders.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">No orders yet</p>
          <Link href="/products">
            <Button className="mt-4">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card">
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {formattedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-6 py-4 font-medium">{order.id}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {order.itemCount} items
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/account/orders/${order.fullOrder.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {formattedOrders.map((order) => (
              <div key={order.id} className="border-b p-4 last:border-b-0">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{order.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.date}
                    </div>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {order.itemCount} items
                  </span>
                  <span className="font-semibold">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
                <Link href={`/account/orders/${order.fullOrder.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
