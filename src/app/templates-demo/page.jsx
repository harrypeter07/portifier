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
import SuspenseFallback from "@/components/common/SuspenseFallback";

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
							console.log("🔍 [TEMPLATES-DEMO] Checking for existing portfolio for user:", userData.user.username);
							const portfolioRes = await fetch(`/api/portfolio/${userData.user.username}`);
							if (portfolioRes.ok) {
								const portfolioData = await portfolioRes.json();
								setExistingPortfolio(portfolioData.portfolio);
								console.log("📁 [TEMPLATES-DEMO] Found existing portfolio:", portfolioData.portfolio._id);
							} else if (portfolioRes.status === 404) {
								console.log("📁 [TEMPLATES-DEMO] No existing portfolio found (404) - user will create new one");
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
		<div className="min-h-screen grainy-bg">
			<div className="px-4 py-8 mx-auto max-w-7xl">
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="mb-4 text-4xl font-bold text-black dark:text-white">
						Portfolio Template System
					</h1>
					<p className="mx-auto max-w-3xl text-lg text-black/80 dark:text-white/80">
						Choose from our collection of component-based and full-page templates. 
						Component-based templates let you mix and match individual sections, 
						while full-page templates provide complete, pre-designed layouts.
					</p>
				</div>

				{/* Update Message */}
				{updateMessage && (
					<Card className="mb-6 bg-green-50 border-green-200">
						<CardContent className="p-4">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<svg className="w-5 h-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
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
					<Card className="mb-6 bg-blue-50 border-blue-200">
						<CardContent className="p-4">
							<div className="flex justify-between items-center">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<svg className="w-5 h-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
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
					<div className="p-6 mb-8 rounded-lg shadow-lg glass">
						<div className="flex justify-between items-center mb-4">
							<div>
								<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
									{currentTemplate.name}
								</h2>
								<p className="text-black/80 dark:text-white/80">
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
								<span className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-600 dark:text-gray-200">
									{currentTemplate.category}
								</span>
								<button
									onClick={() => setShowSelector(!showSelector)}
									className="px-4 py-2 text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
								>
									{showSelector ? "Hide Selector" : "Show Selector"}
								</button>
								
								{/* Conditional buttons based on existing portfolio */}
								{existingPortfolio ? (
									<>
										<button
											onClick={handleUpdateExistingPortfolio}
											disabled={isUpdating}
											className="px-4 py-2 text-white bg-purple-600 rounded-lg transition-colors hover:bg-purple-700 disabled:opacity-50"
										>
											{isUpdating ? "Updating..." : "🔄 Update Portfolio Template"}
										</button>
										<button
											onClick={handlePublishNewPortfolio}
											disabled={isUpdating}
											className="px-4 py-2 text-white bg-green-500 rounded-lg transition-colors hover:bg-green-600 disabled:opacity-50"
										>
											{isUpdating ? "Publishing..." : "🚀 Publish New Portfolio"}
										</button>
										<button
											onClick={() => router.push('/editor')}
											className="px-4 py-2 text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
										>
											Edit Portfolio
										</button>
									</>
								) : (
									<button
										onClick={() => router.push('/editor')}
										className="px-4 py-2 text-white bg-green-500 rounded-lg transition-colors hover:bg-green-600"
									>
										Deploy Portfolio
									</button>
								)}
							</div>
						</div>
						
						{currentTemplate.type === "component" && layout && (
							<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
								{Object.entries(layout).map(([section, component]) => (
									<div key={section} className="p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
										<div className="text-sm font-medium text-gray-900 capitalize dark:text-white">
											{section}
										</div>
										<div className="text-xs text-black/80 dark:text-white/80">
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
					<div className="overflow-hidden rounded-lg shadow-lg glass">
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
				<div className="grid gap-6 mt-8 md:grid-cols-2">
					<div className="p-6 rounded-lg shadow-lg glass">
						<h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
							Component-Based Templates
						</h3>
						<div className="space-y-2">
							{componentTemplates.map((template) => (
								<div key={template.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
									<div>
										<div className="font-medium text-gray-900 dark:text-white">
											{template.name}
										</div>
										<div className="text-sm text-black/80 dark:text-white/80">
											{template.category}
										</div>
									</div>
									<button
										onClick={() => applyTemplate(template)}
										className="px-3 py-1 text-sm text-white bg-blue-500 rounded transition-colors hover:bg-blue-600"
									>
										Try
									</button>
								</div>
							))}
						</div>
					</div>

					<div className="p-6 rounded-lg shadow-lg glass">
						<h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
							Full Page Templates
						</h3>
						<div className="space-y-2">
							{fullPageTemplates.map((template) => (
								<div key={template.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
									<div>
										<div className="font-medium text-gray-900 dark:text-white">
											{template.name}
										</div>
										<div className="text-sm text-black/80 dark:text-white/80">
											{template.category}
										</div>
									</div>
									<button
										onClick={() => applyTemplate(template)}
										className="px-3 py-1 text-sm text-white bg-purple-500 rounded transition-colors hover:bg-purple-600"
									>
										Try
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
				
				{/* Coming Soon Section */}
				<div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
					<div className="text-center">
						<div className="flex justify-center mb-4">
							<span className="text-4xl">🚀</span>
						</div>
						<h3 className="mb-4 text-2xl font-bold text-blue-900 dark:text-blue-100">
							More Amazing Templates Coming Soon!
						</h3>
						<p className="mb-4 text-lg text-blue-700 dark:text-blue-200">
							We're working on beautiful templates with specific themes for different industries:
						</p>
						<div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
							{['Tech & Software', 'Design & Creative', 'Marketing & Sales', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'Consulting'].map((theme) => (
								<div key={theme} className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
									<span className="text-sm font-medium text-blue-800 dark:text-blue-200">{theme}</span>
								</div>
							))}
						</div>
						<div className="p-4 bg-white/30 dark:bg-gray-800/30 rounded-lg">
							<h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
								🤝 Help Us Improve!
							</h4>
							<p className="text-sm text-blue-700 dark:text-blue-200">
								Portifier is open-source! Contribute by reporting bugs, suggesting features, 
								creating templates, or contributing code on GitHub.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function TemplatesDemoPage() {
	return (
		<Suspense fallback={<SuspenseFallback message="Loading templates..." />}>
			<TemplatesDemoContent />
		</Suspense>
	);
} 