"use client";

import { AdminSidebar } from "./admin-sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="bg-background min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Desktop Layout */}
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-4">
          {/* Desktop Sidebar - AdminSidebar handles its own positioning */}
          <AdminSidebar />

          {/* Content Area */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
