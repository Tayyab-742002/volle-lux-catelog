// PERFORMANCE: Converted to Server Component (no client-side interactivity needed)
import Image from "next/image";
import type { Image as SanityImage } from "sanity";
import { buildSanityImage, getBlurDataURL } from "@/sanity/lib/image";

type Props = {
  image: SanityImage;
  alt: string;
  width: number;
  height?: number;
  priority?: boolean;
  className?: string;
  loading?: "lazy" | "eager";
};

export default function ResponsiveSanityImage({
  image,
  alt,
  width,
  height,
  priority,
  className,
  loading = "lazy", // PERFORMANCE: Default to lazy loading
}: Props) {
  const src = buildSanityImage(image, { width });
  
  // Only generate blur placeholder for priority images to reduce CDN requests
  let blur: string | undefined;
  if (priority) {
    blur = getBlurDataURL(image);
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height || Math.round((width * 3) / 4)}
      className={className}
      placeholder={priority && blur ? "blur" : "empty"}
      blurDataURL={blur}
      priority={priority}
      loading={priority ? "eager" : loading} // PERFORMANCE: Lazy load non-priority images
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
