"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Settings as SettingsIcon,
} from "lucide-react";
import type { Order } from "@/types/cart";
import type { SavedAddress } from "@/services/users/user.service";
import { cn } from "@/lib/utils";

// Import tab content components
import { DashboardTab } from "./tabs/dashboard-tab";
import { OrdersTab } from "./tabs/orders-tab";
import { AddressesTab } from "./tabs/addresses-tab";
import { SettingsTab } from "./tabs/settings-tab";

interface AccountDashboardClientProps {
  userId: string;
  initialOrders: Order[];
  initialAddresses: SavedAddress[];
}

type TabType = "dashboard" | "orders" | "addresses" | "settings";

const tabs = [
  { id: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
  { id: "orders" as TabType, label: "Orders", icon: ShoppingBag },
  { id: "addresses" as TabType, label: "Addresses", icon: MapPin },
  { id: "settings" as TabType, label: "Settings", icon: SettingsIcon },
];

export function AccountDashboardClient({
  userId,
  initialOrders,
  initialAddresses,
}: AccountDashboardClientProps) {
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
    router.replace(`/account?${params.toString()}`, { scroll: false });
  };

  // Render active tab content
  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab userId={userId} orders={initialOrders} />;
      case "orders":
        return <OrdersTab orders={initialOrders} />;
      case "addresses":
        return (
          <AddressesTab userId={userId} initialAddresses={initialAddresses} />
        );
      case "settings":
        return <SettingsTab userId={userId} />;
      default:
        return <DashboardTab userId={userId} orders={initialOrders} />;
    }
  }, [activeTab, userId, initialOrders, initialAddresses]);

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
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2",
                      isActive
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                        : "border-transparent text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-700"
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar Navigation (≥ 1024px) */}
      <aside className="hidden lg:block ">
        <div className="sticky top-4 rounded-xl border border-gray-300 bg-white shadow-lg overflow-hidden">
          <nav className="divide-y divide-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all last:border-0",
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Content Area - Instant switching */}
      <div className="lg:col-span-3">{renderTabContent}</div>
    </div>
  );
}
