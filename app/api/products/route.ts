import { NextResponse } from "next/server";
import { getProducts } from "@/services/products/product.service";

// PERFORMANCE: Increased caching to 15 minutes
export async function GET() {
  try {
    const products = await getProducts();
    return new NextResponse(JSON.stringify(products), {
      headers: {
        "Content-Type": "application/json",
        // Cache API response for 15 minutes, allow stale for 2 hours
        "Cache-Control": "public, max-age=900, stale-while-revalidate=7200",
        // Add ETag for cache validation
        "ETag": `W/"products-${Date.now()}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
