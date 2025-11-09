// PERFORMANCE: Instrumentation for monitoring and error tracking
// This file is automatically loaded by Next.js before server startup
import * as Sentry from "@sentry/nextjs";
export async function register() {
  // Initialize Sentry on server startup
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;