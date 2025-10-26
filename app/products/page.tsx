import { ProductFilters } from "@/components/products/product-filters";
import { ProductCard } from "@/components/products/product-card";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { getProducts } from "@/services/products/product.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductsPageProps {
  searchParams: {
    sort?: string;
    category?: string;
    search?: string;
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  // Fetch products from Sanity CMS
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Products", href: "/products" }]} />

      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 text-4xl font-bold md:text-5xl">All Products</h1>
          <p className="text-muted-foreground">
            Showing {products.length} products
          </p>
        </div>
        <Select defaultValue={searchParams.sort || "newest"}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content: 2-Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
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
