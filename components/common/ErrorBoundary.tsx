"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

type ErrorBoundaryProps = {
  fallback?: React.ReactNode;
  children: React.ReactNode;
  onReset?: () => void;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  backUrl?: string;
  title?: string;
  description?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error | null;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error } as ErrorBoundaryState;
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log error for debugging
    console.error("ErrorBoundary caught an error", { error, info });

    // In production, you could send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: info });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="relative min-h-[400px] flex items-center justify-center py-16 px-4">
          <div className="mx-auto max-w-2xl text-center">
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-linear-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center border-4 border-emerald-200">
                  <AlertCircle
                    className="w-10 h-10 text-emerald-600"
                    strokeWidth={2}
                  />
                </div>
              </div>
            </div>

            {/* Heading */}
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-gray-900">
              {this.props.title || "Something Went Wrong"}
            </h2>

            {/* Error Message */}
            <div className="mb-8 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <p className="text-base text-gray-600 md:text-lg">
                {this.props.description ||
                  this.state.error?.message ||
                  "An unexpected error occurred. Please try again or refresh the page."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 hover:from-emerald-700 hover:to-teal-700"
              >
                <RefreshCw className="w-4 h-4" strokeWidth={2} />
                Try Again
              </Button>

              {this.props.showBackButton && this.props.backUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold border-2 border-emerald-300 text-emerald-700 bg-white rounded-lg hover:bg-emerald-50 hover:border-emerald-600 transition-all duration-300 hover:scale-105"
                >
                  <Link href={this.props.backUrl}>
                    <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                    Go Back
                  </Link>
                </Button>
              )}

              {this.props.showHomeButton && (
                <Button
                  asChild
                  variant="outline"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold border-2 border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105"
                >
                  <Link href="/">
                    <Home className="w-4 h-4" strokeWidth={2} />
                    Go Home
                  </Link>
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold border-2 border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105"
              >
                <RefreshCw className="w-4 h-4" strokeWidth={2} />
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
