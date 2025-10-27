# Row Level Security (RLS) Testing Guide

## Overview

This guide provides comprehensive testing procedures for Row Level Security (RLS) policies in the Volle e-commerce platform. RLS ensures that users can only access their own data and that the system maintains proper security boundaries.

## Prerequisites

- ✅ Database schema created (Task 2.2.2)
- ✅ All tables exist with RLS enabled
- ✅ RLS policies created for all tables
- ✅ Supabase client configured

## RLS Testing Checklist

### ✅ **Step 1: Verify RLS is Enabled**

Run this query in Supabase SQL Editor to check RLS status:

```sql
-- Check RLS status for all tables
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
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
```

**Expected Result:** All tables should show `rls_enabled = true`

### ✅ **Step 2: Verify Policies Exist**

Run this query to check policy count:

```sql
-- Check policy count for all tables
SELECT
  tablename,
  COUNT(*) as policy_count
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
```

**Expected Results:**

- `users`: 3 policies (SELECT, UPDATE, INSERT)
- `addresses`: 4 policies (SELECT, INSERT, UPDATE, DELETE)
- `carts`: 4 policies (SELECT, INSERT, UPDATE, DELETE)
- `orders`: 3 policies (SELECT, INSERT, UPDATE)
- `order_items`: 2 policies (SELECT, INSERT)
- `saved_addresses`: 4 policies (SELECT, INSERT, UPDATE, DELETE)

### ✅ **Step 3: Test Unauthenticated Access**

Run this query to test RLS (should fail):

```sql
-- Test unauthenticated access to users table
SELECT * FROM public.users LIMIT 1;
```

**Expected Result:** `permission denied for table users` or similar error

### ✅ **Step 4: Use Test Page**

1. **Visit**: `http://localhost:3000/test-rls-policies`
2. **Check Results**: All tests should show "✅ RLS Working"
3. **Review Details**: Verify each table has proper RLS configuration

## Detailed Policy Testing

### **Users Table Policies**

```sql
-- Test users table policies
-- These should all fail for unauthenticated users

-- SELECT policy test
SELECT * FROM public.users WHERE id = 'test-id';

-- UPDATE policy test
UPDATE public.users SET full_name = 'Test' WHERE id = 'test-id';

-- INSERT policy test
INSERT INTO public.users (id, email) VALUES ('test-id', 'test@example.com');
```

**Expected:** All queries should fail with permission denied errors.

### **Addresses Table Policies**

```sql
-- Test addresses table policies
-- These should all fail for unauthenticated users

-- SELECT policy test
SELECT * FROM public.addresses WHERE user_id = 'test-id';

-- INSERT policy test
INSERT INTO public.addresses (user_id, type, first_name, last_name, address_line_1, city, state, postal_code)
VALUES ('test-id', 'shipping', 'John', 'Doe', '123 Main St', 'City', 'State', '12345');

-- UPDATE policy test
UPDATE public.addresses SET first_name = 'Jane' WHERE user_id = 'test-id';

-- DELETE policy test
DELETE FROM public.addresses WHERE user_id = 'test-id';
```

**Expected:** All queries should fail with permission denied errors.

### **Carts Table Policies**

```sql
-- Test carts table policies
-- These should all fail for unauthenticated users

-- SELECT policy test
SELECT * FROM public.carts WHERE user_id = 'test-id';

-- INSERT policy test
INSERT INTO public.carts (user_id, items) VALUES ('test-id', '[]'::jsonb);

-- UPDATE policy test
UPDATE public.carts SET items = '[]'::jsonb WHERE user_id = 'test-id';

-- DELETE policy test
DELETE FROM public.carts WHERE user_id = 'test-id';
```

**Expected:** All queries should fail with permission denied errors.

### **Orders Table Policies**

```sql
-- Test orders table policies
-- These should all fail for unauthenticated users

-- SELECT policy test
SELECT * FROM public.orders WHERE user_id = 'test-id';

-- INSERT policy test
INSERT INTO public.orders (user_id, email, total_amount, shipping_address, billing_address)
VALUES ('test-id', 'test@example.com', 100.00, '{}'::jsonb, '{}'::jsonb);

-- UPDATE policy test (this should work for system)
UPDATE public.orders SET status = 'processing' WHERE user_id = 'test-id';
```

**Expected:** SELECT and INSERT should fail, UPDATE might work (system policy).

### **Order Items Table Policies**

```sql
-- Test order_items table policies
-- These should all fail for unauthenticated users

-- SELECT policy test
SELECT * FROM public.order_items WHERE order_id = 'test-order-id';

-- INSERT policy test
INSERT INTO public.order_items (order_id, product_id, product_name, product_code, quantity, unit_price, total_price)
VALUES ('test-order-id', 'prod-1', 'Test Product', 'TEST-001', 1, 10.00, 10.00);
```

**Expected:** SELECT should fail, INSERT might work (system policy).

### **Saved Addresses Table Policies**

```sql
-- Test saved_addresses table policies
-- These should all fail for unauthenticated users

-- SELECT policy test
SELECT * FROM public.saved_addresses WHERE user_id = 'test-id';

-- INSERT policy test
INSERT INTO public.saved_addresses (user_id, name, first_name, last_name, address_line_1, city, state, postal_code)
VALUES ('test-id', 'Home', 'John', 'Doe', '123 Main St', 'City', 'State', '12345');

-- UPDATE policy test
UPDATE public.saved_addresses SET name = 'Office' WHERE user_id = 'test-id';

-- DELETE policy test
DELETE FROM public.saved_addresses WHERE user_id = 'test-id';
```

**Expected:** All queries should fail with permission denied errors.

## Authentication Testing (Future)

Once authentication is implemented (Task 2.2.4), test with authenticated users:

### **Authenticated User Tests**

```sql
-- These tests require authentication
-- Will be implemented in Task 2.2.4

-- Test with authenticated user
-- Should succeed for own data, fail for others' data

-- Test own user profile access
SELECT * FROM public.users WHERE id = auth.uid();

-- Test own addresses access
SELECT * FROM public.addresses WHERE user_id = auth.uid();

-- Test own cart access
SELECT * FROM public.carts WHERE user_id = auth.uid();

-- Test own orders access
SELECT * FROM public.orders WHERE user_id = auth.uid();
```

## Common Issues and Solutions

### **Issue 1: RLS Not Enabled**

**Symptoms:**

- Queries succeed for unauthenticated users
- Test page shows "RLS Not Working"

**Solution:**

```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_addresses ENABLE ROW LEVEL SECURITY;
```

### **Issue 2: Missing Policies**

**Symptoms:**

- RLS enabled but no policies exist
- All queries fail (even for authenticated users)

**Solution:**
Run the migration files again, specifically the policy creation sections.

### **Issue 3: Incorrect Policy Logic**

**Symptoms:**

- Policies exist but don't work as expected
- Wrong access patterns

**Solution:**
Check policy definitions and ensure they use `auth.uid()` correctly.

### **Issue 4: System Policies Not Working**

**Symptoms:**

- Order updates fail
- Order item insertions fail

**Solution:**
Ensure system policies use `USING (true)` for system-level access.

## Verification Queries

### **Check All Policies**

```sql
-- View all policies with details
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### **Check RLS Status**

```sql
-- Check RLS status for all tables
SELECT
  schemaname,
  tablename,
  rowsecurity,
  hasindexes,
  hasrules,
  hastriggers
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
```

## Success Criteria

### **RLS Testing Complete When:**

- [ ] All tables have RLS enabled
- [ ] All tables have appropriate policies
- [ ] Unauthenticated access is denied for all tables
- [ ] Test page shows "✅ RLS Policies Working Correctly"
- [ ] No unexpected access patterns
- [ ] System policies work for order management

## Next Steps

After RLS testing is complete:

1. **Task 2.2.4**: Authentication Integration
2. **Task 2.2.5**: Cart Persistence Integration
3. **Task 2.2.6**: Order Management Integration

## Security Notes

- **Never disable RLS** in production
- **Always test policies** before deploying
- **Monitor access patterns** for security issues
- **Regular policy audits** recommended
- **Document policy changes** for team review

---

**RLS Testing Complete!** Your database is now properly secured with Row Level Security policies.
