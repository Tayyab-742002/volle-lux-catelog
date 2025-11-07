"use client";
import { useState } from "react";
import { VariantSelector } from "./variant-selector";
import { PricingTable } from "./pricing-table";
import { QuantityPriceSelector } from "./quantity-price-selector";
import { AddToCartButton } from "./add-to-cart-button";
import { Product, ProductVariant } from "@/types/product";

interface ProductPurchaseSectionProps {
  product: Product;
}

export function ProductPurchaseSection({
  product,
}: ProductPurchaseSectionProps) {
  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >(product.variants?.[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-8 md:space-y-10 bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-emerald-100">
      {/* Variant Selector */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-emerald-500"></div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700">
              Select Size
            </h3>
          </div>
          <VariantSelector
            variants={product.variants}
            label="Size"
            onVariantChange={(variantId) => {
              const variant = product.variants?.find((v) => v.id === variantId);
              setSelectedVariant(variant);
            }}
          />
        </div>
      )}

      {/* Pricing Table */}
      {product.pricingTiers && product.pricingTiers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-teal-500"></div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-700">
              Volume Pricing
            </h3>
          </div>
          <PricingTable
            tiers={product.pricingTiers}
            basePrice={product.basePrice}
          />
        </div>
      )}

      {/* Quantity Selector & Price Display */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-cyan-500"></div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-700">
            Quantity
          </h3>
        </div>
        <QuantityPriceSelector
          pricingTiers={product.pricingTiers || []}
          basePrice={product.basePrice}
          variantPriceAdjustment={selectedVariant?.price_adjustment || 0}
          onQuantityChange={setQuantity}
        />
      </div>

      {/* Add to Cart Button */}
      <div className="pt-4 border-t-2 border-emerald-100">
        <AddToCartButton
          product={product}
          variant={selectedVariant}
          quantity={quantity}
        />
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-100">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-xs font-semibold text-gray-700">Quality Assured</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-teal-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <p className="text-xs font-semibold text-gray-700">Fast Shipping</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-cyan-100 to-emerald-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-cyan-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              />
            </svg>
          </div>
          <p className="text-xs font-semibold text-gray-700">Eco-Friendly</p>
        </div>
      </div>
    </div>
  );
}
