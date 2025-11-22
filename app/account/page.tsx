// app/account/page.tsx
import { Suspense } from "react";
import { getCurrentUserServer } from "@/services/auth/auth-server.service";
import { getUserOrders } from "@/services/orders/order.service";
import { getSavedAddresses } from "@/services/users/user-server.service";
import { AccountDashboardClient } from "@/components/account/account-dashboard-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Dynamic page - always fetch fresh data for user account
// No revalidation needed as this is user-specific data
export const dynamic = 'force-dynamic';

export default async function AccountDashboard() {
  // Get current user
  const authResult = await getCurrentUserServer();

  // If not authenticated, show sign-in prompt
  if (!authResult.success || !authResult.user) {
    return (
      <div className="flex items-center justify-center py-16 sm:py-20">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-300">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Welcome to Your Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to view your dashboard
            </p>
          </div>
          <Link href="/auth/login">
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<AccountDashboardSkeleton />}>
      <AccountDashboardContent userId={authResult.user.id} />
    </Suspense>
  );
}

// Fetch ALL data at once for instant tab switching
async function AccountDashboardContent({ userId }: { userId: string }) {
  // Fetch all data in parallel
  const [orders, addresses] = await Promise.all([
    getUserOrders(userId),
    getSavedAddresses(userId),
  ]);

  // Pass all data to client component for instant tab switching
  return (
    <AccountDashboardClient
      userId={userId}
      initialOrders={orders}
      initialAddresses={addresses}
    />
  );
}

// Loading Skeleton - Matches actual dashboard layout with grid
function AccountDashboardSkeleton() {
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
          </div>
        </div>
      </aside>

      {/* Content Area Skeleton - Uses grid col-span-3 */}
      <div className="lg:col-span-3">
        <div className="space-y-6 sm:space-y-8">
          {/* Stats Grid Skeleton */}
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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

          {/* Recent Orders Skeleton */}
          <div className="rounded-xl sm:rounded-2xl border border-gray-300 bg-white shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 p-4 sm:p-6">
              <div className="h-6 sm:h-7 w-32 bg-emerald-300 rounded animate-pulse" />
            </div>
            <div className="divide-y divide-gray-200">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="h-4 w-40 max-w-full bg-emerald-300 rounded animate-pulse" />
                      <div className="h-3 w-32 max-w-full bg-emerald-300 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end shrink-0">
                      <div className="h-5 w-20 bg-emerald-300 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-emerald-300 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
