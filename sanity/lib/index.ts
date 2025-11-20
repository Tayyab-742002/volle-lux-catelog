/**
 * Sanity CMS Integration
 * Main export file for all Sanity-related utilities
 *
 * IMPORTANT: Do NOT export SanityLive or sanityFetch from this file
 * - They use defineLive which can only be used in Server Components
 * - Import them directly from "@/sanity/lib/live" in Server Components only
 * - This prevents client components from accidentally importing live.ts
 */

// Client and configuration
export { client } from "./client";
export { urlFor, imagePresets, getResponsiveImageUrls } from "./image";
// DO NOT export sanityFetch or SanityLive here - importing them evaluates live.ts
// which calls defineLive at module level and will break in client components
// Import sanityFetch directly from "@/sanity/lib/live" in Server Components
// (api.ts already does this correctly)

// API functions
export {
  getAllProducts,
  getFeaturedProducts,
  getNewArrivals,
  getProductBySlug,
  getProductsByCategory,
  getProductsByCategorySlug,
  getProductsByIds,
  searchProducts,
  getFilteredProducts,
  getAllCategories,
  getCategoriesWithFeaturedProducts,
  getCategoryBySlug,
  getProductCountByCategory,
  getAllBanners,
  getActiveAnnouncement,
  getHomepageData,
  testConnection,
  getProductSlugs,
  getCategorySlugs,
} from "./api";

// Helper functions
export {
  transformSanityProduct,
  transformSanityCategory,
  transformSanityBanner,
  transformSanityAnnouncement,
  getImageUrl,
  buildFilterString,
  buildOrderString,
  safeQuery,
} from "./helpers";

// Types
export type {
  SanityProduct,
  SanityCategory,
  SanityBanner,
  SanityAnnouncement,
} from "./helpers";
