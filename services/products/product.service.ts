import { Product } from "@/types/product";
import {
  getAllProducts,
  getProductsByCategory as getSanityProductsByCategory,
  getFilteredProducts as getSanityFilteredProducts,
  searchProducts as searchSanityProducts,
  getProductBySlug as getSanityProductBySlug,
  getProductsByIds as getSanityProductsByIds,
  getFeaturedProducts,
  getNewArrivals,
} from "@/sanity/lib";

/**
 * Product Service
 * Handles all product-related data fetching and operations
 * Integrated with Sanity CMS using GROQ queries
 * Reference: Architecture.md Section 4.2
 */

/**
 * Fetch all products
 * Returns all active products from Sanity CMS
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const products = await getAllProducts();
    return products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Fetch products by category
 * Returns products filtered by category slug
 */
export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  try {
    const products = await getSanityProductsByCategory(categorySlug);
    return products || [];
  } catch (error) {
    console.error(
      `Error fetching products for category ${categorySlug}:`,
      error
    );
    return [];
  }
}

/**
 * Fetch products with filters
 * Returns products filtered by size, material, color, eco-friendly options
 */
export async function getFilteredProducts(
  filters: {
    category?: string;
    size?: string[];
    material?: string[];
    color?: string[];
    ecoFriendly?: string[];
    priceMin?: number;
    priceMax?: number;
  },
  sortBy?: string
): Promise<Product[]> {
  try {
    const products = await getSanityFilteredProducts(filters, sortBy);
    return products || [];
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    return [];
  }
}

/**
 * Search products
 * Returns products matching the search query
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    if (!query.trim()) {
      return [];
    }
    const products = await searchSanityProducts(query);
    return products || [];
  } catch (error) {
    console.error(`Error searching products with query "${query}":`, error);
    return [];
  }
}

/**
 * Sort products
 * Returns products sorted by the specified criteria
 */
export async function getSortedProducts(
  sortBy:
    | "newest"
    | "oldest"
    | "price-low"
    | "price-high"
    | "name-asc"
    | "name-desc"
): Promise<Product[]> {
  try {
    const products = await getSanityFilteredProducts({}, sortBy);
    return products || [];
  } catch (error) {
    console.error(`Error sorting products by ${sortBy}:`, error);
    return [];
  }
}

/**
 * Fetch a single product by slug
 * Returns a single product with all variants and pricing tiers
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    if (!slug.trim()) {
      return null;
    }
    const product = await getSanityProductBySlug(slug);
    return product;
  } catch (error) {
    console.error(`Error fetching product with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch products by IDs
 * Returns multiple products by their IDs
 */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  try {
    if (!ids || ids.length === 0) {
      return [];
    }
    const products = await getSanityProductsByIds(ids);
    return products || [];
  } catch (error) {
    console.error(`Error fetching products by IDs:`, error);
    return [];
  }
}

/**
 * Fetch featured products
 * Returns products marked as featured
 */
export async function getFeaturedProductsList(): Promise<Product[]> {
  try {
    const products = await getFeaturedProducts();
    return products || [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

/**
 * Fetch new arrival products
 * Returns products marked as new arrivals
 */
export async function getNewArrivalsList(): Promise<Product[]> {
  try {
    const products = await getNewArrivals();
    return products || [];
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
}
