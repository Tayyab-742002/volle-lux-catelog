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
      const customersWithDates = data.customers.map((customer: any) => ({
        ...customer,
        createdAt: new Date(customer.createdAt),
        updatedAt: new Date(customer.updatedAt),
        lastOrderDate: customer.lastOrderDate
          ? new Date(customer.lastOrderDate)
          : null,
      }));
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
            <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl lg:text-4xl">
              Customers
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed sm:text-sm lg:text-base">
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
              className="gap-2 self-start sm:self-auto shrink-0"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}
        </div>

        {/* Quick Stats Bar - Responsive Grid */}
        {!loading && !error && customers.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-card px-4 py-3 sm:px-5 sm:py-4 shadow-sm min-w-0">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground sm:text-sm truncate">
                  Total Customers
                </p>
                <p className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                  {stats.total}
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2 sm:p-3 shrink-0 ml-3">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-card px-4 py-3 sm:px-5 sm:py-4 shadow-sm min-w-0">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground sm:text-sm truncate">
                  Active Customers
                </p>
                <p className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                  {stats.active}
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2 sm:p-3 shrink-0 ml-3">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-card px-4 py-3 sm:px-5 sm:py-4 shadow-sm min-w-0 sm:col-span-2 lg:col-span-1">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground sm:text-sm truncate">
                  New (30 days)
                </p>
                <p className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                  {stats.new}
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2 sm:p-3 shrink-0 ml-3">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
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
                <div className="rounded-full bg-neutral-100 dark:bg-neutral-900 p-3 sm:p-4">
                  <AlertTriangle
                    className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <div>
                <p className="text-base font-semibold text-foreground sm:text-lg">
                  {error}
                </p>
                <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                  Unable to load customers. Please check your connection and try
                  again.
                </p>
              </div>
              <Button
                onClick={fetchCustomers}
                variant="outline"
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          /* Customer Table - No Extra Wrapper Needed */
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-card shadow-sm overflow-hidden">
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
                <div className="rounded-full bg-neutral-100 dark:bg-neutral-900 p-3 sm:p-4">
                  <Users
                    className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <div>
                <p className="text-base font-semibold text-foreground sm:text-lg">
                  No customers yet
                </p>
                <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
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
