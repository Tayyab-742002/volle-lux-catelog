import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const secret =
      req.nextUrl.searchParams.get("secret") ||
      req.headers.get("x-revalidate-secret") ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    // Allow requests without secret in development, require it in production
    if (process.env.NODE_ENV === "production") {
      if (!secret || secret !== process.env.SANITY_REVALIDATE_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json().catch(() => ({}));

    // Basic mapping based on document type and properties
    const docType: string | undefined = body?._type;
    const slug: string | undefined = body?.slug?.current || body?.slug;

    // Always revalidate broad product/category tags when unknown
    const touchedTags = new Set<string>();

    // Homepage updates
    if (docType === "homepage" || docType === "siteSettings") {
      touchedTags.add("homepage");
    }

    // Product updates
    if (docType === "product") {
      touchedTags.add("products:all");
      touchedTags.add("products:list");
      touchedTags.add("products:filtered");
      touchedTags.add("products:search");
      if (body?.isFeatured) touchedTags.add("products:featured");
      if (body?.isNewArrival) touchedTags.add("products:new");
      if (slug) touchedTags.add(`product:${slug}`);
    }

    // Category updates
    if (docType === "category") {
      touchedTags.add("categories:all");
      if (slug) {
        touchedTags.add(`category:${slug}`);
      }
      touchedTags.add("products:list");
      touchedTags.add("products:filtered");
    }

    // Fallback: if no recognized type, still revalidate broad lists
    if (touchedTags.size === 0) {
      [
        "homepage",
        "products:all",
        "products:list",
        "products:filtered",
        "products:search",
        "products:featured",
        "products:new",
        "categories:all",
      ].forEach((t) => touchedTags.add(t));
    }

    // Support different Next.js signatures across versions by bypassing TS overloads
    touchedTags.forEach((tag) =>
      (revalidateTag as unknown as (t: string) => void)(tag)
    );

    // Also revalidate common paths
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/products/[slug]", "page");
    if (slug && docType === "product") {
      revalidatePath(`/products/${slug}`);
    }
    if (slug && docType === "category") {
      revalidatePath(`/products?category=${slug}`);
    }

    return NextResponse.json({
      revalidated: true,
      tags: Array.from(touchedTags),
      paths: ["/", "/products"],
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to revalidate" },
      { status: 500 }
    );
  }
}
