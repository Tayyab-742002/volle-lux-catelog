# Quick E2E Testing Checklist

## 🚀 **Pre-Test Setup** (5 minutes)

### **Start Services:**

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start Stripe CLI
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

### **Browser Setup:**

- [ ] Open Chrome DevTools (F12)
- [ ] Go to Console tab
- [ ] Clear console (Ctrl+L)
- [ ] Go to Network tab

---

## ⚡ **Quick Test 1: Complete Purchase Flow** (10 minutes)

### **Goal:** Verify the entire e-commerce workflow works

1. **🛒 Add to Cart:**
   - [ ] Go to http://localhost:3000/products
   - [ ] Add 2-3 products to cart
   - [ ] Check cart icon updates

2. **👤 Login/Register:**
   - [ ] Click Login/Register
   - [ ] Create new account or login
   - [ ] Verify successful authentication

3. **📦 Checkout:**
   - [ ] Go to cart → "Checkout"
   - [ ] Fill/select shipping address
   - [ ] Click "Proceed to Payment"

4. **💳 Payment:**
   - [ ] Use test card: `4242 4242 4242 4242`
   - [ ] Fill billing address on Stripe
   - [ ] Complete payment

5. **✅ Verify Success:**
   - [ ] Success page loads
   - [ ] Order details shown
   - [ ] Cart is cleared
   - [ ] Check email inbox

### **Expected Console Logs:**

```
🔍 Starting payment verification...
✅ Payment verified successfully
✅ Order fetched successfully
🎉 Payment verification and order fetch completed successfully!
```

### **Result:** [ ] ✅ PASS / [ ] ❌ FAIL

---

## ⚡ **Quick Test 2: Guest Checkout** (5 minutes)

1. **🕵️ Incognito Mode:**
   - [ ] Open private/incognito window
   - [ ] Go to http://localhost:3000

2. **🛒 Guest Cart:**
   - [ ] Add products without login
   - [ ] Go to checkout
   - [ ] Fill new address form
   - [ ] Complete payment

3. **✅ Verify:**
   - [ ] Order completes successfully
   - [ ] Email sent to guest email

### **Result:** [ ] ✅ PASS / [ ] ❌ FAIL

---

## ⚡ **Quick Test 3: Payment Failure** (3 minutes)

1. **💳 Use Declined Card:**
   - [ ] Go through checkout
   - [ ] Use card: `4000 0000 0000 0002`
   - [ ] Verify error message
   - [ ] Cart remains intact

### **Result:** [ ] ✅ PASS / [ ] ❌ FAIL

---

## ⚡ **Quick Test 4: Email Delivery** (2 minutes)

1. **📧 Order Email:**
   - [ ] Complete a purchase
   - [ ] Check email within 30 seconds
   - [ ] Verify order details in email

2. **📧 Contact Form:**
   - [ ] Go to `/contact`
   - [ ] Submit form
   - [ ] Check email delivery

### **Result:** [ ] ✅ PASS / [ ] ❌ FAIL

---

## 🐛 **Common Issues to Watch For:**

### **🔴 Critical Issues:**

- [ ] Success page stuck on "Verifying Payment"
- [ ] Cart not clearing after checkout
- [ ] Orders not created in database
- [ ] Emails not being sent
- [ ] Payment failures not handled

### **🟡 Warning Signs:**

- [ ] Slow page loads (>3 seconds)
- [ ] Console errors
- [ ] Network request failures
- [ ] Email delivery delays (>1 minute)

---

## 📊 **Quick Results Summary:**

- **Test 1 (Complete Flow):** [ ] PASS / [ ] FAIL
- **Test 2 (Guest Checkout):** [ ] PASS / [ ] FAIL
- **Test 3 (Payment Failure):** [ ] PASS / [ ] FAIL
- **Test 4 (Email Delivery):** [ ] PASS / [ ] FAIL

**Overall Status:** [ ] ✅ ALL PASS / [ ] ❌ ISSUES FOUND

---

## 🚨 **If Tests Fail:**

1. **Check Console Errors**
2. **Verify Services Running:**
   - Dev server on :3000
   - Stripe CLI listening
3. **Check Environment Variables**
4. **Review Network Tab for failed requests**
5. **Check Supabase database for data**

---

**Time Required:** ~25 minutes total  
**Next Step:** Full comprehensive testing with detailed documentation
