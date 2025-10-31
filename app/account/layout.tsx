// app/account/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/account",
    icon: LayoutDashboard,
  },
  {
    name: "Orders",
    href: "/account/orders",
    icon: ShoppingBag,
  },
  {
    name: "Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    name: "Settings",
    href: "/account/settings",
    icon: Settings,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-200 ">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">Account</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl">
            My Account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Manage your orders, addresses, and account settings
          </p>
        </div>

        {/* Mobile/Tablet Top Tabs (< 1024px) */}
        <div className="lg:hidden mb-6">
          <div className="rounded-xl border border-neutral-200  bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <nav className="flex min-w-max">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2",
                        isActive
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-transparent text-muted-foreground hover:bg-neutral-50  hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                      <span className="hidden sm:inline">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-4">
          {/* Desktop Sidebar Navigation (≥ 1024px) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4 rounded-xl border border-neutral-200  bg-card shadow-sm overflow-hidden">
              <nav className="divide-y divide-neutral-200 ">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-neutral-50  hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
