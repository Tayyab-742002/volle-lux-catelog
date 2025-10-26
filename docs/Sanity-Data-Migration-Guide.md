# Sanity Data Migration Guide

## Overview

This guide walks you through migrating mock data to Sanity CMS for the Volle e-commerce platform. The migration includes categories, products, variants, and pricing tiers.

## Prerequisites

- ✅ Sanity Studio accessible at `/admin-dashboard`
- ✅ Environment variables configured
- ✅ Schemas created and working

## Migration Steps

### Step 1: Manual Category Creation

Since we need to upload images, we'll create categories manually in Sanity Studio first:

1. **Go to Sanity Studio**: `http://localhost:3000/admin-dashboard`
2. **Create Categories**:
   - Click "Create" → "Category"
   - Fill in the following data:

#### Category 1: Shipping Boxes

- **Name**: Shipping Boxes
- **Slug**: shipping-boxes (auto-generated)
- **Description**: Heavy-duty shipping boxes for all your packaging needs
- **Image**: Upload image from `https://images.unsplash.com/photo-1577702312706-e23ff063064f?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800`
- **Active**: ✅ Yes
- **Sort Order**: 1

#### Category 2: Packaging Supplies

- **Name**: Packaging Supplies
- **Slug**: packaging-supplies
- **Description**: Essential packaging supplies and materials
- **Image**: Upload image from `https://images.unsplash.com/photo-1648587456176-4969b0124b12?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800`
- **Active**: ✅ Yes
- **Sort Order**: 2

#### Category 3: Bubble Wrap

- **Name**: Bubble Wrap
- **Slug**: bubble-wrap
- **Description**: Protective bubble wrap for fragile items
- **Image**: Upload image from `https://images.unsplash.com/photo-1613574203646-ffdae46ce3e9?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800`
- **Active**: ✅ Yes
- **Sort Order**: 3

#### Category 4: Envelopes & Mailers

- **Name**: Envelopes & Mailers
- **Slug**: envelopes-mailers
- **Description**: Envelopes and mailers for shipping documents and small items
- **Image**: Upload image from `https://images.unsplash.com/photo-1627618998627-70a92a874cc2?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800`
- **Active**: ✅ Yes
- **Sort Order**: 4

#### Category 5: Protective Materials

- **Name**: Protective Materials
- **Slug**: protective-materials
- **Description**: Various protective materials for shipping
- **Image**: Upload image from `https://images.unsplash.com/photo-1631010231130-5c7828d9a3a7?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800`
- **Active**: ✅ Yes
- **Sort Order**: 5

### Step 2: Product Creation

After creating categories, create the following products:

#### Product 1: Heavy Duty Shipping Boxes

- **Name**: Heavy Duty Shipping Boxes
- **Slug**: heavy-duty-shipping-boxes
- **Product Code**: BOX-001
- **Description**: Premium heavy-duty shipping boxes designed to protect your products during transit. Made from high-quality corrugated cardboard with reinforced edges for maximum durability.
- **Short Description**: Heavy-duty corrugated shipping boxes with reinforced edges
- **Category**: Shipping Boxes
- **Main Image**: Upload from `https://images.unsplash.com/photo-1680034977375-3d83ee017e52?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800`
- **Gallery Images**: Add 2-3 additional images
- **Base Price**: 1.99
- **Discount**: 20
- **Active**: ✅ Yes
- **Featured**: ✅ Yes
- **New Arrival**: ❌ No
- **Tags**: heavy-duty, corrugated, shipping, durable
- **SEO Title**: Heavy Duty Shipping Boxes - Premium Packaging Solutions
- **SEO Description**: High-quality heavy-duty shipping boxes for secure product transportation. Available in multiple sizes with bulk pricing.
- **Delivery**: Standard shipping: 2-3 business days. Express shipping available.

**Variants**:

- C4 (SKU: BOX-001-C4, Price Adjustment: 0)
- C5 (SKU: BOX-001-C5, Price Adjustment: 0.5)
- C6 (SKU: BOX-001-C6, Price Adjustment: 1.0)

**Pricing Tiers**:

- 1-49 units: $1.99 each
- 50-99 units: $1.79 each (10% Off)
- 100+ units: $1.59 each (Wholesale)

**Specifications**:

- Material: Corrugated Cardboard
- Max Weight: 65 lbs
- Dimensions: Various Sizes Available
- Certification: FSC Certified

#### Product 2: Premium Bubble Wrap

- **Name**: Premium Bubble Wrap
- **Slug**: premium-bubble-wrap
- **Product Code**: WRAP-001
- **Description**: High-quality bubble wrap providing excellent protection for fragile items during shipping. Features large bubbles for maximum cushioning.
- **Short Description**: Premium bubble wrap with large bubbles for maximum protection
- **Category**: Bubble Wrap
- **Main Image**: Upload from `https://images.unsplash.com/photo-1592829016842-156c305ecc7e?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800`
- **Base Price**: 2.49
- **Discount**: 15
- **Active**: ✅ Yes
- **Featured**: ✅ Yes
- **New Arrival**: ❌ No
- **Tags**: bubble-wrap, protective, fragile, cushioning

**Variants**:

- Small (SKU: WRAP-001-S, Price Adjustment: 0)
- Medium (SKU: WRAP-001-M, Price Adjustment: 0.5)
- Large (SKU: WRAP-001-L, Price Adjustment: 1.0)

**Pricing Tiers**:

- 1-24 units: $2.49 each
- 25-49 units: $2.24 each (10% Off)
- 50+ units: $2.12 each (Bulk Discount)

#### Product 3: Bubble Mailers

- **Name**: Bubble Mailers
- **Slug**: bubble-mailers
- **Product Code**: ENV-001
- **Description**: Self-sealing bubble mailers perfect for shipping small items safely. Features built-in bubble wrap lining for protection.
- **Short Description**: Self-sealing bubble mailers with built-in protection
- **Category**: Envelopes & Mailers
- **Main Image**: Upload from `https://images.unsplash.com/photo-1617912760778-f3a1b93192ad?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800`
- **Base Price**: 0.99
- **Active**: ✅ Yes
- **Featured**: ❌ No
- **New Arrival**: ✅ Yes
- **Tags**: mailers, bubble, self-sealing, small-items

**Variants**:

- 6x10 (SKU: ENV-001-6x10, Price Adjustment: 0)
- 8x12 (SKU: ENV-001-8x12, Price Adjustment: 0.2)
- 10x15 (SKU: ENV-001-10x15, Price Adjustment: 0.4)

**Pricing Tiers**:

- 1-99 units: $0.99 each
- 100-499 units: $0.89 each (10% Off)
- 500+ units: $0.79 each (Bulk Pricing)

#### Product 4: Packing Peanuts

- **Name**: Packing Peanuts
- **Slug**: packing-peanuts
- **Product Code**: PEANUTS-001
- **Description**: Biodegradable packing peanuts for filling voids and protecting items during shipping. Made from cornstarch for eco-friendly packaging.
- **Short Description**: Biodegradable packing peanuts made from cornstarch
- **Category**: Protective Materials
- **Base Price**: 3.99
- **Active**: ✅ Yes
- **Featured**: ❌ No
- **New Arrival**: ✅ Yes
- **Tags**: packing-peanuts, biodegradable, cornstarch, eco-friendly

**Variants**:

- Small (SKU: PEANUTS-001-S, Price Adjustment: 0)
- Medium (SKU: PEANUTS-001-M, Price Adjustment: 1.0)
- Large (SKU: PEANUTS-001-L, Price Adjustment: 2.0)

#### Product 5: Corrugated Mailers

- **Name**: Corrugated Mailers
- **Slug**: corrugated-mailers
- **Product Code**: CORR-001
- **Description**: Heavy-duty corrugated mailers with reinforced edges. Perfect for shipping books, documents, and medium-weight items.
- **Short Description**: Heavy-duty corrugated mailers with reinforced edges
- **Category**: Envelopes & Mailers
- **Base Price**: 1.49
- **Active**: ✅ Yes
- **Featured**: ✅ Yes
- **New Arrival**: ❌ No
- **Tags**: corrugated, mailers, heavy-duty, reinforced

**Variants**:

- 9x12 (SKU: CORR-001-9x12, Price Adjustment: 0)
- 10x13 (SKU: CORR-001-10x13, Price Adjustment: 0.3)
- 12x15 (SKU: CORR-001-12x15, Price Adjustment: 0.6)

## Image URLs for Upload

### Category Images

1. Shipping Boxes: `https://images.unsplash.com/photo-1577702312706-e23ff063064f?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800`
2. Packaging Supplies: `https://images.unsplash.com/photo-1648587456176-4969b0124b12?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800`
3. Bubble Wrap: `https://images.unsplash.com/photo-1613574203646-ffdae46ce3e9?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800`
4. Envelopes & Mailers: `https://images.unsplash.com/photo-1627618998627-70a92a874cc2?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800`
5. Protective Materials: `https://images.unsplash.com/photo-1631010231130-5c7828d9a3a7?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800`

### Product Images

1. Heavy Duty Shipping Boxes: `https://images.unsplash.com/photo-1680034977375-3d83ee017e52?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800`
2. Premium Bubble Wrap: `https://images.unsplash.com/photo-1592829016842-156c305ecc7e?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800`
3. Bubble Mailers: `https://images.unsplash.com/photo-1617912760778-f3a1b93192ad?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800`

## Testing Migration

After creating the data:

1. **Test Categories**: Go to `/admin-dashboard` and verify all categories are created
2. **Test Products**: Verify all products are created with proper variants and pricing tiers
3. **Test API**: Use the test functions to verify data is accessible

```typescript
import { runTests } from "@/sanity/lib/test";
await runTests();
```

## Next Steps

After migration is complete:

1. **Task 2.1.5**: Integrate product service with Sanity
2. **Task 2.2**: Set up Supabase for user data

## Troubleshooting

### Common Issues

1. **Image Upload Fails**: Make sure you have proper permissions in Sanity
2. **Category Reference Error**: Ensure categories are created before products
3. **Slug Conflicts**: Sanity will auto-generate slugs, but you can customize them

### Verification Checklist

- [ ] All 5 categories created
- [ ] All 5 products created
- [ ] Product variants added
- [ ] Pricing tiers configured
- [ ] Images uploaded successfully
- [ ] Featured products marked correctly
- [ ] New arrivals marked correctly
- [ ] API tests pass
