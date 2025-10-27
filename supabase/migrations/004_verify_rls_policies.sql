-- RLS Policy Verification Script
-- Run this in Supabase SQL Editor to verify all RLS policies are working correctly

-- ==============================================
-- 1. CHECK RLS STATUS
-- ==============================================

-- Check if RLS is enabled on all tables
SELECT 
  'RLS Status Check' as test_type,
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Enabled'
    ELSE '❌ RLS Disabled'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'users', 
  'addresses', 
  'carts', 
  'orders', 
  'order_items', 
  'saved_addresses'
)
ORDER BY tablename;

-- ==============================================
-- 2. CHECK POLICY COUNT
-- ==============================================

-- Check policy count for each table
SELECT 
  'Policy Count Check' as test_type,
  tablename,
  COUNT(*) as policy_count,
  CASE 
    WHEN tablename = 'users' AND COUNT(*) = 3 THEN '✅ Correct (3 policies)'
    WHEN tablename = 'addresses' AND COUNT(*) = 4 THEN '✅ Correct (4 policies)'
    WHEN tablename = 'carts' AND COUNT(*) = 4 THEN '✅ Correct (4 policies)'
    WHEN tablename = 'orders' AND COUNT(*) = 3 THEN '✅ Correct (3 policies)'
    WHEN tablename = 'order_items' AND COUNT(*) = 2 THEN '✅ Correct (2 policies)'
    WHEN tablename = 'saved_addresses' AND COUNT(*) = 4 THEN '✅ Correct (4 policies)'
    ELSE '❌ Incorrect Policy Count'
  END as status
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN (
  'users', 
  'addresses', 
  'carts', 
  'orders', 
  'order_items', 
  'saved_addresses'
)
GROUP BY tablename
ORDER BY tablename;

-- ==============================================
-- 3. DETAILED POLICY INFORMATION
-- ==============================================

-- View all policies with details
SELECT 
  'Policy Details' as test_type,
  tablename,
  policyname,
  cmd as operation,
  CASE 
    WHEN permissive THEN 'Permissive'
    ELSE 'Restrictive'
  END as policy_type,
  CASE 
    WHEN roles IS NULL THEN 'All Roles'
    ELSE array_to_string(roles, ', ')
  END as roles,
  CASE 
    WHEN qual IS NULL THEN 'No Condition'
    ELSE qual
  END as condition
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN (
  'users', 
  'addresses', 
  'carts', 
  'orders', 
  'order_items', 
  'saved_addresses'
)
ORDER BY tablename, cmd, policyname;

-- ==============================================
-- 4. TEST UNAUTHENTICATED ACCESS
-- ==============================================

-- Test unauthenticated access to users table
-- This should fail with permission denied
DO $$
BEGIN
  BEGIN
    PERFORM * FROM public.users LIMIT 1;
    RAISE NOTICE '❌ USERS: Unauthenticated access allowed (RLS not working)';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE '✅ USERS: Unauthenticated access denied (RLS working)';
    WHEN OTHERS THEN
      RAISE NOTICE '⚠️ USERS: Unexpected error: %', SQLERRM;
  END;
END $$;

-- Test unauthenticated access to addresses table
DO $$
BEGIN
  BEGIN
    PERFORM * FROM public.addresses LIMIT 1;
    RAISE NOTICE '❌ ADDRESSES: Unauthenticated access allowed (RLS not working)';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE '✅ ADDRESSES: Unauthenticated access denied (RLS working)';
    WHEN OTHERS THEN
      RAISE NOTICE '⚠️ ADDRESSES: Unexpected error: %', SQLERRM;
  END;
END $$;

-- Test unauthenticated access to carts table
DO $$
BEGIN
  BEGIN
    PERFORM * FROM public.carts LIMIT 1;
    RAISE NOTICE '❌ CARTS: Unauthenticated access allowed (RLS not working)';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE '✅ CARTS: Unauthenticated access denied (RLS working)';
    WHEN OTHERS THEN
      RAISE NOTICE '⚠️ CARTS: Unexpected error: %', SQLERRM;
  END;
END $$;

-- Test unauthenticated access to orders table
DO $$
BEGIN
  BEGIN
    PERFORM * FROM public.orders LIMIT 1;
    RAISE NOTICE '❌ ORDERS: Unauthenticated access allowed (RLS not working)';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE '✅ ORDERS: Unauthenticated access denied (RLS working)';
    WHEN OTHERS THEN
      RAISE NOTICE '⚠️ ORDERS: Unexpected error: %', SQLERRM;
  END;
END $$;

-- Test unauthenticated access to order_items table
DO $$
BEGIN
  BEGIN
    PERFORM * FROM public.order_items LIMIT 1;
    RAISE NOTICE '❌ ORDER_ITEMS: Unauthenticated access allowed (RLS not working)';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE '✅ ORDER_ITEMS: Unauthenticated access denied (RLS working)';
    WHEN OTHERS THEN
      RAISE NOTICE '⚠️ ORDER_ITEMS: Unexpected error: %', SQLERRM;
  END;
END $$;

-- Test unauthenticated access to saved_addresses table
DO $$
BEGIN
  BEGIN
    PERFORM * FROM public.saved_addresses LIMIT 1;
    RAISE NOTICE '❌ SAVED_ADDRESSES: Unauthenticated access allowed (RLS not working)';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE '✅ SAVED_ADDRESSES: Unauthenticated access denied (RLS working)';
    WHEN OTHERS THEN
      RAISE NOTICE '⚠️ SAVED_ADDRESSES: Unexpected error: %', SQLERRM;
  END;
END $$;

-- ==============================================
-- 5. SUMMARY
-- ==============================================

-- Summary of RLS configuration
SELECT 
  'RLS Summary' as test_type,
  'All Tables' as scope,
  CASE 
    WHEN COUNT(*) = 6 THEN '✅ All 6 tables have RLS enabled'
    ELSE '❌ Missing RLS on some tables'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'users', 
  'addresses', 
  'carts', 
  'orders', 
  'order_items', 
  'saved_addresses'
)
AND rowsecurity = true;

-- Summary of policies
SELECT 
  'Policy Summary' as test_type,
  'All Tables' as scope,
  CASE 
    WHEN COUNT(*) = 20 THEN '✅ All 20 policies created'
    ELSE '❌ Missing policies (expected: 20 total)'
  END as status
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN (
  'users', 
  'addresses', 
  'carts', 
  'orders', 
  'order_items', 
  'saved_addresses'
);

-- ==============================================
-- SUCCESS MESSAGE
-- ==============================================

-- This script verifies that RLS is properly configured
-- All tests should show ✅ for a successful RLS setup
-- If any tests show ❌, run the migration files again

