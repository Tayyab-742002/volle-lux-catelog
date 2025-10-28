# Phase 2: Backend Integration Guide (v1.0)

**Project:** "Volle" B2B/B2C E-commerce Platform  
**Version:** 1.0  
**Status:** Ready to Start  
**Aligned with:** Architecture.md (v1.1) | Design.md (v2.1) | PRD.md (v1.1)

---

## 1.0 Overview

### 1.1 Objective

Transition from mock data to full backend integration with Sanity CMS, Supabase, Stripe, and Resend. This phase will make the platform fully functional with real data persistence, authentication, payments, and transactional emails.

### 1.2 Integration Stack

- **Sanity CMS**: Product catalog, categories, variants, pricing tiers, static content
- **Supabase**: Authentication, user profiles, cart persistence, orders, addresses
- **Stripe**: Payment processing (hosted checkout)
- **Resend**: Transactional emails (order confirmations, invoices)

### 1.3 Prerequisites

- ✅ Phase 1 complete (all pages built with mock data)
- ✅ Service files created with TODO placeholders
- ✅ Type definitions in place
- 🔲 Backend accounts set up (Sanity, Supabase, Stripe, Resend)

---

## 2.0 Integration Phases Breakdown

### Phase 2.1: Sanity CMS Setup

**Goal:** Set up Sanity CMS and migrate product data

#### Task 2.1.1: Sanity Project Setup

- [ ] Create Sanity project
- [ ] Install Sanity Studio (`@sanity/cli`)
- [ ] Configure `sanity.config.ts`
- [ ] Set up authentication
- [ ] Configure environment variables

**Deliverables:**

- `sanity.config.ts` configured
- Sanity Studio accessible at `/admin/studio`
- Environment variables documented

#### Task 2.1.2: Define Content Schemas

- [ ] Create `lib/sanity/schemas/category.ts`
- [ ] Create `lib/sanity/schemas/product.ts`
- [ ] Create `lib/sanity/schemas/variant.ts`
- [ ] Create `lib/sanity/schemas/pricingTier.ts`
- [ ] Create `lib/sanity/schemas/index.ts` (export all schemas)

**Deliverables:**

- All product-related schemas defined
- Reference field relationships configured
- Field validation rules added

#### Task 2.1.3: Sanity Client Setup

- [ ] Create `lib/sanity/client.ts`
- [ ] Configure GROQ queries
- [ ] Set up image CDN configuration
- [ ] Create query helper functions

**Deliverables:**

- Sanity client initialized
- GROQ query functions created
- Image optimization configured

#### Task 2.1.4: Migrate Mock Data to Sanity

- [ ] Seed initial categories
- [ ] Seed initial products with variants
- [ ] Seed pricing tiers
- [ ] Upload product images to Sanity CDN

**Deliverables:**

- All mock products in Sanity CMS
- Images uploaded and optimized
- Content ready for consumption

#### Task 2.1.5: Integrate Product Service

- [ ] Update `services/products/product.service.ts`
- [ ] Replace mock data with Sanity queries
- [ ] Implement filtering and sorting
- [ ] Add error handling
- [ ] Remove TODO comments

**Deliverables:**

- Product service fully integrated
- PLP and PDP fetching real data
- Search functionality working

**Files to Modify:**

- `services/products/product.service.ts`
- `app/products/page.tsx`
- `app/products/[slug]/page.tsx`

---

### Phase 2.2: Supabase Setup

**Goal:** Set up Supabase for authentication and transactional data

#### Task 2.2.1: Supabase Project Setup

- [ ] Create Supabase project
- [ ] Install Supabase client (`@supabase/supabase-js`)
- [ ] Configure Supabase client in `lib/supabase/client.ts`
- [ ] Set up environment variables
- [ ] Configure authentication providers

**Deliverables:**

- Supabase project configured
- Client initialized
- Auth providers configured

#### Task 2.2.2: Database Schema Design

- [ ] Create `users` table (extend Supabase auth)
- [ ] Create `addresses` table
- [ ] Create `carts` table
- [ ] Create `orders` table
- [ ] Create `order_items` table
- [ ] Create `saved_addresses` table
- [ ] Define foreign key relationships
- [ ] Set up indexes for performance

**Deliverables:**

- Database schema created
- SQL migration files documented
- Table relationships mapped

#### Task 2.2.3: Row Level Security (RLS) Policies

- [ ] Enable RLS on all tables
- [ ] Create policies for `users` table
- [ ] Create policies for `addresses` table
- [ ] Create policies for `carts` table
- [ ] Create policies for `orders` table
- [ ] Test RLS policies

**Deliverables:**

- All tables secured with RLS
- Policies tested and documented
- Guest vs authenticated user access configured

#### Task 2.2.4: Authentication Integration

- [ ] Create `services/auth/auth.service.ts`
- [ ] Implement sign up
- [ ] Implement sign in
- [ ] Implement sign out
- [ ] Implement password reset
- [ ] Add session management
- [ ] Create auth context/provider

**Deliverables:**

- Authentication fully functional
- User sessions managed
- Protected routes working

**Files to Create:**

- `services/auth/auth.service.ts`
- `components/auth/auth-provider.tsx`
- `app/auth/login/page.tsx`
- `app/auth/signup/page.tsx`

#### Task 2.2.5: Cart Persistence Integration ✅ COMPLETE

- [x] Update `lib/stores/cart-store.ts`
- [x] Integrate Supabase cart storage
- [x] Sync cart between devices
- [x] Handle guest cart vs authenticated cart
- [x] Add real-time cart updates

**Deliverables:**

- [x] Cart persisted in Supabase
- [x] Multi-device sync working
- [x] Guest checkout functional

**Files to Modify:**

- `lib/stores/cart-store.ts`
- `services/cart/cart.service.ts`

#### Task 2.2.6: Order Management Integration ✅ COMPLETE

- [x] Update `services/orders/order.service.ts`
- [x] Implement order creation
- [x] Implement order history fetching
- [x] Implement order status updates
- [x] Add order tracking

**Deliverables:**

- [x] Orders stored in Supabase
- [x] Order history page functional
- [x] Order tracking working

**Files to Modify:**

- [x] `services/orders/order.service.ts`
- [x] `app/account/orders/page.tsx`
- [x] `app/account/orders/[id]/page.tsx`

#### Task 2.2.7: Address Management Integration

- [ ] Integrate saved addresses
- [ ] Implement add/edit/delete addresses
- [ ] Set default address functionality
- [ ] Connect to checkout flow

**Deliverables:**

- Address CRUD operations working
- Default address set
- Checkout using saved addresses

**Files to Modify:**

- `app/account/addresses/page.tsx`
- `services/users/user.service.ts`

---

### Phase 2.3: Stripe Integration

**Goal:** Implement secure payment processing

#### Task 2.3.1: Stripe Account Setup

- [ ] Create Stripe account
- [ ] Install Stripe SDK (`stripe`)
- [ ] Configure API keys
- [ ] Set up webhook endpoint
- [ ] Test API connection

**Deliverables:**

- Stripe account configured
- Test API working
- Webhook endpoint created

#### Task 2.3.2: Stripe Checkout Integration

- [ ] Update `app/api/checkout/route.ts`
- [ ] Initialize Stripe SDK
- [ ] Convert cart items to Stripe line items
- [ ] Create checkout session
- [ ] Handle session metadata
- [ ] Implement success/cancel redirects

**Deliverables:**

- Checkout session creation working
- Redirect to Stripe hosted page
- Success/cancel URLs configured

**Files to Modify:**

- `app/api/checkout/route.ts`
- `app/checkout/page.tsx`

#### Task 2.3.3: Webhook Handler Implementation

- [ ] Create `app/api/webhooks/stripe/route.ts`
- [ ] Implement webhook signature verification
- [ ] Handle `checkout.session.completed` event
- [ ] Handle `payment_intent.succeeded` event
- [ ] Handle `payment_intent.payment_failed` event
- [ ] Create order in Supabase on success
- [ ] Send confirmation email via Resend

**Deliverables:**

- Webhook secure and verified
- Orders created automatically
- Payment failures handled

**Files to Create:**

- `app/api/webhooks/stripe/route.ts`

#### Task 2.3.4: Order Confirmation Flow

- [ ] Update `app/checkout/success/page.tsx`
- [ ] Fetch order from Supabase using session ID
- [ ] Display order summary
- [ ] Clear cart after successful payment
- [ ] Trigger email confirmation

**Deliverables:**

- Success page shows real order data
- Cart cleared after payment
- Email sent automatically

**Files to Modify:**

- `app/checkout/success/page.tsx`

---

### Phase 2.4: Resend Email Integration

**Goal:** Implement transactional emails

#### Task 2.4.1: Resend Account Setup

- [ ] Create Resend account
- [ ] Install Resend SDK (`resend`)
- [ ] Configure API key
- [ ] Verify domain (optional for production)
- [ ] Create email templates

**Deliverables:**

- Resend configured
- Email templates created
- Sending domain verified

#### Task 2.4.2: Order Confirmation Email

- [ ] Create email template component
- [ ] Implement order confirmation email
- [ ] Include order details and summary
- [ ] Add tracking link
- [ ] Send email after successful payment

**Deliverables:**

- Order confirmation emails working
- Professional email design
- All order details included

**Files to Create:**

- `lib/emails/order-confirmation.tsx`
- `services/emails/email.service.ts`

#### Task 2.4.3: Contact Form Email

- [ ] Update `app/contact/page.tsx`
- [ ] Integrate Resend API
- [ ] Send contact form submissions
- [ ] Add success/error handling

**Deliverables:**

- Contact form emails working
- Form submission handled

**Files to Modify:**

- `app/contact/page.tsx`
- `app/api/contact/route.ts` (create if needed)

#### Task 2.4.4: Invoice PDF Generation

- [ ] Install PDF library (`pdfkit` or `@react-pdf/renderer`)
- [ ] Create invoice template
- [ ] Generate PDF for orders
- [ ] Implement download functionality
- [ ] Add invoice link to order details

**Deliverables:**

- PDF invoices generated
- Download working from order details

**Files to Create:**

- `lib/pdf/invoice-template.tsx`
- `app/api/invoices/[orderId]/route.ts`

---

### Phase 2.5: Testing & Refinement

**Goal:** Ensure all integrations work smoothly together

#### Task 2.5.1: End-to-End Testing

- [ ] Test complete purchase flow
- [ ] Test guest checkout
- [ ] Test authenticated checkout
- [ ] Test payment failures
- [ ] Test email delivery
- [ ] Test multi-device cart sync

**Deliverables:**

- All critical paths tested
- Issues documented
- Test results compiled

#### Task 2.5.2: Error Handling & Edge Cases

- [ ] Add error boundaries
- [ ] Handle network failures gracefully
- [ ] Handle authentication errors
- [ ] Handle payment errors
- [ ] Add loading states
- [ ] Add empty states

**Deliverables:**

- Robust error handling
- User-friendly error messages
- Loading states implemented

#### Task 2.5.3: Performance Optimization

- [ ] Optimize Sanity queries
- [ ] Add caching strategies
- [ ] Optimize images (Sanity CDN)
- [ ] Add database indexes
- [ ] Run Lighthouse audit
- [ ] Fix performance issues

**Deliverables:**

- Fast page load times
- Optimized queries
- High Lighthouse scores

#### Task 2.5.4: Security Audit

- [ ] Review RLS policies
- [ ] Test authentication flows
- [ ] Verify webhook security
- [ ] Check for exposed secrets
- [ ] Cancello DDoS protections
- [ ] Review SQL injection prevention

**Deliverables:**

- Security vulnerabilities fixed
- Best practices implemented
- Security audit passed

---

## 3.0 Integration Order & Dependencies

### Recommended Sequence

```
1. Sanity CMS Setup (2.1)
   └─> Product Service Integration

2. Supabase Setup (2.2)
   ├─> Authentication
   ├─> Cart Persistence
   └─> Order Management

3. Stripe Integration (2.3)
   └─> Depends on: Cart & Orders

4. Resend Email Integration (2.4)
   └─> Depends on: Orders

5. Testing & Refinement (2.5)
   └─> All integrations
```

### Critical Path

**Must complete in order:**

1. Sanity → Products display with real data
2. Supabase Auth → User accounts working
3. Supabase Cart → Cart persistence
4. Stripe → Payments processing
5. Resend → Transactional emails

---

## 4.0 Environment Variables Checklist

### Required Variables

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

---

## 5.0 Success Criteria

### Phase 2 Complete When:

- [ ] All products fetched from Sanity CMS
- [ ] User authentication working (sign up, login, logout)
- [ ] Cart persisted across sessions and devices
- [ ] Orders created in Supabase after checkout
- [ ] Stripe payments processing successfully
- [ ] Email confirmations sent automatically
- [ ] Invoice PDFs downloadable
- [ ] All TODO comments removed from service files
- [ ] Error handling in place
- [ ] Performance targets met
- [ ] Security audit passed

---

## 6.0 Post-Integration Tasks

### Phase 3: Admin Dashboard (Future)

- [ ] Sanity Studio for content management
- [ ] Next.js admin dashboard for orders
- [ ] Order status management
- [ ] User management
- [ ] Custom quote approval system
- [ ] CSV export functionality

### Phase 4: Advanced Features (Future)

- [ ] Real-time inventory updates
- [ ] Product recommendations
- [ ] Customer reviews
- [ ] Wishlist functionality
- [ ] Multi-currency support
- [ ] International shipping

---

## 7.0 Resources & Documentation

### Documentation Links

- **Sanity CMS**: https://www.sanity.io/docs
- **Supabase**: https://supabase.com/docs
- **Stripe**: https://stripe.com/docs
- **Resend**: https://resend.com/docs
- **Next.js**: https://nextjs.org/docs

### Internal Documentation

- **Architecture.md**: Technical structure and patterns
- **Design.md**: UI/UX specifications
- **PRD.md**: Functional requirements

---

## 8.0 Notes

- Estimate completion time: **10-14 days** (with proper testing)
- Start with Sanity CMS as it's independent
- Supabase can be set up in parallel with Sanity
- Stripe depends on Supabase orders being ready
- Resend depends on orders being created
- Testing phase is critical - don't skip it

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Next Review:** After Phase 2 completion
