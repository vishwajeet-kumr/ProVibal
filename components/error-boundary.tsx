"use client";

// components/error-boundary.tsx — Global error boundary with warm design system

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallbackTitle?: string;
  readonly fallbackMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
            <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              {this.props.fallbackTitle ?? "Something went wrong"}
            </h2>
            <p className="mt-2 max-w-md text-sm text-[var(--text-muted)]">
              {this.props.fallbackMessage ??
                "An unexpected error occurred. Please try again or refresh the page."}
            </p>
          </div>
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#7A5C3E]"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
