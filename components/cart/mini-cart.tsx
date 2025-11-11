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
import { ShoppingCart, Leaf, Package, ArrowRight } from "lucide-react";
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
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-r from-emerald-600 to-teal-600 text-xs font-bold text-white shadow-lg animate-pulse">
                {itemCount}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg p-5">
        <SheetHeader className="border-b-2 border-emerald-300 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 text-left">
              <SheetTitle className="text-xl font-bold text-gray-900">
                Shopping Cart
              </SheetTitle>
              <SheetDescription className="text-sm font-medium">
                {itemCount === 0 ? (
                  <span className="text-gray-500">Your cart is empty</span>
                ) : (
                  <span className="text-emerald-600">
                    {itemCount} {itemCount === 1 ? "item" : "items"} in cart
                  </span>
                )}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-4">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full">
                <ShoppingCart
                  className="h-12 w-12 text-emerald-600"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Your cart is empty
              </h3>
              <p className="mb-6 text-sm text-gray-600">
                Start adding eco-friendly products!
              </p>
              <Button
                asChild
                className="bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => setOpen(false)}
              >
                <Link href="/products" className="flex items-center gap-2 mt-2">
                  <Leaf className="h-4 w-4" />
                  Browse Products
                </Link>
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
          <div className="border-t-2 border-emerald-100 pt-4">
            {/* Order Summary */}
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  £{summary.subtotal.toFixed(2)}
                </span>
              </div>

              {summary.discount > 0 && (
                <div className="flex justify-between items-center text-emerald-600">
                  <span className="font-medium">Discount</span>
                  <span className="font-semibold">
                    -£{summary.discount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-gray-900">
                  {summary.shipping === 0 ? (
                    <span className="text-emerald-600 font-bold">Free</span>
                  ) : (
                    `£${summary.shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center border-t-2 border-emerald-100 pt-3 text-base">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-gray-900 text-lg">
                  £{summary.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Eco Badge */}
            <div className="mb-4 p-3 bg-linear-to-r from-emerald-100 to-teal-100 rounded-xl border-2 border-emerald-200">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-800">
                  Eco-Friendly Packaging • Carbon Neutral Shipping
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                asChild
                className="w-full h-12 bg-linear-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2"
                >
                  <Package className="h-5 w-5" />
                  View Full Cart
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full h-11 border-2 border-emerald-200 text-gray-700 hover:bg-emerald-100 font-medium transition-colors"
                onClick={() => setOpen(false)}
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
