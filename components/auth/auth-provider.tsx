/**
 * Authentication Context Provider
 * Simplified, production-ready implementation following Supabase best practices
 * Reference: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
 */

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { createClient } from "@/lib/supabase/client";
import {
  AuthUser,
  AuthResult,
  signIn,
  signUp,
  signOut,
  resetPassword,
  updatePassword,
  updateProfile,
  verifyOTP,
  resendOTP,
} from "@/services/auth/auth.service";

interface AuthContextType {
  // State
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;

  // Methods
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (data: {
    email: string;
    password: string;
    fullName?: string;
    phone?: string;
    company?: string;
  }) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<AuthResult>;
  updateProfile: (data: {
    fullName?: string;
    phone?: string;
    company?: string;
    avatarUrl?: string;
  }) => Promise<AuthResult>;
  verifyOTP: (
    email: string,
    token: string,
    type?: "signup" | "email" | "recovery"
  ) => Promise<AuthResult>;
  resendOTP: (email: string) => Promise<AuthResult>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());

  // Load user profile from database
  const loadUserProfile = useCallback(async (): Promise<void> => {
    try {
      // Get current user from Supabase Auth
      const {
        data: { user: authUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !authUser) {
        setUser(null);
        return;
      }

      // Fetch user profile from database
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileError || !profile) {
        setUser(null);
        return;
      }

      // Transform profile data
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

      setUser({
        id: userProfile.id,
        email: userProfile.email,
        fullName: userProfile.full_name || undefined,
        phone: userProfile.phone || undefined,
        company: userProfile.company || undefined,
        avatarUrl: userProfile.avatar_url || undefined,
        role: userProfile.role || "customer",
        createdAt: userProfile.created_at,
        updatedAt: userProfile.updated_at,
      });
    } catch (error) {
      console.error("Error loading user profile:", error);
      setUser(null);
    }
  }, [supabase]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          await loadUserProfile();
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    // This is the recommended pattern from Supabase docs
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      // Handle sign out
      if (event === "SIGNED_OUT" || !session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      // For TOKEN_REFRESHED events, don't reload if user is already loaded
      // This prevents the profile icon from disappearing when switching tabs
      // TOKEN_REFRESHED fires when tab regains focus - we don't need to reload
      if (event === "TOKEN_REFRESHED") {
        if (user && user.id === session.user.id) {
          // User is already loaded and token refreshed - no action needed
          // This keeps the UI stable when switching tabs
          return;
        }
        // If user is not loaded but token refreshed, load profile silently (no loading state)
        if (session?.user) {
          try {
            await loadUserProfile();
          } catch (error) {
            console.error(
              "Error loading user profile on token refresh:",
              error
            );
            // Don't clear user on error during token refresh - might be temporary
          }
        }
        return;
      }

      // For SIGNED_IN, USER_UPDATED events - these require a full reload
      if (session?.user) {
        // Only set loading if user is not already loaded
        // This prevents UI flicker when user is already authenticated
        if (!user) {
          setLoading(true);
        }
        try {
          await loadUserProfile();
        } catch (error) {
          console.error("Error loading user profile on auth change:", error);
          setUser(null);
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadUserProfile, user]);

  // Sign in method
  const handleSignIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setLoading(true);
      try {
        const result = await signIn({ email, password });
        if (result.success && result.user) {
          setUser(result.user);
        }
        return result;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Sign up method
  const handleSignUp = useCallback(
    async (data: {
      email: string;
      password: string;
      fullName?: string;
      phone?: string;
      company?: string;
    }): Promise<AuthResult> => {
      setLoading(true);
      try {
        const result = await signUp(data);
        if (result.success && result.user) {
          setUser(result.user);
        }
        return result;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Sign out method
  const handleSignOut = useCallback(async (): Promise<AuthResult> => {
    setLoading(true);
    try {
      const result = await signOut();
      if (result.success) {
        setUser(null);
        // Force redirect to home page after signout
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset password method
  const handleResetPassword = useCallback(
    async (email: string): Promise<AuthResult> => {
      return await resetPassword({ email });
    },
    []
  );

  // Refresh user data
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      await loadUserProfile();
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
    }
  }, [loadUserProfile]);

  // Update password method
  const handleUpdatePassword = useCallback(
    async (newPassword: string): Promise<AuthResult> => {
      const result = await updatePassword(newPassword);
      if (result.success) {
        await refreshUser();
      }
      return result;
    },
    [refreshUser]
  );

  // Update profile method
  const handleUpdateProfile = useCallback(
    async (data: {
      fullName?: string;
      phone?: string;
      company?: string;
      avatarUrl?: string;
    }): Promise<AuthResult> => {
      const result = await updateProfile(data);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    },
    []
  );

  // Verify OTP method
  const handleVerifyOTP = useCallback(
    async (
      email: string,
      token: string,
      type?: "signup" | "email" | "recovery"
    ): Promise<AuthResult> => {
      setLoading(true);
      try {
        const result = await verifyOTP({ email, token, type });
        if (result.success && result.user) {
          setUser(result.user);
        }
        return result;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Resend OTP method
  const handleResendOTP = useCallback(
    async (email: string): Promise<AuthResult> => {
      return await resendOTP(email);
    },
    []
  );

  const value = useMemo<AuthContextType>(
    () => ({
      // State
      user,
      loading,
      isAuthenticated: !!user,

      // Methods
      signIn: handleSignIn,
      signUp: handleSignUp,
      signOut: handleSignOut,
      resetPassword: handleResetPassword,
      updatePassword: handleUpdatePassword,
      updateProfile: handleUpdateProfile,
      verifyOTP: handleVerifyOTP,
      resendOTP: handleResendOTP,
      refreshUser,
    }),
    [
      user,
      loading,
      handleSignIn,
      handleSignUp,
      handleSignOut,
      handleResetPassword,
      handleUpdatePassword,
      handleUpdateProfile,
      handleVerifyOTP,
      handleResendOTP,
      refreshUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use authentication context
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    // During SSR or before provider mounts, return a safe default
    return {
      user: null,
      loading: true,
      isAuthenticated: false,
      signIn: async () => ({ success: false, error: "Not initialized" }),
      signUp: async () => ({ success: false, error: "Not initialized" }),
      signOut: async () => ({ success: false, error: "Not initialized" }),
      resetPassword: async () => ({ success: false, error: "Not initialized" }),
      updatePassword: async () => ({
        success: false,
        error: "Not initialized",
      }),
      updateProfile: async () => ({ success: false, error: "Not initialized" }),
      verifyOTP: async () => ({ success: false, error: "Not initialized" }),
      resendOTP: async () => ({ success: false, error: "Not initialized" }),
      refreshUser: async () => {},
    } as AuthContextType;
  }

  return context;
}

/**
 * Hook to check if user is authenticated
 * Returns true if user is logged in
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

/**
 * Hook to get current user
 * Returns the current user or null
 */
export function useUser(): AuthUser | null {
  const { user } = useAuth();
  return user;
}

/**
 * Hook to check if auth is loading
 * Returns true if authentication state is being determined
 */
export function useAuthLoading(): boolean {
  const { loading } = useAuth();
  return loading;
}
