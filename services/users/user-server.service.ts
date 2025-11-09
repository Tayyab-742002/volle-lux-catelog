/**
 * User Service - Server-Side Only
 * Direct Supabase queries for server components
 */

import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { SavedAddress } from './user.service'

/**
 * Get all saved addresses for a user (Server-side only)
 * Uses server Supabase client for direct database access
 */
export async function getSavedAddresses(
  userId: string
): Promise<SavedAddress[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('saved_addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Error fetching saved addresses:', error)
    return []
  }

  return (data as unknown as SavedAddress[]) || []
}

/**
 * Get default saved address for a user (Server-side only)
 */
export async function getDefaultSavedAddress(
  userId: string
): Promise<SavedAddress | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('saved_addresses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .maybeSingle()

  if (error) {
    console.error('❌ Error fetching default saved address:', error)
    return null
  }

  return (data as unknown as SavedAddress) || null
}

