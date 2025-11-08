import { Suspense } from "react"
import { ProductGrid } from "./product-grid"
import { ProductCardSkeleton } from "./product-card-skeleton"
import {
  getFilteredProducts,
  getProducts,
  searchProducts,
} from "@/services/products/product.service"

interface ProductGridWrapperProps {
  searchParams: {
    search?: string
    category?: string
    size?: string
    material?: string
    ecoFriendly?: string
    priceMin?: string
    priceMax?: string
    sort?: string
  }
}

async function ProductGridContent({ searchParams }: ProductGridWrapperProps) {
  const searchQuery = searchParams.search?.trim()
  const category = searchParams.category
  const sizes = searchParams.size ? searchParams.size.split(",") : []
  const materials = searchParams.material ? searchParams.material.split(",") : []
  const ecoFriendly = searchParams.ecoFriendly ? searchParams.ecoFriendly.split(",") : []
  const priceMin = Number(searchParams.priceMin || 0)
  const priceMax = Number(searchParams.priceMax || 100000)
  const sortBy = searchParams.sort || "newest"

  // If search query exists, use search instead of filters
  let products
  if (searchQuery) {
    products = await searchProducts(searchQuery)
  } else {
    products = await getFilteredProducts(
      {
        category,
        size: sizes,
        material: materials,
        ecoFriendly,
        priceMin,
        priceMax,
      },
      sortBy
    )
    if (!products || products.length === 0) {
      products = await getProducts()
    }
  }

  return <ProductGrid products={products} />
}

export function ProductGridWrapper({ searchParams }: ProductGridWrapperProps) {
  return (
    <div className="rounded-xl border border-gray-300 bg-white p-4 sm:p-6 shadow-lg">
      <Suspense
        fallback={
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <ProductGridContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

