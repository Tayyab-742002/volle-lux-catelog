/**
 * Authentication Test Page
 * This page tests the authentication system and displays auth status
 * Access at: /test-auth
 */

"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Mail, Calendar, Building, Phone } from "lucide-react";

export default function TestAuthPage() {
  const { user, isAuthenticated, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">
              Loading authentication status...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Authentication Test</h1>

      {/* Authentication Status */}
      <div className="mb-8">
        <Alert
          className={
            isAuthenticated
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }
        >
          <AlertDescription
            className={isAuthenticated ? "text-green-800" : "text-red-800"}
          >
            {isAuthenticated
              ? "✅ User is authenticated"
              : "❌ User is not authenticated"}
          </AlertDescription>
        </Alert>
      </div>

      {/* User Information */}
      {isAuthenticated && user ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" strokeWidth={1.5} />
              User Profile
            </CardTitle>
            <CardDescription>
              Current authenticated user information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail
                  className="h-4 w-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              {user.fullName && (
                <div className="flex items-center gap-2">
                  <User
                    className="h-4 w-4 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <div>
                    <p className="text-sm font-medium">Full Name</p>
                    <p className="text-sm text-muted-foreground">
                      {user.fullName}
                    </p>
                  </div>
                </div>
              )}

              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone
                    className="h-4 w-4 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {user.phone}
                    </p>
                  </div>
                </div>
              )}

              {user.company && (
                <div className="flex items-center gap-2">
                  <Building
                    className="h-4 w-4 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <div>
                    <p className="text-sm font-medium">Company</p>
                    <p className="text-sm text-muted-foreground">
                      {user.company}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar
                  className="h-4 w-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Not Authenticated</CardTitle>
            <CardDescription>
              You need to sign in to view your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                To test the authentication system, please sign in or create an
                account.
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <a href="/auth/login">Sign In</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/auth/signup">Sign Up</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Authentication Features */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Authentication Features</CardTitle>
          <CardDescription>
            Available authentication functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">User Management</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ User registration</li>
                <li>✅ User login</li>
                <li>✅ User logout</li>
                <li>✅ Password reset</li>
                <li>✅ Profile updates</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Session Management</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ Persistent sessions</li>
                <li>✅ Auto-refresh tokens</li>
                <li>✅ Cross-tab sync</li>
                <li>✅ Secure logout</li>
                <li>✅ Session validation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
          <CardDescription>
            How to test the authentication system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Test User Registration</h3>
              <p className="text-sm text-muted-foreground">
                Go to{" "}
                <a href="/auth/signup" className="text-primary hover:underline">
                  /auth/signup
                </a>{" "}
                and create a new account. Check your email for verification (if
                email verification is enabled).
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Test User Login</h3>
              <p className="text-sm text-muted-foreground">
                Go to{" "}
                <a href="/auth/login" className="text-primary hover:underline">
                  /auth/login
                </a>{" "}
                and sign in with your credentials. You should be redirected to
                the account dashboard.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                3. Test Session Persistence
              </h3>
              <p className="text-sm text-muted-foreground">
                After signing in, refresh this page. Your authentication status
                should persist. Try opening the site in a new tab - you should
                remain signed in.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. Test Password Reset</h3>
              <p className="text-sm text-muted-foreground">
                Go to{" "}
                <a
                  href="/auth/forgot-password"
                  className="text-primary hover:underline"
                >
                  /auth/forgot-password
                </a>{" "}
                and request a password reset. Check your email for reset
                instructions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">5. Test Protected Routes</h3>
              <p className="text-sm text-muted-foreground">
                Try accessing{" "}
                <a href="/account" className="text-primary hover:underline">
                  /account
                </a>{" "}
                without being signed in. You should be redirected to the login
                page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

