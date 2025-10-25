"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { CartItem } from "@/components/cart/cart-item";
import { OrderSummary } from "@/components/cart/order-summary";

export default function CartPage() {
  const { items, getCartSummary, clearCart } = useCartStore();
  const summary = getCartSummary();

  const isEmpty = items.length === 0;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold md:text-5xl">Shopping Cart</h1>
        <Link
          href="/products"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Continue Shopping
        </Link>
      </div>

      {isEmpty ? (
        /* Empty Cart State */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag className="mb-6 h-24 w-24 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-semibold">Your cart is empty</h2>
          <p className="mb-8 text-muted-foreground">
            Start adding products to your cart
          </p>
          <Button asChild size="lg">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        /* Cart Content */
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items - Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Order Summary - Right Column (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border bg-card p-6">
              <OrderSummary summary={summary} />

              {/* Checkout Button */}
              <Button asChild size="lg" className="mt-6 w-full">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              {/* Clear Cart Button */}
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
