"use client";

import { useState, useEffect } from "react";
import { StatsCard, StatsCardSkeleton } from "@/components/admin";
import { ShoppingBag, Package, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  todayRevenue: number;
  averageOrderValue: number;
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
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Overview of your store performance
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Overview of your store performance
          </p>
        </div>
        <div className="rounded-xl border border-destructive bg-destructive/10 p-12 text-center">
          <p className="text-lg font-medium text-destructive">{error}</p>
          <Button onClick={fetchStats} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Orders"
          value={stats.total}
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <StatsCard
          title="Pending Orders"
          value={stats.pending}
          icon={<Package className="h-5 w-5" />}
        />
        <StatsCard
          title="Today's Revenue"
          value={`$${stats.todayRevenue.toFixed(2)}`}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatsCard
          title="Average Order Value"
          value={`$${stats.averageOrderValue.toFixed(2)}`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/orders?status=pending">
          <div className="rounded-lg border bg-card p-6 transition-colors hover:border-primary/30 hover:bg-muted/50">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900/30">
                <Package className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Pending Orders
                </div>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-xs text-muted-foreground">
                  Requires attention
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/admin/orders?status=processing">
          <div className="rounded-lg border bg-card p-6 transition-colors hover:border-primary/30 hover:bg-muted/50">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Processing
                </div>
                <div className="text-2xl font-bold">{stats.processing}</div>
                <div className="text-xs text-muted-foreground">In progress</div>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/admin/orders">
          <div className="rounded-lg border bg-card p-6 transition-colors hover:border-primary/30 hover:bg-muted/50">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  View All Orders
                </div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-muted-foreground">
                  Total orders
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Additional Stats Summary */}
      <div className="mt-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-card p-6 shadow-sm">
        <h3 className="mb-6 text-xl font-semibold tracking-tight">
          Order Status Summary
        </h3>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {stats.delivered}
            </div>
            <div className="text-sm text-muted-foreground">Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.shipped}
            </div>
            <div className="text-sm text-muted-foreground">Shipped</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {stats.processing}
            </div>
            <div className="text-sm text-muted-foreground">Processing</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {stats.cancelled}
            </div>
            <div className="text-sm text-muted-foreground">Cancelled</div>
          </div>
        </div>
      </div>
    </div>
  );
}
