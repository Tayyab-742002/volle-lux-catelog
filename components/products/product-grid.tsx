import { ProductCard } from "./product-card"
import { Product } from "@/types/product"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length > 0) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-linear-to-br from-emerald-50 to-teal-50 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900">No products found</h3>
      <p className="text-gray-600 max-w-md">
        Try adjusting your filters or check back later for new products.
      </p>
    </div>
  )
}

