/**
 * Admin Customers API Route
 * Handles customer data operations for admin dashboard
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/utils/admin-auth";
import {
  getAllCustomers,
  getCustomerById,
  type CustomerFilters,
} from "@/services/admin/customer.service";

/**
 * GET /api/admin/customers
 * Fetch all customers with optional filters
 * 
 * Query params:
 * - search: Search by email, name, or phone
 * - limit: Pagination limit (default: 50)
 * - offset: Pagination offset (default: 0)
 * - sortBy: Sort field (created_at, email, total_spent)
 * - sortOrder: Sort direction (asc, desc)
 * - id: Get single customer by ID
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(user.id);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    
    // Check if requesting single customer by ID
    const customerId = searchParams.get("id");
    if (customerId) {
      const customer = await getCustomerById(customerId);
      
      if (!customer) {
        return NextResponse.json(
          { error: "Customer not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(customer);
    }

    // Build filters object
    const filters: CustomerFilters = {
      search: searchParams.get("search") || undefined,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!, 10)
        : undefined,
      offset: searchParams.get("offset")
        ? parseInt(searchParams.get("offset")!, 10)
        : undefined,
      sortBy: searchParams.get("sortBy") as CustomerFilters["sortBy"] || undefined,
      sortOrder: searchParams.get("sortOrder") as "asc" | "desc" || undefined,
    };

    // Fetch customers with filters
    const result = await getAllCustomers(filters);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/admin/customers:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch customers",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST is not used - customers are created through auth/signup
 */
export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed. Customers are created through user registration." },
    { status: 405 }
  );
}

/**
 * PATCH/DELETE not implemented yet
 */
export async function PATCH() {
  return NextResponse.json(
    { error: "Method not yet implemented" },
    { status: 501 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not yet implemented" },
    { status: 501 }
  );
}

