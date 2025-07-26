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

	function handlePublish() {
		// Save to database and redirect to final portfolio
		router.push("/dashboard");
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
					<Preview layout={layout} content={content} portfolioData={portfolioData} />
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
