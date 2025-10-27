"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuth } from "@/components/auth/auth-provider";
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
  const { user } = useAuth();

  const handleClick = async () => {
    await addItem(product, variant, quantity, user?.id);
    setIsAdded(true);

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
