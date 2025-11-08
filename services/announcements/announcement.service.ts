// Import directly from API to avoid pulling in live.ts (which uses defineLive)
// This prevents client components from triggering server-only code
import { getActiveAnnouncement } from "@/sanity/lib/api";

/**
 * Announcement Service
 * Handles all announcement-related data fetching and operations
 * Integrated with Sanity CMS using GROQ queries
 */

export interface Announcement {
  id: string;
  message: string;
  link: string | null;
  linkText: string | null;
  dismissible: boolean;
}

/**
 * Fetch active announcement
 * Returns the most recent active announcement from Sanity CMS
 */
export async function getAnnouncement(): Promise<Announcement | null> {
  try {
    const announcement = await getActiveAnnouncement();
    return announcement;
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return null;
  }
}

