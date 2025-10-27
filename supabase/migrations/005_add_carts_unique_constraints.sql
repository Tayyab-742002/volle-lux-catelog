-- Add unique constraints to carts table for upsert functionality
-- This migration should be run after 001_create_tables.sql

-- Add unique constraint on user_id
ALTER TABLE public.carts
ADD CONSTRAINT carts_user_id_unique UNIQUE (user_id);

-- Add unique constraint on session_id
ALTER TABLE public.carts
ADD CONSTRAINT carts_session_id_unique UNIQUE (session_id);

-- Add comment to explain the unique constraints
COMMENT ON CONSTRAINT carts_user_id_unique ON public.carts IS 'Ensures each user has only one cart';
COMMENT ON CONSTRAINT carts_session_id_unique ON public.carts IS 'Ensures each guest session has only one cart';

