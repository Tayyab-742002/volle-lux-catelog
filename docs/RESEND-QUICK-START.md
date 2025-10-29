# 🚀 Resend Quick Start - 5 Minutes to Email

## ✅ What's Been Done

All the code is ready! Here's what I've set up for you:

### Files Created:

1. ✅ `lib/resend/config.ts` - Resend client configuration
2. ✅ `lib/emails/order-confirmation.tsx` - Order confirmation email template
3. ✅ `lib/emails/contact-form.tsx` - Contact form email template
4. ✅ `services/emails/email.service.ts` - Email sending functions
5. ✅ `app/api/test-email/route.ts` - Test API endpoint
6. ✅ `docs/RESEND-SETUP-GUIDE.md` - Complete documentation

### Packages Installed:

- ✅ `resend` - Resend SDK
- ✅ `@react-email/render` - Email template renderer

---

## 🎯 What YOU Need to Do (2 Steps)

### Step 1: Get Your Resend API Key (2 minutes)

1. **Go to:** https://resend.com/signup
2. **Sign up** (use GitHub for fastest signup)
3. **Go to:** Dashboard → API Keys
4. **Click:** "Create API Key"
5. **Copy** the key (starts with `re_`)

### Step 2: Add to Environment Variables (30 seconds)

Open `.env.local` and add:

```env
# Resend Email Service
RESEND_API_KEY=re_your_actual_key_here

# Development Testing (use your email)
RESEND_TEST_EMAIL=your-email@example.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Example:**

```env
RESEND_API_KEY=re_abc123def456
RESEND_TEST_EMAIL=developer@mycompany.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🧪 Test It (1 minute)

### Restart Your Dev Server

```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

### Method 1: Browser Console (Easiest)

1. Open your app: http://localhost:3000
2. Open Developer Console (F12)
3. Paste and run:

```javascript
fetch("/api/test-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "your-email@example.com" }),
})
  .then((r) => r.json())
  .then((data) => console.log("✅ Result:", data));
```

### Method 2: cURL

```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

### Method 3: Check Configuration Status

```bash
curl http://localhost:3000/api/test-email
```

---

## 🎉 Success!

If you see this response:

```json
{
  "success": true,
  "message": "Test email sent successfully! Check your inbox.",
  "messageId": "abc123...",
  "timestamp": "2025-01-28T..."
}
```

**Check your inbox!** You should receive a test email from Volle.

---

## 🔧 Troubleshooting

### ❌ "Resend not configured"

**Fix:** Add `RESEND_API_KEY` to `.env.local` and restart server

### ❌ "Invalid API key"

**Fix:** Double-check your API key in Resend dashboard

### ❌ No email received

**Check:**

1. Spam folder
2. Email address is correct
3. Resend dashboard → Logs (see if email was sent)
4. You verified your email in Resend (for free accounts)

### ❌ "Rate limit exceeded"

**Info:** Free accounts have 100 emails/day limit. Verify your domain to remove limits.

---

## 📧 Available Email Functions

### 1. Order Confirmation Email

```typescript
import { sendOrderConfirmationEmail } from "@/services/emails/email.service";

// After order is created
await sendOrderConfirmationEmail(order, customerEmail);
```

**When to use:** After successful Stripe payment (in webhook handler)

### 2. Contact Form Email

```typescript
import { sendContactFormEmail } from "@/services/emails/email.service";

await sendContactFormEmail({
  name: "John Doe",
  email: "john@example.com",
  company: "Acme Corp",
  phone: "+1 234 567 8900",
  message: "I have a question...",
});
```

**When to use:** When someone submits contact form

### 3. Order Shipped Email

```typescript
import { sendOrderShippedEmail } from "@/services/emails/email.service";

await sendOrderShippedEmail(order, customerEmail, trackingNumber);
```

**When to use:** When order status changes to "shipped"

### 4. Test Email

```typescript
import { sendTestEmail } from "@/services/emails/email.service";

await sendTestEmail("test@example.com");
```

**When to use:** For testing configuration

---

## 🎯 Next: Integrate with Webhook

Add this to your Stripe webhook handler (`app/api/webhooks/stripe/route.ts`):

```typescript
// After this line:
const orderId = await createOrder(orderData);

// Add this:
// Send confirmation email
try {
  await sendOrderConfirmationEmail(await getOrderById(orderId), userEmail);
  console.log("✅ Order confirmation email sent");
} catch (error) {
  console.error("❌ Failed to send confirmation email:", error);
  // Don't fail the order if email fails
}
```

---

## 📊 Development vs Production

### Development Mode (Current)

- ✅ All emails go to `RESEND_TEST_EMAIL`
- ✅ Safe for testing
- ✅ 100 emails/day limit
- ✅ From address: `onboarding@resend.dev`

### Production Mode

- 🔒 Emails go to actual customers
- 🔒 Verify your domain first
- 🔒 No daily limits
- 🔒 From address: `orders@yourdomain.com`

**To go production:**

1. Verify your domain in Resend
2. Update `EMAIL_CONFIG.from` addresses in `lib/resend/config.ts`
3. Remove `RESEND_TEST_EMAIL` from `.env`

---

## 📚 Full Documentation

For complete details, see: `docs/RESEND-SETUP-GUIDE.md`

---

## ✅ Summary

**You have everything you need to send emails!**

**Just:**

1. Get API key from https://resend.com
2. Add to `.env.local`
3. Restart server
4. Test it!

**That's it! 🎉**

---

**Status:** 🟢 READY TO USE  
**Time to Complete:** ~5 minutes  
**Next Step:** Test sending an email!
