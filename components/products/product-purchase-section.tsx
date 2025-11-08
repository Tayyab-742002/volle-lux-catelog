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
    <div className="space-y-8 md:space-y-10 bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-300">
      {/* Variant Selector */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
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
        <QuantityPriceSelector
          pricingTiers={product.pricingTiers || []}
          basePrice={product.basePrice}
          variantPriceAdjustment={selectedVariant?.price_adjustment || 0}
          onQuantityChange={setQuantity}
        />
      </div>

      {/* Add to Cart Button */}
      <div className="pt-4 border-t border-gray-300">
        <AddToCartButton
          product={product}
          variant={selectedVariant}
          quantity={quantity}
        />
      </div>
    </div>
  );
}
