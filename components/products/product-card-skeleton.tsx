export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card">
        {/* Image skeleton */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted animate-pulse" />

        {/* Info skeleton */}
        <div className="flex flex-1 flex-col p-2">
          {/* Title skeleton */}
          <div className="mb-0.5 space-y-0.5">
            <div className="h-2.5 w-full bg-muted rounded animate-pulse md:h-3" />
            <div className="h-2.5 w-2/3 bg-muted rounded animate-pulse md:h-3" />
          </div>

          {/* Price skeleton */}
          <div className="mt-auto">
            <div className="h-3 w-12 bg-muted rounded animate-pulse md:h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
