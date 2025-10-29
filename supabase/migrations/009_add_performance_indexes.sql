-- ==============================================
-- Migration: Add High-Value Performance Indexes
-- Date: 2024-12
-- Notes: Uses IF NOT EXISTS to be idempotent
-- ==============================================

-- Carts
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_session_id ON public.carts(session_id);
CREATE INDEX IF NOT EXISTS idx_carts_updated_at ON public.carts(updated_at);

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON public.orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_intent ON public.orders(stripe_payment_intent_id);

-- Saved Addresses (some may already exist; safe with IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_saved_addresses_user_id ON public.saved_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_addresses_default ON public.saved_addresses(user_id, is_default);
CREATE INDEX IF NOT EXISTS idx_saved_addresses_created_at ON public.saved_addresses(created_at);

-- Products/variants tables are assumed managed by Sanity; DB indexes here target transactional tables only

-- Success banner
DO $$
BEGIN
  RAISE NOTICE '✅ Performance indexes ensured (009)';
END $$;


