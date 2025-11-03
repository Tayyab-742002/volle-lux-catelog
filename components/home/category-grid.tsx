import Image from "next/image";
import Link from "next/link";
import { getAllCategories } from "@/sanity/lib";

export async function CategoryGrid() {
  // Fetch categories from Sanity CMS
  const categories = await getAllCategories();

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Shop by Category
          </h2>
          <p className="mt-2 text-base text-muted-foreground md:text-lg">
            Browse our complete range of packaging solutions
          </p>
        </div>

        {/* Compact Grid */}
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 lg:gap-4">
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
                    className="group flex flex-col items-center transition-all duration-200 hover:scale-105"
                  >
                    {/* Circular Image Container */}
                    <div className="relative aspect-square w-20 overflow-hidden rounded-full bg-muted sm:w-24 md:w-28 lg:w-32">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 16vw"
                          placeholder="empty"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-[10px] text-muted-foreground sm:text-xs">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Category Name */}
                    <div className="mt-2 text-center">
                      <h3 className="text-xs font-semibold leading-tight text-foreground transition-colors group-hover:text-primary sm:text-sm">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">No categories found</h3>
            <p className="text-sm text-muted-foreground">
              Check back later for product categories.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
