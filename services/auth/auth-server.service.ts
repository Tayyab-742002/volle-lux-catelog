/**
 * Server-Side Authentication Service
 * For server components, API routes, and middleware
 * Reference: Architecture.md Section 4.3
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AuthResult } from "./auth.service";

/**
 * Get current user (server-side)
 * Returns the current authenticated user from server context
 */
export async function getCurrentUserServer(): Promise<AuthResult> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current user from auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return {
        success: false,
        error: "Failed to fetch user profile",
      };
    }

    return {
      success: true,
      user: {
        id: (profile as any).id,
        email: (profile as any).email,
        fullName: (profile as any).full_name,
        phone: (profile as any).phone,
        company: (profile as any).company,
        avatarUrl: (profile as any).avatar_url,
        createdAt: (profile as any).created_at,
        updatedAt: (profile as any).updated_at,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Check if user is authenticated (server-side)
 * Returns true if user is logged in
 */
export async function isAuthenticatedServer(): Promise<boolean> {
  try {
    const result = await getCurrentUserServer();
    return result.success;
  } catch {
    return false;
  }
}
