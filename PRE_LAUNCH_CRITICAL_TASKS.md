# 🎯 Pre-Launch Critical Tasks (Can Do Now)

**Priority Order:** Work on these items NOW before domain/Stripe/Resend setup

---

## 🔴 **MOST CRITICAL** (Do First)

### 1. **SEO Optimization - Dynamic Metadata for Product Pages**
**Priority:** 🔴 **CRITICAL**  
**Impact:** High - Affects search engine visibility and social sharing  
**Time:** 30-60 minutes  
**Status:** ⚠️ Missing

**Why Critical:**
- Product pages currently have no dynamic metadata
- Missing Open Graph tags for social sharing
- No structured data for search engines
- Poor SEO = less organic traffic

**What to Do:**
- Add `generateMetadata` function to `app/products/[slug]/page.tsx`
- Include product name, description, price, images
- Add Open Graph tags
- Add structured data (JSON-LD) for products

**Files to Update:**
- `app/products/[slug]/page.tsx`

---

### 2. **Error Boundaries - Wrap Critical Sections**
**Priority:** 🔴 **CRITICAL**  
**Impact:** High - Prevents entire app from crashing  
**Time:** 30-45 minutes  
**Status:** ⚠️ Component exists but not used everywhere

**Why Critical:**
- If checkout fails, entire page crashes
- If product page errors, user sees blank screen
- No graceful error handling for critical flows
- Production errors can break user experience

**What to Do:**
- Wrap checkout page with ErrorBoundary
- Wrap product pages with ErrorBoundary
- Wrap cart with ErrorBoundary
- Improve error messages for users

**Files to Update:**
- `app/checkout/page.tsx`
- `app/products/[slug]/page.tsx`
- `app/cart/page.tsx`
- `components/common/ErrorBoundary.tsx` (improve UI)

---

### 3. **Sitemap & Robots.txt**
**Priority:** 🟡 **IMPORTANT**  
**Impact:** Medium - Helps search engines index site  
**Time:** 20-30 minutes  
**Status:** ⚠️ Missing

**Why Important:**
- Search engines need sitemap to discover pages
- robots.txt controls what search engines can crawl
- Better SEO = more organic traffic

**What to Do:**
- Create `app/sitemap.ts` (dynamic sitemap)
- Create `app/robots.ts` (robots.txt)
- Include all product pages, categories, static pages

**Files to Create:**
- `app/sitemap.ts`
- `app/robots.ts`

---

## 🟡 **IMPORTANT** (Do Second)

### 4. **Documentation - Update README.md**
**Priority:** 🟡 **IMPORTANT**  
**Impact:** Medium - Helps with deployment and maintenance  
**Time:** 30-45 minutes  
**Status:** ⚠️ Still default Next.js template

**Why Important:**
- Deployment team needs setup instructions
- Future developers need documentation
- Environment variables need to be documented
- Deployment process needs to be clear

**What to Do:**
- Add project overview
- Add setup instructions
- Document all environment variables
- Add deployment guide
- Document tech stack

**Files to Update:**
- `README.md`

---

### 5. **Testing - Local Checkout Flow Testing**
**Priority:** 🟡 **IMPORTANT**  
**Impact:** High - Catch bugs before launch  
**Time:** 1-2 hours  
**Status:** ⚠️ Recommended

**Why Important:**
- Test guest checkout flow
- Test authenticated checkout flow
- Test cart functionality
- Test payment with Stripe test cards
- Verify all calculations (VAT, shipping)

**What to Test:**
- [ ] Add product to cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Guest checkout flow
- [ ] Authenticated checkout flow
- [ ] Shipping selection
- [ ] VAT calculation
- [ ] Stripe test payment
- [ ] Order confirmation
- [ ] Email delivery (if Resend configured)

---

### 6. **Code Cleanup - Review TODOs**
**Priority:** 🟡 **IMPORTANT**  
**Impact:** Low-Medium - Code quality  
**Time:** 30-60 minutes  
**Status:** ⚠️ 15 TODOs found

**Why Important:**
- Clean code is easier to maintain
- TODOs might indicate incomplete features
- Better code quality = fewer bugs

**What to Do:**
- Review all TODO comments
- Remove or complete TODOs
- Document any intentional TODOs
- Clean up commented code

**Files to Review:**
- `app/api/webhooks/stripe/route.ts`
- `services/pricing/pricing.service.ts`
- `services/emails/email.service.ts`
- Others with TODOs

---

## 🟢 **NICE TO HAVE** (Can Do Later)

### 7. **Structured Data (JSON-LD)**
**Priority:** 🟢 **NICE TO HAVE**  
**Impact:** Low-Medium - Better SEO  
**Time:** 30 minutes  
**Status:** ⚠️ Optional

**What to Do:**
- Add Product schema to product pages
- Add Organization schema to homepage
- Add BreadcrumbList schema

---

### 8. **Performance Audit**
**Priority:** 🟢 **NICE TO HAVE**  
**Impact:** Low - Performance is already good  
**Time:** 30 minutes  
**Status:** ✅ Already optimized

**What to Do:**
- Run Lighthouse audit
- Check Core Web Vitals
- Optimize if needed

---

## 📋 **RECOMMENDED ORDER**

1. **First (Today):**
   - ✅ SEO - Dynamic metadata for products
   - ✅ Error Boundaries - Wrap critical sections
   - ✅ Sitemap & Robots.txt

2. **Second (This Week):**
   - ✅ Documentation - Update README
   - ✅ Testing - Local checkout flow
   - ✅ Code Cleanup - Review TODOs

3. **Third (Before Launch):**
   - ✅ Structured Data (optional)
   - ✅ Performance Audit (optional)

---

## ✅ **SUMMARY**

**Must Do Before Launch:**
1. SEO metadata for product pages
2. Error boundaries on critical pages
3. Sitemap & robots.txt
4. Update README.md
5. Test checkout flow locally

**Can Do After Launch:**
- Structured data
- Performance audit
- Additional SEO improvements

---

## 🚀 **ESTIMATED TIME**

- **Critical Tasks:** 2-3 hours
- **Important Tasks:** 2-3 hours
- **Total:** 4-6 hours of focused work

**Recommendation:** Complete critical tasks first, then important tasks. Everything else can wait until after launch.

