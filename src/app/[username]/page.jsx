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

	console.log("🔍 [PORTFOLIO] Component initialized with username:", username);

	useEffect(() => {
		async function fetchPortfolio() {
			console.log("🔍 [PORTFOLIO] Starting portfolio fetch for username:", username);
			try {
				const res = await fetch(`/api/portfolio/${username}`);
				console.log("🔍 [PORTFOLIO] API response status:", res.status);
				
				const data = await res.json();
				console.log("🔍 [PORTFOLIO] Raw API response data:", data);
				if (res.ok && data.success) {
					console.log("🎨 [PORTFOLIO] Fetched portfolio data:", {
						hasPortfolio: !!data.portfolio,
						templateId: data.portfolio?.templateId,
						templateName: data.portfolio?.templateName,
						templateType: data.portfolio?.templateType,
						hasLayout: !!data.portfolio?.layout,
						layoutKeys: data.portfolio?.layout ? Object.keys(data.portfolio.layout) : [],
						hasPortfolioData: !!data.portfolio?.portfolioData,
						portfolioDataKeys: data.portfolio?.portfolioData ? Object.keys(data.portfolio.portfolioData) : [],
						hasContent: !!data.portfolio?.content,
						contentKeys: data.portfolio?.content ? Object.keys(data.portfolio.content) : []
					});
					
					// Log detailed portfolio data structure
					if (data.portfolio?.portfolioData) {
						console.log("🔍 [PORTFOLIO] Portfolio data details:", {
							personal: data.portfolio.portfolioData.personal,
							about: data.portfolio.portfolioData.about,
							projects: data.portfolio.portfolioData.projects,
							skills: data.portfolio.portfolioData.skills,
							experience: data.portfolio.portfolioData.experience,
							education: data.portfolio.portfolioData.education
						});
					}
					setPortfolio(data.portfolio);
					// Increment views count in background
					fetch(`/api/portfolio/${username}/views`, { method: 'POST' }).catch(() => {});
				} else {
					console.error("❌ [PORTFOLIO] API error:", data.error || "Portfolio not found");
					setError(data.error || "Portfolio not found");
				}
			} catch (err) {
				console.error("❌ [PORTFOLIO] Fetch error:", err);
				setError("Failed to load portfolio");
			} finally {
				setLoading(false);
			}
		}
		if (username) fetchPortfolio();
	}, [username]);

	// Dynamically render the selected loading component if present
	if (loading) {
		console.log("🔍 [PORTFOLIO] Rendering loading state");
		let LoadingComponent = PortfolioLoading;
		if (portfolio && portfolio.layout && portfolio.layout.loading) {
			const loadingCompName = portfolio.layout.loading;
			console.log("🔍 [PORTFOLIO] Using custom loading component:", loadingCompName);
			LoadingComponent = componentMap[loadingCompName] || PortfolioLoading;
		}
		return <LoadingComponent />;
	}
	if (error) {
		console.log("🔍 [PORTFOLIO] Rendering error state:", error);
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
		console.log("🔍 [PORTFOLIO] Portfolio or layout missing:", {
			hasPortfolio: !!portfolio,
			hasLayout: !!portfolio?.layout,
			portfolio: portfolio
		});
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
	
	console.log("🔍 [PORTFOLIO] Extracted portfolio properties:", {
		templateId,
		templateName,
		templateType,
		hasLayout: !!layout,
		layoutKeys: layout ? Object.keys(layout) : [],
		hasContent: !!content,
		contentKeys: content ? Object.keys(content) : [],
		hasPortfolioData: !!portfolioData,
		portfolioDataKeys: portfolioData ? Object.keys(portfolioData) : [],
		hasCurrentTemplate: !!currentTemplate
	});
	
	// Get the template definition to ensure we're using the correct layout
	const template = getTemplate(templateId) || currentTemplate;
	
	console.log("🎨 [PORTFOLIO] Template resolution:", {
		templateId,
		templateName,
		templateType,
		hasTemplate: !!template,
		templateType: template?.type,
		templateComponent: template?.component,
		templateLayoutKeys: template?.layout ? Object.keys(template.layout) : [],
		storedLayoutKeys: Object.keys(layout || {}),
		hasPortfolioData: !!portfolioData,
		getTemplateResult: getTemplate(templateId),
		currentTemplate: currentTemplate
	});
	
	// Handle full-page templates
	if (template?.type === "full" && template?.component) {
		console.log("🎨 [PORTFOLIO] Rendering full-page template:", {
			component: template.component,
			hasComponent: !!componentMap[template.component],
			availableComponents: Object.keys(componentMap)
		});
		
		const FullPageComponent = componentMap[template.component];
		if (FullPageComponent) {
			console.log("🎨 [PORTFOLIO] Rendering full-page template:", template.component);
			return (
				<div className="min-h-screen bg-white dark:bg-gray-900">
					<FullPageComponent 
						portfolioData={portfolioData}
						content={content}
						template={template}
					/>
				</div>
			);
		} else {
			console.error("❌ [PORTFOLIO] Full-page component not found:", template.component);
		}
	}
	
	// Handle component-based templates
	const effectiveLayout = template?.layout || layout;
	
	console.log("🎨 [PORTFOLIO] Using effective layout:", {
		effectiveLayoutKeys: effectiveLayout ? Object.keys(effectiveLayout) : [],
		effectiveLayout: effectiveLayout,
		usingTemplateLayout: !!template?.layout,
		usingStoredLayout: !template?.layout && !!layout
	});
	
	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			{/* Render each section based on template layout, edge-to-edge */}
			{Object.entries(effectiveLayout || {}).map(([section, componentName]) => {
				console.log("🔍 [PORTFOLIO] Rendering section:", {
					section,
					componentName,
					hasComponent: !!componentMap[componentName],
					availableComponents: Object.keys(componentMap)
				});
				
				const Component = componentMap[componentName];
				if (!Component) {
					console.error("❌ [PORTFOLIO] Component not found:", componentName);
					return null;
				}
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
