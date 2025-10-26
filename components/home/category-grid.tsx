import Image from "next/image";
import Link from "next/link";
import { getAllCategories } from "@/sanity/lib";

export async function CategoryGrid() {
  // Fetch categories from Sanity CMS
  const categories = await getAllCategories();

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Shop by Category
          </h2>
        </div>

        {/* Masonry Grid */}
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => {
              // Create varied layouts for masonry effect
              const isDouble = index === 1; // 2nd item spans 2 columns (on larger screens)

              return (
                <Link
                  key={category.id}
                  href={`/products/category/${category.slug}`}
                  className={`group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                    isDouble ? "md:col-span-2" : ""
                  }`}
                >
                  <div className="relative h-[300px] md:h-[400px]">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                    {/* Category Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-3xl font-bold text-white md:text-4xl">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="mb-2 text-lg font-semibold">No categories found</h3>
            <p className="text-muted-foreground">
              Check back later for product categories.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
