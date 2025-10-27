/**
 * RLS Policies Test Page
 * This page tests Row Level Security policies for all database tables
 * Access at: /test-rls-policies
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function TestRLSPoliciesPage() {
  let overallStatus = "❌ RLS Not Tested";
  let errorMessage = "";
  let testResults: any[] = [];

  try {
    // Test Supabase connection
    const supabase = await createServerSupabaseClient();

    // Test 1: Check if RLS is enabled on all tables
    const { data: rlsTables, error: rlsError } = await supabase
      .from("pg_tables")
      .select("tablename, rowsecurity")
      .eq("schemaname", "public")
      .in("tablename", [
        "users",
        "addresses",
        "carts",
        "orders",
        "order_items",
        "saved_addresses",
      ]);

    if (rlsError) {
      throw new Error(`RLS check error: ${rlsError.message}`);
    }

    // Test 2: Check if policies exist
    const { data: policies, error: policiesError } = await supabase
      .from("pg_policies")
      .select("tablename, policyname, permissive, roles, cmd, qual")
      .eq("schemaname", "public")
      .in("tablename", [
        "users",
        "addresses",
        "carts",
        "orders",
        "order_items",
        "saved_addresses",
      ]);

    if (policiesError) {
      throw new Error(`Policies check error: ${policiesError.message}`);
    }

    // Test 3: Test RLS by trying to access tables without authentication
    const tablesToTest = [
      "users",
      "addresses",
      "carts",
      "orders",
      "order_items",
      "saved_addresses",
    ];

    for (const tableName of tablesToTest) {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .limit(1);

      let testResult = {
        table: tableName,
        rlsEnabled: false,
        policiesCount: 0,
        accessTest: "❌ Failed",
        errorMessage: "",
      };

      // Check if RLS is enabled
      const rlsTable = rlsTables?.find((t: any) => t.tablename === tableName);
      testResult.rlsEnabled = (rlsTable as any)?.rowsecurity || false;

      // Count policies
      const tablePolicies =
        policies?.filter((p: any) => p.tablename === tableName) || [];
      testResult.policiesCount = tablePolicies.length;

      // Test access (should fail for unauthenticated users)
      if (error) {
        if (
          error.message.includes("permission denied") ||
          error.message.includes("row-level security")
        ) {
          testResult.accessTest = "✅ RLS Working (Access Denied)";
        } else {
          testResult.accessTest = "❌ Unexpected Error";
          testResult.errorMessage = error.message;
        }
      } else {
        testResult.accessTest = "⚠️ RLS Not Working (Access Allowed)";
        testResult.errorMessage =
          "Unauthenticated access was allowed - this indicates RLS is not working properly";
      }

      testResults.push(testResult);
    }

    // Determine overall status
    const allRLSEnabled = testResults.every((r) => r.rlsEnabled);
    const allPoliciesExist = testResults.every((r) => r.policiesCount > 0);
    const allAccessDenied = testResults.every((r) =>
      r.accessTest.includes("Access Denied")
    );

    if (allRLSEnabled && allPoliciesExist && allAccessDenied) {
      overallStatus = "✅ RLS Policies Working Correctly";
    } else if (allRLSEnabled && allPoliciesExist) {
      overallStatus = "⚠️ RLS Enabled but Access Issues";
    } else if (allRLSEnabled) {
      overallStatus = "❌ RLS Enabled but Missing Policies";
    } else {
      overallStatus = "❌ RLS Not Properly Configured";
    }
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unknown error";
    overallStatus = "❌ RLS Test Failed";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">RLS Policies Test</h1>

      {/* Overall Status */}
      <div className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-semibold">Overall RLS Status</h2>
        <div
          className={`inline-flex items-center gap-2 rounded px-3 py-1 text-sm font-medium ${
            overallStatus.includes("✅")
              ? "bg-green-100 text-green-800"
              : overallStatus.includes("⚠️")
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {overallStatus}
        </div>

        {errorMessage && (
          <div className="mt-4 rounded bg-red-50 p-3">
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {errorMessage}
            </p>
          </div>
        )}
      </div>

      {/* Detailed Test Results */}
      <div className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-semibold">Detailed Test Results</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Table</th>
                <th className="text-left p-2 font-semibold">RLS Enabled</th>
                <th className="text-left p-2 font-semibold">Policies Count</th>
                <th className="text-left p-2 font-semibold">Access Test</th>
                <th className="text-left p-2 font-semibold">Error Message</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((result, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 font-medium">{result.table}</td>
                  <td className="p-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
                        result.rlsEnabled
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {result.rlsEnabled ? "✅ Yes" : "❌ No"}
                    </span>
                  </td>
                  <td className="p-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
                        result.policiesCount > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {result.policiesCount} policies
                    </span>
                  </td>
                  <td className="p-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
                        result.accessTest.includes("✅")
                          ? "bg-green-100 text-green-800"
                          : result.accessTest.includes("⚠️")
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {result.accessTest}
                    </span>
                  </td>
                  <td className="p-2 text-xs text-gray-600">
                    {result.errorMessage || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RLS Policy Details */}
      <div className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-semibold">Expected RLS Policies</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold">Users Table:</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Users can view own profile (SELECT)</li>
              <li>Users can update own profile (UPDATE)</li>
              <li>Users can insert own profile (INSERT)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Addresses Table:</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Users can view own addresses (SELECT)</li>
              <li>Users can insert own addresses (INSERT)</li>
              <li>Users can update own addresses (UPDATE)</li>
              <li>Users can delete own addresses (DELETE)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Carts Table:</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Users can view own carts (SELECT)</li>
              <li>Users can insert own carts (INSERT)</li>
              <li>Users can update own carts (UPDATE)</li>
              <li>Users can delete own carts (DELETE)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Orders Table:</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Users can view own orders (SELECT)</li>
              <li>Users can insert own orders (INSERT)</li>
              <li>System can update orders (UPDATE)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Order Items Table:</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Users can view order items for own orders (SELECT)</li>
              <li>System can insert order items (INSERT)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Saved Addresses Table:</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Users can view own saved addresses (SELECT)</li>
              <li>Users can insert own saved addresses (INSERT)</li>
              <li>Users can update own saved addresses (UPDATE)</li>
              <li>Users can delete own saved addresses (DELETE)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="mb-8 rounded-lg bg-yellow-50 p-6">
        <h2 className="mb-2 text-xl font-semibold text-yellow-900">
          Troubleshooting RLS Issues
        </h2>
        <ul className="list-disc list-inside space-y-1 text-yellow-800">
          <li>
            <strong>RLS Not Enabled:</strong> Run the migration files to enable
            RLS
          </li>
          <li>
            <strong>Missing Policies:</strong> Check that all policies were
            created correctly
          </li>
          <li>
            <strong>Access Allowed:</strong> Verify policies are using correct
            auth.uid() checks
          </li>
          <li>
            <strong>Permission Denied:</strong> This is expected for
            unauthenticated users
          </li>
        </ul>
      </div>

      {/* Next Steps */}
      <div className="rounded-lg bg-green-50 p-6">
        <h2 className="mb-2 text-xl font-semibold text-green-900">
          Next Steps
        </h2>
        <ol className="list-decimal list-inside space-y-1 text-green-800">
          <li>If RLS is not working, run the database migrations</li>
          <li>Verify all policies are created correctly</li>
          <li>Test with authenticated users (Task 2.2.4)</li>
          <li>Proceed to Authentication Integration</li>
        </ol>
      </div>
    </div>
  );
}
