"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PricingTier } from "@/types/product";

interface QuantityPriceSelectorProps {
  pricingTiers: PricingTier[];
  basePrice: number;
  variantPriceAdjustment?: number;
  onQuantityChange?: (quantity: number) => void;
}

export function QuantityPriceSelector({
  pricingTiers,
  basePrice,
  variantPriceAdjustment = 0,
  onQuantityChange,
}: QuantityPriceSelectorProps) {
  const [quantity, setQuantity] = useState(1);

  // Calculate the active tier and price based on quantity
  const { activeTier, pricePerUnit, totalPrice } = useMemo(() => {
    const adjustedBasePrice = basePrice + variantPriceAdjustment;

    // If no tiers, use base price
    if (!pricingTiers || pricingTiers.length === 0) {
      return {
        activeTier: null,
        pricePerUnit: adjustedBasePrice,
        totalPrice: adjustedBasePrice * quantity,
      };
    }

    // Find the appropriate tier based on quantity
    const tier = pricingTiers.find((t) => {
      const minMatch = quantity >= t.minQuantity;
      const maxMatch = t.maxQuantity ? quantity <= t.maxQuantity : true;
      return minMatch && maxMatch;
    });

    // Use the tier price if found, otherwise use base price
    const unitPrice = tier?.pricePerUnit || adjustedBasePrice;

    return {
      activeTier: tier || null,
      pricePerUnit: unitPrice,
      totalPrice: unitPrice * quantity,
    };
  }, [quantity, pricingTiers, basePrice, variantPriceAdjustment]);

  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setQuantity(numValue);
      onQuantityChange?.(numValue);
    } else if (value === "") {
      setQuantity(1);
      onQuantityChange?.(1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quantity Input */}
      <div className="space-y-2">
        <Label htmlFor="quantity" className="label-luxury">
          Quantity
        </Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
          className="w-32"
        />
      </div>

      {/* Dynamic Price Display */}
      <div className="space-y-2 rounded-lg border bg-muted/30 p-6">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">${pricePerUnit.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">per unit</span>
        </div>
        {quantity > 1 && (
          <div className="text-sm text-muted-foreground">
            Total:{" "}
            <span className="font-semibold">${totalPrice.toFixed(2)}</span>
          </div>
        )}
        {activeTier?.label && (
          <div className="mt-2 inline-block rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {activeTier.label}
          </div>
        )}
      </div>
    </div>
  );
}
