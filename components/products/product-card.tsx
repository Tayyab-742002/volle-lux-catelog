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
        <div className="flex h-full flex-col overflow-hidden">
          {/* Image Container */}
          <div className="relative aspect-square w-full overflow-hidden bg-neutral-50">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-all duration-500 group-hover:opacity-90"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              priority={false}
              placeholder="empty"
            />

            {/* Badge */}
            {product.discount && (
              <div className="absolute right-3 top-3">
                <span className="inline-flex items-center bg-neutral-900 px-2.5 py-1 text-xs font-normal text-white">
                  -{product.discount}%
                </span>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-1 flex-col py-4">
            {/* Title */}
            <h3 className="mb-2 line-clamp-2 text-sm font-normal leading-tight text-neutral-900 transition-colors group-hover:text-neutral-600">
              {product.name}
            </h3>

            {/* Price */}
            <div className="mt-auto flex items-baseline gap-1.5">
              <span className="text-base font-normal text-neutral-900">
                ${product.basePrice.toFixed(2)}
              </span>
              {product.variants && product.variants.length > 1 && (
                <span className="text-xs text-neutral-500">from</span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Quick Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {product.variants.slice(0, 3).map((variant) => (
            <Link
              key={variant.id}
              href={`/products/${product.slug}`}
              className="border-b border-neutral-300 pb-0.5 text-xs text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
            >
              {variant.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
