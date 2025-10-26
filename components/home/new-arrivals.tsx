import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { getNewArrivalsList } from "@/services/products/product.service";

export async function NewArrivals() {
  // Fetch new arrivals from Sanity CMS
  const newArrivals = await getNewArrivalsList();

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      {/* Section Header */}
      <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="mb-2 text-4xl font-bold">New Arrivals</h2>
          <p className="text-muted-foreground">
            Discover our latest packaging innovations
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/products?sort=newest">
            View All
            <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
          </Link>
        </Button>
      </div>

      {/* Grid Layout */}
      {newArrivals.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="mb-2 text-lg font-semibold">No new arrivals</h3>
          <p className="text-muted-foreground">
            Check back later for new products.
          </p>
        </div>
      )}
    </section>
  );
}
