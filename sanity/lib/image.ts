import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { Image } from "sanity";
import { dataset, projectId } from "../env";

// Single builder instance
const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => builder.image(source);

export function buildSanityImage(
  src: Image,
  opts?: { width?: number; height?: number; quality?: number }
) {
  const { width = 800, height, quality = 80 } = opts || {};
  let url = urlFor(src).width(width).fit("max").quality(quality);
  if (height) url = url.height(height);
  return url.url();
}

export function getBlurDataURL(src: Image) {
  return urlFor(src).width(24).height(24).blur(50).quality(30).url();
}

export const imagePresets = {
  card: (source: SanityImageSource) =>
    urlFor(source).width(400).height(400).fit("crop").quality(80),
  thumbnail: (source: SanityImageSource) =>
    urlFor(source).width(100).height(100).fit("crop").quality(70),
  gallery: (source: SanityImageSource) =>
    urlFor(source).width(800).height(800).fit("crop").quality(85),
  hero: (source: SanityImageSource) =>
    urlFor(source).width(1200).height(600).fit("crop").quality(90),
  category: (source: SanityImageSource) =>
    urlFor(source).width(600).height(400).fit("crop").quality(85),
  seo: (source: SanityImageSource) =>
    urlFor(source).width(1200).height(630).fit("crop").quality(90),
};

export const getResponsiveImageUrls = (source: SanityImageSource) => {
  if (!source) return { src: "", srcSet: "" };
  const baseUrl = urlFor(source);
  return {
    src: baseUrl.width(400).quality(80).url(),
    srcSet: [
      `${baseUrl.width(200).quality(70).url()} 200w`,
      `${baseUrl.width(400).quality(80).url()} 400w`,
      `${baseUrl.width(800).quality(85).url()} 800w`,
      `${baseUrl.width(1200).quality(90).url()} 1200w`,
    ].join(", "),
  };
};

// Backwards-compatible alias used by older imports
export const urlForImage = (source: SanityImageSource) => urlFor(source);
