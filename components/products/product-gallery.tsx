"use client";
import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const displayImages =
    images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1680034977375-3d83ee017e52?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
        ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Main Image */}
      <div className="relative group">
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>

        <div className="relative aspect-square w-full overflow-hidden bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 shadow-xl">
          <Image
            src={displayImages[selectedImageIndex]}
            alt={`${productName} - Image ${selectedImageIndex + 1}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={selectedImageIndex === 0}
            placeholder="empty"
          />
        </div>
      </div>

      {/* Thumbnail Images */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative h-20 w-20 m-2 md:h-24 md:w-24 shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${
                index === selectedImageIndex
                  ? "ring-4 ring-emerald-500 scale-105 shadow-lg"
                  : "ring-2 ring-emerald-200 opacity-60 hover:opacity-100 hover:ring-emerald-400 hover:scale-105"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <div className="absolute inset-0 bg-linear-to-br from-emerald-50 to-teal-50"></div>
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
                placeholder="empty"
              />
              {/* Active Indicator */}
              {index === selectedImageIndex && (
                <div className="absolute inset-0 border-2 border-white rounded-xl"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {displayImages.length > 1 && (
        <div className="flex justify-center">
          <span className="text-sm text-gray-600 font-medium">
            {selectedImageIndex + 1} / {displayImages.length}
          </span>
        </div>
      )}
    </div>
  );
}
