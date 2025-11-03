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
    <div className="space-y-10">
      {/* Variant Selector */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-neutral-500">
            Select Size
          </h3>
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
          <h3 className="text-xs uppercase tracking-wider text-neutral-500">
            Volume Pricing
          </h3>
          <PricingTable
            tiers={product.pricingTiers}
            basePrice={product.basePrice}
          />
        </div>
      )}

      {/* Quantity Selector & Price Display */}
      <div className="space-y-4">
        <h3 className="text-xs uppercase tracking-wider text-neutral-500">
          Quantity
        </h3>
        <QuantityPriceSelector
          pricingTiers={product.pricingTiers || []}
          basePrice={product.basePrice}
          variantPriceAdjustment={selectedVariant?.price_adjustment || 0}
          onQuantityChange={setQuantity}
        />
      </div>

      {/* Add to Cart Button */}
      <AddToCartButton
        product={product}
        variant={selectedVariant}
        quantity={quantity}
      />
    </div>
  );
}
