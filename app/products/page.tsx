import type { Metadata } from "next";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductSort } from "@/components/products/product-sort";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ProductGridWrapper } from "@/components/products/product-grid-wrapper";
import { getAllCategories } from "@/sanity/lib";

// Revalidation strategy: On-demand revalidation via Sanity webhooks
// Pages will only revalidate when content changes in Sanity CMS
// For development, use `npm run dev` which has hot reloading
export const revalidate = false;

/**
 * Products Page Metadata
 * SEO optimization for the products listing page
 */
// Note: For category-specific metadata, we'd need generateMetadata function
// but since categories are query params, we'll use static metadata for now
export const metadata: Metadata = {
  title: "All Packaging Supplies UK | Buy Online | Bubble Wrap Shop",
  description:
    "Browse our complete range of packaging supplies in the UK. Buy bubble wrap, cardboard boxes, packing tape, shipping boxes, and protective packaging materials online. Automatic bulk pricing. Next day delivery packaging supplies UK. Cheap bubble wrap online. Buy cardboard boxes UK with wholesale pricing available.",
  keywords: [
    "packaging supplies UK",
    "packaging products UK",
    "bubble wrap UK",
    "packaging boxes UK",
    "cardboard boxes UK",
    "packing tape UK",
    "shipping boxes UK",
    "protective packaging UK",
    "eco-friendly packaging UK",
    "bulk packaging",
    "wholesale packaging UK",
    "buy packaging online",
    "packaging materials UK",
    "next day delivery packaging",
  ],
  openGraph: {
    type: "website",
    title: "All Packaging Supplies UK | Buy Online | Bubble Wrap Shop",
    description:
      "Browse our complete range of packaging supplies in the UK. Bubble wrap, cardboard boxes, packing tape, and more. Automatic bulk pricing. Next day delivery available.",
    url: `${process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk"}/products`,
    siteName: "Bubble Wrap Shop - Premium Packaging Supplies",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk"}/products`,
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    size?: string;
    material?: string;
    ecoFriendly?: string;
    priceMin?: string;
    priceMax?: string;
    sort?: string;
  }>;
}) {
  // Fetch categories in parallel with searchParams
  const [sp, categoriesList] = await Promise.all([
    searchParams,
    getAllCategories(),
  ]);

  // Build category options for client filters to ensure exact matching to slugs
  const categoryOptions = (categoriesList || []).map(
    (c: { slug: string; name: string }) => ({
      value: c.slug,
      label: c.name,
    })
  );

  const category = sp.category;
  const categoryDisplayName = category
    ? category
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : null;

  const searchQuery = sp.search?.trim();

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50">
      <div className="relative z-10">
        {/* Breadcrumbs */}
        <div className="border-b border-emerald-200 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-6">
            <Breadcrumbs
              items={[
                { label: "Products", href: "/products" },
                ...(categoryDisplayName
                  ? [
                      {
                        label: categoryDisplayName,
                        href: `/products?category=${category}`,
                      },
                    ]
                  : []),
              ]}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-8 md:py-12">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="mb-2 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                {searchQuery
                  ? `Search Results: "${searchQuery}"`
                  : categoryDisplayName || "All Products"}
              </h1>
              <p className="mt-2 text-sm text-gray-600 sm:text-base">
                {searchQuery
                  ? `Found products matching your search`
                  : "Browse our complete catalog of eco-friendly packaging solutions"}
              </p>
            </div>
            <ProductSort currentSort={sp.sort || "newest"} />
          </div>

          {/* Filters and Grid */}
          <div className="grid grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <ProductFilters categories={categoryOptions} />
            </div>
            <div className="lg:col-span-3">
              <ProductGridWrapper searchParams={sp} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
