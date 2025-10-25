"use client";

import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ProductVariant } from "@/types/product";

interface VariantSelectorProps {
  variants: ProductVariant[];
  label?: string;
  onVariantChange?: (variantId: string) => void;
}

export function VariantSelector({
  variants,
  label = "Size",
  onVariantChange,
}: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<string>(
    variants[0]?.id || ""
  );

  const handleValueChange = (value: string) => {
    if (value) {
      setSelectedVariant(value);
      onVariantChange?.(value);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="label-luxury text-sm font-medium">
          {label.toUpperCase()}
        </span>
        {selectedVariant && (
          <span className="text-sm text-muted-foreground">
            Selected: {variants.find((v) => v.id === selectedVariant)?.name}
          </span>
        )}
      </div>
      <ToggleGroup
        type="single"
        value={selectedVariant}
        onValueChange={handleValueChange}
        className="flex flex-wrap gap-2"
      >
        {variants.map((variant) => (
          <ToggleGroupItem
            key={variant.id}
            value={variant.id}
            aria-label={`Select ${variant.name}`}
            className="h-12 min-w-12 border-2 border-border data-[state=on]:border-primary data-[state=on]:bg-primary/5"
          >
            {variant.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
