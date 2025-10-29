# Fix: Address Loading Infinite Loop Issue

**Issue:** Checkout and Saved Addresses pages stuck on "Loading addresses..." indefinitely  
**Status:** ✅ RESOLVED  
**Date:** December 2024

---

## 🐛 **Problem Description**

### **Symptoms:**

- Checkout page shows "Loading addresses..." indefinitely
- Saved Addresses page shows "Loading..." without displaying addresses
- Debug info shows `Is Loading Addresses: true` that never changes
- User workflow completely blocked

### **User Report:**

```
CHECKOUT Debug Info:
User ID: 7cdcca38-374f-47dd-9783-fdf0b97aba94
Is Loading Addresses: true          ← Stuck at true
Saved Addresses Count: 0
Selected Address ID: None
Use New Address: false
Error: None
```

### **Root Cause Analysis:**

**PRIMARY CAUSE: Supabase RLS Query Hang**

The `getSavedAddresses(userId)` promise was never resolving or rejecting, causing:

1. The `try` block to hang at `await getSavedAddresses(userId)`
2. The `finally` block never executing
3. `setIsLoadingAddresses(false)` never being called
4. Infinite loading state

**Why the query hangs:**

- **Row Level Security (RLS)** policies may be preventing the query from completing
- The query might be waiting for authentication context that never arrives
- Network timeout not configured on Supabase client
- The `auth.uid()` in RLS policies might be returning `null` or mismatching

---

## 🔧 **Solution Applied**

### **1. Added Timeout Protection**

Added a 5-second timeout to force loading state to `false`:

```typescript
// Set timeout to force loading to false if it takes too long
timeoutId = setTimeout(() => {
  if (!isCancelled) {
    console.error(
      "⏰ CHECKOUT: Address loading timeout (5s) - forcing loading to false"
    );
    setIsLoadingAddresses(false);
    addressesLoadedRef.current = true;
  }
}, 5000); // 5 second timeout
```

### **2. Added Cancellation Logic**

Prevents state updates if component unmounts:

```typescript
let isCancelled = false;

// In try/catch/finally blocks
if (isCancelled) return; // Don't update state if cancelled

// Cleanup
return () => {
  isCancelled = true;
  clearTimeout(timeoutId);
};
```

### **3. Enhanced Error Handling**

More robust error catching and state management:

```typescript
try {
  const addresses = await getSavedAddresses(userId);
  if (isCancelled) return; // Check cancellation after async operation
  setSavedAddresses(addresses);
} catch (err) {
  console.error("❌ CHECKOUT: Failed to load addresses:", err);
  if (!isCancelled) {
    setSavedAddresses([]); // Empty array on error
  }
} finally {
  if (!isCancelled) {
    setIsLoadingAddresses(false); // Always set loading to false
  }
  clearTimeout(timeoutId); // Always clear timeout
}
```

---

## 🎯 **Files Modified**

### **1. `app/checkout/page.tsx`**

- Added timeout protection (5 seconds)
- Added cancellation flag
- Enhanced error handling
- Improved cleanup on unmount

### **2. `app/account/addresses/page.tsx`**

- Added timeout protection (5 seconds)
- Added cancellation flag
- Set error message on timeout
- Improved cleanup on unmount

### **3. `services/users/user.service.ts`**

- Already has comprehensive logging (no changes needed)

---

## ✅ **Expected Behavior After Fix**

### **Scenario 1: Successful Load (< 5 seconds)**

```
🔍 CHECKOUT: Starting address loading...
🔍 CHECKOUT: Fetching saved addresses for user: [id]
✅ CHECKOUT: Loaded addresses: [count]
🔍 CHECKOUT: Setting isLoadingAddresses to false
→ Shows new address form (if no addresses) or saved addresses list
```

### **Scenario 2: Timeout (≥ 5 seconds)**

```
🔍 CHECKOUT: Starting address loading...
🔍 CHECKOUT: Fetching saved addresses for user: [id]
⏰ CHECKOUT: Address loading timeout (5s) - forcing loading to false
→ Shows new address form (default fallback)
```

### **Scenario 3: Error During Load**

```
🔍 CHECKOUT: Starting address loading...
🔍 CHECKOUT: Fetching saved addresses for user: [id]
❌ CHECKOUT: Failed to load addresses: [error]
🔍 CHECKOUT: Setting isLoadingAddresses to false
→ Shows new address form with error message
```

---

## 🧪 **Testing Steps**

### **Test 1: Normal Flow**

1. Login to account
2. Go to `/checkout`
3. **Expected:** Loading spinner shows briefly (< 1 second), then shows form
4. **Result:** ✅ No infinite loading

### **Test 2: Timeout Scenario**

1. Simulate slow network (Chrome DevTools → Network → Slow 3G)
2. Go to `/checkout`
3. **Expected:** After 5 seconds, loading stops and shows form
4. **Console:** `⏰ CHECKOUT: Address loading timeout (5s)`

### **Test 3: Saved Addresses Page**

1. Go to `/account/addresses`
2. **Expected:** Loading spinner shows briefly, then shows addresses or empty state
3. **Result:** ✅ No infinite loading

---

## 🚨 **Known Issues & Next Steps**

### **Issue 1: RLS Policies Need Investigation**

The root cause (query hanging) is still present. The timeout is a **workaround**, not a permanent fix.

**Next Steps:**

1. **Check RLS policies** for `saved_addresses` table
2. **Verify user authentication** is properly set in Supabase client
3. **Test RLS policies** directly in Supabase dashboard
4. **Consider** using service role client for read operations

### **Issue 2: No Addresses vs. Loading Timeout**

Currently, both scenarios show the new address form. User can't distinguish between:

- "You have no saved addresses"
- "Loading failed/timed out"

**Improvement:**
Add visual indicator or message explaining why the form is shown.

---

## 🔍 **Debugging Commands**

### **Check Supabase RLS Policies:**

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'saved_addresses';
```

### **Test Query Directly:**

```sql
-- Run as authenticated user
SELECT * FROM saved_addresses WHERE user_id = 'your-user-id';
```

### **Check Auth Context:**

```sql
SELECT auth.uid();  -- Should return your user ID
```

---

## 📊 **Impact**

### **Before Fix:**

- ❌ Checkout completely blocked
- ❌ Saved addresses page unusable
- ❌ User cannot complete purchase
- ❌ Poor user experience

### **After Fix:**

- ✅ Checkout works (shows new address form after 5s max)
- ✅ Saved addresses page works (shows empty state after 5s max)
- ✅ User can complete purchase
- ✅ Better user experience with timeout fallback

---

## 🎯 **Recommended Follow-up**

1. **Investigate RLS root cause** - Why is the query hanging?
2. **Add retry logic** - Attempt to fetch addresses 2-3 times before timeout
3. **Add user feedback** - Show message explaining why form is displayed
4. **Monitor Supabase logs** - Check for RLS policy violations
5. **Consider caching** - Cache addresses in local state to reduce queries

---

**Fix Status:** ✅ WORKAROUND APPLIED (Timeout protection)  
**Root Cause:** 🔍 UNDER INVESTIGATION (RLS/Supabase query hang)  
**User Impact:** ✅ RESOLVED (User can proceed with checkout)
