# Sanity Content Schemas Documentation

## Overview

This document describes the Sanity CMS content schemas for the Volle e-commerce platform. All schemas are designed to match the existing TypeScript interfaces in `types/product.ts`.

## Schema Types

### 1. Category Schema (`category`)

**Purpose**: Product categories for organization and filtering

**Fields**:

- `name` (string, required): Category name
- `slug` (slug, required): URL-friendly identifier
- `description` (text): Category description
- `image` (image): Category image with alt text
- `isActive` (boolean): Whether category is visible
- `sortOrder` (number): Display order

**Preview**: Shows name, slug, and image

### 2. Product Schema (`product`)

**Purpose**: Main product information

**Fields**:

- `name` (string, required): Product name
- `slug` (slug, required): URL-friendly identifier
- `productCode` (string, required): Internal SKU/code
- `description` (text): Main product description
- `shortDescription` (text): Brief description for cards
- `category` (reference to category, required): Product category
- `mainImage` (image, required): Primary product image
- `galleryImages` (array of images): Additional gallery images
- `basePrice` (number, required): Base price per unit
- `discount` (number): Overall discount percentage
- `variants` (array of productVariant): Product variants
- `pricingTiers` (array of pricingTier): Bulk pricing tiers
- `specifications` (array of objects): Product specifications
- `delivery` (text): Delivery information
- `isActive` (boolean): Whether product is visible
- `isFeatured` (boolean): Featured product flag
- `isNewArrival` (boolean): New arrival flag
- `tags` (array of strings): Filtering tags
- `seoTitle` (string): Custom SEO title
- `seoDescription` (text): Custom SEO description

**Preview**: Shows name, product code, category, and main image

### 3. Product Variant Schema (`productVariant`)

**Purpose**: Product variants (sizes, colors, etc.)

**Fields**:

- `name` (string, required): Variant name (e.g., "Small", "C4")
- `sku` (string, required): Unique SKU
- `priceAdjustment` (number): Price adjustment from base price
- `isActive` (boolean): Whether variant is available
- `stockQuantity` (number): Available stock

**Preview**: Shows name, SKU, and price adjustment

### 4. Pricing Tier Schema (`pricingTier`)

**Purpose**: Bulk pricing tiers

**Fields**:

- `minQuantity` (number, required): Minimum quantity
- `maxQuantity` (number): Maximum quantity (optional)
- `pricePerUnit` (number, required): Price per unit
- `discount` (number): Discount percentage
- `label` (string): Tier label (e.g., "Wholesale")

**Preview**: Shows quantity range, price, and label

## Schema Relationships

```
Category (1) ←→ (Many) Product
Product (1) ←→ (Many) ProductVariant
Product (1) ←→ (Many) PricingTier
```

## Usage in GROQ Queries

### Fetch all products with category

```groq
*[_type == "product" && isActive == true] {
  _id,
  name,
  slug,
  productCode,
  basePrice,
  discount,
  mainImage,
  category-> {
    name,
    slug
  },
  variants[] {
    name,
    sku,
    priceAdjustment
  },
  pricingTiers[] {
    minQuantity,
    maxQuantity,
    pricePerUnit,
    discount,
    label
  }
}
```

### Fetch featured products

```groq
*[_type == "product" && isActive == true && isFeatured == true] {
  _id,
  name,
  slug,
  productCode,
  basePrice,
  mainImage,
  shortDescription
}
```

### Fetch products by category

```groq
*[_type == "product" && isActive == true && category._ref == $categoryId] {
  _id,
  name,
  slug,
  productCode,
  basePrice,
  mainImage
}
```

## Next Steps

1. **Task 2.1.3**: Set up Sanity client and GROQ queries
2. **Task 2.1.4**: Migrate mock data to Sanity CMS
3. **Task 2.1.5**: Integrate product service with Sanity

## Files Created

- `sanity/schemaTypes/category.ts`
- `sanity/schemaTypes/product.ts`
- `sanity/schemaTypes/productVariant.ts`
- `sanity/schemaTypes/pricingTier.ts`
- `sanity/schemaTypes/index.ts` (updated)

