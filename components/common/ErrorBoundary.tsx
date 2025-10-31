"use client";

import React from "react";

type ErrorBoundaryProps = {
  fallback?: React.ReactNode;
  children: React.ReactNode;
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
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught an error", { error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border bg-destructive/10 p-6 text-center">
          <h2 className="mb-2 text-lg font-semibold">Something went wrong</h2>
          <p className="mx-auto max-w-prose text-sm text-muted-foreground">
            An unexpected error occurred. Please try again or refresh the page.
          </p>
          {this.props.fallback}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
