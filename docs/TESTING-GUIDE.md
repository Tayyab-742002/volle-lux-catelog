# E-commerce Workflow Testing Guide

## Quick Start Checklist

Before testing, ensure:

- [ ] `.env.local` file exists with all required variables
- [ ] Development server is running (`npm run dev`)
- [ ] Supabase project is set up with correct schema
- [ ] Stripe account in test mode
- [ ] Browser console open for debugging

---

## 1. Environment Setup Verification

### Check Environment Variables

```bash
# Verify your .env.local has:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # Only needed for webhook testing
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Restart Development Server

After setting environment variables:

```bash
npm run dev
```

---

## 2. Test Authenticated User Workflow

### Step 1: Create Account

1. Navigate to `http://localhost:3000/auth/signup`
2. Enter email: `test@example.com`
3. Enter password: `Password123!`
4. Click "Sign Up"
5. **Expected**: Redirected to home page, logged in

**Verify**:

- Check Supabase Dashboard → Authentication → Users
- User should appear in list

---

### Step 2: Add Products to Cart

1. Navigate to `http://localhost:3000/products`
2. Click on any product
3. Click "Add to Cart"
4. **Expected**: Success toast, cart icon updates

**Verify in Console**:

```
Cart updated successfully for user: <user-id>
```

**Verify in Supabase**:

- Go to Table Editor → `carts`
- Should see row with your `user_id` and `items` array

---

### Step 3: Update Cart Quantities

1. Navigate to `http://localhost:3000/cart`
2. Increase quantity using "+" button
3. **Expected**: Quantity updates, total price recalculates
4. Decrease quantity using "-" button
5. **Expected**: Quantity decreases

**Verify in Supabase**:

- Refresh `carts` table
- `items` array should show updated quantities
- `updated_at` timestamp should be recent

---

### Step 4: Remove Cart Item

1. In cart page, click remove/delete button
2. **Expected**: Item removed from cart

**Verify**:

- Cart updates in real-time
- Supabase `carts` table updated

---

### Step 5: Proceed to Checkout

1. In cart page, click "Proceed to Checkout"
2. **Expected**: Redirected to `/checkout`
3. Page shows "Creating checkout session..."
4. **Expected**: Redirected to Stripe checkout page

**Check Browser Console** (should see):

```
No errors
```

**Check Terminal** (should see):

```
POST /api/checkout 200
```

---

### Step 6: Complete Payment on Stripe

1. On Stripe checkout page, enter test card:
   - **Card number**: `4242 4242 4242 4242`
   - **Expiry**: `12/34`
   - **CVC**: `123`
   - **Name**: `Test User`
   - **Billing ZIP**: `12345`
2. Fill shipping address if prompted
3. Click "Pay"
4. **Expected**: Redirected back to `/checkout/success?session_id=cs_test_...`

---

### Step 7: Verify Order Success Page

1. Wait for page to load (3-5 seconds)
2. **Expected**:
   - ✅ Green checkmark icon
   - "Thank You for Your Order!"
   - Order ID displayed
   - Order items with quantities and prices
   - Total amount
   - Shipping address

**Check Browser Console** (should NOT see):

```
Error: Missing STRIPE_SECRET_KEY ❌ (This was the bug we fixed!)
```

**Verify in Supabase**:

- Table Editor → `orders`
- Should see new order with:
  - `user_id`: Your user ID
  - `stripe_session_id`: The session ID from URL
  - `stripe_payment_intent_id`: pi_xxx
  - `status`: "processing"
  - `items`: Array of order items
  - `total`: Correct total amount

**Verify Cart Cleared**:

- Navigate to `/cart`
- Should be empty
- Check Supabase `carts` table → items should be `[]` or row deleted

---

## 3. Test Guest User Workflow

### Step 1: Log Out (if logged in)

1. Click user menu → "Sign Out"
2. **Expected**: Logged out

---

### Step 2: Add Products as Guest

1. Navigate to `/products`
2. Add 2-3 products to cart
3. **Expected**: Cart icon updates

**Verify in Supabase**:

- `carts` table should have row with `session_id` (not `user_id`)
- `session_id` looks like: `guest_1234567890_abc123`

---

### Step 3: Checkout as Guest

1. Go to `/cart`
2. Click "Proceed to Checkout"
3. **Expected**: Redirected to Stripe
4. Complete payment (same test card as before)
5. **Expected**: Success page loads

**Verify in Supabase**:

- `orders` table should have order with:
  - `user_id`: NULL (guest order)
  - `email`: Email entered on Stripe (if provided)
  - Other fields populated correctly

---

## 4. Test Webhook Handler (Advanced)

This ensures orders are created even if user closes browser before reaching success page.

### Step 1: Install Stripe CLI

```bash
# Install: https://stripe.com/docs/stripe-cli
# Windows (PowerShell):
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Mac:
brew install stripe/stripe-cli/stripe

# Login:
stripe login
```

---

### Step 2: Forward Webhooks Locally

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Expected output**:

```
> Ready! Your webhook signing secret is whsec_...
```

---

### Step 3: Add Webhook Secret to .env.local

Copy the `whsec_...` secret:

```env
STRIPE_WEBHOOK_SECRET=whsec_abc123xyz...
```

**Important**: Restart `npm run dev` after adding this!

---

### Step 4: Test Payment with Webhook

1. Complete a test checkout (as before)
2. Watch the terminal running `stripe listen`

**Expected output**:

```
[200] POST http://localhost:3000/api/webhooks/stripe [evt_1Abc...]
```

**Check Server Console** (where npm run dev is running):

```
Webhook received: checkout.session.completed
Processing checkout.session.completed: cs_test_...
Order created successfully: <order-id>
```

**Verify**:

- Order in Supabase
- No errors in logs

---

## 5. Test Error Scenarios

### Test 1: Empty Cart Checkout

1. Go to `/cart` with empty cart
2. **Expected**: "Proceed to Checkout" button disabled or shows message

---

### Test 2: Cancelled Payment

1. Start checkout
2. On Stripe page, click "← Back" or close tab
3. **Expected**: Redirected to `/cart`
4. Cart should still have items
5. No order created in Supabase

---

### Test 3: Declined Card

1. Start checkout
2. Use test card: `4000 0000 0000 0002`
3. **Expected**: Stripe shows "Your card was declined"
4. No order created
5. User remains on Stripe page to retry

---

### Test 4: Network Interruption

1. Start checkout
2. Before completing payment, turn off WiFi
3. **Expected**: Stripe shows connection error
4. Turn WiFi back on
5. User can retry payment

---

## 6. Test Cart Persistence

### Test 1: Refresh Page

1. Add items to cart
2. Refresh browser
3. **Expected**: Cart items still there

---

### Test 2: Close and Reopen Browser

1. Add items to cart
2. Close browser completely
3. Reopen and navigate to site
4. **Expected**:
   - If logged in: Cart persists
   - If guest: Cart persists (via sessionId in localStorage)

---

### Test 3: Login After Guest Cart

1. As guest, add 3 items to cart
2. Sign in
3. **Expected**: Guest cart items merge with user cart

**Note**: This may need custom logic depending on requirements.

---

## 7. Common Issues & Solutions

### Issue: "Missing STRIPE_SECRET_KEY"

**Solution**:

1. Check `.env.local` file exists in project root
2. Verify `STRIPE_SECRET_KEY=sk_test_...` is set
3. Restart dev server: `Ctrl+C`, then `npm run dev`
4. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

### Issue: "duplicate key value violates unique constraint"

**Solution**: Already fixed! This was happening when same user checked out multiple times.

---

### Issue: "Order not found" on success page

**Possible Causes**:

1. Webhook hasn't fired yet (wait 2-3 seconds)
2. Webhook secret incorrect (check .env.local)
3. Stripe CLI not running (for local testing)

**Solution**:

- Ensure webhook handler works (see section 4)
- Check server console for errors
- Verify order exists in Supabase

---

### Issue: "Auth session missing!" in middleware

**This is normal!** The middleware logs this for unauthenticated requests.

**Ignore if**:

- User is not logged in
- Accessing public pages

**Fix if**:

- Logged-in user sees this repeatedly
- Check Supabase env vars

---

### Issue: Cart not saving to Supabase

**Check**:

1. Browser console for errors
2. Supabase RLS policies allow inserts
3. Network tab shows POST requests to Supabase
4. `createClient()` configured correctly

---

### Issue: Stripe checkout page doesn't load

**Check**:

1. `STRIPE_SECRET_KEY` is set
2. API route `/api/checkout` returns 200
3. Browser console for errors
4. Network tab for failed requests

---

## 8. Performance Testing

### Test 1: Add 10+ Items to Cart

1. Add 10+ different products
2. **Expected**: Cart loads quickly, no lag

---

### Test 2: Rapid Quantity Changes

1. Rapidly click +/- buttons in cart
2. **Expected**: Updates smooth, no errors

---

### Test 3: Multiple Browser Tabs

1. Open cart in 2 tabs
2. Update cart in tab 1
3. **Expected**: Tab 2 may not auto-sync (by design, unless real-time enabled)

---

## 9. Browser Compatibility

Test in:

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (responsive)

---

## 10. Success Criteria

All tests pass if:

- ✅ Users can add products to cart
- ✅ Cart persists across page refreshes
- ✅ Cart syncs to Supabase
- ✅ Checkout redirects to Stripe
- ✅ Payment completes successfully
- ✅ Order created in Supabase
- ✅ Success page shows order details
- ✅ Cart cleared after checkout
- ✅ Webhook creates order (even if user closes browser)
- ✅ No console errors
- ✅ No STRIPE_SECRET_KEY errors
- ✅ Guest and authenticated flows work

---

## Next Steps After Testing

Once all tests pass:

1. Document any found issues
2. Test on staging environment (if available)
3. Set up production Stripe keys
4. Configure production webhook endpoint
5. Enable monitoring/alerts
6. Test with real payment amounts (refund after)

---

## Monitoring in Production

**Stripe Dashboard**:

- Payments → View all payments
- Events → View webhook events
- Logs → Troubleshoot failures

**Supabase Dashboard**:

- Table Editor → Check `orders` table
- Logs → API errors
- Database → Query performance

**Application Logs**:

- Server console (or logging service)
- Error tracking (Sentry, LogRocket, etc.)

---

**Last Updated**: 2025-01-28
**Status**: Ready for Testing ✅

