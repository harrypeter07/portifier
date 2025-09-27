import { useState } from "react";
import { motion } from "framer-motion";
import { 
	getComponentTemplates, 
	getFullPageTemplates,
	getTemplatesByCategory 
} from "@/data/templates/templateManager";
import { useLayoutStore } from "@/store/layoutStore";

export default function TemplateSelector() {
	const [selectedType, setSelectedType] = useState("component"); // "component" or "full"
	const [selectedCategory, setSelectedCategory] = useState("all");
	
	const { currentTemplate, applyTemplate } = useLayoutStore();

	const componentTemplates = getComponentTemplates();
	const fullPageTemplates = getFullPageTemplates();
	
	const allTemplates = selectedType === "component" ? componentTemplates : fullPageTemplates;
	const filteredTemplates = selectedCategory === "all" 
		? allTemplates 
		: allTemplates.filter(template => template.category === selectedCategory);

	const categories = ["all", "developer", "designer", "marketing"];

	const handleTemplateSelect = (template) => {
		applyTemplate(template);
	};

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
			<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
				Choose Your Template
			</h2>

			{/* Template Type Selector */}
			<div className="mb-6">
				<div className="flex space-x-4 mb-4">
					<button
						onClick={() => setSelectedType("component")}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							selectedType === "component"
								? "bg-blue-500 text-white"
								: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
						}`}
					>
						Component-Based
					</button>
					<button
						onClick={() => setSelectedType("full")}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							selectedType === "full"
								? "bg-blue-500 text-white"
								: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
						}`}
					>
						Full Page Templates
					</button>
				</div>
				<p className="text-sm text-gray-600 dark:text-gray-400">
					{selectedType === "component" 
						? "Mix and match individual components to create your perfect portfolio"
						: "Complete portfolio pages with pre-designed layouts"
					}
				</p>
			</div>

			{/* Category Filter */}
			<div className="mb-6">
				<div className="flex flex-wrap gap-2">
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => setSelectedCategory(category)}
							className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
								selectedCategory === category
									? "bg-purple-500 text-white"
									: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
							}`}
						>
							{category.charAt(0).toUpperCase() + category.slice(1)}
						</button>
					))}
				</div>
			</div>

			{/* Template Grid */}
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredTemplates.map((template) => (
					<motion.div
						key={template.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className={`relative bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
							currentTemplate?.id === template.id
								? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
								: "hover:bg-gray-100 dark:hover:bg-gray-600"
						}`}
						onClick={() => handleTemplateSelect(template)}
					>
						{/* Template Preview Placeholder */}
						<div className="w-full h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center text-white font-bold">
							{template.name}
						</div>
						
						{/* Template Info */}
						<div>
							<h3 className="font-semibold text-gray-900 dark:text-white mb-2">
								{template.name}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
								{template.description}
							</p>
							
							{/* Template Type Badge */}
							<div className="flex items-center justify-between">
								<span className={`px-2 py-1 rounded-full text-xs font-medium ${
									template.type === "component"
										? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
										: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
								}`}>
									{template.type === "component" ? "Component" : "Full Page"}
								</span>
								
								<span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
									{template.category}
								</span>
							</div>
						</div>

						{/* Selected Indicator */}
						{currentTemplate?.id === template.id && (
							<div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
								<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
								</svg>
							</div>
						)}
					</motion.div>
				))}
			</div>

			{/* Template Count */}
			<div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
				Showing {filteredTemplates.length} {selectedType === "component" ? "component-based" : "full-page"} templates
				{selectedCategory !== "all" && ` for ${selectedCategory}`}
			</div>
		</div>
	);
} 