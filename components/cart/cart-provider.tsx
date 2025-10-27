"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuth } from "@/components/auth/auth-provider";
import { mergeGuestCartWithUserCart } from "@/services/cart/cart.service";
import { getOrCreateSessionId, clearSessionId } from "@/lib/utils/session";

/**
 * Cart Provider Component
 * Handles cart initialization and authentication integration
 * This component should be placed high in the component tree to ensure
 * cart is initialized when the app loads
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const { initializeCart, syncCart } = useCartStore();

  useEffect(() => {
    const initializeCartWithAuth = async () => {
      try {
        if (isAuthenticated && user) {
          // User is authenticated - initialize with user ID
          await initializeCart(user.id);
        } else {
          // User is not authenticated - initialize as guest
          await initializeCart();
        }
      } catch (error) {
        console.error("Failed to initialize cart:", error);
      }
    };

    initializeCartWithAuth();
  }, [isAuthenticated, user, initializeCart]);

  // Handle cart merging when user logs in
  useEffect(() => {
    const handleUserLogin = async () => {
      // Only run if user just logged in (was not authenticated before)
      if (isAuthenticated && user) {
        try {
          const sessionId = getOrCreateSessionId();

          // Merge guest cart with user cart
          await mergeGuestCartWithUserCart(sessionId, user.id);

          // Clear session ID after successful merge
          clearSessionId();

          // Reset initialized flag to force re-initialization
          useCartStore.setState({ isInitialized: false });

          // Re-initialize cart to load merged data
          await initializeCart(user.id);
        } catch (error) {
          console.error("Failed to merge guest cart with user cart:", error);
        }
      }
    };

    handleUserLogin();
  }, [isAuthenticated, user, initializeCart]);

  // Sync cart periodically (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      syncCart(user?.id);
    }, 30000);

    return () => clearInterval(interval);
  }, [syncCart, user?.id]);

  // Handle logout - clear cart and reset state
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      const { clearCart } = useCartStore.getState();
      clearCart().catch(console.error);

      // Reset cart state
      useCartStore.setState({
        isInitialized: false,
        items: [],
      });
    }
  }, [isAuthenticated, loading]);

  return <>{children}</>;
}
