import { client } from "./client";
import { urlFor } from "./image";
import {
  ALL_PRODUCTS_QUERY,
  FEATURED_PRODUCTS_QUERY,
  NEW_ARRIVALS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
  ALL_CATEGORIES_QUERY,
  SEARCH_PRODUCTS_QUERY,
  FILTERED_PRODUCTS_QUERY,
  PRODUCTS_BY_IDS_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  PRODUCT_COUNT_BY_CATEGORY_QUERY,
  HOMEPAGE_DATA_QUERY,
} from "./queries";

// Types for our data
export interface SanityProduct {
  _id: string;
  _type: string;
  name: string;
  slug: { current: string };
  productCode: string;
  description?: string;
  shortDescription?: string;
  basePrice: number;
  discount?: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  delivery?: string;
  category?: {
    _id: string;
    name: string;
    slug: { current: string };
    image?: any;
  };
  mainImage?: {
    asset: {
      _id: string;
      url: string;
      metadata: {
        dimensions: {
          width: number;
          height: number;
        };
      };
    };
    alt?: string;
  };
  galleryImages?: Array<{
    asset: {
      _id: string;
      url: string;
      metadata: {
        dimensions: {
          width: number;
          height: number;
        };
      };
    };
    alt?: string;
  }>;
  variants?: Array<{
    name: string;
    sku: string;
    priceAdjustment: number;
    isActive: boolean;
    stockQuantity?: number;
  }>;
  pricingTiers?: Array<{
    minQuantity: number;
    maxQuantity?: number;
    pricePerUnit: number;
    discount?: number;
    label?: string;
  }>;
  specifications?: Array<{
    name: string;
    value: string;
  }>;
}

export interface SanityCategory {
  _id: string;
  _type: string;
  name: string;
  slug: { current: string };
  description?: string;
  image?: {
    asset: {
      _id: string;
      url: string;
      metadata: {
        dimensions: {
          width: number;
          height: number;
        };
      };
    };
    alt?: string;
  };
  isActive: boolean;
  sortOrder: number;
}

export interface SanityBanner {
  _id: string;
  _type: string;
  title?: string;
  description?: string;
  index: number;
  isActive: boolean;
  mediaType: "image" | "video";
  backgroundImage?: {
    asset: {
      _id: string;
      url: string;
      metadata: {
        dimensions: {
          width: number;
          height: number;
        };
      };
    };
    alt?: string;
  };
  backgroundVideo?: {
    asset: {
      _id: string;
      url: string;
    };
  };
  videoUrl?: string;
  videoPoster?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  videoSettings?: {
    autoplay: boolean;
    loop: boolean;
    muted: boolean;
    showControls: boolean;
  };
}

export interface SanityAnnouncement {
  _id: string;
  _type: string;
  message: string;
  link?: string;
  linkText?: string;
  isActive: boolean;
  dismissible: boolean;
}

// Transform Sanity product to our Product type
/**
 * Generate descriptive alt text for product images
 * Falls back to product name with context if alt text is not provided
 */
function generateImageAlt(
  alt: string | undefined,
  productName: string,
  category?: string,
  imageIndex?: number
): string {
  if (alt && alt.trim()) {
    return alt;
  }
  
  const categoryContext = category ? ` ${category}` : "";
  const imageContext = imageIndex !== undefined && imageIndex > 0 
    ? ` - View ${imageIndex + 1}` 
    : "";
  
  return `${productName}${categoryContext} packaging supplies${imageContext}`;
}

export function transformSanityProduct(sanityProduct: SanityProduct) {
  const productName = sanityProduct.name;
  const category = sanityProduct.category?.name;
  
  // Generate alt text for main image
  const mainImageAlt = generateImageAlt(
    sanityProduct.mainImage?.alt,
    productName,
    category
  );
  
  // Generate alt text for gallery images
  const galleryImagesAlt = sanityProduct.galleryImages?.map((img, index) =>
    generateImageAlt(img.alt, productName, category, index + 1)
  ) || [];
  
  return {
    id: sanityProduct._id,
    product_code: sanityProduct.productCode,
    name: productName,
    slug: sanityProduct.slug.current,
    description: sanityProduct.description,
    image: sanityProduct.mainImage?.asset?.url || "",
    imageAlt: mainImageAlt,
    images: sanityProduct.galleryImages?.map((img) => img.asset.url) || [],
    imagesAlt: galleryImagesAlt,
    basePrice: sanityProduct.basePrice,
    discount: sanityProduct.discount,
    category: category,
    categorySlug: sanityProduct.category?.slug?.current,
    variants:
      sanityProduct.variants?.map((variant) => ({
        id: `${sanityProduct._id}-${variant.sku}`,
        name: variant.name,
        sku: variant.sku,
        price_adjustment: variant.priceAdjustment,
      })) || [],
    pricingTiers:
      sanityProduct.pricingTiers?.map((tier) => ({
        minQuantity: tier.minQuantity,
        maxQuantity: tier.maxQuantity,
        pricePerUnit: tier.pricePerUnit,
        discount: tier.discount,
        label: tier.label,
      })) || [],
    specifications:
      sanityProduct.specifications?.reduce(
        (acc, spec) => {
          acc[spec.name] = spec.value;
          return acc;
        },
        {} as Record<string, string>
      ) || {},
    delivery: sanityProduct.delivery,
    seoTitle: sanityProduct.seoTitle,
    seoDescription: sanityProduct.seoDescription,
  };
}

// Transform Sanity category to our Category type
export function transformSanityCategory(sanityCategory: SanityCategory) {
  // Generate descriptive alt text for category images
  const categoryImageAlt = sanityCategory.image?.alt 
    ? sanityCategory.image.alt
    : `${sanityCategory.name} packaging supplies category`;
  
  return {
    id: sanityCategory._id,
    name: sanityCategory.name,
    slug: sanityCategory.slug.current,
    description: sanityCategory.description,
    image: sanityCategory.image?.asset?.url || "",
    imageAlt: categoryImageAlt,
    isActive: sanityCategory.isActive,
    sortOrder: sanityCategory.sortOrder,
  };
}

// Transform Sanity banner to our Banner type
export function transformSanityBanner(sanityBanner: SanityBanner) {
  return {
    id: sanityBanner._id,
    title: sanityBanner.title || "",
    description: sanityBanner.description || "",
    index: sanityBanner.index,
    mediaType: sanityBanner.mediaType || "image",
    image: sanityBanner.backgroundImage?.asset?.url || "",
    alt: sanityBanner.backgroundImage?.alt || sanityBanner.title || `Banner ${sanityBanner.index}`,
    video: sanityBanner.backgroundVideo?.asset?.url || sanityBanner.videoUrl || "",
    videoPoster: sanityBanner.videoPoster?.asset?.url || "",
    videoSettings: sanityBanner.videoSettings || {
      autoplay: true,
      loop: true,
      muted: true,
      showControls: false,
    },
  };
}

// Transform Sanity announcement to our Announcement type
export function transformSanityAnnouncement(
  sanityAnnouncement: SanityAnnouncement
) {
  return {
    id: sanityAnnouncement._id,
    message: sanityAnnouncement.message,
    link: sanityAnnouncement.link || null,
    linkText: sanityAnnouncement.linkText || null,
    dismissible: sanityAnnouncement.dismissible,
  };
}

// Helper function to get optimized image URL
export function getImageUrl(source: any, width?: number, height?: number) {
  if (!source) return "";

  let builder = urlFor(source);

  if (width) builder = builder.width(width);
  if (height) builder = builder.height(height);

  return builder.url();
}

// Helper function to build filter string for GROQ
export function buildFilterString(filters: {
  category?: string;
  size?: string[];
  material?: string[];
  color?: string[];
  ecoFriendly?: string[];
  priceMin?: number;
  priceMax?: number;
}) {
  const filterParts: string[] = [];

  if (filters.category) {
    // Match by category slug (preferred) and fall back to name match
    filterParts.push(
      `(category->slug.current == "${filters.category}" || category->name match "${filters.category}")`
    );
  }

  if (filters.size && filters.size.length > 0) {
    const sizeFilter = filters.size
      .map((size) => `variants[].name match "${size}"`)
      .join(" || ");
    filterParts.push(`(${sizeFilter})`);
  }

  if (filters.material && filters.material.length > 0) {
    const materialFilter = filters.material
      .map((material) => `tags[] match "${material}"`)
      .join(" || ");
    filterParts.push(`(${materialFilter})`);
  }

  if (filters.color && filters.color.length > 0) {
    const colorFilter = filters.color
      .map((color) => `tags[] match "${color}"`)
      .join(" || ");
    filterParts.push(`(${colorFilter})`);
  }

  if (filters.ecoFriendly && filters.ecoFriendly.length > 0) {
    const ecoFilter = filters.ecoFriendly
      .map((eco) => `tags[] match "${eco}"`)
      .join(" || ");
    filterParts.push(`(${ecoFilter})`);
  }

  if (filters.priceMin !== undefined) {
    filterParts.push(`basePrice >= ${filters.priceMin}`);
  }

  if (filters.priceMax !== undefined) {
    filterParts.push(`basePrice <= ${filters.priceMax}`);
  }

  return filterParts.length > 0 ? `&& ${filterParts.join(" && ")}` : "";
}

// Helper function to build order string for GROQ
export function buildOrderString(sortBy: string) {
  switch (sortBy) {
    case "newest":
      return "_createdAt desc";
    case "oldest":
      return "_createdAt asc";
    case "price-low":
      return "basePrice asc";
    case "price-high":
      return "basePrice desc";
    case "name-asc":
      return "name asc";
    case "name-desc":
      return "name desc";
    case "featured":
      return "isFeatured desc, name asc";
    default:
      return "name asc";
  }
}

// Error handling wrapper
export async function safeQuery<T>(
  queryFn: () => Promise<T>
): Promise<T | null> {
  try {
    return await queryFn();
  } catch (error) {
    console.error("Sanity query error:", error);
    return null;
  }
}
