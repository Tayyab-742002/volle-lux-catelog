/**
 * Admin Authentication Utilities
 * Helper functions to check admin status and manage admin access
 * Reference: ADMIN_DASHBOARD_PLAN.md
 */

import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

export type AdminUser = User & {
  role: 'admin' | 'customer'
}

/**
 * Check if a user is an admin
 * Uses direct query to check role field for performance
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    if (!userId) {
      return false
    }

    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (error || !data) {
      console.error('Error fetching user role:', error)
      return false
    }

    // Type assertion because Supabase types don't know about role yet
    const userData = data as { role?: 'admin' | 'customer' }
    return userData?.role === 'admin'
  } catch (error) {
    console.error('Error in isAdmin:', error)
    return false
  }
}

/**
 * Get admin user with full details
 * Returns user with role information if they are an admin
 */
export async function getAdminUser(userId: string): Promise<AdminUser | null> {
  try {
    if (!userId) {
      return null
    }

    const supabase = await createServerSupabaseClient()
    
    // Get user from auth
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Error fetching auth user:', userError)
      return null
    }

    // Get role from users table
    const { data: userData, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (roleError || !userData) {
      console.error('Error fetching user role:', roleError)
      return null
    }

    // Type assertion because Supabase types don't know about role yet
    const roleData = userData as { role?: 'admin' | 'customer' }

    // Return null if not an admin
    if (roleData?.role !== 'admin') {
      return null
    }

    return {
      ...user,
      role: roleData.role
    }
  } catch (error) {
    console.error('Error in getAdminUser:', error)
    return null
  }
}

/**
 * Get current admin user from session
 * Convenience function for server components
 */
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    return await getAdminUser(user.id)
  } catch (error) {
    console.error('Error in getCurrentAdminUser:', error)
    return null
  }
}

