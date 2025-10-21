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
		<div className="p-6 bg-white rounded-lg shadow-lg glass">
			<h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
				Choose Your Template
			</h2>

			{/* Template Type Selector */}
			<div className="mb-6">
				<div className="flex mb-4 space-x-4">
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
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{filteredTemplates.map((template) => (
					<motion.div
						key={template.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className={`relative  glass dark:bg-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
							currentTemplate?.id === template.id
								? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
								: "hover:bg-gray-100 dark:hover:bg-gray-600"
						}`}
						onClick={() => handleTemplateSelect(template)}
					>
						{/* Template Preview Placeholder */}
						<div className="flex justify-center items-center mb-4 w-full h-32 font-bold text-white bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg">
							{template.name}
						</div>
						
						{/* Template Info */}
						<div>
							<h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
								{template.name}
							</h3>
							<p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
								{template.description}
							</p>
							
							{/* Template Type Badge */}
							<div className="flex justify-between items-center">
								<span className={`px-2 py-1 rounded-full text-xs font-medium ${
									template.type === "component"
										? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
										: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
								}`}>
									{template.type === "component" ? "Component" : "Full Page"}
								</span>
								
								<span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-600 dark:text-gray-200">
									{template.category}
								</span>
							</div>
						</div>

						{/* Selected Indicator */}
						{currentTemplate?.id === template.id && (
							<div className="flex absolute top-2 right-2 justify-center items-center w-6 h-6 bg-blue-500 rounded-full">
								<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
								</svg>
							</div>
						)}
					</motion.div>
				))}
			</div>

			{/* Template Count */}
			<div className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
				Showing {filteredTemplates.length} {selectedType === "component" ? "component-based" : "full-page"} templates
				{selectedCategory !== "all" && ` for ${selectedCategory}`}
			</div>
			
			{/* Coming Soon Message */}
			<div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
				<div className="flex items-center gap-3">
					<span className="text-2xl">🚀</span>
					<div>
						<h3 className="font-semibold text-blue-900 dark:text-blue-100">
							More Amazing Templates Coming Soon!
						</h3>
						<p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
							We're working on beautiful templates with specific themes for different industries. 
							Help us improve by contributing to our open-source project!
						</p>
					</div>
				</div>
			</div>
		</div>
	);
} 