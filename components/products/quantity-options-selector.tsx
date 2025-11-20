"use client";

import { useState, useEffect } from "react";
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
  allowCustomQuantity = false, // Default to false - no custom quantity when options exist
}: QuantityOptionsSelectorProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Reset state when quantityOptions change (variant changed)
  useEffect(() => {
    setSelectedOption(null);
  }, [quantityOptions]);

  // Initialize selected option based on selectedQuantity
  useEffect(() => {
    if (selectedQuantity) {
      const matchingOption = quantityOptions.find(
        (opt) => opt.quantity === selectedQuantity
      );
      if (matchingOption) {
        setSelectedOption(matchingOption.quantity);
      }
    }
  }, [selectedQuantity, quantityOptions]);

  if (!quantityOptions || quantityOptions.length === 0) {
    return null;
  }

  const handleOptionSelect = (quantity: number, pricePerUnit?: number) => {
    setSelectedOption(quantity);
    onQuantityOptionChange?.(quantity, pricePerUnit);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700">
          Quantity
        </h3>
      </div>

      {/* Quantity Options Buttons */}
      <ToggleGroup
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
        {quantityOptions.map((option) => (
          <ToggleGroupItem
            key={option.quantity}
            value={option.quantity.toString()}
            aria-label={`Select ${option.label}`}
            className="h-12 min-w-24 border-2 border-gray-300 data-[state=on]:border-emerald-600 data-[state=on]:bg-linear-to-br data-[state=on]:from-emerald-100 data-[state=on]:to-teal-100 data-[state=on]:text-emerald-700 data-[state=on]:font-semibold hover:border-emerald-600 transition-all"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
