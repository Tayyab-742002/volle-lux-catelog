import { ProductCard } from "./product-card"
import { Product } from "@/types/product"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length > 0) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
      <h3 className="mb-2 text-lg font-semibold">No products found</h3>
      <p className="text-muted-foreground">
        Try adjusting your filters or check back later for new products.
      </p>
    </div>
  )
}

