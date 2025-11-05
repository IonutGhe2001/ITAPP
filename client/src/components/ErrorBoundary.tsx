import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center space-y-4 p-4 text-center">
          <h1 className="text-2xl font-semibold">Something went wrong.</h1>
          <p>Please try again or contact support if the problem persists.</p>
          <button
            onClick={this.handleRetry}
            className="bg-primary text-primary-foreground rounded px-4 py-2 hover:opacity-90"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
