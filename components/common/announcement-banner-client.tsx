"use client";

import { useEffect, useState } from "react";
import { AnnouncementBanner } from "./announcement-banner";

interface Announcement {
  id: string;
  message: string;
  link: string | null;
  linkText: string | null;
  dismissible: boolean;
}

/**
 * Client Component wrapper for announcement banner
 * Fetches announcement data on the client side via API route
 */
export function AnnouncementBannerClient() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch announcement from API route
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (data.announcement) {
          setAnnouncement(data.announcement);
        }
      })
      .catch((error) => {
        console.error("Error fetching announcement:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading || !announcement) {
    return null;
  }

  return <AnnouncementBanner announcement={announcement} />;
}
