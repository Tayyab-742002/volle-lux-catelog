/**
 * Sanity CMS Integration
 * Main export file for all Sanity-related utilities
 */

// Client and configuration
export { client } from "./client";
export {
  urlFor,
  urlForImage,
  imagePresets,
  getResponsiveImageUrls,
} from "./image";
export { sanityFetch, SanityLive } from "./live";

// API functions
export {
  getAllProducts,
  getFeaturedProducts,
  getNewArrivals,
  getProductBySlug,
  getProductsByCategory,
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

// Test function
export { runTests } from "./test";

