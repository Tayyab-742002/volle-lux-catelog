"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Cart } from "@/types/cart";
import { Product, ProductVariant } from "@/types/product";

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

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const variantPriceAdjustment = variant?.price_adjustment || 0;
          const pricePerUnit = product.basePrice + variantPriceAdjustment;

          // Check if item already exists in cart
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.variant?.id === variant?.id
          );

          if (existingItemIndex >= 0) {
            // Update existing item quantity
            const updatedItems = [...state.items];
            const existingItem = updatedItems[existingItemIndex];
            const newQuantity = existingItem.quantity + quantity;
            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity,
              totalPrice: pricePerUnit * newQuantity,
            };
            return { items: updatedItems };
          } else {
            // Add new item
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
          items: state.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                  totalPrice: item.pricePerUnit * quantity,
                }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getCartSummary: () => {
        const items = get().items;
        const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
        
        // TODO: Calculate discount based on pricing tiers
        const discount = 0;
        
        // TODO: Calculate shipping based on order value
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

