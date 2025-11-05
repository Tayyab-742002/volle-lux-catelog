export function ProductCardSkeleton() {
  return (
    <div className="block border border-neutral-300 p-2">
      {/* Image Skeleton */}
      <div className="relative mb-3 aspect-square w-full overflow-hidden bg-neutral-300">
        <div className="h-full w-full animate-pulse bg-neutral-300" />
      </div>

      {/* Product Info Skeleton */}
      <div className="space-y-2">
        {/* Title Skeleton - 2 lines */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-full animate-pulse rounded bg-neutral-300" />
          <div className="h-3.5 w-4/5 animate-pulse rounded bg-neutral-300" />
        </div>

        {/* Price Row Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 animate-pulse rounded bg-neutral-300" />
          <div className="h-3 w-14 animate-pulse rounded bg-neutral-300" />
        </div>
      </div>
    </div>
  );
}
