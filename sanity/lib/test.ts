/**
 * Sanity Client Test
 * This file tests the Sanity client connection and queries
 * Run this to verify everything is working correctly
 */

import {
  testConnection,
  getAllProducts,
  getAllCategories,
  getHomepageData,
} from "./api";

async function runTests() {
  console.log("🧪 Testing Sanity Client Setup...\n");

  // Test 1: Connection
  console.log("1. Testing connection...");
  const isConnected = await testConnection();
  console.log(
    isConnected ? "✅ Connection successful" : "❌ Connection failed"
  );
  console.log("");

  // Test 2: Categories
  console.log("2. Testing categories query...");
  const categories = await getAllCategories();
  if (categories) {
    console.log(`✅ Found ${categories.length} categories`);
    categories.forEach((cat) => console.log(`   - ${cat.name} (${cat.slug})`));
  } else {
    console.log("❌ Failed to fetch categories");
  }
  console.log("");

  // Test 3: Products
  console.log("3. Testing products query...");
  const products = await getAllProducts();
  if (products) {
    console.log(`✅ Found ${products.length} products`);
    products
      .slice(0, 3)
      .forEach((product) =>
        console.log(`   - ${product.name} (${product.product_code})`)
      );
  } else {
    console.log("❌ Failed to fetch products");
  }
  console.log("");

  // Test 4: Homepage data
  console.log("4. Testing homepage data query...");
  const homepageData = await getHomepageData();
  if (homepageData) {
    console.log(`✅ Homepage data loaded:`);
    console.log(`   - Categories: ${homepageData.categories.length}`);
    console.log(
      `   - Featured Products: ${homepageData.featuredProducts.length}`
    );
    console.log(`   - New Arrivals: ${homepageData.newArrivals.length}`);
  } else {
    console.log("❌ Failed to fetch homepage data");
  }
  console.log("");

  console.log("🎉 Sanity client tests completed!");
}

// Export for use in other files
export { runTests };

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

