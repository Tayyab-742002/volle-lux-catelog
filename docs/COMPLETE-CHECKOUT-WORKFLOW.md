# Complete E-commerce Checkout Workflow

## Overview

This document outlines the complete, production-ready e-commerce workflow from adding products to cart through successful order completion.

---

## Workflow Steps

### 1. **Add Product to Cart** ✅

**User Action**: User clicks "Add to Cart" on a product

**What Happens**:

1. Product is added to Zustand cart store (client-side state)
2. Cart automatically syncs to Supabase `carts` table
   - For authenticated users: `user_id` is used
   - For guest users: `session_id` is used
3. Cart icon updates to show item count
4. Success toast notification appears

**Files Involved**:

- `lib/stores/cart-store.ts` - Cart state management
- `services/cart/cart.service.ts` - Supabase persistence
- Product components with "Add to Cart" buttons

**Database**: Cart saved to `carts` table with RLS policies

---

### 2. **View Cart** ✅

**User Action**: User navigates to `/cart`

**What Happens**:

1. Cart page loads items from Zustand store
2. Store automatically syncs with Supabase on mount
3. User can:
   - Increase/decrease quantities
   - Remove items
   - See real-time price calculations
4. All changes sync to Supabase immediately

**Files Involved**:

- `app/cart/page.tsx` - Cart page UI
- `lib/stores/cart-store.ts` - Cart operations

---

### 3. **Proceed to Checkout** ✅

**User Action**: User clicks "Proceed to Checkout" button

**What Happens**:

1. User is redirected to `/checkout`
2. Cart items are validated (non-empty)
3. If unauthenticated, user can checkout as guest
4. Shipping address can be added (optional for now)

**Files Involved**:

- `app/checkout/page.tsx` - Checkout initiation page

---

### 4. **Create Stripe Checkout Session** ✅

**User Action**: Page loads and automatically initiates checkout

**What Happens**:

1. Client sends POST request to `/api/checkout`
2. Server validates cart items
3. Server creates Stripe checkout session with:
   - Line items (products, quantities, prices)
   - Customer email (if authenticated)
   - Shipping address collection
   - Metadata (cart items, user ID, addresses)
4. Cart is saved/updated in Supabase with `onConflict: "user_id"`
5. Server returns Stripe checkout URL
6. Client redirects to Stripe hosted checkout page

**Files Involved**:

- `app/api/checkout/route.ts` - API endpoint
- `services/stripe/checkout.service.ts` - Stripe logic
- `lib/stripe/config.ts` - Stripe configuration

**Environment Variables Required**:

- `STRIPE_SECRET_KEY` - Server-side Stripe API key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Client-side key

---

### 5. **Stripe Hosted Checkout** ✅

**User Action**: User completes payment on Stripe

**What Happens**:

1. User enters payment information on Stripe's secure page
2. User enters shipping address (if enabled)
3. Stripe processes payment
4. On success: User redirected to success URL
5. On cancel: User redirected to cart

**Stripe Configuration**:

- Payment methods: Card
- Currency: USD
- Success URL: `/checkout/success?session_id={CHECKOUT_SESSION_ID}`
- Cancel URL: `/cart`

---

### 6. **Webhook Handler (Background)** ✅

**Trigger**: Stripe sends `checkout.session.completed` webhook

**What Happens** (Server-side, asynchronous):

1. Webhook received at `/api/webhooks/stripe`
2. Signature verified for security
3. Session details retrieved from Stripe
4. Order created in Supabase `orders` table:
   - User ID (if authenticated)
   - Order items from metadata
   - Shipping address
   - Payment intent ID
   - Order status: "processing"
5. Cart is **NOT** cleared here (cleared on success page)

**Files Involved**:

- `app/api/webhooks/stripe/route.ts` - Webhook handler
- `services/orders/order.service.ts` - Order creation

**Environment Variables Required**:

- `STRIPE_WEBHOOK_SECRET` - Webhook signature verification

**Important**: This happens in parallel with the success page redirect. The order is created even if the user closes the browser.

---

### 7. **Order Confirmation Page** ✅

**User Action**: User is redirected after successful payment

**What Happens**:

1. User lands on `/checkout/success?session_id={id}`
2. Client calls `/api/verify-payment/{sessionId}` (server-side)
3. Server verifies payment status with Stripe
4. If paid, client fetches order from `/api/orders/by-session/{sessionId}`
5. Order details displayed:
   - Order ID
   - Order items with quantities and prices
   - Total amount
   - Shipping address
6. **Cart is cleared** from both Zustand and Supabase
7. Success message and next steps shown

**Files Involved**:

- `app/checkout/success/page.tsx` - Success page UI
- `app/api/verify-payment/[sessionId]/route.ts` - Payment verification
- `app/api/orders/by-session/[sessionId]/route.ts` - Order fetching

**Security**: Payment verification happens server-side to protect Stripe secret key

---

## Database Schema

### `carts` Table

```sql
- id: uuid (PK)
- user_id: uuid (FK to auth.users, unique)
- session_id: text (unique, for guest carts)
- items: jsonb (array of CartItem)
- updated_at: timestamp
```

**Constraint**: One cart per user (`user_id_unique`)

### `orders` Table

```sql
- id: uuid (PK)
- user_id: uuid (FK, nullable for guest orders)
- email: text
- items: jsonb (array of OrderItem)
- shipping_address: jsonb
- billing_address: jsonb
- subtotal: numeric
- discount: numeric
- shipping: numeric
- total: numeric
- status: text (processing, shipped, delivered, cancelled)
- stripe_session_id: text (unique)
- stripe_payment_intent_id: text
- created_at: timestamp
- updated_at: timestamp
```

---

## Environment Variables

**Required for Complete Workflow**:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Testing the Workflow

### 1. **Test Card Numbers** (Stripe Test Mode)

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any:

- Future expiry date (e.g., 12/34)
- Any 3-digit CVC
- Any ZIP code

### 2. **Test Authenticated User Flow**

1. Sign up / Log in
2. Add products to cart
3. Verify cart persists in Supabase
4. Proceed to checkout
5. Complete payment on Stripe
6. Verify order in Supabase `orders` table
7. Check cart is cleared

### 3. **Test Guest User Flow**

1. Browse without logging in
2. Add products to cart
3. Proceed to checkout as guest
4. Complete payment
5. Verify order created (no user_id)
6. Check cart is cleared

### 4. **Test Webhook**

1. Install Stripe CLI: `stripe login`
2. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Copy webhook secret to `.env.local`
4. Complete a test payment
5. Verify order created via webhook

---

## Error Handling

### Common Issues and Solutions

#### 1. **"Missing STRIPE_SECRET_KEY"**

- **Cause**: Environment variable not set or dev server not restarted
- **Fix**: Add to `.env.local` and restart `npm run dev`

#### 2. **"duplicate key value violates unique constraint"**

- **Cause**: Multiple checkout sessions for same user
- **Fix**: Already handled with `onConflict: "user_id"` in upsert

#### 3. **"Order not found"**

- **Cause**: Webhook hasn't processed yet (race condition)
- **Fix**: Webhook runs asynchronously; order may take a few seconds

#### 4. **Cart not persisting**

- **Cause**: RLS policies or auth issues
- **Fix**: Check Supabase RLS policies allow insert/update

#### 5. **406 Not Acceptable (Supabase)**

- **Cause**: Column doesn't exist or RLS policy blocks query
- **Fix**: Verify `session_id` column exists and RLS allows access

---

## Production Checklist

- [ ] Use live Stripe keys (not test keys)
- [ ] Set production webhook endpoint in Stripe Dashboard
- [ ] Enable HTTPS for webhook security
- [ ] Set `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Test all payment scenarios
- [ ] Enable email confirmations (Resend integration)
- [ ] Monitor Stripe Dashboard for payments
- [ ] Monitor Supabase for orders
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Test RLS policies thoroughly
- [ ] Enable rate limiting on API routes
- [ ] Add order status tracking for users

---

## Next Steps (Future Enhancements)

1. **Email Notifications** (Task 2.4)
   - Order confirmation emails via Resend
   - Shipping notifications

2. **Order Tracking**
   - Update order status (processing → shipped → delivered)
   - Tracking numbers

3. **Order History**
   - User dashboard to view past orders
   - Reorder functionality

4. **Guest Order Lookup**
   - Allow guests to check order status via email + order ID

5. **Inventory Management**
   - Reduce stock after successful payment
   - Handle out-of-stock scenarios

6. **Promotions & Discounts**
   - Coupon codes
   - Stripe promotion codes integration

---

## Architecture Summary

```
User → Cart Store (Zustand) → Supabase (Persistence)
                ↓
        Checkout Page → Stripe API → Stripe Checkout
                                          ↓
                                    Payment Success
                                     ↓          ↓
                            Webhook Handler   Success Page
                                     ↓              ↓
                            Create Order      Verify Payment
                                     ↓              ↓
                               Supabase ← Fetch Order
                                                   ↓
                                              Clear Cart
```

---

## Support

For issues or questions:

1. Check Stripe Dashboard logs
2. Check Supabase logs
3. Check browser console for client errors
4. Check server console for API errors
5. Verify all environment variables are set
6. Ensure dev server is running with latest code

---

**Last Updated**: 2025-01-28
**Status**: ✅ Fully Functional
