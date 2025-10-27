/**
 * Basic Supabase Connection Test
 * This page tests only the basic Supabase connection without any auth operations
 * Access at: /test-supabase-basic
 */

export default async function TestSupabaseBasicPage() {
  let connectionStatus = "❌ Not Connected";
  let errorMessage = "";

  try {
    // Test if environment variables are present
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Test basic URL format
    if (!supabaseUrl.includes("supabase.co")) {
      throw new Error("Invalid Supabase URL format");
    }

    // Test key format (should be a JWT)
    if (!supabaseAnonKey.includes(".")) {
      throw new Error("Invalid Supabase key format");
    }

    connectionStatus = "✅ Environment Variables Valid";
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unknown error";
    connectionStatus = "❌ Connection Failed";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">
        Basic Supabase Connection Test
      </h1>

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

      {/* Debug Information */}
      <div className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-semibold">Debug Information</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Supabase URL:</strong>{" "}
            {process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set"}
          </p>
          <p>
            <strong>Anon Key Length:</strong>{" "}
            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0} characters
          </p>
          <p>
            <strong>Service Role Key Length:</strong>{" "}
            {process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0} characters
          </p>
          <p>
            <strong>Anon Key Preview:</strong>{" "}
            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
              ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
              : "Not set"}
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="rounded-lg bg-blue-50 p-6">
        <h2 className="mb-2 text-xl font-semibold text-blue-900">Next Steps</h2>
        <ol className="list-decimal list-inside space-y-1 text-blue-800">
          <li>
            If environment variables are valid, try the{" "}
            <a href="/test-supabase-simple" className="underline">
              Simple Connection Test
            </a>
          </li>
          <li>If still having issues, check your Supabase project dashboard</li>
          <li>Make sure your Supabase project is active and not paused</li>
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
          <li>Make sure your .env.local file is in the project root</li>
          <li>
            Restart your development server after adding environment variables
          </li>
          <li>
            Check that there are no extra spaces or quotes in your environment
            variables
          </li>
          <li>Verify your Supabase project is active and not paused</li>
        </ul>
      </div>
    </div>
  );
}

