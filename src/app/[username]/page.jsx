"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PortfolioPage({ params }) {
	const { username } = React.use(params);
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [portfolioHtml, setPortfolioHtml] = useState('');

	useEffect(() => {
		async function fetchPortfolio() {
			try {
				setLoading(true);
				setError(null);

				// Use the new portfolio render API route
				const response = await fetch(`/api/portfolio/render/${username}`);
				
				if (!response.ok) {
					if (response.status === 404) {
						setError("Portfolio not found");
					} else {
						setError("Failed to load portfolio");
					}
					return;
				}

				// Get the HTML content
				const html = await response.text();
				setPortfolioHtml(html);

			} catch (err) {
				console.error("Error fetching portfolio:", err);
				setError("Failed to load portfolio");
			} finally {
				setLoading(false);
			}
		}

		if (username) {
			fetchPortfolio();
		}
	}, [username]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
				<div className="flex items-center justify-center min-h-screen">
					<div className="text-center">
						<div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600 dark:text-gray-400">Loading portfolio...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
				<div className="flex items-center justify-center min-h-screen">
					<div className="text-center">
						<div className="text-red-600 text-6xl mb-4">⚠️</div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Portfolio Not Found</h1>
						<p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
						<button
							onClick={() => router.push('/')}
							className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
						>
							Back to Home
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Render the portfolio HTML directly
	return (
		<div 
			dangerouslySetInnerHTML={{ __html: portfolioHtml }}
			className="portfolio-container"
		/>
	);
}