-- ==============================================
-- Migration: Add Admin Role to Users Table
-- ==============================================
-- This migration adds a role field to distinguish admin users from regular customers
-- Date: January 2025
-- ==============================================

-- Create role enum type
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add role column to users table with enum type
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'customer';

-- Add index for admin queries
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Add comment to document the role field
COMMENT ON COLUMN public.users.role IS 'User role: customer (default) or admin';

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on function
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated, anon;

-- Add comment for the function
COMMENT ON FUNCTION is_admin(UUID) IS 'Check if a user has admin role';

-- ==============================================
-- Optional: Create admin user helper function
-- ==============================================

CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Update user role to admin
  UPDATE public.users
  SET role = 'admin'
  WHERE id = target_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION make_user_admin(TEXT) TO authenticated;

-- Add comment for the function
COMMENT ON FUNCTION make_user_admin(TEXT) IS 'Make a user an admin by email';

-- ==============================================
-- Example: Make an existing user an admin
-- ==============================================
-- Run this manually to make a specific user an admin:
-- SELECT make_user_admin('your-admin-email@example.com');

-- ==============================================
-- SUCCESS MESSAGE
-- ==============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Migration 010 Complete';
  RAISE NOTICE 'Added admin role to users table';
  RAISE NOTICE 'Created helper functions for admin checks';
  RAISE NOTICE '========================================';
END $$;

