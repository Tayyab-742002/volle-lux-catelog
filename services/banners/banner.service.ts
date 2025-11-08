import { getAllBanners } from "@/sanity/lib";

/**
 * Banner Service
 * Handles all banner-related data fetching and operations
 * Integrated with Sanity CMS using GROQ queries
 */

export interface Banner {
  id: string;
  title: string;
  description: string;
  index: number;
  image: string;
  alt: string;
}

/**
 * Fetch all active banners
 * Returns all active banners from Sanity CMS, ordered by index
 */
export async function getBanners(): Promise<Banner[]> {
  try {
    const banners = await getAllBanners();
    return banners || [];
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
}

