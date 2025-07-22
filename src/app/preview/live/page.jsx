"use client";
import { useLayoutStore } from "@/store/layoutStore";
import { componentMap } from "@/data/componentMap";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function LivePreviewPage() {
	const { layout, content, parsedData, restoreFromParsed } = useLayoutStore();
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

	function handlePublish() {
		// Save to database and redirect to final portfolio
		router.push("/dashboard");
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			{/* Header */}
			<div className="bg-white dark:bg-gray-900 shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Live Preview
					</h1>
					<div className="flex gap-4">
						<button
							onClick={handleSave}
							className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
						>
							Back to Edit
						</button>
						<button
							onClick={handlePublish}
							className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
						>
							Publish Portfolio
						</button>
					</div>
				</div>
			</div>

			{/* Portfolio Preview */}
			<div className="max-w-4xl mx-auto p-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"
				>
					{/* Render each section based on layout */}
					{Object.entries(layout).map(([section, componentName]) => {
						const Component = componentMap[componentName];
						if (!Component) return null;

						// Handle different data structures for different components
						let componentProps = content[section] || {};
						
						// For projects section, handle the new schema structure
						if (section === 'projects' && content[section]?.items) {
							componentProps = { items: content[section].items };
						}
						
						// For skills section, flatten the structure
						if (section === 'skills' && content[section]) {
							componentProps = {
								technical: content[section].technical || [],
								soft: content[section].soft || [],
								languages: content[section].languages || []
							};
						}
						
						// For achievements section, flatten the structure
						if (section === 'achievements' && content[section]) {
							componentProps = {
								awards: content[section].awards || [],
								certifications: content[section].certifications || [],
								publications: content[section].publications || []
							};
						}
						
						// For experience section, flatten the structure
						if (section === 'experience' && content[section]?.jobs) {
							componentProps = { jobs: content[section].jobs };
						}
						
						// For education section, flatten the structure
						if (section === 'education' && content[section]?.degrees) {
							componentProps = { degrees: content[section].degrees };
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
				<div className="mt-8 bg-white dark:bg-gray-900 rounded-lg shadow p-6">
					<h3 className="text-lg font-semibold mb-4">Portfolio Information</h3>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<strong>Layout:</strong>
							<pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
								{JSON.stringify(layout, null, 2)}
							</pre>
						</div>
						<div>
							<strong>Content Preview:</strong>
							<div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs max-h-40 overflow-y-auto">
								{Object.entries(content).map(([section, data]) => (
									<div key={section} className="mb-2">
										<strong className="capitalize">{section}:</strong>
										<div className="text-gray-600 dark:text-gray-400">
											{JSON.stringify(data, null, 2)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
