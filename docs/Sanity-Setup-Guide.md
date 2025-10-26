# Environment Variables Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-10-26
SANITY_API_TOKEN=your_api_token_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration (Phase 2.2)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Stripe Configuration (Phase 2.3)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Resend Configuration (Phase 2.4)
RESEND_API_KEY=your_resend_api_key_here
```

## How to Get Sanity Values

### 1. Create Sanity Project

1. Go to [sanity.io](https://sanity.io)
2. Sign up/Login
3. Create a new project
4. Choose "E-commerce" template or start blank

### 2. Get Project ID and Dataset

1. In your Sanity project dashboard
2. Go to Settings → API
3. Copy the Project ID
4. Default dataset is usually "production"

### 3. Generate API Token

1. In Sanity project dashboard
2. Go to Settings → API
3. Click "Add API token"
4. Name it "Volle CMS Token"
5. Give it "Editor" permissions
6. Copy the token

## Next Steps

1. Create `.env.local` file with your actual values
2. Test Sanity Studio at `http://localhost:3000/admin-dashboard`
3. Proceed to Task 2.1.2: Define Content Schemas
