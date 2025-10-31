/**
 * Authentication Service
 * Handles all authentication-related operations using Supabase Auth
 * Reference: Architecture.md Section 4.3
 */

import { createClient } from "@/lib/supabase/client";
import { User, AuthError } from "@supabase/supabase-js";

// Types for authentication
export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
  company?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface UpdateProfileData {
  fullName?: string;
  phone?: string;
  company?: string;
  avatarUrl?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  company?: string;
  avatarUrl?: string;
  role?: "customer" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
  message?: string;
}

/**
 * Sign up a new user
 * Creates a new user account and profile
 */
export async function signUp(data: SignUpData): Promise<AuthResult> {
  try {
    const supabase = createClient();

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName || "",
          phone: data.phone || "",
          company: data.company || "",
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/login`,
      },
    });

    if (authError) {
      return {
        success: false,
        error: authError.message,
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Failed to create user account",
      };
    }

    // Create user profile using API route (bypasses RLS)
    try {
      const response = await fetch("/api/auth/create-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: authData.user.id,
          email: authData.user.email,
          fullName: data.fullName,
          phone: data.phone,
          company: data.company,
        }),
      });

      const profileResult = await response.json();
      if (!response.ok && profileResult.created !== false) {
        console.error("Error creating user profile:", profileResult.error);
      }
    } catch (error) {
      console.error("Error calling create-profile API:", error);
      // Continue anyway - trigger might have created it or user can update profile later
    }

    // Fetch the profile to return
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      // Return basic user info even if profile doesn't exist
      return {
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          fullName: data.fullName,
          phone: data.phone,
          company: data.company,
          role: "customer",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        message:
          "Account created successfully. Please check your email to verify your account.",
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
        role: (profile as any).role || "customer",
        createdAt: (profile as any).created_at,
        updatedAt: (profile as any).updated_at,
      },
      message:
        "Account created successfully. Please check your email to verify your account.",
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
 * Sign in an existing user
 * Authenticates user and returns user data
 */
export async function signIn(data: SignInData): Promise<AuthResult> {
  try {
    const supabase = createClient();

    // Sign in the user
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

    if (authError) {
      return {
        success: false,
        error: authError.message,
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Failed to sign in",
      };
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
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
        role: (profile as any).role || "customer",
        createdAt: (profile as any).created_at,
        updatedAt: (profile as any).updated_at,
      },
      message: "Signed in successfully",
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
 * Sign out the current user
 * Clears the user session
 */
export async function signOut(): Promise<AuthResult> {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Signed out successfully",
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
 * Reset password for a user
 * Sends password reset email
 */
export async function resetPassword(
  data: ResetPasswordData
): Promise<AuthResult> {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Password reset email sent. Please check your email.",
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
 * Update user password
 * Updates the password for the current user
 */
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Password updated successfully",
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
 * Update user profile
 * Updates the user's profile information
 */
export async function updateProfile(
  data: UpdateProfileData
): Promise<AuthResult> {
  try {
    const supabase = createClient();

    // Get current user
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

    // Update profile in database
    const { data: profile, error: profileError } = await (supabase as any)
      .from("users")
      .update({
        full_name: data.fullName,
        phone: data.phone,
        company: data.company,
        avatar_url: data.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (profileError) {
      return {
        success: false,
        error: profileError.message,
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
        role: (profile as any).role || "customer",
        createdAt: (profile as any).created_at,
        updatedAt: (profile as any).updated_at,
      },
      message: "Profile updated successfully",
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
 * Get current user
 * Returns the current authenticated user
 */
export async function getCurrentUser(): Promise<AuthResult> {
  try {
    const supabase = createClient();

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
        role: (profile as any).role || "customer",
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
 * Check if user is authenticated
 * Returns true if user is logged in
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const result = await getCurrentUser();
    return result.success;
  } catch {
    return false;
  }
}
