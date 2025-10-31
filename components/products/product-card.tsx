"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group">
      <Link href={`/products/${product.slug}`}>
        <div className="overflow-hidden bg-background p-4 transition-shadow duration-300 hover:shadow-xl">
          {/* Image Container - 90% of card */}
          <div className="relative aspect-square w-full overflow-hidden bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={false}
              placeholder="empty"
            />

            {/* Badge - Accent color pill */}
            {product.discount && (
              <div className="absolute left-3 top-3">
                <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
                  -{product.discount}%
                </span>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="pt-4">
            {/* Title */}
            <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
              {product.name}
            </h3>

            {/* Price */}
            <div className="mb-3 flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">
                ${product.basePrice.toFixed(2)}
              </span>
              {product.variants && product.variants.length > 1 && (
                <span className="text-xs text-muted-foreground">From</span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Quick Variants - Separate from link to navigate to product page */}
      {product.variants && product.variants.length > 0 && (
        <div className="flex gap-2 px-4 pb-4">
          {product.variants.slice(0, 3).map((variant) => (
            <Link
              key={variant.id}
              href={`/products/${product.slug}`}
              className="rounded border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              {variant.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
