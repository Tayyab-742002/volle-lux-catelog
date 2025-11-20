import { Suspense } from "react";
import { getAnnouncement } from "@/services/announcements/announcement.service";
import { AnnouncementBanner } from "./announcement-banner";

// Server Component - can be async
async function AnnouncementContent() {
  const announcement = await getAnnouncement();

  if (!announcement) {
    return null;
  }

  return <AnnouncementBanner announcement={announcement} />;
}

// Server Component wrapper
export function AnnouncementBannerWrapper() {
  return (
    <Suspense fallback={null}>
      <AnnouncementContent />
    </Suspense>
  );
}



