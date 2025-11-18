import { MetadataRoute } from "next";

/**
 * Robots.txt Configuration
 * Controls what search engines can crawl and index
 * 
 * SEO Best Practices:
 * - Allow public pages (products, categories, static pages)
 * - Block private pages (admin, account, checkout, cart)
 * - Block API routes and internal pages
 * - Point to sitemap.xml for better indexing
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk";

  return {
    rules: [
      {
        // Default rules for all search engines
        userAgent: "*",
        allow: [
          "/", // Allow homepage
          "/products", // Allow products listing
          "/products/*", // Allow individual product pages
          "/categories", // Allow categories page
          "/about", // Allow about page
          "/contact", // Allow contact page
          "/faq", // Allow FAQ page
          "/sustainability", // Allow sustainability page
          "/terms", // Allow terms page
          "/privacy", // Allow privacy page
          "/refund-policy", // Allow refund policy page
        ],
        disallow: [
          "/api/", // Block all API routes
          "/admin/", // Block admin dashboard
          "/account/", // Block user account pages
          "/checkout/", // Block checkout pages (private, user-specific)
          "/cart", // Block cart page (user-specific)
          "/auth/", // Block authentication pages
          "/studio/", // Block Sanity Studio
          "/_next/", // Block Next.js internal files
          "/test-supabase/", // Block test pages
          "/*.json$", // Block JSON files (API responses)
          // Note: We allow query parameters for category filters as they're in the sitemap
        ],
      },
      {
        // Specific rules for Googlebot
        userAgent: "Googlebot",
        allow: [
          "/",
          "/products",
          "/products/*",
          "/categories",
          "/about",
          "/contact",
          "/faq",
          "/sustainability",
          "/terms",
          "/privacy",
          "/refund-policy",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/account/",
          "/checkout/",
          "/cart",
          "/auth/",
          "/studio/",
          "/_next/",
          "/test-supabase/",
          "/*.json$",
        ],
      },
      {
        // Rules for Bingbot
        userAgent: "Bingbot",
        allow: [
          "/",
          "/products",
          "/products/*",
          "/categories",
          "/about",
          "/contact",
          "/faq",
          "/sustainability",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/account/",
          "/checkout/",
          "/cart",
          "/auth/",
          "/studio/",
          "/_next/",
          "/test-supabase/",
        ],
      },
    ],
    sitemap: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/sitemap-images.xml`, // Image sitemap for better image search visibility
    ],
    // Optional: Add host directive for better SEO
    // host: siteUrl.replace(/^https?:\/\//, ""), // Remove protocol
  };
}

