"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Cart } from "@/types/cart";
import { Product, ProductVariant, PricingTier } from "@/types/product";

interface CartStore {
  items: CartItem[];
  addItem: (
    product: Product,
    variant?: ProductVariant,
    quantity?: number
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartSummary: () => Cart;
  getItemCount: () => number;
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

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const variantPriceAdjustment = variant?.price_adjustment || 0;

          // Check if item already exists in cart
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id && item.variant?.id === variant?.id
          );

          if (existingItemIndex >= 0) {
            // Update existing item quantity
            const updatedItems = [...state.items];
            const existingItem = updatedItems[existingItemIndex];
            const newQuantity = existingItem.quantity + quantity;

            // Calculate price based on new quantity and pricing tiers
            const pricePerUnit = calculatePricePerUnit(
              newQuantity,
              product.basePrice,
              variantPriceAdjustment,
              product.pricingTiers
            );

            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity,
              pricePerUnit,
              totalPrice: pricePerUnit * newQuantity,
            };
            return { items: updatedItems };
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
            return { items: [...state.items, newItem] };
          }
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === itemId) {
              const variantAdjustment = item.variant?.price_adjustment || 0;

              // Recalculate price per unit based on new quantity and pricing tiers
              const pricePerUnit = calculatePricePerUnit(
                quantity,
                item.product.basePrice,
                variantAdjustment,
                item.product.pricingTiers
              );

              return {
                ...item,
                quantity,
                pricePerUnit,
                totalPrice: pricePerUnit * quantity,
              };
            }
            return item;
          }),
        }));
      },

      clearCart: () => {
        set({ items: [] });
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
    }
  )
);
