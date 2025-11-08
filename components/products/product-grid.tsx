import { ProductCard } from "./product-card"
import { Product } from "@/types/product"
import { Package } from "lucide-react"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length > 0) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-linear-to-br from-emerald-50 to-teal-50 py-12 sm:py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-emerald-100 to-teal-100 border border-emerald-200">
        <Package className="h-8 w-8 text-emerald-600" strokeWidth={2} />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-300 max-w-md">
        <h3 className="mb-2 text-lg font-bold text-gray-900">No products found</h3>
        <p className="text-sm text-gray-600">
          Try adjusting your filters or check back later for new products.
        </p>
      </div>
    </div>
  )
}

