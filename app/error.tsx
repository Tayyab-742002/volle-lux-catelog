"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App route error:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Content Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] min-h-screen flex items-center justify-center py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          {/* Error Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-linear-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center border-4 border-emerald-200">
                <AlertCircle
                  className="w-12 h-12 text-emerald-600"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900">
            Something Went
            <span className="block bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">
              Wrong
            </span>
          </h1>

          {/* Error Message */}
          <div className="mb-8 bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
            <p className="text-lg text-gray-600 md:text-xl">
              {error?.message ||
                "An unexpected error occurred. Please try again."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-8 py-6 text-base font-semibold bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:from-emerald-700 hover:to-teal-700"
            >
              <RefreshCw className="w-5 h-5" strokeWidth={2} />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-8 py-6 text-base font-semibold border-2 border-emerald-300 text-emerald-700 bg-white rounded-xl hover:bg-emerald-50 hover:border-emerald-600 transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" strokeWidth={2} />
              Refresh Page
            </Button>
            <Button
              asChild
              variant="outline"
              className="inline-flex items-center gap-2 px-8 py-6 text-base font-semibold border-2 border-gray-300 text-gray-700 bg-white rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105"
            >
              <Link href="/">
                <Home className="w-5 h-5" strokeWidth={2} />
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
