/**
 * Authentication Context Provider
 * Provides authentication state and methods throughout the application
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
  const [supabase] = useState(() => createClient());

  // Load user profile from database
  const loadUserProfile = useCallback(async (retryCount = 0) => {
    try {
      // Get current user from auth
      const {
        data: { user: authUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !authUser) {
        if (retryCount < 2) {
          // Retry once if we get an error (might be a timing issue)
          setTimeout(() => loadUserProfile(retryCount + 1), 500);
          return;
        }
        console.error("Failed to get auth user:", userError?.message);
        setUser(null);
        return;
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileError || !profile) {
        if (retryCount < 2) {
          // Retry once if we get an error (might be a timing issue)
          setTimeout(() => loadUserProfile(retryCount + 1), 500);
          return;
        }
        console.error("Failed to fetch user profile:", profileError?.message);
        setUser(null);
        return;
      }

      // Type assertion needed because Supabase types need explicit schema
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
      if (retryCount < 2) {
        // Retry once if we get an error (might be a timing issue)
        setTimeout(() => loadUserProfile(retryCount + 1), 500);
        return;
      }
      console.error("Error loading user profile:", error);
      setUser(null);
    }
  }, [supabase]);

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
            await loadUserProfile();
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
      if (!mounted) return;
      
      // Set loading to true when auth state changes
      setLoading(true);
      
      if (session?.user) {
        await loadUserProfile();
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadUserProfile]);

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
        if (typeof window !== 'undefined') {
          window.location.href = '/';
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
        // Refresh user data
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
    // This prevents errors but the actual context will be available after hydration
    return {
      user: null,
      loading: true, // Keep loading true until context is available
      isAuthenticated: false,
      signIn: async () => ({ success: false, error: 'Not initialized' }),
      signUp: async () => ({ success: false, error: 'Not initialized' }),
      signOut: async () => ({ success: false, error: 'Not initialized' }),
      resetPassword: async () => ({ success: false, error: 'Not initialized' }),
      updatePassword: async () => ({ success: false, error: 'Not initialized' }),
      updateProfile: async () => ({ success: false, error: 'Not initialized' }),
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
