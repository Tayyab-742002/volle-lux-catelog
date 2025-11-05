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
    <div className="bg-background min-h-screen">
      {/* Breadcrumbs */}
      <AccountBreadcrumbs />

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

        {/* Desktop Layout */}
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-4">
          {/* Desktop Sidebar - AccountNavigation handles its own positioning */}
          <AccountNavigation />

          {/* Content Area */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
