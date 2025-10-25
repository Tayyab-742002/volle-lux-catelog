"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { Product } from "@/types/product";

// Mock data - will be replaced with Sanity CMS data later
const newArrivals: Product[] = [
  {
    id: "6",
    product_code: "ECO-001",
    name: "Compostable Poly Mailers",
    slug: "compostable-poly-mailers",
    image:
      "https://images.unsplash.com/photo-1513004132127-ade5a645d3e0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1548",
    basePrice: 1.49,
    discount: 20,
    variants: [
      { id: "v1", name: "A6", sku: "ECO-001-A6", price_adjustment: 0 },
      { id: "v2", name: "A7", sku: "ECO-001-A7", price_adjustment: 0.2 },
      { id: "v3", name: "A8", sku: "ECO-001-A8", price_adjustment: 0.4 },
    ],
  },

  {
    id: "8",
    product_code: "TUBE-001",
    name: "Shipping Tubes",
    slug: "shipping-tubes",
    image:
      "https://images.unsplash.com/photo-1717323788190-315b59cc7607?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    basePrice: 0.79,
    variants: [
      { id: "v1", name: "6x24", sku: "TUBE-001-6x24", price_adjustment: 0 },
      { id: "v2", name: "6x36", sku: "TUBE-001-6x36", price_adjustment: 0.3 },
      { id: "v3", name: "8x36", sku: "TUBE-001-8x36", price_adjustment: 0.6 },
    ],
  },
  {
    id: "9",
    product_code: "LABEL-001",
    name: "Shipping Labels",
    slug: "shipping-labels",
    image:
      "https://images.unsplash.com/photo-1758351507026-71ad3645cb43?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1548",
    basePrice: 4.99,
    discount: 10,
    variants: [
      { id: "v1", name: "4x6", sku: "LABEL-001-4x6", price_adjustment: 0 },
      { id: "v2", name: "4x8", sku: "LABEL-001-4x8", price_adjustment: 1.0 },
      { id: "v3", name: "6x9", sku: "LABEL-001-6x9", price_adjustment: 2.0 },
    ],
  },
  {
    id: "10",
    product_code: "COOL-001",
    name: "Insulated Bubble Bags",
    slug: "insulated-bubble-bags",
    image:
      "https://images.unsplash.com/photo-1620924696503-52ec36cbb470?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    basePrice: 2.99,
    discount: 18,
    variants: [
      { id: "v1", name: "Small", sku: "COOL-001-S", price_adjustment: 0 },
      { id: "v2", name: "Medium", sku: "COOL-001-M", price_adjustment: 0.8 },
      { id: "v3", name: "Large", sku: "COOL-001-L", price_adjustment: 1.5 },
    ],
  },
];

export function NewArrivals() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      {/* Section Header */}
      <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="mb-2 text-4xl font-bold">New Arrivals</h2>
          <p className="text-muted-foreground">
            Discover our latest packaging innovations
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/products?sort=newest">
            View All
            <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
          </Link>
        </Button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {newArrivals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
