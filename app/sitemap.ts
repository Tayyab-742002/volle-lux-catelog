import { MetadataRoute } from "next";
import { getProducts } from "@/services/products/product.service";
import { getAllCategories } from "@/sanity/lib";

/**
 * Dynamic Sitemap Generation
 * Generates sitemap.xml for all products, categories, and static pages
 * Helps search engines discover and index all pages
 * 
 * SEO Best Practices:
 * - Homepage: Priority 1.0, Daily updates
 * - Product pages: Priority 0.8, Weekly updates
 * - Category pages: Priority 0.7, Weekly updates
 * - Static pages: Priority 0.3-0.7, Monthly/Yearly updates
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://volle.com";
  const baseDate = new Date();

  // Static pages with optimized priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: baseDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: baseDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/categories`,
      lastModified: baseDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/sustainability`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: baseDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: baseDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/refund-policy`,
      lastModified: baseDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Fetch all products
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    productPages = products.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: baseDate, // Could be enhanced with product._updatedAt if available
      changeFrequency: "weekly" as const,
      priority: 0.8, // High priority for product pages
    }));
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    // Continue without products - don't break the sitemap
  }

  // Fetch all categories
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const categories = await getAllCategories();
    if (categories) {
      categoryPages = categories.map((category) => ({
        url: `${siteUrl}/products?category=${category.slug}`,
        lastModified: baseDate, // Could be enhanced with category._updatedAt if available
        changeFrequency: "weekly" as const,
        priority: 0.7, // Medium-high priority for category pages
      }));
    }
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error);
    // Continue without categories - don't break the sitemap
  }

  // Combine all pages
  // Sort by priority (highest first) for better SEO
  const allPages = [...staticPages, ...productPages, ...categoryPages];
  
  // Sort by priority (descending) - helps search engines prioritize important pages
  allPages.sort((a, b) => (b.priority || 0) - (a.priority || 0));

  return allPages;
}

