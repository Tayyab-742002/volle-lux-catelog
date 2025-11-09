/**
 * Supabase Service Role Client
 * ONLY use for admin operations and server-side logic that needs to bypass RLS
 * NEVER expose this client to the browser
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from './client'

/**
 * Create Supabase client with service role key
 * This bypasses Row Level Security (RLS) policies
 * USE WITH CAUTION - Only for trusted server-side code
 */
export function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing Supabase service role credentials. Please check your .env.local file.'
    )
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Export types
export type ServiceRoleClient = ReturnType<typeof createServiceRoleClient>

