// This file must be a Server Component (no "use client")
// Import SanityLive directly from live.ts to avoid importing the main index
// which might be evaluated in client component contexts
import { SanityLive } from "@/sanity/lib/live";

/**
 * Server Component wrapper for SanityLive
 * This ensures SanityLive is only used in Server Components context
 * Note: SanityLive requires Server Component context and cannot be used during static generation
 * 
 * IMPORTANT: This component should ONLY be imported directly in Server Components (like app/layout.tsx)
 * DO NOT export it from components/common/index.ts to prevent client components from importing it
 */
export function SanityLiveWrapper() {
  // SanityLive must be rendered in a Server Component
  // defineLive (used internally) will throw an error if called outside Server Component context
  return <SanityLive />;
}



