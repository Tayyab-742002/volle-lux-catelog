"use client";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

/**
 * Product Page Wrapper with Error Boundary
 * Wraps the product page content to catch and handle errors gracefully
 */
export function ProductPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      title="Unable to Load Product"
      description="We encountered an error while loading this product. Please try again or go back to browse other products."
      showBackButton
      backUrl="/products"
      showHomeButton
    >
      {children}
    </ErrorBoundary>
  );
}

