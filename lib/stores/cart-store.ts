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
  type ShippingCalculation
} from "@/types/shipping";
import { calculateOrderTotal } from "@/services/pricing/pricing.service";

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
  getCartSummaryWithShipping: () => ShippingCalculation & { items: CartItem[]; discount: number };
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
function calculatePricePerUnit(
  quantity: number,
  basePrice: number,
  variantAdjustment: number,
  pricingTiers?: PricingTier[],
  quantityOptionPrice?: number // Price from selected quantity option (takes priority)
): number {
  // If quantity option has a specific price, use that (highest priority)
  if (quantityOptionPrice !== undefined) {
    return quantityOptionPrice;
  }

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
      if (process.env.NODE_ENV === 'development') {
        console.log("Cart sync skipped: cart is loading");
      }
      return;
    }

    try {
      if (userId) {
        // Sync authenticated user cart to Supabase
        if (process.env.NODE_ENV === 'development') {
          console.log("Syncing cart to Supabase:", {
            itemCount: items.length,
            userId,
          });
        }

        await saveCartToSupabase(items, userId);
        if (process.env.NODE_ENV === 'development') {
          console.log("Cart synced successfully to Supabase");
        }
      } else {
        // Sync guest cart to localStorage
        saveGuestCartToLocalStorage(items);
        if (process.env.NODE_ENV === 'development') {
          console.log("Guest cart synced to localStorage");
        }
      }
    } catch (error) {
      console.error("Failed to sync cart:", error);
    }
  },

  addItem: async (product, variant, quantity = 1, userId, quantityOptionPrice) => {
    // PERFORMANCE: Remove console.logs in production
    if (process.env.NODE_ENV === 'development') {
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
      // For quantity options, we need to match on variant + quantity option price
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.variant?.id === variant?.id &&
          // If quantity option price exists, match on that too
          (quantityOptionPrice === undefined ||
            item.pricePerUnit === quantityOptionPrice)
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const items = [...state.items];
        const existingItem = items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;

        // Calculate price based on new quantity and pricing tiers
        // If quantityOptionPrice is provided, use it (it's already per unit)
        const pricePerUnit = calculatePricePerUnit(
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
        const pricePerUnit = calculatePricePerUnit(
          quantity,
          product.basePrice,
          variantPriceAdjustment,
          product.pricingTiers,
          quantityOptionPrice
        );

        const newItem: CartItem = {
          id: `${product.id}-${variant?.id || "default"}`,
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

    if (process.env.NODE_ENV === 'development') {
      console.log("Cart items updated. New item count:", updatedItems.length);
    }

    // Sync to storage after state update
    await get().syncCart(userId);
  },

  removeItem: async (itemId, userId) => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Removing item from cart:", { itemId, userId });
    }

    set({ isLoading: true });

    set((state) => {
      const filteredItems = state.items.filter((item) => item.id !== itemId);
      if (process.env.NODE_ENV === 'development') {
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
    if (process.env.NODE_ENV === 'development') {
      console.log("Updating item quantity:", { itemId, quantity, userId });
    }

    if (quantity <= 0) {
      if (process.env.NODE_ENV === 'development') {
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

          // Check if variant has quantity options and if new quantity matches one
          let quantityOptionPrice: number | undefined = item.quantityOptionPrice;
          
          if (item.variant?.quantityOptions && item.variant.quantityOptions.length > 0) {
            // Find matching quantity option for the new quantity
            const matchingOption = item.variant.quantityOptions.find(
              (opt) => opt.quantity === quantity && opt.isActive
            );
            
            if (matchingOption && matchingOption.pricePerUnit !== undefined) {
              // Use the price from the matching quantity option
              quantityOptionPrice = matchingOption.pricePerUnit;
            } else if (matchingOption) {
              // Option exists but no specific price, use base + variant adjustment
              quantityOptionPrice = undefined;
            }
            // If no matching option, keep the original quantityOptionPrice (if it exists)
            // This allows custom quantities to maintain their original pricing
          }

          // Calculate price per unit
          const pricePerUnit = calculatePricePerUnit(
            quantity,
            item.product.basePrice,
            variantAdjustment,
            item.product.pricingTiers,
            quantityOptionPrice
          );

          if (process.env.NODE_ENV === 'development') {
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
    if (process.env.NODE_ENV === 'development') {
      console.log("Clearing cart for userId:", userId);
    }
    set({ isLoading: true });

    try {
      // Clear local state and reset shipping to default
      set({ items: [], selectedShippingId: DEFAULT_SHIPPING_OPTION.id, isLoading: false });

      // Delete cart from storage
      if (userId) {
        if (process.env.NODE_ENV === 'development') {
          console.log("Deleting cart from Supabase for user:", userId);
        }
        await saveCartToSupabase([], userId);
        if (process.env.NODE_ENV === 'development') {
          console.log("Cart cleared from Supabase successfully");
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
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
    if (process.env.NODE_ENV === 'development') {
      console.log("Setting shipping method:", shippingId);
    }
    set({ selectedShippingId: shippingId });
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

    // Get selected shipping cost
    const selectedShippingId = get().selectedShippingId;
    const shippingCost = getShippingPrice(selectedShippingId);

    // Calculate total with VAT
    const calculation = calculateOrderTotal(subtotal - discount, shippingCost);
    calculation.shippingMethod = selectedShippingId;

    return {
      ...calculation,
      items,
      discount
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
