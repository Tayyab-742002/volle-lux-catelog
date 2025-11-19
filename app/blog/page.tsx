import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  BookOpen,
  Sparkles,
  TrendingUp,
  Tag,
} from "lucide-react";
import Image from "next/image";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk";

export const metadata: Metadata = {
  title:
    "Packaging Blog & Guides | Tips, News & Buying Guides | Bubble Wrap Shop",
  description:
    "Expert packaging tips, buying guides, and industry news. Learn how to choose the right packaging supplies, protect your products, and save money. UK packaging advice from industry experts.",
  keywords: [
    "packaging blog",
    "packaging tips",
    "packaging guides",
    "buying guides packaging",
    "packaging advice UK",
    "packaging industry news",
    "how to choose packaging",
    "packaging best practices",
  ],
  openGraph: {
    title:
      "Packaging Blog & Guides | Tips, News & Buying Guides | Bubble Wrap Shop",
    description:
      "Expert packaging tips, buying guides, and industry news. Learn how to choose the right packaging supplies and protect your products.",
    url: `${siteUrl}/blog`,
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
};

// Static blog posts for SEO (can be moved to Sanity later)
const blogPosts = [
  {
    slug: "how-to-choose-the-right-packaging-box",
    title: "How to Choose the Right Packaging Box: Complete Guide 2024",
    excerpt:
      "Learn how to select the perfect cardboard box for your shipping needs. Size, strength, and material considerations for UK businesses.",
    category: "Buying Guides",
    publishedAt: "2024-12-15",
    readTime: "8 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    tags: ["packaging boxes", "shipping", "cardboard boxes", "buying guide"],
  },
  {
    slug: "bubble-wrap-vs-foam-which-is-better",
    title: "Bubble Wrap vs Foam: Which Protective Packaging is Better?",
    excerpt:
      "Compare bubble wrap and foam packaging materials. Discover which option offers better protection, cost-effectiveness, and environmental impact for your business.",
    category: "Product Guides",
    publishedAt: "2024-12-10",
    readTime: "6 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    tags: [
      "bubble wrap",
      "protective packaging",
      "foam packaging",
      "comparison",
    ],
  },
  {
    slug: "packaging-tips-for-fragile-items",
    title:
      "10 Essential Packaging Tips for Fragile Items: Protect Your Shipments",
    excerpt:
      "Expert tips for packaging fragile items safely. Learn proper wrapping techniques, box selection, and padding methods to prevent damage during shipping.",
    category: "Packaging Tips",
    publishedAt: "2024-12-05",
    readTime: "7 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    tags: ["fragile items", "packaging tips", "shipping safety", "protection"],
  },
  {
    slug: "eco-friendly-packaging-alternatives",
    title:
      "Eco-Friendly Packaging Alternatives: Sustainable Solutions for UK Businesses",
    excerpt:
      "Discover sustainable packaging materials that reduce environmental impact. Learn about recyclable, biodegradable, and compostable packaging options available in the UK.",
    category: "Sustainability",
    publishedAt: "2024-11-28",
    readTime: "9 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    tags: [
      "eco-friendly",
      "sustainability",
      "green packaging",
      "environmental",
    ],
  },
  {
    slug: "how-to-calculate-packaging-costs",
    title: "How to Calculate Packaging Costs: Save Money on Shipping Supplies",
    excerpt:
      "Learn how to calculate and reduce your packaging costs. Understand bulk pricing, material costs, and strategies to optimize your packaging budget.",
    category: "Packaging Tips",
    publishedAt: "2024-11-20",
    readTime: "5 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    tags: ["packaging costs", "budget", "bulk pricing", "cost savings"],
  },
  {
    slug: "cardboard-box-sizes-guide",
    title: "Cardboard Box Sizes Guide: Find the Perfect Box for Your Products",
    excerpt:
      "Complete guide to UK cardboard box sizes. Learn standard dimensions, how to measure your products, and choose the right box size for efficient shipping.",
    category: "Buying Guides",
    publishedAt: "2024-11-15",
    readTime: "6 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    tags: ["cardboard boxes", "box sizes", "shipping boxes", "dimensions"],
  },
];

export default function BlogPage() {
  // Get unique categories
  const categories = Array.from(
    new Set(blogPosts.map((post) => post.category))
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50">
      {/* Breadcrumbs */}
      <div className="relative z-10 border-b border-emerald-200/30 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-6">
          <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070"
            alt="Professional packaging blog workspace"
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
                Expert Insights
              </span>
              <Sparkles className="h-4 w-4 text-emerald-300" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Packaging Blog &
              <span className="block bg-linear-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mt-2">
                Expert Guides
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              Expert packaging tips, buying guides, and industry insights to
              help you make informed decisions about your packaging needs.
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

      {/* Blog Posts Section */}
      <section className="relative py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-6">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">
                Latest Articles
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Expert Packaging
              <span className="block text-emerald-600 mt-2">Tips & Guides</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover actionable insights to improve your packaging strategy
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
            {blogPosts.map((post, index) => (
              <article
                key={post.slug}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-emerald-100 hover:border-emerald-300"
              >
                <Link href={`/blog/${post.slug}`}>
                  {/* Featured Image */}
                  <div className="relative h-64 overflow-hidden bg-linear-to-br from-emerald-50 to-teal-50">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading={index < 3 ? "eager" : "lazy"}
                      priority={index < 3}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-emerald-700 shadow-lg border border-emerald-200">
                        {post.category}
                      </span>
                    </div>

                    {/* Read Time Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-white">
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-GB",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </time>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors leading-tight line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Read More Link */}
                    <div className="flex items-center text-emerald-600 font-semibold group-hover:gap-2 transition-all">
                      <span>Read Article</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </article>
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
                Get Expert Help
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
              Need Help Choosing
              <span className="block bg-linear-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mt-2">
                Packaging?
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-white/95 mb-12 leading-relaxed drop-shadow-lg max-w-3xl mx-auto">
              Our team of packaging experts is here to help you find the perfect
              solution for your business needs.
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
                <Link href="/products">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
