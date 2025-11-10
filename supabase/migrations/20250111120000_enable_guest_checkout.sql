/**
 * Migration: Enable Guest Checkout
 * Date: 2025-01-11
 * Description: Allow orders without user_id for guest checkout functionality
 */

-- =====================================================
-- 1. Make user_id nullable in orders table
-- =====================================================
ALTER TABLE public.orders
ALTER COLUMN user_id DROP NOT NULL;

-- =====================================================
-- 2. Ensure email is always required (NOT NULL)
-- =====================================================
ALTER TABLE public.orders
ALTER COLUMN email SET NOT NULL;

-- =====================================================
-- 3. Add CHECK constraint for data integrity
-- At least one of user_id or email must be provided
-- =====================================================
ALTER TABLE public.orders
ADD CONSTRAINT orders_user_or_email_required
CHECK (
  (user_id IS NOT NULL) OR 
  (user_id IS NULL AND email IS NOT NULL AND email != '')
);

-- =====================================================
-- 4. Drop existing RLS policies (if they exist)
-- =====================================================
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.orders;
DROP POLICY IF EXISTS "Enable read access for own orders" ON public.orders;

-- =====================================================
-- 5. Create new RLS policy for viewing orders
-- Allow users to view:
--   - Their own orders (user_id matches)
--   - Guest orders by stripe_session_id
-- =====================================================
CREATE POLICY "Allow users to view their orders"
  ON public.orders FOR SELECT
  TO authenticated, anon
  USING (
    -- Authenticated users can see their own orders
    (auth.uid() = user_id)
    OR
    -- Anyone can view guest orders by session (for order confirmation page)
    (user_id IS NULL AND stripe_session_id IS NOT NULL)
  );

-- =====================================================
-- 6. Create new RLS policy for creating orders
-- Allow:
--   - Authenticated users to create orders with their user_id
--   - Guest orders (user_id = NULL but email required)
-- =====================================================
CREATE POLICY "Allow order creation for guests and users"
  ON public.orders FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    -- Authenticated users must use their own user_id
    (auth.uid() = user_id)
    OR
    -- Guest orders: no user_id but email required
    (user_id IS NULL AND email IS NOT NULL AND email != '')
  );

-- =====================================================
-- 7. Create index for faster guest order lookups
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id 
  ON public.orders(stripe_session_id) 
  WHERE user_id IS NULL;

-- =====================================================
-- 8. Create index for email lookups (for account linking)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_orders_email 
  ON public.orders(email) 
  WHERE user_id IS NULL;

-- =====================================================
-- ROLLBACK COMMANDS (for reference, DO NOT RUN)
-- =====================================================
-- To rollback this migration:
-- 
-- DROP INDEX IF EXISTS idx_orders_email;
-- DROP INDEX IF EXISTS idx_orders_stripe_session_id;
-- DROP POLICY IF EXISTS "Allow order creation for guests and users" ON public.orders;
-- DROP POLICY IF EXISTS "Allow users to view their orders" ON public.orders;
-- ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_or_email_required;
-- ALTER TABLE public.orders ALTER COLUMN user_id SET NOT NULL;

