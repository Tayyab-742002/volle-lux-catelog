# Sanity Webhook Setup for Vercel

## Problem

Changes made in Sanity CMS are not appearing on Vercel production because:

1. Next.js pages are statically generated and cached
2. Sanity CDN is caching data
3. No automatic revalidation when content changes

## Solution

Set up a Sanity webhook to automatically revalidate Next.js cache when content changes.

## Step 1: Get Your Revalidation Secret

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name**: `SANITY_REVALIDATE_SECRET`
   - **Value**: Generate a random secret (e.g., use `openssl rand -base64 32`)
   - **Environment**: Production (and Preview if needed)

## Step 2: Configure Sanity Webhook

1. Go to your Sanity project: https://www.sanity.io/manage
2. Select your project
3. Go to **API** → **Webhooks**
4. Click **Create webhook**
5. Configure the webhook:

   **Name**: `Vercel Revalidation`

   **URL**: `https://your-domain.vercel.app/api/revalidate/sanity?secret=YOUR_SECRET`

   **Dataset**: `production` (or your dataset name)

   **Trigger on**:
   - ✅ Create
   - ✅ Update
   - ✅ Delete

   **Filter** (optional): Leave empty to revalidate on all changes

   **HTTP method**: `POST`

   **API version**: `v2021-03-25` or later

   **Secret**: Leave empty (we use query param instead)

6. Click **Save**

## Step 3: Test the Webhook

1. Make a change in Sanity (e.g., update a product name)
2. Check Vercel logs to see if the webhook was called
3. Visit your production site - changes should appear within seconds

## Step 4: Manual Revalidation (Optional)

If you need to manually trigger revalidation:

```bash
# Using curl
curl -X POST "https://your-domain.vercel.app/api/revalidate/sanity?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"_type": "product", "slug": {"current": "your-product-slug"}}'
```

## Troubleshooting

### Changes still not appearing?

1. **Check Vercel environment variables**:
   - Ensure `SANITY_REVALIDATE_SECRET` is set in Production
   - Ensure `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are correct

2. **Check Sanity webhook logs**:
   - Go to Sanity → API → Webhooks
   - Click on your webhook to see delivery logs
   - Check for any errors

3. **Check Vercel function logs**:
   - Go to Vercel → Your Project → Functions
   - Check logs for `/api/revalidate/sanity`

4. **Verify webhook URL**:
   - Make sure the URL in Sanity webhook matches your Vercel domain
   - Use your production domain, not preview URLs

5. **Test manually**:
   - Try the manual revalidation curl command above
   - Check if it returns `{"revalidated": true}`

### Still having issues?

- Clear Vercel cache: Go to Vercel → Settings → Clear Build Cache
- Redeploy: Trigger a new deployment in Vercel
- Check Sanity dataset: Ensure you're editing in the correct dataset (production vs development)
