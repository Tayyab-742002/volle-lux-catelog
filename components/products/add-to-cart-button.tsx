"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  productName: string;
  quantity: number;
  variantId?: string;
  disabled?: boolean;
  onAddToCart?: () => void;
}

export function AddToCartButton({
  productName,
  quantity,
  variantId,
  disabled = false,
  onAddToCart,
}: AddToCartButtonProps) {
  const handleClick = () => {
    // TODO: Integrate with cart service (Supabase)
    // TODO: Handle variant selection
    // TODO: Add to cart with proper quantity
    console.log("Add to cart:", { productName, quantity, variantId });
    onAddToCart?.();
  };

  return (
    <Button
      size="lg"
      className="w-full"
      disabled={disabled}
      onClick={handleClick}
    >
      <ShoppingCart className="mr-2 h-5 w-5" strokeWidth={1.5} />
      Add to Cart
    </Button>
  );
}
