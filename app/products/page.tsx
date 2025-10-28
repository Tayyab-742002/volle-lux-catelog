"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductCard } from "@/components/products/product-card";
import { ProductSort } from "@/components/products/product-sort";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Product } from "@/types/product";

// Disable static rendering
export const dynamic = "force-dynamic";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get active category from URL
  const activeCategory = searchParams.get("category");

  // Load all products once on mount
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setIsLoading(true);
        // Fetch from API route instead of direct Sanity import
        const response = await fetch("/api/products");
        const products = await response.json();
        if (!cancelled) {
          setAllProducts(products);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // Client-side filtering and sorting (INSTANT)
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Parse filters from URL
    const category = searchParams.get("category");
    const sizes = searchParams.get("size")?.split(",") || [];
    const materials = searchParams.get("material")?.split(",") || [];
    const ecoFriendly = searchParams.get("ecoFriendly")?.split(",") || [];
    const priceMin = parseInt(searchParams.get("priceMin") || "0");
    const priceMax = parseInt(searchParams.get("priceMax") || "1000");
    const sortBy = searchParams.get("sort") || "newest";

    // Apply filters
    if (category) {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (sizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.variants?.some((v) =>
          sizes.some((s) => v.name?.toLowerCase().includes(s.toLowerCase()))
        )
      );
    }

    if (materials.length > 0) {
      filtered = filtered.filter((p) =>
        materials.some(
          (m) =>
            p.name?.toLowerCase().includes(m.toLowerCase()) ||
            p.description?.toLowerCase().includes(m.toLowerCase())
        )
      );
    }

    if (ecoFriendly.length > 0) {
      filtered = filtered.filter((p) =>
        ecoFriendly.some(
          (eco) =>
            p.name?.toLowerCase().includes(eco.toLowerCase()) ||
            p.description?.toLowerCase().includes(eco.toLowerCase())
        )
      );
    }

    // Price range filter
    filtered = filtered.filter((p) => {
      const price = p.basePrice;
      return price >= priceMin && price <= priceMax;
    });

    // Apply sorting
    switch (sortBy) {
      case "newest":
        // Keep original order (newest first from Sanity)
        break;
      case "oldest":
        // Reverse order
        filtered.reverse();
        break;
      case "price-low":
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-high":
        filtered.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return filtered;
  }, [allProducts, searchParams]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  // Format category name for display
  const categoryDisplayName = activeCategory
    ? activeCategory
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : null;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Products", href: "/products" },
          ...(categoryDisplayName
            ? [
                {
                  label: categoryDisplayName,
                  href: `/products?category=${activeCategory}`,
                },
              ]
            : []),
        ]}
      />

      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 text-4xl font-bold md:text-5xl">
            {categoryDisplayName || "All Products"}
          </h1>
          <p className="text-muted-foreground">
            {categoryDisplayName && (
              <>
                Showing {filteredProducts.length} of {allProducts.length}{" "}
                products in {categoryDisplayName}
              </>
            )}
            {!categoryDisplayName && (
              <>
                Showing {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""}
              </>
            )}
          </p>
        </div>
        <ProductSort currentSort={searchParams.get("sort") || "newest"} />
      </div>

      {/* Main Content: 2-Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
              <h3 className="mb-2 text-lg font-semibold">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later for new products.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
