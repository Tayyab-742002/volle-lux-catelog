# Architecture Document: B2B/B2C E-commerce Platform

**Document Version:** 1.1  
**Date:** October 25, 2025  
**Owner:** Development Team  
**Status:** Initial Draft  
**Aligned with:** PRD.md (v1.1) | Design.md (v2.1)

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture Patterns](#3-architecture-patterns)
4. [Database Schema](#4-database-schema)
5. [Application Structure](#5-application-structure)
6. [API Design](#6-api-design)
7. [Component Architecture](#7-component-architecture)
8. [Data Flow](#8-data-flow)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [Payment Integration](#10-payment-integration)
11. [Email System](#11-email-system)
12. [Pricing Engine](#12-pricing-engine)
13. [Performance Optimization](#13-performance-optimization)
14. [Security Considerations](#14-security-considerations)
15. [Deployment Architecture](#15-deployment-architecture)

---

## 1. System Overview

### 1.1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                           │
│  (Next.js 15+ with React Server Components & Client)        │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Storefront │  │  User Account│  │ Admin System │     │
│  │   (Public)   │  │  (Protected) │  │  (Protected) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                    Service Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pricing    │  │     Cart     │  │    Order     │     │
│  │   Engine     │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                    Data Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Supabase   │  │    Sanity    │  │    Stripe    │     │
│  │(Auth, Orders)│  │(Products/CMS)│  │   Payments   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐                                          │
│  │    Resend    │                                          │
│  │    Email     │                                          │
│  └──────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
```

### 1.2. Core Principles

- **Server-First Architecture**: Leverage Next.js App Router and React Server Components for optimal performance
- **Type Safety**: Strict TypeScript throughout the application
- **Scalability**: Designed to handle both B2C and B2B traffic patterns
- **Maintainability**: Clear separation of concerns and modular design
- **Security**: Defense-in-depth approach with multiple security layers
- **Hybrid CMS**: Content managed in Sanity, transactions managed in Supabase

### 1.3. Dual-Platform Architecture

This platform uses **two complementary systems**:

1. **Sanity CMS**:
   - Manages product catalog, categories, variants, pricing tiers
   - Provides rich content editing interface for non-technical users
   - Stores product images via Sanity CDN
   - Enables rapid content updates without code deployment

2. **Supabase**:
   - Manages user authentication and authorization
   - Handles all transactional data (orders, carts, quotes)
   - Provides real-time capabilities for cart updates
   - Ensures data consistency and ACID compliance for orders

This hybrid approach combines the best of both worlds: Sanity's powerful content management with Supabase's robust transactional database.

---

## 2. Technology Stack

### 2.1. Frontend Stack

| Layer            | Technology              | Version | Purpose                         |
| ---------------- | ----------------------- | ------- | ------------------------------- |
| Framework        | Next.js                 | 15+     | React framework with App Router |
| Language         | TypeScript              | 5.x     | Type-safe development           |
| UI Framework     | React                   | 19+     | Component-based UI              |
| Styling          | Tailwind CSS            | 4.x     | Utility-first CSS framework     |
| Form Handling    | React Hook Form         | Latest  | Form validation and management  |
| State Management | Zustand / React Context | Latest  | Client-side state               |
| Data Fetching    | Server Components / SWR | Latest  | Data fetching and caching       |

### 2.2. Backend Stack

| Service            | Technology            | Purpose                             |
| ------------------ | --------------------- | ----------------------------------- |
| Runtime            | Node.js               | JavaScript runtime                  |
| API                | Next.js API Routes    | Serverless API endpoints            |
| Database           | Supabase (PostgreSQL) | Auth, orders, user data             |
| Authentication     | Supabase Auth         | User authentication                 |
| CMS                | Sanity                | Product catalog, content management |
| File Storage       | Sanity CDN            | Product images and assets           |
| Payment Processing | Stripe                | Payment gateway                     |
| Email Service      | Resend                | Transactional emails                |

### 2.3. Development Tools

| Tool           | Purpose         |
| -------------- | --------------- |
| ESLint         | Code linting    |
| Prettier       | Code formatting |
| Git            | Version control |
| GitHub Actions | CI/CD pipeline  |

---

## 3. Architecture Patterns

### 3.1. Design Patterns

1. **Repository Pattern**: Abstract database operations into repository classes
2. **Service Layer Pattern**: Business logic separated from API routes
3. **Factory Pattern**: For creating complex objects (orders, pricing calculations)
4. **Observer Pattern**: For cart updates and price recalculations
5. **Strategy Pattern**: For different pricing strategies (retail vs wholesale)

### 3.2. Code Organization Principles

- **DRY (Don't Repeat Yourself)**: Reusable components and utilities
- **SOLID Principles**: Single responsibility, open/closed, etc.
- **Separation of Concerns**: Clear boundaries between layers
- **Convention over Configuration**: Follow Next.js conventions

---

## 4. Database Schema

### 4.1. Data Architecture Overview

The system uses a **hybrid architecture** combining two platforms:

- **Sanity CMS**: Manages product catalog, categories, variants, pricing tiers, and static content
- **Supabase**: Manages user authentication, orders, carts, and transactional data

This separation allows Sanity to handle content management with its powerful editor, while Supabase manages transactional data with its robust database and authentication.

### 4.2. Sanity CMS Schema (Products & Content)

Products, categories, variants, and pricing tiers are managed in Sanity CMS. Refer to the Sanity schema configuration for the exact structure.

### 4.3. Supabase Database Schema (Transactions)

#### 4.3.1. Core Tables

#### 4.3.1.1. Users Table (Supabase Auth)

```sql
-- Managed by Supabase Auth
auth.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  encrypted_password TEXT,
  email_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

#### 4.3.1.2. Profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4.3.1.3. Addresses Table

```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  address_type TEXT CHECK (address_type IN ('shipping', 'billing')),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state_province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_is_default ON addresses(is_default) WHERE is_default = TRUE;
```

**Note:** Product catalog (categories, products, variants, pricing tiers) is managed in Sanity CMS, not Supabase.

#### 4.3.1.4. Carts Table

```sql
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest users
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);
```

#### 4.3.1.5. Cart Items Table

```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL, -- Snapshot of price at time of add
  applied_discount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
```

#### 4.3.1.6. Orders Table

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL, -- Human-readable order number
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Customer Info (for guest orders or snapshot)
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,

  -- Shipping Address
  shipping_address_line1 TEXT NOT NULL,
  shipping_address_line2 TEXT,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_postal_code TEXT NOT NULL,
  shipping_country TEXT NOT NULL,

  -- Billing Address
  billing_address_line1 TEXT NOT NULL,
  billing_address_line2 TEXT,
  billing_city TEXT NOT NULL,
  billing_state TEXT NOT NULL,
  billing_postal_code TEXT NOT NULL,
  billing_country TEXT NOT NULL,

  -- Order Amounts
  subtotal DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  shipping_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,

  -- Order Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'
  )),

  -- Payment Info
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'processing', 'paid', 'failed', 'refunded'
  )),
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,

  -- Tracking
  tracking_number TEXT,
  tracking_url TEXT,

  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_stripe_payment_intent_id ON orders(stripe_payment_intent_id);
```

#### 4.3.1.7. Order Items Table

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,

  -- Snapshot data (in case product is deleted)
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  variant_name TEXT,
  sku TEXT,

  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  subtotal DECIMAL(10, 2) NOT NULL, -- quantity * (unit_price - discount_amount)

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

#### 4.3.1.8. Quote Requests Table

```sql
CREATE TABLE quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Customer Info
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  company_name TEXT,

  -- Quote Details
  product_details TEXT NOT NULL, -- Description of products/quantities
  estimated_quantity INTEGER,
  message TEXT,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'reviewing', 'approved', 'rejected', 'converted'
  )),

  -- Admin Response
  admin_notes TEXT,
  quoted_price DECIMAL(10, 2),
  quoted_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quote_requests_user_id ON quote_requests(user_id);
CREATE INDEX idx_quote_requests_status ON quote_requests(status);
CREATE INDEX idx_quote_requests_created_at ON quote_requests(created_at DESC);
```

#### 4.3.1.9. Admin Users Table

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_users_role ON admin_users(role);
```

### 4.2. Database Functions and Triggers

#### 4.2.1. Updated At Trigger

```sql
-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Repeat for other tables: addresses, categories, products, etc.
```

#### 4.2.2. Order Number Generation

```sql
-- Function to generate sequential order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  next_id INTEGER;
  order_number TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_id
  FROM orders
  WHERE order_number LIKE 'ORD%';

  order_number := 'ORD' || LPAD(next_id::TEXT, 6, '0');
  RETURN order_number;
END;
$$ LANGUAGE plpgsql;
```

### 4.3. Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Example: Users can only see their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Example: Users can only see their own addresses
CREATE POLICY "Users can view own addresses"
  ON addresses FOR SELECT
  USING (auth.uid() = user_id);

-- Example: Admin users can view all orders
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = TRUE
    )
  );
```

---

## 5. Application Structure

### 5.1. Project File Structure

```
volle-lux-catalog/
├── app/
│   ├── (admin)/                    # Admin dashboard routes (protected)
│   │   ├── admin/
│   │   │   ├── layout.tsx         # Admin layout with sidebar
│   │   │   ├── page.tsx           # Admin dashboard
│   │   │   ├── studio/             # Sanity Studio integration
│   │   │   │   └── [[...path]]/
│   │   │   │       └── page.tsx   # Sanity Studio iframe
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx       # Orders list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx   # Order details
│   │   │   ├── quotes/
│   │   │   │   ├── page.tsx       # Quote requests list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx   # Quote details
│   │   │   └── settings/
│   │   │       └── page.tsx       # System settings
│   │   └── middleware.ts          # Admin auth middleware
│   │
│   ├── sanity/
│   │   └── studio/                 # Sanity Studio standalone (optional)
│   │       └── sanity.config.ts
│   │
│   ├── (auth)/                     # Auth routes
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   │
│   ├── (storefront)/               # Public storefront routes
│   │   ├── layout.tsx             # Main storefront layout
│   │   ├── page.tsx               # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx           # Product listing page (PLP)
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx       # Product detail page (PDP)
│   │   │   └── category/
│   │   │       └── [slug]/
│   │   │           └── page.tsx   # Category page
│   │   ├── cart/
│   │   │   └── page.tsx           # Shopping cart
│   │   ├── checkout/
│   │   │   ├── page.tsx           # Checkout page
│   │   │   ├── success/
│   │   │   │   └── page.tsx       # Order success
│   │   │   └── cancelled/
│   │   │       └── page.tsx       # Payment cancelled
│   │   ├── account/               # User account (protected)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Account dashboard
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx       # Order history
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx   # Order details
│   │   │   ├── addresses/
│   │   │   │   └── page.tsx       # Saved addresses
│   │   │   └── settings/
│   │   │       └── page.tsx       # Account settings
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── faq/
│   │   │   └── page.tsx
│   │   ├── delivery/
│   │   │   └── page.tsx
│   │   ├── returns/
│   │   │   └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   ├── terms/
│   │   │   └── page.tsx
│   │   └── sustainability/
│   │       └── page.tsx
│   │
│   ├── api/                        # API routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   ├── products/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── cart/
│   │   │   ├── route.ts
│   │   │   └── items/
│   │   │       └── route.ts
│   │   ├── orders/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── checkout/
│   │   │   ├── create-payment-intent/
│   │   │   │   └── route.ts
│   │   │   └── confirm/
│   │   │       └── route.ts
│   │   ├── pricing/
│   │   │   └── calculate/
│   │   │       └── route.ts
│   │   ├── webhooks/
│   │   │   └── stripe/
│   │   │       └── route.ts
│   │   └── contact/
│   │       └── route.ts
│   │
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── not-found.tsx               # 404 page
│
├── components/                     # React components
│   ├── ui/                        # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── dropdown.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── alert.tsx
│   │   └── spinner.tsx
│   │
│   ├── layout/                    # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── navigation.tsx
│   │   ├── mobile-menu.tsx
│   │   ├── breadcrumbs.tsx
│   │   └── sidebar.tsx
│   │
│   ├── products/                  # Product-related components
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   ├── product-gallery.tsx
│   │   ├── product-filters.tsx
│   │   ├── variant-selector.tsx
│   │   ├── quantity-selector.tsx
│   │   ├── add-to-cart-button.tsx
│   │   ├── price-display.tsx
│   │   ├── pricing-tiers.tsx
│   │   └── related-products.tsx
│   │
│   ├── cart/                      # Cart components
│   │   ├── cart-drawer.tsx
│   │   ├── cart-item.tsx
│   │   ├── cart-summary.tsx
│   │   └── mini-cart.tsx
│   │
│   ├── checkout/                  # Checkout components
│   │   ├── checkout-form.tsx
│   │   ├── address-form.tsx
│   │   ├── payment-form.tsx
│   │   └── order-summary.tsx
│   │
│   ├── account/                   # User account components
│   │   ├── order-card.tsx
│   │   ├── order-status.tsx
│   │   ├── address-card.tsx
│   │   ├── invoice-download.tsx
│   │   └── reorder-button.tsx
│   │
│   ├── admin/                     # Admin CMS components
│   │   ├── product-form.tsx
│   │   ├── variant-form.tsx
│   │   ├── image-uploader.tsx
│   │   ├── pricing-tier-form.tsx
│   │   ├── order-table.tsx
│   │   ├── order-status-updater.tsx
│   │   ├── quote-table.tsx
│   │   └── data-table.tsx
│   │
│   └── forms/                     # Form components
│       ├── contact-form.tsx
│       ├── quote-request-form.tsx
│       └── search-form.tsx
│
├── lib/                           # Utility libraries
│   ├── supabase/
│   │   ├── client.ts             # Supabase client
│   │   ├── server.ts             # Supabase server client
│   │   └── middleware.ts         # Supabase middleware
│   │
│   ├── sanity/
│   │   ├── client.ts             # Sanity client
│   │   ├── queries.ts            # GROQ queries
│   │   └── schemas/              # Sanity schema definitions
│   │
│   ├── stripe/
│   │   ├── client.ts             # Stripe client
│   │   └── webhooks.ts           # Webhook handlers
│   │
│   ├── resend/
│   │   └── client.ts             # Resend email client
│   │
│   ├── utils/
│   │   ├── cn.ts                 # Class name utility
│   │   ├── format.ts             # Formatting utilities
│   │   ├── validation.ts         # Validation helpers
│   │   └── constants.ts          # App constants
│   │
│   └── hooks/                    # Custom React hooks
│       ├── use-cart.ts
│       ├── use-user.ts
│       ├── use-products.ts
│       └── use-debounce.ts
│
├── services/                      # Business logic services
│   ├── products/
│   │   ├── product.service.ts
│   │   └── variant.service.ts
│   │
│   ├── cart/
│   │   └── cart.service.ts
│   │
│   ├── orders/
│   │   ├── order.service.ts
│   │   └── order-fulfillment.service.ts
│   │
│   ├── pricing/
│   │   ├── pricing.service.ts
│   │   └── discount-calculator.ts
│   │
│   ├── payment/
│   │   └── payment.service.ts
│   │
│   └── email/
│       ├── email.service.ts
│       └── templates/
│           ├── order-confirmation.tsx
│           ├── shipping-notification.tsx
│           └── quote-response.tsx
│
├── types/                         # TypeScript type definitions
│   ├── database.types.ts         # Supabase generated types
│   ├── product.types.ts
│   ├── cart.types.ts
│   ├── order.types.ts
│   ├── user.types.ts
│   └── api.types.ts
│
├── middleware.ts                  # Next.js middleware
├── .env.local                     # Environment variables
├── .env.example                   # Example env variables
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies
└── README.md                      # Project documentation
```

### 5.2. Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Resend
RESEND_API_KEY=your_resend_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Volle Lux Catalog"

# Admin
ADMIN_EMAIL=admin@example.com
```

---

## 6. API Design

### 6.1. API Architecture

- **RESTful Design**: Follow REST principles for predictable API structure
- **API Routes**: Next.js App Router API routes (`app/api/`)
- **Server Actions**: Use Next.js Server Actions for form submissions
- **Type Safety**: Full TypeScript types for all API inputs/outputs

### 6.2. API Endpoints

#### 6.2.1. Product APIs

```typescript
// GET /api/products
// Query products with filters
interface GetProductsRequest {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: "price" | "name" | "newest";
  sortOrder?: "asc" | "desc";
}

interface GetProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// GET /api/products/[id]
// Get single product with variants and pricing tiers
interface GetProductResponse {
  product: Product & {
    variants: ProductVariant[];
    pricingTiers: PricingTier[];
    images: ProductImage[];
    category: Category;
  };
}

// Admin only endpoints
// POST /api/products
// PUT /api/products/[id]
// DELETE /api/products/[id]
```

#### 6.2.2. Cart APIs

```typescript
// GET /api/cart
// Get current user's cart
interface GetCartResponse {
  cart: Cart & {
    items: CartItem[];
  };
  totals: {
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    shippingAmount: number;
    total: number;
  };
}

// POST /api/cart/items
// Add item to cart
interface AddToCartRequest {
  productId: string;
  variantId?: string;
  quantity: number;
}

// PUT /api/cart/items/[id]
// Update cart item quantity
interface UpdateCartItemRequest {
  quantity: number;
}

// DELETE /api/cart/items/[id]
// Remove item from cart
```

#### 6.2.3. Pricing APIs

```typescript
// POST /api/pricing/calculate
// Calculate price with tiers
interface CalculatePriceRequest {
  productId: string;
  variantId?: string;
  quantity: number;
}

interface CalculatePriceResponse {
  basePrice: number;
  appliedTier?: {
    tierName: string;
    minQuantity: number;
    discountValue: number;
  };
  unitPrice: number;
  totalPrice: number;
  savings: number;
}
```

#### 6.2.4. Order APIs

```typescript
// POST /api/orders
// Create new order
interface CreateOrderRequest {
  cartId: string;
  shippingAddress: Address;
  billingAddress: Address;
  customerNotes?: string;
}

interface CreateOrderResponse {
  order: Order;
  paymentIntent: {
    clientSecret: string;
    id: string;
  };
}

// GET /api/orders
// Get user's orders (or all orders for admin)
interface GetOrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

// GET /api/orders/[id]
// Get order details
interface GetOrderResponse {
  order: Order & {
    items: OrderItem[];
  };
}

// Admin only
// PUT /api/orders/[id]
// Update order status
interface UpdateOrderRequest {
  status?: OrderStatus;
  trackingNumber?: string;
  trackingUrl?: string;
  adminNotes?: string;
}
```

#### 6.2.5. Checkout APIs

```typescript
// POST /api/checkout/create-payment-intent
// Create Stripe payment intent
interface CreatePaymentIntentRequest {
  orderId: string;
}

interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

// POST /api/checkout/confirm
// Confirm payment and finalize order
interface ConfirmCheckoutRequest {
  orderId: string;
  paymentIntentId: string;
}
```

#### 6.2.6. Webhook APIs

```typescript
// POST /api/webhooks/stripe
// Handle Stripe webhooks
// Events: payment_intent.succeeded, charge.succeeded, etc.
```

### 6.3. Error Handling

```typescript
// Standard error response format
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  status: number;
}

// Common error codes
enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}
```

---

## 7. Component Architecture

### 7.1. Component Hierarchy

```
App
├── RootLayout
│   ├── Header
│   │   ├── Navigation
│   │   ├── SearchBar
│   │   └── MiniCart
│   │
│   ├── Main Content (Slots)
│   │   ├── Storefront Pages
│   │   │   ├── Homepage
│   │   │   ├── ProductListingPage
│   │   │   │   ├── ProductGrid
│   │   │   │   │   └── ProductCard[]
│   │   │   │   └── ProductFilters
│   │   │   └── ProductDetailPage
│   │   │       ├── ProductGallery
│   │   │       ├── VariantSelector
│   │   │       ├── QuantitySelector
│   │   │       ├── PricingTiers
│   │   │       ├── AddToCartButton
│   │   │       └── RelatedProducts
│   │   │
│   │   ├── Cart & Checkout
│   │   │   ├── CartPage
│   │   │   │   ├── CartItem[]
│   │   │   │   └── CartSummary
│   │   │   └── CheckoutPage
│   │   │       ├── AddressForm
│   │   │       ├── PaymentForm
│   │   │       └── OrderSummary
│   │   │
│   │   ├── Account Pages
│   │   │   ├── AccountLayout
│   │   │   │   ├── AccountSidebar
│   │   │   │   └── AccountContent
│   │   │   │       ├── OrderHistory
│   │   │   │       ├── OrderDetails
│   │   │   │       └── SavedAddresses
│   │   │
│   │   └── Admin Pages
│   │       ├── AdminLayout
│   │       │   ├── AdminSidebar
│   │       │   └── AdminContent
│   │       │       ├── ProductManagement
│   │       │       ├── OrderManagement
│   │       │       └── QuoteManagement
│   │
│   └── Footer
│       ├── FooterLinks
│       └── ContactInfo
```

### 7.2. Component Design Principles

1. **Server Components by Default**: Use React Server Components for better performance
2. **Client Components When Needed**: Use `'use client'` only for interactive components
3. **Composition over Inheritance**: Build complex UIs from simple components
4. **Props Interface**: Every component has a typed props interface
5. **Single Responsibility**: Each component has one clear purpose

### 7.3. State Management Strategy

```typescript
// Global State (Zustand)
// - Cart state (synced with backend)
// - User authentication state
// - UI state (modals, drawers)

// Server State (React Query / SWR)
// - Product data
// - Order history
// - User profile

// Local State (useState)
// - Form inputs
// - UI toggles
// - Temporary selections
```

---

## 8. Data Flow

### 8.1. Shopping Flow Data Flow

```
1. Browse Products
   User → PLP (Server Component) → Supabase (products query)

2. View Product Details
   User → PDP (Server Component) → Supabase (product + variants + pricing)

3. Add to Cart
   User → AddToCart (Client) → API Route → Cart Service → Supabase
   ↓
   Pricing Engine calculates discounts
   ↓
   Cart state updated (Zustand)

4. Checkout
   User → Checkout Form (Client) → API Route → Order Service
   ↓
   Create Order (pending)
   ↓
   Create Stripe Payment Intent
   ↓
   Return clientSecret to frontend

5. Payment
   User → Stripe Elements (Client) → Stripe API
   ↓
   Payment succeeds
   ↓
   Stripe Webhook → API Route → Order Service
   ↓
   Update order status to 'paid'
   ↓
   Send confirmation email (Resend)
   ↓
   Redirect to success page
```

### 8.2. Pricing Calculation Flow

```
Calculate Price Function:
1. Get base price for product/variant
2. Get quantity from input
3. Query pricing_tiers for product
4. Find applicable tier based on quantity
5. Apply discount (percentage or fixed)
6. Return calculated price

Real-time Updates:
- Quantity change → Recalculate price
- Cart page load → Calculate all items
- Checkout → Final calculation with tax/shipping
```

### 8.3. Order Fulfillment Flow

```
1. Order Paid (webhook)
   ↓
2. Admin sees order in dashboard
   ↓
3. Admin verifies payment
   ↓
4. Admin prepares shipment
   ↓
5. Admin updates status to "shipped"
   + Adds tracking number
   ↓
6. System sends shipping notification email
   ↓
7. Customer tracks order
   ↓
8. Admin marks as "delivered"
```

---

## 9. Authentication & Authorization

### 9.1. Authentication Strategy

```typescript
// Supabase Auth flow
const authFlow = {
  // Registration
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });
    // Create profile entry
    // Send welcome email
  },

  // Login
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  // Session management
  getSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  // Logout
  signOut: async () => {
    await supabase.auth.signOut();
  },
};
```

### 9.2. Authorization Levels

```typescript
enum UserRole {
  GUEST = "guest", // No authentication
  CUSTOMER = "customer", // Registered user
  ADMIN = "admin", // Admin user
  SUPER_ADMIN = "super_admin", // Full access
}

// Route protection
const protectedRoutes = {
  "/account/*": [UserRole.CUSTOMER],
  "/admin/*": [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  "/checkout": [UserRole.GUEST, UserRole.CUSTOMER], // Allow guest checkout
};
```

### 9.3. Middleware Authentication

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes
  if (pathname.startsWith("/admin")) {
    const session = await getSession(request);
    const isAdmin = await checkAdminRole(session?.user?.id);

    if (!session || !isAdmin) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Account routes
  if (pathname.startsWith("/account")) {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}
```

---

## 10. Payment Integration

### 10.1. Stripe Integration Architecture

```typescript
// Payment flow
const paymentFlow = {
  // 1. Create order (pending payment)
  createOrder: async (cartData, addressData) => {
    const order = await orderService.create({
      ...cartData,
      ...addressData,
      status: "pending",
      payment_status: "pending",
    });
    return order;
  },

  // 2. Create Stripe Payment Intent
  createPaymentIntent: async (orderId: string) => {
    const order = await orderService.getById(orderId);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total_amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        orderId: order.id,
        orderNumber: order.order_number,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Store payment intent ID
    await orderService.update(orderId, {
      stripe_payment_intent_id: paymentIntent.id,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  },

  // 3. Handle webhook
  handleWebhook: async (event: Stripe.Event) => {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        await orderService.update(orderId, {
          payment_status: "paid",
          status: "processing",
          paid_at: new Date(),
          stripe_charge_id: paymentIntent.latest_charge,
        });

        // Send confirmation email
        await emailService.sendOrderConfirmation(orderId);
        break;

      case "payment_intent.payment_failed":
        // Handle failed payment
        break;
    }
  },
};
```

### 10.2. Stripe Elements Implementation

```typescript
// checkout/payment-form.tsx
"use client";

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export function PaymentForm({ clientSecret, orderId }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
      },
    });

    if (error) {
      // Show error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>
        Pay Now
      </button>
    </form>
  );
}
```

---

## 11. Email System

### 11.1. Email Service Architecture

```typescript
// services/email/email.service.ts
import { Resend } from "resend";
import { OrderConfirmationEmail } from "./templates/order-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  async sendOrderConfirmation(orderId: string) {
    const order = await orderService.getById(orderId);

    const { data, error } = await resend.emails.send({
      from: "orders@volle-lux.com",
      to: order.customer_email,
      subject: `Order Confirmation - ${order.order_number}`,
      react: OrderConfirmationEmail({ order }),
    });

    if (error) {
      console.error("Failed to send email:", error);
      throw error;
    }

    return data;
  }

  async sendShippingNotification(orderId: string) {
    // Similar implementation
  }

  async sendQuoteResponse(quoteId: string, response: string) {
    // Similar implementation
  }

  async sendContactFormSubmission(formData: ContactFormData) {
    // Send to admin email
  }
}

export const emailService = new EmailService();
```

### 11.2. Email Templates

```typescript
// React Email components
import {
  Html,
  Body,
  Container,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface OrderConfirmationEmailProps {
  order: Order & { items: OrderItem[] };
}

export function OrderConfirmationEmail({ order }: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Body>
        <Container>
          <Section>
            <Text>Order Confirmation</Text>
            <Text>Order Number: {order.order_number}</Text>
            <Text>Thank you for your purchase!</Text>

            {/* Order items */}
            {order.items.map((item) => (
              <Section key={item.id}>
                <Text>
                  {item.product_name} x {item.quantity}
                </Text>
                <Text>${item.subtotal}</Text>
              </Section>
            ))}

            <Text>Total: ${order.total_amount}</Text>

            <Button
              href={`${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}`}
            >
              View Order
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

---

## 12. Pricing Engine

### 12.1. Pricing Service

```typescript
// services/pricing/pricing.service.ts
interface PriceCalculation {
  basePrice: number;
  appliedTier?: PricingTier;
  unitPrice: number;
  totalPrice: number;
  savings: number;
  discountPercentage: number;
}

export class PricingService {
  /**
   * Calculate price for a product based on quantity
   */
  async calculatePrice(
    productId: string,
    quantity: number,
    variantId?: string
  ): Promise<PriceCalculation> {
    // Get base price
    const product = await productService.getById(productId);
    let basePrice = product.base_price;

    // Add variant price adjustment if applicable
    if (variantId) {
      const variant = await variantService.getById(variantId);
      basePrice += variant.price_adjustment;
    }

    // Get pricing tiers for this product
    const tiers = await this.getPricingTiers(productId);

    // Find applicable tier
    const appliedTier = this.findApplicableTier(tiers, quantity);

    // Calculate discounted price
    let unitPrice = basePrice;
    if (appliedTier) {
      if (appliedTier.discount_type === "percentage") {
        unitPrice = basePrice * (1 - appliedTier.discount_value / 100);
      } else if (appliedTier.discount_type === "fixed_price") {
        unitPrice = appliedTier.discount_value;
      }
    }

    const totalPrice = unitPrice * quantity;
    const savings = (basePrice - unitPrice) * quantity;
    const discountPercentage = appliedTier
      ? ((basePrice - unitPrice) / basePrice) * 100
      : 0;

    return {
      basePrice,
      appliedTier,
      unitPrice,
      totalPrice,
      savings,
      discountPercentage,
    };
  }

  /**
   * Find the applicable pricing tier for a given quantity
   */
  private findApplicableTier(
    tiers: PricingTier[],
    quantity: number
  ): PricingTier | undefined {
    // Sort tiers by min_quantity descending
    const sortedTiers = [...tiers].sort(
      (a, b) => b.min_quantity - a.min_quantity
    );

    // Find the first tier where quantity >= min_quantity
    // and (max_quantity is null OR quantity <= max_quantity)
    return sortedTiers.find(
      (tier) =>
        quantity >= tier.min_quantity &&
        (tier.max_quantity === null || quantity <= tier.max_quantity)
    );
  }

  /**
   * Calculate cart totals with all discounts applied
   */
  async calculateCartTotals(cartItems: CartItem[]): Promise<CartTotals> {
    let subtotal = 0;
    let totalDiscount = 0;

    for (const item of cartItems) {
      const calculation = await this.calculatePrice(
        item.product_id,
        item.quantity,
        item.variant_id
      );

      subtotal += calculation.basePrice * item.quantity;
      totalDiscount += calculation.savings;
    }

    const subtotalAfterDiscount = subtotal - totalDiscount;
    const taxAmount = this.calculateTax(subtotalAfterDiscount);
    const shippingAmount = this.calculateShipping(cartItems);
    const total = subtotalAfterDiscount + taxAmount + shippingAmount;

    return {
      subtotal,
      discountAmount: totalDiscount,
      taxAmount,
      shippingAmount,
      total,
    };
  }

  private calculateTax(amount: number): number {
    // Implement tax calculation based on address
    // For now, return 0 (can integrate with tax service later)
    return 0;
  }

  private calculateShipping(items: CartItem[]): number {
    // Implement shipping calculation
    // Could be based on weight, dimensions, or flat rate
    return 0; // Free shipping for now
  }
}

export const pricingService = new PricingService();
```

### 12.2. Real-time Price Updates

```typescript
// components/products/quantity-selector.tsx
"use client";

import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

export function QuantitySelector({
  productId,
  variantId,
  onPriceChange,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);
  const [pricing, setPricing] = useState<PriceCalculation | null>(null);
  const [loading, setLoading] = useState(false);

  // Debounce price calculation to avoid excessive API calls
  const calculatePrice = useDebouncedCallback(async (qty: number) => {
    setLoading(true);
    try {
      const response = await fetch("/api/pricing/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantId, quantity: qty }),
      });

      const data = await response.json();
      setPricing(data);
      onPriceChange?.(data);
    } catch (error) {
      console.error("Failed to calculate price:", error);
    } finally {
      setLoading(false);
    }
  }, 300); // 300ms debounce

  useEffect(() => {
    calculatePrice(quantity);
  }, [quantity, productId, variantId]);

  return (
    <div>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
        min="1"
      />

      {pricing && (
        <div>
          <p>Price: ${pricing.unitPrice.toFixed(2)}</p>
          <p>Total: ${pricing.totalPrice.toFixed(2)}</p>

          {pricing.appliedTier && (
            <p>
              Save {pricing.discountPercentage.toFixed(0)}% ($
              {pricing.savings.toFixed(2)})
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 13. Performance Optimization

### 13.1. Optimization Strategies

```typescript
// 1. Server Component Optimization
// - Use React Server Components by default
// - Fetch data at component level
// - Stream data with Suspense

// 2. Image Optimization
import Image from "next/image";

<Image
  src={product.image_url}
  alt={product.name}
  width={400}
  height={400}
  loading="lazy"
  placeholder="blur"
/>;

// 3. Database Optimization
// - Use indexes on frequently queried columns
// - Implement pagination
// - Use Supabase's query optimization

// 4. Caching Strategy
export const revalidate = 3600; // Revalidate every hour

// 5. Code Splitting
const AdminDashboard = dynamic(() => import("@/components/admin/dashboard"), {
  loading: () => <LoadingSpinner />,
});

// 6. API Response Compression
// Enable gzip in next.config.ts

// 7. Database Query Optimization
// - Select only needed columns
// - Use JOINs efficiently
// - Implement read replicas if needed
```

### 13.2. Caching Strategy

```typescript
// Cache levels
const cachingStrategy = {
  // 1. Static Generation (Build time)
  staticPages: ["/about", "/delivery", "/privacy", "/terms"],

  // 2. Incremental Static Regeneration
  isr: {
    "/products": { revalidate: 3600 }, // 1 hour
    "/products/[slug]": { revalidate: 1800 }, // 30 minutes
    "/": { revalidate: 600 }, // 10 minutes
  },

  // 3. Server-Side Rendering (Dynamic)
  ssr: ["/cart", "/checkout", "/account/*", "/admin/*"],

  // 4. Client-Side Caching (SWR)
  clientCache: {
    products: { dedupingInterval: 60000 }, // 1 minute
    cart: { dedupingInterval: 5000 }, // 5 seconds
    orders: { dedupingInterval: 30000 }, // 30 seconds
  },

  // 5. CDN Caching
  cdn: {
    images: "max-age=31536000, immutable",
    static: "max-age=86400",
  },
};
```

---

## 14. Security Considerations

### 14.1. Security Measures

```typescript
// 1. Authentication Security
const authSecurity = {
  passwordRequirements: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  sessionManagement: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
    secure: true,
    httpOnly: true,
    sameSite: "lax",
  },
};

// 2. API Security
// - Validate all inputs
// - Use CSRF tokens
// - Rate limiting
// - API key rotation

// 3. Database Security
// - Row Level Security (RLS) enabled
// - Parameterized queries (prevent SQL injection)
// - Encrypted sensitive data
// - Regular backups

// 4. Payment Security
// - PCI compliance via Stripe
// - Never store card details
// - Use Stripe webhooks with signature verification

// 5. Content Security Policy
const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.stripe.com;
  frame-src https://js.stripe.com;
`;

// 6. Input Validation & Sanitization
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

// 7. XSS Prevention
// - Sanitize user inputs
// - Use React's built-in XSS protection
// - Validate on both client and server
```

### 14.2. Webhook Security

```typescript
// Verify Stripe webhook signatures
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Process event
    await handleStripeWebhook(event);

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
    });
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }
}
```

---

## 15. Deployment Architecture

### 15.1. Deployment Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Next.js Application                         │  │
│  │  - Server Components                                  │  │
│  │  - API Routes                                         │  │
│  │  - Edge Functions                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐  ┌──────▼─────┐  ┌──────▼─────┐
│   Supabase   │  │   Stripe   │  │   Resend   │
│              │  │            │  │            │
│ - Database   │  │ - Payments │  │ - Emails   │
│ - Auth       │  │            │  │            │
│ - Storage    │  │            │  │            │
└──────────────┘  └────────────┘  └────────────┘
```

### 15.2. Environment Setup

```typescript
// Development
const devConfig = {
  environment: "development",
  url: "http://localhost:3000",
  database: "supabase_dev",
  stripe: "test_keys",
  features: {
    debug: true,
    mockPayments: true,
  },
};

// Staging
const stagingConfig = {
  environment: "staging",
  url: "https://staging.volle-lux.com",
  database: "supabase_staging",
  stripe: "test_keys",
  features: {
    debug: true,
    mockPayments: false,
  },
};

// Production
const prodConfig = {
  environment: "production",
  url: "https://volle-lux.com",
  database: "supabase_prod",
  stripe: "live_keys",
  features: {
    debug: false,
    mockPayments: false,
  },
};
```

### 15.3. CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 15.4. Monitoring & Logging

```typescript
// Monitoring stack
const monitoring = {
  // 1. Application Monitoring
  vercelAnalytics: true,

  // 2. Error Tracking
  sentry: {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
  },

  // 3. Performance Monitoring
  webVitals: true,

  // 4. Database Monitoring
  supabaseMetrics: true,

  // 5. Payment Monitoring
  stripeDashboard: true,
};

// Logging
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

---

## 16. Development Guidelines

### 16.1. Code Standards

```typescript
// 1. Naming Conventions
// - Components: PascalCase (ProductCard.tsx)
// - Files: kebab-case (product-card.tsx)
// - Functions: camelCase (calculatePrice)
// - Constants: UPPER_SNAKE_CASE (MAX_QUANTITY)
// - Types/Interfaces: PascalCase (ProductType)

// 2. File Organization
// - One component per file
// - Co-locate related files
// - Index files for public API

// 3. Type Safety
// - No 'any' types without justification
// - Use strict TypeScript
// - Define interfaces for all data structures

// 4. Error Handling
try {
  await operation();
} catch (error) {
  logger.error("Operation failed", { error });
  throw new ApplicationError("User-friendly message", { cause: error });
}

// 5. Comments
// Write comments for:
// - Complex business logic
// - Non-obvious decisions
// - TODOs with context
```

### 16.2. Testing Strategy

```typescript
// 1. Unit Tests (Jest)
// - Service layer functions
// - Utility functions
// - Pricing calculations

// 2. Integration Tests
// - API routes
// - Database operations
// - External service integrations

// 3. E2E Tests (Playwright)
// - Critical user flows
// - Checkout process
// - Admin workflows

// 4. Component Tests (React Testing Library)
// - User interactions
// - Form validations
// - State changes
```

### 16.3. Git Workflow

```bash
# Branch naming
feature/add-product-filters
bugfix/cart-calculation-error
hotfix/payment-webhook-failure

# Commit messages
feat: add product filtering to PLP
fix: correct pricing calculation for bulk orders
docs: update architecture document
refactor: simplify cart service logic
test: add tests for pricing engine
```

---

## 17. Future Enhancements

### 17.1. Phase 2 Features

```typescript
const phase2Features = [
  // 1. Advanced Search
  {
    feature: "Elasticsearch Integration",
    description: "Full-text search with filters",
    priority: "high",
  },

  // 2. Wishlist
  {
    feature: "Product Wishlist",
    description: "Save products for later",
    priority: "medium",
  },

  // 3. Product Reviews
  {
    feature: "Customer Reviews & Ratings",
    description: "User-generated content",
    priority: "medium",
  },

  // 4. Loyalty Program
  {
    feature: "Points & Rewards",
    description: "Incentivize repeat purchases",
    priority: "low",
  },

  // 5. Multi-currency
  {
    feature: "International Support",
    description: "Multiple currencies and languages",
    priority: "low",
  },
];
```

### 17.2. Scalability Considerations

```typescript
// When to scale
const scalingTriggers = {
  database: {
    trigger: "Query times > 100ms",
    action: "Add read replicas, optimize queries",
  },

  api: {
    trigger: "Response times > 200ms",
    action: "Implement Redis caching",
  },

  storage: {
    trigger: "Image loading > 2s",
    action: "Implement CDN, optimize images",
  },

  traffic: {
    trigger: "> 10k concurrent users",
    action: "Scale serverless functions, add load balancer",
  },
};
```

---

## 18. Conclusion

This architecture document provides a comprehensive blueprint for building a scalable, maintainable B2B/B2C e-commerce platform. It leverages modern technologies and best practices to deliver a high-performance user experience while maintaining code quality and security.

### 18.1. Key Architectural Decisions

1. **Next.js App Router**: Server-first architecture for optimal performance
2. **Supabase**: Managed PostgreSQL with built-in auth and real-time capabilities
3. **Stripe**: Industry-standard payment processing
4. **Unified Storefront**: Single codebase for both B2C and B2B with dynamic pricing
5. **Type Safety**: Full TypeScript coverage for reliability

### 18.2. Success Metrics

```typescript
const successMetrics = {
  performance: {
    "Page Load Time": "< 2 seconds",
    "Time to Interactive": "< 3 seconds",
    "API Response Time": "< 200ms",
  },

  reliability: {
    Uptime: "> 99.9%",
    "Error Rate": "< 0.1%",
    "Payment Success Rate": "> 99%",
  },

  user_experience: {
    "Cart Abandonment": "< 30%",
    "Checkout Completion": "> 70%",
    "Mobile Usage": "> 50%",
  },
};
```

---

**Document Status**: Ready for Development  
**Next Steps**: Begin implementation following this architecture  
**Review Cycle**: Bi-weekly architecture review meetings  
**Contact**: Development Team Lead
