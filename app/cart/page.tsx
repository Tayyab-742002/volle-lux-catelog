"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Leaf } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuth } from "@/components/auth/auth-provider";
import { CartItem } from "@/components/cart/cart-item";
import { OrderSummary } from "@/components/cart/order-summary";

export default function CartPage() {
  const { items, getCartSummary, clearCart } = useCartStore();
  const { user } = useAuth();
  const summary = getCartSummary();

  const isEmpty = items.length === 0;

  const handleClearCart = async () => {
    await clearCart(user?.id);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Shopping Cart
            </h1>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors group"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              strokeWidth={2}
            />
            Continue Shopping
          </Link>
        </div>

        {isEmpty ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              Your cart is empty
            </h2>
            <p className="mb-8 text-lg text-gray-600 max-w-md">
              Start adding eco-friendly products to your cart
            </p>
            <Button
              asChild
              size="lg"
              className="bg-linear-to-r mt-1 from-emerald-600 to-teal-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Link href="/products" className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Browse Products
              </Link>
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
              <div className="sticky top-24 rounded-2xl border-2 p-6 border-gray-300 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Order Summary
                  </h2>
                </div>

                <OrderSummary summary={summary} />

                {/* Checkout Button */}
                <Button
                  asChild
                  size="lg"
                  className="mt-6 w-full h-12 bg-linear-to-r from-emerald-600 to-teal-600 cursor-pointer text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>

                {/* Clear Cart Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full border border-gray-300 focus:border-border-300 bg-transparent text-gray-700 hover:bg-emerald-100 cursor-pointer transition-colors"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
