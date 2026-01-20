import React from "react";

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("UI Crash:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md bg-white p-8 rounded-xl shadow text-center">
            <h2 className="text-xl font-bold text-gray-900">
              Something went wrong
            </h2>
            <p className="text-gray-500 mt-2">
              An unexpected error occurred. Please refresh the page.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
