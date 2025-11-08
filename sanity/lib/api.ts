import { client } from "./client";
import { sanityFetch } from "./live";
import {
  ALL_PRODUCTS_QUERY,
  FEATURED_PRODUCTS_QUERY,
  NEW_ARRIVALS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
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
    const { data } = await sanityFetch({
      query: ALL_PRODUCTS_QUERY,
      tags: ["products:all"],
    });
    return (data as SanityProduct[]).map(transformSanityProduct);
  });
}

export async function getFeaturedProducts() {
  return safeQuery(async () => {
    const { data } = await sanityFetch({
      query: FEATURED_PRODUCTS_QUERY,
      tags: ["products:featured"],
    });
    return (data as SanityProduct[]).map(transformSanityProduct);
  });
}

export async function getNewArrivals() {
  return safeQuery(async () => {
    const { data } = await sanityFetch({
      query: NEW_ARRIVALS_QUERY,
      tags: ["products:new"],
    });
    return (data as SanityProduct[]).map(transformSanityProduct);
  });
}

export async function getProductBySlug(slug: string) {
  return safeQuery(async () => {
    const { data: product } = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: { slug },
      tags: [`product:${slug}`],
    });
    return product ? transformSanityProduct(product) : null;
  });
}

export async function getProductsByCategory(categoryId: string) {
  return safeQuery(async () => {
    const { data: products } = await sanityFetch({
      query: PRODUCTS_BY_CATEGORY_QUERY,
      params: { categoryId },
      tags: [`category:${categoryId}`, "products:list"],
    });
    return (products as SanityProduct[]).map(transformSanityProduct);
  });
}

export async function getProductsByIds(ids: string[]) {
  return safeQuery(async () => {
    const { data: products } = await sanityFetch({
      query: PRODUCTS_BY_IDS_QUERY,
      params: { ids },
      tags: ["products:batch"],
    });
    return (products as SanityProduct[]).map(transformSanityProduct);
  });
}

export async function searchProducts(searchTerm: string) {
  return safeQuery(async () => {
    const { data: products } = await sanityFetch({
      query: SEARCH_PRODUCTS_QUERY,
      params: { searchTerm },
      tags: ["products:search"],
    });
    return (products as SanityProduct[]).map(transformSanityProduct);
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

    const { data: products } = await sanityFetch({
      query,
      tags: ["products:filtered"],
    });
    return (products as SanityProduct[]).map(transformSanityProduct);
  });
}

// Categories
export async function getAllCategories() {
  return safeQuery(async () => {
    const { data } = await sanityFetch({
      query: ALL_CATEGORIES_QUERY,
      tags: ["categories:all"],
    });
    return (data as SanityCategory[]).map(transformSanityCategory);
  });
}

export async function getCategoriesWithFeaturedProducts() {
  return safeQuery(async () => {
    const { data } = await sanityFetch({
      query: CATEGORIES_WITH_FEATURED_PRODUCTS_QUERY,
      tags: ["categories:all"],
    });
    if (!data) return null;
    
    return (data as Array<SanityCategory & { featuredProducts?: SanityProduct[] }>).map((item) => ({
      ...transformSanityCategory(item),
      products: item.featuredProducts?.map((p) => transformSanityProduct(p)).map((p) => ({
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
    const { data: category } = await sanityFetch({
      query: CATEGORY_BY_SLUG_QUERY,
      params: { slug },
      tags: [`category:${slug}`],
    });
    return (category as SanityCategory | null)
      ? transformSanityCategory(category as SanityCategory)
      : null;
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
    const { data } = await sanityFetch({
      query: ALL_BANNERS_QUERY,
      tags: ["banners:all"],
    });
    return (data as SanityBanner[]).map(transformSanityBanner);
  });
}

// Announcements
export async function getActiveAnnouncement() {
  return safeQuery(async () => {
    const { data } = await sanityFetch({
      query: ACTIVE_ANNOUNCEMENT_QUERY,
      tags: ["announcement:active"],
    });
    return data ? transformSanityAnnouncement(data as SanityAnnouncement) : null;
  });
}

// Homepage data
export async function getHomepageData() {
  return safeQuery(async () => {
    const { data } = await sanityFetch({
      query: HOMEPAGE_DATA_QUERY,
      tags: ["homepage"],
    });

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
