"use client";

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

  const handleQuantityChange = async (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      await updateQuantity(item.id, numValue, user?.id);
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
            alt={item.product.name}
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
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="w-16"
            />
          </div>

          {/* Price & Remove */}
          <div className="flex items-center gap-4">
            <span className="font-semibold">£{item.totalPrice.toFixed(2)}</span>
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
  );
}
