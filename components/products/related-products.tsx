import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types/product";

interface RelatedProductsProps {
  products: Product[];
  categoryName?: string;
  categorySlug?: string;
  currentProductId?: string;
}

export function RelatedProducts({
  products,
  categoryName,
  categorySlug,
  currentProductId,
}: RelatedProductsProps) {
  // Filter out current product and limit to 4 products
  const relatedProducts = products
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 md:mt-20 lg:mt-24 border-t-2 border-emerald-200 pt-12 md:pt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Related Products
          </h2>
          {categoryName && (
            <p className="text-gray-600">
              More {categoryName.toLowerCase()} products you might like
            </p>
          )}
        </div>
        {categorySlug && (
          <Button asChild variant="outline" className="hidden sm:flex">
            <Link href={`/products?category=${categorySlug}`}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {categorySlug && (
        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={`/products?category=${categorySlug}`}>
              View All {categoryName || "Products"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}

