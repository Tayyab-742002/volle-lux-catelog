import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="border-t border-neutral-400 bg-neutral-900 py-20 md:py-28 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="mb-6 text-3xl font-light text-white md:text-4xl lg:text-5xl">
            Explore Our Complete
            <span className="block font-normal">Product Catalog</span>
          </h2>
          <p className="mb-10 text-base text-white/80 md:text-lg lg:mb-12">
            Discover our full range of premium packaging solutions, from
            eco-friendly materials to custom packaging options. Bulk pricing
            available on all products.
          </p>
          <Button
            asChild
            size="lg"
            className="group h-14 bg-white px-8 text-base font-normal text-neutral-900 hover:bg-white/90"
          >
            <Link href="/products" className="flex items-center gap-2">
              View All Products
              <ArrowRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
