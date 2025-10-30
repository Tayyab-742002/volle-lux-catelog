"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
  Search,
  ArrowUpDown,
  Eye,
  Users,
} from "lucide-react";
import type { AdminCustomer } from "@/services/admin/customer.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CustomerTableProps {
  customers: AdminCustomer[];
  loading?: boolean;
  onRefresh?: () => void;
}

export function CustomerTable({
  customers,
  loading,
  onRefresh,
}: CustomerTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter and sort customers
  const filteredCustomers = customers
    .filter((customer) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          customer.email.toLowerCase().includes(searchLower) ||
          customer.fullName?.toLowerCase().includes(searchLower) ||
          customer.phone?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "created_at":
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case "email":
          comparison = a.email.localeCompare(b.email);
          break;
        case "total_spent":
          comparison = a.totalSpent - b.totalSpent;
          break;
        default:
          return 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  if (loading) {
    return <CustomerTableSkeleton />;
  }

  if (customers.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 sm:py-16">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-neutral-100  p-4">
              <Users
                className="h-8 w-8 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              No customers found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Customers will appear here once they register accounts
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Search Bar - Fully Responsive */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
      </div>

      {/* Mobile Card View (< 768px) */}
      <div className="md:hidden">
        {filteredCustomers.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No customers match your search
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 ">
            {filteredCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        )}
      </div>

      {/* Desktop Table (≥ 768px) */}
      <div className="hidden md:block px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-neutral-200 ">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => {
                      if (sortBy === "email") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("email");
                        setSortOrder("asc");
                      }
                    }}
                  >
                    Customer
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Orders
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => {
                      if (sortBy === "total_spent") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("total_spent");
                        setSortOrder("desc");
                      }
                    }}
                  >
                    Total Spent
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => {
                      if (sortBy === "created_at") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("created_at");
                        setSortOrder("desc");
                      }
                    }}
                  >
                    Joined
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 ">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      No customers match your search
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <CustomerRow key={customer.id} customer={customer} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 sm:px-6 pb-4 text-sm text-muted-foreground">
        Showing {filteredCustomers.length} of {customers.length} customers
      </div>
    </div>
  );
}

// Mobile Card Component
function CustomerCard({ customer }: { customer: AdminCustomer }) {
  return (
    <div className="p-4 hover:bg-neutral-50  transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {customer.avatarUrl ? (
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <img
                src={customer.avatarUrl}
                alt={customer.fullName || customer.email}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">
              {customer.fullName || "No name"}
            </h3>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {customer.email}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 shrink-0 ml-2"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/customers/${customer.id}`}
                className="flex items-center"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-1.5">
            <ShoppingBag className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Orders</p>
            <p className="text-sm font-semibold">{customer.totalOrders}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-1.5">
            <DollarSign className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Spent</p>
            <p className="text-sm font-semibold truncate">
              ${customer.totalSpent?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>
      </div>

      {customer.phone && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <Phone className="h-3 w-3 shrink-0" />
          <span className="truncate">{customer.phone}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 pt-3 border-t border-neutral-200  text-xs text-muted-foreground">
        <Calendar className="h-3 w-3 shrink-0" />
        <span>Joined {formatDate(customer.createdAt)}</span>
      </div>
    </div>
  );
}

// Desktop Table Row Component
function CustomerRow({ customer }: { customer: AdminCustomer }) {
  return (
    <tr className="hover:bg-neutral-50  transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3 min-w-0">
          {customer.avatarUrl ? (
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <img
                src={customer.avatarUrl}
                alt={customer.fullName || customer.email}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">
              {customer.fullName || "No name"}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {customer.email}
            </p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="min-w-0">
          {customer.phone && (
            <p className="text-sm truncate">{customer.phone}</p>
          )}
          {customer.company && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {customer.company}
            </p>
          )}
          {!customer.phone && !customer.company && (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm font-medium">{customer.totalOrders}</p>
        {customer.lastOrderDate && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Last: {formatDate(customer.lastOrderDate)}
          </p>
        )}
      </td>
      <td className="py-3 px-4">
        <p className="text-sm font-medium">
          ${customer.totalSpent?.toFixed(2) || "0.00"}
        </p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-muted-foreground">
          {formatDate(customer.createdAt)}
        </p>
      </td>
      <td className="py-3 px-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/customers/${customer.id}`}
                className="flex items-center"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

// Loading Skeleton
function CustomerTableSkeleton() {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Search Skeleton */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="h-10 w-full bg-neutral-400  rounded-lg animate-pulse" />
      </div>

      {/* Mobile Skeleton */}
      <div className="md:hidden divide-y divide-neutral-400 ">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-neutral-400  rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-neutral-400  rounded animate-pulse" />
                <div className="h-3 w-48 bg-neutral-400  rounded animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-12 bg-neutral-400  rounded animate-pulse" />
              <div className="h-12 bg-neutral-400  rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden md:block px-4 sm:px-6 pb-4 sm:pb-6">
        <table className="w-full">
          <thead className="border-b border-neutral-400 ">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">
                Customer
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">
                Contact
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">
                Orders
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">
                Total Spent
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">
                Joined
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-400 ">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-neutral-400  rounded-full animate-pulse" />
                    <div className="h-4 w-32 bg-neutral-400  rounded animate-pulse" />
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-24 bg-neutral-400  rounded animate-pulse" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-8 bg-neutral-400  rounded animate-pulse" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-16 bg-neutral-400  rounded animate-pulse" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-24 bg-neutral-400  rounded animate-pulse" />
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="h-8 w-8 bg-neutral-400  rounded animate-pulse ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper function
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
