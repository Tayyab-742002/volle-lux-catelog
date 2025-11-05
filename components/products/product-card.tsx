"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Assuming product has an array of images or a secondary image
  // Adjust based on your Product type structure
  // console.log(product);
  const primaryImage = product.image;
  const secondaryImage = product.images?.[2] || product.image;

  const hasVariants = product.variants && product.variants.length > 1;

  return (
    <div className="group flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="flex-1 border border-neutral-300 p-2 hover:border-neutral-400"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex h-full flex-col">
          {/* Image Container */}
          <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
            {/* Primary Image */}
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-500 ease-in-out ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              priority={false}
            />

            {/* Secondary Image (shows on hover) */}
            <Image
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              fill
              className={`object-cover transition-opacity duration-500 ease-in-out ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              priority={false}
            />

            {/* Discount Badge */}
            {Number(product.discount) !== 0 && (
              <div className="absolute right-2 top-2">
                <span className="bg-black px-2 py-1 text-xs font-medium tracking-wide text-white">
                  -{product.discount}%
                </span>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-1 flex-col pt-3">
            {/* Title */}
            <h3 className="mb-1.5 line-clamp-2 text-sm font-normal text-gray-900">
              {product.name}
            </h3>

            {/* Price & Variants Indicator */}
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-medium text-gray-900">
                  ${product.basePrice.toFixed(2)}
                </span>
                {hasVariants && (
                  <span className="text-xs text-gray-400">+</span>
                )}
              </div>

              {/* Variants Count Badge */}
              {hasVariants && product.variants && (
                <span className="text-xs text-gray-500">
                  {product.variants.length} options
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
