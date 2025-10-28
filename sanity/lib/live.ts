// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { token, browserToken } from "../env";

// Enable live updates with tokens for real-time content
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token, // Server-side live updates
  browserToken: browserToken, // Client-side live preview
});
