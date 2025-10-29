-- ========================================
-- Migration: Enhance Orders Table for Production
-- ========================================
-- This migration adds additional fields to the orders table
-- to capture all necessary information for a professional e-commerce store

-- Add new columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS refund_status TEXT CHECK (refund_status IN ('none', 'partial', 'full')) DEFAULT 'none',
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'card',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON public.orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id ON public.orders(stripe_payment_intent_id);

-- Add comment to document table structure
COMMENT ON TABLE public.orders IS 'Stores customer orders with full payment and shipping details';
COMMENT ON COLUMN public.orders.subtotal IS 'Order subtotal before tax, shipping, and discounts';
COMMENT ON COLUMN public.orders.discount IS 'Total discount amount applied (from promo codes)';
COMMENT ON COLUMN public.orders.shipping IS 'Shipping cost';
COMMENT ON COLUMN public.orders.tax IS 'Tax amount';
COMMENT ON COLUMN public.orders.total_amount IS 'Final total amount charged (subtotal + tax + shipping - discount)';
COMMENT ON COLUMN public.orders.customer_name IS 'Customer name from Stripe checkout';
COMMENT ON COLUMN public.orders.customer_phone IS 'Customer phone number';
COMMENT ON COLUMN public.orders.tracking_number IS 'Shipping tracking number (populated after fulfillment)';
COMMENT ON COLUMN public.orders.metadata IS 'Additional order metadata (JSON)';

-- Update existing orders to have proper subtotal values
-- (This ensures existing orders don't have NULL subtotals)
UPDATE public.orders 
SET subtotal = total_amount
WHERE subtotal IS NULL OR subtotal = 0;

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add view for order analytics (useful for admin dashboard)
CREATE OR REPLACE VIEW public.order_analytics AS
SELECT 
    DATE(created_at) as order_date,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as average_order_value,
    COUNT(DISTINCT user_id) as unique_customers,
    SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders
FROM public.orders
GROUP BY DATE(created_at)
ORDER BY order_date DESC;

-- Grant access to authenticated users to view their own orders
GRANT SELECT ON public.order_analytics TO authenticated;

