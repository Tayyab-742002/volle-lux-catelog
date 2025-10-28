import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * API route to manually revalidate category pages
 * Usage: POST to /api/revalidate with secret token
 *
 * This can be triggered from Sanity webhooks when categories are updated
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, paths } = body;

    // Verify secret token (optional but recommended for production)
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    // Revalidate specific paths or all category-related paths
    const pathsToRevalidate = paths || ["/", "/categories", "/products"];

    for (const path of pathsToRevalidate) {
      revalidatePath(path);
    }

    return NextResponse.json({
      revalidated: true,
      paths: pathsToRevalidate,
      now: Date.now(),
    });
  } catch (err) {
    console.error("Error revalidating:", err);
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for testing purposes
 * Usage: GET /api/revalidate?secret=your-secret&path=/categories
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get("secret");
    const path = searchParams.get("path") || "/";

    // Verify secret token
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    // Revalidate the path
    revalidatePath(path);

    return NextResponse.json({
      revalidated: true,
      path,
      now: Date.now(),
    });
  } catch (err) {
    console.error("Error revalidating:", err);
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
