/**
 * Admin Orders API Route
 * Handles CRUD operations for orders management in admin dashboard
 * Reference: ADMIN_DASHBOARD_PLAN.md
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/utils/admin-auth";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  type OrderFilters,
} from "@/services/admin/order.service";

/**
 * GET /api/admin/orders
 * Fetch all orders with optional filters
 * 
 * Query params:
 * - status: Filter by order status
 * - startDate: Filter by start date (ISO)
 * - endDate: Filter by end date (ISO)
 * - search: Search by order number, email, or customer name
 * - limit: Pagination limit (default: 50)
 * - offset: Pagination offset (default: 0)
 * - sortBy: Sort field (created_at, total_amount, status)
 * - sortOrder: Sort direction (asc, desc)
 * - id: Get single order by ID
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
    
    // Check if requesting single order by ID
    const orderId = searchParams.get("id");
    if (orderId) {
      const order = await getOrderById(orderId);
      
      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(order);
    }

    // Build filters object
    const filters: OrderFilters = {
      status: searchParams.get("status") as OrderFilters["status"] || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      search: searchParams.get("search") || undefined,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!, 10)
        : undefined,
      offset: searchParams.get("offset")
        ? parseInt(searchParams.get("offset")!, 10)
        : undefined,
      sortBy: searchParams.get("sortBy") as OrderFilters["sortBy"] || undefined,
      sortOrder: searchParams.get("sortOrder") as "asc" | "desc" || undefined,
    };

    // Fetch orders with filters
    const result = await getAllOrders(filters);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/admin/orders:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch orders",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/orders
 * Update order status or other order fields
 * 
 * Body:
 * {
 *   orderId: string;
 *   status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
 *   trackingNumber?: string;
 *   notes?: string;
 * }
 */
export async function PATCH(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { orderId, status, trackingNumber, notes } = body;

    // Validate required fields
    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Update order
    await updateOrderStatus(orderId, {
      status,
      trackingNumber,
      notes,
    });

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      orderId,
    });
  } catch (error) {
    console.error("Error in PATCH /api/admin/orders:", error);
    
    // Handle not found errors
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      {
        error: "Failed to update order",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST is not used for orders - they are created through checkout
 */
export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed. Orders are created through checkout." },
    { status: 405 }
  );
}

/**
 * DELETE is not implemented - use status update to "cancelled" instead
 */
export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed. Use PATCH to cancel orders." },
    { status: 405 }
  );
}

