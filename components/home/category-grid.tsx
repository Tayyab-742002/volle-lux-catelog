import Image from "next/image";
import Link from "next/link";
import { getAllCategories } from "@/sanity/lib";

export async function CategoryGrid() {
  const categories = await getAllCategories();

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Shop by
            <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mt-2">
              Category
            </span>
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our complete range of eco-friendly packaging solutions
          </p>
        </div>

        {/* Category Grid */}
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8 lg:gap-10">
            {categories.map(
              (category: {
                id: string;
                name: string;
                slug: string;
                image?: string;
                description?: string;
              }) => {
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="group flex flex-col items-center"
                  >
                    {/* Circular Image Container */}
                    <div className="relative w-full aspect-square max-w-[180px]">
                      {/* Gradient Ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-full h-full rounded-full bg-white"></div>
                      </div>

                      {/* Image Container */}
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-lg group-hover:shadow-2xl transition-all duration-300 border-2 border-emerald-100 group-hover:border-transparent group-hover:scale-105">
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover p-4 transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                            placeholder="empty"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
                            <div className="text-center p-4">
                              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-emerald-200 to-teal-200 flex items-center justify-center">
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
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600 group-hover:bg-clip-text transition-all duration-300 px-2">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 px-2">
                          {category.description}
                        </p>
                      )}
                    </div>

                    {/* Hover Arrow Indicator */}
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg
                        className="w-5 h-5 text-teal-600"
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
                );
              }
            )}
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
            <p className="text-base text-gray-600">
              Check back later for product categories.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
