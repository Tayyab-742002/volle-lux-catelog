import Image from "next/image";
import { Breadcrumbs } from "@/components/common";
import { CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "About", href: "/about" }]} />
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1595246135406-803418233494?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1740"
          alt="Professional packaging workspace"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 to-transparent" />
        <div className="container relative mx-auto flex h-full items-end px-4 pb-12">
          <div>
            <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
              About Volle
            </h1>
            <p className="text-xl text-white/90">
              Premium packaging solutions for businesses of all sizes
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <h2 className="mb-6 text-3xl font-bold">Who We Are</h2>
            <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
              Volle is a leading provider of premium packaging supplies, serving
              businesses across industries with high-quality solutions. We
              combine exceptional quality with innovative design to protect and
              enhance your products.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              With over 15 years of experience, we&apos;ve built a reputation
              for reliability, quality, and exceptional customer service. Our
              automated bulk pricing ensures you get the best value whether
              you&apos;re ordering 10 units or 10,000.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-2xl font-semibold">Our Commitment</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    Premium quality standards
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    Next-day delivery available
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    Automatic bulk pricing
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    Eco-friendly options
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-2xl font-semibold">Why Choose Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    10,000+ satisfied customers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    50+ product categories
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    15+ years of experience
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    99% satisfaction rate
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-y bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mb-8 text-muted-foreground">
              Browse our premium packaging solutions and find the perfect fit
              for your business.
            </p>
            <a
              href="/products"
              className="inline-block rounded-md bg-primary px-8 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Shop Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
