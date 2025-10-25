import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SustainabilityBlock() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* Content Section */}
        <div className="order-2 md:order-1">
          <span className="label-luxury mb-4 block text-primary">
            Sustainability
          </span>
          <h2 className="mb-6 text-4xl font-bold">Our Sustainable Mission</h2>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            We&apos;re committed to reducing environmental impact through
            eco-friendly materials, recyclable packaging, and sustainable
            manufacturing processes. Every product in our sustainable range
            meets strict environmental standards.
          </p>
          <Button asChild size="lg">
            <Link href="/sustainability">
              Learn More About Our Impact
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
            </Link>
          </Button>
        </div>

        {/* Image Section */}
        <div className="order-1 md:order-2">
          <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1452179535021-368bb0edc3a8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1742"
              alt="Sustainable Packaging"
              width={800}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
