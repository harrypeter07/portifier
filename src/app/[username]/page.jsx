"use client";
import { useEffect, useState } from "react";
import { componentMap } from "@/data/componentMap";
import { motion } from "framer-motion";

export default function PortfolioPage({ params }) {
	const [portfolio, setPortfolio] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { username } = params;

	useEffect(() => {
		async function fetchPortfolio() {
			try {
				console.log("🔍 [PORTFOLIO] Fetching portfolio for username:", username);
				const res = await fetch(`/api/portfolio/${username}`);
				const data = await res.json();
				
				if (res.ok && data.success) {
					console.log("✅ [PORTFOLIO] Portfolio fetched successfully:", {
						username,
						hasLayout: !!data.portfolio.layout,
						layoutKeys: data.portfolio.layout ? Object.keys(data.portfolio.layout) : [],
						hasContent: !!data.portfolio.content,
						hasPortfolioData: !!data.portfolio.portfolioData,
						personalData: data.portfolio.portfolioData?.personal ? {
							firstName: data.portfolio.portfolioData.personal.firstName,
							lastName: data.portfolio.portfolioData.personal.lastName,
							subtitle: data.portfolio.portfolioData.personal.subtitle,
							email: data.portfolio.portfolioData.personal.email
						} : null
					});
					setPortfolio(data.portfolio);
				} else {
					console.log("❌ [PORTFOLIO] Failed to fetch portfolio:", data.error);
					setError(data.error || "Portfolio not found");
				}
			} catch (err) {
				console.error("❌ [PORTFOLIO] Error fetching portfolio:", err);
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
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600 dark:text-gray-300">Loading portfolio...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Portfolio Not Found</h1>
					<p className="text-gray-600 dark:text-gray-300">{error}</p>
				</div>
			</div>
		);
	}

	if (!portfolio || !portfolio.layout) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Portfolio Not Found</h1>
					<p className="text-gray-600 dark:text-gray-300">This portfolio doesn't exist or hasn't been published yet.</p>
				</div>
			</div>
		);
	}

	const { layout, content, portfolioData } = portfolio;

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="max-w-4xl mx-auto p-4 md:p-8"
			>
				{/* Render each section based on layout */}
				{Object.entries(layout).map(([section, componentName]) => {
					console.log(`🎨 [PORTFOLIO] Rendering section: ${section} with component: ${componentName}`);
					
					const Component = componentMap[componentName];
					if (!Component) {
						console.warn(`⚠️ [PORTFOLIO] Component not found: ${componentName}`);
						return null;
					}

					let componentProps = {};

					// For hero section, pass portfolioData.personal directly
					if (section === "hero") {
						componentProps = { data: { personal: portfolioData?.personal } };
						console.log("🎨 [PORTFOLIO] Hero section props:", {
							hasPortfolioData: !!portfolioData?.personal,
							personalData: portfolioData?.personal ? {
								firstName: portfolioData.personal.firstName,
								lastName: portfolioData.personal.lastName,
								subtitle: portfolioData.personal.subtitle,
								tagline: portfolioData.personal.tagline
							} : null
						});
					}

					// For about section
					else if (section === "about") {
						componentProps = {
							summary: portfolioData?.about?.summary || content?.about?.summary || "",
							data: portfolioData || content,
						};
					}

					// For projects section
					else if (section === "projects") {
						componentProps = { 
							items: portfolioData?.projects?.items || content?.projects?.items || [],
							data: portfolioData || content,
						};
					}

					// For skills section
					else if (section === "skills") {
						componentProps = {
							technical: portfolioData?.skills?.technical || content?.skills?.technical || [],
							soft: portfolioData?.skills?.soft || content?.skills?.soft || [],
							languages: portfolioData?.skills?.languages || content?.skills?.languages || [],
							data: portfolioData || content,
						};
					}

					// For achievements section
					else if (section === "achievements") {
						componentProps = {
							awards: portfolioData?.achievements?.awards || content?.achievements?.awards || [],
							certifications: portfolioData?.achievements?.certifications || content?.achievements?.certifications || [],
							publications: portfolioData?.achievements?.publications || content?.achievements?.publications || [],
							data: portfolioData || content,
						};
					}

					// For experience section
					else if (section === "experience") {
						componentProps = { 
							jobs: portfolioData?.experience?.jobs || content?.experience?.jobs || [],
							data: portfolioData || content,
						};
					}

					// For education section
					else if (section === "education") {
						componentProps = { 
							degrees: portfolioData?.education?.degrees || content?.education?.degrees || [],
							data: portfolioData || content,
						};
					}

					// For contact section
					else if (section === "contact") {
						componentProps = {
							email: portfolioData?.personal?.email || content?.contact?.email || "",
							phone: portfolioData?.personal?.phone || content?.contact?.phone || "",
							linkedin: portfolioData?.personal?.social?.linkedin || content?.contact?.linkedin || "",
							github: portfolioData?.personal?.social?.github || content?.contact?.github || "",
							data: portfolioData || content,
						};
					}

					// Default fallback
					else {
						componentProps = {
							...content?.[section],
							data: portfolioData || content,
						};
					}

					return (
						<div key={section} className="mb-8 last:mb-0">
							<Component {...componentProps} />
						</div>
					);
				})}
			</motion.div>
		</div>
	);
}
