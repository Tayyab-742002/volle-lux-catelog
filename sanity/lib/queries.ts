/**
 * GROQ Queries for Sanity CMS
 * These queries fetch products, categories, and related data
 */

// Base product query with all fields
export const PRODUCT_QUERY = `
  _id,
  _type,
  name,
  slug,
  productCode,
  description,
  shortDescription,
  basePrice,
  discount,
  isActive,
  isFeatured,
  isNewArrival,
  tags,
  seoTitle,
  seoDescription,
  delivery,
  category-> {
    _id,
    name,
    slug,
    image
  },
  mainImage {
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    },
    alt
  },
  galleryImages[] {
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    },
    alt
  },
  variants[] {
    name,
    sku,
    priceAdjustment,
    isActive,
    stockQuantity
  },
  pricingTiers[] {
    minQuantity,
    maxQuantity,
    pricePerUnit,
    discount,
    label
  },
  specifications[] {
    name,
    value
  }
`;

// Simplified product query for listings
export const PRODUCT_LISTING_QUERY = `
  _id,
  _type,
  name,
  slug,
  productCode,
  shortDescription,
  basePrice,
  discount,
  isActive,
  isFeatured,
  isNewArrival,
  tags,
  category-> {
    _id,
    name,
    slug
  },
  mainImage {
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    },
    alt
  },
  galleryImages[] {
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    },
    alt
  },
  variants[] {
    name,
    sku,
    priceAdjustment,
    isActive
  }
`;

// Category query
export const CATEGORY_QUERY = `
  _id,
  _type,
  name,
  slug,
  description,
  image {
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    },
    alt
  },
  isActive,
  sortOrder
`;

// All products query
export const ALL_PRODUCTS_QUERY = `*[_type == "product" && isActive == true] | order(name asc) {
  ${PRODUCT_LISTING_QUERY}
}`;

// Featured products query
export const FEATURED_PRODUCTS_QUERY = `*[_type == "product" && isActive == true && isFeatured == true] | order(name asc) {
  ${PRODUCT_LISTING_QUERY}
}`;

// New arrivals query
export const NEW_ARRIVALS_QUERY = `*[_type == "product" && isActive == true && isNewArrival == true] | order(_createdAt desc) {
  ${PRODUCT_LISTING_QUERY}
}`;

// Single product by slug query
export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug && isActive == true][0] {
  ${PRODUCT_QUERY}
}`;

// Products by category query
export const PRODUCTS_BY_CATEGORY_QUERY = `*[_type == "product" && isActive == true && category._ref == $categoryId] | order(name asc) {
  ${PRODUCT_LISTING_QUERY}
}`;

// All categories query
export const ALL_CATEGORIES_QUERY = `*[_type == "category" && isActive == true] | order(sortOrder asc, name asc) {
  ${CATEGORY_QUERY}
}`;

// Categories with featured products for mega menu
export const CATEGORIES_WITH_FEATURED_PRODUCTS_QUERY = `*[_type == "category" && isActive == true] | order(sortOrder asc, name asc) {
  ${CATEGORY_QUERY},
  "featuredProducts": *[_type == "product" && isActive == true && isFeatured == true && category._ref == ^._id] | order(name asc) [0...3] {
    ${PRODUCT_LISTING_QUERY}
  }
}`;

// Search products query
export const SEARCH_PRODUCTS_QUERY = `*[_type == "product" && isActive == true && (
  name match $searchTerm ||
  description match $searchTerm ||
  productCode match $searchTerm ||
  tags[] match $searchTerm
)] | order(name asc) {
  ${PRODUCT_LISTING_QUERY}
}`;

// Filtered products query
export const FILTERED_PRODUCTS_QUERY = `*[_type == "product" && isActive == true $filters] | order($orderBy) {
  ${PRODUCT_LISTING_QUERY}
}`;

// Products by IDs query
export const PRODUCTS_BY_IDS_QUERY = `*[_type == "product" && _id in $ids && isActive == true] {
  ${PRODUCT_LISTING_QUERY}
}`;

// Category by slug query
export const CATEGORY_BY_SLUG_QUERY = `*[_type == "category" && slug.current == $slug && isActive == true][0] {
  ${CATEGORY_QUERY}
}`;

// Product count by category
export const PRODUCT_COUNT_BY_CATEGORY_QUERY = `*[_type == "product" && isActive == true && category._ref == $categoryId] | length`;

// Banner query
export const BANNER_QUERY = `
  _id,
  _type,
  title,
  description,
  index,
  isActive,
  backgroundImage {
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    },
    alt
  }
`;

// All banners query (ordered by index)
export const ALL_BANNERS_QUERY = `*[_type == "banner" && isActive == true] | order(index asc) {
  ${BANNER_QUERY}
}`;

// Announcement query
export const ANNOUNCEMENT_QUERY = `
  _id,
  _type,
  message,
  link,
  linkText,
  isActive,
  dismissible
`;

// Active announcement query (get the first active one)
export const ACTIVE_ANNOUNCEMENT_QUERY = `*[_type == "announcement" && isActive == true] | order(_createdAt desc) [0] {
  ${ANNOUNCEMENT_QUERY}
}`;

// Homepage data query (categories + featured products)
export const HOMEPAGE_DATA_QUERY = `{
  "categories": *[_type == "category" && isActive == true] | order(sortOrder asc, name asc) [0...6] {
    ${CATEGORY_QUERY}
  },
  "featuredProducts": *[_type == "product" && isActive == true && isFeatured == true] | order(name asc) [0...8] {
    ${PRODUCT_LISTING_QUERY}
  },
  "newArrivals": *[_type == "product" && isActive == true && isNewArrival == true] | order(_createdAt desc) [0...8] {
    ${PRODUCT_LISTING_QUERY}
  }
}`;

