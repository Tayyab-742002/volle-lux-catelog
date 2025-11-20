// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.

// CRITICAL: Mark this module as server-only to prevent client component imports
// This will throw an error at build time if imported in client components
import "server-only";

import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { token, browserToken } from "../env";

// Enable live updates with tokens for real-time content
// defineLive can only be used in React Server Components
// This module should ONLY be imported in Server Components
// WARNING: This will throw an error if imported in client components
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token || undefined, // Server-side live updates
  browserToken: browserToken ? browserToken : false, // Set to false to silence warning about Viewer rights
});
