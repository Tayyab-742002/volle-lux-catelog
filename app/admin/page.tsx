"use client";

import { useState, useEffect } from "react";
import { StatsCard, StatsCardSkeleton } from "@/components/admin";
import {
  ShoppingBag,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  todayRevenue: number;
  averageOrderValue: number;
  totalCustomers?: number; // New metric
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/stats");

      if (!response.ok) {
        throw new Error("Failed to fetch statistics");
      }

      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load statistics"
      );
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        {/* Header */}
        <div className="mb-6 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
            Dashboard
          </h1>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
            Overview of your store performance
          </p>
        </div>

        {/* Hero Metrics Skeleton */}
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8 md:mb-10">
          {[1, 2, 3, 4].map((i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>

        {/* Order Hub Skeleton */}
        <div className="rounded-xl border border-neutral-200  bg-card p-4 md:p-8 shadow-sm">
          <div className="h-6 w-48 bg-neutral-200  rounded animate-pulse mb-6 md:mb-8" />
          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-10 w-10 bg-neutral-200  rounded-lg animate-pulse" />
                <div className="h-8 w-16 bg-neutral-200  rounded animate-pulse" />
                <div className="h-4 w-20 bg-neutral-200  rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {/* Header - Always visible */}
        <div className="mb-6 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
            Dashboard
          </h1>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
            Overview of your store performance
          </p>
        </div>

        {/* Professional Error State */}
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-neutral-200  p-4">
                <AlertTriangle
                  className="h-8 w-8 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">
                Failed to load statistics
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Please try again or contact support if the issue persists
              </p>
            </div>
            <Button onClick={fetchStats} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tighter">Dashboard</h1>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          Overview of your store performance
        </p>
      </div>

      {/* Row 1: Hero Metrics */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatsCard
          title="Today's Revenue"
          value={`$${stats.todayRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Orders"
          value={stats.total.toLocaleString()}
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <StatsCard
          title="Average Order Value"
          value={`$${stats.averageOrderValue.toFixed(2)}`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers?.toLocaleString() || "—"}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Row 2: Order Status Overview (The "Order Hub") */}
      <div className="rounded-xl border border-neutral-200 bg-card p-8 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight mb-8">
          Order Status Overview
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <OrderStatusItem
            href="/admin/orders?status=pending"
            icon={<Package className="h-5 w-5" />}
            value={stats.pending}
            label="Pending"
          />
          <OrderStatusItem
            href="/admin/orders?status=processing"
            icon={<Package className="h-5 w-5" />}
            value={stats.processing}
            label="Processing"
          />
          <OrderStatusItem
            href="/admin/orders?status=shipped"
            icon={<Package className="h-5 w-5" />}
            value={stats.shipped}
            label="Shipped"
          />
          <OrderStatusItem
            href="/admin/orders?status=delivered"
            icon={<Package className="h-5 w-5" />}
            value={stats.delivered}
            label="Delivered"
          />
          <OrderStatusItem
            href="/admin/orders?status=cancelled"
            icon={<Package className="h-5 w-5" />}
            value={stats.cancelled}
            label="Cancelled"
          />
        </div>
      </div>
    </div>
  );
}

// New Component: Order Status Item
interface OrderStatusItemProps {
  href: string;
  icon: React.ReactNode;
  value: number;
  label: string;
}

function OrderStatusItem({ href, icon, value, label }: OrderStatusItemProps) {
  return (
    <Link href={href}>
      <div className="group space-y-3 transition-all border border-neutral-300 rounded-lg p-4 duration-200 hover:scale-[1.02]">
        {/* Icon Container - Unified Brand Style */}
        <div className="inline-flex items-center justify-center border border-neutral-300 w-10 h-10 rounded-lg bg-primary/20 text-primary transition-all duration-200 group-hover:bg-primary/20 group-hover:shadow-md">
          {icon}
        </div>

        {/* Value */}
        <div className="text-3xl font-bold tracking-tight transition-colors duration-200 group-hover:text-primary">
          {value.toLocaleString()}
        </div>

        {/* Label */}
        <div className="text-sm font-medium text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
          {label}
        </div>
      </div>
    </Link>
  );
}
