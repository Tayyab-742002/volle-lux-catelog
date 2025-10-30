// admin-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
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
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Navigation (< 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 shadow-lg">
        <ul className="flex items-center justify-around px-2 py-2">
          {navigation.slice(0, 5).map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname?.startsWith(`${item.href}/`));
            const Icon = item.icon;

            if (item.external) {
              return (
                <li key={item.name} className="flex-1">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200",
                      isActive
                        ? "text-neutral-900 dark:text-white"
                        : "text-neutral-500 dark:text-neutral-400"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg p-2 transition-all duration-200",
                        isActive
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-lg scale-110"
                          : "bg-transparent"
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-medium">{item.name}</span>
                  </a>
                </li>
              );
            }

            return (
              <li key={item.name} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200",
                    isActive
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-500 dark:text-neutral-400"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg p-2 transition-all duration-200",
                      isActive
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-lg scale-110"
                        : "bg-transparent"
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Tablet Top Tabs (768px - 1023px) */}
      <nav className="hidden md:block lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="overflow-x-auto">
          <ul className="flex items-center gap-1 px-4 py-3 min-w-max">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" &&
                  pathname?.startsWith(`${item.href}/`));
              const Icon = item.icon;

              if (item.external) {
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap",
                        isActive
                          ? "bg-neutral-900 text-white shadow-lg dark:bg-white dark:text-neutral-900"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
                      )}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                      {item.name}
                    </a>
                  </li>
                );
              }

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap",
                      isActive
                        ? "bg-neutral-900 text-white shadow-lg dark:bg-white dark:text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
            <li className="ml-2 pl-2 border-l border-neutral-200 dark:border-neutral-800">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-all duration-200 whitespace-nowrap"
              >
                <svg
                  className="h-4 w-4"
                  strokeWidth={1.5}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Store
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Desktop Sidebar (≥ 1024px) */}
      <aside className="hidden lg:block sticky top-0 h-screen w-64 border-r border-neutral-200/50 bg-white/95 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950">
        <nav className="flex h-full flex-col overflow-y-auto p-6">
          {/* Logo/Brand Section */}
          <div className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Admin Panel
            </h2>
          </div>

          {/* Navigation Items */}
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" &&
                  pathname?.startsWith(`${item.href}/`));
              const Icon = item.icon;

              if (item.external) {
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-neutral-900 text-white shadow-lg dark:bg-white dark:text-neutral-900"
                          : "text-muted-foreground hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800"
                      )}
                    >
                      <Icon
                        className="h-4 w-4 transition-transform group-hover:scale-110"
                        strokeWidth={1.5}
                      />
                      {item.name}
                    </a>
                  </li>
                );
              }

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-neutral-900 text-white shadow-lg dark:bg-white dark:text-neutral-900"
                        : "text-muted-foreground hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800"
                    )}
                  >
                    <Icon
                      className="h-4 w-4 transition-transform group-hover:scale-110"
                      strokeWidth={1.5}
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Back to Store Link */}
          <div className="mt-auto pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800"
            >
              <svg
                className="h-4 w-4"
                strokeWidth={1.5}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Store
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
