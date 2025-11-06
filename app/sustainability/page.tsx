import { Breadcrumbs } from "@/components/common";
import { Leaf, Recycle, Sprout, Earth, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SustainabilityPage() {
  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-200">
        <div className="container mx-auto px-6 py-6">
          <Breadcrumbs
            items={[{ label: "Sustainability", href: "/sustainability" }]}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-16 md:mb-20">
            <h1 className="mb-6 text-4xl font-light text-neutral-900 md:text-5xl lg:text-6xl">
              Our Commitment to
              <span className="block font-normal">Sustainability</span>
            </h1>
            <p className="text-lg text-neutral-600 md:text-xl">
              Protecting your products and our planet
            </p>
          </div>

          {/* Intro */}
          <div className="mb-20 border-l-2 border-neutral-900 pl-8">
            <p className="text-base leading-relaxed text-neutral-600 md:text-lg">
              At Volle, we believe exceptional packaging doesn&apos;t have to
              come at the expense of the environment. We&apos;re committed to
              reducing our environmental impact through sustainable materials
              and responsible manufacturing.
            </p>
          </div>

          {/* Practices */}
          <div className="mb-20">
            <h2 className="mb-12 text-2xl font-light text-neutral-900 md:text-3xl">
              Our Sustainable Practices
            </h2>
            <div className="grid gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-12">
              <div className="space-y-4">
                <Recycle
                  className="h-6 w-6 text-neutral-900"
                  strokeWidth={1.5}
                />
                <h3 className="text-lg font-normal text-neutral-900">
                  Recyclable Materials
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  All our standard packaging is fully recyclable through
                  standard municipal programs.
                </p>
              </div>

              <div className="space-y-4">
                <Sprout
                  className="h-6 w-6 text-neutral-900"
                  strokeWidth={1.5}
                />
                <h3 className="text-lg font-normal text-neutral-900">
                  Biodegradable Options
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  We offer biodegradable packaging materials that break down
                  naturally.
                </p>
              </div>

              <div className="space-y-4">
                <Leaf className="h-6 w-6 text-neutral-900" strokeWidth={1.5} />
                <h3 className="text-lg font-normal text-neutral-900">
                  Eco-Friendly Products
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  Recycled content and plant-based materials without
                  compromising protection.
                </p>
              </div>

              <div className="space-y-4">
                <Earth className="h-6 w-6 text-neutral-900" strokeWidth={1.5} />
                <h3 className="text-lg font-normal text-neutral-900">
                  Sustainable Manufacturing
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  We partner with FSC-certified facilities and carbon-neutral
                  operations.
                </p>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="mb-20 border-t border-neutral-400 pt-16">
            <h2 className="mb-12 text-2xl font-light text-neutral-900 md:text-3xl">
              Certifications & Standards
            </h2>
            <div className="grid gap-12 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-lg font-normal text-neutral-900">
                  FSC Certified
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  Forest Stewardship Council certification ensures our paper
                  products come from responsibly managed forests.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-normal text-neutral-900">
                  ASTM Standards
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  Our products meet ASTM International standards for quality,
                  performance, and environmental safety.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-neutral-400 pt-16 text-center">
            <h2 className="mb-6 text-2xl font-light text-neutral-900 md:text-3xl">
              Shop Our Eco-Friendly Products
            </h2>
            <p className="mb-10 text-base text-neutral-600">
              Discover our selection of sustainable packaging solutions
            </p>
            <Link
              href="/products?filter=eco-friendly"
              className="group inline-flex items-center gap-2 border-b-2 border-neutral-900 pb-1 text-sm font-normal text-neutral-900 transition-colors hover:border-neutral-600 hover:text-neutral-600"
            >
              View Eco-Friendly Products
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
