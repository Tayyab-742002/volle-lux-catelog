# Admin Dashboard Setup Instructions

## 🎯 Overview

This document provides step-by-step instructions to set up the admin dashboard for the Volle Lux Catalog e-commerce platform.

---

## ✅ Completed Setup

1. ✅ Sanity Studio route renamed from `/admin-dashboard` to `/studio`
2. ✅ Admin dashboard plan created (`ADMIN_DASHBOARD_PLAN.md`)
3. ✅ Database migration created for admin roles (`010_add_admin_role.sql`)

---

## 🚀 Next Steps

### Step 1: Run Database Migration

**Location:** `supabase/migrations/010_add_admin_role.sql`

This migration will:

- Create `user_role` enum type (customer/admin)
- Add `role` field to `users` table with enum constraint
- Create helper functions for admin checks
- Set up proper indexes

**Run in Supabase SQL Editor:**

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/010_add_admin_role.sql`
4. Paste and execute

**To make your first admin user:**

After running the migration, execute this SQL:

```sql
-- Replace with your actual email
SELECT make_user_admin('your-email@example.com');
```

---

### Step 2: Verify Migration

Check if the role field was added:

```sql
-- Check table structure
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users';

-- Check if admin function exists
SELECT routine_name
FROM information_schema.routines
WHERE routine_name = 'is_admin';
```

---

### Step 3: Create Admin Middleware

**File to create:** `middleware.admin.ts` (or update existing middleware)

Check admin role before allowing access to `/admin/*` routes.

**Basic implementation:**

```typescript
// middleware.ts - add this check
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  // ... existing auth logic ...

  // Check admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const supabase = await createServerSupabaseClient();

    // Get user role
    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("id", user?.id)
      .single();

    if (data?.role !== "admin") {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  // ... rest of middleware ...
}
```

---

### Step 4: Create Admin Dashboard Structure

Create the following directory structure:

```
app/
├── admin/
│   ├── layout.tsx              # Admin layout with sidebar
│   ├── page.tsx                # Dashboard overview
│   ├── orders/
│   │   ├── page.tsx            # Orders list
│   │   └── [id]/
│   │       └── page.tsx        # Order details
│   ├── customers/
│   │   ├── page.tsx            # Customers list
│   │   └── [id]/
│   │       └── page.tsx        # Customer details
│   └── analytics/
│       └── page.tsx            # Analytics dashboard
```

---

### Step 5: Build Admin Services

Create admin-specific service functions:

```typescript
// services/admin/order.service.ts
export async function getAllOrders(filters?) {
  // Fetch orders with service role client
}

export async function updateOrderStatus(orderId, newStatus) {
  // Update order status
}

// services/admin/customer.service.ts
export async function getAllCustomers() {
  // Fetch all customers
}

// services/admin/analytics.service.ts
export async function getSalesMetrics() {
  // Calculate sales metrics
}
```

---

## 📋 Development Priority

### Phase 1: Core (Essential)

1. Admin authentication & middleware
2. Orders list with filters
3. Order detail view
4. Update order status
5. Basic dashboard stats

### Phase 2: Enhanced (High Value)

6. Customers management
7. Analytics dashboard
8. CSV export
9. Email notifications

### Phase 3: Advanced (Nice to Have)

10. Advanced analytics
11. Quote management
12. Bulk operations

---

## 🔐 Security Notes

- Always use service role client for admin operations
- Validate admin role in middleware before allowing access
- Use RLS policies appropriately (service role bypasses RLS)
- Log sensitive admin actions for audit trail

---

## 📝 Key Files Reference

- **Plan:** `ADMIN_DASHBOARD_PLAN.md` - Complete requirements
- **Migration:** `supabase/migrations/010_add_admin_role.sql` - Database setup
- **Studio:** `app/studio/` - Sanity CMS (product/category management)
- **Admin:** `app/admin/` - Custom dashboard (orders/customers/analytics)

---

## 🎯 Key Differences: Studio vs Admin Dashboard

### Sanity Studio (`/studio`)

- Product catalog management
- Category creation/editing
- Product images
- Variants and pricing tiers
- Content editing

### Admin Dashboard (`/admin`)

- Orders & Fulfillment
- Customer management
- Analytics & Reports
- System settings

---

**Ready to start building! Follow the Phase 1 priority list for the fastest path to a working admin dashboard.**
