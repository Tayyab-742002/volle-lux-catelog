"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";

export default function TestAuthPage() {
  const { user, isAuthenticated, signIn, signOut, loading } = useAuth();
  const [testResults, setTestResults] = useState<{
    authUserExists: boolean;
    profileInUsersTable: boolean;
    error?: string;
  }>({
    authUserExists: false,
    profileInUsersTable: false,
  });
  const [isTesting, setIsTesting] = useState(false);

  const testAuthIntegration = async () => {
    setIsTesting(true);
    setTestResults({
      authUserExists: false,
      profileInUsersTable: false,
    });

    try {
      const supabase = createClient();

      // Test 1: Check if auth user exists
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();
      setTestResults((prev) => ({
        ...prev,
        authUserExists: !!authUser && !authError,
      }));

      // Test 2: Check if profile exists in users table
      if (authUser) {
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (!profileError) {
          setTestResults((prev) => ({
            ...prev,
            profileInUsersTable: !!profile,
          }));
        }
      }
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">
          Authentication Integration Test
        </h1>
        <p className="text-muted-foreground">
          Test the authentication integration and verify user profile creation
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Auth Status */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>Current auth state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Authenticated:</p>
              <p
                className={`text-sm ${isAuthenticated ? "text-green-600" : "text-red-600"}`}
              >
                {isAuthenticated ? "✅ Yes" : "❌ No"}
              </p>
            </div>

            {user && (
              <>
                <div className="space-y-2">
                  <p className="text-sm font-medium">User ID:</p>
                  <p className="text-sm text-muted-foreground">{user.id}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Email:</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Full Name:</p>
                  <p className="text-sm text-muted-foreground">
                    {user.fullName || "Not set"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Company:</p>
                  <p className="text-sm text-muted-foreground">
                    {user.company || "Not set"}
                  </p>
                </div>
              </>
            )}

            <div className="flex gap-2">
              {!isAuthenticated && (
                <Button asChild>
                  <a href="/auth/login">Sign In</a>
                </Button>
              )}
              {isAuthenticated && (
                <Button onClick={signOut} variant="destructive">
                  Sign Out
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Integration test results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Auth User Exists:</span>
              <span
                className={`text-sm ${testResults.authUserExists ? "text-green-600" : "text-red-600"}`}
              >
                {testResults.authUserExists ? "✅ Pass" : "❌ Fail"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Profile in Users Table:</span>
              <span
                className={`text-sm ${testResults.profileInUsersTable ? "text-green-600" : "text-red-600"}`}
              >
                {testResults.profileInUsersTable ? "✅ Pass" : "❌ Fail"}
              </span>
            </div>

            {testResults.error && (
              <Alert variant="destructive">
                <AlertDescription>Error: {testResults.error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={testAuthIntegration}
              disabled={isTesting || loading}
            >
              {isTesting ? "Testing..." : "Run Tests"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>1. First, sign up or sign in to create an account</p>
          <p>2. Run the integration test to verify:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Auth user exists in Supabase Auth</li>
            <li>Profile exists in the users table</li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            If the profile doesn't exist in the users table, the trigger or API
            route may not be working correctly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
