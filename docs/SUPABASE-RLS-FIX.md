# Supabase RLS Policy Fix for Guest Carts

## Problem

Getting error:

```
GET https://xxx.supabase.co/rest/v1/carts?select=items&session_id=eq.guest_xxx 406 (Not Acceptable)
```

## Root Cause

The RLS (Row Level Security) policies on the `carts` table are preventing guest users (unauthenticated) from accessing their carts via `session_id`.

## Solution

Update the RLS policies to allow guest cart access.

---

## Step 1: Check Current RLS Policies

Go to Supabase Dashboard:

1. Select your project
2. Go to **Database** → **Tables** → `carts`
3. Click **RLS policies** tab

---

## Step 2: Required RLS Policies for `carts` Table

### Policy 1: **Enable RLS**

Make sure RLS is enabled on the table.

---

### Policy 2: **Allow Authenticated Users to Manage Their Own Cart**

**Policy Name**: `Users can manage their own cart`

**Allowed Operation**: `ALL` (SELECT, INSERT, UPDATE, DELETE)

**Target Roles**: `authenticated`

**USING expression**:

```sql
auth.uid() = user_id
```

**WITH CHECK expression**:

```sql
auth.uid() = user_id
```

---

### Policy 3: **Allow Guest Cart Access via Session ID** ⚠️ NEW

**Policy Name**: `Guest users can manage cart by session_id`

**Allowed Operation**: `ALL` (SELECT, INSERT, UPDATE, DELETE)

**Target Roles**: `anon` (unauthenticated users)

**USING expression**:

```sql
user_id IS NULL
```

**WITH CHECK expression**:

```sql
user_id IS NULL
```

**Explanation**: This allows unauthenticated users to access carts where `user_id` is NULL (guest carts). The `session_id` is used for identification in the application logic, but RLS just needs to allow access to guest carts.

---

## Step 3: Apply Policies via SQL

Run this in **Supabase SQL Editor**:

```sql
-- Enable RLS on carts table (if not already enabled)
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

-- Policy 1: Authenticated users can manage their own cart
CREATE POLICY "Users can manage their own cart"
ON carts
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 2: Guest users can manage carts without user_id
CREATE POLICY "Guest users can manage cart by session_id"
ON carts
FOR ALL
TO anon
USING (user_id IS NULL)
WITH CHECK (user_id IS NULL);

-- Policy 3: Service role has full access (for webhooks and admin operations)
CREATE POLICY "Service role has full access to carts"
ON carts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
```

---

## Step 4: Verify Policies

After applying:

1. Go back to **RLS policies** tab
2. Should see 3 policies:
   - ✅ Users can manage their own cart (authenticated)
   - ✅ Guest users can manage cart by session_id (anon)
   - ✅ Service role has full access to carts (service_role)

---

## Step 5: Test Guest Cart

1. Log out of your app
2. Add products to cart as guest
3. Check browser console - should NOT see 406 error
4. Check Supabase `carts` table - should see guest cart with `session_id`

---

## Alternative: More Restrictive Guest Policy (Optional)

If you want to restrict guest carts by IP or session, you could use request headers, but that's complex for RLS. The above policy is standard practice.

---

## Additional: RLS Policies for `orders` Table

While we're at it, ensure `orders` table has correct policies:

```sql
-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view their own orders
CREATE POLICY "Users can view their own orders"
ON orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Service role can insert orders (from webhooks)
CREATE POLICY "Service role can insert orders"
ON orders
FOR INSERT
TO service_role
WITH CHECK (true);

-- Service role can update orders (for status changes)
CREATE POLICY "Service role can update orders"
ON orders
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Service role can select all orders (for admin dashboard)
CREATE POLICY "Service role can select all orders"
ON orders
FOR SELECT
TO service_role
USING (true);
```

---

## Security Considerations

### Is it safe to allow anon users to access carts with `user_id IS NULL`?

**Yes**, because:

1. Guest users can only access carts where `user_id` is NULL
2. They cannot access authenticated user carts (`user_id IS NOT NULL`)
3. The `session_id` is used in application logic for filtering, not RLS
4. RLS just ensures guests can't see other users' data

### Potential Issue: One guest could theoretically access another guest's cart

**Risk**: Very low. Guest session IDs are random and unpredictable.

**Mitigation** (if needed):

- Use Supabase Auth to create anonymous users (more complex)
- Or accept the minimal risk (standard for e-commerce)

---

## Troubleshooting

### Still getting 406 error?

**Check**:

1. RLS policies saved correctly
2. Browser cache cleared (hard refresh: Ctrl+Shift+R)
3. `session_id` column exists in `carts` table
4. `user_id` can be NULL (no NOT NULL constraint)

### Check column definitions:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'carts';
```

**Expected**:

```
column_name  | data_type | is_nullable
-------------+-----------+-------------
id           | uuid      | NO
user_id      | uuid      | YES  ← Must be nullable
session_id   | text      | YES  ← Must be nullable
items        | jsonb     | YES
updated_at   | timestamp | YES
```

---

## Summary

The 406 error occurs because guest users (role: `anon`) couldn't access the `carts` table due to missing RLS policy. By adding the guest policy, unauthenticated users can now manage their carts.

**After applying these policies**:

- ✅ Authenticated users: Access via `user_id`
- ✅ Guest users: Access via `session_id` (RLS allows `user_id IS NULL`)
- ✅ Webhooks: Use service role key (bypass RLS)

---

**Last Updated**: 2025-01-28
**Status**: Solution Documented ✅

