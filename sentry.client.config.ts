// PERFORMANCE: Error tracking for client-side errors
// This configuration sets up Sentry for client-side error tracking
// Enable in production by setting NEXT_PUBLIC_SENTRY_DSN environment variable

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // Only initialize if DSN is provided (production)
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
  
  // Enable only in production
  enabled: process.env.NODE_ENV === "production",
  
  // Performance monitoring - adjust sample rate as needed
  tracesSampleRate: 0.1, // 10% of transactions
  
  // Debugging in development
  debug: false,
  
  // Replay sessions for error reproduction
  replaysOnErrorSampleRate: 1.0, // 100% of errors
  replaysSessionSampleRate: 0.1, // 10% of normal sessions
  
  // Filter out noisy errors
  ignoreErrors: [
    // Browser extensions
    /extensions\//i,
    /^chrome:\/\//i,
    "ResizeObserver loop",
    // Network errors
    "NetworkError",
    "Failed to fetch",
    // Hydration errors (usually harmless)
    "Hydration failed",
  ],
  
  // Environment
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
  
  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
});

