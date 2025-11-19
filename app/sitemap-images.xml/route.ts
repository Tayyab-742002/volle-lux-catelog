import { NextResponse } from "next/server";
import { getAllProducts } from "@/sanity/lib/api";
import { getAllCategories } from "@/sanity/lib/api";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk";

/**
 * Image Sitemap for SEO
 * Helps search engines discover and index product images
 * Accessible at /sitemap-images.xml
 * Reference: https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 */
export async function GET() {
  try {
    // Fetch all products
    const products = (await getAllProducts()) || [];
    
    // Fetch all categories
    const categories = (await getAllCategories()) || [];

    const imageEntries: Array<{
      url: string;
      images: Array<{
        loc: string;
        title: string;
        caption: string;
        geoLocation?: string;
        license?: string;
      }>;
    }> = [];

    // Add product images to sitemap
    for (const product of products) {
      if (!product.image) continue;

      const productUrl = `${siteUrl}/products/${product.slug}`;

      // Main product image
      imageEntries.push({
        url: productUrl,
        images: [
          {
            loc: product.image,
            title: product.imageAlt || product.name,
            caption: product.imageAlt || `${product.name} - ${product.category || "Packaging Supplies"} packaging supplies available in the UK`,
            geoLocation: "United Kingdom",
            license: `${siteUrl}/terms`,
          },
        ],
      });

      // Gallery images
      if (product.images && product.images.length > 0) {
        product.images.forEach((imageUrl, index) => {
          const imageAlt = product.imagesAlt?.[index] || `${product.name} - View ${index + 1}`;
          
          imageEntries.push({
            url: productUrl,
            images: [
              {
                loc: imageUrl,
                title: imageAlt,
                caption: imageAlt,
                geoLocation: "United Kingdom",
                license: `${siteUrl}/terms`,
              },
            ],
          });
        });
      }
    }

    // Add category images to sitemap
    for (const category of categories) {
      if (!category.image) continue;

      const categoryUrl = `${siteUrl}/products?category=${category.slug}`;

      imageEntries.push({
        url: categoryUrl,
        images: [
          {
            loc: category.image,
            title: `${category.name} Packaging Supplies`,
            caption: `${category.name} packaging supplies and products available in the UK`,
            geoLocation: "United Kingdom",
            license: `${siteUrl}/terms`,
          },
        ],
      });
    }

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageEntries
  .map((entry) => {
    const imagesXml = entry.images
      .map(
        (img) => `    <image:image>
      <image:loc>${escapeXml(img.loc)}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
      <image:caption>${escapeXml(img.caption)}</image:caption>
      ${img.geoLocation ? `<image:geo_location>${escapeXml(img.geoLocation)}</image:geo_location>` : ""}
      ${img.license ? `<image:license>${escapeXml(img.license)}</image:license>` : ""}
    </image:image>`
      )
      .join("\n");

    return `  <url>
    <loc>${escapeXml(entry.url)}</loc>
${imagesXml}
  </url>`;
  })
  .join("\n")}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating image sitemap:", error);
    
    // Return empty sitemap on error
    const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
</urlset>`;
    
    return new NextResponse(emptyXml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

