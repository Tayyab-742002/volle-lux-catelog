"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles } from "lucide-react";

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
    <div className="relative z-60 w-full bg-gray-900 border-b-2 border-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-lg">
      {/* Vibrant gradient border effect */}
      <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 pointer-events-none"></div>

      {/* Animated shimmer effect */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none"></div>

      <div className="relative container mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {/* Message with vibrant accent */}
          <p className="flex-1 text-center text-sm font-medium sm:text-base text-gray-100">
            <span className="text-white font-semibold">
              {announcement.message}
            </span>
            {announcement.link && announcement.linkText && (
              <Link
                href={announcement.link}
                className="ml-2 inline-flex items-center gap-1.5 font-bold bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent hover:from-emerald-300 hover:to-teal-300 transition-all duration-200 group"
              >
                <span className="underline decoration-2 underline-offset-2 decoration-emerald-400/50 group-hover:decoration-emerald-400">
                  {announcement.linkText}
                </span>
                <span className="inline-block text-emerald-400 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            )}
          </p>

          {/* Dismiss Button with vibrant hover */}
          {announcement.dismissible && (
            <button
              onClick={handleDismiss}
              className="shrink-0 rounded-lg p-1.5 hover:bg-emerald-500/20 active:bg-emerald-500/30 border border-transparent hover:border-emerald-500/30 transition-all duration-200 touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center group"
              aria-label="Dismiss announcement"
            >
              <X
                className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 group-hover:text-emerald-400 group-hover:scale-110 transition-all"
                strokeWidth={2.5}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
