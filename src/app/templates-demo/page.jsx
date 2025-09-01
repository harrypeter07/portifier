"use client";
import { useState, useEffect } from "react";
import TemplateSelector from "@/components/TemplateSelector";
import Preview from "@/components/Preview";
import { useLayoutStore } from "@/store/layoutStore";
import { getComponentTemplates, getFullPageTemplates } from "@/data/templates/templateManager";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function TemplatesDemoPage() {
	const { layout, content, portfolioData, currentTemplate, applyTemplate } = useLayoutStore();
	const [showSelector, setShowSelector] = useState(true);
	const [existingPortfolio, setExistingPortfolio] = useState(null);
	const [isUpdating, setIsUpdating] = useState(false);
	const router = useRouter();

	const componentTemplates = getComponentTemplates();
	const fullPageTemplates = getFullPageTemplates();

	// Check if user has an existing portfolio
	useEffect(() => {
		const checkExistingPortfolio = async () => {
			try {
				const res = await fetch("/api/auth/me");
				if (res.ok) {
					const userData = await res.json();
					if (userData.user?.username) {
						// Check if portfolio exists
						const portfolioRes = await fetch(`/api/portfolio/${userData.user.username}`);
						if (portfolioRes.ok) {
							const portfolioData = await portfolioRes.json();
							setExistingPortfolio(portfolioData.portfolio);
						}
					}
				}
			} catch (error) {
				console.log("No existing portfolio found");
			}
		};

		checkExistingPortfolio();
	}, []);

	const handleUpdateExistingPortfolio = async () => {
		if (!currentTemplate || !existingPortfolio) return;

		setIsUpdating(true);
		try {
			console.log("🔄 [TEMPLATES-DEMO] Updating existing portfolio template:", {
				templateId: currentTemplate.id,
				templateName: currentTemplate.name,
				portfolioId: existingPortfolio._id
			});

			const res = await fetch("/api/portfolio/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					layout: currentTemplate.type === "component" ? currentTemplate.layout : layout,
					content: existingPortfolio.content || content,
					portfolioData: existingPortfolio.portfolioData || portfolioData,
					username: existingPortfolio.username,
					// Template information
					templateName: currentTemplate.id,
					templateId: currentTemplate.id,
					templateType: currentTemplate.type,
					portfolioType: existingPortfolio.portfolioType || "developer",
					currentTemplate: currentTemplate,
				}),
			});

			const data = await res.json();
			if (res.ok && data.success) {
				console.log("✅ [TEMPLATES-DEMO] Portfolio template updated successfully:", {
					templateId: data.templateId,
					templateName: data.templateName,
					redirectUrl: `/portfolio/${data.username}`
				});
				router.push(`/portfolio/${data.username}`);
			} else {
				console.error("Failed to update portfolio template:", data.error);
			}
		} catch (error) {
			console.error("Error updating portfolio template:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<Navbar />
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
						Portfolio Template System
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
						Choose from our collection of component-based and full-page templates. 
						Component-based templates let you mix and match individual sections, 
						while full-page templates provide complete, pre-designed layouts.
					</p>
				</div>

				{/* Template Selector */}
				{showSelector && (
					<div className="mb-8">
						<TemplateSelector />
					</div>
				)}

				{/* Current Template Info */}
				{currentTemplate && (
					<div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
						<div className="flex items-center justify-between mb-4">
							<div>
								<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
									{currentTemplate.name}
								</h2>
								<p className="text-gray-600 dark:text-gray-400">
									{currentTemplate.description}
								</p>
							</div>
							<div className="flex items-center space-x-4">
								<span className={`px-3 py-1 rounded-full text-sm font-medium ${
									currentTemplate.type === "component"
										? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
										: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
								}`}>
									{currentTemplate.type === "component" ? "Component-Based" : "Full Page"}
								</span>
								<span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
									{currentTemplate.category}
								</span>
								<button
									onClick={() => setShowSelector(!showSelector)}
									className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
								>
									{showSelector ? "Hide Selector" : "Show Selector"}
								</button>
								
								{/* Conditional buttons based on existing portfolio */}
								{existingPortfolio ? (
									<>
										<button
											onClick={handleUpdateExistingPortfolio}
											disabled={isUpdating}
											className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
										>
											{isUpdating ? "Updating..." : "🔄 Update Portfolio Template"}
										</button>
										<button
											onClick={() => router.push('/editor')}
											className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
										>
											Create New Portfolio
										</button>
									</>
								) : (
									<button
										onClick={() => router.push('/editor')}
										className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
									>
										Deploy Portfolio
									</button>
								)}
							</div>
						</div>
						
						{currentTemplate.type === "component" && layout && (
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{Object.entries(layout).map(([section, component]) => (
									<div key={section} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
										<div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
											{section}
										</div>
										<div className="text-xs text-gray-600 dark:text-gray-400">
											{component}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* Preview */}
				{currentTemplate && (
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
						<div className="p-4 border-b border-gray-200 dark:border-gray-700">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								Live Preview
							</h3>
						</div>
						<div className="p-4">
							<Preview 
								layout={layout} 
								content={content} 
								portfolioData={portfolioData}
								currentTemplate={currentTemplate}
							/>
						</div>
					</div>
				)}

				{/* Template Statistics */}
				<div className="mt-8 grid md:grid-cols-2 gap-6">
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
							Component-Based Templates
						</h3>
						<div className="space-y-2">
							{componentTemplates.map((template) => (
								<div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
									<div>
										<div className="font-medium text-gray-900 dark:text-white">
											{template.name}
										</div>
										<div className="text-sm text-gray-600 dark:text-gray-400">
											{template.category}
										</div>
									</div>
									<button
										onClick={() => applyTemplate(template)}
										className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
									>
										Try
									</button>
								</div>
							))}
						</div>
					</div>

					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
							Full Page Templates
						</h3>
						<div className="space-y-2">
							{fullPageTemplates.map((template) => (
								<div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
									<div>
										<div className="font-medium text-gray-900 dark:text-white">
											{template.name}
										</div>
										<div className="text-sm text-gray-600 dark:text-gray-400">
											{template.category}
										</div>
									</div>
									<button
										onClick={() => applyTemplate(template)}
										className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-colors"
									>
										Try
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
} 