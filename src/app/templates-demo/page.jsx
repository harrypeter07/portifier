"use client";
import { useState, useEffect, Suspense } from "react";
import TemplateSelector from "@/components/TemplateSelector";
import Preview from "@/components/Preview";
import { useLayoutStore } from "@/store/layoutStore";
import { getComponentTemplates, getFullPageTemplates } from "@/data/templates/templateManager";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function TemplatesDemoContent() {
	const { layout, content, portfolioData, currentTemplate, applyTemplate } = useLayoutStore();
	const [showSelector, setShowSelector] = useState(true);
	const [existingPortfolio, setExistingPortfolio] = useState(null);
	const [isUpdating, setIsUpdating] = useState(false);
	const [updateMessage, setUpdateMessage] = useState("");
	const [isUpdatingSpecificPortfolio, setIsUpdatingSpecificPortfolio] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	const componentTemplates = getComponentTemplates();
	const fullPageTemplates = getFullPageTemplates();

	// Check if user has an existing portfolio and if we're updating a specific one
	useEffect(() => {
		const checkExistingPortfolio = async () => {
			try {
				const res = await fetch("/api/auth/me");
				if (res.ok) {
					const userData = await res.json();
					if (userData.user?.username) {
						// Check if we're updating a specific portfolio from dashboard
						const portfolioId = searchParams.get('portfolioId');
						const portfolioUsername = searchParams.get('username');
						
						if (portfolioId && portfolioUsername) {
							// We're updating a specific portfolio from dashboard
							setIsUpdatingSpecificPortfolio(true);
							console.log("🎯 [TEMPLATES-DEMO] Updating specific portfolio from dashboard:", {
								portfolioId,
								portfolioUsername
							});
							
							// Fetch the specific portfolio data
							const portfolioRes = await fetch(`/api/portfolio/${portfolioUsername}`);
							if (portfolioRes.ok) {
								const portfolioData = await portfolioRes.json();
								setExistingPortfolio(portfolioData.portfolio);
							}
						} else {
							// Check if portfolio exists (general case)
							const portfolioRes = await fetch(`/api/portfolio/${userData.user.username}`);
							if (portfolioRes.ok) {
								const portfolioData = await portfolioRes.json();
								setExistingPortfolio(portfolioData.portfolio);
							}
						}
					}
				}
			} catch (error) {
				console.log("No existing portfolio found");
			}
		};

		checkExistingPortfolio();
	}, [searchParams]);

	const handleUpdateExistingPortfolio = async () => {
		if (!currentTemplate || !existingPortfolio) return;

		setIsUpdating(true);
		setUpdateMessage("");
		try {
			console.log("🔄 [TEMPLATES-DEMO] Updating existing portfolio template:", {
				templateId: currentTemplate.id,
				templateName: currentTemplate.name,
				portfolioId: existingPortfolio._id,
				portfolioUsername: existingPortfolio.username
			});

			const res = await fetch("/api/portfolio/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					layout: currentTemplate.type === "component" ? currentTemplate.layout : {},
					content: existingPortfolio.content || content,
					portfolioData: existingPortfolio.portfolioData || portfolioData,
					username: existingPortfolio.username,
					portfolioId: existingPortfolio._id, // Add portfolio ID for specific update
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
				
				// Show success message
				setUpdateMessage(`✅ Portfolio "${existingPortfolio.username}" has been successfully updated with the "${currentTemplate.name}" template!`);
				
				// Clear message after 3 seconds and redirect
				setTimeout(() => {
					setUpdateMessage("");
					router.push(`/portfolio/${data.username}`);
				}, 3000);
			} else {
				console.error("Failed to update portfolio template:", data.error);
				setUpdateMessage(`❌ Failed to update portfolio: ${data.error}`);
			}
		} catch (error) {
			console.error("Error updating portfolio template:", error);
			setUpdateMessage(`❌ Error updating portfolio: ${error.message}`);
		} finally {
			setIsUpdating(false);
		}
	};

	const handlePublishNewPortfolio = async () => {
		if (!currentTemplate) return;

		setIsUpdating(true);
		try {
			// Get user info to generate unique username
			const userRes = await fetch("/api/auth/me");
			const userData = await userRes.json();
			
			if (!userRes.ok || !userData.user?.username) {
				console.error("Failed to get user data for new portfolio");
				return;
			}

			const baseUsername = userData.user.username;
			let newUsername = `${baseUsername}-2`; // Start with -2 since -1 might exist
			let counter = 2;

			// Check if username exists and increment until we find a unique one
			while (counter <= 10) { // Limit to 10 attempts
				const checkRes = await fetch(`/api/portfolio/${newUsername}`);
				if (!checkRes.ok) {
					// Username doesn't exist, we can use it
					break;
				}
				counter++;
				newUsername = `${baseUsername}-${counter}`;
			}

			if (counter > 10) {
				console.error("Could not generate unique username");
				return;
			}

			console.log("🚀 [TEMPLATES-DEMO] Publishing new portfolio with unique URL:", {
				templateId: currentTemplate.id,
				templateName: currentTemplate.name,
				baseUsername,
				newUsername
			});

			const res = await fetch("/api/portfolio/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					layout: currentTemplate.type === "component" ? currentTemplate.layout : {},
					content: content,
					portfolioData: portfolioData,
					username: newUsername,
					// Template information
					templateName: currentTemplate.id,
					templateId: currentTemplate.id,
					templateType: currentTemplate.type,
					portfolioType: "developer",
					currentTemplate: currentTemplate,
					// Mark as new portfolio creation
					isNewPortfolio: true,
				}),
			});

			const data = await res.json();
			if (res.ok && data.success) {
				console.log("✅ [TEMPLATES-DEMO] New portfolio published successfully:", {
					templateId: data.templateId,
					templateName: data.templateName,
					newUsername: data.username,
					redirectUrl: `/portfolio/${data.username}`
				});
				router.push(`/portfolio/${data.username}`);
			} else {
				console.error("Failed to publish new portfolio:", data.error);
			}
		} catch (error) {
			console.error("Error publishing new portfolio:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<div className="min-h-screen bg-white dark:bg-black">
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-black dark:text-white mb-4">
						Portfolio Template System
					</h1>
					<p className="text-lg text-black/70 dark:text-white/70 max-w-3xl mx-auto">
						Choose from our collection of component-based and full-page templates. 
						Component-based templates let you mix and match individual sections, 
						while full-page templates provide complete, pre-designed layouts.
					</p>
				</div>

				{/* Update Message */}
				{updateMessage && (
					<Card className="mb-6 border-green-200 bg-green-50">
						<CardContent className="p-4">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
									</svg>
								</div>
								<div className="ml-3">
									<p className="text-sm font-medium text-green-800">
										{updateMessage}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Portfolio Update Info */}
				{isUpdatingSpecificPortfolio && existingPortfolio && (
					<Card className="mb-6 border-blue-200 bg-blue-50">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
											<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
										</svg>
									</div>
									<div className="ml-3">
										<h3 className="text-sm font-medium text-blue-800">
											Updating Portfolio: <span className="font-bold">{existingPortfolio.username}</span>
										</h3>
										<p className="text-sm text-blue-700">
											Current template: <span className="font-medium">{existingPortfolio.templateName || 'Default'}</span>
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-xs text-blue-600">
										Portfolio ID: {existingPortfolio._id}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

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
								<p className="text-black/70 dark:text-white/70">
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
											onClick={handlePublishNewPortfolio}
											disabled={isUpdating}
											className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
										>
											{isUpdating ? "Publishing..." : "🚀 Publish New Portfolio"}
										</button>
										<button
											onClick={() => router.push('/editor')}
											className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
										>
											Edit Portfolio
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
										<div className="text-xs text-black/70 dark:text-white/70">
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
										<div className="text-sm text-black/70 dark:text-white/70">
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
										<div className="text-sm text-black/70 dark:text-white/70">
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