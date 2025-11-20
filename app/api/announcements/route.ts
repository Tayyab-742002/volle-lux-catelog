import { NextResponse } from "next/server";

import { getActiveAnnouncement } from "@/sanity/lib/api";
/**
 * API Route to fetch active announcement
 * Used by client components to fetch announcement data
 */
export async function GET() {
  try {
    const announcement = await getActiveAnnouncement();

    if (!announcement) {
      return NextResponse.json({ announcement: null });
    }

    return NextResponse.json({ announcement });
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcement" },
      { status: 500 }
    );
  }
}
