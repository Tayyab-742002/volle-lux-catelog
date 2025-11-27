"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PricingTier } from "@/types/product";

interface QuantityPriceSelectorProps {
  pricingTiers: PricingTier[];
  basePrice: number;
  variantPriceAdjustment?: number;
  onQuantityChange?: (quantity: number) => void;
  initialQuantity?: number; // For products with quantity options (base quantity)
  baseQuantity?: number; // Base quantity from quantity option (for calculating total)
  quantityOptionPrice?: number; // Price per unit from selected quantity option (takes priority)
  showQuantityInput?: boolean; // Whether to show the quantity input field
  minQuantity?: number; // Minimum allowed quantity (defaults to 1)
}

export function QuantityPriceSelector({
  pricingTiers,
  basePrice,
  variantPriceAdjustment = 0,
  onQuantityChange,
  initialQuantity = 1,
  baseQuantity = 0, // If set, this is the base from quantity option
  quantityOptionPrice, // Price per unit from selected quantity option
  showQuantityInput = true,
  minQuantity = 1, // Minimum allowed quantity
}: QuantityPriceSelectorProps) {
  // Calculate the actual quantity to display (base + additional)
  // Ensure it's at least the minimum quantity
  const displayQuantity = Math.max(
    minQuantity,
    baseQuantity > 0 ? baseQuantity + (initialQuantity - 1) : initialQuantity
  );
  
  const [quantity, setQuantity] = useState(displayQuantity);
  const [quantityInput, setQuantityInput] = useState<string>(displayQuantity.toString());

  // Update quantity when initialQuantity, baseQuantity, or minQuantity changes
  useEffect(() => {
    const newDisplayQuantity = Math.max(
      minQuantity,
      baseQuantity > 0 ? baseQuantity + (initialQuantity - 1) : initialQuantity
    );
    setQuantity(newDisplayQuantity);
    setQuantityInput(newDisplayQuantity.toString());
  }, [initialQuantity, baseQuantity, minQuantity]);

  // Calculate the active tier and price based on quantity
  // Priority: quantity option price > pricing tiers > base price
  const { activeTier, pricePerUnit, totalPrice, savings } = useMemo(() => {
    const adjustedBasePrice = basePrice + variantPriceAdjustment;

    // If quantity option has a specific price, use it (highest priority)
    if (quantityOptionPrice !== undefined && quantityOptionPrice > 0) {
      const total = quantityOptionPrice * quantity;
      const baseTotal = adjustedBasePrice * quantity;
      const savingsAmount = Math.max(0, baseTotal - total);
      
      return {
        activeTier: null, // No tier when using quantity option price
        pricePerUnit: quantityOptionPrice,
        totalPrice: total,
        savings: savingsAmount,
      };
    }

    // If no tiers, use base price
    if (!pricingTiers || pricingTiers.length === 0) {
      return {
        activeTier: null,
        pricePerUnit: adjustedBasePrice,
        totalPrice: adjustedBasePrice * quantity,
        savings: 0,
      };
    }

    // Find the appropriate tier based on quantity
    // Sort tiers by minQuantity descending to find the highest applicable tier
    const sortedTiers = [...pricingTiers].sort((a, b) => b.minQuantity - a.minQuantity);
    const tier = sortedTiers.find((t) => {
      const minMatch = quantity >= t.minQuantity;
      const maxMatch = t.maxQuantity ? quantity <= t.maxQuantity : true;
      return minMatch && maxMatch;
    });

    if (!tier) {
      return {
        activeTier: null,
        pricePerUnit: adjustedBasePrice,
        totalPrice: adjustedBasePrice * quantity,
        savings: 0,
      };
    }

    // Calculate price per unit using discount percentage
    const unitPrice = tier.discount > 0
      ? adjustedBasePrice * (1 - tier.discount / 100)
      : adjustedBasePrice;

    const total = unitPrice * quantity;
    const baseTotal = adjustedBasePrice * quantity;
    const savingsAmount = Math.max(0, baseTotal - total);

    return {
      activeTier: tier,
      pricePerUnit: unitPrice,
      totalPrice: total,
      savings: savingsAmount,
    };
  }, [quantity, pricingTiers, basePrice, variantPriceAdjustment, quantityOptionPrice]);

  // Sync input when quantity changes externally
  useEffect(() => {
    setQuantityInput(quantity.toString());
  }, [quantity]);

  const handleQuantityChange = (value: string) => {
    // Allow empty string for easier editing
    setQuantityInput(value);
    
    // Only update if it's a valid number
    if (value === "") {
      return; // Allow empty temporarily
    }
    
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= minQuantity) {
      setQuantity(numValue);
      onQuantityChange?.(numValue);
    }
  };

  const handleQuantityBlur = () => {
    // When user leaves the field, ensure it has a valid value (at least minQuantity)
    const numValue = parseInt(quantityInput, 10);
    if (isNaN(numValue) || numValue < minQuantity) {
      const enforcedQuantity = minQuantity;
      setQuantityInput(enforcedQuantity.toString());
      setQuantity(enforcedQuantity);
      onQuantityChange?.(enforcedQuantity);
    } else {
      setQuantityInput(numValue.toString());
    }
  };

  return (
    <div className="space-y-6">
      {/* Quantity Input */}
      {showQuantityInput && (
        <div className="space-y-2">
          <Label htmlFor="quantity" className="label-luxury">
            Quantity
          </Label>
          <Input
            id="quantity"
            type="text"
            inputMode="numeric"
            min={minQuantity.toString()}
            value={quantityInput}
            onChange={(e) => {
              const value = e.target.value;
              // Only allow numbers and empty string
              if (value === "" || /^\d+$/.test(value)) {
                handleQuantityChange(value);
              }
            }}
            onBlur={handleQuantityBlur}
            className="w-32 border border-gray-400 focus-visible:ring-emerald-600/50! focus-visible:ring-2!"
            aria-label={`Quantity (minimum ${minQuantity})`}
          />
        </div>
      )}

      {/* Dynamic Price Display */}
      <div className="space-y-2 rounded-lg border border-gray-300 bg-white p-6">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            £{pricePerUnit.toFixed(2)}
          </span>
          <span className="text-sm text-gray-600">per unit</span>
        </div>
        {quantity > 1 && (
          <div className="text-sm text-gray-600">
            Total:{" "}
            <span className="font-bold text-gray-900">
              £{totalPrice.toFixed(2)}
            </span>
          </div>
        )}
        {activeTier && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {activeTier.label && (
              <div className="inline-block rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
                {activeTier.label}
              </div>
            )}
            {savings > 0 && (
              <div className="text-sm text-emerald-600 font-medium">
                Save £{savings.toFixed(2)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
