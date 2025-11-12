export { Header } from "./header";
export { Footer } from "./footer";
export { Breadcrumbs } from "./breadcrumbs";
export { ErrorBoundary } from "./ErrorBoundary";
// Note: AnnouncementBannerWrapper and SanityLiveWrapper are NOT exported here
// to prevent client components from importing them (which would pull in server-only code).
// Import them directly in server components (like app/layout.tsx) instead.
