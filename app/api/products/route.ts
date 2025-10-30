import { NextResponse } from "next/server";
import { getProducts } from "@/services/products/product.service";

export async function GET() {
  try {
    const products = await getProducts();
    return new NextResponse(JSON.stringify(products), {
      headers: {
        "Content-Type": "application/json",
        // Cache API response for 5 minutes, allow stale for 1 hour
        "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
