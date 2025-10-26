# Sanity Client Setup Documentation

## Overview

This document describes the Sanity client setup, GROQ queries, and helper functions created for the Volle e-commerce platform.

## Files Created

### Core Files

- `sanity/lib/queries.ts` - GROQ query definitions
- `sanity/lib/api.ts` - Main API functions
- `sanity/lib/helpers.ts` - Helper functions and data transformation
- `sanity/lib/image.ts` - Enhanced image URL builder (updated)
- `sanity/lib/test.ts` - Test functions
- `sanity/lib/index.ts` - Main export file

## GROQ Queries (`queries.ts`)

### Product Queries

- `PRODUCT_QUERY` - Full product data with all fields
- `PRODUCT_LISTING_QUERY` - Simplified product data for listings
- `ALL_PRODUCTS_QUERY` - All active products
- `FEATURED_PRODUCTS_QUERY` - Featured products only
- `NEW_ARRIVALS_QUERY` - New arrival products
- `PRODUCT_BY_SLUG_QUERY` - Single product by slug
- `PRODUCTS_BY_CATEGORY_QUERY` - Products filtered by category
- `SEARCH_PRODUCTS_QUERY` - Product search functionality
- `FILTERED_PRODUCTS_QUERY` - Advanced filtering
- `PRODUCTS_BY_IDS_QUERY` - Multiple products by IDs

### Category Queries

- `CATEGORY_QUERY` - Full category data
- `ALL_CATEGORIES_QUERY` - All active categories
- `CATEGORY_BY_SLUG_QUERY` - Single category by slug
- `PRODUCT_COUNT_BY_CATEGORY_QUERY` - Product count per category

### Special Queries

- `HOMEPAGE_DATA_QUERY` - Combined homepage data (categories + featured + new arrivals)

## API Functions (`api.ts`)

### Product Functions

```typescript
getAllProducts()                    // Get all active products
getFeaturedProducts()              // Get featured products
getNewArrivals()                   // Get new arrival products
getProductBySlug(slug: string)     // Get single product by slug
getProductsByCategory(categoryId)  // Get products by category
getProductsByIds(ids: string[])    // Get multiple products by IDs
searchProducts(searchTerm: string) // Search products
getFilteredProducts(filters, sort) // Advanced filtering and sorting
```

### Category Functions

```typescript
getAllCategories()                 // Get all active categories
getCategoryBySlug(slug: string)    // Get single category by slug
getProductCountByCategory(categoryId) // Get product count per category
```

### Utility Functions

```typescript
getHomepageData(); // Get combined homepage data
testConnection(); // Test Sanity connection
getProductSlugs(); // Get all product slugs
getCategorySlugs(); // Get all category slugs
```

## Helper Functions (`helpers.ts`)

### Data Transformation

- `transformSanityProduct()` - Convert Sanity product to our Product type
- `transformSanityCategory()` - Convert Sanity category to our Category type

### Image Helpers

- `getImageUrl()` - Get optimized image URL with dimensions
- `getResponsiveImageUrls()` - Get responsive image URLs with srcSet

### Query Builders

- `buildFilterString()` - Build GROQ filter string from filter object
- `buildOrderString()` - Build GROQ order string from sort option

### Error Handling

- `safeQuery()` - Wrapper for error handling in queries

## Image Optimization (`image.ts`)

### Image Presets

```typescript
imagePresets.card(source); // 400x400, crop, 80% quality
imagePresets.thumbnail(source); // 100x100, crop, 70% quality
imagePresets.gallery(source); // 800x800, crop, 85% quality
imagePresets.hero(source); // 1200x600, crop, 90% quality
imagePresets.category(source); // 600x400, crop, 85% quality
imagePresets.seo(source); // 1200x630, crop, 90% quality
```

### Responsive Images

```typescript
getResponsiveImageUrls(source); // Returns src and srcSet for responsive images
```

## Usage Examples

### Basic Product Fetching

```typescript
import { getAllProducts, getProductBySlug } from "@/sanity/lib";

// Get all products
const products = await getAllProducts();

// Get single product
const product = await getProductBySlug("heavy-duty-shipping-boxes");
```

### Advanced Filtering

```typescript
import { getFilteredProducts } from "@/sanity/lib";

const filteredProducts = await getFilteredProducts(
  {
    category: "category-id",
    size: ["Small", "Medium"],
    priceMin: 10,
    priceMax: 100,
  },
  "price-low"
);
```

### Image Optimization

```typescript
import { imagePresets, getResponsiveImageUrls } from "@/sanity/lib";

// Use preset
const cardImageUrl = imagePresets.card(product.mainImage);

// Responsive images
const { src, srcSet } = getResponsiveImageUrls(product.mainImage);
```

### Homepage Data

```typescript
import { getHomepageData } from "@/sanity/lib";

const { categories, featuredProducts, newArrivals } = await getHomepageData();
```

## Testing

### Run Tests

```typescript
import { runTests } from "@/sanity/lib/test";

// Run all tests
await runTests();
```

### Test Individual Functions

```typescript
import { testConnection, getAllProducts } from "@/sanity/lib";

// Test connection
const isConnected = await testConnection();

// Test products
const products = await getAllProducts();
```

## Error Handling

All API functions use the `safeQuery` wrapper which:

- Catches and logs errors
- Returns `null` on error instead of throwing
- Provides consistent error handling across all queries

## Performance Optimizations

1. **CDN Usage**: All queries use `useCdn: true` for faster responses
2. **Image Optimization**: Multiple image presets for different use cases
3. **Selective Fields**: Separate queries for listings vs full product data
4. **Caching**: Leverages Sanity's built-in caching
5. **Error Boundaries**: Safe error handling prevents crashes

## Next Steps

1. **Task 2.1.4**: Migrate mock data to Sanity CMS
2. **Task 2.1.5**: Integrate product service with Sanity
3. **Task 2.2**: Set up Supabase for user data

## Files Structure

```
sanity/lib/
├── client.ts          # Sanity client configuration
├── image.ts           # Image URL builder and presets
├── live.ts            # Live content API
├── queries.ts         # GROQ query definitions
├── api.ts             # Main API functions
├── helpers.ts         # Helper functions and transformations
├── test.ts            # Test functions
└── index.ts           # Main export file
```

