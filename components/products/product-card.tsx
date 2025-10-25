"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Badge */}
          {product.discount && (
            <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
              -{product.discount}%
            </Badge>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-sm font-medium transition-colors group-hover:text-primary">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mb-3 flex items-baseline gap-2">
            <p className="font-medium">From ${product.basePrice.toFixed(2)}</p>
            {product.variants && product.variants.length > 1 && (
              <span className="text-xs text-muted-foreground">
                (Bulk discounts available)
              </span>
            )}
          </div>

          {/* Quick Variants - Show first 3 sizes if available */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex gap-2">
              {product.variants.slice(0, 3).map((variant) => (
                <button
                  key={variant.id}
                  className="rounded border border-border px-2 py-1 text-xs transition-colors hover:border-primary hover:text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: Handle variant selection
                  }}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
