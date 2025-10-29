"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("App route error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h2 className="mb-3 text-2xl font-semibold">Something went wrong</h2>
      <p className="mx-auto mb-6 max-w-lg text-muted-foreground">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>
    </div>
  );
}
