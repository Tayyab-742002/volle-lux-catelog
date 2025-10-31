"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // If no images provided, use placeholder
  const displayImages =
    images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1680034977375-3d83ee017e52?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
        ];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
        <Image
          src={displayImages[selectedImageIndex]}
          alt={`${productName} - Image ${selectedImageIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
          priority={selectedImageIndex === 0}
          placeholder="empty"
        />
      </div>

      {/* Thumbnail Images */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 p-4 scrollbar-hide">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                index === selectedImageIndex
                  ? "border-primary scale-105"
                  : "border-border hover:border-primary/50"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                placeholder="empty"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
