# Supabase Setup Guide

## Overview

This guide walks you through setting up Supabase for the Volle e-commerce platform, including project creation, authentication, and database configuration.

## Prerequisites

- ✅ Supabase account created
- ✅ Supabase dependencies installed (`@supabase/supabase-js`, `@supabase/ssr`)

## Step 1: Create Supabase Project

### 1.1 Create New Project

1. **Go to Supabase**: https://supabase.com
2. **Sign up/Login** with your account
3. **Create New Project**:
   - Click "New Project"
   - Choose your organization
   - **Project Name**: `volle-lux-catalog`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., US East, EU West)
   - Click "Create new project"

### 1.2 Wait for Project Setup

- Project creation takes 2-3 minutes
- You'll see a progress indicator
- Wait for "Project is ready" message

## Step 2: Get Project Credentials

### 2.1 Access API Settings

1. **Go to Settings → API** in your Supabase dashboard
2. **Copy these values** (you'll need them for environment variables):

```
Project URL: https://your-project-id.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.2 Save Credentials Securely

- Save these in a secure location
- Never commit them to version control
- Use environment variables for security

## Step 3: Configure Environment Variables

### 3.1 Create .env.local File

Create a `.env.local` file in your project root (if it doesn't exist):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.2 Replace Placeholder Values

Replace the placeholder values with your actual Supabase credentials:

- `NEXT_PUBLIC_SUPABASE_URL`: Your project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key

## Step 4: Configure Authentication Providers

### 4.1 Access Authentication Settings

1. **Go to Authentication → Settings** in Supabase dashboard
2. **Configure Site URL**:
   - Site URL: `http://localhost:3000` (for development)
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 4.2 Enable Email Authentication

1. **Go to Authentication → Providers**
2. **Enable Email**:
   - Toggle "Enable email confirmations" ON
   - Set confirmation email template
   - Configure email settings

### 4.3 Optional: Enable Social Providers

For future use, you can enable:

- Google OAuth
- GitHub OAuth
- Apple OAuth

## Step 5: Test Connection

### 5.1 Verify Environment Variables

Make sure your `.env.local` file is properly configured and restart your development server:

```bash
npm run dev
```

### 5.2 Check Supabase Dashboard

1. **Go to your Supabase project dashboard**
2. **Verify project is active**
3. **Check API status** (should be green)

## Step 6: Next Steps

After completing this setup:

1. **Task 2.2.2**: Database Schema Design
2. **Task 2.2.3**: Row Level Security (RLS) Policies
3. **Task 2.2.4**: Authentication Integration

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**:
   - Restart your development server
   - Check `.env.local` file location
   - Verify no typos in variable names

2. **Connection Errors**:
   - Verify project URL is correct
   - Check if project is active in Supabase dashboard
   - Ensure API keys are valid

3. **Authentication Issues**:
   - Check Site URL configuration
   - Verify redirect URLs are set correctly
   - Ensure email provider is enabled

### Verification Checklist

- [ ] Supabase project created successfully
- [ ] Project URL copied correctly
- [ ] API keys copied correctly
- [ ] Environment variables set in `.env.local`
- [ ] Development server restarted
- [ ] Supabase dashboard accessible
- [ ] No connection errors in console

## Security Notes

- **Never commit** `.env.local` to version control
- **Use environment variables** for all sensitive data
- **Rotate keys** regularly in production
- **Use service role key** only on server-side
- **Use anon key** for client-side operations

---

**Next**: Once this setup is complete, we'll proceed to Task 2.2.2 (Database Schema Design).
