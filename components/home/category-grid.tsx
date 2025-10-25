"use client";

import Image from "next/image";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  width: number;
  height: number;
}

const categories: Category[] = [
  {
    id: "1",
    name: "Shipping Boxes",
    slug: "shipping-boxes",
    image:
      "https://images.unsplash.com/photo-1577702312706-e23ff063064f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    width: 800,
    height: 600,
  },
  {
    id: "2",
    name: "Packaging Supplies",
    slug: "packaging-supplies",
    image:
      "https://images.unsplash.com/photo-1648587456176-4969b0124b12?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1918",
    width: 800,
    height: 800,
  },
  {
    id: "3",
    name: "Bubble Wrap",
    slug: "bubble-wrap",
    image:
      "https://images.unsplash.com/photo-1613574203646-ffdae46ce3e9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    width: 800,
    height: 1000,
  },
  {
    id: "4",
    name: "Envelopes & Mailers",
    slug: "envelopes-mailers",
    image:
      "https://images.unsplash.com/photo-1627618998627-70a92a874cc2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    width: 800,
    height: 700,
  },
  {
    id: "5",
    name: "Protective Materials",
    slug: "protective-materials",
    image:
      "https://images.unsplash.com/photo-1631010231130-5c7828d9a3a7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    width: 800,
    height: 500,
  },
];

export function CategoryGrid() {
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
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
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
      </div>
    </section>
  );
}
