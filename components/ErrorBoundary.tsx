"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  /** Optional label shown in the error card (e.g. the tab name). */
  label?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * ErrorBoundary
 * Wraps individual workspace tabs so a runtime error in one tab does not
 * white-screen the entire document workspace.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message ?? "Unknown error" };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", this.props.label ?? "Tab", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/30 p-10 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
          <AlertTriangle className="h-8 w-8 text-rose-500" />
          <h4 className="mt-3 text-sm font-bold text-rose-700 dark:text-rose-300">
            {this.props.label ?? "This section"} encountered an error
          </h4>
          <p className="mt-1 max-w-md text-xs text-rose-600 dark:text-rose-400">
            {this.state.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
