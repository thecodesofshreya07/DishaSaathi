import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[DishaSaathi ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50/70 p-5 text-red-900 shadow-2xs my-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0 text-red-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-sm text-red-950">
                {this.props.fallbackTitle || 'Component Encountered an Issue'}
              </h4>
              <p className="text-xs text-red-800 mt-1 leading-relaxed">
                {this.state.error?.message || 'A temporary rendering error occurred in this view.'}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry View</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
