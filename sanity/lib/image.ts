import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

// Enhanced image URL builder with common presets
export const urlForImage = (source: SanityImageSource) => {
  return builder.image(source)
}

// Common image presets for different use cases
export const imagePresets = {
  // Product card images
  card: (source: SanityImageSource) => 
    urlFor(source).width(400).height(400).fit('crop').quality(80),
  
  // Product gallery thumbnails
  thumbnail: (source: SanityImageSource) => 
    urlFor(source).width(100).height(100).fit('crop').quality(70),
  
  // Product gallery main images
  gallery: (source: SanityImageSource) => 
    urlFor(source).width(800).height(800).fit('crop').quality(85),
  
  // Hero images
  hero: (source: SanityImageSource) => 
    urlFor(source).width(1200).height(600).fit('crop').quality(90),
  
  // Category images
  category: (source: SanityImageSource) => 
    urlFor(source).width(600).height(400).fit('crop').quality(85),
  
  // SEO optimized images
  seo: (source: SanityImageSource) => 
    urlFor(source).width(1200).height(630).fit('crop').quality(90),
}

// Helper function to get responsive image URLs
export const getResponsiveImageUrls = (source: SanityImageSource) => {
  if (!source) return { src: '', srcSet: '' };
  
  const baseUrl = urlFor(source);
  
  return {
    src: baseUrl.width(400).quality(80).url(),
    srcSet: [
      `${baseUrl.width(200).quality(70).url()} 200w`,
      `${baseUrl.width(400).quality(80).url()} 400w`,
      `${baseUrl.width(800).quality(85).url()} 800w`,
      `${baseUrl.width(1200).quality(90).url()} 1200w`,
    ].join(', '),
  };
}
