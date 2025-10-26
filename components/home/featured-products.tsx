import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { getFeaturedProductsList } from "@/services/products/product.service";

export async function FeaturedProducts() {
  // Fetch featured products from Sanity CMS
  const featuredProducts = await getFeaturedProductsList();

  return (
    <section className="container mx-auto bg-muted/30 px-4 py-16 md:py-24">
      {/* Section Header */}
      <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="mb-2 text-4xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground">
            Our best-selling packaging solutions
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/products">
            View All
            <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
          </Link>
        </Button>
      </div>

      {/* Grid Layout */}
      {featuredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="mb-2 text-lg font-semibold">No featured products</h3>
          <p className="text-muted-foreground">
            Check back later for featured products.
          </p>
        </div>
      )}
    </section>
  );
}
