export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold tracking-tighter text-gray-900 sm:text-4xl lg:text-5xl flex items-center gap-3">
            <div className="h-1 w-8 bg-emerald-600 rounded-full" />
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Manage your store and customers
          </p>
        </div>

        {/* Layout - Navigation is now handled by AccountDashboardClient */}
        <div className="grid gap-6 lg:gap-8 ">{children}</div>
      </div>
    </div>
  );
}
