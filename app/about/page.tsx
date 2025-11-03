import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-400">
        <div className="container mx-auto px-6 py-6">
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
        <div className="absolute inset-0 bg-linear-to-b from-neutral-900/40 to-transparent" />
        <div className="container relative mx-auto flex h-full items-end px-6 pb-16 md:pb-20">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-4xl font-light text-white md:text-5xl lg:text-6xl">
              About Volle
            </h1>
            <p className="text-lg text-white/90 md:text-xl">
              Premium packaging solutions for businesses of all sizes
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Main Content */}
          <div className="mb-20 space-y-6">
            <h2 className="text-2xl font-light text-neutral-900 md:text-3xl lg:text-4xl">
              Who We Are
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-neutral-600 md:text-lg">
              <p>
                Volle is a leading provider of premium packaging supplies,
                serving businesses across industries with high-quality
                solutions. We combine exceptional quality with innovative design
                to protect and enhance your products.
              </p>
              <p>
                With over 15 years of experience, we&apos;ve built a reputation
                for reliability, quality, and exceptional customer service. Our
                automated bulk pricing ensures you get the best value whether
                you&apos;re ordering 10 units or 10,000.&apos;
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-12 border-t border-neutral-400 pt-16 md:grid-cols-2 md:gap-16 lg:gap-20">
            <div className="space-y-8">
              <h3 className="text-xl font-light text-neutral-900">
                Our Commitment
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-neutral-900" />
                  <span className="text-sm text-neutral-600">
                    Premium quality standards
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-neutral-900" />
                  <span className="text-sm text-neutral-600">
                    Next-day delivery available
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-neutral-900" />
                  <span className="text-sm text-neutral-600">
                    Automatic bulk pricing
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-neutral-900" />
                  <span className="text-sm text-neutral-600">
                    Eco-friendly options
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-8">
              <h3 className="text-xl font-light text-neutral-900">
                Why Choose Us
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-neutral-900" />
                  <span className="text-sm text-neutral-600">
                    10,000+ satisfied customers
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-neutral-900" />
                  <span className="text-sm text-neutral-600">
                    50+ product categories
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-neutral-900" />
                  <span className="text-sm text-neutral-600">
                    15+ years of experience
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-neutral-900" />
                  <span className="text-sm text-neutral-600">
                    99% satisfaction rate
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-neutral-400 bg-neutral-900 py-20 md:py-28 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h2 className="mb-6 text-3xl font-light text-white md:text-4xl lg:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="mb-10 text-base text-neutral-400 md:text-lg lg:mb-12">
              Browse our premium packaging solutions and find the perfect fit
              for your business.
            </p>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-normal text-neutral-900 transition-colors hover:bg-neutral-100"
            >
              Shop Products
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
