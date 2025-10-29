# ⚡ QUICK TEST GUIDE - Complete Checkout Workflow

## 🚀 Start Here

### Step 1: Verify Environment Variables

Check your `.env.local` has these:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://knxdmyopuzifmtowtska.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  ← MUST HAVE THIS!

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## 🎯 Test Method 1: With Stripe CLI (Full Test)

### Terminal 1: Run Dev Server

```bash
npm run dev
```

### Terminal 2: Run Stripe CLI

**Option A: Native Stripe CLI**

```bash
stripe listen --forward-to http://127.0.0.1:3000/api/webhooks/stripe
```

**Option B: Docker (persistent login)**

```bash
# First time: Login
docker run -it --name stripe-listener \
  -v stripe-config:/root/.config/stripe \
  --add-host=host.docker.internal:host-gateway \
  stripe/stripe-cli:latest \
  login

# Then start listener
docker start -ai stripe-listener
stripe listen --forward-to http://host.docker.internal:3000/api/webhooks/stripe
```

### Test Checkout

1. Open `http://localhost:3000`
2. Add products to cart
3. Click "Proceed to Checkout"
4. Use Stripe test card: `4242 4242 4242 4242`
5. Complete payment
6. Check you're redirected to success page
7. **Order should display with all details!**

### What to Look For

**Terminal 1 (Dev Server) - Should show:**

```
✅ Processing checkout.session.completed: cs_test_...
✅ Creating order in Supabase: { userId: '...', email: '...', itemCount: 2, total: 99.99 }
✅ Order created successfully with ID: abc123...
✅ Fetching order by Stripe session ID: cs_test_...
✅ Order fetched successfully
```

**Terminal 2 (Stripe CLI) - Should show:**

```
[200] POST http://localhost:3000/api/webhooks/stripe [evt_1...]
```

**Browser - Should show:**

```
✅ Order Confirmed
✅ Order #ABC123
✅ Order items listed
✅ Total amount correct
✅ Shipping address displayed
```

---

## 🎯 Test Method 2: Without Stripe CLI (Quick Test)

If you don't want to set up Stripe CLI right now:

### Step 1: Complete Checkout Normally

1. Add products to cart
2. Click checkout
3. Complete Stripe payment
4. You'll be redirected to success page
5. **Order will show "Order not found"** (because webhook didn't fire)

### Step 2: Manually Create Order in Supabase

1. Go to Stripe checkout, complete payment, and note the `session_id` from the URL when redirected back
2. Go to Supabase Dashboard → SQL Editor
3. Run this SQL (replace `YOUR_SESSION_ID`):

```sql
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
  NULL,
  'test@example.com',
  'processing',
  99.99,
  'USD',
  'YOUR_SESSION_ID_HERE',  -- Replace with actual session_id!
  'pi_test_123',
  '{"fullName": "John Doe", "address": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "US"}'::jsonb,
  '{"fullName": "John Doe", "address": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "US"}'::jsonb,
  '[{"product": {"id": "test-1", "name": "Test Product", "image": "https://example.com/image.jpg"}, "variant": {"id": "var-1", "name": "Standard"}, "quantity": 1, "pricePerUnit": 99.99}]'::jsonb,
  NOW(),
  NOW()
);
```

4. Refresh the success page
5. **Order should now display!**

---

## ✅ Success Checklist

Your checkout workflow is working if:

- [ ] Products added to cart appear in Supabase `carts` table
- [ ] Clicking "Proceed to Checkout" redirects to Stripe
- [ ] After payment, redirected back to success page
- [ ] Order appears in Supabase `orders` table
- [ ] Success page shows order number and items
- [ ] Cart is cleared after successful order

---

## ❌ Troubleshooting

### Error: "Order not found"

**Cause:** Webhook didn't fire or failed

**Solutions:**

1. Make sure Stripe CLI is running
2. Check dev server logs for webhook processing
3. Verify `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
4. Restart dev server

### Error: "Missing SUPABASE_SERVICE_ROLE_KEY"

**Solution:**

1. Go to Supabase Dashboard → Settings → API
2. Copy "service_role" key (NOT "anon" key)
3. Add to `.env.local`
4. Restart dev server

### Stripe CLI: "Connection refused"

**Solution:**
Use IPv4 localhost explicitly:

```bash
stripe listen --forward-to http://127.0.0.1:3000/api/webhooks/stripe
```

Or for Docker:

```bash
stripe listen --forward-to http://host.docker.internal:3000/api/webhooks/stripe
```

### Docker: Container keeps getting destroyed

**Solution:**
Don't use `--rm` flag. Use persistent container:

```bash
# Create persistent container
docker run -it --name stripe-listener \
  -v stripe-config:/root/.config/stripe \
  --add-host=host.docker.internal:host-gateway \
  stripe/stripe-cli:latest \
  sh

# Inside container, login once
stripe login

# Start listener
stripe listen --forward-to http://host.docker.internal:3000/api/webhooks/stripe

# To restart later
docker start -ai stripe-listener
```

---

## 📊 Verify Everything Works

### 1. Check Supabase

**Orders Table:**

- Should have new row after payment
- `stripe_session_id` should match checkout session
- `items` should be populated JSON
- `status` should be "processing"

**Carts Table:**

- Should be empty after successful order (cart cleared)

### 2. Check Dev Server Logs

**Good logs:**

```
✅ Processing checkout.session.completed
✅ Creating order in Supabase
✅ Order created successfully
✅ Fetching order by Stripe session ID
✅ Order fetched successfully
```

**Bad logs (if you see these, something is wrong):**

```
❌ Error creating order: permission denied
❌ Missing SUPABASE_SERVICE_ROLE_KEY
❌ Order not found for session
```

### 3. Check Browser

**Success Page Should Show:**

- ✅ "Order Confirmed" heading
- ✅ Order number (e.g., "ABC123")
- ✅ List of order items
- ✅ Total amount
- ✅ Shipping address

---

## 🎉 What's Working Now

After the fix:

1. ✅ **Cart persistence** - Items saved to Supabase
2. ✅ **Stripe checkout** - Redirects to Stripe hosted page
3. ✅ **Payment processing** - Uses Stripe test mode
4. ✅ **Webhook handling** - Creates order in database
5. ✅ **Order confirmation** - Displays order details
6. ✅ **Cart clearing** - Empties cart after order

---

## 🚀 Next Steps

Once checkout is working:

1. ✅ Test with multiple products
2. ✅ Test as guest user (not logged in)
3. ✅ Test as authenticated user
4. ⏭️ Implement email confirmation (Resend)
5. ⏭️ Test order history page
6. ⏭️ Deploy to production

---

**Last Updated**: 2025-01-28  
**Status**: 🟢 Ready to Test  
**Estimated Time**: 5-10 minutes with Stripe CLI, 2 minutes without
