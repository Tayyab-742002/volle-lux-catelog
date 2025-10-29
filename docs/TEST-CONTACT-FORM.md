# 🧪 Test Contact Form - Quick Guide

## Prerequisites (1 minute)

**Required:**

```env
# In .env.local
RESEND_API_KEY=re_your_key_here
RESEND_TEST_EMAIL=your-email@example.com  # Where emails will go in dev
```

**Server running:**

```bash
npm run dev
```

---

## 🚀 Quick Test (3 minutes)

### Step 1: Open Contact Form

Go to: http://localhost:3000/contact

### Step 2: Fill Out Form

**Required fields:**

```
Name: Test User
Email: test@example.com
Subject: Testing Contact Form
Message: This is a test message to verify the contact form integration with Resend email service works correctly.
```

**Optional fields (test these too):**

```
Company: Test Company Inc.
Phone: +1 (555) 123-4567
```

### Step 3: Submit

1. Click "Send Message"
2. Watch button change to "Sending..."
3. Wait for success message

### Step 4: Verify Results

**✅ On Screen:**

- Success message: "Thank you! Your message has been sent successfully."
- Form resets to empty
- Page scrolls to top

**✅ Terminal:**

```
✅ Contact form email sent for Test User (test@example.com) - Message ID: abc123...
```

**✅ Email Inbox:**

- Check inbox for `RESEND_TEST_EMAIL` address
- Subject: "New Contact Form Submission"
- From: "Volle Support" or similar
- Contains all form data

---

## ✅ What to Verify in Email

- [ ] **Header:** Professional formatting
- [ ] **Timestamp:** Submission date/time shown
- [ ] **Name:** "Test User"
- [ ] **Email:** test@example.com (clickable mailto link)
- [ ] **Company:** "Test Company Inc." (if provided)
- [ ] **Phone:** "+1 (555) 123-4567" (clickable tel link, if provided)
- [ ] **Message:** Full message text displayed
- [ ] **Reply Button:** "Reply to Test User" button present
- [ ] **Footer:** Professional footer with note

---

## 🧪 Additional Tests

### Test 1: Validation

**Missing Name:**

1. Leave name field empty
2. Try to submit
3. ✅ Browser validation stops submission

**Invalid Email:**

1. Enter "not-an-email"
2. Try to submit
3. ✅ Browser validation shows error

**Empty Message:**

1. Leave message empty
2. Try to submit
3. ✅ Browser validation stops submission

### Test 2: Optional Fields

**Without Optional Fields:**

1. Fill only required fields (name, email, subject, message)
2. Leave company and phone empty
3. Submit

**Expected:**

- ✅ Submission succeeds
- ✅ Email doesn't show company/phone sections

**With Optional Fields:**

1. Fill all fields including company and phone
2. Submit

**Expected:**

- ✅ Email shows all fields
- ✅ Company and phone displayed

### Test 3: Rate Limiting

**Rapid Submissions:**

1. Submit form
2. Immediately fill and submit again
3. Repeat 5 times total

**Expected:**

- ✅ First 5 submissions succeed
- ✅ 6th submission shows error:
  ```
  "Too many submissions. Please try again later."
  ```

**Wait and Retry:**

1. Wait 1 hour
2. Submit again
3. ✅ Works again

### Test 4: Error Handling

**No Resend API Key:**

1. Remove `RESEND_API_KEY` from `.env.local`
2. Restart server
3. Submit form

**Expected:**

- ✅ Error message: "Failed to send message. Please try again later."
- ✅ Form not reset
- ✅ User can retry

**Restore:**

1. Add `RESEND_API_KEY` back
2. Restart server
3. ✅ Works again

---

## 🔍 Troubleshooting

### ❌ No Success Message

**Check:**

1. Browser console for errors
2. Network tab - is API call successful?
3. Terminal logs - any errors?

**Fix:**

- Check API key is set
- Restart server
- Clear browser cache

### ❌ No Email Received

**Check:**

1. Spam folder
2. `RESEND_TEST_EMAIL` is set correctly
3. Resend dashboard for sent emails
4. Terminal shows success message

**Terminal should show:**

```
✅ Contact form email sent for Test User (test@example.com)
```

### ❌ Rate Limit Error Immediately

**Cause:** You hit the rate limit in previous tests

**Fix:**

- Wait 1 hour
- Or restart server (clears in-memory rate limit)
- Or increase limit in code temporarily

### ❌ Form Doesn't Reset

**Check:**

- Success message appears?
- Check browser console for errors
- Try manual page refresh

---

## 📧 Email Delivery Check

### Resend Dashboard

1. Go to: https://resend.com/dashboard
2. Click "Emails" or "Logs"
3. Look for recent contact form email
4. Check status: "Delivered" or "Pending"

**If "Failed":**

- Click for details
- Check error message
- Verify email address
- Check domain verification

---

## ✅ Success Checklist

Mark complete when:

- [ ] Form submits without errors
- [ ] Success message displays
- [ ] Form resets after submission
- [ ] Terminal shows success log
- [ ] Email received in inbox
- [ ] Email contains all form data
- [ ] Reply button works
- [ ] Optional fields work correctly
- [ ] Rate limiting works (5 submissions)
- [ ] Validation prevents empty fields
- [ ] Error messages are user-friendly

---

## 🎯 Quick Reference

**Test URL:** http://localhost:3000/contact

**API Endpoint:** `/api/contact` (POST)

**Required Fields:**

- Name
- Email
- Subject
- Message

**Optional Fields:**

- Company
- Phone

**Rate Limit:** 5 submissions per hour per IP

**Expected Response Time:** 1-3 seconds

---

## 📊 Test Scenarios Summary

| Test               | What to Check             | Expected Result                |
| ------------------ | ------------------------- | ------------------------------ |
| Basic submission   | All fields filled         | ✅ Success message, email sent |
| Missing required   | Leave name empty          | ✅ Browser validation error    |
| Invalid email      | Enter "test"              | ✅ Browser validation error    |
| Optional fields    | Fill company/phone        | ✅ Shows in email              |
| No optional fields | Leave company/phone empty | ✅ Not shown in email          |
| Rate limit         | Submit 6 times quickly    | ✅ 6th fails with error        |
| No API key         | Remove from .env          | ✅ Error message shown         |
| Long message       | 1000+ characters          | ✅ Sends successfully          |

---

## 🚀 Production Testing

Before going live:

1. **Remove test mode:**
   - Remove `RESEND_TEST_EMAIL` from production `.env`
   - Emails will go to actual support address

2. **Test with real email:**
   - Use your actual email
   - Verify delivery
   - Check formatting

3. **Test from different IPs:**
   - Test rate limiting
   - Verify it works correctly

4. **Monitor for 24 hours:**
   - Check Resend dashboard
   - Look for any issues
   - Monitor spam reports

---

**Time to Complete:** ~5 minutes  
**Status:** Ready to test!  
**Documentation:** See `docs/TASK-2.4.3-COMPLETE.md` for full details
