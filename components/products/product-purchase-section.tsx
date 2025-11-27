"use client";
import { useState, useMemo } from "react";
import { VariantSelector } from "./variant-selector";
import { PricingTable } from "./pricing-table";
import { QuantityPriceSelector } from "./quantity-price-selector";
import { QuantityOptionsSelector } from "./quantity-options-selector";
import { AddToCartButton } from "./add-to-cart-button";
import { Product, ProductVariant } from "@/types/product";
import { calculatePricePerUnit } from "@/services/pricing/pricing.service";

interface ProductPurchaseSectionProps {
  product: Product;
}

// Helper function to get the first/lowest quantity option
// Skips quantity = 1 options (they're hidden from display but used for discount calculations)
function getFirstQuantityOption(
  quantityOptions?: ProductVariant["quantityOptions"]
): { quantity: number; pricePerUnit?: number } | null {
  if (!quantityOptions || quantityOptions.length === 0) {
    return null;
  }

  const activeOptions = quantityOptions
    .filter((opt) => opt.isActive && opt.quantity !== 1) // Skip quantity = 1
    .sort((a, b) => a.quantity - b.quantity);

  if (activeOptions.length > 0) {
    const firstOption = activeOptions[0];
    return {
      quantity: firstOption.quantity,
      pricePerUnit: firstOption.pricePerUnit,
    };
  }

  return null;
}

// Helper function to get the minimum quantity from visible options
// Returns the smallest quantity option (excluding quantity = 1) or 1 if no options
function getMinimumQuantity(
  quantityOptions?: ProductVariant["quantityOptions"]
): number {
  if (!quantityOptions || quantityOptions.length === 0) {
    return 1; // Default minimum
  }

  const visibleOptions = quantityOptions
    .filter((opt) => opt.isActive && opt.quantity !== 1) // Skip quantity = 1
    .sort((a, b) => a.quantity - b.quantity);

  if (visibleOptions.length > 0) {
    return visibleOptions[0].quantity;
  }

  return 1; // Default minimum if no visible options
}

export function ProductPurchaseSection({
  product,
}: ProductPurchaseSectionProps) {
  // Initialize with first variant
  const firstVariant = product.variants?.[0];

  // Initialize with first quantity option if first variant has options
  const initialQuantityOption = firstVariant
    ? getFirstQuantityOption(firstVariant.quantityOptions)
    : null;

  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >(firstVariant);
  const [quantity, setQuantity] = useState(1);
  const [selectedQuantityOption, setSelectedQuantityOption] = useState<{
    quantity: number;
    pricePerUnit?: number;
  } | null>(initialQuantityOption);

  // Helper to handle variant change with auto-selection of first quantity option
  const handleVariantChange = (variantId: string) => {
    const variant = product.variants?.find((v) => v.id === variantId);
    setSelectedVariant(variant);

    // Reset quantity
    setQuantity(1);

    // If variant has quantity options, auto-select the first/lowest one
    if (variant?.quantityOptions && variant.quantityOptions.length > 0) {
      const firstOption = getFirstQuantityOption(variant.quantityOptions);
      if (firstOption) {
        setSelectedQuantityOption(firstOption);
      } else {
        setSelectedQuantityOption(null);
      }
    } else {
      // If variant has no quantity options, clear selection
      setSelectedQuantityOption(null);
    }
  };

  // Helper function to find the best matching quantity option
  // Returns the largest quantity option that is <= the input quantity
  // Skips quantity = 1 options (they're hidden from display but used for discount calculations)
  const findMatchingQuantityOption = (
    inputQuantity: number,
    quantityOptions?: ProductVariant["quantityOptions"]
  ): { quantity: number; pricePerUnit?: number } | null => {
    if (!quantityOptions || quantityOptions.length === 0) {
      return null;
    }

    // Filter active options (excluding quantity = 1) and sort by quantity descending
    const activeOptions = quantityOptions
      .filter((opt) => opt.isActive && opt.quantity !== 1) // Skip quantity = 1
      .sort((a, b) => b.quantity - a.quantity);

    // Find the largest option that is <= input quantity
    const matchingOption = activeOptions.find(
      (opt) => opt.quantity <= inputQuantity
    );

    if (matchingOption) {
      return {
        quantity: matchingOption.quantity,
        pricePerUnit: matchingOption.pricePerUnit,
      };
    }

    return null;
  };

  // Calculate total quantity (quantity option base + additional quantity)
  const totalQuantity = useMemo(() => {
    if (selectedQuantityOption) {
      return selectedQuantityOption.quantity + (quantity - 1);
    }
    return quantity;
  }, [selectedQuantityOption, quantity]);

  // Calculate the final price per unit based on total quantity with pricing tiers
  // Priority: quantity option price > pricing tiers > base price
  const calculatedPricePerUnit = useMemo(() => {
    const adjustedBasePrice =
      product.basePrice + (selectedVariant?.price_adjustment || 0);

    // If quantity option has a specific pricePerUnit, use it (highest priority)
    if (
      selectedQuantityOption?.pricePerUnit !== undefined &&
      selectedQuantityOption.pricePerUnit > 0
    ) {
      return selectedQuantityOption.pricePerUnit;
    }

    // If pricing tiers exist, apply them based on total quantity
    if (product.pricingTiers && product.pricingTiers.length > 0) {
      return calculatePricePerUnit(
        totalQuantity,
        product.basePrice,
        product.pricingTiers,
        selectedVariant?.price_adjustment || 0
      );
    }

    // Fallback to base + variant adjustment
    return adjustedBasePrice;
  }, [
    product.basePrice,
    product.pricingTiers,
    selectedVariant,
    totalQuantity,
    selectedQuantityOption,
  ]);

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
            onVariantChange={handleVariantChange}
          />
        </div>
      )}

      {/* Quantity Options Selector (only show if selected variant has quantity options) */}
      {selectedVariant?.quantityOptions &&
        selectedVariant.quantityOptions.length > 0 && (
          <div className="space-y-4" key={selectedVariant.id}>
            <QuantityOptionsSelector
              quantityOptions={selectedVariant.quantityOptions}
              selectedQuantity={selectedQuantityOption?.quantity}
              onQuantityOptionChange={(qty, pricePerUnit) => {
                setSelectedQuantityOption({ quantity: qty, pricePerUnit });
                // Reset quantity selector to 1 when a new option is selected
                // The total will be qty + (quantity - 1)
                setQuantity(1);
              }}
              allowCustomQuantity={false}
            />
            {/* Info text for auto-selection */}
            {selectedVariant.quantityOptions.length > 0 && (
              <p className="text-xs text-gray-500 italic">
                Tip: Enter a custom quantity and we&apos;ll automatically select
                the best pack size for you
              </p>
            )}
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
            variantPriceAdjustment={selectedVariant?.price_adjustment || 0}
          />
        </div>
      )}

      {/* Quantity Selector & Price Display */}
      {/* Show quantity selector for all products, including those with quantity options */}
      <div className="space-y-4">
        {selectedVariant?.quantityOptions &&
        selectedVariant.quantityOptions.length > 0 ? (
          // Quantity selector for products with quantity options
          // Auto-selects quantity option based on input
          // Key prop ensures component remounts when variant changes, resetting quantity
          (() => {
            const minQuantity = getMinimumQuantity(
              selectedVariant.quantityOptions
            );
            return (
              <QuantityPriceSelector
                key={`quantity-selector-${selectedVariant?.id || "no-variant"}-${selectedQuantityOption?.quantity || "no-option"}`}
                pricingTiers={product.pricingTiers || []}
                basePrice={product.basePrice}
                variantPriceAdjustment={selectedVariant?.price_adjustment || 0}
                initialQuantity={1}
                baseQuantity={selectedQuantityOption?.quantity || 0}
                quantityOptionPrice={selectedQuantityOption?.pricePerUnit}
                minQuantity={minQuantity}
                onQuantityChange={(newTotalQuantity) => {
                  // Enforce minimum quantity
                  const enforcedQuantity = Math.max(
                    minQuantity,
                    newTotalQuantity
                  );

                  // Auto-select the best matching quantity option
                  const matchingOption = findMatchingQuantityOption(
                    enforcedQuantity,
                    selectedVariant.quantityOptions
                  );

                  if (matchingOption) {
                    // If a matching option is found, select it
                    setSelectedQuantityOption(matchingOption);
                    // Calculate additional quantity beyond the base option
                    const additionalQuantity =
                      enforcedQuantity - matchingOption.quantity;
                    setQuantity(Math.max(1, additionalQuantity + 1));
                  } else {
                    // No matching option found, use direct quantity
                    // This happens when input is less than the smallest option
                    setSelectedQuantityOption(null);
                    setQuantity(enforcedQuantity);
                  }
                }}
                showQuantityInput={true}
              />
            );
          })()
        ) : (
          // Standard quantity selector for products without quantity options
          // Key prop ensures component remounts when variant changes, resetting quantity
          <QuantityPriceSelector
            key={`quantity-selector-${selectedVariant?.id || "no-variant"}`}
            pricingTiers={product.pricingTiers || []}
            basePrice={product.basePrice}
            variantPriceAdjustment={selectedVariant?.price_adjustment || 0}
            initialQuantity={1}
            onQuantityChange={setQuantity}
          />
        )}
      </div>

      {/* Add to Cart Button */}
      <div className="pt-4 border-t border-gray-300">
        <AddToCartButton
          product={product}
          variant={selectedVariant}
          quantity={totalQuantity}
          quantityOptionPrice={calculatedPricePerUnit}
        />
      </div>
    </div>
  );
}
