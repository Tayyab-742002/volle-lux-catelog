import { client } from "./client";
// NOTE: We use client.fetch() directly instead of sanityFetch to avoid importing live.ts
// This makes api.ts safe to import in any context (client or server)
// For pages that need live updates, use sanityFetch directly from "@/sanity/lib/live"
import {
  ALL_PRODUCTS_QUERY,
  FEATURED_PRODUCTS_QUERY,
  NEW_ARRIVALS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
  PRODUCTS_BY_CATEGORY_SLUG_QUERY,
  ALL_CATEGORIES_QUERY,
  CATEGORIES_WITH_FEATURED_PRODUCTS_QUERY,
  SEARCH_PRODUCTS_QUERY,
  FILTERED_PRODUCTS_QUERY,
  PRODUCTS_BY_IDS_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  PRODUCT_COUNT_BY_CATEGORY_QUERY,
  HOMEPAGE_DATA_QUERY,
  ALL_BANNERS_QUERY,
  ACTIVE_ANNOUNCEMENT_QUERY,
} from "./queries";
import {
  transformSanityProduct,
  transformSanityCategory,
  transformSanityBanner,
  transformSanityAnnouncement,
  buildFilterString,
  buildOrderString,
  safeQuery,
  SanityProduct,
  SanityCategory,
  SanityBanner,
  SanityAnnouncement,
} from "./helpers";

/**
 * Sanity API Functions
 * These functions provide a clean interface to fetch data from Sanity CMS
 */

// Products
export async function getAllProducts() {
  return safeQuery(async () => {
    const data = await client.fetch<SanityProduct[]>(ALL_PRODUCTS_QUERY);
    return data.map(transformSanityProduct);
  });
}

export async function getFeaturedProducts() {
  return safeQuery(async () => {
    const data = await client.fetch<SanityProduct[]>(FEATURED_PRODUCTS_QUERY);
    return data.map(transformSanityProduct);
  });
}

export async function getNewArrivals() {
  return safeQuery(async () => {
    const data = await client.fetch<SanityProduct[]>(NEW_ARRIVALS_QUERY);
    return data.map(transformSanityProduct);
  });
}

export async function getProductBySlug(slug: string) {
  return safeQuery(async () => {
    const product = await client.fetch<SanityProduct | null>(PRODUCT_BY_SLUG_QUERY, { slug });
    return product ? transformSanityProduct(product) : null;
  });
}

export async function getProductsByCategory(categoryId: string) {
  return safeQuery(async () => {
    const products = await client.fetch<SanityProduct[]>(PRODUCTS_BY_CATEGORY_QUERY, { categoryId });
    return products.map(transformSanityProduct);
  });
}

export async function getProductsByCategorySlug(categorySlug: string) {
  return safeQuery(async () => {
    const products = await client.fetch<SanityProduct[]>(PRODUCTS_BY_CATEGORY_SLUG_QUERY, { categorySlug });
    return products.map(transformSanityProduct);
  });
}

export async function getProductsByIds(ids: string[]) {
  return safeQuery(async () => {
    const products = await client.fetch<SanityProduct[]>(PRODUCTS_BY_IDS_QUERY, { ids });
    return products.map(transformSanityProduct);
  });
}

export async function searchProducts(searchTerm: string) {
  return safeQuery(async () => {
    const products = await client.fetch<SanityProduct[]>(SEARCH_PRODUCTS_QUERY, { searchTerm });
    return products.map(transformSanityProduct);
  });
}

export async function getFilteredProducts(
  filters: {
    category?: string;
    size?: string[];
    material?: string[];
    color?: string[];
    ecoFriendly?: string[];
    priceMin?: number;
    priceMax?: number;
  },
  sortBy: string = "name-asc"
) {
  return safeQuery(async () => {
    const filterString = buildFilterString(filters);
    const orderString = buildOrderString(sortBy);
    const query = FILTERED_PRODUCTS_QUERY.replace(
      "$filters",
      filterString
    ).replace("$orderBy", orderString);

    const products = await client.fetch<SanityProduct[]>(query);
    return (products as SanityProduct[]).map(transformSanityProduct);
  });
}

// Categories
export async function getAllCategories() {
  return safeQuery(async () => {
    const data = await client.fetch<SanityCategory[]>(ALL_CATEGORIES_QUERY);
    return data.map(transformSanityCategory);
  });
}

export async function getCategoriesWithFeaturedProducts() {
  return safeQuery(async () => {
    const data = await client.fetch<Array<SanityCategory & { featuredProducts?: SanityProduct[] }>>(
      CATEGORIES_WITH_FEATURED_PRODUCTS_QUERY
    );
    if (!data) return null;

    return data.map((item) => ({
      ...transformSanityCategory(item),
      products: item.featuredProducts
        ?.map((p) => transformSanityProduct(p))
        .map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          image: p.image,
          price: p.basePrice,
        })),
    }));
  });
}

export async function getCategoryBySlug(slug: string) {
  return safeQuery(async () => {
    const category = await client.fetch<SanityCategory | null>(CATEGORY_BY_SLUG_QUERY, { slug });
    return category ? transformSanityCategory(category) : null;
  });
}

export async function getProductCountByCategory(categoryId: string) {
  return safeQuery(async () => {
    return await client.fetch<number>(PRODUCT_COUNT_BY_CATEGORY_QUERY, {
      categoryId,
    });
  });
}

// Banners
export async function getAllBanners() {
  return safeQuery(async () => {
    const data = await client.fetch<SanityBanner[]>(ALL_BANNERS_QUERY);
    return data.map(transformSanityBanner);
  });
}

// Announcements
export async function getActiveAnnouncement() {
  return safeQuery(async () => {
    const data = await client.fetch<SanityAnnouncement | null>(ACTIVE_ANNOUNCEMENT_QUERY);
    return data ? transformSanityAnnouncement(data) : null;
  });
}

// Homepage data
export async function getHomepageData() {
  return safeQuery(async () => {
    const data = await client.fetch<{
      categories: SanityCategory[];
      featuredProducts: SanityProduct[];
      newArrivals: SanityProduct[];
    }>(HOMEPAGE_DATA_QUERY);

    const typed = data as {
      categories: SanityCategory[];
      featuredProducts: SanityProduct[];
      newArrivals: SanityProduct[];
    };
    return {
      categories: typed.categories.map(transformSanityCategory),
      featuredProducts: typed.featuredProducts.map(transformSanityProduct),
      newArrivals: typed.newArrivals.map(transformSanityProduct),
    };
  });
}

// Utility functions
export async function testConnection() {
  try {
    const result = await client.fetch('*[_type == "product"][0]._id');
    return !!result;
  } catch (error) {
    console.error("Sanity connection test failed:", error);
    return false;
  }
}

export async function getProductSlugs() {
  return safeQuery(async () => {
    const slugs = await client.fetch<Array<{ slug?: { current?: string } }>>(
      '*[_type == "product" && isActive == true]{ slug }'
    );
    // Filter out any null/undefined slug values
    return slugs
      .filter((item) => item?.slug?.current)
      .map((item) => item.slug!.current);
  });
}

export async function getCategorySlugs() {
  return safeQuery(async () => {
    const slugs = await client.fetch<Array<{ slug?: { current?: string } }>>(
      '*[_type == "category" && isActive == true]{ slug }'
    );
    // Filter out any null/undefined slug values
    return slugs
      .filter((item) => item?.slug?.current)
      .map((item) => item.slug!.current);
  });
}
