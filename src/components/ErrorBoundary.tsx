import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled render error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-4xl mx-auto my-8 bg-slate-900 border border-red-500/40 rounded-2xl shadow-2xl text-slate-200 animate-in fade-in">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 shrink-0">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
                  Workspace Safety Shield
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  {this.props.fallbackTitle || 'A rendering issue was prevented from blanking the screen'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  The application intercepted an invalid or partial template state and protected your session data.
                </p>
              </div>

              {this.state.error && (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-red-300 overflow-x-auto">
                  {this.state.error.message || String(this.state.error)}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={this.handleReset}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition shadow"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restore Safe Golden Template
                </button>
                <button
                  onClick={this.handleReload}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg flex items-center gap-1.5 transition border border-slate-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Page
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
