# Database Schema Migration Guide

## Overview

This guide walks you through creating the complete database schema for the Volle e-commerce platform in Supabase. The migration is broken down into 3 steps for safety and clarity.

## Prerequisites

- ✅ Supabase project created and active
- ✅ Environment variables configured
- ✅ Access to Supabase dashboard

## Migration Steps

### Step 1: Create Tables (`001_create_tables.sql`)

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `knxdmyopuzifmtowtska`
3. **Go to SQL Editor**: Click "SQL Editor" in the left sidebar
4. **Create new query**: Click "New query"
5. **Copy and paste** the contents of `supabase/migrations/001_create_tables.sql`
6. **Run the query**: Click "Run" button
7. **Verify success**: You should see "Success. No rows returned" message

**What this creates:**

- `users` table (extends auth.users)
- `addresses` table (shipping/billing addresses)
- `carts` table (shopping carts)
- `orders` table (order management)
- `order_items` table (detailed order items)
- `saved_addresses` table (frequently used addresses)
- All Row Level Security (RLS) policies

### Step 2: Create Indexes (`002_create_indexes.sql`)

1. **Create another new query** in SQL Editor
2. **Copy and paste** the contents of `supabase/migrations/002_create_indexes.sql`
3. **Run the query**: Click "Run" button
4. **Verify success**: You should see "Success. No rows returned" message

**What this creates:**

- Performance indexes on frequently queried columns
- Composite indexes for complex queries
- Foreign key indexes for joins

### Step 3: Create Triggers (`003_create_triggers.sql`)

1. **Create another new query** in SQL Editor
2. **Copy and paste** the contents of `supabase/migrations/003_create_triggers.sql`
3. **Run the query**: Click "Run" button
4. **Verify success**: You should see "Success. No rows returned" message

**What this creates:**

- `updated_at` triggers for all tables
- User profile creation trigger
- Helper functions

## Verification Steps

### 1. Check Tables Created

1. **Go to Table Editor** in Supabase dashboard
2. **Verify these tables exist**:
   - `users`
   - `addresses`
   - `carts`
   - `orders`
   - `order_items`
   - `saved_addresses`

### 2. Check RLS Policies

1. **Go to Authentication → Policies** in Supabase dashboard
2. **Verify policies exist** for all tables
3. **Check that RLS is enabled** on all tables

### 3. Test Database Connection

1. **Visit**: `http://localhost:3000/test-supabase-simple`
2. **Should show**: "✅ Connected" and "✅ Auth Working"
3. **No errors** should appear

## Database Schema Overview

### Table Relationships

```
auth.users (Supabase built-in)
    ↓
public.users (extends auth.users)
    ↓
public.addresses (user addresses)
public.carts (shopping carts)
public.orders (order management)
    ↓
public.order_items (order details)
public.saved_addresses (frequently used addresses)
```

### Key Features

1. **User Management**: Extends Supabase auth with profile data
2. **Address Management**: Shipping and billing addresses
3. **Cart Persistence**: Both authenticated and guest carts
4. **Order Tracking**: Complete order lifecycle management
5. **Security**: Row Level Security on all tables
6. **Performance**: Strategic indexes for fast queries

## Data Types Used

### JSONB Structures

**Cart Items:**

```json
[
  {
    "id": "product-id-variant-id",
    "product": {
      "id": "product-id",
      "name": "Product Name",
      "product_code": "PROD-001",
      "image": "image-url"
    },
    "variant": {
      "id": "variant-id",
      "name": "Large",
      "sku": "PROD-001-L",
      "price_adjustment": 5.0
    },
    "quantity": 2,
    "pricePerUnit": 15.99,
    "totalPrice": 31.98
  }
]
```

**Order Items:**

```json
[
  {
    "id": "product-id-variant-id",
    "product": {
      "id": "product-id",
      "name": "Product Name",
      "product_code": "PROD-001",
      "image": "image-url"
    },
    "variant": {
      "id": "variant-id",
      "name": "Large",
      "sku": "PROD-001-L"
    },
    "quantity": 2,
    "unitPrice": 15.99,
    "totalPrice": 31.98
  }
]
```

**Addresses:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "company": "Acme Corp",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "US",
  "phone": "+1-555-123-4567"
}
```

## Security Features

### Row Level Security (RLS)

- **Users**: Can only access their own profile
- **Addresses**: Can only access their own addresses
- **Carts**: Can only access their own carts
- **Orders**: Can only access their own orders
- **Order Items**: Can only access items from their own orders
- **Saved Addresses**: Can only access their own saved addresses

### Guest Support

- **Carts**: Support both authenticated users and guest sessions
- **Orders**: Can be created by guests (user_id can be NULL)

## Troubleshooting

### Common Issues

1. **Migration Fails**: Check for syntax errors in SQL
2. **RLS Not Working**: Verify policies are created correctly
3. **Triggers Not Working**: Check function definitions
4. **Index Creation Fails**: Some indexes might already exist

### Error Messages

**"relation does not exist"**: Run migrations in order (001, 002, 003)
**"permission denied"**: Check RLS policies
**"duplicate key"**: Some data might already exist

### Verification Queries

Test these queries in SQL Editor to verify setup:

```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users', 'addresses', 'carts', 'orders', 'order_items', 'saved_addresses');

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'addresses', 'carts', 'orders', 'order_items', 'saved_addresses');

-- Check indexes exist
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('users', 'addresses', 'carts', 'orders', 'order_items', 'saved_addresses');
```

## Next Steps

After successful migration:

1. **Task 2.2.3**: Test RLS policies
2. **Task 2.2.4**: Authentication integration
3. **Task 2.2.5**: Cart persistence integration

## Rollback (If Needed)

If you need to rollback the migration:

```sql
-- Drop all tables (WARNING: This will delete all data!)
DROP TABLE IF EXISTS public.saved_addresses CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.carts CASCADE;
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
```

**⚠️ Warning**: This will delete all data. Only use for development/testing.

---

**Migration Complete!** Your database schema is now ready for the Volle e-commerce platform.
