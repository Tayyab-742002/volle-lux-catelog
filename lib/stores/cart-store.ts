"use client";

import { create } from "zustand";
import { CartItem, Cart } from "@/types/cart";
import { Product, ProductVariant, PricingTier } from "@/types/product";
import {
  saveCartToSupabase,
  loadCartFromSupabase,
} from "@/services/cart/cart.service";
import {
  DEFAULT_SHIPPING_OPTION,
  getShippingPrice,
  type ShippingCalculation,
} from "@/types/shipping";
import {
  calculateOrderTotal,
  calculatePricePerUnit,
} from "@/services/pricing/pricing.service";

interface CartStore {
  items: CartItem[];
  selectedShippingId: string;
  isLoading: boolean;
  isInitialized: boolean;
  addItem: (
    product: Product,
    variant?: ProductVariant,
    quantity?: number,
    userId?: string,
    quantityOptionPrice?: number // Price from selected quantity option
  ) => Promise<void>;
  removeItem: (itemId: string, userId?: string) => Promise<void>;
  updateQuantity: (
    itemId: string,
    quantity: number,
    userId?: string
  ) => Promise<void>;
  clearCart: (userId?: string) => Promise<void>;
  setShippingMethod: (shippingId: string) => void;
  getCartSummary: () => Cart;
  getCartSummaryWithShipping: () => ShippingCalculation & {
    items: CartItem[];
    discount: number;
  };
  getItemCount: () => number;
  initializeCart: (userId?: string) => Promise<void>;
  syncCart: (userId?: string) => Promise<void>;
}

const GUEST_CART_STORAGE_KEY = "volle-cart-guest";

// Helper functions for localStorage
function saveGuestCartToLocalStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving guest cart to localStorage:", error);
  }
}

function loadGuestCartFromLocalStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (!stored) return [];

    const items = JSON.parse(stored);
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error("Error loading guest cart from localStorage:", error);
    return [];
  }
}

function clearGuestCartFromLocalStorage(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing guest cart from localStorage:", error);
  }
}

// Helper function to calculate price per unit based on pricing tiers
// Uses the pricing service for consistency
// Priority: quantity option price > pricing tiers > base price
// Matches the logic from product-purchase-section.tsx
function calculateItemPricePerUnit(
  quantity: number,
  basePrice: number,
  variantAdjustment: number,
  pricingTiers?: PricingTier[],
  quantityOptionPrice?: number // Price from selected quantity option (takes priority)
): number {
  const adjustedBasePrice = basePrice + variantAdjustment;

  // If quantity option has a specific pricePerUnit, use it (highest priority)
  if (quantityOptionPrice !== undefined && quantityOptionPrice > 0) {
    return quantityOptionPrice;
  }

  // If pricing tiers exist, apply them based on quantity
  if (pricingTiers && pricingTiers.length > 0) {
    return calculatePricePerUnit(
      quantity,
      basePrice,
      pricingTiers,
      variantAdjustment
    );
  }

  // Fallback to base + variant adjustment
  return adjustedBasePrice;
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  selectedShippingId: DEFAULT_SHIPPING_OPTION.id,
  isLoading: false,
  isInitialized: false,

  initializeCart: async (userId?: string) => {
    if (get().isInitialized) return;

    set({ isLoading: true });

    try {
      if (userId) {
        // Load authenticated user cart from Supabase
        const cartItems = await loadCartFromSupabase(userId);
        set({
          items: cartItems,
          isLoading: false,
          isInitialized: true,
        });
      } else {
        // Load guest cart from localStorage
        const cartItems = loadGuestCartFromLocalStorage();
        set({
          items: cartItems,
          isLoading: false,
          isInitialized: true,
        });
      }
    } catch (error) {
      console.error("Failed to initialize cart:", error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  syncCart: async (userId?: string) => {
    const { items, isLoading } = get();
    if (isLoading) {
      if (process.env.NODE_ENV === "development") {
        console.log("Cart sync skipped: cart is loading");
      }
      return;
    }

    try {
      if (userId) {
        // Sync authenticated user cart to Supabase
        if (process.env.NODE_ENV === "development") {
          console.log("Syncing cart to Supabase:", {
            itemCount: items.length,
            userId,
          });
        }

        await saveCartToSupabase(items, userId);
        if (process.env.NODE_ENV === "development") {
          console.log("Cart synced successfully to Supabase");
        }
      } else {
        // Sync guest cart to localStorage
        saveGuestCartToLocalStorage(items);
        if (process.env.NODE_ENV === "development") {
          console.log("Guest cart synced to localStorage");
        }
      }
    } catch (error) {
      console.error("Failed to sync cart:", error);
    }
  },

  addItem: async (
    product,
    variant,
    quantity = 1,
    userId,
    quantityOptionPrice
  ) => {
    // PERFORMANCE: Remove console.logs in production
    if (process.env.NODE_ENV === "development") {
      console.log("Adding item to cart:", {
        productId: product.id,
        variantId: variant?.id,
        quantity,
        userId,
        quantityOptionPrice,
      });
    }

    set({ isLoading: true });

    let updatedItems: CartItem[] = [];

    set((state) => {
      const variantPriceAdjustment = variant?.price_adjustment || 0;

      // Check if item already exists in cart
      // Match on product ID and variant (using SKU if available, otherwise ID)
      // This ensures different variants of the same product are treated as separate items
      const variantId = variant?.id || "no-variant";
      const variantSku = variant?.sku || "";
      const variantIdentifier = variantSku || variantId;

      const existingItemIndex = state.items.findIndex((item) => {
        const itemVariantId = item.variant?.id || "no-variant";
        const itemVariantSku = item.variant?.sku || "";
        const itemVariantIdentifier = itemVariantSku || itemVariantId;

        return (
          item.product.id === product.id &&
          itemVariantIdentifier === variantIdentifier
        );
      });

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const items = [...state.items];
        const existingItem = items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;

        // Calculate price based on new quantity and pricing tiers
        // If quantityOptionPrice is provided, use it (it's already per unit)
        const pricePerUnit = calculateItemPricePerUnit(
          newQuantity,
          product.basePrice,
          variantPriceAdjustment,
          product.pricingTiers,
          quantityOptionPrice
        );

        items[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          pricePerUnit,
          totalPrice: pricePerUnit * newQuantity,
          // Preserve quantityOptionPrice if it exists
          quantityOptionPrice: existingItem.quantityOptionPrice,
        };
        updatedItems = items;
        return { items: updatedItems, isLoading: false };
      } else {
        // Add new item
        const pricePerUnit = calculateItemPricePerUnit(
          quantity,
          product.basePrice,
          variantPriceAdjustment,
          product.pricingTiers,
          quantityOptionPrice
        );

        // Generate unique cart item ID
        // Include product ID and variant ID (if exists)
        // Use variant SKU if available for better uniqueness, otherwise use variant ID
        // This ensures different variants of the same product get unique cart item IDs
        const variantId = variant?.id || "no-variant";
        const variantSku = variant?.sku || "";
        // Use SKU if available (more unique), otherwise use ID
        const variantIdentifier = variantSku || variantId;
        const uniqueId = `${product.id}-${variantIdentifier}`;

        const newItem: CartItem = {
          id: uniqueId,
          product,
          variant,
          quantity,
          pricePerUnit,
          totalPrice: pricePerUnit * quantity,
          quantityOptionPrice: quantityOptionPrice, // Store quantity option price for future updates
        };
        updatedItems = [...state.items, newItem];
        return { items: updatedItems, isLoading: false };
      }
    });

    if (process.env.NODE_ENV === "development") {
      console.log("Cart items updated. New item count:", updatedItems.length);
    }

    // Sync to storage after state update
    await get().syncCart(userId);
  },

  removeItem: async (itemId, userId) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Removing item from cart:", { itemId, userId });
    }

    set({ isLoading: true });

    set((state) => {
      const filteredItems = state.items.filter((item) => item.id !== itemId);
      if (process.env.NODE_ENV === "development") {
        console.log("Item removed. New cart item count:", filteredItems.length);
      }
      return {
        items: filteredItems,
        isLoading: false,
      };
    });

    // Sync to storage after state update
    await get().syncCart(userId);
  },

  updateQuantity: async (itemId, quantity, userId) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Updating item quantity:", { itemId, quantity, userId });
    }

    if (quantity <= 0) {
      if (process.env.NODE_ENV === "development") {
        console.log("Quantity is 0 or less, removing item instead");
      }
      await get().removeItem(itemId, userId);
      return;
    }

    set({ isLoading: true });

    set((state) => {
      const updatedItems = state.items.map((item) => {
        if (item.id === itemId) {
          const variantAdjustment = item.variant?.price_adjustment || 0;

          // Helper to find the best matching quantity option (largest <= quantity)
          // Matches the logic from product-purchase-section.tsx
          const findMatchingQuantityOption = (
            inputQuantity: number,
            quantityOptions?: ProductVariant["quantityOptions"]
          ): { quantity: number; pricePerUnit?: number } | null => {
            if (!quantityOptions || quantityOptions.length === 0) {
              return null;
            }

            // Filter active options and sort by quantity descending
            const activeOptions = quantityOptions
              .filter((opt) => opt.isActive)
              .sort((a, b) => b.quantity - a.quantity);

            // Find the largest option that is <= input quantity
            const matchingOption = activeOptions.find(
              (opt) => opt.quantity <= inputQuantity
            );

            if (matchingOption) {
              return {
                quantity: matchingOption.quantity,
                pricePerUnit: matchingOption.pricePerUnit,
              };
            }

            return null;
          };

          // Find matching quantity option for the new quantity (if variant has options)
          // Always recalculate based on new quantity, don't keep old quantityOptionPrice
          let quantityOptionPrice: number | undefined = undefined;

          if (
            item.variant?.quantityOptions &&
            item.variant.quantityOptions.length > 0
          ) {
            const matchingOption = findMatchingQuantityOption(
              quantity,
              item.variant.quantityOptions
            );

            if (matchingOption?.pricePerUnit !== undefined) {
              // Use the price from the matching quantity option
              quantityOptionPrice = matchingOption.pricePerUnit;
            }
            // If no matching option or no price, quantityOptionPrice remains undefined
            // Pricing tiers will then be applied based on the new quantity
          }

          // Calculate price per unit using pricing service
          // Priority: quantity option price > pricing tiers > base price
          // Matches the logic from product-purchase-section.tsx
          // Pricing tiers are ALWAYS recalculated based on the new quantity
          const pricePerUnit = calculateItemPricePerUnit(
            quantity,
            item.product.basePrice,
            variantAdjustment,
            item.product.pricingTiers,
            quantityOptionPrice
          );

          if (process.env.NODE_ENV === "development") {
            console.log("Updated item:", {
              itemId,
              oldQuantity: item.quantity,
              newQuantity: quantity,
              newPricePerUnit: pricePerUnit,
            });
          }

          return {
            ...item,
            quantity,
            pricePerUnit,
            totalPrice: pricePerUnit * quantity,
            // Update quantityOptionPrice if we found a matching option
            quantityOptionPrice: quantityOptionPrice,
          };
        }
        return item;
      });

      return {
        items: updatedItems,
        isLoading: false,
      };
    });

    // Sync to storage after state update
    await get().syncCart(userId);
  },

  clearCart: async (userId) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Clearing cart for userId:", userId);
    }
    set({ isLoading: true });

    try {
      // Clear local state and reset shipping to default
      set({
        items: [],
        selectedShippingId: DEFAULT_SHIPPING_OPTION.id,
        isLoading: false,
      });

      // Delete cart from storage
      if (userId) {
        if (process.env.NODE_ENV === "development") {
          console.log("Deleting cart from Supabase for user:", userId);
        }
        await saveCartToSupabase([], userId);
        if (process.env.NODE_ENV === "development") {
          console.log("Cart cleared from Supabase successfully");
        }
      } else {
        if (process.env.NODE_ENV === "development") {
          console.log("Guest cart cleared from localStorage");
        }
        clearGuestCartFromLocalStorage();
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
      set({ isLoading: false });
    }
  },

  setShippingMethod: (shippingId) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Setting shipping method:", shippingId);
    }
    set({ selectedShippingId: shippingId });
  },

  getCartSummary: () => {
    const items = get().items;
    // Subtotal is the sum of all item total prices (already includes pricing tiers/quantity options)
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

    // Discount should only be for actual promotional discounts, not pricing tiers/quantity options
    // Pricing tiers and quantity options are part of the normal pricing structure
    // Only show discount if product has an explicit discount field
    const discount = items.reduce((sum, item) => {
      // Only count discount if product has an explicit discount percentage
      if (item.product.discount && item.product.discount > 0) {
        const variantAdjustment = item.variant?.price_adjustment || 0;
        const basePrice = item.product.basePrice + variantAdjustment;
        const discountAmount = basePrice * (item.product.discount / 100);
        return sum + discountAmount * item.quantity;
      }
      return sum;
    }, 0);

    // Use selected shipping cost
    const selectedShippingId = get().selectedShippingId;
    const shipping = getShippingPrice(selectedShippingId);

    const total = subtotal - discount + shipping;

    return {
      items,
      subtotal,
      discount,
      shipping,
      total,
    };
  },

  getCartSummaryWithShipping: () => {
    const items = get().items;
    // Subtotal is the sum of all item total prices (already includes pricing tiers/quantity options)
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

    // Discount should only be for actual promotional discounts, not pricing tiers/quantity options
    // Pricing tiers and quantity options are part of the normal pricing structure
    // Only show discount if product has an explicit discount field
    const discount = items.reduce((sum, item) => {
      // Only count discount if product has an explicit discount percentage
      if (item.product.discount && item.product.discount > 0) {
        const variantAdjustment = item.variant?.price_adjustment || 0;
        const basePrice = item.product.basePrice + variantAdjustment;
        const discountAmount = basePrice * (item.product.discount / 100);
        return sum + discountAmount * item.quantity;
      }
      return sum;
    }, 0);

    // Get selected shipping cost
    const selectedShippingId = get().selectedShippingId;
    const shippingCost = getShippingPrice(selectedShippingId);

    // Calculate total with VAT
    const calculation = calculateOrderTotal(subtotal - discount, shippingCost);
    calculation.shippingMethod = selectedShippingId;

    return {
      ...calculation,
      items,
      discount,
    };
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));

// Export helper functions for CartProvider to use
export const cartStorageHelpers = {
  saveGuestCart: saveGuestCartToLocalStorage,
  loadGuestCart: loadGuestCartFromLocalStorage,
  clearGuestCart: clearGuestCartFromLocalStorage,
};
