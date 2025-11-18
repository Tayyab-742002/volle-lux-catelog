import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common";
import {
  Leaf,
  Recycle,
  Sprout,
  Earth,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk";

export const metadata: Metadata = {
  title: "Sustainability - Eco-Friendly Packaging Solutions | Bubble Wrap Shop",
  description:
    "Learn about our commitment to sustainability and eco-friendly packaging solutions. Discover our range of recyclable and biodegradable packaging materials for a greener future.",
  openGraph: {
    title:
      "Sustainability - Eco-Friendly Packaging Solutions | Bubble Wrap Shop",
    description:
      "Learn about our commitment to sustainability and eco-friendly packaging solutions. Discover our range of recyclable and biodegradable packaging materials.",
    url: `${siteUrl}/sustainability`,
  },
  alternates: {
    canonical: `${siteUrl}/sustainability`,
  },
};

export default function SustainabilityPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Breadcrumbs */}
      <div className="relative z-10 border-b border-emerald-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-6">
          <Breadcrumbs
            items={[{ label: "Sustainability", href: "/sustainability" }]}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="mb-8 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 -ml-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={2} />
              Back to Home
            </Button>
          </Link>

          {/* Page Header */}
          <div className="mb-16 md:mb-20 text-center">
            <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900">
              Our Commitment to
              <span className="block bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">
                Sustainability
              </span>
            </h1>
            <p className="text-lg text-center! text-gray-600 md:text-xl max-w-full mx-auto">
              Protecting your products and our planet
            </p>
          </div>

          {/* Intro */}
          <div className="mb-20 rounded-xl border bg-emerald-600 p-6 shadow-lg">
            <p className="text-base leading-relaxed text-white/90 md:text-lg">
              At Bubble Wrap Shop, we believe exceptional packaging doesn&apos;t
              have to come at the expense of the environment. We&apos;re
              committed to reducing our environmental impact through sustainable
              materials and responsible manufacturing.
            </p>
          </div>

          {/* Practices */}
          <div className="mb-20">
            <h2 className="mb-12 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 text-center">
              Our Sustainable
              <span className="block bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-1">
                Practices
              </span>
            </h2>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-8">
              <div className="group space-y-4 p-6 bg-white rounded-2xl border border-gray-300 shadow-2xl transition-all duration-300 ">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                  <Recycle className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Recyclable Materials
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  All our standard packaging is fully recyclable through
                  standard municipal programs.
                </p>
              </div>

              <div className="group space-y-4 p-6 bg-white rounded-2xl border border-gray-300 shadow-2xl  transition-all duration-300 ">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                  <Sprout className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Biodegradable Options
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  We offer biodegradable packaging materials that break down
                  naturally.
                </p>
              </div>

              <div className="group space-y-4 p-6 bg-white rounded-2xl border border-gray-300 shadow-2xl transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                  <Leaf className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Eco-Friendly Products
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  Recycled content and plant-based materials without
                  compromising protection.
                </p>
              </div>

              <div className="group space-y-4 p-6 bg-white rounded-2xl border border-gray-300 shadow-2xl transition-all duration-300 ">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                  <Earth className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Sustainable Manufacturing
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  We partner with FSC-certified facilities and carbon-neutral
                  operations.
                </p>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="mb-20 border-t border-emerald-500 pt-16">
            <h2 className="mb-12 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 text-center">
              Certifications &
              <span className="block bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-1">
                Standards
              </span>
            </h2>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              <div className="space-y-4 p-6 bg-white rounded-2xl border border-gray-300 shadow-2xl transition-all duration-300 ">
                <h3 className="text-xl font-bold text-gray-900">
                  FSC Certified
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 ">
                  Forest Stewardship Council certification ensures our paper
                  products come from responsibly managed forests.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-white rounded-2xl border border-gray-300 shadow-2xl transition-all duration-300 ">
                <h3 className="text-xl font-bold text-gray-900">
                  ASTM Standards
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 ">
                  Our products meet ASTM International standards for quality,
                  performance, and environmental safety.
                </p>
              </div>
            </div>
          </div>

          <section className="relative border-t bg-linear-to-br from-emerald-600  to-teal-600 py-20 md:py-28 lg:py-32 overflow-hidden">
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
              <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                {/* Heading */}
                <h2 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Shop Our
                  <span className="block mt-2 text-white">
                    Eco-Friendly Products
                  </span>
                </h2>

                {/* Description */}
                <p className="mb-10 text-base md:text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed lg:mb-12">
                  Discover our selection of sustainable packaging solutions
                </p>

                {/* CTA Button */}
                <Button asChild variant="ghost" className="w-fit group">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-3 px-8 py-4 mt-4 text-base font-semibold border border-white/20 text-white bg-white/20 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    View Eco-Friendly Products
                    <ArrowRight
                      className="h-5 w-5 transition-transform group-hover:translate-x-1"
                      strokeWidth={2.5}
                    />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
