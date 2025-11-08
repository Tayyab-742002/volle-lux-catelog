// app/account/layout.tsx
import {
  AccountNavigation,
  AccountBreadcrumbs,
} from "@/components/account/account-navigation";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50">
      <div className="relative z-10">
        {/* Breadcrumbs */}
        <AccountBreadcrumbs />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl font-bold tracking-tighter text-gray-900 sm:text-4xl lg:text-5xl flex items-center gap-3">
              <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
              My Account
            </h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Manage your orders, addresses, and account settings
            </p>
          </div>

          {/* Desktop Layout */}
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-4">
            {/* Desktop Sidebar - AccountNavigation handles its own positioning */}
            <AccountNavigation />

            {/* Content Area */}
            <div className="lg:col-span-3">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
