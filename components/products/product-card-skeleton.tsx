export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden bg-background p-4">
      {/* Image skeleton */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted animate-pulse" />

      {/* Info skeleton */}
      <div className="pt-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />

        {/* Price skeleton */}
        <div className="h-6 w-20 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}
