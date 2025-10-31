import { Suspense } from "react"
import { ProductFilters } from "@/components/products/product-filters";
import { ProductSort } from "@/components/products/product-sort";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ProductGridWrapper } from "@/components/products/product-grid-wrapper";
import { getAllCategories } from "@/sanity/lib";

export const revalidate = 60; // Reduce cache time for faster filter updates

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

  const category = sp.category
  const categoryDisplayName = category
    ? category
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : null;
  
  const searchQuery = sp.search?.trim();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
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

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 text-4xl font-bold md:text-5xl">
            {searchQuery
              ? `Search Results: "${searchQuery}"`
              : categoryDisplayName || "All Products"}
          </h1>
        </div>
        <ProductSort currentSort={sp.sort || "newest"} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ProductFilters categories={categoryOptions} />
        </div>
        <div className="lg:col-span-3">
          <ProductGridWrapper searchParams={sp} />
        </div>
      </div>
    </div>
  );
}
