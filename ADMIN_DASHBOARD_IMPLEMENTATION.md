# Admin Dashboard Implementation Roadmap

**Created:** January 2025  
**Status:** Phase 2 Core Features Complete ✅  
**Reference:** ADMIN_DASHBOARD_PLAN.md

---

## 🎯 Overview

This document breaks down the admin dashboard implementation into small, manageable tasks that can be completed one by one. Each task is designed to be independent and testable.

---

## 📋 Implementation Phases

### Phase 1: Foundation (Must Have)

**Goal:** Get the basic admin dashboard structure working

### Phase 2: Core Features (High Value)

**Goal:** Essential admin functionality

### Phase 3: Enhanced Features (Nice to Have)

**Goal:** Advanced features and polish

---

## 🏗️ PHASE 1: Foundation

### Task 1.1: Database Migration ✅

**Status:** ✅ COMPLETED

- [x] Create migration file `010_add_admin_role.sql`
- [x] Create `user_role` enum type
- [x] Add `role` column to users table
- [x] Create helper functions (`is_admin`, `make_user_admin`)
- [x] Test migration in Supabase

**Files:**

- `supabase/migrations/010_add_admin_role.sql` ✅

---

### Task 1.2: Admin Authentication Utilities

**Status:** ✅ COMPLETED

**Goal:** Create helper functions to check admin status

**Tasks:**

- [x] Create `lib/utils/admin-auth.ts`
- [x] Add `isAdmin(userId)` function
- [x] Add `getAdminUser(session)` function
- [x] Add `getCurrentAdminUser()` function
- [x] Add proper error handling and TypeScript types

**Files:**

```
lib/
└── utils/
    └── admin-auth.ts          # Admin auth helpers ✅
lib/
└── supabase/
    └── client.ts              # Updated Database types ✅
```

**Acceptance Criteria:**

- ✅ Can check if a user is admin
- ✅ Returns proper TypeScript types
- ✅ Handles errors gracefully
- ✅ Uses database `is_admin()` RPC function for performance
- ✅ Fallback to direct query if RPC fails

---

### Task 1.3: Update Middleware for Admin Routes

**Status:** ✅ COMPLETED

**Goal:** Protect `/admin/*` routes with admin check

**Tasks:**

- [x] Update `middleware.ts` to check admin role
- [x] Add admin route protection logic
- [x] Redirect non-admins to home page
- [x] Handle edge cases (not logged in, etc.)

**Files:**

```
middleware.ts                  # Add admin check ✅
```

**Acceptance Criteria:**

- ✅ `/admin/*` routes are protected
- ✅ Non-admins redirected to home
- ✅ Admins can access all admin routes
- ✅ Works with existing auth middleware
- ✅ Uses efficient RPC function for admin check
- ✅ Fallback mechanism for reliability

---

### Task 1.4: Create Admin Layout Component

**Status:** ✅ COMPLETED

**Goal:** Basic admin layout with sidebar navigation

**Tasks:**

- [x] Create `components/admin/admin-layout.tsx`
- [x] Create sidebar with navigation items
- [x] Add header with admin branding
- [x] Style with Tailwind CSS
- [x] Make it responsive

**Files:**

```
components/
└── admin/
    ├── admin-layout.tsx       # Main layout ✅
    ├── admin-sidebar.tsx      # Sidebar navigation ✅
    └── index.ts               # Exports ✅
```

**Navigation Items:**

- Dashboard
- Orders
- Customers
- Analytics
- Settings
- Studio (link to /studio - external)
- Back to Store
- Sign Out

**Acceptance Criteria:**

- ✅ Sidebar navigation works
- ✅ Responsive design (mobile/desktop)
- ✅ Active route highlighting
- ✅ Clean, professional design

---

### Task 1.5: Create Admin Dashboard Page Structure

**Status:** ✅ COMPLETED

**Goal:** Set up basic admin pages structure

**Tasks:**

- [x] Create `app/admin/layout.tsx`
- [x] Create `app/admin/page.tsx` (dashboard home)
- [x] Create placeholder pages for each section
- [x] Wire up routing

**Files:**

```
app/
└── admin/
    ├── layout.tsx             # Use AdminLayout component ✅
    ├── page.tsx               # Dashboard home ✅
    ├── orders/
    │   └── page.tsx           # Orders list (placeholder) ✅
    ├── customers/
    │   └── page.tsx           # Customers list (placeholder) ✅
    ├── analytics/
    │   └── page.tsx           # Analytics (placeholder) ✅
    └── settings/
        └── page.tsx           # Settings (placeholder) ✅
```

**Acceptance Criteria:**

- ✅ All routes accessible from sidebar
- ✅ Placeholder content on each page
- ✅ No errors in console

---

### Task 1.6: Create Stats Cards Component

**Status:** ✅ COMPLETED

**Goal:** Reusable stat card component for dashboard metrics

**Tasks:**

- [x] Create `components/admin/stats-card.tsx`
- [x] Add props: title, value, change, icon
- [x] Style with Shadcn UI Card
- [x] Make it reusable

**Files:**

```
components/
└── admin/
    └── stats-card.tsx         # Stat card component ✅
```

**Props Interface:**

```typescript
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: { value: number; type: "increase" | "decrease" };
  icon?: React.ReactNode;
  className?: string;
}
```

**Acceptance Criteria:**

- ✅ Displays title, value, optional change
- ✅ Shows icon if provided
- ✅ Responsive layout
- ✅ Matches design system

---

## 📦 PHASE 2: Core Features

### Task 2.1: Create Admin Order Service

**Status:** ✅ COMPLETED

**Goal:** Backend logic for fetching/administering orders

**Tasks:**

- [x] Create `services/admin/order.service.ts`
- [x] Add `getAllOrders(filters)` function
- [x] Add `getOrderById(id)` function
- [x] Add `updateOrderStatus(id, status)` function
- [x] Add `getOrderStats()` function
- [x] Use Supabase service role client
- [x] Add proper TypeScript types
- [x] Add error handling

**Files:**

```
services/
└── admin/
    ├── order.service.ts       # Admin order operations ✅
    └── index.ts               # Exports ✅
```

**Functions:**

- ✅ `getAllOrders(filters)` - List all orders with filters, pagination, sorting
- ✅ `getOrderById(id)` - Get single order with full details
- ✅ `updateOrderStatus(id, status)` - Update order status with tracking info
- ✅ `getOrderStats()` - Get order statistics for dashboard
- ✅ Proper TypeScript types (OrderFilters, AdminOrder, OrderListResponse)
- ✅ Comprehensive error handling

**Acceptance Criteria:**

- ✅ Can fetch all orders with filtering
- ✅ Can filter by status, date range, search
- ✅ Can update order status with tracking
- ✅ TypeScript types are correct
- ✅ Errors handled properly
- ✅ Service role client for admin access
- ✅ Pagination and sorting support
- ✅ Dashboard statistics function

---

### Task 2.2: Create Orders API Route

**Status:** ✅ COMPLETED

**Goal:** API endpoint to fetch orders for admin

**Tasks:**

- [x] Create `app/api/admin/orders/route.ts`
- [x] Add GET handler to fetch all orders
- [x] Add PATCH handler to update orders
- [x] Add admin authentication check
- [x] Add query params for filtering
- [x] Proper error handling and validation

**Files:**

```
app/
└── api/
    └── admin/
        └── orders/
            └── route.ts       # Orders API endpoint ✅
```

**Endpoints:**

- ✅ `GET /api/admin/orders` - List all orders with filters
- ✅ `GET /api/admin/orders?id=xxx` - Get single order
- ✅ `PATCH /api/admin/orders` - Update order status/tracking
- ✅ Proper 401/403/404/500 error responses
- ✅ Method validation (405 for POST/DELETE)

**Acceptance Criteria:**

- ✅ API returns orders data with pagination
- ✅ Supports filtering (status, date, search) and sorting
- ✅ Requires admin authentication (401/403)
- ✅ Proper error responses with messages
- ✅ Input validation for status updates
- ✅ Type-safe query parameter handling

---

### Task 2.3: Create Orders Table Component

**Status:** ✅ COMPLETED

**Goal:** Display orders in a sortable, filterable table

**Tasks:**

- [x] Create `components/admin/orders-table.tsx`
- [x] Add columns: Order #, Date, Customer, Total, Status, Actions
- [x] Implement sorting functionality
- [x] Add search filtering
- [x] Add status filter
- [x] Style with Tailwind CSS table
- [x] Connect to API
- [x] Add loading states
- [x] Add empty states

**Files:**

```
components/
└── admin/
    ├── orders-table.tsx       # Orders table component ✅
    └── index.ts               # Updated exports ✅
app/
└── admin/
    └── orders/
        └── page.tsx           # Connected to table ✅
```

**Features:**

- ✅ Sortable columns (Order #, Date, Total, Status)
- ✅ Status filter dropdown
- ✅ Search by order number, email, customer name
- ✅ Actions dropdown with view details
- ✅ Loading spinner
- ✅ Empty states (no orders, no results)
- ✅ Responsive table design
- ✅ Status badges with colors
- ✅ Clickable order numbers to details page

**Acceptance Criteria:**

- ✅ Table displays orders from API
- ✅ Can sort by columns with visual indicators
- ✅ Can filter by status
- ✅ Can search orders
- ✅ Responsive design with overflow handling
- ✅ Loading states with spinner
- ✅ Empty states for no data

---

### Task 2.4: Create Order Detail Page

**Status:** ✅ COMPLETED

**Goal:** View and manage individual orders

**Tasks:**

- [x] Create `app/admin/orders/[id]/page.tsx`
- [x] Display full order information
- [x] Add status update form
- [x] Display customer info
- [x] Display order items
- [x] Add tracking number input
- [x] Add admin notes
- [x] Connect to API

**Files:**

```
app/
└── admin/
    └── orders/
        └── [id]/
            └── page.tsx       # Order detail page ✅
types/
└── cart.ts                    # Updated types ✅
```

**Data Displayed:**

- ✅ Order number, date, status with badges
- ✅ Customer details (name, email, phone)
- ✅ Shipping address (full address with optional fields)
- ✅ Order items (with images, variants, quantities)
- ✅ Payment info (Stripe payment intent link)
- ✅ Financial summary (subtotal, discount, shipping, total)
- ✅ Tracking information (if available)

**Actions:**

- ✅ Update status dropdown with all statuses
- ✅ Add/edit tracking number
- ✅ Add admin notes
- ✅ View Stripe payment (button)
- ✅ Download invoice button
- ✅ Save changes with loading state
- ✅ Detect and highlight changes

**Acceptance Criteria:**

- ✅ All order info displayed in readable layout
- ✅ Can update order status with dropdown
- ✅ Clean, professional layout with grid
- ✅ Proper error handling and loading states
- ✅ Form validation and change detection
- ✅ Responsive design

---

### Task 2.5: Create Status Badge Component

**Status:** ✅ COMPLETED

**Goal:** Visual indicator for order status

**Tasks:**

- [x] Create `components/admin/status-badge.tsx`
- [x] Map status to color scheme
- [x] Add variants for each status
- [x] Make it reusable
- [x] Update all components to use it

**Files:**

```
components/
└── admin/
    ├── status-badge.tsx       # Status badge component ✅
    └── index.ts               # Added export ✅
components/admin/
├── orders-table.tsx           # Updated to use StatusBadge ✅
app/admin/orders/[id]/
└── page.tsx                   # Updated to use StatusBadge ✅
```

**Status Variants:**

- ✅ pending (default - gray)
- ✅ processing (secondary - blue)
- ✅ shipped (outline - yellow)
- ✅ delivered (outline green - green text)
- ✅ cancelled (destructive - red)

**Acceptance Criteria:**

- ✅ Shows correct color for each status
- ✅ Responsive and accessible
- ✅ Matches design system (Shadcn Badge)
- ✅ Reusable across all admin components
- ✅ Type-safe with OrderStatus type

---

### Task 2.6: Implement Order Status Update

**Status:** ✅ ALREADY COMPLETE

**Goal:** Allow admins to update order status

**Note:** This functionality was already implemented in Task 2.4 (Order Detail Page) as part of the comprehensive order management interface.

**Completed Features:**

- ✅ Status update form with dropdown
- ✅ Tracking number input field
- ✅ Admin notes textarea
- ✅ API integration for updates
- ✅ Success/error feedback
- ✅ Loading states
- ✅ Change detection

**Location:**

- `app/admin/orders/[id]/page.tsx` - Full status update implementation

---

### Task 2.7: Create Dashboard Overview Page

**Status:** ✅ COMPLETED

**Goal:** Show key metrics on admin dashboard home

**Tasks:**

- [x] Update `app/admin/page.tsx`
- [x] Add stats cards for key metrics
- [x] Create API route to fetch metrics
- [x] Integrate with existing order service

**Files:**

```
app/
├── admin/
│   └── page.tsx               # Dashboard overview ✅
└── api/
    └── admin/
        └── stats/
            └── route.ts       # Stats API ✅
services/
└── admin/
    └── order.service.ts       # getOrderStats() already exists ✅
```

**Metrics Displayed:**

- ✅ Total Orders (with icon)
- ✅ Pending Orders (with icon)
- ✅ Today's Revenue (formatted currency)
- ✅ Average Order Value (formatted currency)
- ✅ Quick action cards (pending, processing, all orders)
- ✅ Status summary grid (delivered, shipped, processing, cancelled)

**Acceptance Criteria:**

- ✅ Stats cards displayed in responsive grid
- ✅ Loading states with skeleton loaders
- ✅ Error states with retry button
- ✅ Clean, professional design
- ✅ API caching for performance (60s)
- ✅ Clickable quick actions to filtered views
- ✅ Comprehensive status summary

---

## 📊 PHASE 3: Enhanced Features

### Task 3.1: Create Customer Management

**Status:** ✅ COMPLETED

**Goal:** View and manage customer data

**Tasks:**

- [x] Create customer service
- [x] Create customers API route
- [x] Create customers table component
- [x] Create customer detail page
- [x] Add search and filtering
- [x] Add sorting functionality

**Files:**

```
services/admin/
├── customer.service.ts        # Customer operations ✅
└── index.ts                   # Updated exports ✅
app/
├── api/admin/
│   └── customers/
│       └── route.ts           # Customers API ✅
├── admin/customers/
│   ├── page.tsx               # Customers list ✅
│   └── [id]/
│       └── page.tsx           # Customer detail ✅
components/admin/
├── customer-table.tsx         # Customer table ✅
└── index.ts                   # Updated exports ✅
```

**Features:**

- ✅ Customer list with search
- ✅ Sortable columns (email, joined date, total spent)
- ✅ Customer statistics (total orders, total spent, last order)
- ✅ Customer detail page with full info
- ✅ Quick actions (view orders, send email)
- ✅ Avatar display (with fallback)
- ✅ Loading and error states

---

### Task 3.2: Implement Analytics Dashboard

**Status:** ✅ COMPLETED

**Goal:** Show sales analytics and charts

**Tasks:**

- [x] Create analytics service
- [x] Add revenue chart with time range selector
- [x] Add orders status pie chart
- [x] Add top products list
- [x] Add analytics API route
- [x] Install and configure Recharts

**Files:**

```
services/admin/
├── analytics.service.ts        # Analytics operations ✅
└── index.ts                   # Updated exports ✅
app/
├── api/admin/
│   └── analytics/
│       └── route.ts           # Analytics API ✅
├── admin/analytics/
│   └── page.tsx               # Analytics dashboard ✅
components/admin/
├── revenue-chart.tsx          # Revenue/orders line chart ✅
├── orders-status-chart.tsx    # Status pie chart ✅
├── top-products-list.tsx      # Top products list ✅
└── index.ts                   # Updated exports ✅
```

**Features:**

- ✅ Revenue & Orders line chart (7d, 30d, 90d, all time)
- ✅ Orders by status pie chart (pending, processing, shipped, delivered, cancelled)
- ✅ Top products list (quantity sold, revenue)
- ✅ Responsive grid layout
- ✅ Loading states for all charts
- ✅ Empty states with helpful messages
- ✅ API caching (300s with stale-while-revalidate 600s)

---

### Task 3.3: CSV Export Functionality

**Status:** ✅ COMPLETED

**Goal:** Export orders data as CSV

**Tasks:**

- [x] Create CSV export utility
- [x] Add export button to orders page
- [x] Create export API endpoint
- [x] Support filtering by status

**Files:**

```
lib/utils/
└── csv-export.ts              # CSV formatting helpers ✅
app/api/admin/orders/
└── export/
    └── route.ts               # Export API endpoint ✅
components/admin/
├── export-button.tsx          # Export button component ✅
└── index.ts                   # Updated exports ✅
app/admin/orders/
└── page.tsx                   # Updated with export button ✅
```

**Features:**

- ✅ CSV export with proper formatting and escaping
- ✅ All order fields exported (number, date, customer, email, status, total, items, address, tracking)
- ✅ Respects status filter when applied
- ✅ Automatic file download with timestamp in filename
- ✅ Proper CSV field escaping (commas, quotes, newlines)
- ✅ Loading state during export

---

## 🎯 Quick Start: Next 3 Tasks

Start with these tasks in order:

1. **Task 1.2**: Admin Authentication Utilities
2. **Task 1.3**: Update Middleware for Admin Routes
3. **Task 1.4**: Create Admin Layout Component

These will get you to a working, protected admin dashboard with basic navigation.

---

## 📝 Task Template

Use this template when working on each task:

```markdown
### Task X.X: [Task Name]

**Status:** 🚧 TODO / ✅ COMPLETED

**Goal:** [One sentence goal]

**Tasks:**

- [ ] Subtask 1
- [ ] Subtask 2
- [ ] Subtask 3

**Files:**

- File path 1
- File path 2

**Acceptance Criteria:**

- Criterion 1
- Criterion 2
- Criterion 3

**Notes:**

- Any special considerations
- Dependencies on other tasks
```

---

## 🚀 Getting Started Checklist

Before starting development:

- [ ] Database migration `010_add_admin_role.sql` has been run
- [ ] You have promoted your first admin user: `SELECT make_user_admin('your-email@example.com');`
- [ ] You understand the codebase structure
- [ ] You have read ADMIN_DASHBOARD_PLAN.md

---

**Ready to start with Task 1.2? Ask me when you're ready to implement the next task!**
