"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BarChart3,
  Package,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/services/admin/admin-server.service";
import type { AdminOrder } from "@/services/admin/order.service";
import type { AdminCustomer } from "@/services/admin/customer.service";
import type { AdminB2BRequest } from "@/types/b2b-request";

// Import tab content components
import { DashboardTab } from "./tabs/dashboard-tab";
import { OrdersTab } from "./tabs/orders-tab";
import { CustomersTab } from "./tabs/customers-tab";
import { AnalyticsTab } from "./tabs/analytics-tab";
import { B2BRequestsTab } from "./tabs/b2b-requests-tab";

interface AdminDashboardClientProps {
  initialStats: DashboardStats;
  initialOrders: AdminOrder[];
  initialCustomers: AdminCustomer[];
  initialB2BRequests: AdminB2BRequest[];
  pendingB2BRequestsCount: number;
}

type TabType = "dashboard" | "orders" | "customers" | "analytics" | "b2b-requests";

const tabs = [
  { id: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
  { id: "orders" as TabType, label: "Orders", icon: ShoppingBag },
  { id: "customers" as TabType, label: "Customers", icon: Users },
  { id: "b2b-requests" as TabType, label: "B2B Requests", icon: Briefcase },
  { id: "analytics" as TabType, label: "Analytics", icon: BarChart3 },
];

const externalLink = {
  label: "Content",
  href: "/studio",
  icon: Package,
};

export function AdminDashboardClient({
  initialStats,
  initialOrders,
  initialCustomers,
  initialB2BRequests,
  pendingB2BRequestsCount,
}: AdminDashboardClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get tab from URL or default to dashboard
  const urlTab = searchParams.get("tab") as TabType | null;
  const [activeTab, setActiveTab] = useState<TabType>(urlTab || "dashboard");

  // Handle tab change - instant, no navigation
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Update URL without navigation for deep linking
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/admin?${params.toString()}`, { scroll: false });
  };

  // Render active tab content
  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab stats={initialStats} orders={initialOrders} />;
      case "orders":
        return <OrdersTab orders={initialOrders} />;
      case "customers":
        return <CustomersTab customers={initialCustomers} />;
      case "b2b-requests":
        return <B2BRequestsTab requests={initialB2BRequests} />;
      case "analytics":
        return <AnalyticsTab orders={initialOrders} stats={initialStats} />;
      default:
        return <DashboardTab stats={initialStats} orders={initialOrders} />;
    }
  }, [activeTab, initialStats, initialOrders, initialCustomers, initialB2BRequests]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
      {/* Mobile/Tablet Top Tabs (< 1024px) */}
      <div className="lg:hidden mb-6">
        <div className="rounded-xl border border-gray-300 bg-white shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <nav className="flex min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const showBadge = tab.id === "b2b-requests" && pendingB2BRequestsCount > 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "relative flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2",
                      isActive
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                        : "border-transparent text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {pendingB2BRequestsCount > 9 ? "9+" : pendingB2BRequestsCount}
                      </span>
                    )}
                  </button>
                );
              })}
              {/* External Content Link */}
              <a
                href={externalLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 border-transparent text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <externalLink.icon className="h-4 w-4" strokeWidth={2} />
                <span className="hidden sm:inline">{externalLink.label}</span>
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar Navigation (≥ 1024px) */}
      <aside className="hidden lg:block lg:col-span-1">
        <div className="sticky top-4 rounded-xl border border-gray-300 bg-white shadow-lg overflow-hidden">
          <nav className="divide-y divide-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const showBadge = tab.id === "b2b-requests" && pendingB2BRequestsCount > 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "relative w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all last:border-0",
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                  {tab.label}
                  {showBadge && (
                    <span className={cn(
                      "ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                      isActive ? "bg-white text-red-500" : "bg-red-500 text-white"
                    )}>
                      {pendingB2BRequestsCount > 9 ? "9+" : pendingB2BRequestsCount}
                    </span>
                  )}
                </button>
              );
            })}
            {/* External Content Link */}
            <a
              href={externalLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <externalLink.icon className="h-5 w-5" strokeWidth={2} />
              {externalLink.label}
            </a>
          </nav>
        </div>
      </aside>

      {/* Content Area - Instant switching */}
      <div className="lg:col-span-3">{renderTabContent}</div>
    </div>
  );
}
