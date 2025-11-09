// PERFORMANCE: Image optimization utilities for Phase 4
// Generates blur placeholders and optimizes image loading

/**
 * Generate a blur data URL for placeholder images
 * This creates a tiny SVG that serves as a placeholder while the real image loads
 */
export function getBlurDataURL(width: number = 400, height: number = 300): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(236,253,245);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(209,250,229);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
    </svg>
  `.trim();

  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generate a shimmer effect blur data URL
 * Creates an animated shimmer placeholder for better perceived performance
 */
export function getShimmerBlurDataURL(width: number = 400, height: number = 300): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1">
            <animate attributeName="stop-color" values="#f3f4f6;#e5e7eb;#f3f4f6" dur="1.5s" repeatCount="indefinite"/>
          </stop>
          <stop offset="50%" style="stop-color:#e5e7eb;stop-opacity:1">
            <animate attributeName="stop-color" values="#e5e7eb;#d1d5db;#e5e7eb" dur="1.5s" repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" style="stop-color:#f3f4f6;stop-opacity:1">
            <animate attributeName="stop-color" values="#f3f4f6;#e5e7eb;#f3f4f6" dur="1.5s" repeatCount="indefinite"/>
          </stop>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#shimmer)"/>
    </svg>
  `.trim();

  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Get optimized Sanity image URL with responsive sizing
 * Automatically generates srcset for responsive images
 */
export function getSanityImageUrl(
  imageUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "avif" | "auto";
  } = {}
): string {
  if (!imageUrl) return "";

  const {
    width,
    height,
    quality = 85,
    format = "auto",
  } = options;

  // Parse Sanity CDN URL
  const url = new URL(imageUrl);
  const params = new URLSearchParams();

  if (width) params.set("w", width.toString());
  if (height) params.set("h", height.toString());
  params.set("q", quality.toString());
  params.set("fm", format);
  params.set("fit", "max");

  return `${url.origin}${url.pathname}?${params.toString()}`;
}

/**
 * Generate responsive srcset for images
 * Creates multiple sizes for different screen densities
 */
export function generateSrcSet(imageUrl: string, sizes: number[]): string {
  return sizes
    .map((size) => {
      const url = getSanityImageUrl(imageUrl, { width: size });
      return `${url} ${size}w`;
    })
    .join(", ");
}

/**
 * Get optimal image format based on browser support
 * Prefers AVIF, falls back to WebP, then original
 */
export function getOptimalImageFormat(): "avif" | "webp" | "auto" {
  if (typeof window === "undefined") return "auto";

  // Check AVIF support
  const avifSupport = document
    .createElement("canvas")
    .toDataURL("image/avif")
    .indexOf("data:image/avif") === 0;

  if (avifSupport) return "avif";

  // Check WebP support
  const webpSupport = document
    .createElement("canvas")
    .toDataURL("image/webp")
    .indexOf("data:image/webp") === 0;

  if (webpSupport) return "webp";

  return "auto";
}

/**
 * Preload critical images for LCP optimization
 * Use this for above-the-fold images
 */
export function preloadImage(src: string, priority: "high" | "low" = "high") {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = src;
  link.fetchPriority = priority;

  document.head.appendChild(link);
}

