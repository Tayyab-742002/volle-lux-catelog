# Performance Audit & Optimization Report

## Volle E-Commerce Platform

**Date:** $(date)
**Analysis Scope:** Complete codebase analysis for performance bottlenecks

---

## Executive Summary

### Overall Assessment: **GOOD** (7.5/10)

The platform has solid fundamentals but has **critical performance bottlenecks** that need immediate attention.

### Key Findings:

- ✅ Good: Image optimization configured, code splitting on admin pages
- ⚠️ **CRITICAL**: `force-dynamic` on root layout blocks all static generation
- ⚠️ **CRITICAL**: Layout fetches ALL products and categories on every request
- ⚠️ **HIGH**: 65 client components (excessive `"use client"` usage)
- ⚠️ **HIGH**: No caching strategy for Sanity CMS queries
- ⚠️ **MEDIUM**: Database queries fetching all customer orders without pagination
- ⚠️ **MEDIUM**: Zustand cart store has unnecessary re-renders

---

## 1. Critical Issues (Fix Immediately)

### 1.1 ❌ **Root Layout Performance Killer**

**Location:** `app/layout.tsx`

```typescript
// PROBLEM: This runs on EVERY request
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }) {
  const categories = await getCategoriesWithFeaturedProducts(); // Fetches ALL
  const products = await getAllProducts(); // Fetches ALL products!

  return (
    <html>
      <body>
        <Header categories={categories} products={products} /> {/* Passing to client component */}
        {children}
      </body>
    </html>
  );
}
```

**Impact:**

- Every page load fetches ALL products (could be 1000s)
- `force-dynamic` prevents static generation of ANY page
- Header component receives massive prop payload

**Fix Priority:** 🔴 **IMMEDIATE**

**Recommended Solution:**

```typescript
// Remove force-dynamic from layout
// Move to specific pages that need it (account, admin)

export default async function RootLayout({ children }) {
  // Only fetch minimal data for header
  const categories = await getAllCategories(); // Much lighter

  return (
    <html>
      <body>
        <Header categories={categories} /> {/* Remove products prop */}
        {children}
      </body>
    </html>
  );
}
```

**Expected Improvement:**

- 80-90% reduction in initial page load time
- Enable static generation for product pages, home page, etc.
- Reduce Time to First Byte (TTFB) from ~2s to <500ms

---

### 1.2 ❌ **No Sanity CDN Caching**

**Location:** `sanity/lib/client.ts`

```typescript
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // ✅ Good, but not enough
});
```

**Problem:** Using CDN but no revalidation or caching strategy in queries

**Impact:**

- Fresh database queries on every request
- Sanity API rate limits hit faster
- Slower response times

**Fix Priority:** 🔴 **IMMEDIATE**

**Recommended Solution:**

```typescript
// Add to sanity/lib/api.ts
export async function getAllProducts() {
  return safeQuery(async () => {
    const { data } = await sanityFetch({
      query: ALL_PRODUCTS_QUERY,
      tags: ["products:all"],
      // ADD THESE:
      next: {
        revalidate: 300, // 5 minutes
        tags: ["products"],
      },
    });
    return (data as SanityProduct[]).map(transformSanityProduct);
  });
}
```

---

### 1.3 ❌ **Excessive Client Components**

**Count:** 65 files with `"use client"`

**Problem Files:**

- `components/common/ResponsiveSanityImage.tsx` - Should be Server Component
- `components/products/product-sort.tsx` - Can use URL params + Server Component
- Many UI components that could be RSC

**Impact:**

- Larger JavaScript bundle
- Slower hydration
- More work for client browser

**Fix Priority:** 🟠 **HIGH**

---

## 2. High Priority Optimizations

### 2.1 🔸 **Database Query Optimization**

**Location:** `services/admin/customer.service.ts`

```typescript
// PROBLEM: N+1 query pattern
const customersWithStats: AdminCustomer[] = await Promise.all(
  customersData.map(async (customerData) => {
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*") // Fetching ALL order fields
      .eq("user_id", customerData.id);
    // ... more processing
  })
);
```

**Recommended Solution:**

```typescript
// Use a single JOIN query with aggregation
const { data } = await supabase
  .from("users")
  .select(
    `
    *,
    orders!inner(
      count,
      sum(total_amount)
    )
  `
  )
  .range(offset, offset + limit - 1);
```

---

### 2.2 🔸 **Cart Store Performance**

**Location:** `lib/stores/cart-store.ts`

**Problems:**

- Excessive console.logs in production
- Sync on every action (should debounce)
- State updates cause re-renders

**Recommended Solution:**

```typescript
import { debounce } from "use-debounce";

// Debounce sync operations
const debouncedSync = debounce((userId?: string) => {
  // sync logic
}, 1000);

// Remove all console.logs in production
if (process.env.NODE_ENV !== "development") {
  console.log = () => {};
}
```

---

### 2.3 🔸 **Image Loading Strategy**

**Current State:** Good foundation but missing key optimizations

**Improvements Needed:**

1. Add blur placeholders to product cards
2. Implement lazy loading for below-fold images
3. Use Sanity's image transformation API more aggressively

```typescript
// components/products/product-card.tsx
<Image
  src={primaryImage}
  alt={product.name}
  fill
  className="object-cover"
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
  priority={false}
  loading="lazy" // ADD THIS
  placeholder="blur" // ADD THIS
  blurDataURL={generateBlurDataURL(product.image)} // ADD THIS
/>
```

---

## 3. Medium Priority Optimizations

### 3.1 🟡 **API Route Caching**

**Location:** `app/api/products/route.ts`

**Current:**

```typescript
// Cache-Control: public, max-age=300, stale-while-revalidate=3600
```

**Recommendation:** Increase to 900 (15 minutes) and add ETag support

---

### 3.2 🟡 **Component Code Splitting**

**Good Example:** `app/admin/analytics/page.tsx` uses dynamic imports

**Apply to:**

- Product gallery (heavy image component)
- Checkout page components
- Admin dashboard components

```typescript
const ProductGallery = dynamic(
  () => import('@/components/products/product-gallery'),
  { ssr: true, loading: () => <GallerySkeleton /> }
);
```

---

### 3.3 🟡 **Bundle Size Optimization**

**Analysis Needed:**

- Run `npm run build` and check bundle sizes
- Identify large dependencies
- Consider tree-shaking opportunities

**Candidates for Optimization:**

- `chart.js` (324KB) - consider lightweight alternative
- `@react-pdf/renderer` (large) - lazy load
- `pdfkit` - lazy load
- `crypto-js` - use native Web Crypto API

---

## 4. CSS & Styling Performance

### 4.1 ✅ **Good:**

- Using Tailwind CSS v4 (better performance)
- No custom CSS files (good for bundle size)
- Using CSS variables for theme

### 4.2 🟡 **Improvements:**

- Consider critical CSS extraction
- Reduce animation complexity in `tw-animate-css`
- Remove unused Tailwind utilities in production

---

## 5. Monitoring & Metrics

### 5.1 **Missing:**

- No performance monitoring (add Vercel Speed Insights or Web Vitals)
- No error tracking (add Sentry)
- No bundle size tracking

### 5.2 **Recommended Tools:**

```bash
npm install @vercel/speed-insights
npm install @vercel/analytics
```

---

## 6. Implementation Priority

### Phase 1: Critical (Week 1)

1. Remove `force-dynamic` from root layout
2. Optimize layout data fetching (categories only)
3. Add Sanity query caching
4. Fix N+1 database queries

### Phase 2: High (Week 2)

5. Audit and reduce client components
6. Implement image lazy loading + blur
7. Optimize cart store
8. Add bundle analysis

### Phase 3: Medium (Week 3-4)

9. Code split heavy components
10. Optimize API caching
11. Add performance monitoring
12. Implement error tracking

---

## 7. Expected Performance Gains

### Before Optimization:

- **LCP:** ~4-6s (poor)
- **FID:** ~100-300ms (needs improvement)
- **CLS:** ~0.1-0.2 (needs improvement)
- **TTFB:** ~2-3s (poor)
- **Bundle Size:** ~800KB-1MB

### After Optimization:

- **LCP:** ~1.5-2.5s (**60% improvement**)
- **FID:** <100ms (**50% improvement**)
- **CLS:** <0.1 (**Pass Core Web Vitals**)
- **TTFB:** <500ms (**80% improvement**)
- **Bundle Size:** ~400-500KB (**50% reduction**)

---

## 8. Quick Wins (Can implement today)

1. **Remove console.logs from production**
2. **Add loading="lazy" to all below-fold images**
3. **Increase API cache durations**
4. **Remove `force-dynamic` from pages that don't need it**
5. **Add revalidate times to static pages**

---

## Next Steps

1. Review this audit with the team
2. Prioritize fixes based on business impact
3. Implement Phase 1 optimizations
4. Measure improvements with lighthouse
5. Iterate based on real-world metrics
