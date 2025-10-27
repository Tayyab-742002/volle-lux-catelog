/**
 * Authentication Context Provider
 * Provides authentication state and methods throughout the application
 */

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
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
  getCurrentUser,
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
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (mounted) {
          if (session?.user) {
            await loadUserProfile(session.user);
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load user profile from database
  const loadUserProfile = async (authUser: User) => {
    try {
      const result = await getCurrentUser();
      if (result.success && result.user) {
        setUser(result.user);
      } else {
        console.error("Failed to load user profile:", result.error);
        setUser(null);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      setUser(null);
    }
  };

  // Sign in method
  const handleSignIn = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
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
  };

  // Sign up method
  const handleSignUp = async (data: {
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
  };

  // Sign out method
  const handleSignOut = async (): Promise<AuthResult> => {
    setLoading(true);
    try {
      const result = await signOut();
      if (result.success) {
        setUser(null);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Reset password method
  const handleResetPassword = async (email: string): Promise<AuthResult> => {
    return await resetPassword({ email });
  };

  // Update password method
  const handleUpdatePassword = async (
    newPassword: string
  ): Promise<AuthResult> => {
    const result = await updatePassword(newPassword);
    if (result.success) {
      // Refresh user data
      await refreshUser();
    }
    return result;
  };

  // Update profile method
  const handleUpdateProfile = async (data: {
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
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    try {
      const result = await getCurrentUser();
      if (result.success && result.user) {
        setUser(result.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
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
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use authentication context
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
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

