import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Briefcase,
  Package,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { B2BRequestForm } from "@/components/b2b/b2b-request-form";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk";

export const metadata: Metadata = {
  title:
    "Wholesale Packaging UK | B2B Bulk Order Quote | Corporate Packaging Supplies",
  description:
    "Request a custom quote for wholesale packaging supplies in the UK. Bulk pricing for businesses. Competitive rates on large orders of bubble wrap, boxes, and packaging materials. Next day delivery available.",
  keywords: [
    "wholesale packaging UK",
    "B2B packaging",
    "bulk packaging supplies",
    "corporate packaging",
    "business packaging supplies",
    "wholesale bubble wrap",
    "bulk cardboard boxes",
    "packaging wholesale UK",
    "B2B packaging supplier",
    "corporate packaging UK",
    "bulk order packaging",
    "wholesale packaging prices",
    "business packaging solutions",
  ],
  openGraph: {
    title: "Wholesale Packaging UK | B2B Bulk Order Quote | Bubble Wrap Shop",
    description:
      "Request a custom quote for wholesale packaging supplies in the UK. Bulk pricing for businesses. Competitive rates on large orders.",
    url: `${siteUrl}/b2b-request`,
  },
  alternates: {
    canonical: `${siteUrl}/b2b-request`,
  },
};

export default function B2BRequestPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Breadcrumbs */}
      <div className="relative z-10 border-b-2 border-emerald-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "B2B Request", href: "/b2b-request" },
            ]}
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
          <div className="mb-12 md:mb-16 text-center">
            <div className="flex items-center justify-center gap-2 mb-4 text-emerald-600">
              <Briefcase className="h-6 w-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                B2B Solutions
              </span>
            </div>
            <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Request a Custom Quote
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Need bulk packaging supplies? Get competitive wholesale pricing
              for your business. Fill out the form below and our team will
              provide a custom quote within 1-2 business days.
            </p>
          </div>

          {/* Link to Wholesale Page */}
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              <strong>New to wholesale?</strong> Learn more about our bulk
              pricing, benefits, and how it works.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/wholesale">
                Visit Wholesale Information Page
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Benefits Section */}
          <div className="grid gap-4 md:grid-cols-3 mb-12">
            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">
                  Save Up to 40%
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Competitive bulk pricing for large orders
              </p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">
                  Custom Solutions
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Tailored packaging solutions for your needs
              </p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">
                  Fast Response
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Get a quote within 1-2 business days
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl border border-gray-300">
            <B2BRequestForm />
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600">
              Have questions?{" "}
              <Link
                href="/contact"
                className="text-emerald-600 hover:text-emerald-700 font-semibold underline"
              >
                Contact our sales team
              </Link>{" "}
              or call us at{" "}
              <a
                href="tel:01254916167"
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                01254 916167
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
