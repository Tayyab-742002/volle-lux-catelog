# Custom Admin Dashboard - Requirements & Plan

## 📊 Overview

Since we're using **Sanity Studio** for product/category content management, the custom admin dashboard will focus on **transactional data and operational management** stored in Supabase.

---

## 🎯 Purpose

The custom admin dashboard will manage:

- **Orders & Fulfillment** (Primary focus)
- **Customer Data**
- **Analytics & Reports**
- **Quote Requests** (Custom orders)
- **System Operations**

Sanity Studio handles:

- ✅ Product catalog management
- ✅ Category creation/editing
- ✅ Product images
- ✅ Variants and pricing tiers
- ✅ Content editing

---

## 📋 Admin Dashboard Modules

### 1. 📦 Orders Management (PRIMARY)

**Location:** `/admin/orders`

#### Dashboard View

- **Overview Stats:**
  - Total orders (all time)
  - Pending orders (needs action)
  - Revenue (today, week, month)
  - Average order value
  - Orders by status chart

#### Orders List

- **Table Columns:**
  - Order # (unique identifier)
  - Date
  - Customer (Name, Email)
  - Items (quantity count)
  - Total Amount
  - Status (pending/processing/shipped/delivered/cancelled)
  - Payment Status
  - Actions (View, Update Status)

- **Filters:**
  - Status filter
  - Date range
  - Payment status
  - Customer search

- **Sorting:**
  - Newest first (default)
  - Oldest first
  - Highest value
  - Lowest value

#### Order Detail View

- **Order Information:**
  - Order ID, Date, Status
  - Customer Details (Name, Email, Phone)
  - Payment Information (Stripe transaction ID)
- **Shipping Address:**
  - Full address display
  - Tracking number (editable)
  - Tracking URL (editable)

- **Order Items:**
  - Product details
  - Variant information
  - Quantity, Unit Price, Total
  - Pricing tier applied

- **Financial Summary:**
  - Subtotal
  - Discount
  - Shipping
  - Tax
  - Total

- **Actions:**
  - ✅ Update Status (dropdown)
  - 📝 Add tracking number
  - 🔗 View Stripe payment details
  - 📧 Send shipping notification email
  - 📄 Download/Print invoice
  - 🗑️ Cancel order (with reason)
  - 💬 Add admin notes

#### Status Workflow

```
pending → processing → shipped → delivered
                             ↘ cancelled
```

**Status Update Modal:**

- Select new status
- Add tracking number (if shipping)
- Add admin notes
- Send email notification (optional)

---

### 2. 👥 Customers Management

**Location:** `/admin/customers`

#### Customers List

- **Table Columns:**
  - Name
  - Email
  - Phone
  - Total Orders
  - Total Spent
  - Last Order Date
  - Account Status
  - Actions (View, Edit)

- **Filters:**
  - Search by name/email
  - Total orders range
  - Account status
  - Date joined

#### Customer Detail View

- **Profile Information:**
  - Name, Email, Phone, Company
  - Account created date
  - Last login date

- **Order History:**
  - List of all orders
  - Order details link
  - Total lifetime value

- **Addresses:**
  - Saved shipping addresses
  - Saved billing addresses

- **Actions:**
  - 📧 Send email
  - 📝 Edit customer info
  - 🔒 Suspend/Activate account
  - 📊 View analytics

---

### 3. 💰 Analytics & Reports

**Location:** `/admin/analytics`

#### Dashboard Overview

- **Sales Metrics:**
  - Total Revenue (Today, Week, Month, Year)
  - Average Order Value
  - Orders Count
  - Conversion Rate

- **Revenue Chart:**
  - Line chart (daily/weekly/monthly)
  - Compare periods

- **Top Products:**
  - Best selling products
  - Revenue by product

- **Customer Insights:**
  - New customers (period)
  - Returning customers
  - Customer lifetime value

#### Reports Export

- **CSV Export Options:**
  - All orders (date range)
  - Orders by status
  - Orders by customer
  - Products sold
  - Revenue report

---

### 4. 💬 Quote Requests (Future)

**Location:** `/admin/quotes`

For custom/large quantity orders requiring manual pricing

#### Quote List

- **Table Columns:**
  - Request #, Date
  - Customer
  - Products/Description
  - Quantity
  - Status (pending/reviewing/approved/rejected)
  - Actions

#### Quote Detail

- Request details
- Approved/Reject workflow
- Send quote email
- Convert to order

---

### 5. ⚙️ System Settings

**Location:** `/admin/settings`

- **Store Settings:**
  - Store name, email, phone
  - Business address
  - Tax settings

- **Shipping Settings:**
  - Default shipping cost
  - Free shipping threshold
  - Shipping zones

- **Email Settings:**
  - Notification preferences
  - Email templates

- **Integrations:**
  - Stripe status
  - Supabase status
  - Sanity status

---

## 🔐 Authentication & Access Control

### Database Setup Required

**Migration:** `010_add_admin_role.sql`

- Create `user_role` enum type (customer/admin)
- Add `role` field to `users` table with enum constraint
- Create `is_admin(user_id)` helper function
- Create `make_user_admin(email)` helper function

### Admin Access

- **Protected Route:** `/admin/*`
- **Middleware:** Check for admin role in Supabase
- **User Roles:**
  - `customer` - Regular customer (default)
  - `admin` - Full admin access

### Admin User Management

**Location:** `/admin/users`

- List of admin users
- Add/Remove admins
- Promote customers to admin (if needed)

---

## 🎨 UI/UX Design

### Design System

- Follow existing design: "Immersive Minimalism"
- Use Shadcn UI components
- Tailwind CSS v4 for styling
- Consistent with Sanity Studio style

### Layout Structure

```
┌─────────────────────────────────────┐
│  Header: Volle Admin | Logo | User  │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │  Main Content Area       │
│          │                          │
│ - Orders │  - Data tables           │
│ - Customers│ - Charts & graphs      │
│ - Analytics│ - Forms                │
│ - Settings│                         │
│          │                          │
└──────────┴──────────────────────────┘
```

### Key Components Needed

- AdminLayout (with sidebar)
- DataTable (sortable, filterable)
- StatusBadge (order status)
- Chart components (recharts/chart.js)
- ExportButton (CSV export)
- Modal/Dialog (status updates)
- SearchBar
- DateRangePicker
- StatsCards

---

## 📁 Implementation Structure

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
│   ├── analytics/
│   │   └── page.tsx            # Analytics dashboard
│   └── settings/
│       └── page.tsx            # System settings
│
components/
├── admin/
│   ├── admin-layout.tsx        # Layout with sidebar
│   ├── admin-sidebar.tsx       # Navigation
│   ├── stats-card.tsx          # Metric cards
│   ├── orders-table.tsx        # Orders data table
│   ├── order-detail.tsx        # Order detail view
│   ├── status-badge.tsx        # Status indicators
│   ├── customer-table.tsx      # Customers table
│   ├── analytics-chart.tsx     # Revenue charts
│   └── export-button.tsx       # CSV export
│
services/
├── admin/
│   ├── order.service.ts        # Admin order operations
│   ├── customer.service.ts     # Customer data
│   └── analytics.service.ts    # Analytics queries
```

---

## 🔄 API Endpoints Needed

### Orders

- `GET /api/admin/orders` - List all orders (with filters)
- `GET /api/admin/orders/[id]` - Get order details
- `PATCH /api/admin/orders/[id]` - Update order status
- `POST /api/admin/orders/export` - Export CSV

### Customers

- `GET /api/admin/customers` - List customers
- `GET /api/admin/customers/[id]` - Get customer details
- `GET /api/admin/customers/[id]/orders` - Get customer orders

### Analytics

- `GET /api/admin/analytics/sales` - Sales metrics
- `GET /api/admin/analytics/revenue` - Revenue data
- `GET /api/admin/analytics/products` - Product analytics

---

## 📊 Data Sources

### Supabase Tables Used

1. **orders** - Main order data
2. **users** - Customer profiles (role: user_role enum - customer/admin)
3. **saved_addresses** - Customer addresses
4. **carts** - Active/inactive carts (analytics)

### Helper Functions

- `is_admin(user_id)` - Check if user has admin role
- `make_user_admin(email)` - Promote user to admin

### Aggregations Needed

- Order counts by status
- Revenue totals by date
- Average order value
- Top products
- Customer lifetime value

---

## 🚀 Development Priority

### Phase 1: Core (Essential)

1. ✅ Admin authentication & middleware
2. ✅ Orders list with filters
3. ✅ Order detail view
4. ✅ Update order status
5. ✅ Basic dashboard stats

### Phase 2: Enhanced (High Value)

6. ✅ Customers management
7. ✅ Analytics dashboard
8. ✅ CSV export
9. ✅ Email notifications

### Phase 3: Advanced (Nice to Have)

10. ✅ Advanced analytics
11. ✅ Quote management
12. ✅ Bulk operations
13. ✅ Custom reports

---

## 🛡️ Security Considerations

- Admin-only routes (middleware protection)
- Service role client for database access
- Input validation (Zod schemas)
- Rate limiting on API routes
- Audit logs for sensitive actions
- CSRF protection

---

## 📝 Next Steps

1. Set up admin authentication middleware
2. Create admin layout with sidebar
3. Build orders management module
4. Add analytics dashboard
5. Implement customer management
6. Add CSV export functionality

---

**This custom admin dashboard complements Sanity Studio by focusing on operational data that Sanity doesn't manage.**
