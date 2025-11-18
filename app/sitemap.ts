import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

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
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk";
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
    {
      url: `${siteUrl}/b2b-request`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/wholesale`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: baseDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/guides`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Location-specific landing pages for local SEO
    {
      url: `${siteUrl}/packaging-supplies-blackburn`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/packaging-supplies-manchester`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/packaging-supplies-london`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/packaging-supplies-birmingham`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/packaging-supplies-leeds`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/packaging-supplies-liverpool`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Fetch all products with _updatedAt from Sanity
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await client.fetch<
      Array<{ slug: { current: string }; _updatedAt: string }>
    >(
      groq`*[_type == "product" && isActive == true] | order(name asc) {
        "slug": slug.current,
        _updatedAt
      }`
    );
    productPages = products.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: product._updatedAt
        ? new Date(product._updatedAt)
        : baseDate,
      changeFrequency: "weekly" as const,
      priority: 0.8, // High priority for product pages
    }));
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    // Continue without products - don't break the sitemap
  }

  // Fetch all categories with _updatedAt from Sanity
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const categories = await client.fetch<
      Array<{ slug: { current: string }; _updatedAt: string }>
    >(
      groq`*[_type == "category" && isActive == true] | order(sortOrder asc, name asc) {
        "slug": slug.current,
        _updatedAt
      }`
    );
    if (categories) {
      categoryPages = categories.map((category) => ({
        url: `${siteUrl}/products?category=${category.slug}`,
        lastModified: category._updatedAt
          ? new Date(category._updatedAt)
          : baseDate,
        changeFrequency: "weekly" as const,
        priority: 0.7, // Medium-high priority for category pages
      }));
    }
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error);
    // Continue without categories - don't break the sitemap
  }

  // Buying guide pages
  const guidePages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/guides/packaging-boxes-guide`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/guides/bubble-wrap-guide`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/blog/how-to-choose-the-right-packaging-box`,
      lastModified: new Date("2024-12-15"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/blog/bubble-wrap-vs-foam-which-is-better`,
      lastModified: new Date("2024-12-10"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/blog/packaging-tips-for-fragile-items`,
      lastModified: new Date("2024-12-05"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/blog/eco-friendly-packaging-alternatives`,
      lastModified: new Date("2024-11-28"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/blog/how-to-calculate-packaging-costs`,
      lastModified: new Date("2024-11-20"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/blog/cardboard-box-sizes-guide`,
      lastModified: new Date("2024-11-15"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Combine all pages
  // Sort by priority (highest first) for better SEO
  const allPages = [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...blogPages,
    ...guidePages,
  ];

  // Sort by priority (descending) - helps search engines prioritize important pages
  allPages.sort((a, b) => (b.priority || 0) - (a.priority || 0));

  return allPages;
}
