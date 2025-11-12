/**
 * Supabase Client Configuration for Browser/Client Components
 * Reference: Architecture.md Section 4.3
 */

import { createBrowserClient } from "@supabase/ssr";

// Types for our database schema (will be generated later)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          company: string | null;
          role: 'customer' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          company?: string | null;
          role?: 'customer' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          company?: string | null;
          role?: 'customer' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          type: "shipping" | "billing";
          first_name: string;
          last_name: string;
          company: string | null;
          address_line_1: string;
          address_line_2: string | null;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          phone: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "shipping" | "billing";
          first_name: string;
          last_name: string;
          company?: string | null;
          address_line_1: string;
          address_line_2?: string | null;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          phone?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: "shipping" | "billing";
          first_name?: string;
          last_name?: string;
          company?: string | null;
          address_line_1?: string;
          address_line_2?: string | null;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
          phone?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      carts: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          items: any; // JSON array of cart items
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          items: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          items?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          email: string;
          status:
            | "pending"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled";
          total_amount: number;
          subtotal: number;
          discount: number;
          shipping: number;
          tax: number;
          currency: string;
          stripe_session_id: string | null;
          stripe_payment_intent_id: string | null;
          shipping_address: any; // JSON object
          billing_address: any; // JSON object
          items: any; // JSON array of order items
          notes: string | null;
          customer_name: string | null;
          customer_phone: string | null;
          tracking_number: string | null;
          shipped_at: string | null;
          delivered_at: string | null;
          cancelled_at: string | null;
          cancellation_reason: string | null;
          refund_amount: number | null;
          refund_status: "none" | "partial" | "full" | null;
          payment_method: string;
          metadata: any; // JSONB
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          email: string;
          status?:
            | "pending"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled";
          total_amount: number;
          subtotal?: number;
          discount?: number;
          shipping?: number;
          tax?: number;
          currency?: string;
          stripe_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          shipping_address: any;
          billing_address: any;
          items: any;
          notes?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          tracking_number?: string | null;
          shipped_at?: string | null;
          delivered_at?: string | null;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          refund_amount?: number | null;
          refund_status?: "none" | "partial" | "full" | null;
          payment_method?: string;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          email?: string;
          status?:
            | "pending"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled";
          total_amount?: number;
          subtotal?: number;
          discount?: number;
          shipping?: number;
          tax?: number;
          currency?: string;
          stripe_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          shipping_address?: any;
          billing_address?: any;
          items?: any;
          notes?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          tracking_number?: string | null;
          shipped_at?: string | null;
          delivered_at?: string | null;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          refund_amount?: number | null;
          refund_status?: "none" | "partial" | "full" | null;
          payment_method?: string;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      b2b_requests: {
        Row: {
          id: string;
          user_id: string | null;
          company_name: string;
          contact_name: string;
          email: string;
          phone: string;
          company_website: string | null;
          vat_number: string | null;
          products_interested: string;
          estimated_quantity: string;
          budget_range: string | null;
          preferred_delivery_date: string | null;
          delivery_address: any; // JSONB
          additional_notes: string | null;
          is_existing_customer: boolean;
          status: "pending" | "reviewed" | "quoted" | "converted" | "rejected";
          admin_notes: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          company_name: string;
          contact_name: string;
          email: string;
          phone: string;
          company_website?: string | null;
          vat_number?: string | null;
          products_interested: string;
          estimated_quantity: string;
          budget_range?: string | null;
          preferred_delivery_date?: string | null;
          delivery_address: any; // JSONB
          additional_notes?: string | null;
          is_existing_customer?: boolean;
          status?: "pending" | "reviewed" | "quoted" | "converted" | "rejected";
          admin_notes?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          company_name?: string;
          contact_name?: string;
          email?: string;
          phone?: string;
          company_website?: string | null;
          vat_number?: string | null;
          products_interested?: string;
          estimated_quantity?: string;
          budget_range?: string | null;
          preferred_delivery_date?: string | null;
          delivery_address?: any; // JSONB
          additional_notes?: string | null;
          is_existing_customer?: boolean;
          status?: "pending" | "reviewed" | "quoted" | "converted" | "rejected";
          admin_notes?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

/**
 * Create Supabase client for browser usage
 * Use this in client components and browser-side code
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check your .env.local file."
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Create Supabase client with service role key
 * Use this for admin operations that bypass RLS
 * NEVER use this in client-side code
 */
export function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase service role environment variables. Please check your .env.local file."
    );
  }

  return createBrowserClient<Database>(supabaseUrl, serviceRoleKey);
}

// Export types for use in other files
export type SupabaseClient = ReturnType<typeof createClient>;
export type ServiceRoleClient = ReturnType<typeof createServiceRoleClient>;
