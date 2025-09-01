"use client";
import React, { useEffect, useState } from "react";
import { componentMap } from "@/data/componentMap";
import PortfolioLoading from "@/components/PortfolioLoading";
import { getTemplate } from "@/data/templates/templateManager";

export default function PortfolioPage({ params }) {
	// Next.js 15: unwrap async params with React.use in client pages
	const { username } = React.use(params);
	const [portfolio, setPortfolio] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchPortfolio() {
			try {
				const res = await fetch(`/api/portfolio/${username}`);
				const data = await res.json();
				if (res.ok && data.success) {
					console.log("🎨 [PORTFOLIO] Fetched portfolio data:", {
						hasPortfolio: !!data.portfolio,
						templateId: data.portfolio?.templateId,
						templateName: data.portfolio?.templateName,
						templateType: data.portfolio?.templateType,
						hasLayout: !!data.portfolio?.layout,
						layoutKeys: data.portfolio?.layout ? Object.keys(data.portfolio.layout) : [],
						hasPortfolioData: !!data.portfolio?.portfolioData
					});
					setPortfolio(data.portfolio);
					// Increment views count in background
					fetch(`/api/portfolio/${username}/views`, { method: 'POST' }).catch(() => {});
				} else {
					setError(data.error || "Portfolio not found");
				}
			} catch (err) {
				setError("Failed to load portfolio");
			} finally {
				setLoading(false);
			}
		}
		if (username) fetchPortfolio();
	}, [username]);

	// Dynamically render the selected loading component if present
	if (loading) {
		let LoadingComponent = PortfolioLoading;
		if (portfolio && portfolio.layout && portfolio.layout.loading) {
			const loadingCompName = portfolio.layout.loading;
			LoadingComponent = componentMap[loadingCompName] || PortfolioLoading;
		}
		return <LoadingComponent />;
	}
	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Portfolio Not Found</h1>
					<p className="text-gray-600 dark:text-gray-300">{error}</p>
				</div>
			</div>
		);
	}
	if (!portfolio || !portfolio.layout) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Portfolio Not Found</h1>
					<p className="text-gray-600 dark:text-gray-300">This portfolio doesn't exist or hasn't been published yet.</p>
				</div>
			</div>
		);
	}
	const { layout, content, portfolioData, templateId, templateName, templateType, currentTemplate } = portfolio;
	
	// Get the template definition to ensure we're using the correct layout
	const template = getTemplate(templateId) || currentTemplate;
	const effectiveLayout = template?.layout || layout;
	
	console.log("🎨 [PORTFOLIO] Rendering portfolio with template info:", {
		templateId,
		templateName,
		templateType,
		hasTemplate: !!template,
		templateLayoutKeys: template?.layout ? Object.keys(template.layout) : [],
		storedLayoutKeys: Object.keys(layout || {}),
		effectiveLayoutKeys: Object.keys(effectiveLayout || {}),
		hasPortfolioData: !!portfolioData
	});
	
	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			{/* Render each section based on template layout, edge-to-edge */}
			{Object.entries(effectiveLayout || {}).map(([section, componentName]) => {
				const Component = componentMap[componentName];
				if (!Component) return null;
				let componentProps = {};
				if (section === "hero") {
					componentProps = { data: { personal: portfolioData?.personal } };
				} else if (section === "about") {
					componentProps = {
						summary: portfolioData?.about?.summary || content?.about?.summary || "",
						data: portfolioData || content,
					};
				} else if (section === "projects") {
					componentProps = {
						items: portfolioData?.projects?.items || content?.projects?.items || [],
						data: portfolioData || content,
					};
				} else if (section === "skills") {
					componentProps = {
						technical: portfolioData?.skills?.technical || content?.skills?.technical || [],
						soft: portfolioData?.skills?.soft || content?.skills?.soft || [],
						languages: portfolioData?.skills?.languages || content?.skills?.languages || [],
						data: portfolioData || content,
					};
				} else if (section === "achievements") {
					componentProps = {
						awards: portfolioData?.achievements?.awards || content?.achievements?.awards || [],
						certifications: portfolioData?.achievements?.certifications || content?.achievements?.certifications || [],
						publications: portfolioData?.achievements?.publications || content?.achievements?.publications || [],
						data: portfolioData || content,
					};
				} else if (section === "experience") {
					componentProps = {
						jobs: portfolioData?.experience?.jobs || content?.experience?.jobs || [],
						data: portfolioData || content,
					};
				} else if (section === "education") {
					componentProps = {
						degrees: portfolioData?.education?.degrees || content?.education?.degrees || [],
						data: portfolioData || content,
					};
				} else if (section === "contact") {
					componentProps = {
						email: portfolioData?.personal?.email || content?.contact?.email || "",
						phone: portfolioData?.personal?.phone || content?.contact?.phone || "",
						linkedin: portfolioData?.personal?.social?.linkedin || content?.contact?.linkedin || "",
						github: portfolioData?.personal?.social?.github || content?.contact?.github || "",
						data: portfolioData || content,
					};
				} else {
					componentProps = {
						...content?.[section],
						data: portfolioData || content,
					};
				}
				return (
					<div key={section} className="w-full">
						<Component {...componentProps} />
					</div>
				);
			})}
		</div>
	);
}
