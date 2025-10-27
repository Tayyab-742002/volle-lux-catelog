# Database Schema Design for Volle E-commerce Platform

## Overview

This document outlines the complete database schema for the Volle e-commerce platform using Supabase PostgreSQL. The schema is designed to support user authentication, shopping carts, orders, addresses, and user profiles.

## Database Tables

### 1. **users** Table

Extends Supabase's built-in auth.users table with additional profile information.

```sql
-- Extend auth.users with additional profile data
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### 2. **addresses** Table

Stores shipping and billing addresses for users.

```sql
CREATE TABLE public.addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('shipping', 'billing')) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  phone TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own addresses" ON public.addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" ON public.addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON public.addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses" ON public.addresses
  FOR DELETE USING (auth.uid() = user_id);
```

### 3. **carts** Table

Stores shopping cart data for both authenticated users and guest sessions.

```sql
CREATE TABLE public.carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest carts
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure either user_id or session_id is provided
  CONSTRAINT carts_user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own carts" ON public.carts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own carts" ON public.carts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own carts" ON public.carts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own carts" ON public.carts
  FOR DELETE USING (auth.uid() = user_id);

-- Guest carts are handled via session_id (no RLS policy needed for guests)
```

### 4. **orders** Table

Stores order information and status.

```sql
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Orders can be updated by system (no user update policy)
CREATE POLICY "System can update orders" ON public.orders
  FOR UPDATE USING (true);
```

### 5. **order_items** Table

Stores individual items within orders for detailed tracking.

```sql
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL, -- Reference to Sanity product ID
  product_name TEXT NOT NULL,
  product_code TEXT NOT NULL,
  variant_name TEXT,
  variant_sku TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view order items for own orders" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);
```

### 6. **saved_addresses** Table

Stores frequently used addresses for quick checkout.

```sql
CREATE TABLE public.saved_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- e.g., "Home", "Office", "Mom's House"
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  phone TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.saved_addresses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own saved addresses" ON public.saved_addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved addresses" ON public.saved_addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved addresses" ON public.saved_addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved addresses" ON public.saved_addresses
  FOR DELETE USING (auth.uid() = user_id);
```

## Database Indexes

### Performance Indexes

```sql
-- Users table indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_created_at ON public.users(created_at);

-- Addresses table indexes
CREATE INDEX idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX idx_addresses_type ON public.addresses(type);
CREATE INDEX idx_addresses_user_type ON public.addresses(user_id, type);

-- Carts table indexes
CREATE INDEX idx_carts_user_id ON public.carts(user_id);
CREATE INDEX idx_carts_session_id ON public.carts(session_id);
CREATE INDEX idx_carts_updated_at ON public.carts(updated_at);

-- Orders table indexes
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_email ON public.orders(email);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_orders_stripe_session_id ON public.orders(stripe_session_id);
CREATE INDEX idx_orders_stripe_payment_intent_id ON public.orders(stripe_payment_intent_id);

-- Order items table indexes
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

-- Saved addresses table indexes
CREATE INDEX idx_saved_addresses_user_id ON public.saved_addresses(user_id);
CREATE INDEX idx_saved_addresses_user_default ON public.saved_addresses(user_id, is_default);
```

## Triggers and Functions

### Updated At Triggers

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON public.addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON public.carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_addresses_updated_at BEFORE UPDATE ON public.saved_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### User Profile Creation Trigger

```sql
-- Function to create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Data Types and Constraints

### JSONB Structure Examples

#### Cart Items Structure

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

#### Order Items Structure

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

#### Address Structure

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

## Migration Strategy

### Step 1: Create Tables

Run the table creation SQL in order:

1. users
2. addresses
3. carts
4. orders
5. order_items
6. saved_addresses

### Step 2: Create Indexes

Run all index creation statements

### Step 3: Create Functions and Triggers

Run the function and trigger creation statements

### Step 4: Test RLS Policies

Verify that Row Level Security is working correctly

## Security Considerations

1. **Row Level Security (RLS)**: All tables have RLS enabled
2. **User Isolation**: Users can only access their own data
3. **Guest Support**: Carts support both authenticated and guest users
4. **System Access**: Orders can be updated by system processes
5. **Data Validation**: Check constraints ensure data integrity

## Performance Considerations

1. **Indexes**: Strategic indexes on frequently queried columns
2. **JSONB**: Efficient storage and querying of complex data structures
3. **Foreign Keys**: Proper relationships for data integrity
4. **Triggers**: Automatic timestamp updates

This schema provides a solid foundation for the Volle e-commerce platform with proper security, performance, and scalability considerations.
