import { Product, ProductVariant } from "./product";

export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
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
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface BillingAddress extends ShippingAddress {}

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
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  paymentIntentId?: string;
}

