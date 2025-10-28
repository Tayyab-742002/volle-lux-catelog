/**
 * Sanity Test Page
 * This page tests the Sanity integration and displays fetched data
 * Access at: /test-sanity
 */

import { getAllProducts, getAllCategories, testConnection } from "@/sanity/lib";

export default async function TestSanityPage() {
  // Test connection
  const isConnected = await testConnection();

  // Fetch data
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Sanity Integration Test</h1>

      {/* Connection Status */}
      <div className="mb-8 rounded-lg border p-4">
        <h2 className="mb-4 text-2xl font-semibold">Connection Status</h2>
        <div
          className={`inline-flex items-center gap-2 rounded px-3 py-1 text-sm font-medium ${
            isConnected
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isConnected ? "✅ Connected" : "❌ Not Connected"}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8 rounded-lg border p-4">
        <h2 className="mb-4 text-2xl font-semibold">
          Categories ({categories?.length || 0})
        </h2>
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category: any) => (
              <div key={category.id} className="rounded border p-4">
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-600">Slug: {category.slug}</p>
                {category.description && (
                  <p className="text-sm text-gray-500">
                    {category.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No categories found. Please create categories in Sanity Studio.
          </p>
        )}
      </div>

      {/* Products */}
      <div className="mb-8 rounded-lg border p-4">
        <h2 className="mb-4 text-2xl font-semibold">
          Products ({products?.length || 0})
        </h2>
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product: any) => (
              <div key={product.id} className="rounded border p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">
                  Code: {product.product_code}
                </p>
                <p className="text-sm text-gray-600">
                  Price: ${product.basePrice}
                </p>
                <p className="text-sm text-gray-600">
                  Category: {product.category}
                </p>
                {product.variants && product.variants.length > 0 && (
                  <p className="text-sm text-gray-500">
                    Variants:{" "}
                    {product.variants.map((v: any) => v.name).join(", ")}
                  </p>
                )}
                {product.pricingTiers && product.pricingTiers.length > 0 && (
                  <p className="text-sm text-gray-500">
                    Pricing Tiers: {product.pricingTiers.length}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No products found. Please create products in Sanity Studio.
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="rounded-lg bg-blue-50 p-4">
        <h2 className="mb-2 text-xl font-semibold text-blue-900">Next Steps</h2>
        <ol className="list-decimal list-inside space-y-1 text-blue-800">
          <li>
            Go to{" "}
            <a href="/admin-dashboard" className="underline">
              Sanity Studio
            </a>
          </li>
          <li>
            Create categories and products following the{" "}
            <a
              href="/docs/Sanity-Data-Migration-Guide.md"
              className="underline"
            >
              Migration Guide
            </a>
          </li>
          <li>Refresh this page to see the data</li>
          <li>Once data is visible, proceed to Task 2.1.5</li>
        </ol>
      </div>
    </div>
  );
}
