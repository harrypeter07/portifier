"use client";
import { useLayoutStore } from "@/store/layoutStore";
import { componentMap } from "@/data/componentMap";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Preview from "@/components/Preview";

export default function LivePreviewPage() {
	const { layout, content, portfolioData, parsedData, restoreFromParsed } = useLayoutStore();
	const router = useRouter();

	// Restore parsed data if content is empty
	useEffect(() => {
		if (Object.keys(content).length === 0 && parsedData) {
			restoreFromParsed();
		}
	}, [content, parsedData, restoreFromParsed]);

	function handleSave() {
		router.push("/editor/customize");
	}

	async function handlePublish() {
		try {
			console.log("🚀 [PREVIEW] Publishing portfolio...");
			
			// Get user info for the save request
			const userRes = await fetch("/api/auth/me");
			const userData = await userRes.json();
			
			if (!userRes.ok) {
				alert("Please sign in to publish your portfolio");
				return;
			}

			const res = await fetch("/api/portfolio/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					layout,
					content,
					portfolioData,
				}),
			});

			const data = await res.json();
			if (res.ok && data.success) {
				const portfolioUrl = data.portfolioUrl;
				console.log("🎉 [PREVIEW] Portfolio published successfully:", {
					username: data.username,
					portfolioUrl: portfolioUrl
				});
				
				// Show success message and redirect
				alert(`🎉 Congratulations! Your portfolio is now live at: ${portfolioUrl}`);
				router.push(portfolioUrl);
			} else {
				alert(data.error || "Failed to publish portfolio");
			}
		} catch (err) {
			console.error("❌ [PREVIEW] Error publishing portfolio:", err);
			alert("Failed to publish portfolio");
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			{/* Header */}
			<div className="bg-white dark:bg-gray-900 shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Preview</h1>
					<div className="flex gap-2 md:gap-4 w-full md:w-auto">
						<button onClick={handleSave} className="w-full md:w-auto px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Back to Edit</button>
						<button onClick={handlePublish} className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Publish Portfolio</button>
					</div>
				</div>
			</div>

			{/* Portfolio Preview */}
			<div className="max-w-4xl mx-auto p-4 md:p-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"
				>
					{/* Render each section based on layout */}
					{Object.entries(layout).map(([section, componentName]) => {
						const Component = componentMap[componentName];
						if (!Component) return null;

						// Use portfolioData for rendering components
						let componentProps = {};

						// For hero section, pass portfolioData.personal directly
						if (section === "hero") {
							componentProps = { data: portfolioData.personal };
						}

						// For about section
						if (section === "about") {
							componentProps = {
								summary: portfolioData.about?.summary || "",
								data: portfolioData,
							};
						}

						// For projects section, handle the new schema structure
						if (section === "projects") {
							componentProps = { 
								items: portfolioData.projects?.items || [],
								data: portfolioData,
							};
						}

						// For skills section, flatten the structure
						if (section === "skills") {
							componentProps = {
								technical: portfolioData.skills?.technical || [],
								soft: portfolioData.skills?.soft || [],
								languages: portfolioData.skills?.languages || [],
								data: portfolioData,
							};
						}

						// For achievements section, flatten the structure
						if (section === "achievements") {
							componentProps = {
								awards: portfolioData.achievements?.awards || [],
								certifications: portfolioData.achievements?.certifications || [],
								publications: portfolioData.achievements?.publications || [],
								data: portfolioData,
							};
						}

						// For experience section
						if (section === "experience") {
							componentProps = { 
								jobs: portfolioData.experience?.jobs || [],
								data: portfolioData,
							};
						}

						// For education section
						if (section === "education") {
							componentProps = { 
								degrees: portfolioData.education?.degrees || [],
								data: portfolioData,
							};
						}

						// For contact section
						if (section === "contact") {
							componentProps = {
								email: portfolioData.personal?.email || portfolioData.contact?.email || "",
								phone: portfolioData.personal?.phone || portfolioData.contact?.phone || "",
								linkedin: portfolioData.personal?.social?.linkedin || "",
								data: portfolioData,
							};
						}

						return (
							<motion.div
								key={section}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.1 }}
								className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
							>
								<Component {...componentProps} />
							</motion.div>
						);
					})}
				</motion.div>

				{/* Info Panel */}
				<div className="mt-8 bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-6">
					<h3 className="text-lg font-semibold mb-4">Portfolio Information</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div>
							<strong>Layout:</strong>
							<pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
								{JSON.stringify(layout, null, 2)}
							</pre>
						</div>
						<div>
							<strong>Portfolio Data Preview:</strong>
							<div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs max-h-40 overflow-y-auto">
								<div className="mb-2">
									<strong>Personal:</strong>
									<div className="text-gray-600 dark:text-gray-400">
										{JSON.stringify(portfolioData.personal, null, 2)}
									</div>
								</div>
								<div className="mb-2">
									<strong>About:</strong>
									<div className="text-gray-600 dark:text-gray-400">
										{JSON.stringify(portfolioData.about, null, 2)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
