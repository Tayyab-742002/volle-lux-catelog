"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { Product } from "@/types/product";

// Mock data - will be replaced with Sanity CMS data later
const featuredProducts: Product[] = [
  {
    id: "1",
    product_code: "BOX-001",
    name: "Heavy Duty Shipping Boxes",
    slug: "heavy-duty-shipping-boxes",
    image:
      "https://images.unsplash.com/photo-1680034977375-3d83ee017e52?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    basePrice: 1.99,
    discount: 20,
    variants: [
      { id: "v1", name: "C4", sku: "BOX-001-C4", price_adjustment: 0 },
      { id: "v2", name: "C5", sku: "BOX-001-C5", price_adjustment: 0.5 },
      { id: "v3", name: "C6", sku: "BOX-001-C6", price_adjustment: 1.0 },
    ],
  },
  {
    id: "2",
    product_code: "WRAP-001",
    name: "Premium Bubble Wrap",
    slug: "premium-bubble-wrap",
    image:
      "https://images.unsplash.com/photo-1592829016842-156c305ecc7e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    basePrice: 2.49,
    discount: 15,
    variants: [
      { id: "v1", name: "Small", sku: "WRAP-001-S", price_adjustment: 0 },
      { id: "v2", name: "Medium", sku: "WRAP-001-M", price_adjustment: 0.5 },
      { id: "v3", name: "Large", sku: "WRAP-001-L", price_adjustment: 1.0 },
    ],
  },
  {
    id: "3",
    product_code: "ENV-001",
    name: "Bubble Mailers",
    slug: "bubble-mailers",
    image:
      "https://images.unsplash.com/photo-1617912760778-f3a1b93192ad?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    basePrice: 0.99,
    variants: [
      { id: "v1", name: "6x10", sku: "ENV-001-6x10", price_adjustment: 0 },
      { id: "v2", name: "9x12", sku: "ENV-001-9x12", price_adjustment: 0.3 },
      { id: "v3", name: "12x15", sku: "ENV-001-12x15", price_adjustment: 0.6 },
    ],
  },
  {
    id: "4",
    product_code: "PKG-001",
    name: "Eco-Friendly Packaging Tape",
    slug: "eco-friendly-packaging-tape",
    image:
      "https://images.unsplash.com/photo-1617912760717-06f3976cf18c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    basePrice: 3.99,
    discount: 10,
    variants: [
      { id: "v1", name: '1"', sku: "PKG-001-1", price_adjustment: 0 },
      { id: "v2", name: '2"', sku: "PKG-001-2", price_adjustment: 1.0 },
      { id: "v3", name: '3"', sku: "PKG-001-3", price_adjustment: 2.0 },
    ],
  },
  {
    id: "5",
    product_code: "BOX-002",
    name: "Custom Printed Boxes",
    slug: "custom-printed-boxes",
    image:
      "https://images.unsplash.com/photo-1577702312706-e23ff063064f?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
    basePrice: 4.99,
    discount: 25,
    variants: [
      { id: "v1", name: "S", sku: "BOX-002-S", price_adjustment: 0 },
      { id: "v2", name: "M", sku: "BOX-002-M", price_adjustment: 1.5 },
      { id: "v3", name: "L", sku: "BOX-002-L", price_adjustment: 3.0 },
    ],
  },
];

export function FeaturedProducts() {
  return (
    <section className="container mx-auto bg-muted/30 px-4 py-16 md:py-24">
      {/* Section Header */}
      <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="mb-2 text-4xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground">
            Our best-selling packaging solutions
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/products">
            View All
            <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
          </Link>
        </Button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
