-- Migration 002: Create Database Indexes for Performance
-- Run this in your Supabase SQL Editor after running 001_create_tables.sql

-- ==============================================
-- PERFORMANCE INDEXES
-- ==============================================

-- Users table indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_created_at ON public.users(created_at);

-- Addresses table indexes
CREATE INDEX idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX idx_addresses_type ON public.addresses(type);
CREATE INDEX idx_addresses_user_type ON public.addresses(user_id, type);

-- Carts table indexes
CREATE INDEX idx_carts_user_id ON public.carts(user_id);
CREATE INDEX idx_carts_session_id ON public.carts(session_id);
CREATE INDEX idx_carts_updated_at ON public.carts(updated_at);

-- Orders table indexes
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_email ON public.orders(email);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_orders_stripe_session_id ON public.orders(stripe_session_id);
CREATE INDEX idx_orders_stripe_payment_intent_id ON public.orders(stripe_payment_intent_id);

-- Order items table indexes
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

-- Saved addresses table indexes
CREATE INDEX idx_saved_addresses_user_id ON public.saved_addresses(user_id);
CREATE INDEX idx_saved_addresses_user_default ON public.saved_addresses(user_id, is_default);

-- ==============================================
-- SUCCESS MESSAGE
-- ==============================================

-- This migration creates all performance indexes for the Volle e-commerce platform
-- Next: Run the triggers migration (003_create_triggers.sql)
