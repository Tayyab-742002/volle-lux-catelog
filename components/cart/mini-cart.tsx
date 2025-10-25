"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/stores/cart-store";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { CartItem } from "./cart-item";

interface MiniCartProps {
  children?: React.ReactNode;
}

export function MiniCart({ children }: MiniCartProps) {
  const [open, setOpen] = useState(false);
  const { items, getCartSummary, getItemCount } = useCartStore();
  const summary = getCartSummary();
  const itemCount = getItemCount();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {itemCount === 0
              ? "Your cart is empty"
              : `${itemCount} ${itemCount === 1 ? "item" : "items"}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <Button asChild className="mt-4" onClick={() => setOpen(false)}>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  ${summary.subtotal.toFixed(2)}
                </span>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Discount</span>
                  <span>-${summary.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {summary.shipping === 0
                    ? "Free"
                    : `$${summary.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-semibold">
                <span>Total</span>
                <span>${summary.total.toFixed(2)}</span>
              </div>
            </div>
            <Button asChild className="mt-4 w-full" size="lg">
              <Link href="/cart" onClick={() => setOpen(false)}>
                View Cart
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
