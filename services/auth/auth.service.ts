/**
 * Authentication Service
 * Handles all authentication-related operations using Supabase Auth
 * Reference: Architecture.md Section 4.3
 */

import { createClient } from "@/lib/supabase/client";

// Type for user profile from database
type UserProfile = {
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

export interface VerifyOTPData {
  email: string;
  token: string;
  type?: "signup" | "email" | "recovery";
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

    // Sign up the user with OTP verification (no email link)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName || "",
          phone: data.phone || "",
          company: data.company || "",
        },
        // Don't use emailRedirectTo - we'll use OTP instead
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
    // Add timeout to prevent hanging
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

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
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // if (response.ok) {
      //   const profileResult = await response.json();
      //   console.log("Profile creation result:", profileResult);
      // } else {
      //   console.warn(
      //     "Profile creation failed, but continuing (trigger might create it)"
      //   );
      // }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.warn("Profile creation timed out - continuing anyway");
      } else {
        console.error("Error calling create-profile API:", error);
      }
      // Continue anyway - trigger might have created it or user can update profile later
    }

    // Wait a moment for any database triggers to complete
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Fetch the profile to return (with retry)
    let profile = null;

    // Try to fetch profile with retry
    for (let i = 0; i < 2; i++) {
      const { data: fetchedProfile, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (fetchedProfile) {
        profile = fetchedProfile;
        break;
      }

      // Wait before retry
      if (i === 0) await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Build user object from profile or fallback to signup data
    const typedProfile = profile as UserProfile | null;

    const userResult: AuthUser = typedProfile
      ? {
          id: typedProfile.id,
          email: typedProfile.email,
          fullName: typedProfile.full_name || data.fullName,
          phone: typedProfile.phone || data.phone,
          company: typedProfile.company || data.company,
          avatarUrl: typedProfile.avatar_url || undefined,
          role: typedProfile.role || "customer",
          createdAt: typedProfile.created_at || new Date().toISOString(),
          updatedAt: typedProfile.updated_at || new Date().toISOString(),
        }
      : {
          id: authData.user.id,
          email: authData.user.email!,
          fullName: data.fullName,
          phone: data.phone,
          company: data.company,
          role: "customer" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

    // Send OTP code to user's email
    try {
      await supabase.auth.resend({
        type: "signup",
        email: data.email,
      });
    } catch (otpError) {
      console.warn("Failed to send OTP code:", otpError);
      // Continue anyway - Supabase might have already sent it
    }

    // Return success - auth account is created
    return {
      success: true,
      user: userResult,
      message:
        "Account created successfully. Please check your email for the verification code.",
    };
  } catch (error) {
    console.error("Signup error:", error);
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

    const typedProfile = profile as UserProfile;

    return {
      success: true,
      user: {
        id: typedProfile.id,
        email: typedProfile.email,
        fullName: typedProfile.full_name || undefined,
        phone: typedProfile.phone || undefined,
        company: typedProfile.company || undefined,
        avatarUrl: typedProfile.avatar_url || undefined,
        role: typedProfile.role || "customer",
        createdAt: typedProfile.created_at,
        updatedAt: typedProfile.updated_at,
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
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/auth/reset-password`,
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
 * Verify OTP code for email confirmation
 * Verifies the OTP code sent to user's email
 */
export async function verifyOTP(data: VerifyOTPData): Promise<AuthResult> {
  try {
    const supabase = createClient();

    // Verify OTP
    const { data: authData, error: verifyError } = await supabase.auth.verifyOtp({
      email: data.email,
      token: data.token,
      type: data.type || "signup",
    });

    if (verifyError) {
      return {
        success: false,
        error: verifyError.message,
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Failed to verify OTP",
      };
    }

    // Fetch user profile after verification
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116 is "not found" - profile might not exist yet
      console.warn("Profile not found after OTP verification:", profileError);
    }

    const typedProfile = profile as UserProfile | null;

    return {
      success: true,
      user: typedProfile
        ? {
            id: typedProfile.id,
            email: typedProfile.email,
            fullName: typedProfile.full_name || undefined,
            phone: typedProfile.phone || undefined,
            company: typedProfile.company || undefined,
            avatarUrl: typedProfile.avatar_url || undefined,
            role: typedProfile.role || "customer",
            createdAt: typedProfile.created_at,
            updatedAt: typedProfile.updated_at,
          }
        : {
            id: authData.user.id,
            email: authData.user.email!,
            role: "customer" as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
      message: "Email verified successfully",
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
 * Resend OTP code to user's email
 * Resends the OTP code for email verification
 */
export async function resendOTP(email: string): Promise<AuthResult> {
  try {
    const supabase = createClient();

    // Resend OTP for signup
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      message: "OTP code sent. Please check your email.",
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    const typedProfile = profile as UserProfile;

    return {
      success: true,
      user: {
        id: typedProfile.id,
        email: typedProfile.email,
        fullName: typedProfile.full_name || undefined,
        phone: typedProfile.phone || undefined,
        company: typedProfile.company || undefined,
        avatarUrl: typedProfile.avatar_url || undefined,
        role: typedProfile.role || "customer",
        createdAt: typedProfile.created_at,
        updatedAt: typedProfile.updated_at,
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

    const typedProfile = profile as UserProfile;

    return {
      success: true,
      user: {
        id: typedProfile.id,
        email: typedProfile.email,
        fullName: typedProfile.full_name || undefined,
        phone: typedProfile.phone || undefined,
        company: typedProfile.company || undefined,
        avatarUrl: typedProfile.avatar_url || undefined,
        role: typedProfile.role || "customer",
        createdAt: typedProfile.created_at,
        updatedAt: typedProfile.updated_at,
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
