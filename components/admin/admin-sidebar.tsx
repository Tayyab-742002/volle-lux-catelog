// admin-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BarChart3,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Content",
    href: "/studio",
    icon: Package,
    external: true,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile/Tablet Top Tabs (< 1024px) */}
      <div className="lg:hidden mb-6">
        <div className="rounded-xl border border-gray-300 bg-white shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <nav className="flex min-w-max">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" &&
                    pathname?.startsWith(`${item.href}/`));
                const Icon = item.icon;

                if (item.external) {
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2",
                        isActive
                          ? "border-emerald-600 bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-700"
                          : "border-transparent text-gray-600 hover:bg-emerald-200 hover:text-emerald-700"
                      )}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2} />
                      <span className="hidden sm:inline">{item.name}</span>
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2",
                      isActive
                        ? "border-emerald-600 bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-700"
                        : "border-transparent text-gray-600 hover:bg-emerald-200 hover:text-emerald-700"
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar Navigation (≥ 1024px) */}
      <aside className="hidden lg:block lg:col-span-1">
        <div className="sticky top-4 rounded-xl border border-gray-300 bg-white shadow-lg overflow-hidden">
          <nav className="divide-y divide-gray-400">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" &&
                  pathname?.startsWith(`${item.href}/`));
              const Icon = item.icon;

              if (item.external) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white"
                        : "text-gray-600 hover:bg-emerald-200 hover:text-emerald-700"
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                    {item.name}
                  </a>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 border-b border-gray-200 text-sm font-medium transition-all last:border-0",
                    isActive
                      ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white"
                      : "text-gray-600 hover:bg-emerald-200 hover:text-emerald-700"
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
