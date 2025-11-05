import Image from "next/image";
import Link from "next/link";
import { getAllCategories } from "@/sanity/lib";

export async function CategoryGrid() {
  const categories = await getAllCategories();

  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl font-light text-neutral-900 md:text-4xl lg:text-5xl">
            Shop by Category
          </h2>
          <p className="mt-3 text-lg text-neutral-600">
            Browse our complete range of packaging solutions
          </p>
        </div>

        {/* Category Grid */}
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5 md:gap-8 lg:grid-cols-6 lg:gap-10">
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
                    <div className="relative aspect-square w-full max-w-[140px] overflow-hidden rounded-full border border-neutral-300 transition-all duration-300 group-hover:border-neutral-400">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-contain transition-transform duration-200 group-hover:scale-105"
                          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 16vw"
                          placeholder="empty"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-xs text-neutral-400">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Category Name */}
                    <div className="mt-4 text-center">
                      <h3 className="text-sm font-normal text-neutral-900 transition-colors group-hover:text-neutral-600">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="text-lg font-normal text-neutral-900">
              No categories found
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              Check back later for product categories.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
