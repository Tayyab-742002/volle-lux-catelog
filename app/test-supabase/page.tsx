/**
 * Supabase Test Page
 * This page tests the Supabase connection and displays connection status
 * Access at: /test-supabase
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function TestSupabasePage() {
  let connectionStatus = "❌ Not Connected";
  let userCount = 0;
  let errorMessage = "";

  try {
    // Test Supabase connection
    const supabase = await createServerSupabaseClient();

    // Test basic connection by checking auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw new Error(`Auth error: ${authError.message}`);
    }

    // Test database connection by checking if we can access the database
    // Note: Users table doesn't exist yet, so we'll test with a simple query
    const { data, error: dbError } = await supabase
      .from("_supabase_migrations")
      .select("*")
      .limit(1);

    if (
      dbError &&
      !dbError.message.includes("relation") &&
      !dbError.message.includes("does not exist")
    ) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    connectionStatus = "✅ Connected";
    userCount = 0; // Users table doesn't exist yet
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unknown error";
    connectionStatus = "❌ Connection Failed";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Supabase Integration Test</h1>

      {/* Connection Status */}
      <div className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-semibold">Connection Status</h2>
        <div
          className={`inline-flex items-center gap-2 rounded px-3 py-1 text-sm font-medium ${
            connectionStatus.includes("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {connectionStatus}
        </div>

        {errorMessage && (
          <div className="mt-4 rounded bg-red-50 p-3">
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {errorMessage}
            </p>
          </div>
        )}
      </div>

      {/* Database Status */}
      <div className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-semibold">Database Status</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded bg-gray-50 p-4">
            <h3 className="font-semibold">Users Table</h3>
            <p className="text-sm text-gray-600">Count: {userCount} users</p>
          </div>
          <div className="rounded bg-gray-50 p-4">
            <h3 className="font-semibold">Tables Status</h3>
            <p className="text-sm text-gray-600">
              {connectionStatus.includes("✅")
                ? "All tables accessible"
                : "Tables not accessible"}
            </p>
          </div>
        </div>
      </div>

      {/* Environment Variables Check */}
      <div className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-semibold">Environment Variables</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                process.env.NEXT_PUBLIC_SUPABASE_URL
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></span>
            <span className="text-sm">
              NEXT_PUBLIC_SUPABASE_URL:{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></span>
            <span className="text-sm">
              NEXT_PUBLIC_SUPABASE_ANON_KEY:{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                ? "✅ Set"
                : "❌ Missing"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                process.env.SUPABASE_SERVICE_ROLE_KEY
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></span>
            <span className="text-sm">
              SUPABASE_SERVICE_ROLE_KEY:{" "}
              {process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing"}
            </span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="rounded-lg bg-blue-50 p-6">
        <h2 className="mb-2 text-xl font-semibold text-blue-900">Next Steps</h2>
        <ol className="list-decimal list-inside space-y-1 text-blue-800">
          <li>
            If connection failed, check your{" "}
            <a href="/docs/Supabase-Setup-Guide.md" className="underline">
              Supabase Setup Guide
            </a>
          </li>
          <li>
            Verify your environment variables in <code>.env.local</code>
          </li>
          <li>Check your Supabase project dashboard for any issues</li>
          <li>
            Once connected, proceed to Task 2.2.2 (Database Schema Design)
          </li>
        </ol>
      </div>

      {/* Troubleshooting */}
      <div className="mt-8 rounded-lg bg-yellow-50 p-6">
        <h2 className="mb-2 text-xl font-semibold text-yellow-900">
          Troubleshooting
        </h2>
        <ul className="list-disc list-inside space-y-1 text-yellow-800">
          <li>Make sure your Supabase project is active and not paused</li>
          <li>Verify the project URL and API keys are correct</li>
          <li>
            Check that your database tables exist (they will be created in Task
            2.2.2)
          </li>
          <li>
            Ensure your environment variables are loaded (restart dev server)
          </li>
        </ul>
      </div>
    </div>
  );
}
