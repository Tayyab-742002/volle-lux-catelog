import { unstable_cache } from "next/cache";
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
    const fetchData = unstable_cache(
      async () => {
        return await client.fetch<SanityProduct[]>(ALL_PRODUCTS_QUERY);
      },
      ['products-all'],
      {
        tags: ['products:all', 'products:list'],
      }
    );
    const data = await fetchData();
    return data.map(transformSanityProduct);
  });
}

export async function getFeaturedProducts() {
  return safeQuery(async () => {
    const fetchData = unstable_cache(
      async () => {
        return await client.fetch<SanityProduct[]>(FEATURED_PRODUCTS_QUERY);
      },
      ['products-featured'],
      {
        tags: ['products:featured', 'products:list'],
      }
    );
    const data = await fetchData();
    return data.map(transformSanityProduct);
  });
}

export async function getNewArrivals() {
  return safeQuery(async () => {
    const fetchData = unstable_cache(
      async () => {
        return await client.fetch<SanityProduct[]>(NEW_ARRIVALS_QUERY);
      },
      ['products-new'],
      {
        tags: ['products:new', 'products:list'],
      }
    );
    const data = await fetchData();
    return data.map(transformSanityProduct);
  });
}

export async function getProductBySlug(slug: string) {
  return safeQuery(async () => {
    const fetchData = unstable_cache(
      async () => {
        return await client.fetch<SanityProduct | null>(PRODUCT_BY_SLUG_QUERY, { slug });
      },
      [`product-${slug}`],
      {
        tags: [`product:${slug}`, 'products:all'],
      }
    );
    const product = await fetchData();
    return product ? transformSanityProduct(product) : null;
  });
}

export async function getProductsByCategory(categoryId: string) {
  return safeQuery(async () => {
    const fetchData = unstable_cache(
      async () => {
        return await client.fetch<SanityProduct[]>(PRODUCTS_BY_CATEGORY_QUERY, { categoryId });
      },
      [`products-category-${categoryId}`],
      {
        tags: ['products:filtered', 'products:list'],
      }
    );
    const products = await fetchData();
    return products.map(transformSanityProduct);
  });
}

export async function getProductsByCategorySlug(categorySlug: string) {
  return safeQuery(async () => {
    const fetchData = unstable_cache(
      async () => {
        return await client.fetch<SanityProduct[]>(PRODUCTS_BY_CATEGORY_SLUG_QUERY, { categorySlug });
      },
      [`products-category-slug-${categorySlug}`],
      {
        tags: [`category:${categorySlug}`, 'products:filtered', 'products:list'],
      }
    );
    const products = await fetchData();
    return products.map(transformSanityProduct);
  });
}

export async function getProductsByIds(ids: string[]) {
  return safeQuery(async () => {
    const fetchData = unstable_cache(
      async () => {
        return await client.fetch<SanityProduct[]>(PRODUCTS_BY_IDS_QUERY, { ids });
      },
      [`products-ids-${ids.sort().join('-')}`],
      {
        tags: ['products:all'],
      }
    );
    const products = await fetchData();
    return products.map(transformSanityProduct);
  });
}

export async function searchProducts(searchTerm: string) {
  return safeQuery(async () => {
    const fetchData = unstable_cache(
      async () => {
        return await client.fetch<SanityProduct[]>(SEARCH_PRODUCTS_QUERY, { searchTerm });
      },
      [`products-search-${searchTerm}`],
      {
        tags: ['products:search', 'products:list'],
      }
    );
    const products = await fetchData();
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

    const cacheKey = `products-filtered-${JSON.stringify(filters)}-${sortBy}`;
    const fetchData = unstable_cache(
      async () => {
        return await client.fetch<SanityProduct[]>(query);
      },
      [cacheKey],
      {
        tags: ['products:filtered', 'products:list'],
      }
    );
    const products = await fetchData();
    return (products as SanityProduct[]).map(transformSanityProduct);
  });
}

// Categories
export async function getAllCategories() {
  return safeQuery(async () => {
    const fetchData = unstable_cache(
      async () => {
        return await client.fetch<SanityCategory[]>(ALL_CATEGORIES_QUERY);
      },
      ['categories-all'],
      {
        tags: ['categories:all', 'homepage'],
      }
    );
    const data = await fetchData();
    return data.map(transformSanityCategory);
  });
}

export async function getCategoriesWithFeaturedProducts() {
  return safeQuery(async () => {
    const fetchData = unstable_cache(
      async () => {
        return await client.fetch<Array<SanityCategory & { featuredProducts?: SanityProduct[] }>>(
          CATEGORIES_WITH_FEATURED_PRODUCTS_QUERY
        );
      },
      ['categories-featured'],
      {
        tags: ['categories:all', 'homepage'],
      }
    );
    const data = await fetchData();
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
    const fetchData = unstable_cache(
      async () => {
        return await client.fetch<SanityCategory | null>(CATEGORY_BY_SLUG_QUERY, { slug });
      },
      [`category-${slug}`],
      {
        tags: [`category:${slug}`, 'categories:all'],
      }
    );
    const category = await fetchData();
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
    const fetchData = unstable_cache(
      async () => {
        return await client.fetch<SanityBanner[]>(ALL_BANNERS_QUERY);
      },
      ['banners-all'],
      {
        tags: ['banners', 'homepage'],
      }
    );
    const data = await fetchData();
    return data.map(transformSanityBanner);
  });
}

// Announcements
export async function getActiveAnnouncement() {
  return safeQuery(async () => {
    const fetchData = unstable_cache(
      async () => {
        return await client.fetch<SanityAnnouncement | null>(ACTIVE_ANNOUNCEMENT_QUERY);
      },
      ['announcement-active'],
      {
        tags: ['announcements', 'homepage'],
      }
    );
    const data = await fetchData();
    return data ? transformSanityAnnouncement(data) : null;
  });
}

// Homepage data
export async function getHomepageData() {
  return safeQuery(async () => {
    const fetchData = unstable_cache(
      async () => {
        return await client.fetch<{
          categories: SanityCategory[];
          featuredProducts: SanityProduct[];
          newArrivals: SanityProduct[];
        }>(HOMEPAGE_DATA_QUERY);
      },
      ['homepage-data'],
      {
        tags: ['homepage', 'categories:all', 'products:featured', 'products:new'],
      }
    );
    const data = await fetchData();

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
