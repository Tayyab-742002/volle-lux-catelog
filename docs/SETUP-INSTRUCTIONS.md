# Complete Setup Instructions

## 🚀 Quick Start Guide

Follow these steps to get your e-commerce platform fully functional.

---

## 1. Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Sanity CMS (if using)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token_here
```

### Where to get these keys:

**Supabase**:

1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Settings → API → Copy `URL` and `anon public` key
4. Settings → API → Copy `service_role secret` (⚠️ Keep this secret!)

**Stripe**:

1. Go to [stripe.com/dashboard](https://dashboard.stripe.com)
2. Enable **Test Mode** (toggle in top right)
3. Developers → API keys → Copy `Publishable key` and `Secret key`
4. For webhook secret, see Webhook Setup below

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Supabase Database Setup

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy and paste the schema from `docs/supabase-schema.sql` (or see below)
4. Click **Run**

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Database Schema

Run this SQL in Supabase SQL Editor:

```sql
-- Create carts table
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(session_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  items JSONB NOT NULL,
  shipping_address JSONB,
  billing_address JSONB,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) DEFAULT 0,
  shipping NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table (if not exists)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create addresses table (if not exists)
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  phone TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for carts
CREATE POLICY "Users can manage their own cart"
ON carts FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Guest users can manage cart by session_id"
ON carts FOR ALL TO anon
USING (user_id IS NULL)
WITH CHECK (user_id IS NULL);

CREATE POLICY "Service role has full access to carts"
ON carts FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage orders"
ON orders FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
ON user_profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON user_profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role can insert profiles"
ON user_profiles FOR INSERT TO service_role
WITH CHECK (true);

-- RLS Policies for addresses
CREATE POLICY "Users can manage their own addresses"
ON addresses FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_session_id ON carts(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
```

---

## 4. Stripe Setup

### Step 1: Enable Test Mode

In Stripe Dashboard, toggle **Test Mode** ON (top right corner).

### Step 2: Get API Keys

1. Go to **Developers** → **API keys**
2. Copy:
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`

### Step 3: Setup Webhook (Local Development)

#### Option A: Using Stripe CLI (Recommended)

1. Install Stripe CLI:

   ```bash
   # Windows (PowerShell with Scoop)
   scoop install stripe

   # Mac
   brew install stripe/stripe-cli/stripe

   # Linux
   # Download from: https://github.com/stripe/stripe-cli/releases
   ```

2. Login:

   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret (`whsec_...`) to `.env.local`:

   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

5. Keep this terminal running while testing!

#### Option B: Manual Webhook Setup (Production)

For production or public testing:

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
3. Events to send:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Test the Workflow

Follow the comprehensive testing guide: `docs/TESTING-GUIDE.md`

### Quick Test

1. **Sign up**: Go to `/auth/signup`
2. **Add products**: Browse products and add to cart
3. **Checkout**: Go to cart → Proceed to Checkout
4. **Pay**: Use test card `4242 4242 4242 4242`
5. **Verify**: Order appears in Supabase `orders` table

---

## 7. Troubleshooting Common Issues

### ❌ "Missing STRIPE_SECRET_KEY"

**Solution**:

```bash
# 1. Check .env.local exists
# 2. Verify STRIPE_SECRET_KEY=sk_test_...
# 3. Restart dev server
npm run dev
```

### ❌ "Auth session missing!"

**Normal behavior** for unauthenticated users. Ignore unless:

- You're logged in and see this repeatedly
- Protected pages don't work

**Solution**: Check Supabase environment variables.

### ❌ "406 Not Acceptable" (Supabase cart query)

**Cause**: RLS policies blocking guest cart access.

**Solution**: Follow `docs/SUPABASE-RLS-FIX.md`

### ❌ "Order not found" on success page

**Causes**:

1. Webhook hasn't processed yet (wait 2-3 seconds)
2. Webhook secret incorrect
3. Stripe CLI not running (local dev)

**Solution**:

- Ensure `stripe listen` is running
- Check server console for webhook errors
- Verify `STRIPE_WEBHOOK_SECRET` is set

### ❌ "duplicate key value violates unique constraint"

**Already fixed!** This was happening when same user checked out multiple times. Fixed by using `onConflict: "user_id"` in the upsert operation.

---

## 8. Production Deployment

### Environment Variables for Production

Update `.env.local` (or your hosting platform's env vars):

```env
# Use production values
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Stripe: Switch to live mode
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... # From Stripe Dashboard → Webhooks
```

### Webhook Setup for Production

1. In Stripe Dashboard, ensure **Live Mode** is enabled
2. Go to **Webhooks** → **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events (same as above)
5. Copy signing secret to env vars

### Deploy Checklist

- [ ] All environment variables set
- [ ] Supabase RLS policies configured
- [ ] Stripe webhook endpoint registered
- [ ] Test checkout in production with real card (then refund)
- [ ] Monitor Stripe Dashboard for payments
- [ ] Monitor Supabase for orders
- [ ] Set up error tracking (Sentry, LogRocket, etc.)

---

## 9. Optional: Sanity CMS Integration

If you're using Sanity for product management:

1. Set up Sanity project
2. Add env vars to `.env.local`:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_token
   ```
3. Products will be fetched from Sanity CMS dynamically

---

## 10. Additional Resources

- **Complete Workflow**: `docs/COMPLETE-CHECKOUT-WORKFLOW.md`
- **Testing Guide**: `docs/TESTING-GUIDE.md`
- **RLS Fix**: `docs/SUPABASE-RLS-FIX.md`
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

## 11. Getting Help

If you encounter issues:

1. Check browser console for client-side errors
2. Check terminal (server console) for API errors
3. Check Stripe Dashboard → Developers → Logs
4. Check Supabase Dashboard → Logs
5. Review the troubleshooting sections in this guide

---

**Last Updated**: 2025-01-28  
**Status**: Production Ready ✅

**Next Steps**:

- Follow testing guide to verify everything works
- Deploy to production
- Set up monitoring and alerts
- Add email notifications (Resend integration - Task 2.4)
