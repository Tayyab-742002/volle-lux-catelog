"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  ShoppingBag,
  DollarSign,
  Calendar,
  Package,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminCustomer } from "@/services/admin/customer.service";

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<AdminCustomer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/customers?id=${customerId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Customer not found");
        } else if (response.status === 403) {
          setError("You don't have permission to view this customer");
        } else {
          setError("Failed to load customer");
        }
        return;
      }

      const customerData = await response.json();
      // Convert dates from strings to Date objects
      const customerWithDates = {
        ...customerData,
        createdAt: new Date(customerData.createdAt),
        updatedAt: new Date(customerData.updatedAt),
        lastOrderDate: customerData.lastOrderDate
          ? new Date(customerData.lastOrderDate)
          : null,
      };
      setCustomer(customerWithDates);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customer");
      console.error("Error fetching customer:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-300 bg-white p-12 text-center shadow-lg">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent" />
        <p className="mt-4 text-sm text-gray-600">
          Loading customer details...
        </p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="rounded-2xl border border-red-300 bg-linear-to-br from-red-50 to-orange-50 p-12 text-center shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-linear-to-br from-red-100 to-orange-100 p-4 border border-red-200">
            <User className="h-8 w-8 text-red-600" strokeWidth={2} />
          </div>
        </div>
        <p className="text-lg font-medium text-red-700">
          {error || "Customer not found"}
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/admin/customers">
            <Button
              variant="outline"
              className="border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={2} />
              Back to Customers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin/customers">
            <Button
              variant="ghost"
              size="sm"
              className="mb-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={2} />
              Back to Customers
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
              Customer Details
            </h1>
            <p className="mt-2 text-gray-600">{customer.email}</p>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Info */}
          <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-lg">
            <h3 className="mb-6 text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
              Customer Information
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {customer.avatarUrl ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border border-gray-300">
                    <Image
                      src={customer.avatarUrl}
                      alt={customer.fullName || customer.email}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-emerald-100 to-teal-100 border border-emerald-200">
                    <Mail
                      className="h-8 w-8 text-emerald-600"
                      strokeWidth={2}
                    />
                  </div>
                )}
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">
                    {customer.fullName || "No name provided"}
                  </h4>
                  <p className="text-gray-600">{customer.email}</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-emerald-600" strokeWidth={2} />
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium text-gray-900">
                      {customer.email}
                    </div>
                  </div>
                </div>

                {customer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone
                      className="h-5 w-5 text-emerald-600"
                      strokeWidth={2}
                    />
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium text-gray-900">
                        {customer.phone}
                      </div>
                    </div>
                  </div>
                )}

                {customer.company && (
                  <div className="flex items-center gap-3">
                    <Building
                      className="h-5 w-5 text-emerald-600"
                      strokeWidth={2}
                    />
                    <div>
                      <div className="text-sm text-gray-600">Company</div>
                      <div className="font-medium text-gray-900">
                        {customer.company}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar
                    className="h-5 w-5 text-emerald-600"
                    strokeWidth={2}
                  />
                  <div>
                    <div className="text-sm text-gray-600">Joined</div>
                    <div className="font-medium text-gray-900">
                      {formatDate(customer.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Stats Summary */}
          <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-lg">
            <h3 className="mb-6 text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
              Summary
            </h3>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                  <ShoppingBag className="h-4 w-4" strokeWidth={2} />
                  Total Orders
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {customer.totalOrders}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4" strokeWidth={2} />
                  Total Spent
                </div>
                <div className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {formatCurrency(customer.totalSpent)}
                </div>
              </div>

              {customer.lastOrderDate && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" strokeWidth={2} />
                    Last Order
                  </div>
                  <div className="font-semibold text-gray-900">
                    {formatDate(customer.lastOrderDate)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link href={`/admin/orders?search=${customer.email}`}>
                <Button
                  variant="outline"
                  className="w-full border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                  size="lg"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" strokeWidth={2} />
                  View Orders
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                size="lg"
              >
                <Mail className="mr-2 h-5 w-5" strokeWidth={2} />
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
