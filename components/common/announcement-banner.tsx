"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface AnnouncementBannerProps {
  announcement: {
    id: string;
    message: string;
    link: string | null;
    linkText: string | null;
    dismissible: boolean;
  };
}

export function AnnouncementBanner({ announcement }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if announcement was dismissed
    const dismissedId = localStorage.getItem("dismissedAnnouncementId");
    if (dismissedId === announcement.id) {
      setIsVisible(false);
    }
  }, [announcement.id]);

  const handleDismiss = () => {
    if (announcement.dismissible) {
      localStorage.setItem("dismissedAnnouncementId", announcement.id);
      setIsVisible(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative z-[60] w-full bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-3 sm:py-2.5">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {/* Message */}
          <p className="flex-1 text-center text-sm font-medium sm:text-base">
            {announcement.message}
            {announcement.link && announcement.linkText && (
              <Link
                href={announcement.link}
                className="ml-2 underline underline-offset-2 hover:opacity-80 transition-opacity font-semibold"
              >
                {announcement.linkText} →
              </Link>
            )}
          </p>

          {/* Dismiss Button */}
          {announcement.dismissible && (
            <button
              onClick={handleDismiss}
              className="shrink-0 rounded-md p-1.5 hover:bg-gray-800 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Dismiss announcement"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

