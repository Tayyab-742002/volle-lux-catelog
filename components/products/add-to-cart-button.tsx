"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { Product, ProductVariant } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  disabled?: boolean;
}

export function AddToCartButton({
  product,
  variant,
  quantity,
  disabled = false,
}: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCartStore();

  const handleClick = () => {
    addItem(product, variant, quantity);
    setIsAdded(true);

    // TODO: Integrate with Supabase for cart persistence
    // TODO: Sync cart with backend
    // TODO: Handle authenticated vs guest cart

    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Button
      size="lg"
      className="w-full"
      disabled={disabled}
      onClick={handleClick}
    >
      {isAdded ? (
        <>
          <Check className="mr-2 h-5 w-5" strokeWidth={1.5} />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" strokeWidth={1.5} />
          Add to Cart
        </>
      )}
    </Button>
  );
}
