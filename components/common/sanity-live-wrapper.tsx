import { SanityLive } from "@/sanity/lib";

/**
 * Server Component wrapper for SanityLive
 * This ensures SanityLive is only used in Server Components context
 * Note: SanityLive requires Server Component context and cannot be used during static generation
 */
export function SanityLiveWrapper() {
  // SanityLive must be rendered in a Server Component
  // This wrapper ensures it's only used in the proper context
  return <SanityLive />;
}

