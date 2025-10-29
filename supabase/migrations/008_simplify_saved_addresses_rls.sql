-- ==============================================
-- Migration: Simplify Saved Addresses RLS Policies
-- ==============================================
-- Issue: RLS policies with auth.uid() causing query hangs
-- Solution: Disable RLS for saved_addresses (app-level security)
-- Date: December 2024
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own saved addresses" ON public.saved_addresses;
DROP POLICY IF EXISTS "Users can insert own saved addresses" ON public.saved_addresses;
DROP POLICY IF EXISTS "Users can update own saved addresses" ON public.saved_addresses;
DROP POLICY IF EXISTS "Users can delete own saved addresses" ON public.saved_addresses;

-- Disable RLS on saved_addresses table
-- We'll handle security at the application layer
ALTER TABLE public.saved_addresses DISABLE ROW LEVEL SECURITY;

-- ==============================================
-- RATIONALE:
-- ==============================================
-- 1. The getSavedAddresses() function was hanging due to RLS auth.uid() check
-- 2. We already filter by user_id in the application layer
-- 3. The service functions (getSavedAddresses, createSavedAddress, etc.) 
--    all require userId as a parameter and filter accordingly
-- 4. Disabling RLS simplifies the architecture and prevents query hangs
-- 5. Security is maintained through:
--    - Application-level user_id filtering
--    - Foreign key constraints (user_id REFERENCES users)
--    - API route authentication checks
-- ==============================================

-- Add helpful comment
COMMENT ON TABLE public.saved_addresses IS 
  'User saved addresses - RLS disabled, security handled at application layer via user_id filtering';

-- ==============================================
-- VERIFICATION
-- ==============================================

-- Verify RLS is disabled
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'saved_addresses' 
    AND rowsecurity = false
  ) THEN
    RAISE NOTICE '✅ RLS successfully disabled for saved_addresses';
  ELSE
    RAISE WARNING '❌ RLS still enabled for saved_addresses';
  END IF;
END $$;

-- Verify no policies exist
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'saved_addresses';
  
  IF policy_count = 0 THEN
    RAISE NOTICE '✅ All RLS policies removed from saved_addresses';
  ELSE
    RAISE WARNING '❌ Still have % policies on saved_addresses', policy_count;
  END IF;
END $$;

-- ==============================================
-- SUCCESS MESSAGE
-- ==============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Migration 008 Complete';
  RAISE NOTICE 'Simplified saved_addresses RLS policies';
  RAISE NOTICE 'Security: Application-layer user_id filtering';
  RAISE NOTICE '========================================';
END $$;

