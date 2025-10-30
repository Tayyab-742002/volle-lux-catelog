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
        lastOrderDate: customerData.lastOrderDate ? new Date(customerData.lastOrderDate) : null,
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">
          Loading customer details...
        </p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-12 text-center">
        <p className="text-lg font-medium text-destructive">
          {error || "Customer not found"}
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/admin/customers">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
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
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Customers
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Customer Details</h1>
            <p className="mt-2 text-muted-foreground">
              {customer.email}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Info */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-6 text-xl font-semibold">Customer Information</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {customer.avatarUrl ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-full">
                    <Image
                      src={customer.avatarUrl}
                      alt={customer.fullName || customer.email}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Mail className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h4 className="text-2xl font-bold">
                    {customer.fullName || "No name provided"}
                  </h4>
                  <p className="text-muted-foreground">{customer.email}</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">{customer.email}</div>
                  </div>
                </div>

                {customer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="font-medium">{customer.phone}</div>
                    </div>
                  </div>
                )}

                {customer.company && (
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Company</div>
                      <div className="font-medium">{customer.company}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Joined</div>
                    <div className="font-medium">{formatDate(customer.createdAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Stats Summary */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-6 text-xl font-semibold">Summary</h3>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <ShoppingBag className="h-4 w-4" />
                  Total Orders
                </div>
                <div className="text-3xl font-bold">{customer.totalOrders}</div>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Total Spent
                </div>
                <div className="text-3xl font-bold">
                  {formatCurrency(customer.totalSpent)}
                </div>
              </div>

              {customer.lastOrderDate && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    Last Order
                  </div>
                  <div className="font-semibold">
                    {formatDate(customer.lastOrderDate)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-xl font-semibold">Quick Actions</h3>
            <div className="space-y-3">
              <Link href={`/admin/orders?search=${customer.email}`}>
                <Button variant="outline" className="w-full" size="lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  View Orders
                </Button>
              </Link>
              <Button variant="outline" className="w-full" size="lg">
                <Mail className="mr-2 h-5 w-5" />
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

