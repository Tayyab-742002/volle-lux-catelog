/**
 * Cache helpers for Next.js fetch and data functions
 * - Use revalidation and tags for fine-grained cache control
 */

export type CacheOptions = {
  revalidate?: number; // seconds
  tags?: string[];
};

export async function cachedFetch<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit,
  options: CacheOptions = {}
): Promise<T> {
  const { revalidate = 60, tags = [] } = options;
  const res = await fetch(input, {
    ...init,
    next: { revalidate, tags },
  });
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

/**
 * Utility to generate cache tags consistently
 */
export const cacheTag = {
  product: (slug: string) => `product:${slug}`,
  productsList: (key = "all") => `products:${key}`,
  category: (slug: string) => `category:${slug}`,
};
