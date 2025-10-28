"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Cart } from "@/types/cart";
import { Product, ProductVariant, PricingTier } from "@/types/product";
import {
  saveCartToSupabase,
  loadCartFromSupabase,
  mergeGuestCartWithUserCart,
} from "@/services/cart/cart.service";
import { getOrCreateSessionId, clearSessionId } from "@/lib/utils/session";
import { useAuth } from "@/components/auth/auth-provider";

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  isInitialized: boolean;
  addItem: (
    product: Product,
    variant?: ProductVariant,
    quantity?: number,
    userId?: string
  ) => Promise<void>;
  removeItem: (itemId: string, userId?: string) => Promise<void>;
  updateQuantity: (
    itemId: string,
    quantity: number,
    userId?: string
  ) => Promise<void>;
  clearCart: (userId?: string) => Promise<void>;
  getCartSummary: () => Cart;
  getItemCount: () => number;
  initializeCart: (userId?: string) => Promise<void>;
  syncCart: (userId?: string) => Promise<void>;
}

// Helper function to calculate price per unit based on pricing tiers
function calculatePricePerUnit(
  quantity: number,
  basePrice: number,
  variantAdjustment: number,
  pricingTiers?: PricingTier[]
): number {
  const adjustedBasePrice = basePrice + variantAdjustment;

  if (!pricingTiers || pricingTiers.length === 0) {
    return adjustedBasePrice;
  }

  // Find the appropriate tier based on quantity
  const tier = pricingTiers.find((t) => {
    const minMatch = quantity >= t.minQuantity;
    const maxMatch = t.maxQuantity ? quantity <= t.maxQuantity : true;
    return minMatch && maxMatch;
  });

  return tier?.pricePerUnit || adjustedBasePrice;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isInitialized: false,

      initializeCart: async (userId?: string) => {
        if (get().isInitialized) return;

        set({ isLoading: true });

        try {
          const sessionId = getOrCreateSessionId();
          let cartItems: CartItem[] = [];

          if (userId) {
            // Load authenticated user cart
            cartItems = await loadCartFromSupabase(userId);
          } else {
            // Load guest cart
            cartItems = await loadCartFromSupabase(undefined, sessionId);
          }

          set({
            items: cartItems,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          console.error("Failed to initialize cart:", error);
          set({ isLoading: false, isInitialized: true });
        }
      },

      syncCart: async (userId?: string) => {
        const { items, isLoading } = get();
        if (isLoading) {
          console.log("Cart sync skipped: cart is loading");
          return;
        }

        try {
          const sessionId = getOrCreateSessionId();
          console.log("Syncing cart to Supabase:", {
            itemCount: items.length,
            userId: userId || "guest",
            sessionId,
          });

          await saveCartToSupabase(items, userId, sessionId);

          console.log("Cart synced successfully to Supabase");
        } catch (error) {
          console.error("Failed to sync cart:", error);
        }
      },

      addItem: async (product, variant, quantity = 1, userId) => {
        console.log("Adding item to cart:", {
          productId: product.id,
          variantId: variant?.id,
          quantity,
          userId,
        });

        set({ isLoading: true });

        let updatedItems: CartItem[] = [];

        set((state) => {
          const variantPriceAdjustment = variant?.price_adjustment || 0;

          // Check if item already exists in cart
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id && item.variant?.id === variant?.id
          );

          if (existingItemIndex >= 0) {
            // Update existing item quantity
            const items = [...state.items];
            const existingItem = items[existingItemIndex];
            const newQuantity = existingItem.quantity + quantity;

            // Calculate price based on new quantity and pricing tiers
            const pricePerUnit = calculatePricePerUnit(
              newQuantity,
              product.basePrice,
              variantPriceAdjustment,
              product.pricingTiers
            );

            items[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity,
              pricePerUnit,
              totalPrice: pricePerUnit * newQuantity,
            };
            updatedItems = items;
            return { items: updatedItems, isLoading: false };
          } else {
            // Add new item
            const pricePerUnit = calculatePricePerUnit(
              quantity,
              product.basePrice,
              variantPriceAdjustment,
              product.pricingTiers
            );

            const newItem: CartItem = {
              id: `${product.id}-${variant?.id || "default"}`,
              product,
              variant,
              quantity,
              pricePerUnit,
              totalPrice: pricePerUnit * quantity,
            };
            updatedItems = [...state.items, newItem];
            return { items: updatedItems, isLoading: false };
          }
        });

        console.log("Cart items updated. New item count:", updatedItems.length);
        console.log("Syncing cart to Supabase with userId:", userId);

        // Sync to Supabase after state update
        await get().syncCart(userId);
      },

      removeItem: async (itemId, userId) => {
        console.log("Removing item from cart:", { itemId, userId });

        set({ isLoading: true });

        set((state) => {
          const filteredItems = state.items.filter(
            (item) => item.id !== itemId
          );
          console.log(
            "Item removed. New cart item count:",
            filteredItems.length
          );
          return {
            items: filteredItems,
            isLoading: false,
          };
        });

        // Sync to Supabase after state update
        console.log("Syncing cart after item removal with userId:", userId);
        await get().syncCart(userId);
      },

      updateQuantity: async (itemId, quantity, userId) => {
        console.log("Updating item quantity:", { itemId, quantity, userId });

        if (quantity <= 0) {
          console.log("Quantity is 0 or less, removing item instead");
          await get().removeItem(itemId, userId);
          return;
        }

        set({ isLoading: true });

        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id === itemId) {
              const variantAdjustment = item.variant?.price_adjustment || 0;

              // Recalculate price per unit based on new quantity and pricing tiers
              const pricePerUnit = calculatePricePerUnit(
                quantity,
                item.product.basePrice,
                variantAdjustment,
                item.product.pricingTiers
              );

              console.log("Updated item:", {
                itemId,
                oldQuantity: item.quantity,
                newQuantity: quantity,
                newPricePerUnit: pricePerUnit,
              });

              return {
                ...item,
                quantity,
                pricePerUnit,
                totalPrice: pricePerUnit * quantity,
              };
            }
            return item;
          });

          return {
            items: updatedItems,
            isLoading: false,
          };
        });

        // Sync to Supabase after state update
        console.log("Syncing cart after quantity update with userId:", userId);
        await get().syncCart(userId);
      },

      clearCart: async (userId) => {
        console.log("Clearing cart for userId:", userId);
        set({ isLoading: true });

        try {
          const sessionId = getOrCreateSessionId();

          // Clear local state
          set({ items: [], isLoading: false });

          // Delete cart from Supabase
          console.log("Deleting cart from Supabase:", { userId, sessionId });
          await saveCartToSupabase([], userId, sessionId);

          console.log("Cart cleared and deleted from Supabase successfully");
        } catch (error) {
          console.error("Failed to clear cart:", error);
          set({ isLoading: false });
        }
      },

      getCartSummary: () => {
        const items = get().items;
        const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

        // Calculate discount based on pricing tiers
        const discount = items.reduce((sum, item) => {
          const variantAdjustment = item.variant?.price_adjustment || 0;
          const basePrice = item.product.basePrice + variantAdjustment;
          const tierPrice = item.pricePerUnit;

          // Only count positive discounts (where tier price is less than base price)
          const discountPerItem = Math.max(0, basePrice - tierPrice);
          return sum + discountPerItem * item.quantity;
        }, 0);

        // Calculate shipping based on order value
        const shipping = subtotal > 100 ? 0 : 15;

        const total = subtotal - discount + shipping;

        return {
          items,
          subtotal,
          discount,
          shipping,
          total,
        };
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      // Don't persist isLoading and isInitialized states
      partialize: (state) => ({ items: state.items }),
    }
  )
);
