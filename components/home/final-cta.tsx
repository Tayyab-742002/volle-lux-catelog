import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight} from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative border-t bg-linear-to-br from-emerald-600  to-teal-600 py-20 md:py-28 lg:py-32 overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Heading */}
          <h2 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Explore Our Complete
            <span className="block mt-2 text-white">Product Catalog</span>
          </h2>

          {/* Description */}
          <p className="mb-10 text-base md:text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed lg:mb-12">
            Discover our full range of packaging supplies including bubble wrap, cardboard boxes, packing tape, shipping boxes, and protective packaging materials. From eco-friendly materials to custom packaging options. Bulk pricing available on all products. Next day delivery packaging supplies UK. Buy packaging supplies online with wholesale pricing available.{" "}
            <Link
              href="/blog"
              className="underline hover:text-white font-medium"
            >
              Read our packaging guides
            </Link>{" "}
            or{" "}
            <Link
              href="/guides"
              className="underline hover:text-white font-medium"
            >
              browse buying guides
            </Link>{" "}
            to find the perfect solution.
          </p>

          {/* CTA Button */}
          <Button asChild variant="ghost" className="w-fit group">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-8 py-4 mt-4 text-base font-semibold border border-white/20 text-white bg-white/20 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              View All Products
              <ArrowRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
