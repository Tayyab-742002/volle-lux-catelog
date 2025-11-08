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
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Breadcrumbs */}
      <div className="border-b-2 border-emerald-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-6">
          <Breadcrumbs items={[{ label: "About", href: "/about" }]} />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden md:h-[600px] lg:h-[700px]">
        <Image
          src="https://images.unsplash.com/photo-1595246135406-803418233494?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1740"
          alt="Professional packaging workspace"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/60 via-teal-900/40 to-transparent" />
        <div className="container relative mx-auto flex h-full items-end px-4 sm:px-6 lg:px-8 max-w-[1600px] pb-16 md:pb-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4 text-emerald-300">
              <Leaf className="h-6 w-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Our Story
              </span>
            </div>
            <h1 className="mb-4 text-4xl md:text-5xl lg:text-7xl font-bold text-white">
              About Us
            </h1>
            <p className="text-lg md:text-xl text-white/95 leading-relaxed">
              Premium eco-friendly packaging solutions for businesses of all
              sizes
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Main Content */}
          <div className="mb-20 bg-white rounded-2xl p-8 md:p-12 shadow-xl border-2 border-emerald-100">
            <div className="flex items-center gap-2 mb-8">
              <div className="h-1 w-1 rounded-full bg-emerald-500"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Who We Are
              </h2>
            </div>
            <div className="space-y-6 text-base md:text-lg leading-relaxed text-gray-700">
              <p>
                We are a leading provider of premium eco-friendly packaging
                supplies, serving businesses across industries with sustainable,
                high-quality solutions. We combine exceptional quality with
                innovative design to protect and enhance your products while
                caring for our planet.
              </p>
              <p>
                With over 15 years of experience, we&apos;ve built a reputation for
                reliability, quality, and exceptional customer service. Our
                automated bulk pricing ensures you get the best value whether
                you&apos;re ordering 10 units or 10,000.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-100 text-center group hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                10,000+
              </div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-100 text-center group hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">50+</div>
              <div className="text-sm text-gray-600">Product Categories</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-100 text-center group hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">15+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-100 text-center group hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">99%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-emerald-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Our Commitment
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  <span className="text-base text-gray-700">
                    Premium quality standards on all products
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  <span className="text-base text-gray-700">
                    Next-day delivery available nationwide
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  <span className="text-base text-gray-700">
                    Automatic bulk pricing for best value
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  <span className="text-base text-gray-700">
                    Sustainable eco-friendly options
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  <span className="text-base text-gray-700">
                    Exceptional customer service
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-emerald-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Why Choose Us
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                  <span className="text-base text-gray-700">
                    Industry-leading sustainable practices
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                  <span className="text-base text-gray-700">
                    Trusted by 10,000+ businesses
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                  <span className="text-base text-gray-700">
                    Comprehensive product range
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                  <span className="text-base text-gray-700">
                    15+ years of packaging expertise
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                  <span className="text-base text-gray-700">
                    Competitive pricing guaranteed
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t-2 border-emerald-200 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-20 md:py-28 lg:py-32 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Leaf className="h-5 w-5 text-white" />
              <span className="text-sm font-semibold text-white">
                Start Your Journey
              </span>
            </div>
            <h2 className="mb-6 text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Ready to Get Started?
            </h2>
            <p className="mb-10 text-base md:text-lg lg:text-xl text-white/90 lg:mb-12 max-w-2xl">
              Browse our premium eco-friendly packaging solutions and find the
              perfect fit for your business needs.
            </p>
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 bg-white px-8 md:px-12 py-4 md:py-5 text-base md:text-lg font-semibold text-emerald-700 rounded-full hover:bg-white/95 transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              Shop Products
              <ArrowRight
                className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:translate-x-2"
                strokeWidth={2}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
