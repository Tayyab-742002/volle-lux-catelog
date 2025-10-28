# Category Cache Management & Revalidation

**Issue:** Category updates in Sanity CMS not immediately reflecting on the website  
**Cause:** Next.js caching strategy  
**Status:** ✅ FIXED with automatic revalidation

---

## 🔧 Solutions Implemented

### 1. **Automatic Time-Based Revalidation** (RECOMMENDED)

Added `revalidate` export to cache categories for 60 seconds:

**Homepage** (`app/page.tsx`):

```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

**Categories Page** (`app/categories/page.tsx`):

```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

**How it works:**

- Pages are cached for 60 seconds
- After 60 seconds, the next visitor triggers a background revalidation
- Fresh data fetched from Sanity
- Cache updated automatically
- Maximum staleness: 60 seconds

---

### 2. **Manual Cache Revalidation API** (INSTANT)

Created `/api/revalidate` endpoint for instant cache clearing:

**File:** `app/api/revalidate/route.ts`

**Usage:**

#### Option A: Via Browser (Testing)

```
https://yoursite.com/api/revalidate?secret=YOUR_SECRET&path=/categories
```

#### Option B: Via curl

```bash
curl -X GET "https://yoursite.com/api/revalidate?secret=YOUR_SECRET&path=/categories"
```

#### Option C: Via POST (Webhook)

```bash
curl -X POST https://yoursite.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "YOUR_SECRET",
    "paths": ["/", "/categories", "/products"]
  }'
```

---

## 🚀 Quick Fixes for Immediate Update

### Method 1: Wait 60 Seconds (Automatic)

1. Update category in Sanity Studio
2. Publish changes
3. Wait 60 seconds
4. Refresh the website
5. ✅ Changes appear

### Method 2: Manual Revalidation (Instant)

1. Update category in Sanity Studio
2. Publish changes
3. Open browser and navigate to:
   ```
   http://localhost:3000/api/revalidate?secret=dev-secret&path=/categories
   ```
4. You'll see: `{"revalidated":true,"path":"/categories","now":...}`
5. Refresh the website
6. ✅ Changes appear immediately

### Method 3: Hard Refresh (Bypass Cache)

1. Update category in Sanity Studio
2. Publish changes
3. On the website, press:
   - **Windows/Linux:** `Ctrl + Shift + R` or `Ctrl + F5`
   - **Mac:** `Cmd + Shift + R`
4. ✅ Changes appear (browser cache cleared)

### Method 4: Restart Dev Server (Development Only)

1. Update category in Sanity Studio
2. Publish changes
3. Stop dev server (`Ctrl + C`)
4. Start dev server (`npm run dev`)
5. ✅ Changes appear

---

## 🔐 Environment Setup

### Add Revalidation Secret

**File:** `.env.local`

```env
# Revalidation secret for cache clearing
REVALIDATE_SECRET=your-super-secret-key-change-this
```

**Security Notes:**

- Change `your-super-secret-key-change-this` to a strong random string
- Never commit this to git
- Use different secrets for development and production

---

## 🔗 Sanity Webhook Integration (AUTOMATIC)

For **automatic** cache revalidation when categories are updated in Sanity:

### Step 1: Create Webhook in Sanity

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** → **Webhooks**
4. Click **Create Webhook**
5. Configure:
   ```
   Name: Category Update Webhook
   URL: https://yoursite.com/api/revalidate
   Dataset: production (or your dataset name)
   Trigger on: Create, Update, Delete
   Filter: _type == "category"
   HTTP method: POST
   HTTP Headers:
     Content-Type: application/json
   Payload:
   {
     "secret": "your-revalidation-secret",
     "paths": ["/", "/categories", "/products"]
   }
   ```
6. Save webhook

### Step 2: Test Webhook

1. Update a category in Sanity Studio
2. Publish changes
3. Check webhook delivery log in Sanity
4. Verify response: `{"revalidated":true,...}`
5. ✅ Website updates automatically!

---

## 📊 Caching Strategy Explained

### Before (Issue)

```
User visits homepage
  ↓
Next.js fetches categories from Sanity
  ↓
Next.js caches the page indefinitely
  ↓
Admin updates category in Sanity
  ↓
❌ Website still shows old data (cached forever)
```

### After (Fixed - Automatic Revalidation)

```
User visits homepage
  ↓
Next.js fetches categories from Sanity
  ↓
Next.js caches the page for 60 seconds
  ↓
Admin updates category in Sanity
  ↓
After 60 seconds, next visitor triggers revalidation
  ↓
Next.js fetches fresh data from Sanity
  ↓
✅ Website shows updated data
```

### After (Fixed - Webhook Revalidation)

```
Admin updates category in Sanity
  ↓
Sanity sends webhook to /api/revalidate
  ↓
Next.js clears cache immediately
  ↓
Next visitor sees fresh data
  ↓
✅ Website updates in real-time (< 1 second)
```

---

## 🎛️ Revalidation Options Comparison

| Method               | Speed      | Setup   | Best For            |
| -------------------- | ---------- | ------- | ------------------- |
| **Time-based (60s)** | 60 seconds | ✅ Auto | Most cases          |
| **Webhook**          | < 1 second | Manual  | Production (ideal)  |
| **Manual API call**  | Instant    | None    | Testing/Development |
| **Hard refresh**     | Instant    | None    | Quick check         |

---

## 🔧 Adjusting Revalidation Time

Want faster/slower revalidation? Change the `revalidate` value:

```typescript
// Fast updates (every 30 seconds)
export const revalidate = 30;

// Balanced (every 60 seconds) - CURRENT
export const revalidate = 60;

// Slower updates (every 5 minutes)
export const revalidate = 300;

// Very slow (every 1 hour)
export const revalidate = 3600;

// On-demand only (no automatic revalidation)
export const revalidate = false;
```

**Recommendation:** Keep it at 60 seconds for a good balance between freshness and performance.

---

## 🐛 Troubleshooting

### Issue: Changes still not appearing

**Check:**

1. ✅ Is the category published in Sanity? (not just saved as draft)
2. ✅ Is `isActive` set to `true`?
3. ✅ Have you waited 60+ seconds?
4. ✅ Did you do a hard refresh? (`Ctrl + Shift + R`)
5. ✅ Is the revalidate export added to the page?

**Debug:**

```typescript
// Add this temporarily to see when page was rendered
export default async function CategoriesPage() {
  const categories = await getAllCategories();
  console.log("Page rendered at:", new Date().toISOString());
  console.log("Categories:", categories.length);
  // ...
}
```

### Issue: Manual revalidation returning 401

**Solution:**

- Check that `REVALIDATE_SECRET` is set in `.env.local`
- Verify the secret matches in your API call
- Restart dev server after adding environment variable

### Issue: Webhook not triggering

**Check:**

1. Webhook URL is correct (https://yoursite.com/api/revalidate)
2. Secret in webhook payload matches `REVALIDATE_SECRET`
3. Webhook is enabled in Sanity
4. Check webhook delivery logs in Sanity dashboard
5. Verify website is accessible (not localhost)

---

## 📝 Best Practices

### Development

- Use manual revalidation or hard refresh
- Keep `revalidate = 60` for testing

### Staging

- Use time-based revalidation (60 seconds)
- Test webhook integration

### Production

- Use webhook integration for instant updates
- Keep time-based revalidation (60s) as fallback
- Monitor webhook delivery in Sanity

---

## ✅ Current Status

| Feature              | Status | Notes                         |
| -------------------- | ------ | ----------------------------- |
| **Time-based (60s)** | ✅     | Active on all pages           |
| **Manual API**       | ✅     | Available via /api/revalidate |
| **Webhook ready**    | ✅     | Endpoint ready                |
| **Environment vars** | ⚠️     | Add REVALIDATE_SECRET         |
| **Sanity webhook**   | ⚠️     | Configure in production       |

---

## 🎉 Summary

**Problem Solved:** ✅

Categories now update automatically within 60 seconds, with options for instant updates when needed.

**Recommended Setup:**

1. ✅ Keep `revalidate = 60` (already done)
2. ✅ Add `REVALIDATE_SECRET` to `.env.local`
3. ✅ Set up Sanity webhook in production
4. ✅ Test manual revalidation endpoint

**Result:**

- Automatic updates every 60 seconds
- Instant updates via webhook (production)
- Manual revalidation available anytime
- No more stale category data! 🎉

---

_Your categories will now stay fresh and up-to-date automatically!_
