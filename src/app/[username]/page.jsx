"use client";
import React, { useEffect, useState } from "react";
import { FlickeringGrid } from "@/components/FlickeringGrid";
import { componentMap } from "@/data/componentMap";
import PortfolioLoading from "@/components/PortfolioLoading";
import { getTemplate, PORTFOLIO_TEMPLATES } from "@/data/templates/templateManager";
import ExportButton from "@/components/ExportButton";

export default function PortfolioPage({ params }) {
	// Next.js 15: unwrap async params with React.use in client pages
	const { username } = React.use(params);
	const [portfolio, setPortfolio] = useState(null);
	const [remoteRender, setRemoteRender] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [userData, setUserData] = useState(null);

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
					setUserData(data.user);
					// Increment views count in background
					fetch(`/api/portfolio/${username}/views`, { method: 'POST' }).catch(() => {});

					// Try remote render if enabled
					try {
						const remoteRes = await fetch(`/api/portfolio/render/${username}`);
						if (remoteRes.ok) {
							const rr = await remoteRes.json();
							if (rr?.html) setRemoteRender(rr);
						}
					} catch {}
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
        console.log("🎯 [PORTFOLIO] Applying FlickeringGrid background (loading)");
        let LoadingComponent = PortfolioLoading;
        if (portfolio && portfolio.layout && portfolio.layout.loading) {
            const loadingCompName = portfolio.layout.loading;
            console.log("🔍 [PORTFOLIO] Using custom loading component:", loadingCompName);
            LoadingComponent = componentMap[loadingCompName] || PortfolioLoading;
        }
        return (
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute inset-0">
                        <FlickeringGrid
                            className="absolute inset-0 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
                            squareSize={4}
                            gridGap={6}
                            color="#60A5FA"
                            maxOpacity={0.4}
                            flickerChance={0.12}
                            height={1200}
                            width={1200}
                        />
                    </div>
                </div>
                <LoadingComponent />
            </div>
        );
    }
    if (error) {
        console.log("🔍 [PORTFOLIO] Rendering error state:", error);
        console.log("🎯 [PORTFOLIO] Applying FlickeringGrid background (error)");
        return (
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute inset-0">
                        <FlickeringGrid
                            className="absolute inset-0 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
                            squareSize={4}
                            gridGap={6}
                            color="#60A5FA"
                            maxOpacity={0.4}
                            flickerChance={0.12}
                            height={1200}
                            width={1200}
                        />
                    </div>
                </div>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Portfolio Not Found</h1>
                        <p className="text-gray-600 dark:text-gray-300">{error}</p>
                    </div>
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
	const template = getTemplate(templateId) || currentTemplate || getTemplate(templateName);
	
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
		getTemplateByNameResult: getTemplate(templateName),
		currentTemplate: currentTemplate,
		availableTemplates: Object.keys(PORTFOLIO_TEMPLATES)
	});
	
	// If remote render available, inject directly and skip local rendering
    if (remoteRender?.html) {
		return (
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute inset-0">
                        <FlickeringGrid
                            className="absolute inset-0 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
                            squareSize={4}
                            gridGap={6}
                            color="#60A5FA"
                            maxOpacity={0.4}
                            flickerChance={0.12}
                            height={1200}
                            width={1200}
                        />
                    </div>
                </div>
				{remoteRender?.css ? (
					<style dangerouslySetInnerHTML={{ __html: remoteRender.css }} />
				) : null}
				<div dangerouslySetInnerHTML={{ __html: remoteRender.html }} />
				{/* Analytics */}
				<script src="/analytics.js" data-portfolio-id={portfolio?._id}></script>
			</div>
		);
	}

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
                <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute inset-0">
                            <FlickeringGrid
                                className="absolute inset-0 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
                                squareSize={4}
                                gridGap={6}
                                color="#60A5FA"
                                maxOpacity={0.4}
                                flickerChance={0.12}
                                height={1200}
                                width={1200}
                            />
                        </div>
                    </div>
					<FullPageComponent 
						portfolioData={portfolioData}
						content={content}
						template={template}
						data={portfolioData}
						portfolioId={portfolio._id}
						username={username}
					/>
				</div>
			);
		} else {
			console.error("❌ [PORTFOLIO] Full-page component not found:", template.component);
		}
	}
	
	// Fallback: Check if currentTemplate is a full-page template
	if (currentTemplate?.type === "full" && currentTemplate?.component) {
		console.log("🎨 [PORTFOLIO] Rendering full-page template from currentTemplate:", {
			component: currentTemplate.component,
			hasComponent: !!componentMap[currentTemplate.component],
			availableComponents: Object.keys(componentMap)
		});
		
		const FullPageComponent = componentMap[currentTemplate.component];
		if (FullPageComponent) {
			console.log("🎨 [PORTFOLIO] Rendering full-page template from currentTemplate:", currentTemplate.component);
            return (
                <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute inset-0">
                            <FlickeringGrid
                                className="absolute inset-0 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
                                squareSize={4}
                                gridGap={6}
                                color="#60A5FA"
                                maxOpacity={0.4}
                                flickerChance={0.12}
                                height={1200}
                                width={1200}
                            />
                        </div>
                    </div>
					<FullPageComponent 
						portfolioData={portfolioData}
						content={content}
						template={currentTemplate}
						data={portfolioData}
						portfolioId={portfolio._id}
						username={username}
					/>
				</div>
			);
		} else {
			console.error("❌ [PORTFOLIO] Full-page component not found in currentTemplate:", currentTemplate.component);
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
	
    console.log("🎯 [PORTFOLIO] Applying FlickeringGrid background (main)");
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0">
                    <FlickeringGrid
                        className="absolute inset-0 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
                        squareSize={4}
                        gridGap={6}
                        color="#60A5FA"
                        maxOpacity={0.4}
                        flickerChance={0.12}
                        height={1200}
                        width={1200}
                    />
                </div>
            </div>
			{/* Export Button - Floating Action Button */}
			<div className="fixed bottom-6 right-6 z-50">
				<ExportButton 
					portfolioId={portfolio._id} 
					username={username}
					className="shadow-lg"
				/>
			</div>
			
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
					// Use user data as fallback for personal information
					const personalData = {
						firstName: portfolioData?.personal?.firstName || userData?.name?.split(' ')[0] || username?.split('_')[0] || username,
						lastName: portfolioData?.personal?.lastName || userData?.name?.split(' ')[1] || username?.split('_')[1] || "",
						title: portfolioData?.personal?.title || "Professional",
						subtitle: portfolioData?.personal?.subtitle || "Portfolio",
						tagline: portfolioData?.personal?.tagline || "",
						email: portfolioData?.personal?.email || userData?.email || "",
						phone: portfolioData?.personal?.phone || "",
						location: portfolioData?.personal?.location || {},
						social: portfolioData?.personal?.social || {}
					};
					componentProps = { data: { personal: personalData } };
					console.log("🔍 [PORTFOLIO] Hero section props:", componentProps);
				} else if (section === "about") {
					componentProps = {
						summary: portfolioData?.about?.summary || content?.about?.summary || "",
						data: portfolioData || content,
					};
					console.log("🔍 [PORTFOLIO] About section props:", componentProps);
				} else if (section === "projects") {
					// Map database fields to component expectations
					const mappedProjects = (portfolioData?.projects?.items || content?.projects?.items || []).map(project => ({
						...project,
						name: project.title || project.name, // Map title to name for component
						description: project.description,
						url: project.links?.live || project.url,
						github: project.links?.github || project.github,
						technologies: project.technologies || []
					}));
					componentProps = {
						items: mappedProjects,
						data: portfolioData || content,
					};
					console.log("🔍 [PORTFOLIO] Projects section props:", componentProps);
				} else if (section === "skills") {
					componentProps = {
						technical: portfolioData?.skills?.technical || content?.skills?.technical || [],
						soft: portfolioData?.skills?.soft || content?.skills?.soft || [],
						languages: portfolioData?.skills?.languages || content?.skills?.languages || [],
						data: portfolioData || content,
					};
					console.log("🔍 [PORTFOLIO] Skills section props:", componentProps);
				} else if (section === "achievements") {
					componentProps = {
						awards: portfolioData?.achievements?.awards || content?.achievements?.awards || [],
						certifications: portfolioData?.achievements?.certifications || content?.achievements?.certifications || [],
						publications: portfolioData?.achievements?.publications || content?.achievements?.publications || [],
						data: portfolioData || content,
					};
					console.log("🔍 [PORTFOLIO] Achievements section props:", componentProps);
				} else if (section === "experience") {
					// Map database fields to component expectations
					const mappedJobs = (portfolioData?.experience?.jobs || content?.experience?.jobs || []).map(job => ({
						...job,
						title: job.position || job.title, // Map position to title for component
						company: job.company,
						location: job.location,
						duration: job.startDate && job.endDate ? `${job.startDate} - ${job.endDate}` : 
								 job.startDate ? `${job.startDate} - Present` : job.duration,
						description: job.description,
						technologies: job.technologies || []
					}));
					componentProps = {
						jobs: mappedJobs,
						data: portfolioData || content,
					};
					console.log("🔍 [PORTFOLIO] Experience section props:", componentProps);
				} else if (section === "education") {
					// Map database fields to component expectations
					const mappedDegrees = (portfolioData?.education?.degrees || content?.education?.degrees || []).map(degree => ({
						...degree,
						degree: degree.degree,
						field: degree.field,
						institution: degree.institution,
						year: degree.startDate && degree.endDate ? `${degree.startDate} - ${degree.endDate}` : 
							  degree.startDate ? `${degree.startDate} - Present` : degree.year,
						location: degree.location,
						gpa: degree.grade || degree.gpa
					}));
					componentProps = {
						degrees: mappedDegrees,
						data: portfolioData || content,
					};
					console.log("🔍 [PORTFOLIO] Education section props:", componentProps);
				} else if (section === "contact") {
					componentProps = {
						email: portfolioData?.personal?.email || userData?.email || content?.contact?.email || "",
						phone: portfolioData?.personal?.phone || content?.contact?.phone || "",
						location: portfolioData?.personal?.location ? 
							`${portfolioData.personal.location.city || ''} ${portfolioData.personal.location.state || ''} ${portfolioData.personal.location.country || ''}`.trim() : 
							content?.contact?.location || "",
						linkedin: portfolioData?.personal?.social?.linkedin || content?.contact?.linkedin || "",
						github: portfolioData?.personal?.social?.github || content?.contact?.github || "",
						data: portfolioData || content,
					};
					console.log("🔍 [PORTFOLIO] Contact section props:", componentProps);
				} else {
					componentProps = {
						...content?.[section],
						data: portfolioData || content,
					};
					console.log("🔍 [PORTFOLIO] Generic section props:", {
						section,
						props: componentProps
					});
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
