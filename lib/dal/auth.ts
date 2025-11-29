/**
 * Data Access Layer (DAL) for Authentication
 * Aligned with Next.js Authentication Guide: https://nextjs.org/docs/app/guides/authentication
 *
 * This DAL centralizes authentication logic and uses React's cache() for request memoization
 * during a single render pass, preventing duplicate database queries.
 */

import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AuthUser } from "@/services/auth/auth.service";

/**
 * Session data returned from verifySession
 * Contains minimal data needed for authorization checks
 */
export interface SessionData {
  isAuth: boolean;
  userId: string;
  userEmail: string;
  userRole?: "customer" | "admin";
}

/**
 * Verify user session
 *
 * This function is memoized using React's cache() to prevent duplicate
 * database queries during a single render pass.
 *
 * @returns SessionData if authenticated, otherwise redirects to login
 *
 * Usage in Server Components:
 * ```tsx
 * const session = await verifySession()
 * // session.userId is guaranteed to exist
 * ```
 */
export const verifySession = cache(async (): Promise<SessionData> => {
  const supabase = await createServerSupabaseClient();

  // Get current user from auth (Supabase handles session validation)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    // redirect() throws, so this will stop execution
    redirect("/auth/login");
  }

  // Fetch minimal user data for authorization checks
  // Using cache() means this won't be called multiple times in the same render pass
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, email, role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    // Profile doesn't exist - redirect to login
    // redirect() throws, so this will stop execution
    redirect("/auth/login");
  }

  // Type assertion for profile data
  const userProfile = profile as {
    id: string;
    email: string;
    role: "customer" | "admin" | null;
  };

  return {
    isAuth: true,
    userId: userProfile.id,
    userEmail: userProfile.email,
    userRole: userProfile.role || "customer",
  };
});

/**
 * Get current user (full profile)
 *
 * This function is memoized and should be used when you need the full user profile.
 * It calls verifySession() first to ensure the user is authenticated.
 *
 * @returns Full AuthUser object or null if not authenticated
 *
 * Usage in Server Components:
 * ```tsx
 * const user = await getCurrentUser()
 * if (!user) return null
 * // Use user.fullName, user.phone, etc.
 * ```
 */
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  try {
    // First verify session (this is also cached)
    const session = await verifySession();

    const supabase = await createServerSupabaseClient();

    // Fetch full user profile
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.userId)
      .single();

    if (profileError || !profile) {
      return null;
    }

    // Type assertion for profile data
    const userProfile = profile as {
      id: string;
      email: string;
      full_name: string | null;
      phone: string | null;
      company: string | null;
      avatar_url: string | null;
      role: "customer" | "admin";
      created_at: string;
      updated_at: string;
    };

    return {
      id: userProfile.id,
      email: userProfile.email,
      fullName: userProfile.full_name || undefined,
      phone: userProfile.phone || undefined,
      company: userProfile.company || undefined,
      avatarUrl: userProfile.avatar_url || undefined,
      role: userProfile.role || "customer",
      createdAt: userProfile.created_at,
      updatedAt: userProfile.updated_at,
    };
  } catch (error) {
    // verifySession() will redirect, but catch here for type safety
    return null;
  }
});

/**
 * Check if user is authenticated (non-redirecting)
 *
 * Use this when you want to check auth status without redirecting.
 * Useful for conditional rendering or API routes.
 *
 * @returns SessionData if authenticated, null otherwise
 */
export const getSession = cache(async (): Promise<SessionData | null> => {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    // Type assertion for profile data
    const userProfile = profile as {
      id: string;
      email: string;
      role: "customer" | "admin" | null;
    };

    return {
      isAuth: true,
      userId: userProfile.id,
      userEmail: userProfile.email,
      userRole: userProfile.role || "customer",
    };
  } catch {
    return null;
  }
});

/**
 * Check if user has admin role
 *
 * @returns true if user is authenticated and has admin role
 */
export const isAdmin = cache(async (): Promise<boolean> => {
  const session = await getSession();
  return session?.userRole === "admin";
});

/**
 * Require admin role
 *
 * Redirects to home if user is not an admin.
 * Use this in Server Components that require admin access.
 *
 * @returns SessionData with guaranteed admin role
 */
export const requireAdmin = cache(
  async (): Promise<SessionData & { userRole: "admin" }> => {
    const session = await verifySession();

    if (session.userRole !== "admin") {
      redirect("/");
    }

    return session as SessionData & { userRole: "admin" };
  }
);
