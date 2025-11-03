"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group flex flex-col">
      <Link href={`/products/${product.slug}`} className="flex-1">
        <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:border-foreground/20 hover:shadow-md">
          {/* Image Container */}
          <div className="relative aspect-square w-full overflow-hidden bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              priority={false}
              placeholder="empty"
            />

            {/* Badge */}
            {product.discount && (
              <div className="absolute left-1.5 top-1.5">
                <span className="inline-flex items-center rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold text-primary-foreground md:px-2 md:py-0.5 md:text-[10px]">
                  -{product.discount}%
                </span>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-1 flex-col p-2">
            {/* Title */}
            <h3 className="mb-0.5 line-clamp-2 text-[10px] font-semibold leading-tight text-foreground transition-colors group-hover:text-primary md:text-xs">
              {product.name}
            </h3>

            {/* Price */}
            <div className="mt-auto flex items-baseline gap-1">
              <span className="text-xs font-bold text-foreground md:text-sm">
                ${product.basePrice.toFixed(2)}
              </span>
              {product.variants && product.variants.length > 1 && (
                <span className="text-[9px] text-muted-foreground md:text-[10px]">
                  From
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Quick Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {product.variants.slice(0, 2).map((variant) => (
            <Link
              key={variant.id}
              href={`/products/${product.slug}`}
              className="rounded border border-border bg-background px-1.5 py-0.5 text-[9px] font-medium text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground md:px-2 md:py-0.5 md:text-[10px]"
            >
              {variant.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
