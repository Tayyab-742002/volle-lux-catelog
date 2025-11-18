import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";
import Image from "next/image";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk";

export const metadata: Metadata = {
  title: "Packaging Buying Guides | Complete Guides for UK Businesses | Bubble Wrap Shop",
  description:
    "Comprehensive buying guides for packaging supplies. Learn how to choose the right bubble wrap, cardboard boxes, packing tape, and protective materials for your UK business.",
  keywords: [
    "packaging buying guides",
    "how to choose packaging",
    "bubble wrap buying guide",
    "cardboard box buying guide",
    "packaging guide UK",
    "packaging selection guide",
    "buying packaging supplies",
  ],
  openGraph: {
    title: "Packaging Buying Guides | Complete Guides for UK Businesses",
    description:
      "Comprehensive buying guides for packaging supplies. Learn how to choose the right packaging materials for your business.",
    url: `${siteUrl}/guides`,
  },
  alternates: {
    canonical: `${siteUrl}/guides`,
  },
};

const buyingGuides = [
  {
    slug: "packaging-boxes-guide",
    title: "Complete Guide to Buying Packaging Boxes in the UK",
    excerpt:
      "Everything you need to know about choosing the right cardboard boxes for your business. Size, strength, material, and cost considerations.",
    category: "Boxes",
    readTime: "10 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    topics: [
      "Box types and materials",
      "Size selection",
      "Strength ratings",
      "Cost optimization",
      "UK suppliers",
    ],
  },
  {
    slug: "bubble-wrap-guide",
    title: "Bubble Wrap Buying Guide: Choose the Right Protection",
    excerpt:
      "Complete guide to selecting bubble wrap for your shipping needs. Learn about bubble sizes, thickness, and when to use different types.",
    category: "Protective Materials",
    readTime: "8 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    topics: [
      "Bubble sizes explained",
      "Thickness options",
      "When to use bubble wrap",
      "Cost considerations",
      "Environmental alternatives",
    ],
  },
  {
    slug: "packing-tape-guide",
    title: "Packing Tape Buying Guide: Secure Your Shipments",
    excerpt:
      "How to choose the right packing tape for your boxes. Learn about tape types, strength, and application techniques for secure shipping.",
    category: "Sealing Materials",
    readTime: "6 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    topics: [
      "Tape types",
      "Strength ratings",
      "Application methods",
      "Cost efficiency",
      "UK standards",
    ],
  },
  {
    slug: "protective-packaging-guide",
    title: "Protective Packaging Guide: Keep Items Safe During Shipping",
    excerpt:
      "Comprehensive guide to protective packaging materials. Learn when to use different materials and how to protect fragile items effectively.",
    category: "Protective Materials",
    readTime: "9 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    topics: [
      "Material types",
      "Protection levels",
      "Cost vs protection",
      "Best practices",
      "UK availability",
    ],
  },
];

export default function GuidesPage() {
  // Get unique categories
  const categories = Array.from(
    new Set(buyingGuides.map((guide) => guide.category))
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50">
      {/* Breadcrumbs */}
      <div className="relative z-10 border-b border-emerald-200/30 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-6">
          <Breadcrumbs items={[{ label: "Buying Guides", href: "/guides" }]} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070"
            alt="Professional packaging buying guides workspace"
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
              <BookOpen className="h-5 w-5 text-white" />
              <span className="text-sm font-semibold text-white uppercase tracking-wider">
                Expert Buying Guides
              </span>
              <Sparkles className="h-4 w-4 text-emerald-300" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Packaging Buying
              <span className="block bg-linear-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mt-2">
                Guides for UK Businesses
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              Comprehensive guides to help you choose the right packaging supplies
              for your business. Expert advice on boxes, bubble wrap, tape, and
              protective materials.
            </p>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {categories.map((category) => (
                <span
                  key={category}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/30 hover:bg-white/30 transition-colors cursor-pointer"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section className="relative py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">

          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-6">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">
                Complete Guides
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Expert Packaging
              <span className="block text-emerald-600 mt-2">
                Buying Guides
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Step-by-step guides to help you make informed packaging decisions
            </p>
          </div>

          {/* Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 mb-16">
            {buyingGuides.map((guide, index) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-emerald-100 hover:border-emerald-300"
              >
                {/* Featured Image */}
                <div className="relative h-64 overflow-hidden bg-linear-to-br from-emerald-50 to-teal-50">
                  <Image
                    src={guide.featuredImage}
                    alt={guide.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading={index < 2 ? "eager" : "lazy"}
                    priority={index < 2}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-emerald-700 shadow-lg border border-emerald-200">
                      {guide.category}
                    </span>
                  </div>

                  {/* Read Time Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-white">
                      <Clock className="h-3 w-3" />
                      {guide.readTime}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors leading-tight">
                    {guide.title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">{guide.excerpt}</p>
                  
                  {/* Topics List */}
                  <div className="space-y-3 mb-6">
                    {guide.topics.map((topic) => (
                      <div
                        key={topic}
                        className="flex items-center gap-3 text-sm text-gray-700"
                      >
                        <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>

                  {/* Read More Link */}
                  <div className="flex items-center text-emerald-600 font-semibold group-hover:gap-2 transition-all">
                    <span>Read Complete Guide</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070"
            alt="Professional packaging consultation"
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
                Need More Help?
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
              Our Packaging Experts
              <span className="block bg-linear-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mt-2">
                Are Here to Help
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-white/95 mb-12 leading-relaxed drop-shadow-lg max-w-3xl mx-auto">
              Our packaging experts are here to help you find the perfect
              solutions for your business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto shadow-2xl hover:shadow-emerald-500/50 text-lg px-8 py-6"
              >
                <Link href="/contact">
                  Contact Our Experts
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm text-lg px-8 py-6"
              >
                <Link href="/blog">Read Our Blog</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

