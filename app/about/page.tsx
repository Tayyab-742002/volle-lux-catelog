import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common";
import {
  ArrowRight,
  Leaf,
  Package,
  Users,
  Award,
  TrendingUp,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk";

export const metadata: Metadata = {
  title: "About Us - Premium Packaging Supplies | Bubble Wrap Shop",
  description:
    "Learn about Bubble Wrap Shop, your trusted UK supplier of premium packaging supplies. We offer eco-friendly solutions, bulk pricing, and next-day delivery across the UK.",
  openGraph: {
    title: "About Us - Premium Packaging Supplies | Bubble Wrap Shop",
    description:
      "Learn about Bubble Wrap Shop, your trusted UK supplier of premium packaging supplies. We offer eco-friendly solutions, bulk pricing, and next-day delivery.",
    url: `${siteUrl}/about`,
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};

export default function AboutPage() {
  return (
    <div>
      {/* Breadcrumbs */}
      <div className="relative z-10 border-b border-emerald-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-6">
          <Breadcrumbs items={[{ label: "About", href: "/about" }]} />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden md:h-[600px] lg:h-[700px]">
        <Image
          src="https://images.unsplash.com/photo-1736979110904-d9d9efb35cf6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470"
          alt="Professional packaging workspace"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-emerald-900/20 via-teal-900/10 to-transparent" />
        <div className="container relative mx-auto flex h-full items-end px-4 sm:px-6 lg:px-8 max-w-[1600px] pb-16 md:pb-20">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-4xl md:text-5xl lg:text-7xl font-bold block bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent ">
              About Us
            </h1>
            <p className="text-lg md:text-xl text-white leading-relaxed">
              Premium eco-friendly packaging solutions for businesses of all
              sizes
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-16 md:py-20 lg:py-24">
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

          {/* Main Content */}
          <div className="mb-20 bg-white rounded-xl p-6 shadow-lg border border-gray-300">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                Who We
                <span className="block bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-1">
                  Are
                </span>
              </h2>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-gray-700 md:text-lg">
              <p>
                We are a leading provider of premium eco-friendly packaging
                supplies, serving businesses across industries with sustainable,
                high-quality solutions. We combine exceptional quality with
                innovative design to protect and enhance your products while
                caring for our planet.
              </p>
              <p>
                With over 15 years of experience, we&apos;ve built a reputation
                for reliability, quality, and exceptional customer service. Our
                automated bulk pricing ensures you get the best value whether
                you&apos;re ordering 10 units or 10,000.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-20 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-300 text-center group hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" strokeWidth={2} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                10,000+
              </div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-300 text-center group hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="h-8 w-8 text-white" strokeWidth={2} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">50+</div>
              <div className="text-sm text-gray-600">Product Categories</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-300 text-center group hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-white" strokeWidth={2} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">15+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-300 text-center group hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-white" strokeWidth={2} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">99%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-8">
            <div className="group space-y-4 p-6 bg-white rounded-2xl border border-gray-300 shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                <Heart className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Our Commitment
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                  <span className="text-sm leading-relaxed text-gray-600">
                    Premium quality standards on all products
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                  <span className="text-sm leading-relaxed text-gray-600">
                    Next-day delivery available nationwide
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                  <span className="text-sm leading-relaxed text-gray-600">
                    Automatic bulk pricing for best value
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                  <span className="text-sm leading-relaxed text-gray-600">
                    Sustainable eco-friendly options
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                  <span className="text-sm leading-relaxed text-gray-600">
                    Exceptional customer service
                  </span>
                </li>
              </ul>
            </div>

            <div className="group space-y-4 p-6 bg-white rounded-2xl border border-gray-300 shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                <Leaf className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Why Choose Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                  <span className="text-sm leading-relaxed text-gray-600">
                    Industry-leading sustainable practices
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                  <span className="text-sm leading-relaxed text-gray-600">
                    Trusted by 10,000+ businesses
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                  <span className="text-sm leading-relaxed text-gray-600">
                    Comprehensive product range
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                  <span className="text-sm leading-relaxed text-gray-600">
                    15+ years of packaging expertise
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                  <span className="text-sm leading-relaxed text-gray-600">
                    Competitive pricing guaranteed
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <section className="mt-12 relative border-t bg-linear-to-br from-emerald-600 to-teal-600 py-20 md:py-28 lg:py-32 overflow-hidden">
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
              <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                {/* Heading */}
                <h2 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Explore Our Complete
                  <span className="block mt-2 text-white">Product Catalog</span>
                </h2>

                {/* Description */}
                <p className="mb-10 text-base md:text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed lg:mb-12">
                  Discover our full range of premium packaging solutions, from
                  eco-friendly materials to custom packaging options. Bulk
                  pricing available on all products.
                </p>

                {/* CTA Button */}
                <Button asChild variant="ghost" className="w-fit group">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-3 px-8 py-4 mt-4 text-base font-semibold border border-white/20 text-white bg-white/20 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    View All Products
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
