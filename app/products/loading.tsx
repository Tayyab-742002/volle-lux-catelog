import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs skeleton */}
      <div className="mb-8 h-4 w-48 bg-muted rounded animate-pulse" />
      
      {/* Header skeleton */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-muted rounded animate-pulse" />
          <div className="h-5 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-10 w-[200px] bg-muted rounded animate-pulse" />
      </div>

      {/* Grid layout skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters skeleton */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 h-fit rounded-lg border bg-card p-6">
            <div className="space-y-6">
              <div className="h-6 w-24 bg-muted rounded animate-pulse" />
              <div className="space-y-4 border-b pb-6">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-2 w-full bg-muted rounded animate-pulse" />
                <div className="flex justify-between">
                  <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 w-full bg-muted rounded animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product grid skeleton */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

