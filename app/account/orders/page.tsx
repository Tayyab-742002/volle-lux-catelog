import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function OrderHistoryPage() {
  // Mock data - will be replaced with Supabase data later
  const orders = [
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
    {
      id: "ORD-004",
      date: "Nov 28, 2024",
      total: 156.25,
      status: "Processing",
      itemCount: 12,
    },
    {
      id: "ORD-005",
      date: "Nov 20, 2024",
      total: 498.0,
      status: "Delivered",
      itemCount: 60,
    },
    {
      id: "ORD-006",
      date: "Nov 15, 2024",
      total: 87.5,
      status: "Delivered",
      itemCount: 8,
    },
  ];

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

      {orders.length === 0 ? (
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
                {orders.map((order) => (
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
                      <Link href={`/account/orders/${order.id}`}>
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
            {orders.map((order) => (
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
                <Link href={`/account/orders/${order.id}`}>
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
