import { Breadcrumbs } from "@/components/common";
import { Leaf, Recycle, Sprout, Earth } from "lucide-react";

export default function SustainabilityPage() {
  return (
    <div className="bg-background">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[{ label: "Sustainability", href: "/sustainability" }]}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold md:text-6xl">
              Our Commitment to Sustainability
            </h1>
            <p className="text-lg text-muted-foreground">
              Protecting your products and our planet
            </p>
          </div>

          {/* Intro */}
          <div className="mb-12 rounded-lg border bg-muted/30 p-8 text-center">
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
              At Volle, we believe exceptional packaging doesn't have to come at
              the expense of the environment. We're committed to reducing our
              environmental impact through sustainable materials and responsible
              manufacturing.
            </p>
          </div>

          {/* Practices */}
          <div className="mb-12">
            <h2 className="mb-8 text-3xl font-bold">
              Our Sustainable Practices
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Recycle className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Recyclable Materials
                  </h3>
                  <p className="text-muted-foreground">
                    All our standard packaging is fully recyclable through
                    standard municipal programs.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Sprout className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Biodegradable Options
                  </h3>
                  <p className="text-muted-foreground">
                    We offer biodegradable packaging materials that break down
                    naturally.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Leaf className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Eco-Friendly Products
                  </h3>
                  <p className="text-muted-foreground">
                    Recycled content and plant-based materials without
                    compromising protection.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Earth className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Sustainable Manufacturing
                  </h3>
                  <p className="text-muted-foreground">
                    We partner with FSC-certified facilities and carbon-neutral
                    operations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="mb-12">
            <h2 className="mb-6 text-3xl font-bold">
              Certifications & Standards
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-2 text-xl font-semibold">FSC Certified</h3>
                <p className="text-muted-foreground">
                  Forest Stewardship Council certification ensures our paper
                  products come from responsibly managed forests.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-2 text-xl font-semibold">ASTM Standards</h3>
                <p className="text-muted-foreground">
                  Our products meet ASTM International standards for quality,
                  performance, and environmental safety.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-lg border bg-muted/30 p-8 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Shop Our Eco-Friendly Products
            </h2>
            <p className="mb-6 text-muted-foreground">
              Discover our selection of sustainable packaging solutions
            </p>
            <a
              href="/products?filter=eco-friendly"
              className="inline-block rounded-md bg-primary px-8 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View Eco-Friendly Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
