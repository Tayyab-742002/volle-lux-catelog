-- Migration 006: Add Service Role Policies for Webhooks
-- This allows the service role (webhooks) to insert orders without being authenticated

-- ==================================
-- SERVICE ROLE POLICIES
-- ==================================

-- Allow service role to insert orders (for webhooks)
CREATE POLICY "Service role can insert orders"
ON public.orders
FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow service role to select all orders (for admin/webhooks)
CREATE POLICY "Service role can select all orders"
ON public.orders
FOR SELECT
TO service_role
USING (true);

-- Allow service role to update orders (for status changes)
CREATE POLICY "Service role can update all orders"
ON public.orders
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- ==================================
-- CART POLICIES FOR GUESTS AND SERVICE ROLE
-- ==================================

-- Allow guest users (anon) to manage carts
CREATE POLICY "Guest users can manage cart by session_id"
ON public.carts
FOR ALL
TO anon
USING (user_id IS NULL)
WITH CHECK (user_id IS NULL);

-- Allow service role full access to carts
CREATE POLICY "Service role can manage all carts"
ON public.carts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ==================================
-- SUCCESS MESSAGE
-- ==================================

-- Service role policies added successfully!
-- Webhooks can now create orders
-- Guest users can now manage their carts

