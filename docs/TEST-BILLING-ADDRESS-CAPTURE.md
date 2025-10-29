# 🧪 Test: Billing Address Capture from Stripe

## Overview

This guide will help you verify that billing addresses are being correctly captured from Stripe's checkout page and stored in your Supabase `orders` table.

---

## ✅ What We Fixed

### Changes Made to Webhook Handler

**File:** `app/api/webhooks/stripe/route.ts`

1. **Added Debug Logging** - To see exactly what Stripe is sending
2. **Enhanced Billing Address Extraction** - Better handling of Stripe's customer_details
3. **Added Tax Field** - Ensure all order data is complete

```typescript
// Added comprehensive logging
console.log("Stripe session billing data:", {
  hasCustomerDetails: !!fullSession.customer_details,
  hasCustomerAddress: !!fullSession.customer_details?.address,
  customerDetailsAddress: fullSession.customer_details?.address,
});

// Proper billing address extraction
if (fullSession.customer_details?.address) {
  const billingAddr = fullSession.customer_details.address;
  billingAddress = {
    fullName: fullSession.customer_details.name || customerName,
    address: billingAddr.line1 || "",
    address2: billingAddr.line2 || "",
    city: billingAddr.city || "",
    state: billingAddr.state || "",
    zipCode: billingAddr.postal_code || "",
    country: billingAddr.country || "",
    phone: fullSession.customer_details?.phone || "",
  };
  console.log("✅ Billing address captured from Stripe:", billingAddress);
}
```

---

## 🧪 Testing Steps

### Step 1: Clear Old Test Data (Optional)

If you want to start fresh:

```sql
-- In Supabase SQL Editor
DELETE FROM orders WHERE email LIKE '%test%';
```

### Step 2: Restart Stripe Webhook Listener

Make sure your Stripe CLI is listening:

```bash
# If using Docker
docker exec -it stripe-cli stripe listen --forward-to http://host.docker.internal:3000/api/webhooks/stripe

# If running locally
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

**Important:** Copy the webhook signing secret and update your `.env.local`:

```
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Step 3: Restart Your Dev Server

```bash
npm run dev
```

### Step 4: Perform Test Checkout

1. **Open your app** in a browser
2. **Add items to cart**
3. **Go to checkout** (`/checkout`)
4. **Fill shipping address:**
   ```
   First Name: John
   Last Name: Doe
   Address: 123 Shipping Lane
   City: New York
   State: NY
   ZIP: 10001
   ```
5. **Click "Continue to Payment"**
6. **On Stripe checkout page:**
   - ✅ **Verify billing address form appears**
   - Fill in **DIFFERENT** billing address to clearly test:
     ```
     Name: John Doe
     Address: 456 Billing Avenue
     City: Los Angeles
     State: CA
     ZIP: 90001
     Country: United States
     ```
   - Enter test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
7. **Complete payment**

### Step 5: Check Terminal Output

Look for these logs in your terminal:

#### ✅ Expected Output

```
Processing checkout.session.completed: cs_test_xxxxx

Stripe session billing data: {
  hasCustomerDetails: true,
  hasCustomerAddress: true,
  customerDetailsAddress: {
    line1: '456 Billing Avenue',
    city: 'Los Angeles',
    state: 'CA',
    postal_code: '90001',
    country: 'US'
  }
}

✅ Billing address captured from Stripe customer_details: {
  fullName: 'John Doe',
  address: '456 Billing Avenue',
  address2: '',
  city: 'Los Angeles',
  state: 'CA',
  zipCode: '90001',
  country: 'US',
  phone: ''
}

Creating order with data: {
  hasShippingAddress: true,
  hasBillingAddress: true,
  shippingAddressDetails: {
    fullName: 'John Doe',
    address: '123 Shipping Lane',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  },
  billingAddressDetails: {
    fullName: 'John Doe',
    address: '456 Billing Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001'
  }
}

Order created successfully: <order-id>
```

#### ❌ Problem Indicators

**If you see:**

```
⚠️ Using shipping as billing address (fallback)
```

This means Stripe didn't send billing address. Possible causes:

- `billing_address_collection` not set in Stripe config
- Webhook not receiving full session data

**If you see:**

```
Stripe session billing data: {
  hasCustomerDetails: true,
  hasCustomerAddress: false,
  customerDetailsAddress: undefined
}
```

This means Stripe isn't collecting billing address. Check `services/stripe/checkout.service.ts`.

### Step 6: Verify in Supabase

1. **Open Supabase Dashboard**
2. **Go to Table Editor → `orders`**
3. **Find your test order** (latest one)
4. **Check `billing_address` column:**

#### ✅ Should Look Like:

```json
{
  "fullName": "John Doe",
  "address": "456 Billing Avenue",
  "address2": "",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001",
  "country": "US",
  "phone": ""
}
```

#### ✅ Should NOT Look Like:

```json
{
  "fullName": "John Doe",
  "address": "Same as shipping",
  "city": "",
  "state": "",
  "zipCode": "",
  "country": ""
}
```

### Step 7: Verify on Success Page

1. **After payment completes**, you should see the success page
2. **Check order details** on `/checkout/success`
3. **Verify both addresses are displayed correctly**

---

## 🔍 Troubleshooting

### Issue 1: No Billing Address Form on Stripe

**Symptom:** Stripe checkout page doesn't show billing address fields

**Solution:** Check `services/stripe/checkout.service.ts`:

```typescript
const session = await stripe.checkout.sessions.create({
  // ... other settings
  billing_address_collection: "required", // ✅ This line must exist
});
```

**Fix:**

```bash
# Verify the file has this line
grep -n "billing_address_collection" services/stripe/checkout.service.ts
```

If missing, add it back.

### Issue 2: Billing Address Not in Database

**Symptom:** Logs show billing address captured but not in database

**Possible Causes:**

1. **RLS Policy Issue**
   - Webhook uses service role client ✅ (already fixed)
2. **Column Type Mismatch**
   - Check Supabase column type for `billing_address`
   - Should be `JSONB`

3. **createOrder Function Issue**
   - Check `services/orders/order.service.ts`
   - Verify `billing_address` field is being inserted

**Verify:**

```sql
-- In Supabase SQL Editor
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'orders'
  AND column_name = 'billing_address';
```

Should return:

```
column_name      | data_type
billing_address  | jsonb
```

### Issue 3: Webhook Not Firing

**Symptom:** No logs in terminal when payment completes

**Solution:**

1. **Check Stripe CLI is running:**

   ```bash
   docker ps | grep stripe
   # OR
   ps aux | grep stripe
   ```

2. **Restart webhook listener:**

   ```bash
   # Stop existing listener (Ctrl+C)
   # Start new one
   stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
   ```

3. **Check webhook secret is set:**

   ```bash
   # In .env.local
   echo $STRIPE_WEBHOOK_SECRET
   ```

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

### Issue 4: Wrong Address Stored

**Symptom:** Shipping address stored in billing field (or vice versa)

**Check webhook logs:**

```
shippingAddressDetails: { ... }
billingAddressDetails: { ... }
```

If they're identical and you entered different addresses, the webhook isn't extracting correctly.

**Debug:**

```typescript
// Add this to webhook handler temporarily
console.log("RAW STRIPE SESSION:", JSON.stringify(fullSession, null, 2));
```

This will show you exactly what Stripe is sending.

---

## 📊 Success Criteria

Your test is successful when:

- ✅ Stripe checkout shows billing address form
- ✅ You can enter different billing vs shipping addresses
- ✅ Webhook logs show both addresses correctly
- ✅ Supabase `orders` table has correct `billing_address`
- ✅ Success page displays both addresses
- ✅ No errors in terminal
- ✅ No fallback messages ("Using shipping as billing")

---

## 🎯 Test Scenarios

### Test 1: Same Billing & Shipping

1. Enter shipping: "123 Main St, NY"
2. On Stripe, enter billing: "123 Main St, NY"
3. Verify: Both addresses identical in database ✓

### Test 2: Different Billing & Shipping

1. Enter shipping: "123 Main St, NY"
2. On Stripe, enter billing: "456 Office Rd, CA"
3. Verify: Two different addresses in database ✓

### Test 3: Guest Checkout

1. Not logged in
2. Enter shipping address
3. Stripe collects billing
4. Verify: Order has both addresses ✓

### Test 4: Logged-in User with Saved Address

1. Login and select saved shipping address
2. Stripe collects billing
3. Verify: Order has both addresses ✓

---

## 🔧 If Still Not Working

### Quick Fix Checklist

1. ✅ `billing_address_collection: "required"` in checkout service
2. ✅ Webhook expanding `"customer_details"`
3. ✅ Webhook using service role client
4. ✅ Stripe CLI running and forwarding
5. ✅ Correct webhook secret in `.env.local`
6. ✅ Dev server restarted after env changes
7. ✅ Database column `billing_address` is JSONB

### Get Raw Data

If billing address still not working, add this temporarily to webhook:

```typescript
// In handleCheckoutSessionCompleted function
console.log("=== FULL STRIPE SESSION ===");
console.log(JSON.stringify(fullSession, null, 2));
console.log("=== END STRIPE SESSION ===");
```

This will show you EXACTLY what Stripe is sending. Look for:

- `customer_details.address` (should have billing address)
- `customer_details.name` (should have customer name)

---

## 📝 Summary

**What happens:**

1. User enters shipping on your site
2. User enters billing on Stripe checkout
3. Stripe sends webhook with both addresses
4. Webhook extracts both addresses
5. Order created with both addresses
6. Database stores both addresses as JSONB

**Key fields:**

- `shipping_address` (from your site)
- `billing_address` (from Stripe customer_details)

**Expected result:**

```json
{
  "shipping_address": {
    "fullName": "John Doe",
    "address": "123 Shipping Lane",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "billing_address": {
    "fullName": "John Doe",
    "address": "456 Billing Avenue",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001",
    "country": "US"
  }
}
```

---

**Last Updated**: 2025-01-28  
**Status**: 🧪 TESTING REQUIRED  
**Next Steps**: Follow this guide to verify billing address capture

