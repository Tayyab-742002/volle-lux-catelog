export interface QuantityOption {
  label: string; // e.g., "50 Pouches", "100 Pouches"
  quantity: number; // e.g., 50, 100, 500
  unit: string; // e.g., "Pouches", "Packets"
  pricePerUnit?: number; // Optional: specific price for this quantity option
  isActive: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price_adjustment: number;
  quantityOptions?: QuantityOption[]; // Optional: only for products sold in packets/pouches
}

export interface PricingTier {
  minQuantity: number;
  maxQuantity?: number;
  discount: number; // Required: Discount percentage (0-100)
  label?: string; // e.g., "Wholesale", "10% Off"
}

export interface Product {
  id: string;
  product_code: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  imageAlt?: string; // Alt text for main image (SEO)
  images?: string[]; // Multiple images for gallery
  imagesAlt?: string[]; // Alt text for gallery images (SEO)
  basePrice: number;
  discount?: number;
  variants?: ProductVariant[];
  category?: string;
  categorySlug?: string; // Category slug for filtering
  pricingTiers?: PricingTier[]; // Tiered pricing for bulk orders
  specifications?: Record<string, string>; // Product specifications
  delivery?: string; // Delivery information
  seoTitle?: string; // Custom SEO title
  seoDescription?: string; // Custom SEO description
}
