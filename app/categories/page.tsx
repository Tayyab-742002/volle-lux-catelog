import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllCategories } from "@/sanity/lib";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Category } from "@/types/category";

// Revalidation strategy: On-demand revalidation via Sanity webhooks
// Pages will only revalidate when content changes in Sanity CMS
// For development, use `npm run dev` which has hot reloading
export const revalidate = false;

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk";

export const metadata: Metadata = {
  title:
    "Packaging Categories UK | Bubble Wrap, Boxes & More | Bubble Wrap Shop",
  description:
    "Browse our complete range of packaging categories in the UK. From bubble wrap and shipping boxes to packing tape and protective materials. Find the perfect packaging solution for your business or personal needs. Next day delivery available.",
  keywords: [
    "packaging categories UK",
    "bubble wrap category",
    "shipping boxes category",
    "packing tape category",
    "protective packaging category",
    "packaging supplies categories",
    "packaging materials UK",
    "buy packaging by category",
    "packaging solutions UK",
  ],
  openGraph: {
    title:
      "Packaging Categories UK | Bubble Wrap, Boxes & More | Bubble Wrap Shop",
    description:
      "Browse our complete range of packaging categories in the UK. From bubble wrap and shipping boxes to packing tape and protective materials.",
    url: `${siteUrl}/categories`,
  },
  alternates: {
    canonical: `${siteUrl}/categories`,
  },
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-emerald-600 to-teal-600">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10">
        {/* Breadcrumbs */}
        <div className="border-b border-emerald-200/30 bg-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-6">
            <Breadcrumbs items={[{ label: "Categories", href: "/categories" }]} />
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-12 md:py-16 lg:py-20">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Packaging Supplies
              <span className="block text-white mt-2">Categories UK</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Browse our complete range of eco-friendly packaging solutions
            </p>
          </div>

          {/* Category Grid */}
          {categories && categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8 lg:gap-10">
              {categories.map((category: Category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group flex flex-col items-center"
                >
                  {/* Circular Image Container */}
                  <div className="relative w-full aspect-square max-w-[180px]">
                    {/* Image Container */}
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-lg group-hover:shadow-2xl transition-all duration-300 border-2 border-emerald-100 group-hover:border-transparent group-hover:scale-105">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.imageAlt || category.name}
                          fill
                          className="object-cover p-4 transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                          placeholder="empty"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-linear-to-br from-emerald-50 to-teal-50">
                          <div className="text-center p-4">
                            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-linear-to-br from-emerald-200 to-teal-200 flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-emerald-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <span className="text-xs text-gray-400">
                              No image
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category Name */}
                  <div className="mt-5 text-center w-full">
                    <h3 className="text-sm sm:text-base font-semibold text-white group-hover:bg-linear-to-r group-hover:text-white transition-all duration-300 px-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-xs text-white/70 mt-1 line-clamp-2 px-2">
                        {category.description}
                      </p>
                    )}
                  </div>

                  {/* Hover Arrow Indicator */}
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No categories found
              </h3>
              <p className="text-base text-gray-300">
                Check back later for product categories.
              </p>
            </div>
          )}

          {/* Related Content Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">
                Learn More
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog"
                    className="text-emerald-200 hover:text-white underline text-sm"
                  >
                    Read Packaging Blog Posts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="text-emerald-200 hover:text-white underline text-sm"
                  >
                    Browse Buying Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sustainability"
                    className="text-emerald-200 hover:text-white underline text-sm"
                  >
                    Learn About Sustainability
                  </Link>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">
                Shop Products
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products"
                    className="text-emerald-200 hover:text-white underline text-sm"
                  >
                    Browse All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/b2b-request"
                    className="text-emerald-200 hover:text-white underline text-sm"
                  >
                    Request Bulk Quote
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-emerald-200 hover:text-white underline text-sm"
                  >
                    Contact Our Team
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 md:mt-20 lg:mt-24 text-center">
            <div className="inline-block rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Can&apos;t find what you&apos;re looking for?
              </h2>
              <p className="text-base md:text-lg text-white/80 mb-6 max-w-2xl mx-auto">
                Browse all products or use our advanced filters to find exactly what
                you need
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View All Products
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
