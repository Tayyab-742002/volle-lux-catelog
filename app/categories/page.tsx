import Image from "next/image";
import Link from "next/link";
import { getAllCategories } from "@/sanity/lib";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

// Revalidate every 60 seconds to ensure fresh category data
export const revalidate = 60;

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Categories", href: "/categories" }]} />

      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          Product Categories
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Explore our complete range of packaging solutions organized by
          category
        </p>
      </div>

      {/* Categories Grid */}
      {categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category: any) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
            >
              {/* Category Image */}
              <div className="relative h-48 overflow-hidden bg-muted">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              </div>

              {/* Category Info */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">
                    {category.description}
                  </p>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  Browse Products
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
          <Package className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No categories found</h3>
          <p className="text-muted-foreground">
            Check back later for product categories.
          </p>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-16 rounded-lg border bg-muted/50 p-8 text-center">
        <h2 className="mb-4 text-2xl font-semibold">
          Can't find what you're looking for?
        </h2>
        <p className="mb-6 text-muted-foreground">
          Browse all products or use our advanced filters to find exactly what
          you need
        </p>
        <Link href="/products">
          <Button size="lg">
            View All Products
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  );
}
