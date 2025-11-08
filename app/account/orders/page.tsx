import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getUserOrders } from "@/services/orders/order.service";
import { getCurrentUserServer } from "@/services/auth/auth-server.service";
import { OrdersTable } from "@/components/account/orders-table";

// Force fresh data on every request - no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OrderHistoryPage() {
  // Get current user
  const authResult = await getCurrentUserServer();

  // If not authenticated, show empty state
  if (!authResult.success || !authResult.user) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
            Order History
          </h2>
          <p className="mt-2 text-gray-600">
            View and track all your past orders
          </p>
        </div>
        <div className="rounded-2xl border border-gray-300 bg-white shadow-lg p-12 text-center">
          <p className="text-gray-600">Please sign in to view your orders</p>
          <Link href="/auth/login">
            <Button className="mt-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
          Order History
        </h2>
        <p className="mt-2 text-gray-600">
          View and track all your past orders
        </p>
      </div>

      <Suspense fallback={<OrdersTable orders={[]} loading />}>
        <OrdersContent userId={authResult.user.id} />
      </Suspense>
    </div>
  );
}

// Orders Content Component
async function OrdersContent({ userId }: { userId: string }) {
  // Fetch orders from Supabase
  const orders = await getUserOrders(userId);

  return <OrdersTable orders={orders} />;
}
