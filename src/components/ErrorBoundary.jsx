"use client";
import { Component } from "react";

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("Error caught by boundary:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
					<div className="text-center p-8">
						<div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
							</svg>
						</div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
							Something went wrong
						</h1>
						<p className="text-gray-600 dark:text-gray-400 mb-6">
							We're sorry, but something unexpected happened. Please try refreshing the page.
						</p>
						<button
							onClick={() => window.location.reload()}
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

export default ErrorBoundary; 