import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUserServer } from "@/services/auth/auth-server.service";
import {
  getDashboardStats,
  getAllOrders,
  getAllCustomers,
  getAdminB2BRequests,
  getAdminPendingB2BRequestsCount,
} from "@/services/admin/admin-server.service";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";

// Dynamic page - always fetch fresh data for admin dashboard
// No revalidation needed as this is user-specific data
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Check authentication and admin role
  const authResult = await getCurrentUserServer();

  if (!authResult.success || !authResult.user) {
    redirect("/auth/login");
  }

  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardContent />
    </Suspense>
  );
}

// Fetch ALL admin data at once for instant tab switching
async function AdminDashboardContent() {
  // Parallel data fetching for maximum performance
  const [stats, orders, customers, b2bRequests, pendingB2BCount] =
    await Promise.all([
      getDashboardStats(),
      getAllOrders(),
      getAllCustomers(),
      getAdminB2BRequests(),
      getAdminPendingB2BRequestsCount(),
    ]);

  // Pass all data to client component for instant tab switching
  return (
    <AdminDashboardClient
      initialStats={stats}
      initialOrders={orders}
      initialCustomers={customers}
      initialB2BRequests={b2bRequests}
      pendingB2BRequestsCount={pendingB2BCount}
    />
  );
}

// Loading Skeleton - Matches actual dashboard layout with grid
function AdminDashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
      {/* Mobile Tabs Skeleton (< 1024px) */}
      <div className="lg:hidden mb-6">
        <div className="rounded-xl border border-gray-300 bg-white shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <nav className="flex min-w-max">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex-1 min-w-[120px] px-6 py-4 border-b-2 border-transparent"
                >
                  <div className="flex items-center gap-2 justify-center">
                    <div className="h-5 w-5 bg-emerald-300 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-emerald-300 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar Skeleton (≥ 1024px) - Uses grid col-span-1 */}
      <aside className="hidden lg:block lg:col-span-1">
        <div className="rounded-xl border border-gray-300 bg-white shadow-lg overflow-hidden sticky top-4">
          <div className="divide-y divide-gray-200">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="h-5 w-5 bg-emerald-300 rounded animate-pulse" />
                <div className="h-4 w-20 bg-emerald-300 rounded animate-pulse" />
              </div>
            ))}
            {/* External Link Skeleton */}
            <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200">
              <div className="h-5 w-5 bg-emerald-300 rounded animate-pulse" />
              <div className="h-4 w-16 bg-emerald-300 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </aside>

      {/* Content Area Skeleton - Uses grid col-span-3 */}
      <div className="lg:col-span-3">
        <div className="space-y-6 sm:space-y-8">
          {/* Header Skeleton */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-emerald-300 animate-pulse shrink-0" />
                <div className="space-y-2 min-w-0">
                  <div className="h-6 sm:h-8 md:h-9 w-32 sm:w-40 bg-emerald-300 rounded animate-pulse" />
                  <div className="h-3 sm:h-4 w-48 sm:w-64 bg-emerald-300 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8 md:mb-10">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl sm:rounded-2xl border border-gray-300 bg-white p-4 sm:p-5 md:p-6 shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                    <div className="h-3 w-20 bg-emerald-300 rounded animate-pulse" />
                    <div className="h-7 sm:h-8 md:h-9 w-24 bg-emerald-300 rounded animate-pulse" />
                  </div>
                  <div className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 bg-emerald-300 rounded-lg animate-pulse shrink-0" />
                </div>
              </div>
            ))}
          </div>

          {/* Order Status Overview Skeleton */}
          <div className="rounded-xl sm:rounded-2xl border border-gray-300 bg-white p-4 sm:p-6 md:p-8 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-emerald-300 animate-pulse shrink-0" />
              <div className="h-6 sm:h-7 w-48 max-w-full bg-emerald-300 rounded animate-pulse" />
            </div>
            <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="rounded-lg sm:rounded-xl border border-gray-200 bg-teal-50 p-3 sm:p-4 md:p-6"
                >
                  <div className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-lg bg-emerald-300 animate-pulse mb-2 sm:mb-3 md:mb-4" />
                  <div className="h-6 sm:h-7 md:h-8 w-16 bg-emerald-300 rounded animate-pulse mb-1" />
                  <div className="h-3 sm:h-4 w-20 bg-emerald-300 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
