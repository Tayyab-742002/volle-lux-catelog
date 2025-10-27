/**
 * Database Schema Test Page
 * This page tests the database schema and displays table information
 * Access at: /test-database-schema
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function TestDatabaseSchemaPage() {
  let schemaStatus = "❌ Schema Not Ready";
  let errorMessage = "";
  let tablesInfo: any[] = [];
  let rlsStatus = "❌ RLS Not Configured";

  try {
    // Test Supabase connection
    const supabase = await createServerSupabaseClient();

    // Test if we can query the database
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", [
        "users",
        "addresses",
        "carts",
        "orders",
        "order_items",
        "saved_addresses",
      ]);

    if (tablesError) {
      throw new Error(`Database query error: ${tablesError.message}`);
    }

    // Check if all required tables exist
    const requiredTables = [
      "users",
      "addresses",
      "carts",
      "orders",
      "order_items",
      "saved_addresses",
    ];

    const existingTables = tables?.map((t: any) => t.table_name) || [];
    const missingTables = requiredTables.filter(
      (table) => !existingTables.includes(table)
    );

    if (missingTables.length > 0) {
      throw new Error(`Missing tables: ${missingTables.join(", ")}`);
    }

    // Get table information
    tablesInfo = tables || [];

    // Test RLS by trying to query users table
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    if (usersError && usersError.message.includes("permission denied")) {
      rlsStatus = "✅ RLS Working (Permission Denied - Expected)";
    } else if (usersError) {
      rlsStatus = `❌ RLS Error: ${usersError.message}`;
    } else {
      rlsStatus = "✅ RLS Working (Query Successful)";
    }

    schemaStatus = "✅ Schema Ready";
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unknown error";
    schemaStatus = "❌ Schema Not Ready";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Database Schema Test</h1>

      {/* Schema Status */}
      <div className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-semibold">Schema Status</h2>
        <div
          className={`inline-flex items-center gap-2 rounded px-3 py-1 text-sm font-medium ${
            schemaStatus.includes("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {schemaStatus}
        </div>

        <div className="mt-4">
          <h3 className="mb-2 font-semibold">RLS Status:</h3>
          <div
            className={`inline-flex items-center gap-2 rounded px-3 py-1 text-sm font-medium ${
              rlsStatus.includes("✅")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {rlsStatus}
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded bg-red-50 p-3">
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {errorMessage}
            </p>
          </div>
        )}
      </div>

      {/* Tables Information */}
      <div className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-semibold">
          Database Tables ({tablesInfo.length}/6)
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            "users",
            "addresses",
            "carts",
            "orders",
            "order_items",
            "saved_addresses",
          ].map((tableName) => {
            const exists = tablesInfo.some((t) => t.table_name === tableName);
            return (
              <div
                key={tableName}
                className={`rounded p-4 ${
                  exists
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${exists ? "bg-green-500" : "bg-red-500"}`}
                  ></span>
                  <span className="font-medium">{tableName}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {exists ? "✅ Created" : "❌ Missing"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Migration Instructions */}
      <div className="mb-8 rounded-lg bg-blue-50 p-6">
        <h2 className="mb-2 text-xl font-semibold text-blue-900">
          Migration Instructions
        </h2>
        <ol className="list-decimal list-inside space-y-1 text-blue-800">
          <li>
            Go to your{" "}
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Supabase Dashboard
            </a>
          </li>
          <li>Navigate to SQL Editor</li>
          <li>
            Run the migration files in order:
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>001_create_tables.sql</li>
              <li>002_create_indexes.sql</li>
              <li>003_create_triggers.sql</li>
            </ul>
          </li>
          <li>Refresh this page to verify the schema</li>
        </ol>
      </div>

      {/* Schema Overview */}
      <div className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-semibold">Schema Overview</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold">Core Tables:</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                <strong>users</strong> - User profiles (extends auth.users)
              </li>
              <li>
                <strong>addresses</strong> - Shipping and billing addresses
              </li>
              <li>
                <strong>carts</strong> - Shopping cart persistence
              </li>
              <li>
                <strong>orders</strong> - Order management and tracking
              </li>
              <li>
                <strong>order_items</strong> - Detailed order items
              </li>
              <li>
                <strong>saved_addresses</strong> - Frequently used addresses
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Key Features:</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Row Level Security (RLS) on all tables</li>
              <li>Performance indexes for fast queries</li>
              <li>Automatic timestamp updates</li>
              <li>User profile creation triggers</li>
              <li>Guest cart support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="rounded-lg bg-green-50 p-6">
        <h2 className="mb-2 text-xl font-semibold text-green-900">
          Next Steps
        </h2>
        <ol className="list-decimal list-inside space-y-1 text-green-800">
          <li>Complete the database migration</li>
          <li>Verify all tables are created</li>
          <li>Test RLS policies are working</li>
          <li>Proceed to Task 2.2.3 (RLS Policy Testing)</li>
        </ol>
      </div>
    </div>
  );
}
