-- Migration 011: Create B2B Requests Table
-- This table stores custom bulk order requests from B2B customers

-- ==============================================
-- B2B REQUESTS TABLE
-- ==============================================

CREATE TABLE public.b2b_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  
  -- Company Information
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_website TEXT,
  vat_number TEXT,
  
  -- Request Details
  products_interested TEXT NOT NULL, -- Can be JSON array or comma-separated list
  estimated_quantity TEXT NOT NULL, -- e.g., "1000-5000" or "5000+"
  budget_range TEXT, -- e.g., "£1,000-£5,000"
  preferred_delivery_date DATE,
  
  -- Delivery Address
  delivery_address JSONB NOT NULL, -- Full address object
  
  -- Additional Information
  additional_notes TEXT,
  is_existing_customer BOOLEAN DEFAULT false,
  
  -- Status Tracking
  status TEXT CHECK (status IN ('pending', 'reviewed', 'quoted', 'converted', 'rejected')) DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.b2b_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Anyone can create a B2B request (public access)
CREATE POLICY "Anyone can create B2B requests" ON public.b2b_requests
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);

-- Users can view their own requests
CREATE POLICY "Users can view own B2B requests" ON public.b2b_requests
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all requests (handled via service role)
-- Regular users cannot update/delete (only admins via service role)

-- Create indexes for performance
CREATE INDEX idx_b2b_requests_user_id ON public.b2b_requests(user_id);
CREATE INDEX idx_b2b_requests_status ON public.b2b_requests(status);
CREATE INDEX idx_b2b_requests_created_at ON public.b2b_requests(created_at DESC);
CREATE INDEX idx_b2b_requests_email ON public.b2b_requests(email);

-- Add comment
COMMENT ON TABLE public.b2b_requests IS 'Stores B2B bulk order custom requests from business customers';
COMMENT ON COLUMN public.b2b_requests.status IS 'Request status: pending, reviewed, quoted, converted, rejected';

