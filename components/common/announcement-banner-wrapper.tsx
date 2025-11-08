import { Suspense } from "react";
import { getAnnouncement } from "@/services/announcements/announcement.service";
import { AnnouncementBanner } from "./announcement-banner";

async function AnnouncementContent() {
  const announcement = await getAnnouncement();

  if (!announcement) {
    return null;
  }

  return <AnnouncementBanner announcement={announcement} />;
}

export function AnnouncementBannerWrapper() {
  return (
    <Suspense fallback={null}>
      <AnnouncementContent />
    </Suspense>
  );
}

