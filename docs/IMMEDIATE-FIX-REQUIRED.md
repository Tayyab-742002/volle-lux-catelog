# 🚨 IMMEDIATE ACTION REQUIRED - Database Setup

## Problem

The order is **NOT being created** because:

1. ❌ **Supabase RLS policies missing** - Service role can't insert orders
2. ❌ **Guest cart policy missing** - Guest users getting 406 error
3. ❌ **No actual payment completed** - You're on success page without going through Stripe

---

## ⚡ IMMEDIATE FIX - Run This SQL NOW

Go to **Supabase SQL Editor** and run this:

```sql
-- ========================================
-- FIX 1: Allow Service Role to Insert Orders (CRITICAL!)
-- ========================================

CREATE POLICY "Service role can insert orders"
ON public.orders
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can select all orders"
ON public.orders
FOR SELECT
TO service_role
USING (true);

CREATE POLICY "Service role can update all orders"
ON public.orders
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- ========================================
-- FIX 2: Allow Guest Users to Access Carts
-- ========================================

CREATE POLICY "Guest users can manage cart by session_id"
ON public.carts
FOR ALL
TO anon
USING (user_id IS NULL)
WITH CHECK (user_id IS NULL);

CREATE POLICY "Service role can manage all carts"
ON public.carts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
```

---

## After Running SQL, Test the Complete Flow

### Step 1: Verify Environment Variables

Check your `.env.local`:

```env
# Supabase (you have these)
NEXT_PUBLIC_SUPABASE_URL=https://knxdmyopuzifmtowtska.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  ← CRITICAL!

# Stripe Test Mode
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  ← For webhooks (optional for now)

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Complete a REAL Test Checkout

1. **Add products to cart**
2. **Click "Proceed to Checkout"**
3. **You'll be redirected to Stripe's hosted checkout page**
4. **Use test card**: `4242 4242 4242 4242`
5. **Complete the payment**
6. **Stripe will redirect you back to success page**
7. **NOW the order should exist!**

---

## Why Your Current Test Fails

### What You Did ❌

- You directly visited the success page with a `session_id`
- No actual Stripe payment was completed
- No webhook fired
- No order created in database

### What Should Happen ✅

```
1. User adds to cart → ✅ Saved in Supabase
2. User clicks checkout → ✅ Stripe session created
3. Redirected to Stripe → ✅ User enters card details
4. Payment succeeds → ✅ Stripe sends webhook
5. Webhook creates order → ✅ Order saved in Supabase
6. Redirect to success → ✅ Order fetched and displayed
7. Cart cleared → ✅ Empty cart
```

---

## Test Without Webhook (Quick Test)

If you want to test without setting up Stripe CLI, you can manually create an order to verify the flow:

### Temporary Test: Manually Create Order in Supabase

Go to Supabase SQL Editor and run:

```sql
-- Create a test order
INSERT INTO public.orders (
  id,
  user_id,
  email,
  status,
  total_amount,
  currency,
  stripe_session_id,
  stripe_payment_intent_id,
  shipping_address,
  billing_address,
  items,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  NULL,  -- Guest order
  'test@example.com',
  'processing',
  99.99,
  'USD',
  'cs_test_b1hUoQGBn5SFaNuW37sdn8YqMUbkmPQjJhzSe1w7lF2UFnZ8pLr16gEJ6g',  -- Your session ID
  'pi_test_123',
  '{"fullName": "John Doe", "address": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "US"}'::jsonb,
  '{"fullName": "John Doe", "address": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "US"}'::jsonb,
  '[{"product": {"id": "test-1", "name": "Test Product", "image": ""}, "quantity": 1, "pricePerUnit": 99.99}]'::jsonb,
  NOW(),
  NOW()
);
```

Now refresh the success page - the order should appear!

---

## For PRODUCTION Webhooks

### Option A: Stripe CLI (Local Development)

```bash
# Install Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook secret (whsec_...)
# Add to .env.local:
STRIPE_WEBHOOK_SECRET=whsec_...

# Restart dev server
npm run dev
```

### Option B: Skip Webhooks for Now

For testing, you can modify the checkout flow to create the order BEFORE redirecting to Stripe. But this is NOT recommended for production!

---

## ✅ Checklist

Before testing checkout:

- [ ] Run the SQL to add RLS policies
- [ ] Verify `SUPABASE_SERVICE_ROLE_KEY` is in `.env.local`
- [ ] Restart dev server: `npm run dev`
- [ ] Add products to cart
- [ ] Complete FULL checkout flow through Stripe
- [ ] Verify order appears in Supabase `orders` table
- [ ] Check success page shows order

---

## Still Not Working?

### Check Server Console

Look for these logs after payment:

```
✅ Good:
Processing checkout.session.completed: cs_test_...
Creating order in Supabase: { userId: '...', email: '...', ... }
Order created successfully with ID: <uuid>

❌ Bad:
Error creating order: { code: '42501', message: 'permission denied' }
```

### Check Supabase Logs

1. Go to Supabase Dashboard
2. Logs → API
3. Filter by `orders` table
4. Look for INSERT queries
5. Check for RLS policy errors

---

## Summary

**The order is not being created because:**

1. **Missing RLS Policy** → Run the SQL above ✅
2. **No webhook fired** → You skipped the actual Stripe payment
3. **Test was incomplete** → Follow the full checkout flow

**After fixing RLS policies, complete a REAL test checkout through Stripe!**

---

**Last Updated**: 2025-01-28  
**Priority**: 🔴 CRITICAL - Run SQL immediately  
**Next Step**: Complete full checkout test through Stripe
