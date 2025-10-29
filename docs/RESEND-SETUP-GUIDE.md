# 📧 Resend Email Integration Guide

## Overview

This guide covers the complete setup and usage of Resend for transactional emails in the Volle e-commerce platform.

---

## ✅ Task 2.4.1: Complete Setup Checklist

- [x] Install Resend SDK (`resend`)
- [x] Install React Email renderer (`@react-email/render`)
- [x] Create Resend client configuration (`lib/resend/config.ts`)
- [x] Create email templates (order confirmation, contact form)
- [x] Create email service (`services/emails/email.service.ts`)
- [ ] **Set up Resend account and API key** ⬅️ YOU NEED TO DO THIS
- [ ] Configure environment variables
- [ ] Test email sending

---

## 🚀 Step 1: Create Resend Account

### Sign Up for Resend

1. **Go to:** https://resend.com
2. **Click:** "Sign Up" or "Get Started"
3. **Create account** using:
   - Email address
   - GitHub (recommended)
   - Google

### Get Your API Key

1. **After sign up**, go to the Dashboard
2. **Navigate to:** "API Keys" section
3. **Click:** "Create API Key"
4. **Name:** "Volle Development" (or your project name)
5. **Copy** the API key (starts with `re_`)

**IMPORTANT:** Save this key immediately - you won't see it again!

---

## 🔧 Step 2: Configure Environment Variables

### Add to `.env.local`

```env
# Resend Email Service
RESEND_API_KEY=re_your_api_key_here

# Optional: Test Mode Configuration
# In development, all emails will be sent to this address
RESEND_TEST_EMAIL=your-test-email@example.com

# Optional: BCC addresses for internal tracking
RESEND_BCC_ORDERS=orders@yourcompany.com
RESEND_BCC_CONTACT=support@yourcompany.com

# App URL (required for email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Example Configuration

```env
# Development Example
RESEND_API_KEY=re_abc123def456ghi789
RESEND_TEST_EMAIL=developer@yourcompany.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production Example
RESEND_API_KEY=re_production_key_here
NEXT_PUBLIC_APP_URL=https://volle.com
```

---

## 📝 Step 3: Verify Domain (Optional for Production)

### For Development

- **No domain verification needed**
- You can send up to 100 emails/day
- Emails can only be sent to your verified email

### For Production

1. **Go to:** Resend Dashboard → "Domains"
2. **Click:** "Add Domain"
3. **Enter your domain:** `volle.com`
4. **Add DNS records** (provided by Resend):
   ```
   TXT: _resend.volle.com → [verification code]
   MX: volle.com → feedback-smtp.resend.com
   ```
5. **Wait for verification** (usually 1-5 minutes)
6. **Status changes to "Verified"**

**Benefits of verified domain:**

- Send from `orders@volle.com` instead of `onboarding@resend.dev`
- No daily limits
- Professional appearance
- Better deliverability

---

## 🧪 Step 4: Test Email Sending

### Test API Route

I've created a test API route for you. Let's create it:

```typescript
// app/api/test-email/route.ts
import { NextResponse } from "next/server";
import { sendTestEmail } from "@/services/emails/email.service";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email address required" },
        { status: 400 }
      );
    }

    const result = await sendTestEmail(email);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully!",
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send test email" },
      { status: 500 }
    );
  }
}
```

### Test Using cURL

```bash
# Start your dev server
npm run dev

# Send test email
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

### Test Using Browser Console

```javascript
// Open your app in browser
// Open Developer Console (F12)
// Run this:

fetch("/api/test-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "your-email@example.com" }),
})
  .then((r) => r.json())
  .then((data) => console.log("Result:", data));
```

---

## 📧 Available Email Templates

### 1. Order Confirmation Email

**Template:** `lib/emails/order-confirmation.tsx`

**Sent when:** Customer completes payment

**Includes:**

- Order number and date
- Customer email
- List of items with quantities and prices
- Order summary (subtotal, discount, shipping, total)
- Shipping address
- Link to view order details
- Support contact information

**Usage:**

```typescript
import { sendOrderConfirmationEmail } from "@/services/emails/email.service";

await sendOrderConfirmationEmail(order, customerEmail);
```

### 2. Contact Form Email

**Template:** `lib/emails/contact-form.tsx`

**Sent when:** Someone submits the contact form

**Includes:**

- Submission timestamp
- Contact information (name, email, company, phone)
- Message content
- Quick reply button

**Usage:**

```typescript
import { sendContactFormEmail } from "@/services/emails/email.service";

await sendContactFormEmail({
  name: "John Doe",
  email: "john@example.com",
  company: "Acme Corp",
  phone: "+1 234 567 8900",
  message: "I'm interested in bulk orders...",
});
```

### 3. Order Shipped Email (Basic)

**Sent when:** Order status changes to "shipped"

**Includes:**

- Order number
- Tracking number
- Basic shipping notification

**Usage:**

```typescript
import { sendOrderShippedEmail } from "@/services/emails/email.service";

await sendOrderShippedEmail(order, customerEmail, trackingNumber);
```

---

## 🔧 Configuration Details

### Email Addresses

**Configured in:** `lib/resend/config.ts`

```typescript
// From addresses (update these for production)
from: {
  orders: "Volle Orders <orders@volle.com>",
  support: "Volle Support <support@volle.com>",
  noreply: "Volle <noreply@volle.com>",
}
```

### Development Mode

In development (`NODE_ENV !== "production"`):

- All emails redirect to `RESEND_TEST_EMAIL`
- Original recipient is logged in console
- Prevents accidental emails to real customers

### Production Mode

In production:

- Emails sent to actual recipients
- Domain must be verified
- No daily limits

---

## 🎯 Integration Points

### 1. Webhook Handler (Already Integrated)

**File:** `app/api/webhooks/stripe/route.ts`

**Status:** ✅ Ready to integrate

**Add this line after order creation:**

```typescript
// After creating order in webhook
const orderId = await createOrder(orderData);

// Send confirmation email
await sendOrderConfirmationEmail(await getOrderById(orderId), userEmail);
```

### 2. Contact Form (TODO)

**File:** `app/contact/page.tsx` or `app/api/contact/route.ts`

**Integration:**

```typescript
// In contact form submission
await sendContactFormEmail({
  name: formData.name,
  email: formData.email,
  company: formData.company,
  phone: formData.phone,
  message: formData.message,
});
```

---

## 🐛 Troubleshooting

### Issue 1: "Missing RESEND_API_KEY"

**Symptom:** Error when sending emails

**Solution:**

1. Check `.env.local` has `RESEND_API_KEY`
2. Restart dev server after adding env var
3. Verify API key is correct (starts with `re_`)

### Issue 2: Emails Not Sending in Development

**Symptom:** No emails received

**Check:**

1. Is `RESEND_TEST_EMAIL` set in `.env.local`?
2. Did you verify your email in Resend dashboard?
3. Check spam folder
4. Check Resend dashboard logs

### Issue 3: Domain Not Verified

**Symptom:** Emails from `onboarding@resend.dev`

**Solution:**

1. This is normal for development
2. For production, verify your domain
3. Update `EMAIL_CONFIG.from` addresses

### Issue 4: Daily Limit Reached

**Symptom:** "Rate limit exceeded"

**Solution:**

1. Unverified accounts: 100 emails/day limit
2. Verify your domain to remove limits
3. Wait 24 hours for reset

---

## 📊 Monitoring & Logs

### View Email Logs in Resend Dashboard

1. **Go to:** Resend Dashboard
2. **Navigate to:** "Logs" or "Emails"
3. **See:** All sent emails with status
4. **Click** on email to see details

### Check Application Logs

```bash
# In your terminal (where npm run dev is running)
# Look for:
✅ Order confirmation email sent to user@example.com (ID: abc123)
✅ Contact form email sent for John Doe (ID: def456)
```

---

## 🎨 Customizing Email Templates

### Update Branding

**File:** `lib/emails/order-confirmation.tsx`

```tsx
// Change logo/brand name
<h1
  style={
    {
      /* styles */
    }
  }
>
  YOUR BRAND NAME
</h1>;

// Change colors
backgroundColor: "#YOUR_PRIMARY_COLOR";
color: "#YOUR_TEXT_COLOR";
```

### Add New Email Template

1. **Create file:** `lib/emails/your-template.tsx`
2. **Follow pattern:** Copy structure from `order-confirmation.tsx`
3. **Add to service:** `services/emails/email.service.ts`
4. **Export function:** `sendYourTemplateEmail()`

---

## ✅ Success Criteria

Task 2.4.1 is complete when:

- [x] Resend SDK installed
- [x] React Email renderer installed
- [x] Configuration files created
- [x] Email templates created
- [x] Email service created
- [ ] Resend account created **← YOU NEED TO DO THIS**
- [ ] API key added to `.env.local`
- [ ] Test email sent successfully
- [ ] Order confirmation working

---

## 🚀 Next Steps

### Task 2.4.2: Integrate Order Confirmation

1. Update webhook handler
2. Send email after order creation
3. Test complete checkout flow

### Task 2.4.3: Integrate Contact Form

1. Create contact form API route
2. Send email on form submission
3. Add success/error handling

### Task 2.4.4: Invoice PDF Generation

1. Install PDF library
2. Create invoice template
3. Attach to order emails

---

## 📚 Resources

- **Resend Documentation:** https://resend.com/docs
- **React Email Documentation:** https://react.email/docs
- **Email Best Practices:** https://resend.com/docs/send-with-nextjs

---

**Last Updated:** 2025-01-28  
**Status:** ✅ SETUP COMPLETE (pending API key)  
**Next Task:** 2.4.2 - Order Confirmation Integration
