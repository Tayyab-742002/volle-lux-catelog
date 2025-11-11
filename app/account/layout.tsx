// app/account/layout.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50">
      <div className="relative z-10">
        {/* Breadcrumbs */}
        <div className="border-b border-gray-200 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link
                href="/"
                className="text-gray-600 hover:text-emerald-700 transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" strokeWidth={2} />
              <span className="text-gray-900 font-medium">Account</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl font-bold tracking-tighter text-gray-900 sm:text-4xl lg:text-5xl flex items-center gap-3">
              <div className="h-1 w-8 bg-emerald-600 rounded-full" />
              My Account
            </h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Manage your orders, addresses, and account settings
            </p>
          </div>

          {/* Layout - Navigation is now handled by AccountDashboardClient */}
          <div className="grid gap-6 lg:gap-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
