/**
 * Admin Stats API Route
 * Returns dashboard statistics for admin
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/utils/admin-auth";
import { getOrderStats } from "@/services/admin/order.service";

/**
 * GET /api/admin/stats
 * Fetch dashboard statistics
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

    // Fetch stats
    const stats = await getOrderStats();

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/admin/stats:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch statistics",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

