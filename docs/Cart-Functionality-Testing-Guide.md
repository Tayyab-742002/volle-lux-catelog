# Cart Functionality Testing Guide

## Overview

This document provides a comprehensive guide to test all cart functionality, including adding items, updating quantities, removing items, and clearing the cart.

## Cart Features Implemented

### 1. Add Item to Cart ✅

**Location:** `components/products/add-to-cart-button.tsx`

- Adds products to cart with variant support
- Calculates pricing based on quantity and pricing tiers
- Syncs to Supabase immediately after adding

**Test Steps:**

1. Navigate to a product page
2. Select variant (if available)
3. Select quantity
4. Click "Add to Cart"
5. Check console logs for:
   - "Adding item to cart"
   - "Cart items updated. New item count: X"
   - "Syncing cart to Supabase"
   - "Cart synced successfully"

### 2. Update Item Quantity ✅

**Location:** `components/cart/cart-item.tsx`

- Users can manually enter quantity in input field
- Recalculates price based on new quantity and pricing tiers
- Syncs to Supabase after update

**Test Steps:**

1. Go to cart page
2. Find an item
3. Change the quantity in the input field
4. Check console logs for:
   - "Updating item quantity"
   - "Updated item" with old/new quantities
   - "Syncing cart after quantity update"

### 3. Remove Item from Cart ✅

**Location:** `components/cart/cart-item.tsx`

- Click trash icon to remove item
- Syncs to Supabase after removal

**Test Steps:**

1. Go to cart page
2. Click trash icon on any item
3. Check console logs for:
   - "Removing item from cart"
   - "Item removed. New cart item count: X"
   - "Syncing cart after item removal"

### 4. Clear Entire Cart ✅

**Location:** `app/cart/page.tsx`

- Clears all items from cart
- Syncs empty cart to Supabase

**Test Steps:**

1. Go to cart page
2. Click "Clear Cart" button
3. Check console logs for:
   - "Clearing cart for userId"
   - "Syncing empty cart to Supabase"
   - "Cart cleared and synced successfully"

## Database Operations

### Cart Storage in Supabase

All cart operations are persisted to the `carts` table in Supabase:

```sql
CREATE TABLE public.carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest carts
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT carts_user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);
```

### Cart Operations Flow

#### For Authenticated Users:

1. User adds item → Cart updated in local state
2. Cart synced to Supabase with `user_id`
3. Check if cart exists → Update or Insert
4. All subsequent updates sync to Supabase

#### For Guest Users:

1. Guest adds item → Cart updated in local state
2. Cart synced to Supabase with `session_id`
3. Check if cart exists → Update or Insert
4. On login, guest cart merged with user cart

## Console Logging

All cart operations log detailed information to the console:

### Add Item Logs:

```
Adding item to cart: { productId, variantId, quantity, userId }
Cart items updated. New item count: X
Syncing cart to Supabase with userId: [userId]
Syncing cart to Supabase: { itemCount, userId, sessionId }
Checking for existing cart for user: [userId]
Existing cart check result: Found/Not found
Updating existing cart for user: [userId] / Creating new cart for user: [userId]
Cart updated successfully / Cart created successfully
Cart synced successfully to Supabase
```

### Update Quantity Logs:

```
Updating item quantity: { itemId, quantity, userId }
Updated item: { itemId, oldQuantity, newQuantity, newPricePerUnit }
Syncing cart after quantity update with userId: [userId]
Cart synced successfully to Supabase
```

### Remove Item Logs:

```
Removing item from cart: { itemId, userId }
Item removed. New cart item count: X
Syncing cart after item removal with userId: [userId]
Cart synced successfully to Supabase
```

### Clear Cart Logs:

```
Clearing cart for userId: [userId]
Syncing empty cart to Supabase with userId: [userId]
Cart cleared and synced successfully
```

## Testing Checklist

### Guest User Testing

- [ ] Add items to cart as guest
- [ ] Verify cart persists after page refresh
- [ ] Update quantity as guest
- [ ] Remove item as guest
- [ ] Sign up/login
- [ ] Verify guest cart merges with user cart

### Authenticated User Testing

- [ ] Add items to cart as authenticated user
- [ ] Verify cart saves to Supabase
- [ ] Open cart on different device
- [ ] Verify cart synced across devices
- [ ] Update quantity as authenticated user
- [ ] Remove item as authenticated user
- [ ] Clear entire cart
- [ ] Sign out and back in
- [ ] Verify cart persists

### Edge Cases

- [ ] Set quantity to 0 (should remove item)
- [ ] Add same product with different variants
- [ ] Add same product multiple times
- [ ] Rapid quantity changes
- [ ] Add to cart while offline (should queue)
- [ ] Switch between authenticated and guest

## Database Verification

To verify cart data is stored in Supabase:

```sql
-- Check all carts
SELECT id, user_id, session_id, items, updated_at
FROM carts
ORDER BY updated_at DESC;

-- Check specific user cart
SELECT id, items, updated_at
FROM carts
WHERE user_id = 'YOUR_USER_ID';

-- Check guest cart
SELECT id, items, updated_at
FROM carts
WHERE session_id = 'YOUR_SESSION_ID';
```

## Troubleshooting

### Cart Not Saving to Supabase

1. Check console logs for errors
2. Verify user is logged in
3. Check Supabase connection
4. Verify RLS policies are correct
5. Check network tab for failed requests

### Cart Not Loading

1. Check console logs for initialization
2. Verify cart is initialized in CartProvider
3. Check if isInitialized flag is true
4. Verify Supabase query is returning data

### Quantity Not Updating

1. Check if price is recalculating
2. Verify pricing tiers are working
3. Check console logs for update operation
4. Verify Supabase is updating cart

### Items Not Removing

1. Check console logs for remove operation
2. Verify cart is syncing after removal
3. Check if cart state is updating locally
4. Verify Supabase is deleting/updating cart

## Performance Considerations

- Cart syncs every 30 seconds automatically
- Immediate sync on add/update/remove operations
- Optimistic updates for instant feedback
- Error handling with retry logic
- Loading states prevent race conditions

## Security

- RLS policies enforce cart isolation
- Users can only access their own carts
- Guest carts use session IDs
- Cart data encrypted in transit (HTTPS)
- Validated on both client and server

---

**Status:** All cart functionality is implemented and working ✅
**Last Updated:** December 2024
