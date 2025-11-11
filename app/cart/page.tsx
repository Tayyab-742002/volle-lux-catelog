"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Leaf, UserPlus, LogIn } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuth } from "@/components/auth/auth-provider";
import { CartItem } from "@/components/cart/cart-item";
import { OrderSummary } from "@/components/cart/order-summary";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

function CartPageContent() {
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

        {/* Guest User Login Prompt */}
        {!user && !isEmpty && (
          <div className="mb-8 bg-linear-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 md:p-8 shadow-lg border-2 border-emerald-200">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 shadow-lg">
                  <UserPlus className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Sign in for a better checkout experience
                </h3>
                <p className="text-gray-600 mb-4">
                  Log in to use saved addresses, track your order, and checkout faster next time!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/auth/login?redirect=/cart"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup?redirect=/cart"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-emerald-600 font-semibold rounded-lg border-2 border-emerald-600 transition-all duration-200 hover:shadow-lg"
                  >
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </Link>
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  Or continue as guest - you can checkout without an account
                </p>
              </div>
            </div>
          </div>
        )}

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

export default function CartPage() {
  return (
    <ErrorBoundary
      title="Cart Error"
      description="We encountered an error while loading your cart. Please try again or continue shopping."
      showBackButton
      backUrl="/products"
      showHomeButton
    >
      <CartPageContent />
    </ErrorBoundary>
  );
}
