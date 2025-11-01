"use client";

import { useEffect, useRef } from "react";
import { useCartStore, cartStorageHelpers } from "@/lib/stores/cart-store";
import { useAuth } from "@/components/auth/auth-provider";
import { saveCartToSupabase } from "@/services/cart/cart.service";
import { createClient } from "@/lib/supabase/client";

/**
 * Cart Provider Component
 * Handles cart initialization and authentication integration
 * - Guest users: localStorage (manual persistence)
 * - Authenticated users: Supabase database with Realtime subscriptions
 * - Auto-migrates localStorage cart to Supabase on login
 * - Clears localStorage for authenticated users
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const { initializeCart, syncCart, items } = useCartStore();
  const prevIsAuthenticatedRef = useRef(isAuthenticated);
  const hasMigratedRef = useRef(false);
  const subscriptionRef = useRef<any>(null);

  // Initialize cart when auth state changes
  useEffect(() => {
    const initializeCartWithAuth = async () => {
      try {
        // Track if this is a login transition (was guest, now authenticated)
        const isLoginTransition =
          !prevIsAuthenticatedRef.current && isAuthenticated && user;

        if (isAuthenticated && user) {
          // User is authenticated
          if (isLoginTransition && !hasMigratedRef.current) {
            // First time logging in - check if localStorage cart has items
            const guestCartItems = cartStorageHelpers.loadGuestCart();
            
            if (guestCartItems.length > 0) {
              // Migrate localStorage cart to Supabase BEFORE initializing
              // Retry up to 3 times with exponential backoff to handle session cookie delays
              let retries = 0;
              const maxRetries = 3;
              let lastError: unknown;
              
              while (retries < maxRetries) {
                try {
                  console.log(`Migrating ${guestCartItems.length} items from localStorage to Supabase (attempt ${retries + 1}/${maxRetries})`);
                  await saveCartToSupabase(guestCartItems, user.id);
                  console.log("Cart migrated successfully to Supabase");
                  break; // Success, exit retry loop
                } catch (error) {
                  lastError = error;
                  console.error(`Failed to migrate cart to Supabase (attempt ${retries + 1}/${maxRetries}):`, error);
                  retries++;
                  
                  if (retries < maxRetries) {
                    // Exponential backoff: 100ms, 200ms, 400ms
                    await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, retries - 1)));
                  }
                }
              }
              
              if (retries === maxRetries) {
                console.error("Failed to migrate cart after all retries:", lastError);
              }
            }

            // Clear localStorage after successful migration
            cartStorageHelpers.clearGuestCart();
            console.log("Guest cart cleared from localStorage after migration");

            // Mark as migrated to prevent duplicate migrations
            hasMigratedRef.current = true;
          }

          // Initialize with user ID (loads from Supabase)
          await initializeCart(user.id);
        } else {
          // User is not authenticated - initialize as guest
          // loadGuestCart is called in initializeCart
          await initializeCart();
          hasMigratedRef.current = false; // Reset migration flag for next login
        }

        // Update previous auth state
        prevIsAuthenticatedRef.current = isAuthenticated;
      } catch (error) {
        console.error("Failed to initialize cart:", error);
      }
    };

    if (!loading) {
      initializeCartWithAuth();
    }
  }, [isAuthenticated, user, loading, initializeCart]);

  // Set up Supabase Realtime subscription for authenticated users
  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Clean up any existing subscription when logged out
      if (subscriptionRef.current) {
        console.log("Cleaning up Realtime subscription");
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      return;
    }

    // Subscribe to cart changes in real-time
    const supabase = createClient();
    
    console.log("Setting up Realtime subscription for user:", user.id);
    
    const subscription = supabase
      .channel(`cart-changes-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "carts",
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          console.log("Cart changed via Realtime:", payload);
          
          // Only reload if this wasn't triggered by our own update
          // (to avoid reloading immediately after we just synced)
          try {
            const { loadCartFromSupabase } = await import("@/services/cart/cart.service");
            const cartItems = await loadCartFromSupabase(user.id);
            
            // Update cart directly without calling initializeCart (which checks isInitialized)
            useCartStore.setState({
              items: cartItems,
            });
            
            console.log("Cart reloaded from Realtime update:", cartItems.length, "items");
          } catch (error) {
            console.error("Failed to reload cart after Realtime update:", error);
          }
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    subscriptionRef.current = subscription;

    // Cleanup on unmount or when auth changes
    return () => {
      console.log("Unsubscribing from Realtime cart changes");
      subscription.unsubscribe();
      subscriptionRef.current = null;
    };
  }, [isAuthenticated, user]);

  // Handle logout - keep localStorage cart, just reset initialized flag
  useEffect(() => {
    if (!isAuthenticated && !loading && prevIsAuthenticatedRef.current) {
      // User just logged out - reset initialized flag to allow guest cart to load
      useCartStore.setState({
        isInitialized: false,
      });

      console.log("User logged out, switching to guest cart");
    }
  }, [isAuthenticated, loading]);

  return <>{children}</>;
}
