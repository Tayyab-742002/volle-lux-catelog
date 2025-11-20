"use client";

/**
 * Client component wrapper that conditionally renders website header/footer
 * Excludes these components for /studio routes to keep CMS isolated
 *
 * NOTE: SanityLiveWrapper is NOT included here because it's a Server Component
 * and must be rendered in the root layout (app/layout.tsx) instead
 */

import { usePathname } from "next/navigation";
import { Header, Footer } from "@/components/common";
import { AnnouncementBannerClient } from "@/components/common/announcement-banner-client";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import type { Category } from "@/types/category";

interface WebsiteLayoutWrapperProps {
  children: React.ReactNode;
  categories: Category[];
}

export function WebsiteLayoutWrapper({
  children,
  categories,
}: WebsiteLayoutWrapperProps) {
  const pathname = usePathname();
  const isStudioRoute = pathname?.startsWith("/studio");

  // Don't render website components for studio routes
  if (isStudioRoute) {
    return <>{children}</>;
  }

  // Render full website layout for all other routes
  return (
    <>
      {/* Announcement Banner - Above Header */}
      <AnnouncementBannerClient />
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton
        phoneNumber="+447882851632"
        message="Hi! I'm interested in your packaging products."
        position="left"
      />
    </>
  );
}
