"use client";

import { useMemo } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { QuantityOption } from "@/types/product";

interface QuantityOptionsSelectorProps {
  quantityOptions: QuantityOption[];
  selectedQuantity?: number;
  onQuantityOptionChange?: (quantity: number, pricePerUnit?: number) => void;
  allowCustomQuantity?: boolean; // Deprecated: kept for backward compatibility but not used
}

export function QuantityOptionsSelector({
  quantityOptions,
  selectedQuantity,
  onQuantityOptionChange,
}: QuantityOptionsSelectorProps) {
  // Find the base price option (quantity = 1) to use for discount calculation
  // The first index should have price for 1 item according to user requirements
  // Must be called before early return
  const basePriceOption = useMemo(() => {
    if (!quantityOptions || quantityOptions.length === 0) {
      return null;
    }
    // First, try to find quantity = 1 option
    const singleItemOption = quantityOptions.find(
      (opt) =>
        opt.quantity === 1 && opt.isActive && opt.pricePerUnit !== undefined
    );

    if (singleItemOption) {
      return singleItemOption;
    }

    // If no quantity = 1, use the first option (smallest quantity) as base
    const sortedOptions = [...quantityOptions]
      .filter((opt) => opt.isActive && opt.pricePerUnit !== undefined)
      .sort((a, b) => a.quantity - b.quantity);

    return sortedOptions.length > 0 ? sortedOptions[0] : null;
  }, [quantityOptions]);

  // Initialize selected option from props
  // Use key prop on ToggleGroup to reset when quantityOptions change
  const selectedOption =
    selectedQuantity &&
    quantityOptions?.find((opt) => opt.quantity === selectedQuantity)
      ? selectedQuantity
      : null;

  // Calculate discount percentage for each option
  const getDiscountPercentage = (option: QuantityOption): number | null => {
    if (
      !basePriceOption ||
      !basePriceOption.pricePerUnit ||
      basePriceOption.pricePerUnit <= 0
    ) {
      return null;
    }

    if (!option.pricePerUnit || option.pricePerUnit <= 0) {
      return null;
    }

    // If this is the base option itself, no discount
    if (option.quantity === basePriceOption.quantity) {
      return null;
    }

    // Calculate discount percentage
    const discount =
      ((basePriceOption.pricePerUnit - option.pricePerUnit) /
        basePriceOption.pricePerUnit) *
      100;

    // Only return positive discounts
    return discount > 0 ? Math.round(discount) : null;
  };

  const handleOptionSelect = (quantity: number, pricePerUnit?: number) => {
    onQuantityOptionChange?.(quantity, pricePerUnit);
  };

  if (!quantityOptions || quantityOptions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700">
          Quantity
        </h3>
      </div>

      {/* Quantity Options Buttons */}
      {/* Filter out quantity = 1 options from display, but keep them for discount calculations */}
      <ToggleGroup
        key={`quantity-options-${quantityOptions.map((opt) => opt.quantity).join("-")}`}
        type="single"
        value={selectedOption?.toString() || ""}
        onValueChange={(value) => {
          if (value) {
            const option = quantityOptions.find(
              (opt) => opt.quantity.toString() === value
            );
            if (option) {
              handleOptionSelect(option.quantity, option.pricePerUnit);
            }
          }
        }}
        className="flex flex-wrap gap-2"
      >
        {quantityOptions
          .filter((option) => option.quantity !== 1) // Hide quantity = 1 from display
          .map((option) => {
            const discountPercent = getDiscountPercentage(option);

            return (
              <ToggleGroupItem
                key={option.quantity}
                value={option.quantity.toString()}
                aria-label={`Select ${option.label}`}
                className="relative h-12 min-w-24 border-2 border-gray-300 data-[state=on]:border-emerald-600 data-[state=on]:bg-linear-to-br data-[state=on]:from-emerald-100 data-[state=on]:to-teal-100 data-[state=on]:text-emerald-700 data-[state=on]:font-semibold hover:border-emerald-600 transition-all"
              >
                {option.label}
                {discountPercent !== null && discountPercent > 0 && (
                  <div className="absolute -top-2 -right-2 flex items-center justify-center bg-red-700 rounded-full px-1.5 py-0.5 min-w-[24px]">
                    <span className="text-[12px] font-bold text-white leading-none">
                      {discountPercent}%
                    </span>
                  </div>
                )}
              </ToggleGroupItem>
            );
          })}
      </ToggleGroup>
    </div>
  );
}
