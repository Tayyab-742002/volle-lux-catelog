"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuth } from "@/components/auth/auth-provider";
import { CartItem as CartItemType } from "@/types/cart";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { user } = useAuth();
  const [quantityInput, setQuantityInput] = useState<string>(
    item.quantity.toString()
  );

  // Calculate pricing details (matching product purchase page logic)
  const pricingDetails = useMemo(() => {
    const adjustedBasePrice =
      item.product.basePrice + (item.variant?.price_adjustment || 0);
    const baseTotal = adjustedBasePrice * item.quantity;
    const savings = Math.max(0, baseTotal - item.totalPrice);
    const hasDiscount = savings > 0;

    return {
      adjustedBasePrice,
      baseTotal,
      savings,
      hasDiscount,
    };
  }, [
    item.product.basePrice,
    item.variant?.price_adjustment,
    item.quantity,
    item.totalPrice,
  ]);

  // Sync input when item quantity changes externally
  // Use key prop on Input to reset when quantity changes externally
  // This avoids the useEffect setState warning

  const handleQuantityChange = (value: string) => {
    // Allow empty string for easier editing
    setQuantityInput(value);
    
    // Only update if it's a valid number
    if (value === "") {
      return; // Allow empty temporarily
    }
    
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      updateQuantity(item.id, numValue, user?.id);
    }
  };

  const handleQuantityBlur = () => {
    // When user leaves the field, ensure it has a valid value
    const numValue = parseInt(quantityInput, 10);
    if (isNaN(numValue) || numValue < 1) {
      setQuantityInput("1");
      updateQuantity(item.id, 1, user?.id);
    } else {
      setQuantityInput(numValue.toString());
    }
  };

  const handleRemove = async () => {
    await removeItem(item.id, user?.id);
  };

  return (
    <div className="flex gap-4 rounded-lg border p-4">
      {/* Product Image */}
      <Link href={`/products/${item.product.slug}`} className="shrink-0">
        <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted">
          <Image
            src={item.product.image}
            alt={item.product.imageAlt || item.product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 space-y-2">
        <div>
          <Link
            href={`/products/${item.product.slug}`}
            className="font-medium hover:text-primary"
          >
            {item.product.name}
          </Link>
          {item.variant && (
            <p className="text-sm text-muted-foreground">{item.variant.name}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2">
            <Input
              key={`quantity-${item.id}-${item.quantity}`}
              type="text"
              inputMode="numeric"
              min="1"
              value={quantityInput}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow numbers and empty string
                if (value === "" || /^\d+$/.test(value)) {
                  handleQuantityChange(value);
                }
              }}
              onBlur={handleQuantityBlur}
              className="w-16"
            />
          </div>

          {/* Price & Remove */}
          <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="font-semibold text-lg">
                  £{item.totalPrice.toFixed(2)}
                </span>
                {pricingDetails.hasDiscount && (
                  <span className="text-xs text-emerald-600 font-medium">
                    Save £{pricingDetails.savings.toFixed(2)}
                  </span>
                )}
                {item.quantity > 1 && (
                  <span className="text-xs text-gray-500">
                    £{item.pricePerUnit.toFixed(2)} per unit
                  </span>
                )}
              </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
