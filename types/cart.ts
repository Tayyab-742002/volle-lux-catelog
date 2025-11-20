import { Product, ProductVariant } from "./product";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  quantityOptionPrice?: number; // Store quantity option price if item was added with one
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface BillingAddress extends ShippingAddress {
  fullName: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  subtotal: number;
  discount: number;
  shipping: number;
  shippingMethod?: string | null;
  vatAmount?: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  paymentIntentId?: string;
}

