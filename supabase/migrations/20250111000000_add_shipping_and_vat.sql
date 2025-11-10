-- Add shipping and VAT columns to orders table
-- Migration: Add shipping method, shipping cost, VAT amount, and VAT rate

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS shipping_method TEXT,
ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS vat_amount DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS vat_rate DECIMAL(5, 4) DEFAULT 0.20;

-- Add comments for documentation
COMMENT ON COLUMN orders.shipping_method IS 'Selected shipping method (e.g., evri-48, evri-24, dhl-next-day, free-collection)';
COMMENT ON COLUMN orders.shipping_cost IS 'Cost of shipping in GBP';
COMMENT ON COLUMN orders.vat_amount IS 'VAT amount (20% of subtotal + shipping)';
COMMENT ON COLUMN orders.vat_rate IS 'VAT rate applied (default 0.20 for 20%)';

-- Create index for shipping method queries
CREATE INDEX IF NOT EXISTS idx_orders_shipping_method ON orders(shipping_method);

-- Update existing orders to have default values
UPDATE orders
SET 
  shipping_method = 'evri-48',
  shipping_cost = 2.99,
  vat_rate = 0.20
WHERE shipping_method IS NULL;

