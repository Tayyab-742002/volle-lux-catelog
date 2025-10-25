"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Settings,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/account",
    icon: LayoutDashboard,
  },
  {
    name: "Order History",
    href: "/account/orders",
    icon: ShoppingBag,
  },
  {
    name: "Saved Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    name: "Account Settings",
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
    <div className="bg-background">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm">
          <a href="/" className="text-muted-foreground hover:text-foreground">
            Home
          </a>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">Account</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold md:text-5xl">My Account</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your orders, addresses, and account settings
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" strokeWidth={1.5} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
