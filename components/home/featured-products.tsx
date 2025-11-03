import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { getFeaturedProductsList } from "@/services/products/product.service";

export async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProductsList();

  return (
    <section className="border-t border-neutral-200 bg-white py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-light text-neutral-900 md:text-4xl lg:text-5xl">
              Featured Products
            </h2>
            <p className="mt-3 text-lg text-neutral-600">
              Our best-selling packaging solutions
            </p>
          </div>
          <Button asChild variant="ghost" className="w-fit">
            <Link
              href="/products"
              className="group flex items-center gap-2 text-sm font-normal text-neutral-900 hover:text-neutral-600"
            >
              View All
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          </Button>
        </div>

        {/* Grid Layout */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 md:gap-8 lg:grid-cols-5 lg:gap-10 xl:grid-cols-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="text-lg font-normal text-neutral-900">
              No featured products
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              Check back later for featured products.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
