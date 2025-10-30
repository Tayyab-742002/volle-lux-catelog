/**
 * Admin Analytics API Route
 * Returns analytics data for admin dashboard
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/utils/admin-auth";
import {
  getRevenueAnalytics,
  getTopProducts,
  getOrdersByStatus,
  getCustomerAcquisition,
} from "@/services/admin/analytics.service";

/**
 * GET /api/admin/analytics
 * Fetch analytics data
 * 
 * Query params:
 * - type: revenue, topProducts, ordersByStatus, customerAcquisition
 * - timeRange: 7d, 30d, 90d, all (for time-based data)
 * - limit: limit for top products (default: 10)
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
    const type = searchParams.get("type") || "revenue";
    const timeRange = (searchParams.get("timeRange") || "30d") as "7d" | "30d" | "90d" | "all";
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    let data;

    switch (type) {
      case "revenue":
        data = await getRevenueAnalytics(timeRange);
        break;
      case "topProducts":
        data = await getTopProducts(limit);
        break;
      case "ordersByStatus":
        data = await getOrdersByStatus();
        break;
      case "customerAcquisition":
        data = await getCustomerAcquisition(timeRange);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid analytics type" },
          { status: 400 }
        );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/admin/analytics:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch analytics",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

