# 🔐 Stripe Integration Setup Guide

**Date:** January 28, 2025  
**Status:** ✅ Task 2.3.1 COMPLETE  
**Next:** Webhook Handler Implementation

---

## 📋 Overview

This guide covers setting up Stripe for secure payment processing using Stripe's hosted checkout page (best practice for PCI compliance).

### What We're Using

- **Stripe Checkout (Hosted)**: Stripe's pre-built, secure checkout page
- **Server-side SDK**: For creating sessions and processing webhooks
- **Client-side Stripe.js**: For loading Stripe securely

### Why Hosted Checkout?

✅ PCI compliance handled by Stripe  
✅ No need to build custom payment forms  
✅ Mobile-optimized by default  
✅ Support for multiple payment methods  
✅ Built-in fraud prevention  
✅ Automatic 3D Secure (SCA compliance)

---

## 🚀 Step 1: Create Stripe Account

### 1.1 Sign Up

1. Go to https://stripe.com
2. Click "Start now" or "Sign up"
3. Create your account
4. Verify your email

### 1.2 Get Your API Keys

1. Log in to Stripe Dashboard
2. Go to **Developers** → **API keys**
3. You'll see two sets of keys:
   - **Test keys** (for development) - start with `pk_test_` and `sk_test_`
   - **Live keys** (for production) - start with `pk_live_` and `sk_live_`

**IMPORTANT:** Always use test keys during development!

---

## 🔑 Step 2: Configure Environment Variables

### 2.1 Create `.env.local`

Create a `.env.local` file in your project root:

```env
# Stripe Test Keys (Development)
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxxxxxx

# App URL (for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2.2 Where to Find Your Keys

#### Publishable Key (Public)

- Location: Stripe Dashboard → Developers → API keys
- Starts with: `pk_test_` (test) or `pk_live_` (live)
- Safe to expose in client-side code
- Used in: Frontend to load Stripe.js

#### Secret Key (Private)

- Location: Stripe Dashboard → Developers → API keys
- Starts with: `sk_test_` (test) or `sk_live_` (live)
- **NEVER expose in client-side code**
- Used in: Backend API routes only

### 2.3 Security Best Practices

**DO:**

- ✅ Store keys in `.env.local` (never commit to Git)
- ✅ Use test keys for development
- ✅ Use different keys for staging/production
- ✅ Rotate keys if compromised

**DON'T:**

- ❌ Commit `.env.local` to Git
- ❌ Share secret keys in Slack/email
- ❌ Use live keys in development
- ❌ Hardcode keys in your code

---

## 📦 Step 3: Installed Packages

The following packages have been installed:

```bash
npm install stripe @stripe/stripe-js
```

### Package Details

| Package             | Purpose                | Usage                   |
| ------------------- | ---------------------- | ----------------------- |
| `stripe`            | Server-side Stripe SDK | API routes, webhooks    |
| `@stripe/stripe-js` | Client-side Stripe.js  | Loading Stripe securely |

---

## 🏗️ Step 4: Files Created

### 4.1 Stripe Configuration

**File:** `lib/stripe/config.ts`

```typescript
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export const STRIPE_CONFIG = {
  currency: "usd",
  paymentMethodTypes: ["card"],
  successUrl: `${getBaseUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancelUrl: `${getBaseUrl()}/cart`,
};
```

**Purpose:**

- Initialize Stripe SDK
- Configure currency and payment methods
- Set redirect URLs

### 4.2 Client-side Stripe

**File:** `lib/stripe/client.ts`

```typescript
import { loadStripe } from "@stripe/stripe-js";

export function getStripe() {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}
```

**Purpose:**

- Load Stripe.js on client side
- Singleton pattern for efficiency

### 4.3 Checkout Service

**File:** `services/stripe/checkout.service.ts`

**Functions:**

- `createCheckoutSession()` - Create Stripe checkout session
- `getCheckoutSession()` - Retrieve session details
- `verifyPaymentStatus()` - Check if payment was successful

**Features:**

- ✅ Cart items → Stripe line items conversion
- ✅ Metadata storage (user, addresses, cart)
- ✅ Guest and authenticated checkout support
- ✅ Promotion code support
- ✅ Shipping address collection

### 4.4 Checkout API Route

**File:** `app/api/checkout/route.ts`

**Endpoint:** `POST /api/checkout`

**Request Body:**

```json
{
  "items": [...], // CartItem[]
  "shippingAddress": {...}, // Optional
  "billingAddress": {...} // Optional
}
```

**Response:**

```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

### 4.5 Checkout Page

**File:** `app/checkout/page.tsx`

**Flow:**

1. User clicks "Checkout"
2. Page loads and calls `/api/checkout`
3. API creates Stripe session
4. User redirected to Stripe's hosted checkout
5. User completes payment on Stripe
6. Redirected back to success/cancel page

---

## 🔄 Payment Flow

### Complete Checkout Flow

```
1. User adds items to cart
   ↓
2. User clicks "Proceed to Checkout"
   ↓
3. Frontend: POST /api/checkout with cart items
   ↓
4. Backend: Create Stripe checkout session
   ↓
5. Backend: Return session URL
   ↓
6. Frontend: Redirect to Stripe hosted page
   ↓
7. User: Enter payment details on Stripe
   ↓
8. Stripe: Process payment
   ↓
9. Stripe: Redirect to success/cancel URL
   ↓
10. Webhook: Stripe sends payment event
   ↓
11. Backend: Create order in database
   ↓
12. Success Page: Show order confirmation
```

---

## 🧪 Testing the Integration

### Test with Stripe Test Cards

Stripe provides test card numbers for different scenarios:

| Card Number           | Result                                 |
| --------------------- | -------------------------------------- |
| `4242 4242 4242 4242` | ✅ Success                             |
| `4000 0000 0000 9995` | ❌ Decline                             |
| `4000 0025 0000 3155` | ⏳ Requires authentication (3D Secure) |

**For all test cards:**

- Expiry: Any future date (e.g., 12/34)
- CVV: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

### Manual Testing Steps

1. **Start Dev Server**

   ```bash
   npm run dev
   ```

2. **Add Items to Cart**
   - Go to http://localhost:3000/products
   - Add products to cart

3. **Go to Checkout**
   - Click cart icon
   - Click "Proceed to Checkout"
   - Should redirect to Stripe checkout page

4. **Complete Test Payment**
   - Use test card: `4242 4242 4242 4242`
   - Enter any future expiry date
   - Enter any CVV
   - Click "Pay"

5. **Verify Success**
   - Should redirect to success page
   - Check Stripe Dashboard → Payments for the test payment

---

## 📊 Stripe Dashboard

### Key Sections

#### 1. Payments

- View all payments (successful, failed, pending)
- Search by amount, customer, or date
- Export to CSV

#### 2. Customers

- View customer profiles
- See payment history
- Manage subscriptions (if applicable)

#### 3. Products

- Optional: Create products in Stripe
- We're using dynamic product creation via API

#### 4. Webhooks

- Configure webhook endpoints
- View webhook events and logs
- Test webhook delivery

#### 5. Logs

- View API requests
- Debug errors
- Monitor webhook delivery

---

## 🔐 Security Checklist

Before going live:

- [ ] Test keys work in development
- [ ] Live keys added to production environment
- [ ] Secret keys never exposed in client code
- [ ] `.env.local` in `.gitignore`
- [ ] Webhook endpoint secured (next task)
- [ ] SSL/HTTPS enabled in production
- [ ] Stripe webhook signature verification enabled
- [ ] Error handling in place
- [ ] Logging configured (but don't log sensitive data)

---

## 💳 Supported Payment Methods

Currently configured:

- ✅ Credit cards
- ✅ Debit cards

Can be added:

- Apple Pay
- Google Pay
- ACH Direct Debit
- Klarna
- Afterpay
- And 100+ more

To enable additional payment methods:

1. Go to Stripe Dashboard → Settings → Payment methods
2. Enable desired methods
3. Update `paymentMethodTypes` in `lib/stripe/config.ts`

---

## 🌍 Multi-Currency Support

Current: USD only

To add more currencies:

1. Go to Stripe Dashboard → Settings → Payment methods
2. Enable currencies you want to support
3. Update `currency` in checkout session creation
4. Consider currency conversion rates
5. Display prices in customer's currency

---

## 📈 Next Steps

### Task 2.3.2: ✅ COMPLETE

- [x] Install Stripe SDK
- [x] Create Stripe configuration
- [x] Implement checkout service
- [x] Update checkout API route
- [x] Update checkout page
- [x] Add environment variables

### Task 2.3.3: Webhook Handler (Next)

- [ ] Create webhook endpoint
- [ ] Verify webhook signatures
- [ ] Handle payment events
- [ ] Create orders on success
- [ ] Handle payment failures

### Task 2.3.4: Order Confirmation

- [ ] Update success page
- [ ] Display order details
- [ ] Clear cart after payment
- [ ] Send confirmation email

---

## 🐛 Troubleshooting

### Error: "Missing STRIPE_SECRET_KEY"

**Solution:**

1. Check `.env.local` exists
2. Verify key is set: `STRIPE_SECRET_KEY=sk_test_...`
3. Restart dev server

### Error: "Invalid API Key"

**Solution:**

1. Check you're using the correct key format
2. Test keys start with `sk_test_`
3. Live keys start with `sk_live_`
4. Copy key directly from Stripe Dashboard

### Checkout redirect not working

**Solution:**

1. Check `NEXT_PUBLIC_APP_URL` is set
2. Verify API route returns `url` in response
3. Check browser console for errors
4. Ensure `window.location.href` assignment works

### "Cart is empty" error

**Solution:**

1. Verify items are in cart before checkout
2. Check cart persistence is working
3. Test cart API endpoints

---

## 📚 Resources

- **Stripe Docs**: https://stripe.com/docs
- **Stripe Checkout**: https://stripe.com/docs/checkout
- **Test Cards**: https://stripe.com/docs/testing
- **Webhooks**: https://stripe.com/docs/webhooks
- **Dashboard**: https://dashboard.stripe.com

---

**Status:** ✅ COMPLETE  
**Build Status:** Ready for testing  
**Next Task:** Implement webhook handler

---

_Your Stripe integration is ready! Test it with test cards, then we'll implement webhooks to handle payment events._
