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
  LayoutDashboard,
  Leaf,
} from "lucide-react";
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
  totalCustomers?: number;
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
      <div className="min-h-screen  p-6 md:p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Header Skeleton */}
          <div className="mb-10">
            <div className="h-10 w-64 bg-emerald-300 rounded-lg animate-pulse mb-4" />
            <div className="h-6 w-96 bg-emerald-300 rounded animate-pulse" />
          </div>

          {/* Hero Metrics Skeleton */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>

          {/* Order Hub Skeleton */}
          <div className="rounded-2xl border border-gray-300 bg-white p-8 shadow-2xl">
            <div className="h-8 w-64 bg-emerald-400 rounded-lg animate-pulse mb-8" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-12 w-12 bg-emerald-300 rounded-xl animate-pulse mb-4" />
                  <div className="h-8 w-20 bg-emerald-300 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-emerald-300 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 p-6 md:p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                <LayoutDashboard
                  className="h-6 w-6 text-white"
                  strokeWidth={2}
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  Overview of your store performance
                </p>
              </div>
            </div>
          </div>

          {/* Error State */}
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-linear-to-br from-red-100 to-orange-100 flex items-center justify-center border-4 border-red-200">
                  <AlertTriangle
                    className="h-10 w-10 text-red-600"
                    strokeWidth={2}
                  />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
                <p className="text-xl font-bold text-gray-900">
                  Failed to load statistics
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Please try again or contact support if the issue persists
                </p>
              </div>
              <Button
                onClick={fetchStats}
                className="bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="min-h-screen  p-6 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                <LayoutDashboard
                  className="h-6 w-6 text-white"
                  strokeWidth={2}
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  Overview of your store performance
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-100 to-teal-100 rounded-lg border border-emerald-200">
              <Leaf className="h-4 w-4 text-emerald-600" strokeWidth={2} />
              <span className="text-sm font-semibold text-emerald-800">
                Eco Store
              </span>
            </div>
          </div>
        </div>

        {/* Row 1: Hero Metrics */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <StatsCard
            title="Today's Revenue"
            value={`$${stats.todayRevenue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            icon={<DollarSign className="h-5 w-5" />}
            color="primary"
          />
          <StatsCard
            title="Total Orders"
            value={stats.total.toLocaleString()}
            icon={<ShoppingBag className="h-5 w-5" />}
            color="secondary"
          />
          <StatsCard
            title="Average Order Value"
            value={`$${stats.averageOrderValue.toFixed(2)}`}
            icon={<TrendingUp className="h-5 w-5" />}
            color="tertiary"
          />
          <StatsCard
            title="Total Customers"
            value={stats.totalCustomers?.toLocaleString() || "—"}
            icon={<Users className="h-5 w-5" />}
            color="quaternary"
          />
        </div>

        {/* Row 2: Order Status Overview */}
        <div className="rounded-2xl border border-gray-300 bg-white p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-lg bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              <Package className="h-5 w-5 text-emerald-600" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
              Order Status Overview
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <OrderStatusItem
              href="/admin/orders?status=pending"
              value={stats.pending}
              label="Pending"
              color="bg-linear-to-r from-teal-200 to-teal-200"
              iconColor="text-teal-600"
            />
            <OrderStatusItem
              href="/admin/orders?status=processing"
              value={stats.processing}
              label="Processing"
              color="from-teal-400 to-teal-400"
              iconColor="text-teal-600"
            />
            <OrderStatusItem
              href="/admin/orders?status=shipped"
              value={stats.shipped}
              label="Shipped"
              color="from-emerald-200 to-emerald-200"
              iconColor="text-emerald-600"
            />
            <OrderStatusItem
              href="/admin/orders?status=delivered"
              value={stats.delivered}
              label="Delivered"
              color="from-emerald-400 to-emerald-400"
              iconColor="text-emerald-600"
            />
            <OrderStatusItem
              href="/admin/orders?status=cancelled"
              value={stats.cancelled}
              label="Cancelled"
              color="from-red-400 to-red-400"
              iconColor="text-red-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Order Status Item Component
interface OrderStatusItemProps {
  href: string;
  value: number;
  label: string;
  color: string;
  iconColor: string;
}

function OrderStatusItem({
  href,
  value,
  label,
  color,
  iconColor,
}: OrderStatusItemProps) {
  return (
    <Link href={href}>
      <div
        className={`group rounded-xl border border-gray-300 bg-linear-to-br ${color} p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-emerald-300 bg-white`}
      >
        <div
          className={`h-10 w-10 rounded-lg bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4`}
        >
          <Package className={`h-5 w-5 ${iconColor}`} strokeWidth={2} />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {value.toLocaleString()}
        </div>
        <div className="text-sm font-medium text-gray-700">{label}</div>
      </div>
    </Link>
  );
}
