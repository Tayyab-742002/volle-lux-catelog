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

  const primaryImage = product.image;
  const secondaryImage = product.images?.[2] || product.image;
  const hasVariants = product.variants && product.variants.length > 1;
  // Check if we should show price or "Open to view prices"
  const shouldShowPrice = product.basePrice !== 0;
  const displayPrice = product.basePrice;

  return (
    <div className="group flex flex-col h-full">
      <Link
        href={`/products/${product.slug}`}
        className="flex-1 relative overflow-hidden rounded-xl bg-white border border-gray-300 hover:border-emerald-300 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient Ring Effect on Hover */}
        <div
          className="absolute inset-0 rounded-xl bg-linear-to-br from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
          style={{ padding: "2px" }}
        ></div>

        <div className="flex h-full flex-col p-3">
          {/* Image Container */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg mb-3">
            {/* Primary Image */}
            <Image
              src={primaryImage}
              alt={product.imageAlt || product.name}
              fill
              className={`object-cover transition-all duration-500 ease-in-out ${
                isHovered ? "opacity-0 scale-110" : "opacity-100 scale-100"
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              priority={false}
              loading="lazy" // PERFORMANCE: Lazy load product images
            />

            {/* Secondary Image (shows on hover) */}
            <Image
              src={secondaryImage}
              alt={
                product.imagesAlt?.[2] ||
                product.imagesAlt?.[0] ||
                `${product.imageAlt || product.name} - Alternate view`
              }
              fill
              className={`object-cover transition-all duration-500 ease-in-out ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-110"
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              priority={false}
              loading="lazy" // PERFORMANCE: Lazy load product images
            />

            {/* Discount Badge */}
            {Number(product.discount) !== 0 && (
              <div className="absolute right-2 top-2 z-10">
                <span className="bg-linear-to-r from-orange-600 to-red-600 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide text-white shadow-lg">
                  -{product.discount}% OFF
                </span>
              </div>
            )}

            {/* Eco Badge (optional - if you have an eco flag) */}
            {/* Uncomment if your product has an isEcoFriendly property */}
            {/* {product.isEcoFriendly && (
              <div className="absolute left-2 top-2 z-10">
                <span className="bg-linear-to-r from-emerald-500 to-teal-500 px-2 py-1 rounded-full text-[10px] font-bold text-white shadow-lg flex items-center gap-1">
                  🌱 ECO
                </span>
              </div>
            )} */}
          </div>

          {/* Info Section */}
          <div className="flex flex-1 flex-col">
            {/* Title */}
            <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-white transition-colors">
              {product.name}
            </h3>

            {/* Price & Variants Section */}
            <div className="mt-auto space-y-2">
              {/* Price or "Open to view prices" */}
              <div className="flex items-baseline gap-2">
                {shouldShowPrice ? (
                  <>
                    <span className="text-base font-bold text-gray-900">
                      £{displayPrice.toFixed(2)}
                    </span>
                    {hasVariants && (
                      <span className="text-xs font-medium text-emerald-600 group-hover:text-white">
                        +
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-sm font-medium text-emerald-600 group-hover:text-white italic">
                    Open to view prices
                  </span>
                )}
              </div>

              {/* Variants Indicator */}
              {hasVariants && product.variants && (
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-1">
                    {product.variants.slice(0, 3).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-1.5 w-1.5 rounded-full bg-linear-to-r from-emerald-400 to-teal-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-white/70">
                    {product.variants.length} options
                  </span>
                </div>
              )}

              {/* Quick View Indicator */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs font-normal  group-hover:text-white flex items-center gap-1">
                  View Details →
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
