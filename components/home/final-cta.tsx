import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-muted/30 px-6 py-16 text-center md:py-24">
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          Explore Our Complete Product Catalog
        </h2>
        <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
          Discover our full range of premium packaging solutions, from eco-friendly
          materials to custom packaging options. Bulk pricing available on all products.
        </p>
        <Button asChild size="lg" variant="default">
          <Link href="/products">
            View All Products
            <ArrowRight className="ml-2 h-5 w-5" strokeWidth={1.5} />
          </Link>
        </Button>
      </div>
    </section>
  );
}

