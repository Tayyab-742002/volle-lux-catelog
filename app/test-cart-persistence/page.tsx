"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { getOrCreateSessionId } from "@/lib/utils/session";

export default function TestCartPersistencePage() {
  const { user, isAuthenticated } = useAuth();
  const { items, isLoading, isInitialized, initializeCart, syncCart } =
    useCartStore();
  const [testResults, setTestResults] = useState<{
    cartLoaded: boolean;
    cartSaved: boolean;
    guestCartExists: boolean;
    userCartExists: boolean;
    error?: string;
  }>({
    cartLoaded: false,
    cartSaved: false,
    guestCartExists: false,
    userCartExists: false,
  });

  const [isTesting, setIsTesting] = useState(false);

  // Test cart persistence functionality
  const testCartPersistence = async () => {
    setIsTesting(true);
    setTestResults({
      cartLoaded: false,
      cartSaved: false,
      guestCartExists: false,
      userCartExists: false,
    });

    try {
      const supabase = createClient();
      const sessionId = getOrCreateSessionId();

      // Test 1: Check if cart is loaded
      setTestResults((prev) => ({
        ...prev,
        cartLoaded: isInitialized && items.length >= 0,
      }));

      // Test 2: Try to save cart
      await syncCart(user?.id);
      setTestResults((prev) => ({ ...prev, cartSaved: true }));

      // Test 3: Check if guest cart exists in database
      const { data: guestCart, error: guestError } = await supabase
        .from("carts")
        .select("id, items")
        .eq("session_id", sessionId)
        .single();

      if (!guestError || guestError.code === "PGRST116") {
        setTestResults((prev) => ({ ...prev, guestCartExists: !!guestCart }));
      }

      // Test 4: Check if user cart exists in database (if authenticated)
      if (isAuthenticated && user) {
        const { data: userCart, error: userError } = await supabase
          .from("carts")
          .select("id, items")
          .eq("user_id", user.id)
          .single();

        if (!userError || userError.code === "PGRST116") {
          setTestResults((prev) => ({ ...prev, userCartExists: !!userCart }));
        }
      }
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    } finally {
      setIsTesting(false);
    }
  };

  // Add a test item to cart
  const addTestItem = async () => {
    const testProduct = {
      id: "test-product",
      name: "Test Product",
      slug: "test-product",
      description: "A test product for cart persistence testing",
      shortDescription: "Test product",
      basePrice: 10.99,
      discount: 0,
      isActive: true,
      isFeatured: false,
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      category: {
        id: "test-category",
        name: "Test Category",
        slug: "test-category",
      },
      variants: [],
      pricingTiers: [],
      specifications: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await useCartStore.getState().addItem(testProduct, undefined, 1, user?.id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Cart Persistence Test</h1>
        <p className="text-muted-foreground">
          Test the cart persistence functionality with Supabase integration
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>
              Test cart persistence functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Authentication Status:</p>
              <p className="text-sm text-muted-foreground">
                {isAuthenticated
                  ? `Logged in as: ${user?.email}`
                  : "Guest user"}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Cart Status:</p>
              <p className="text-sm text-muted-foreground">
                {isLoading
                  ? "Loading..."
                  : isInitialized
                    ? "Initialized"
                    : "Not initialized"}
              </p>
              <p className="text-sm text-muted-foreground">
                Items in cart: {items.length}
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={addTestItem} disabled={isLoading}>
                Add Test Item
              </Button>
              <Button onClick={testCartPersistence} disabled={isTesting}>
                {isTesting ? "Testing..." : "Test Persistence"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Results of cart persistence tests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Cart Loaded:</span>
                <span
                  className={`text-sm ${testResults.cartLoaded ? "text-green-600" : "text-red-600"}`}
                >
                  {testResults.cartLoaded ? "✅ Pass" : "❌ Fail"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Cart Saved:</span>
                <span
                  className={`text-sm ${testResults.cartSaved ? "text-green-600" : "text-red-600"}`}
                >
                  {testResults.cartSaved ? "✅ Pass" : "❌ Fail"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Guest Cart Exists:</span>
                <span
                  className={`text-sm ${testResults.guestCartExists ? "text-green-600" : "text-red-600"}`}
                >
                  {testResults.guestCartExists ? "✅ Pass" : "❌ Fail"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">User Cart Exists:</span>
                <span
                  className={`text-sm ${testResults.userCartExists ? "text-green-600" : "text-red-600"}`}
                >
                  {testResults.userCartExists ? "✅ Pass" : "❌ Fail"}
                </span>
              </div>
            </div>

            {testResults.error && (
              <Alert variant="destructive">
                <AlertDescription>Error: {testResults.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cart Items Display */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Current Cart Items</CardTitle>
          <CardDescription>Items currently in the cart</CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground">No items in cart</p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × $
                      {item.pricePerUnit.toFixed(2)} = $
                      {item.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
