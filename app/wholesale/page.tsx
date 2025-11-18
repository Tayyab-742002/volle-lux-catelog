import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Briefcase,
  Package,
  TrendingUp,
  CheckCircle,
  Users,
  Truck,
  Shield,
  DollarSign,
  FileText,
  Award,
  Building2,
  Sparkles,
  Zap,
} from "lucide-react";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk";

export const metadata: Metadata = {
  title:
    "Wholesale Packaging Supplies UK | Bulk Order Discounts | B2B Packaging Solutions",
  description:
    "Wholesale packaging supplies for UK businesses. Bulk pricing on bubble wrap, cardboard boxes, packing tape, and protective packaging. Save up to 40% on large orders. Next day delivery. Trusted by 500+ businesses across the UK.",
  keywords: [
    "wholesale packaging UK",
    "bulk packaging supplies",
    "B2B packaging",
    "wholesale bubble wrap",
    "bulk cardboard boxes",
    "corporate packaging",
    "business packaging supplies",
    "packaging wholesale prices",
    "bulk order packaging",
    "wholesale packaging supplier UK",
    "B2B packaging solutions",
    "corporate packaging UK",
    "wholesale packing materials",
    "bulk shipping supplies",
    "business packaging discount",
    "wholesale packaging distributor",
    "bulk packaging deals",
    "corporate packaging supplier",
    "wholesale protective packaging",
    "B2B packaging supplier",
  ],
  openGraph: {
    title:
      "Wholesale Packaging Supplies UK | Bulk Order Discounts | Bubble Wrap Shop",
    description:
      "Wholesale packaging supplies for UK businesses. Bulk pricing on bubble wrap, boxes, and protective materials. Save up to 40% on large orders.",
    url: `${siteUrl}/wholesale`,
  },
  alternates: {
    canonical: `${siteUrl}/wholesale`,
  },
};

export default function WholesalePage() {
  // Structured Data for B2B/Wholesale page
  const wholesaleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Wholesale Packaging Supplies",
    provider: {
      "@type": "Organization",
      name: "Bubble Wrap Shop",
      url: siteUrl,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Unit BR16 Blakewater Road",
        addressLocality: "Blackburn",
        addressRegion: "England",
        postalCode: "BB1 5QF",
        addressCountry: "GB",
      },
      telephone: "+44",
      email: "sales@bubblewrapshop.co.uk",
    },
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    description:
      "Wholesale packaging supplies for UK businesses. Bulk pricing on bubble wrap, cardboard boxes, packing tape, and protective packaging materials.",
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
      priceSpecification: [
        {
          "@type": "UnitPriceSpecification",
          price: "Base price",
          priceCurrency: "GBP",
          unitText: "1-49 units",
        },
        {
          "@type": "UnitPriceSpecification",
          price: "10% discount",
          priceCurrency: "GBP",
          unitText: "50-99 units",
        },
        {
          "@type": "UnitPriceSpecification",
          price: "Up to 40% discount",
          priceCurrency: "GBP",
          unitText: "100+ units",
        },
      ],
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50">
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(wholesaleStructuredData),
        }}
      />

      <div className="relative z-10">
        {/* Breadcrumbs */}
        <div className="border-b border-emerald-200/30 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-6">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Wholesale", href: "/wholesale" },
              ]}
            />
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070"
              alt="Professional warehouse with packaging supplies"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-linear-to-br from-emerald-900/80 via-emerald-800/70 to-teal-900/80"></div>
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"></div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-lighten filter blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-500/10 rounded-full mix-blend-lighten filter blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-8 border border-white/30">
                <Briefcase className="h-5 w-5 text-white" />
                <span className="text-sm font-semibold text-white uppercase tracking-wider">
                  Wholesale Solutions
                </span>
                <Sparkles className="h-4 w-4 text-emerald-300" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                Wholesale Packaging
                <span className="block bg-linear-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mt-2">
                  Supplies for UK Businesses
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                Bulk pricing on premium packaging supplies. Save up to 40% on
                large orders. Next day delivery across the UK. Trusted by 500+
                businesses.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto shadow-2xl hover:shadow-emerald-500/50"
                >
                  <Link href="/b2b-request">
                    Request Custom Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-300" />
                  <span className="text-sm font-medium">500+ Businesses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-300" />
                  <span className="text-sm font-medium">Next Day Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-300" />
                  <span className="text-sm font-medium">Up to 40% Savings</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/30 rounded-full mix-blend-multiply filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-100/30 rounded-full mix-blend-multiply filter blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] relative z-10">
            <div className="text-center mb-16 md:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-6">
                <Zap className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">
                  Why Choose Us
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Why Choose Our Wholesale
                <span className="block text-emerald-600 mt-2">
                  Packaging Solutions?
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Competitive pricing, reliable delivery, and exceptional service
                for businesses of all sizes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {/* Benefit 1 */}
              <div className="group relative bg-white rounded-2xl p-8 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-500/10 to-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Save Up to 40%
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    Automatic bulk discounts on orders over 50 units. The more
                    you order, the more you save. Transparent pricing with no
                    hidden fees.
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="group relative bg-white rounded-2xl p-8 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-500/10 to-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Next Day Delivery
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    Fast, reliable delivery across the UK. Orders placed before
                    2pm ship the same day. Track your order in real-time.
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="group relative bg-white rounded-2xl p-8 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-500/10 to-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Quality Guaranteed
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    Premium packaging materials that protect your products. All
                    products meet industry standards with quality assurance.
                  </p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="group relative bg-white rounded-2xl p-8 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-500/10 to-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Dedicated Account Manager
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    Personal support for wholesale customers. Your dedicated
                    account manager helps optimize your packaging costs and
                    streamline ordering.
                  </p>
                </div>
              </div>

              {/* Benefit 5 */}
              <div className="group relative bg-white rounded-2xl p-8 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-500/10 to-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Flexible Payment Terms
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    Net 30 payment terms available for qualified businesses. VAT
                    invoices provided. Multiple payment methods accepted.
                  </p>
                </div>
              </div>

              {/* Benefit 6 */}
              <div className="group relative bg-white rounded-2xl p-8 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-500/10 to-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Trusted by 500+ Businesses
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    From small startups to large corporations, we serve
                    businesses across the UK. Join our growing list of satisfied
                    wholesale customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-linear-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-5">
            <Image
              src="https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070"
              alt="Packaging warehouse background"
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] relative z-10">
            <div className="text-center mb-16 md:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-6">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">
                  Pricing Tiers
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Automatic Bulk
                <span className="block text-emerald-600 mt-2">
                  Pricing Tiers
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Our pricing automatically adjusts based on quantity. No
                negotiation needed—just add to cart and save.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
              {/* Tier 1 */}
              <div className="group relative bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-lg border-4 border-white">
                    <Package className="h-10 w-10 text-gray-600" />
                  </div>
                </div>
                <div className="text-center mb-6 pt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Standard
                  </h3>
                  <p className="text-gray-600 text-lg mb-4">1-49 units</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                    <span className="text-2xl font-bold text-gray-900">
                      Base
                    </span>
                    <span className="text-gray-600">Price</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700">Base pricing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700">Next day delivery</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700">Standard support</span>
                  </li>
                </ul>
              </div>

              {/* Tier 2 - Featured */}
              <div className="group relative bg-linear-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 border-4 border-emerald-500 shadow-2xl transform scale-105 md:scale-110 hover:scale-115 transition-all duration-300">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1.5 bg-yellow-400 rounded-full shadow-lg">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                </div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border-4 border-white/30">
                    <TrendingUp className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="text-center mb-6 pt-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Bulk</h3>
                  <p className="text-white/90 text-lg mb-4">50-99 units</p>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <span className="text-3xl font-bold text-white">10%</span>
                    <span className="text-white/90 text-sm">OFF</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-white shrink-0 mt-0.5" />
                    <span className="text-white">10% automatic discount</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-white shrink-0 mt-0.5" />
                    <span className="text-white">Priority shipping</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-white shrink-0 mt-0.5" />
                    <span className="text-white">Enhanced support</span>
                  </li>
                </ul>
              </div>

              {/* Tier 3 */}
              <div className="group relative bg-white rounded-2xl p-8 border-2 border-emerald-300 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-lg border-4 border-white">
                    <Building2 className="h-10 w-10 text-emerald-600" />
                  </div>
                </div>
                <div className="text-center mb-6 pt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Wholesale
                  </h3>
                  <p className="text-gray-600 text-lg mb-4">100+ units</p>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-br from-emerald-500 to-teal-500 rounded-full shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      Up to 40%
                    </span>
                    <span className="text-white/90 text-sm">OFF</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700">Maximum discounts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Dedicated account manager
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700">Custom payment terms</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                Need custom pricing for very large orders?
              </p>
              <Button asChild variant="outline" size="lg">
                <Link href="/b2b-request">
                  Request Custom Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Product Categories Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-100/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-teal-100/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] relative z-10">
            <div className="text-center mb-16 md:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-6">
                <Package className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">
                  Product Categories
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Wholesale Packaging
                <span className="block text-emerald-600 mt-2">
                  Product Categories
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Complete range of packaging supplies available at wholesale
                prices
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {[
                {
                  name: "Bubble Wrap",
                  description: "Protective bubble wrap in various sizes",
                  href: "/products?category=bubble-wrap",
                  image:
                    "https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
                },
                {
                  name: "Cardboard Boxes",
                  description: "Shipping boxes in all standard sizes",
                  href: "/products?category=shipping-boxes",
                  image:
                    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
                },
                {
                  name: "Packing Tape",
                  description: "Strong adhesive tape for sealing",
                  href: "/products?category=packing-tape",
                  image:
                    "https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
                },
                {
                  name: "Protective Materials",
                  description: "Foam, padding, and void fill",
                  href: "/products?category=protective-materials",
                  image:
                    "https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
                },
                {
                  name: "Mailers & Envelopes",
                  description: "Bubble mailers and padded envelopes",
                  href: "/products?category=mailers",
                  image:
                    "https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
                },
                {
                  name: "Custom Packaging",
                  description: "Branded and custom-sized solutions",
                  href: "/b2b-request",
                  image:
                    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
                },
              ].map((category, index) => (
                <Link
                  key={index}
                  href={category.href}
                  className="group relative bg-white rounded-2xl overflow-hidden border-2 border-emerald-100 hover:border-emerald-400 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Category Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-emerald-50 to-teal-50">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {category.description}
                    </p>
                    <div className="flex items-center text-emerald-600 font-medium text-sm">
                      <span>View Products</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link href="/products">
                  Browse All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-linear-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] relative z-10">
            <div className="text-center mb-16 md:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-6">
                <Package className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">
                  How It Works
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                How Wholesale
                <span className="block text-emerald-600 mt-2">
                  Ordering Works
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Simple, transparent process from browsing to delivery
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Step 1 */}
                <div className="group relative bg-white rounded-2xl p-8 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        1
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Browse & Add to Cart
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Browse our complete product catalog. Add items to your
                        cart—pricing automatically adjusts based on quantity.
                        See your savings in real-time as you increase
                        quantities.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 relative h-32 rounded-xl overflow-hidden bg-linear-to-br from-emerald-50 to-teal-50">
                    <Image
                      src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800"
                      alt="Shopping cart with packaging supplies"
                      fill
                      className="object-cover opacity-60"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group relative bg-white rounded-2xl p-8 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        2
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Request Custom Quote (Optional)
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        For very large orders (500+ units) or custom
                        requirements, request a personalized quote. Our team
                        will provide competitive pricing within 1-2 business
                        days.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 relative h-32 rounded-xl overflow-hidden bg-linear-to-br from-emerald-50 to-teal-50">
                    <Image
                      src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800"
                      alt="Business quote document"
                      fill
                      className="object-cover opacity-60"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group relative bg-white rounded-2xl p-8 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        3
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Fast Checkout & Payment
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Complete your order with our secure checkout. Accept
                        credit cards, bank transfers, or request Net 30 payment
                        terms for qualified businesses.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 relative h-32 rounded-xl overflow-hidden bg-linear-to-br from-emerald-50 to-teal-50">
                    <Image
                      src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800"
                      alt="Secure payment processing"
                      fill
                      className="object-cover opacity-60"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Step 4 */}
                <div className="group relative bg-white rounded-2xl p-8 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        4
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Next Day Delivery
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Orders placed before 2pm ship the same day. Track your
                        delivery in real-time. Free delivery on orders over
                        £500.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 relative h-32 rounded-xl overflow-hidden bg-linear-to-br from-emerald-50 to-teal-50">
                    <Image
                      src="https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800"
                      alt="Delivery truck with packages"
                      fill
                      className="object-cover opacity-60"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070"
              alt="Professional packaging warehouse"
              fill
              className="object-cover"
              loading="lazy"
              quality={90}
            />
            <div className="absolute inset-0 bg-linear-to-br from-emerald-900/90 via-emerald-800/85 to-teal-900/90"></div>
            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"></div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full mix-blend-lighten filter blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full mix-blend-lighten filter blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-8 border border-white/30">
                <Sparkles className="h-5 w-5 text-emerald-300" />
                <span className="text-sm font-semibold text-white uppercase tracking-wider">
                  Get Started Today
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
                Ready to Start Saving on
                <span className="block bg-linear-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mt-2">
                  Packaging Supplies?
                </span>
              </h2>
              <p className="text-xl sm:text-2xl text-white/95 mb-12 leading-relaxed drop-shadow-lg max-w-3xl mx-auto">
                Join hundreds of UK businesses saving on packaging costs. Get
                started with a custom quote or browse our products with
                automatic bulk pricing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto shadow-2xl hover:shadow-emerald-500/50 text-lg px-8 py-6"
                >
                  <Link href="/b2b-request">
                    Request Custom Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm text-lg px-8 py-6"
                >
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/90">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Award className="h-6 w-6 text-emerald-300" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-sm">Trusted Businesses</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Truck className="h-6 w-6 text-emerald-300" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">
                      Next Day
                    </div>
                    <div className="text-sm">Delivery UK</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-emerald-300" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">
                      Up to 40%
                    </div>
                    <div className="text-sm">Bulk Savings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Content Section */}
        <section className="py-12 md:py-16 bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Learn More
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/blog"
                      className="text-emerald-600 hover:text-emerald-700 underline text-sm"
                    >
                      Read Packaging Blog Posts
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/guides"
                      className="text-emerald-600 hover:text-emerald-700 underline text-sm"
                    >
                      Browse Buying Guides
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sustainability"
                      className="text-emerald-600 hover:text-emerald-700 underline text-sm"
                    >
                      Learn About Sustainability
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Contact Us
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/contact"
                      className="text-emerald-600 hover:text-emerald-700 underline text-sm"
                    >
                      Get in Touch
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="text-emerald-600 hover:text-emerald-700 underline text-sm"
                    >
                      View FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories"
                      className="text-emerald-600 hover:text-emerald-700 underline text-sm"
                    >
                      Browse Categories
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
