# 🧪 Test Order Confirmation Emails - Quick Guide

## Prerequisites (2 minutes)

1. **Resend API Key Set Up:**

   ```env
   # In .env.local
   RESEND_API_KEY=re_your_key_here
   RESEND_TEST_EMAIL=your-email@example.com
   ```

2. **Stripe Webhook Running:**

   ```bash
   # In separate terminal
   stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
   ```

3. **Dev Server Running:**
   ```bash
   npm run dev
   ```

---

## 🚀 Quick Test (5 minutes)

### Step 1: Start Checkout

1. Go to http://localhost:3000
2. Add items to cart
3. Click "Checkout"

### Step 2: Fill Shipping Address

```
First Name: Test
Last Name: User
Address: 123 Test St
City: New York
State: NY
ZIP: 10001
```

### Step 3: Stripe Payment

1. Click "Continue to Payment"
2. On Stripe page, fill billing address
3. Card: `4242 4242 4242 4242`
4. Expiry: Any future date
5. CVC: Any 3 digits
6. Click "Pay"

### Step 4: Check Results

**Browser:**

- ✅ Redirected to success page
- ✅ Order details displayed

**Terminal:**

```
Processing checkout.session.completed: cs_test_xxxxx
Order created successfully: <order-id>
✅ Order confirmation email sent to your-email@example.com
```

**Email Inbox:**

- ✅ Check inbox (within 1-2 minutes)
- ✅ Email subject: "Order Confirmation - #XXXX"
- ✅ From: "Volle Orders" or "onboarding@resend.dev"

---

## ✅ What to Verify in Email

### Header

- [ ] "VOLLE" brand name displayed
- [ ] Professional black background

### Order Details

- [ ] Order number matches success page
- [ ] Order date is today
- [ ] Your email address shown

### Items List

- [ ] All items you ordered listed
- [ ] Correct quantities
- [ ] Correct prices
- [ ] Total per item correct

### Order Summary

- [ ] Subtotal correct
- [ ] Shipping cost shown
- [ ] Discount shown (if applied)
- [ ] Total matches Stripe payment

### Shipping Address

- [ ] Complete address displayed
- [ ] All fields present
- [ ] Formatted correctly

### Call to Action

- [ ] "View Order Details" button present
- [ ] Button links to order page
- [ ] Link works when clicked

### Footer

- [ ] Support email: support@volle.com
- [ ] Copyright year correct

---

## 🐛 Troubleshooting

### ❌ No Email Received

**Check:**

1. **Spam folder** - Check there first!
2. **Resend dashboard** - See if email was sent
3. **Terminal logs** - Look for success message
4. **`.env.local`** - Is `RESEND_API_KEY` set?
5. **Server restart** - Did you restart after adding key?

**Try:**

```bash
# Check configuration
curl http://localhost:3000/api/test-email

# Send test email
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

### ❌ Email Sent to Wrong Address

**Check:**

- `RESEND_TEST_EMAIL` in `.env.local`
- In dev mode, ALL emails go to this address (this is correct!)

### ❌ Terminal Shows Error

**"Resend not configured"**

- Add `RESEND_API_KEY` to `.env.local`
- Restart server

**"Invalid API key"**

- Double-check key in Resend dashboard
- Regenerate if needed

**"Failed to send"**

- Check Resend dashboard for details
- Verify email address format
- Check Resend service status

### ❌ Order Created But No Email

**This is OK!** The system is designed to:

- ✅ Create order successfully
- ⚠️ Log email failure
- ✅ Not block the order

Check terminal for: "Order created successfully, but email failed to send"

---

## 📊 Expected Terminal Output

### Success Flow:

```
Processing checkout.session.completed: cs_test_a1b2c3d4e5f6g7h8

Stripe session billing data: {
  hasCustomerDetails: true,
  hasCustomerAddress: true,
  ...
}

✅ Billing address captured from Stripe customer_details: { ... }

Creating order with data: {
  userId: '...',
  email: 'test@example.com',
  itemCount: 2,
  total: 149.99,
  ...
}

Order created successfully: 12345678-1234-1234-1234-123456789012

✅ Order confirmation email sent to test@example.com (Message ID: 550e8400-e29b-41d4-a716-446655440000)
```

### Email Failure (Non-blocking):

```
Order created successfully: 12345678-1234-1234-1234-123456789012

⚠️ Resend is not configured. Skipping email send.
Order created successfully, but email failed to send
```

---

## 🎯 Success Criteria

You've successfully tested when:

- [x] Checkout completes without errors
- [x] Order appears in Supabase
- [x] Terminal shows "Order created successfully"
- [x] Terminal shows "Order confirmation email sent"
- [x] Email received in inbox
- [x] Email content is correct
- [x] All order details match
- [x] "View Order Details" link works

---

## 🚀 Production Testing

Before deploying to production:

1. **Domain Verification:**
   - Verify domain in Resend
   - Update `EMAIL_CONFIG.from` addresses

2. **Remove Test Mode:**
   - Remove `RESEND_TEST_EMAIL` from production `.env`
   - Emails will go to actual customers

3. **Test with Real Email:**
   - Use your real email
   - Complete checkout
   - Verify email looks professional

4. **Monitor Dashboard:**
   - Check Resend dashboard
   - Monitor delivery rates
   - Check for bounces/errors

---

## 📧 Multiple Order Test

Test with 3 different orders:

1. **Small Order:** 1 item, $25
2. **Medium Order:** 3 items, $150
3. **Large Order:** 10 items, $500

**Verify:**

- Each gets unique email
- Order numbers different
- Items correct per order
- Totals correct per order

---

## 🎉 Quick Checklist

- [ ] Resend API key configured
- [ ] Test email address set
- [ ] Stripe webhook running
- [ ] Dev server running
- [ ] Complete test checkout
- [ ] Check terminal logs
- [ ] Check email inbox
- [ ] Verify email content
- [ ] Test "View Order Details" link
- [ ] Complete 2-3 more test orders

**Time to Complete:** ~10 minutes  
**Status:** Ready to test!

---

**Last Updated:** 2025-01-28  
**Quick Reference:** See `docs/TASK-2.4.2-COMPLETE.md` for full details
