import { ProductFilters } from "@/components/products/product-filters";
import { ProductCard } from "@/components/products/product-card";
import { ProductSort } from "@/components/products/product-sort";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import {
  getFilteredProducts,
  getProducts,
} from "@/services/products/product.service";
import { getAllCategories } from "@/sanity/lib";

export const revalidate = 300;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    size?: string;
    material?: string;
    ecoFriendly?: string;
    priceMin?: string;
    priceMax?: string;
    sort?: string;
  }>;
}) {
  const sp = await searchParams;
  const category = sp.category;
  const sizes = sp.size ? sp.size.split(",") : [];
  const materials = sp.material ? sp.material.split(",") : [];
  const ecoFriendly = sp.ecoFriendly ? sp.ecoFriendly.split(",") : [];
  const priceMin = Number(sp.priceMin || 0);
  const priceMax = Number(sp.priceMax || 100000);
  const sortBy = (sp.sort as string) || "newest";

  let products = await getFilteredProducts(
    {
      category,
      size: sizes,
      material: materials,
      ecoFriendly,
      priceMin,
      priceMax,
    },
    sortBy
  );
  if (!products || products.length === 0) {
    products = await getProducts();
  }

  // Build category options for client filters to ensure exact matching to slugs
  const categoriesList = await getAllCategories();
  const categoryOptions = (categoriesList || []).map(
    (c: { slug: string; name: string }) => ({
      value: c.slug,
      label: c.name,
    })
  );

  const categoryDisplayName = category
    ? category
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : null;

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
            {categoryDisplayName || "All Products"}
          </h1>
          <p className="text-muted-foreground">
            Showing {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <ProductSort currentSort={sortBy} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ProductFilters categories={categoryOptions} />
        </div>
        <div className="lg:col-span-3">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
              <h3 className="mb-2 text-lg font-semibold">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later for new products.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
