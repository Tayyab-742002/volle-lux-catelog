"use client";

import { useState, useEffect } from "react";
import { CustomerTable } from "@/components/admin/customer-table";
import { AlertTriangle, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminCustomer } from "@/services/admin/customer.service";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/customers");

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      // Convert dates from strings to Date objects
      const customersWithDates = data.customers.map(
        (customer: AdminCustomer) => ({
          ...customer,
          createdAt: new Date(customer.createdAt),
          updatedAt: new Date(customer.updatedAt),
          lastOrderDate: customer.lastOrderDate
            ? new Date(customer.lastOrderDate)
            : null,
        })
      );
      setCustomers(customersWithDates);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers");
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate quick stats
  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.totalOrders > 0).length,
    new: customers.filter((c) => {
      const daysSinceCreation =
        (Date.now() - c.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceCreation <= 30;
    }).length,
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="space-y-6 sm:space-y-8">
        {/* Header Section - Fully Responsive */}
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
              Customers
            </h1>
            <p className="text-xs text-gray-600 leading-relaxed sm:text-sm lg:text-base">
              View and manage customer accounts
            </p>
          </div>

          {/* Refresh Button */}
          {!loading && !error && (
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCustomers}
              disabled={loading}
              className="gap-2 self-start sm:self-auto shrink-0 border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                strokeWidth={2}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}
        </div>

        {/* Quick Stats Bar - Responsive Grid */}
        {!loading && !error && customers.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-between rounded-2xl border border-gray-300 bg-white px-4 py-3 sm:px-5 sm:py-4 shadow-lg min-w-0">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-600 sm:text-sm truncate uppercase tracking-wide">
                  Total Customers
                </p>
                <p className="mt-1 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  {stats.total}
                </p>
              </div>
              <div className="rounded-lg bg-linear-to-br from-emerald-100 to-teal-100 p-2 sm:p-3 shrink-0 ml-3">
                <Users
                  className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600"
                  strokeWidth={2}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-gray-300 bg-white px-4 py-3 sm:px-5 sm:py-4 shadow-lg min-w-0">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-600 sm:text-sm truncate uppercase tracking-wide">
                  Active Customers
                </p>
                <p className="mt-1 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  {stats.active}
                </p>
              </div>
              <div className="rounded-lg bg-linear-to-br from-emerald-100 to-teal-100 p-2 sm:p-3 shrink-0 ml-3">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-gray-300 bg-white px-4 py-3 sm:px-5 sm:py-4 shadow-lg min-w-0 sm:col-span-2 lg:col-span-1">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-600 sm:text-sm truncate uppercase tracking-wide">
                  New (30 days)
                </p>
                <p className="mt-1 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  {stats.new}
                </p>
              </div>
              <div className="rounded-lg bg-linear-to-br from-emerald-100 to-teal-100 p-2 sm:p-3 shrink-0 ml-3">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Error State - Professional */}
        {error ? (
          <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
            <div className="text-center space-y-4 max-w-md px-4 w-full">
              <div className="flex justify-center">
                <div className="rounded-full bg-linear-to-br from-red-100 to-orange-100 p-3 sm:p-4 border border-red-200">
                  <AlertTriangle
                    className="h-6 w-6 sm:h-8 sm:w-8 text-red-600"
                    strokeWidth={2}
                  />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-300">
                <p className="text-base font-semibold text-gray-900 sm:text-lg">
                  {error}
                </p>
                <p className="mt-2 text-xs text-gray-600 sm:text-sm">
                  Unable to load customers. Please check your connection and try
                  again.
                </p>
              </div>
              <Button
                onClick={fetchCustomers}
                variant="outline"
                className="mt-4 border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" strokeWidth={2} />
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          /* Customer Table - No Extra Wrapper Needed */
          <div className="rounded-2xl border border-gray-300 bg-white shadow-lg overflow-hidden">
            <CustomerTable
              customers={customers}
              loading={loading}
              onRefresh={fetchCustomers}
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && customers.length === 0 && (
          <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
            <div className="text-center space-y-4 max-w-md px-4 w-full">
              <div className="flex justify-center">
                <div className="rounded-full bg-linear-to-br from-emerald-100 to-teal-100 p-3 sm:p-4 border border-emerald-200">
                  <Users
                    className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600"
                    strokeWidth={2}
                  />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-300">
                <p className="text-base font-semibold text-gray-900 sm:text-lg">
                  No customers yet
                </p>
                <p className="mt-2 text-xs text-gray-600 sm:text-sm">
                  Customer accounts will appear here once they register or place
                  orders.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
