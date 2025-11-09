// PERFORMANCE: Loading skeleton for ProductGallery dynamic import
export function ProductGallerySkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Main Image Skeleton */}
      <div className="aspect-square w-full bg-gray-200 rounded-2xl" />
      
      {/* Thumbnail Skeletons */}
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-16 w-16 sm:h-20 sm:w-20 bg-gray-200 rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}

