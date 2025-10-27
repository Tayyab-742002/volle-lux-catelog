/**
 * Sanity Data Migration Script
 * This script helps migrate mock data to Sanity CMS
 * Run this to seed initial data for development
 */

import { client } from './client';

// Sample categories data
const categoriesData = [
  {
    _type: 'category',
    name: 'Shipping Boxes',
    slug: { current: 'shipping-boxes' },
    description: 'Heavy-duty shipping boxes for all your packaging needs',
    isActive: true,
    sortOrder: 1,
  },
  {
    _type: 'category',
    name: 'Packaging Supplies',
    slug: { current: 'packaging-supplies' },
    description: 'Essential packaging supplies and materials',
    isActive: true,
    sortOrder: 2,
  },
  {
    _type: 'category',
    name: 'Bubble Wrap',
    slug: { current: 'bubble-wrap' },
    description: 'Protective bubble wrap for fragile items',
    isActive: true,
    sortOrder: 3,
  },
  {
    _type: 'category',
    name: 'Envelopes & Mailers',
    slug: { current: 'envelopes-mailers' },
    description: 'Envelopes and mailers for shipping documents and small items',
    isActive: true,
    sortOrder: 4,
  },
  {
    _type: 'category',
    name: 'Protective Materials',
    slug: { current: 'protective-materials' },
    description: 'Various protective materials for shipping',
    isActive: true,
    sortOrder: 5,
  },
];

// Sample products data
const productsData = [
  {
    _type: 'product',
    name: 'Heavy Duty Shipping Boxes',
    slug: { current: 'heavy-duty-shipping-boxes' },
    productCode: 'BOX-001',
    description: 'Premium heavy-duty shipping boxes designed to protect your products during transit. Made from high-quality corrugated cardboard with reinforced edges for maximum durability.',
    shortDescription: 'Heavy-duty corrugated shipping boxes with reinforced edges',
    basePrice: 1.99,
    discount: 20,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    tags: ['heavy-duty', 'corrugated', 'shipping', 'durable'],
    seoTitle: 'Heavy Duty Shipping Boxes - Premium Packaging Solutions',
    seoDescription: 'High-quality heavy-duty shipping boxes for secure product transportation. Available in multiple sizes with bulk pricing.',
    delivery: 'Standard shipping: 2-3 business days. Express shipping available.',
    variants: [
      {
        name: 'C4',
        sku: 'BOX-001-C4',
        priceAdjustment: 0,
        isActive: true,
        stockQuantity: 1000,
      },
      {
        name: 'C5',
        sku: 'BOX-001-C5',
        priceAdjustment: 0.5,
        isActive: true,
        stockQuantity: 800,
      },
      {
        name: 'C6',
        sku: 'BOX-001-C6',
        priceAdjustment: 1.0,
        isActive: true,
        stockQuantity: 600,
      },
    ],
    pricingTiers: [
      {
        minQuantity: 1,
        maxQuantity: 49,
        pricePerUnit: 1.99,
      },
      {
        minQuantity: 50,
        maxQuantity: 99,
        pricePerUnit: 1.79,
        discount: 10,
        label: '10% Off',
      },
      {
        minQuantity: 100,
        pricePerUnit: 1.59,
        discount: 20,
        label: 'Wholesale',
      },
    ],
    specifications: [
      { name: 'Material', value: 'Corrugated Cardboard' },
      { name: 'Max Weight', value: '65 lbs' },
      { name: 'Dimensions', value: 'Various Sizes Available' },
      { name: 'Certification', value: 'FSC Certified' },
    ],
  },
  {
    _type: 'product',
    name: 'Premium Bubble Wrap',
    slug: { current: 'premium-bubble-wrap' },
    productCode: 'WRAP-001',
    description: 'High-quality bubble wrap providing excellent protection for fragile items during shipping. Features large bubbles for maximum cushioning.',
    shortDescription: 'Premium bubble wrap with large bubbles for maximum protection',
    basePrice: 2.49,
    discount: 15,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    tags: ['bubble-wrap', 'protective', 'fragile', 'cushioning'],
    seoTitle: 'Premium Bubble Wrap - Protective Packaging Material',
    seoDescription: 'High-quality bubble wrap for protecting fragile items during shipping. Large bubbles provide excellent cushioning.',
    delivery: 'Standard shipping: 2-3 business days. Available for same-day pickup.',
    variants: [
      {
        name: 'Small',
        sku: 'WRAP-001-S',
        priceAdjustment: 0,
        isActive: true,
        stockQuantity: 500,
      },
      {
        name: 'Medium',
        sku: 'WRAP-001-M',
        priceAdjustment: 0.5,
        isActive: true,
        stockQuantity: 400,
      },
      {
        name: 'Large',
        sku: 'WRAP-001-L',
        priceAdjustment: 1.0,
        isActive: true,
        stockQuantity: 300,
      },
    ],
    pricingTiers: [
      {
        minQuantity: 1,
        maxQuantity: 24,
        pricePerUnit: 2.49,
      },
      {
        minQuantity: 25,
        maxQuantity: 49,
        pricePerUnit: 2.24,
        discount: 10,
        label: '10% Off',
      },
      {
        minQuantity: 50,
        pricePerUnit: 2.12,
        discount: 15,
        label: 'Bulk Discount',
      },
    ],
    specifications: [
      { name: 'Material', value: 'Polyethylene' },
      { name: 'Bubble Size', value: 'Large (1/2 inch)' },
      { name: 'Width', value: '12 inches' },
      { name: 'Recyclable', value: 'Yes' },
    ],
  },
  {
    _type: 'product',
    name: 'Bubble Mailers',
    slug: { current: 'bubble-mailers' },
    productCode: 'ENV-001',
    description: 'Self-sealing bubble mailers perfect for shipping small items safely. Features built-in bubble wrap lining for protection.',
    shortDescription: 'Self-sealing bubble mailers with built-in protection',
    basePrice: 0.99,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    tags: ['mailers', 'bubble', 'self-sealing', 'small-items'],
    seoTitle: 'Bubble Mailers - Self-Sealing Protective Envelopes',
    seoDescription: 'Self-sealing bubble mailers with built-in protection for shipping small items safely.',
    delivery: 'Standard shipping: 1-2 business days.',
    variants: [
      {
        name: '6x10',
        sku: 'ENV-001-6x10',
        priceAdjustment: 0,
        isActive: true,
        stockQuantity: 2000,
      },
      {
        name: '8x12',
        sku: 'ENV-001-8x12',
        priceAdjustment: 0.2,
        isActive: true,
        stockQuantity: 1500,
      },
      {
        name: '10x15',
        sku: 'ENV-001-10x15',
        priceAdjustment: 0.4,
        isActive: true,
        stockQuantity: 1000,
      },
    ],
    pricingTiers: [
      {
        minQuantity: 1,
        maxQuantity: 99,
        pricePerUnit: 0.99,
      },
      {
        minQuantity: 100,
        maxQuantity: 499,
        pricePerUnit: 0.89,
        discount: 10,
        label: '10% Off',
      },
      {
        minQuantity: 500,
        pricePerUnit: 0.79,
        discount: 20,
        label: 'Bulk Pricing',
      },
    ],
    specifications: [
      { name: 'Material', value: 'Kraft Paper + Bubble Lining' },
      { name: 'Seal Type', value: 'Self-Sealing' },
      { name: 'Max Weight', value: '2 lbs' },
      { name: 'Water Resistant', value: 'Yes' },
    ],
  },
  {
    _type: 'product',
    name: 'Packing Peanuts',
    slug: { current: 'packing-peanuts' },
    productCode: 'PEANUTS-001',
    description: 'Biodegradable packing peanuts for filling voids and protecting items during shipping. Made from cornstarch for eco-friendly packaging.',
    shortDescription: 'Biodegradable packing peanuts made from cornstarch',
    basePrice: 3.99,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    tags: ['packing-peanuts', 'biodegradable', 'cornstarch', 'eco-friendly'],
    seoTitle: 'Biodegradable Packing Peanuts - Eco-Friendly Packaging',
    seoDescription: 'Biodegradable packing peanuts made from cornstarch for eco-friendly void filling and protection.',
    delivery: 'Standard shipping: 2-3 business days.',
    variants: [
      {
        name: 'Small',
        sku: 'PEANUTS-001-S',
        priceAdjustment: 0,
        isActive: true,
        stockQuantity: 800,
      },
      {
        name: 'Medium',
        sku: 'PEANUTS-001-M',
        priceAdjustment: 1.0,
        isActive: true,
        stockQuantity: 600,
      },
      {
        name: 'Large',
        sku: 'PEANUTS-001-L',
        priceAdjustment: 2.0,
        isActive: true,
        stockQuantity: 400,
      },
    ],
    pricingTiers: [
      {
        minQuantity: 1,
        maxQuantity: 9,
        pricePerUnit: 3.99,
      },
      {
        minQuantity: 10,
        maxQuantity: 24,
        pricePerUnit: 3.59,
        discount: 10,
        label: '10% Off',
      },
      {
        minQuantity: 25,
        pricePerUnit: 3.19,
        discount: 20,
        label: 'Bulk Discount',
      },
    ],
    specifications: [
      { name: 'Material', value: 'Cornstarch' },
      { name: 'Biodegradable', value: 'Yes' },
      { name: 'Dissolves in Water', value: 'Yes' },
      { name: 'Static-Free', value: 'Yes' },
    ],
  },
  {
    _type: 'product',
    name: 'Corrugated Mailers',
    slug: { current: 'corrugated-mailers' },
    productCode: 'CORR-001',
    description: 'Heavy-duty corrugated mailers with reinforced edges. Perfect for shipping books, documents, and medium-weight items.',
    shortDescription: 'Heavy-duty corrugated mailers with reinforced edges',
    basePrice: 1.49,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    tags: ['corrugated', 'mailers', 'heavy-duty', 'reinforced'],
    seoTitle: 'Heavy-Duty Corrugated Mailers - Reinforced Packaging',
    seoDescription: 'Heavy-duty corrugated mailers with reinforced edges for shipping books, documents, and medium-weight items.',
    delivery: 'Standard shipping: 2-3 business days.',
    variants: [
      {
        name: '9x12',
        sku: 'CORR-001-9x12',
        priceAdjustment: 0,
        isActive: true,
        stockQuantity: 1200,
      },
      {
        name: '10x13',
        sku: 'CORR-001-10x13',
        priceAdjustment: 0.3,
        isActive: true,
        stockQuantity: 1000,
      },
      {
        name: '12x15',
        sku: 'CORR-001-12x15',
        priceAdjustment: 0.6,
        isActive: true,
        stockQuantity: 800,
      },
    ],
    pricingTiers: [
      {
        minQuantity: 1,
        maxQuantity: 49,
        pricePerUnit: 1.49,
      },
      {
        minQuantity: 50,
        maxQuantity: 99,
        pricePerUnit: 1.34,
        discount: 10,
        label: '10% Off',
      },
      {
        minQuantity: 100,
        pricePerUnit: 1.19,
        discount: 20,
        label: 'Wholesale',
      },
    ],
    specifications: [
      { name: 'Material', value: 'Corrugated Cardboard' },
      { name: 'Max Weight', value: '25 lbs' },
      { name: 'Reinforced Edges', value: 'Yes' },
      { name: 'Self-Sealing', value: 'Yes' },
    ],
  },
];

// Migration functions
export async function migrateCategories() {
  console.log('🔄 Migrating categories...');
  
  const createdCategories = [];
  
  for (const categoryData of categoriesData) {
    try {
      const category = await client.create(categoryData);
      createdCategories.push(category);
      console.log(`✅ Created category: ${categoryData.name}`);
    } catch (error) {
      console.error(`❌ Failed to create category ${categoryData.name}:`, error);
    }
  }
  
  console.log(`🎉 Categories migration complete: ${createdCategories.length}/${categoriesData.length} created`);
  return createdCategories;
}

export async function migrateProducts(categories: any[]) {
  console.log('🔄 Migrating products...');
  
  // Map category names to IDs
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.name] = cat._id;
    return acc;
  }, {});
  
  const createdProducts = [];
  
  for (const productData of productsData) {
    try {
      // Assign category based on product type
      let categoryId = categoryMap['Packaging Supplies']; // default
      
      if (productData.name.includes('Box')) {
        categoryId = categoryMap['Shipping Boxes'];
      } else if (productData.name.includes('Bubble')) {
        categoryId = categoryMap['Bubble Wrap'];
      } else if (productData.name.includes('Mailer') || productData.name.includes('Envelope')) {
        categoryId = categoryMap['Envelopes & Mailers'];
      } else if (productData.name.includes('Peanut')) {
        categoryId = categoryMap['Protective Materials'];
      }
      
      const productWithCategory = {
        ...productData,
        discount: productData.discount || 0, // Ensure discount is always a number
        category: {
          _type: 'reference',
          _ref: categoryId,
        },
      };
      
      const product = await client.create(productWithCategory);
      createdProducts.push(product);
      console.log(`✅ Created product: ${productData.name}`);
    } catch (error) {
      console.error(`❌ Failed to create product ${productData.name}:`, error);
    }
  }
  
  console.log(`🎉 Products migration complete: ${createdProducts.length}/${productsData.length} created`);
  return createdProducts;
}

export async function runMigration() {
  console.log('🚀 Starting Sanity data migration...\n');
  
  try {
    // Step 1: Migrate categories
    const categories = await migrateCategories();
    console.log('');
    
    // Step 2: Migrate products
    const products = await migrateProducts(categories);
    console.log('');
    
    console.log('🎉 Migration completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${products.length}`);
    
    return { categories, products };
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Export for use in other files
export { categoriesData, productsData };

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration().catch(console.error);
}
