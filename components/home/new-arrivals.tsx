import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { getNewArrivalsList } from "@/services/products/product.service";

export async function NewArrivals() {
  const newArrivals = await getNewArrivalsList();

  return (
    <section className="relativ py-16 md:py-20 lg:py-24 overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              New
              <span className="block bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-1">
                Arrivals
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Discover our latest packaging supplies including new bubble wrap, cardboard boxes, packing tape, and protective packaging materials. Next day delivery packaging supplies UK. Buy packaging supplies online with automatic bulk pricing.
            </p>
          </div>
          <Button asChild variant="ghost" className="w-fit group">
            <Link
              href="/products?sort=newest"
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              View All
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Link>
          </Button>
        </div>

        {/* Grid Layout */}
        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5 lg:gap-8 xl:grid-cols-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No new arrivals yet
            </h3>
            <p className="text-base text-gray-600">
              Check back soon for our latest products.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
