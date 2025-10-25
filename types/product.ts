export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price_adjustment: number;
}

export interface PricingTier {
  minQuantity: number;
  maxQuantity?: number;
  pricePerUnit: number;
  discount?: number;
  label?: string; // e.g., "Wholesale", "10% Off"
}

export interface Product {
  id: string;
  product_code: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  images?: string[]; // Multiple images for gallery
  basePrice: number;
  discount?: number;
  variants?: ProductVariant[];
  category?: string;
  pricingTiers?: PricingTier[]; // Tiered pricing for bulk orders
  specifications?: Record<string, string>; // Product specifications
  delivery?: string; // Delivery information
}
