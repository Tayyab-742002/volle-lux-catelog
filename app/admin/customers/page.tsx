"use client";

import { useState, useEffect } from "react";
import { CustomerTable } from "@/components/admin/customer-table";
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
        lastOrderDate: customer.lastOrderDate ? new Date(customer.lastOrderDate) : null,
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage customer accounts
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-12 text-center">
          <p className="text-lg font-medium text-destructive">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please try refreshing the page
          </p>
        </div>
      ) : (
        <CustomerTable customers={customers} loading={loading} onRefresh={fetchCustomers} />
      )}
    </div>
  );
}

