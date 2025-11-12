/**
 * Admin B2B Requests API Route
 *
 * PATCH /api/admin/b2b-requests
 * Update B2B request status and admin notes
 *
 * Body:
 * {
 *   requestId: string;
 *   status?: "pending" | "reviewed" | "quoted" | "converted" | "rejected";
 *   adminNotes?: string;
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { updateB2BRequestStatus } from "@/services/b2b/b2b-request.service";
import { isAdmin } from "@/lib/utils/admin-auth";

export async function PATCH(request: NextRequest) {
  try {
    // Check admin authentication
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    const { requestId, status, adminNotes } = body;

    // Validate required fields
    if (!requestId) {
      return NextResponse.json({ error: "Missing requestId" }, { status: 400 });
    }

    // Validate status if provided
    const validStatuses = [
      "pending",
      "reviewed",
      "quoted",
      "converted",
      "rejected",
    ];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Update B2B request
    const result = await updateB2BRequestStatus(
      requestId,
      status,
      adminNotes,
      user.id
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to update B2B request" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "B2B request updated successfully",
      requestId,
    });
  } catch (error) {
    console.error("Error in PATCH /api/admin/b2b-requests:", error);

    return NextResponse.json(
      {
        error: "Failed to update B2B request",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
